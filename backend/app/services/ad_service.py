from app.models.ad import Ad, Notification, \
    GenericNotification, Enrollment, db, WaitingList
from app.models.user import User
from datetime import datetime, timezone, timedelta


def create_ad(data, user_email):
    """
    Function to create a new advertisement based on the provided
     data and insert it into the database.

    Args:

    - **data** (dict): A dictionary containing the data for creating
      the advertisement.

        - **title** (str): The title of the advertisement.
        - **description** (str): The description of the advertisement.
        - **max_members** (int): The maximum number of members allowed
          for the advertisement.
        - **time** (str): The time of the advertisement.
        - **location** (str): The location of the advertisement.
        - **date** (str): The date of the advertisement in
          ISO 8601 format ("%Y-%m-%dT%H:%M:%S.%fZ").
        - **subject** (str): The subject of the advertisement.
        - **adType** (str): The type of the advertisement
          (e.g., "Ripetizioni").
        - **rate** (float, optional): The rate for "Ripetizioni"
          type advertisements.
        - **classroom** (str): The classroom of the advertisement.

    - **user_email** (str): The email of the user creating the advertisement.
    """
    title = data.get("title")
    description = data.get("description")
    max_members = data.get("max_members")
    time = data.get("time")
    location = data.get("location")
    date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
    subject = data.get("subject")
    adType = data.get("adType")
    classroom = data.get("classroom")
    if adType == "Ripetizioni":
        rate = data.get("rate")

    if adType == "Ripetizioni":
        new_ad = Ad(
            title=title,
            description=description,
            max_members=max_members,
            time=time,
            location=location,
            date=date,
            subject=subject,
            rate=rate,
            ad_type=adType,
            student_email=user_email,
            classroom=classroom
        )
    else:
        new_ad = Ad(
            title=title,
            description=description,
            max_members=max_members,
            time=time,
            location=location,
            date=date,
            subject=subject,
            ad_type=adType,
            student_email=user_email,
            classroom=classroom
        )
    db.session.add(new_ad)
    db.session.commit()


def get_ad(allowed_types):
    """
    Function to retrieve tutoring announcements based on allowed types;
      returns only future announcements.

    Args:
        allowed_types (list): A list of allowed advertisement types.

    Returns:
        list: A list of dictionaries containing information about
          the tutoring announcements.
            Each dictionary includes the following keys:
                - **id** (int): The unique identifier of the announcement.
                - **title** (str): The title of the announcement.
                - **description** (str): The description of the
                  announcement.
                - **date** (str): The date of the announcement in
                  the format 'YYYY-MM-DD'.
                - **time** (str): The time of the announcement in
                  the format 'HH:MM:SS'.
                - **location** (str): The location of the announcement.
                - **classroom** (str): The classroom for the announcement.
                - **max_members** (int): The maximum number of members allowed
                  for the announcement.
                - **actual_members** (int): The actual number of members
                  currently joined in the announcement.
                - **rate** (float): The rate of the announcement.
                - **subject** (str): The subject of the announcement.
                - **ad_type** (str): The type of the announcement.
                - **student_email** (str): The email of the student who
                  published the announcement.
    """
    today = datetime.now(timezone.utc).date()
    announcements = Ad.query \
        .filter(Ad.ad_type.in_(allowed_types), Ad.date >= today).all()
    announcements_list = []

    for announcement in announcements:
        enrolled_users = [
            user.student_email for user in announcement.enrolled_users
        ]
        waiting_list_users = [
            user.student_email for user in announcement.waiting_users
        ]

        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'description': announcement.description,
            'date': announcement.date.strftime('%Y-%m-%d'),
            'time': announcement.time.strftime('%H:%M:%S'),
            'location': announcement.location,
            'classroom': announcement.classroom,
            'max_members': announcement.max_members,
            'actual_members': announcement.actual_members,
            'rate': announcement.rate,
            'subject': announcement.subject,
            'ad_type': announcement.ad_type,
            'student_email': announcement.student_email,
            'enrolled_users': enrolled_users,
            'waiting_list_users': waiting_list_users
        }
        announcements_list.append(announcement_data)

    return announcements_list


def create_enrollment(user_email, ad_id):
    """
    Function to create an enrollment for a user to an advertisement.

    This function handles the process of enrolling a user in an advertisement,
    ensuring that the user is not already enrolled and is not the creator
    of the ad.

    Args:
        user_email (str): The email address of the user trying to enroll.
        ad_id (int): The unique identifier of the advertisement the user
          wants to enroll in.

    Returns:
        int: HTTP status code representing the result of the
          enrollment operation.
            - 201: Successfully created the enrollment.
            - 409: Enrollment already exists.
            - 403: User trying to enroll is the creator of the ad.
    """
    ad = Ad.query.get(ad_id)
    # Verify if the user is yet enrolled to the ad
    enrollment = Enrollment.query.filter_by(ad_id=ad_id,
                                            student_email=user_email).first()
    if enrollment:
        return 409

    # Check if the logged user is the ad creator
    if ad.student_email == user_email:
        return 403

    return 201


def get_personalMeeting(student):
    """
    Retrieves personal meetings for a given student.

    Args:
        student (str): Email of the student.

    Returns:
        list: A list of dictionaries containing information
          about personal meetings.

    This function queries the database to retrieve personal meetings
     (enrollments) for the specified student. It filters the enrollments
     based on the student's email and retrieves corresponding
     announcements (ads) with dates on or after the current date.
     The retrieved announcements are then formatted into a list of
     dictionaries containing various details such as ID, title,
     description, date, time, location, maximum members, actual members,
    hourly rate, subject, ad type, and student's email.
    """
    today = datetime.now(timezone.utc).date()
    student = [student]
    enrollments = Enrollment.query \
        .filter(Enrollment.student_email.in_(student)).all()
    enrollment_ids = [enrollment.ad_id for enrollment in enrollments]
    announcements = Ad.query \
        .filter(Ad.id.in_(enrollment_ids), Ad.date >= today).all()

    announcements_list = []

    for announcement in announcements:
        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'description': announcement.description,
            'date': announcement.date.strftime('%Y-%m-%d'),
            'time': announcement.time.strftime('%H:%M:%S'),
            'location': announcement.location,
            'classroom': announcement.classroom,
            'max_members': announcement.max_members,
            'actual_members': announcement.actual_members,
            'rate': announcement.rate,
            'subject': announcement.subject,
            'ad_type': announcement.ad_type,
            'student_email': announcement.student_email,
        }
        announcements_list.append(announcement_data)
    return announcements_list


def find_enrollment(user_email, ad_id):
    """
    Finds an enrollment record based on the given student email and ad ID.

    This function queries the Enrollment table to find the specific enrollment
    that matches the provided student email and ad ID. If a matching
    enrollment is found, it returns the corresponding Enrollment object;
    otherwise, it returns None.

    Parameters:
    - user_email (str): The email of the student to find the enrollment for.
    - ad_id (int): The ID of the ad associated with the enrollment.

    Returns:
    - Enrollment: The enrollment object if found, otherwise None.
    """
    enrollment = Enrollment.query.filter_by(ad_id=ad_id,
                                            student_email=user_email).first()

    return enrollment


def create_waitingUser(user_email, ad_id):
    """
    Create a waiting list entry for a user for a specific ad.

    This function checks various conditions to ensure that the user
    can be added to the waiting list for the given ad. It returns
    appropriate status codes based on these conditions.

    Parameters:
    - user_email: The email of the user to be added to the waiting list.
    - ad_id: The unique identifier of the ad.

    Returns:
    - 409 if the user is already enrolled in the ad.
    - 403 if the user is the creator of the ad.
    - 404 if the user is already on the waiting list for the ad.
    - 201 if the user can be successfully added to the waiting list.
    """
    ad = Ad.query.get(ad_id)
    # Verify if the user is yet enrolled to the ad
    enrollment = Enrollment.query.filter_by(ad_id=ad_id,
                                            student_email=user_email).first()
    if enrollment:
        return 409

    # Check if the logged user is the ad creator
    if ad.student_email == user_email:
        return 403

    existing_entry = WaitingList.query \
        .filter_by(ad_id=ad_id, student_email=user_email).first()

    if existing_entry:
        return 404

    return 201


def get_notifications(user_email):
    """
    Retrieves notifications for a given user.

    Args:
        user_email (str): Email of the user.

    Returns:
        list: A list of dictionaries containing information about
         notifications.

    This function queries the database to retrieve notifications for
      the specified user.
    The notifications are returned in descending order by creation date
      to show the most recent first.
    """
    notifications = Notification.query \
        .filter_by(student_email=user_email) \
        .order_by(Notification.date_created.desc()) \
        .all()
    generic_notifications = GenericNotification.query \
        .filter_by(student_email=user_email) \
        .order_by(GenericNotification.date_created.desc()) \
        .all()

    notifications_list = [
        {
            'id': n.id,
            'notification_type': n.notification_type,
            'message': n.message,
            'date_created': n.date_created.strftime("%Y-%m-%d %H:%M:%S"),
            'is_read': n.is_read,
            'student_email': n.student_email
        }
        for n in notifications + generic_notifications
    ]

    return notifications_list


def get_my_ads(allowed_types, user_email):
    """
    Function to retrieve announcements posted by the logged-in user
     based on allowed types; returns only future announcements.

    Args:
        allowed_types (list): A list of allowed advertisement types.
        user_email (str): Email of the logged-in user.

    Returns:
        list: A list of dictionaries containing information
          about the user's announcements.
    """
    today = datetime.now(timezone.utc).date()
    announcements = Ad.query \
        .filter(Ad.ad_type.in_(allowed_types),
                Ad.date >= today,
                Ad.student_email == user_email).all()
    announcements_list = []

    for announcement in announcements:
        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'description': announcement.description,
            'date': announcement.date.strftime('%Y-%m-%d'),
            'time': announcement.time.strftime('%H:%M:%S'),
            'location': announcement.location,
            'classroom': announcement.classroom,
            'max_members': announcement.max_members,
            'actual_members': announcement.actual_members,
            'rate': announcement.rate,
            'subject': announcement.subject,
            'ad_type': announcement.ad_type,
            'student_email': announcement.student_email,
        }
        announcements_list.append(announcement_data)
    return announcements_list


def delete_ad_and_notify(ad_id):
    """
    Function to delete an advertisement and notify all related users.

    Args:
        ad_id (int): ID of the advertisement to be deleted.

    Returns:
        bool: True if the advertisement was successfully deleted and
         notifications were sent, False otherwise.

    This function performs the following operations:
    1. Retrieves the advertisement using the provided ad_id.
      Returns False if not found.
    2. Gathers the email addresses of enrolled
      users and those on the waiting list.
    3. Deletes relationships in WaitingList, Enrollment,
      and Notification tables related to the ad.
    4. Creates a notification for each user informing
      them that the ad was deleted.
    5. Deletes the advertisement from the database and commits all changes.

    Notification Details:
        - Message: "L'annuncio '{ad.title}' è stato eliminato dall'autore."
        - Notification Type: 'deleted-ad'
        - Date Created: Current UTC datetime

    The notifications are created for each user who was either enrolled
      in the ad or on its waiting list.
    """
    ad = Ad.query.get(ad_id)
    if not ad:
        return False

    # Take all those subscribed to the ad in question
    # to all those subscribed to its waiting list
    enrolled_users = [
        enrollment.student_email
        for enrollment in ad.enrolled_users]
    waiting_users = [
        waiting.student_email
        for waiting in ad.waiting_users]

    # Delete waiting list, enrollment and notification relationships
    WaitingList.query.filter_by(ad_id=ad_id).delete()
    Enrollment.query.filter_by(ad_id=ad_id).delete()
    Notification.query.filter_by(ad_id=ad_id).delete()
    db.session.commit()

    # create notification for subscribed to ad and to its waiting list
    current_time = datetime.now(timezone.utc)
    for user_email in enrolled_users + waiting_users:
        notification = GenericNotification(
            student_email=user_email,
            message=f"L'annuncio '{ad.title}' è stato eliminato dall'autore.",
            notification_type='deleted-ad',
            date_created=current_time
        )
        db.session.add(notification)
    db.session.commit()

    # delete ad
    db.session.delete(ad)
    db.session.commit()
    return True


def get_my_waitingList(student):
    """
    Function to retrieve ads to which the logged-in user
      is on the waiting list; returns only future announcements.

    Args:
        student (str): Email of the student.

    Returns:
        list: A list of dictionaries containing information about
          personal waitign list.

    This function queries the database to retrieve ads to which the logged-in
    user is on the waiting list. It filters the waitingList based on the
    student's email and retrieves corresponding announcements (ads)
    with dates on or after the current date. The retrieved announcements
    are then formatted into a list of dictionaries containing
    various details such as ID, title, description, date, time, location,
    maximum members, actual members, hourly rate, subject, ad type,
    and student's email.
    """

    today = datetime.now(timezone.utc).date()
    student = [student]
    waitingList = WaitingList.query \
        .filter(WaitingList.student_email.in_(student)).all()
    waiting_ids = [waiting.ad_id for waiting in waitingList]
    announcements = Ad.query \
        .filter(Ad.id.in_(waiting_ids), Ad.date >= today).all()

    announcements_list = []
    for announcement in announcements:
        waiting_entry = next(
            (entry for entry in waitingList if entry.ad_id == announcement.id),
            None)

        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'description': announcement.description,
            'date': announcement.date.strftime('%Y-%m-%d'),
            'time': announcement.time.strftime('%H:%M:%S'),
            'location': announcement.location,
            'classroom': announcement.classroom,
            'max_members': announcement.max_members,
            'actual_members': announcement.actual_members,
            'rate': announcement.rate,
            'subject': announcement.subject,
            'ad_type': announcement.ad_type,
            'position': waiting_entry.position,
            'student_email': announcement.student_email,
        }
        announcements_list.append(announcement_data)
    return announcements_list


def enrollStudent(data, user_email):
    """
    Handle the enrollment of a user in an advertisement.

    This function processes the enrollment of a user (identified
    by their email) in a specified advertisement.
    It checks various conditions to ensure that the enrollment is
    valid and updates the database accordingly.

    Parameters:
        data (dict): The JSON payload from the request,
          expected to contain the advertisement ID.
        user_email (str): The email of the user attempting to enroll.

    Returns:
        int: An HTTP status code indicating the result of the
          enrollment process.
            - 409 if the user is already enrolled.
            - 403 if the user is the creator of the advertisement.
            - 201 if the enrollment is successful.
    """
    logged_user = User.query.get(user_email)
    ad_id = data.get("ad_id")
    ad = Ad.query.get(ad_id)
    enrollment = create_enrollment(user_email, ad_id)

    if enrollment == 409:
        return 409
    if enrollment == 403:
        return 403
    else:
        ad.actual_members += 1
        new_enrollment = Enrollment(ad_id=ad_id, student_email=user_email)
        db.session.add(new_enrollment)

        message = (
            f"Ciao! <b>{logged_user.first_name}</b> "
            f"<b>{logged_user.last_name}</b> ({user_email}) "
            f"si è iscritto al tuo annuncio <b>{ad.title}</b>."
        )
        notification = Notification(
            ad_id=ad_id,
            author_email=user_email,
            reference_type="ad",
            notification_type='new-subscription',
            student_email=ad.student_email,
            message=message,
            date_created=datetime.now(timezone.utc)
        )
        db.session.add(notification)

        db.session.commit()

        return 201


def unsubscribeStudent(ad_id, user_email):
    """
    Handle the unsubscription of a user from a specific advertisement.

    This function processes the unsubscription of a user (identified by their
    email) from a specified advertisement.
    It updates the advertisement's member count, removes the user's enrollment
    record, and handles the waiting list if there are users waiting for a
    spot. Notifications are sent to relevant parties about the changes.

    Parameters:
        data (dict): The JSON payload from the request, expected to
          contain the advertisement ID.
        user_email (str): The email of the user attempting to unsubscribe.


    Notifications:
        - The ad author is notified about the user's unsubscription.
        - If a waiting list user is enrolled, they are notified
          about their new enrollment.
        - The ad author is also notified about the new enrollment
          from the waiting list.
    """
    logged_user = User.query.get(user_email)
    ad = Ad.query.get(ad_id)
    ad.actual_members -= 1

    enrollment = find_enrollment(user_email, ad_id)

    if enrollment:
        current_time = datetime.now(timezone.utc)

        message = (
            f"Ciao! Purtroppo <b>{logged_user.first_name}</b> "
            f"<b>{logged_user.last_name}</b> ({user_email}) <br>"
            f"non potrà più partecipare al tuo annuncio <b>{ad.title}</b>."
        )
        notification = Notification(
            ad_id=ad_id,
            author_email=user_email,
            reference_type="ad",
            notification_type='unsubscribe',
            student_email=ad.student_email,
            message=message,
            date_created=current_time
        )
        db.session.add(notification)

        db.session.delete(enrollment)
        db.session.commit()

        # Check if there's someone on the waiting list for the same ad
        waiting_person = WaitingList.query.filter_by(ad_id=ad_id,
                                                     position=1).first()
        if waiting_person:
            # Enroll the first person in the waiting list to the ad
            ad.actual_members += 1
            new_enrollment = Enrollment(
                ad_id=ad_id,
                student_email=waiting_person.student_email
            )
            db.session.add(new_enrollment)
            db.session.commit()
            author_user = User.query.get(ad.student.email)
            message = (
                f"Ciao, buone notizie!<br>"
                f"Si è liberato un posto, quindi ora risulti "
                f"iscritto all'annuncio <b>{ad.title}</b> <br>"
                f"pubblicato da <b>{author_user.first_name}</b> "
                f"<b>{author_user.last_name}</b> ({ad.student.email})!<br>"
                f"Controlla le tue prenotazioni per gestire i tuoi incontri."
            )

            notification_auto_enroll = Notification(
                ad_id=ad_id,
                reference_type="ad",
                author_email=waiting_person.student_email,
                notification_type='auto-enroll',
                student_email=waiting_person.student_email,
                message=message,
                date_created=current_time + timedelta(seconds=0.5)
            )
            db.session.add(notification_auto_enroll)

            waiting_user = User.query.get(waiting_person.student_email)
            # Notify the ad author about the new subscription
            message_author = (
                f"Ciao! <b>{waiting_user.first_name}</b> "
                f"<b>{waiting_user.last_name}</b> "
                f"({waiting_person.student_email})<br>"
                f"si è iscritto al tuo annuncio <b>{ad.title}</b>.")
            notification_author = Notification(
                ad_id=ad_id,
                reference_type="ad",
                author_email=waiting_person.student_email,
                notification_type='new-subscription',
                student_email=ad.student_email,
                message=message_author,
                date_created=current_time + timedelta(seconds=1)
            )
            db.session.add(notification_author)
            db.session.commit()

            # Remove the person from the waiting list
            db.session.delete(waiting_person)
            db.session.commit()
            # Update positions for others on the waiting list for the same ad
            waiting_list = WaitingList.query \
                .filter_by(ad_id=ad_id) \
                .order_by(WaitingList.position).all()
            for index, waiting_user in enumerate(waiting_list, start=1):
                waiting_user.position = index
            db.session.commit()


def unsubscribeStudentWaitinglist(ad_id, user_email):
    """
    Handle the unsubscription of a user from a specific advertisement.

    This function processes the unsubscription of a user (identified by their
     email) from a specified waiting list advertisement.

    Parameters:
        data (dict): The JSON payload from the request, expected to contain
          the advertisement ID.
        user_email (str): The email of the user attempting to unsubscribe.
    """
    logged_user = User.query.get(user_email) # noqa
    ad = Ad.query.get(ad_id) # noqa

    waiting_subscribed = WaitingList.query \
        .filter_by(ad_id=ad_id,
                   student_email=user_email).first()

    db.session.delete(waiting_subscribed)
    db.session.commit()

    # Update positions for others on the waiting list for the same ad
    waiting_list = WaitingList.query \
        .filter_by(ad_id=ad_id).order_by(WaitingList.position).all()

    for index, waiting_user in enumerate(waiting_list, start=1):
        waiting_user.position = index
    db.session.commit()
