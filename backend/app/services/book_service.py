from app.models.book import db, Book
from app.models.user import User
from app.models.ad import Notification, GenericNotification
from datetime import datetime, timezone


def create_book(data, user_email):
    """
    Function to create a new advertisement for selling a book based on the
      provided data and insert it into the database.

    Args:

    - **data** (dict): A dictionary containing the data for creating
      the book ad.

        - **title** (str): The title of the book.
        - **subject** (str): The subject of the book.
        - **price** (float): The price of the book.
        - **condition** (str): The condition of the book.

    - **user_email** (str): The email of the user creating the book ad.
    """
    title = data.get("title")
    subject = data.get("subject")
    price = data.get("price")
    condition = data.get("condition")

    new_book = Book(
        title=title,
        subject=subject,
        price=price,
        condition=condition,
        student_email=user_email,
        state="in vendita"
    )

    db.session.add(new_book)
    db.session.commit()


def get_bookShop(user_email):
    """
    Function to retrieve all  book shop announcements.

    Returns:
        list: A list of dictionaries containing information about the
          book shop announcements.
            Each dictionary includes the following keys:
                - **id** (int): The unique identifier of the announcement.
                - **title** (str): The title of the announcement.
                - **subject** (str): The subject of the announcement.
                - **price** (float): The price of the book.
                - **condition** (str): The condition of the book.
                - **student_email** (str): The email of the student who
                  published the announcement.
    """

    announcements = Book.query.filter_by(state="in vendita").all()
    announcements_list = []

    for announcement in announcements:
        notification_exists = Notification.query.filter_by(
            ad_id=announcement.id,
            author_email=user_email,
            notification_type='book'
        ).first() is not None

        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'subject': announcement.subject,
            'price': announcement.price,
            'condition': announcement.condition,
            'student_email': announcement.student_email,
            'notified_users': notification_exists
        }
        announcements_list.append(announcement_data)
    return announcements_list


def changeBookStatus(data):
    """
    Change the status of a book to sold.
    If a user had notified the author of the ad that he
     was interested in this book, a notification is created for
     the iterested user notifying him of the sale of the book
    """
    ad_id = data.get("ad_id")
    announcement = Book.query.filter_by(id=ad_id).first()
    notification_exists = Notification.query.filter_by(
            ad_id=announcement.id,
            student_email=announcement.student_email,
            notification_type='book'
        ).first()
    announcement.state = "venduto"

    current_time = datetime.now(timezone.utc)

    if notification_exists:
        message = (
            f"Ciao! ci dispiace ma il libro {announcement.title} "
            f"a cui eri interessato è stato venduto"
        )
        notification = Notification(
            ad_id=ad_id,
            reference_type="book",
            author_email=notification_exists.student_email,
            notification_type='book',
            student_email=notification_exists.author_email,
            message=message,
            date_created=current_time,
            is_read=False
        )
        db.session.add(notification)
        db.session.commit()

    db.session.commit()


def notification_book(data, user_email):
    """
    Create a notification related to a book when a user shows interest
     in it, this notification is sent to the author of the announcement.

    Args:
        data (dict): Data related to the notification, containing the book ID.
        user_email (str): Email of the logged in user.
    """
    logged_user = User.query.get(user_email)

    ad_id = data.get("ad_id")
    ad = Book.query.get(ad_id)
    current_time = datetime.now(timezone.utc)

    message = (
        f"Ciao! <b>{logged_user.first_name} {logged_user.last_name}</b> "
        f" ({user_email}) <br>, è interessato al tuo libro <b>{ad.title}</b>."
    )
    notification = Notification(
        ad_id=ad_id,
        reference_type="book",
        author_email=user_email,
        notification_type='book',
        student_email=ad.student_email,
        message=message,
        date_created=current_time,
        is_read=False
    )
    db.session.add(notification)
    db.session.commit()


def get_mypersonalBook(user_email, state):
    """
    Function to retrieveall  listings of books sold or for sale
      from the logged-in user.

    Returns:
        list: A list of dictionaries containing information about the book
          shop announcements.
            Each dictionary includes the following keys:
                - **id** (int): The unique identifier of the announcement.
                - **title** (str): The title of the announcement.
                - **subject** (str): The subject of the announcement.
                - **price** (float): The price of the book.
                - **condition** (str): The condition of the book.
                - **student_email** (str): The email of the student who
                  published the announcement.
    """
    user_email = [user_email]
    state = [state]
    announcements = Book.query.filter_by(student_email=user_email,
                                         state=state).all()

    announcements_list = []
    for announcement in announcements:
        announcement_data = {
            'id': announcement.id,
            'title': announcement.title,
            'subject': announcement.subject,
            'price': announcement.price,
            'condition': announcement.condition,
            'student_email': announcement.student_email,
        }
        announcements_list.append(announcement_data)

    return announcements_list


def delete_book_and_notify(book_id):
    book = Book.query.get(book_id)
    if not book:
        return False

    # Take all interested users
    interested_users = [
        notification.author_email
        for notification in Notification.query
        .filter_by(ad_id=book_id, reference_type='book').all()
    ]

    # Delete waiting list, enrollment and notification relationships
    Notification.query.filter_by(ad_id=book_id).delete()
    db.session.commit()

    book = Book.query.filter_by(id=book_id).first()
    student_email = book.student_email

    # create notification for subscribed to ad and to its waiting list
    current_time = datetime.now(timezone.utc)
    for user_email in interested_users:
        if user_email != student_email:
            notification = GenericNotification(
                student_email=user_email,
                message=(
                    f"Il libro '{book.title}' è stato eliminato dall'autore."
                ),
                notification_type='deleted-book',
                date_created=current_time
            )
            db.session.add(notification)
    db.session.commit()

    # delete ad
    db.session.delete(book)
    db.session.commit()

    return True
