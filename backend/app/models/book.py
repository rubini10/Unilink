from .base import db


class Book(db.Model):
    """
    Model representing a book.

    +--------------+----------------------------------+-------+
    | Field Name   | Description                      | Type  |
    +==============+==================================+=======+
    | id           | The unique identifier            | int   |
    |              | for the book                     |       |
    +--------------+----------------------------------+-------+
    | title        | The title of the book            | str   |
    +--------------+----------------------------------+-------+
    | subject      | The subject of the book          | str   |
    +--------------+----------------------------------+-------+
    | price        | The price of the book            | float |
    +--------------+----------------------------------+-------+
    | condition    | The condition of the book        | str   |
    +--------------+----------------------------------+-------+
    | student_email| The email of the student         | str   |
    |              | selling the book                 |       |
    +--------------+----------------------------------+-------+
    | state        | The state of the book            |       |
    |              |  (sold or for sale)              | str   |
    +--------------+----------------------------------+-------+
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(45), nullable=False)
    price = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    # field indicating the student who published the book
    student_email = db.Column(db.String(45),
                              db.ForeignKey('user.email'), nullable=False)
    student = db.relationship('User', backref=db.backref('books', lazy=True))
