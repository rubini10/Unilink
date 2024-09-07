from app.models.base import db
from datetime import datetime, timezone
from app.models.book import Book


class Ad(db.Model):
    """
    Model representing an advertisement.

    +----------------+-----------------------+-----------------------------+
    | Field Name     | Description           | Type                        |
    +================+=======================+=============================+
    | id             | The unique identifier | int                         |
    |                | for the advertisement |                             |
    +----------------+-----------------------+-----------------------------+
    | title          | The title of the      | str                         |
    |                | advertisement         |                             |
    +----------------+-----------------------+-----------------------------+
    | description    | The description of    | str                         |
    |                | the advertisement     |                             |
    +----------------+-----------------------+-----------------------------+
    | date           | The date of the       | Date                        |
    |                | meeting               |                             |
    +----------------+-----------------------+-----------------------------+
    | time           | The time of the       | Time                        |
    |                | meeting               |                             |
    +----------------+-----------------------+-----------------------------+
    | location       | The location of the   | str                         |
    |                | meeting               |                             |
    +----------------+-----------------------+-----------------------------+
    | classroom      | The classroom of the  | str                         |
    |                | meeting               | (max length: 5)             |
    +----------------+-----------------------+-----------------------------+
    | max_members    | The maximum number    | int                         |
    |                | of members allowed    |                             |
    |                | for the meeting       |                             |
    +----------------+-----------------------+-----------------------------+
    | actual_members | The actual number of  | int                         |
    |                | members currently     |                             |
    |                | joined in the         |                             |
    |                | advertisement         |                             |
    +----------------+-----------------------+-----------------------------+
    | rate           | The rate of the       | float                       |
    |                | advertisement         |                             |
    +----------------+-----------------------+-----------------------------+
    | subject        | The subject of the    | str                         |
    |                | advertisement         |                             |
    +----------------+-----------------------+-----------------------------+
    | ad_type        | The type of the       | str                         |
    |                | advertisement         |                             |
    +----------------+-----------------------+-----------------------------+
    | student_email  | The email of the      | str                         |
    |                | student who           |                             |
    |                | published the         |                             |
    |                | advertisement         |                             |
    +----------------+-----------------------+-----------------------------+

    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(500), nullable=False)
    classroom = db.Column(db.String(5))
    max_members = db.Column(db.Integer, nullable=False)
    actual_members = db.Column(db.Integer,
                               nullable=False,
                               default=0,
                               server_default="0")
    rate = db.Column(db.Float, nullable=True, default=-1, server_default="-1")
    subject = db.Column(db.String(45), nullable=False)
    ad_type = db.Column(db.String(30))
    # field indicating the student who published the announcement
    student_email = db.Column(db.String(45),
                              db.ForeignKey('user.email'),
                              nullable=False)
    student = db.relationship('User', backref=db.backref('ads', lazy=True))


# create the relationship of enrollment between User and Ad
class Enrollment(db.Model):
    """
    Model representing an enrollment relation between a user and
     an advertisement.


    +--------------+------------------------------------------+--------------+
    | Field Name   | Description                              | Type         |
    +==============+==========================================+==============+
    | ad_id        | The unique identifier of                 | int          |
    |              |                                          |(Foreign Key  |
    |              |                                          | referencing  |
    |              |                                          |    Ad)       |
    |              | the advertisement int (Foreign Key       |              |
    |              | referencing Ad) the user is enrolling in |              |
    |              |                                          |              |
    +--------------+------------------------------------------+--------------+
    | student_email| The email of the student enrolling in    | str          |
    |              | the advertisement.                       | (Foreign Key |
    |              |                                          |  referencing |
    |              |                                          |  User)       |
    +--------------+------------------------------------------+--------------+


    This model serves as the intermediate table in a many-to-many relationship
    between the Ad model and the User model. Each record in this table
    represents an enrollment, where a user (student) is linked to an
    advertisement. The `ad_id` and `student_email` fields serve as a
    composite primary key ensuring that the same user cannot enroll
    multiple times in the same advertisement.
    """
    ad_id = db.Column(db.Integer, db.ForeignKey('ad.id'), primary_key=True)
    student_email = db.Column(db.String(45),
                              db.ForeignKey('user.email'),
                              primary_key=True)

    ad = db.relationship('Ad',
                         backref=db.backref('enrolled_users', lazy=True))
    student = db.relationship('User',
                              backref=db.backref('enrollments', lazy=True))


# create the relationship of waitinglist between User and Ad
class WaitingList(db.Model):
    """
    Model representing a waiting list relation between a user
      and an advertisement.

    +--------------+----------------------------+----------------+
    | Field Name   | Description                | Type           |
    +==============+============================+================+
    | ad_id        | The unique identifier      | int            |
    |              | of the advertisement       |(Foreign Key    |
    |              | the user is on             | referencing Ad)|
    |              |  the waiting list for.     |                |
    +--------------+----------------------------+----------------+
    | student_email| The email of the           | str            |
    |              |   student on the waiting   | (Foreign Key   |
    |              |   list for the             | referencing    |
    |              |  advertisement.            | User)          |
    +--------------+----------------------------+----------------+
    | position     | The position of            | int            |
    |              |  the student in the        |                |
    |              | waiting list for the       |                |
    |              |  advertisement.            |                |
    +--------------+----------------------------+----------------+

    This model serves as the intermediate table in a many-to-many relationship
    between the Ad model and the User model for managing waiting lists.
    Each record in this table represents a user's position on the waiting
    list for a specific advertisement. The `ad_id` and `student_email`
    fields serve as a composite primary key ensuring that the same user
    cannot be on the waiting list multiple times for the same advertisement.
    """
    ad_id = db.Column(db.Integer, db.ForeignKey('ad.id'), primary_key=True)
    student_email = db.Column(db.String(45),
                              db.ForeignKey('user.email'),
                              primary_key=True)
    position = db.Column(db.Integer, nullable=False)

    ad = db.relationship('Ad',
                         backref=db.backref('waiting_users', lazy=True))
    student = db.relationship('User',
                              backref=db.backref('waiting', lazy=True))


class Notification(db.Model):
    """
    Model representing a notification related to an advertisement.

    +------------------+-------------------------------------------+---------+
    | Field Name       | Description                               | Type    |
    +==================+===========================================+=========+
    | id               | The unique identifier for the notification| int     |
    +------------------+-------------------------------------------+---------+
    | ad_id            | The ID of the advertisement related       | int     |
    |                  | to the notification                       |(Foreign |
    |                  |                                           |  Key    |
    |                  |                                           | refer.  |
    |                  |                                           | to  Ad) |
    +------------------+-------------------------------------------+---------+
    | author_email     | The email of the user who created the ad  | str     |
    |                  |                                           |(Foreign |
    |                  |                                           | Key     |
    |                  |                                           | refer.  |
    |                  |                                           | to User)|
    +------------------+-------------------------------------------+---------+
    | notification_type| The type of notification (e.g.,           | str     |
    |                  | 'unsubscribe', 'auto-enroll')             |         |
    +------------------+-------------------------------------------+---------+
    | student_email    | The email of the student involved in the  | str     |
    |                  | notification action                       |(Foreign |
    |                  |                                           | Key     |
    |                  |                                           | refer.  |
    |                  |                                           | to User)|
    +------------------+-------------------------------------------+---------+
    | date_created     | The date and time when the notification   | DateTime|
    |                  | was created                               |         |
    +------------------+-------------------------------------------+---------+
    | message          | A custom message which explains           | str     |
    |                  | the reason why user see the notification  |         |
    +------------------+-------------------------------------------+---------+
    | is_read          | A boolean variable that determines        | boolean |
    |                  | whether the notification is new or        |         |
    |                  | has already been read                     |         |
    +------------------+-------------------------------------------+---------+
    """
    id = db.Column(db.Integer, primary_key=True)
    ad_id = db.Column(db.Integer, nullable=False)
    reference_type = db.Column(db.String(10), nullable=False)
    author_email = db.Column(db.String(45),
                             db.ForeignKey('user.email'),
                             nullable=False)
    notification_type = db.Column(db.String(20), nullable=False)
    student_email = db.Column(db.String(45),
                              db.ForeignKey('user.email'),
                              nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    message = db.Column(db.String(300))
    is_read = db.Column(db.Boolean, default=False, nullable=False)

    # Relationships
    author = db.relationship('User',
                             foreign_keys=[author_email],
                             backref=db.backref('authored_notifications',
                                                lazy='dynamic'))
    student = db.relationship('User', foreign_keys=[student_email],
                              backref=db.backref('received_notifications',
                                                 lazy='dynamic'))

    @property
    def ad(self):
        if self.reference_type == 'ad':
            return Ad.query.get(self.ad_id)
        elif self.reference_type == 'book':
            return Book.query.get(self.ad_id)
        return None


class GenericNotification(db.Model):
    """
    Model representing a generic notification for events such as ad deletion.

    +------------------+-------------------------------------------+---------+
    | Field Name       | Description                               | Type    |
    +==================+===========================================+=========+
    | id               | The unique identifier for the notification| int     |
    +------------------+-------------------------------------------+---------+
    | student_email    | The email of the user receiving the       | str     |
    |                  | notification                              |         |
    |                  |                                           |(Foreign |
    |                  |                                           | Key     |
    |                  |                                           | refer.  |
    |                  |                                           | to User)|
    +------------------+-------------------------------------------+---------+
    | message          | A custom message explaining the reason    | str     |
    |                  | for the notification                      |         |
    +------------------+-------------------------------------------+---------+
    | is_read          | A boolean variable indicating whether     | boolean |
    |                  | the notification is read or not           |         |
    +------------------+-------------------------------------------+---------+
    | date_created     | The date and time when the notification   | DateTime|
    |                  | was created                               |         |
    +------------------+-------------------------------------------+---------+
    | notification_type| The type of notification (e.g.,           | str     |
    |                  | 'ad-delete')                              |         |
    +------------------+-------------------------------------------+---------+
    """
    id = db.Column(db.Integer, primary_key=True)
    student_email = db.Column(db.String(45), db.ForeignKey('user.email'),
                              nullable=False)
    message = db.Column(db.String(300))
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    notification_type = db.Column(db.String(20), nullable=False)
