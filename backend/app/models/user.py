from app.models.base import db


class User(db.Model):
    """
    Model representing a user.

    +----------------+-----------------------------------------+--------+
    | Field Name     | Description                             | Type   |
    +================+=========================================+========+
    | email          | The email of the user, also serves as   | str    |
    |                | the primary key                         |        |
    +----------------+-----------------------------------------+--------+
    | first_name     | The first name of the user              | str    |
    +----------------+-----------------------------------------+--------+
    | last_name      | The last name of the user               | str    |
    +----------------+-----------------------------------------+--------+
    | phone_number   | The phone number of the user            | str    |
    +----------------+-----------------------------------------+--------+
    | birth_year     | The birth year of the user              | Date   |
    +----------------+-----------------------------------------+--------+
    | gender         | The gender of the user                  | str    |
    +----------------+-----------------------------------------+--------+
    | course_type    | The type of course the user is enrolled | str    |
    |                | in                                      |        |
    +----------------+-----------------------------------------+--------+
    | subject_area   | The subject area of the user's course   | str    |
    +----------------+-----------------------------------------+--------+
    | course_year    | The year of course the user is in       | int    |
    +----------------+-----------------------------------------+--------+
    | password       | The password of the user                | str    |
    +----------------+-----------------------------------------+--------+
    | description    | A brief description of the user         | str    |
    +----------------+-----------------------------------------+--------+
    """
    email = db.Column(db.String(45), primary_key=True)
    first_name = db.Column(db.String(45), nullable=False)
    last_name = db.Column(db.String(45), nullable=False)
    phone_number = db.Column(db.String(15))
    birth_year = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(30))
    course_type = db.Column(db.String(20), nullable=False)
    subject_area = db.Column(db.String(45), nullable=False)
    course_year = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(45), nullable=False)
    description = db.Column(db.String(200), nullable=True)
