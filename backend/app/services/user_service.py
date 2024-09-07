from app.models.user import db, User
from app.models.ad import Ad, Enrollment, Notification, \
    GenericNotification, WaitingList
from app.models.book import Book
from app.services.ad_service import delete_ad_and_notify, \
    unsubscribeStudentWaitinglist, unsubscribeStudent
from app.services.book_service import delete_book_and_notify
from flask import session
from datetime import datetime, timezone


def create_user(data):
    """
    Function to create a new user based on the provided data and
      insert it into the database.

    Args:

    - **data** (dict): A dictionary containing the data for creating the user.
        - **email** (str): The email of the user.
        - **firstName** (str): The first name of the user.
        - **lastName** (str): The last name of the user.
        - **password** (str): The password of the user.
        - **phoneNumber** (str): The phone number of the user.
        - **birthdate** (str): The birth date of the user in ISO 8601
          format ("%Y-%m-%dT%H:%M:%S.%fZ").
        - **gender** (str): The gender of the user.
        - **courseType** (str): The type of course the user is enrolled in.
        - **subjectArea** (str): The subject area of the user's course.
        - **courseYear** (int): The year of course the user is in.
        - **description** (str): The description of the user.
    """
    email = data.get("email")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    password = data.get("password")
    phone_number = data.get("phoneNumber")
    birth_year = datetime.strptime(data['birthdate'],
                                   '%Y-%m-%dT%H:%M:%S.%fZ').date()
    gender = data.get("gender")
    course_type = data.get("courseType")
    subject_area = data.get("subjectArea")
    course_year = data.get("courseYear")
    description = data.get("description")

    new_user = User(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        birth_year=birth_year,
        gender=gender,
        course_type=course_type,
        subject_area=subject_area,
        course_year=course_year,
        description=description
    )

    db.session.add(new_user)
    db.session.commit()


def authenticate_user(email, password):
    """
    Function to authenticate a user based on email and password.

    Args:
        email (str): The email of the user.
        password (str): The password of the user.

    Returns:
        *bool*: True if authentication is successful, False otherwise.
    """
    user = User.query.filter_by(email=email).first()
    if user and user.password == password:
        return True
    return False


def extract_user(user_email):
    """
    Function to extract a user's profile data from the database
     based on the user's email.

    This function queries the database for a user with the specified email.
     If the user is found, it constructs a dictionary containing key profile
     details. If no user is found, it sets the profile data to 404,
    indicating that the user could not be located.

    Args:
        user_email (str): The email address of the user whose
          profile is to be retrieved.

    Returns:
        dict or int: A dictionary containing the user's profile data
        if the user is found. If the user is not found, it returns 404
        to indicate that no profile could be retrieved. The profile
        data dictionary includes:
            - **email**: Email address of the user.
            - **first_name**: First name of the user.
            - **last_name**: Last name of the user.
            - **password**: Password of the user (note: handling or
              returning passwords in this manner is insecure).
            - **phone_number**: Phone number of the user.
            - **birth_year**: Birth year of the user.
            - **gender**: Gender of the user.
            - **course_type**: Type of course the user is enrolled in.
            - **subject_area**: Subject area of the user's course.
            - **course_year**: Current year of the user in the course.
            - **description**: A description or additional information
              about the user.
    """
    user = User.query.filter_by(email=user_email).first()
    if not user:
        profile_data = 404

    profile_data = {
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "password": user.password,
        "phone_number": user.phone_number,
        "birth_year": user.birth_year,
        "gender": user.gender,
        "course_type": user.course_type,
        "subject_area": user.subject_area,
        "course_year": user.course_year,
        "description": user.description
    }
    return profile_data


def delete_user(user_email):
    """
    Delete user and associated data.

    Deletes the user and all associated data including books, ads,
      notifications, and waiting list entries.
    Notifies other users about unsubscriptions and deletions.
    Removes the user from the session upon successful deletion.

    Args:
        user_email (str): Email of the user to be deleted.

    Returns:
        int: HTTP status code indicating the success or failure of
          the deletion operation.
            200 if successful, 404 if user not found.
    """

    # Retrieve and delete all books associated with the user
    books = Book.query.filter_by(student_email=user_email).all()
    for book in books:
        delete_book_and_notify(book.id)
    db.session.commit()

    # Call delete-ad route for each ad associated with the user
    ads = Ad.query.filter_by(student_email=user_email).all()
    for ad in ads:
        delete_ad_and_notify(ad.id)
    db.session.commit()

    # Unsubscribing from all ad's to which the user is subscribed
    ad_ids = [enrollment.ad_id for enrollment in Enrollment.query
              .filter_by(student_email=user_email).all()]
    for ad_id in ad_ids:
        unsubscribeStudent(ad_id, user_email)
    # Notify the author of ad
    ads = Ad.query.filter(Ad.id.in_(ad_ids)).all()
    student_emails_and_titles = [(ad.student_email, ad.title) for ad in ads]
    current_time = datetime.now(timezone.utc)
    for email, title in student_emails_and_titles:
        notification = GenericNotification(
            student_email=email,
            message=f"Un utente si è disiscritto dal tuo annuncio '{title}'.",
            notification_type='deleted-ad',
            date_created=current_time
        )
        db.session.add(notification)
    db.session.commit()

    # Unsubscribing from all ad's to which
    # the user is subscribed to waiting list
    ad_ids = [
        waiting.ad_id
        for waiting in WaitingList.query.
        filter_by(student_email=user_email).all()
    ]
    for ad_id in ad_ids:
        unsubscribeStudentWaitinglist(ad_id, user_email)

    # Delete all notifications
    notifications_to_delete = GenericNotification.query \
        .filter_by(student_email=user_email).all()
    for notification in notifications_to_delete:
        db.session.delete(notification)

    notifications_to_delete = Notification.query \
        .filter_by(student_email=user_email).all()
    for notification in notifications_to_delete:
        db.session.delete(notification)

    notifications_to_delete = Notification.query \
        .filter_by(author_email=user_email).all()
    for notification in notifications_to_delete:
        db.session.delete(notification)

    db.session.commit()

    # Delete user
    user = User.query.filter_by(email=user_email).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        session.pop('user_email', None)
        return 200
    else:
        return 404
