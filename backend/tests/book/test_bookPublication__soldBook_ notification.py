import pytest
from app import create_app
from app.models.book import db, Book
from app.models.user import User


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()
    flask_app.config['TESTING'] = True

    with flask_app.app_context():
        db.create_all()
        yield flask_app.test_client()
        db.drop_all()


@pytest.fixture
def signup_users(test_client):
    users_data = [
        {
            'email': 't.test1@campus.unimib.test',
            'password': 'Testpassword0!',
            'confirmPassword': 'Testpassword0!',
            'firstName': 'Luca',
            'lastName': 'Rossi',
            'birthdate': '2000-01-01T00:00:00.000Z',
            'gender': 'Male',
            'courseType': 'Triennale',
            'subjectArea': 'Sociologica',
            'courseYear': '1'
        },
        {
            'email': 't.test2@campus.unimib.test',
            'password': 'Testpassword0!',
            'confirmPassword': 'Testpassword0!',
            'firstName': 'Luca',
            'lastName': 'Rossi',
            'birthdate': '2000-01-01T00:00:00.000Z',
            'gender': 'Male',
            'courseType': 'Triennale',
            'subjectArea': 'Sociologica',
            'courseYear': '1'
        }
    ]

    for user_data in users_data:
        response = test_client.post('/signup', json=user_data)
        assert response.status_code == 201


@pytest.fixture
def new_book():
    return {
        "ad_id": 1,
        "title": "Test Book",
        "subject": "Test Subject",
        "price": 10,
        "condition": "Book condition",
        "student_email": "t.test1@campus.unimib.test",
        "state": "in vendita"
    }


def login_user(test_client, email, password):
    response = test_client.post('/login',
                                json={'email': email, 'password': password})
    assert response.status_code == 200, \
        f"Expected 200, got {response.status_code}"


def notify_book(test_client, book_data):
    response = test_client.post('/notificate-book', json=book_data)
    assert response.status_code == 200, \
        f"Expected 200, got {response.status_code}"


def check_and_delete_notifications(test_client):
    response = test_client.get('/notifications')
    assert response.status_code == 200

    notifications = response.json
    book_notification = next(
        (n for n in notifications
         if n['notification_type'] == 'book'),
        None
    )
    assert book_notification is not None, "Book notification should exist"

    notification_id = book_notification['id']
    response = test_client.delete(f'/notifications/{notification_id}')
    assert response.status_code == 200


def test_publicationBook(test_client, new_book, signup_users):
    # Login user1 and create a new book
    login_user(test_client, 't.test1@campus.unimib.test', 'Testpassword0!')
    response = test_client.post("/new-book", json=new_book)
    assert response.status_code == 201, \
        f"Expected 201, got {response.status_code}"

    # Login user2 and notify about the book
    login_user(test_client, 't.test2@campus.unimib.test', 'Testpassword0!')
    notify_book(test_client, new_book)

    # Login user1
    login_user(test_client, 't.test1@campus.unimib.test', 'Testpassword0!')

    # Change the status of the book to "sold"
    response = test_client.post('/sold-book', json=new_book)
    assert response.status_code == 200

    # Check notifications for user1
    check_and_delete_notifications(test_client)

    # Check notifications for user2
    login_user(test_client, 't.test2@campus.unimib.test', 'Testpassword0!')
    check_and_delete_notifications(test_client)

    with test_client.application.app_context():
        # Verify the book was created
        book = Book.query.filter_by(title="Test Book").first()
        assert book is not None, "Book should be created"

        # Cleanup the created book
        db.session.delete(book)
        db.session.commit()

        # Verify the users were created
        user1 = User.query \
            .filter_by(email='t.test1@campus.unimib.test').first()
        user2 = User.query \
            .filter_by(email='t.test2@campus.unimib.test').first()
        assert user1 is not None and user2 is not None, \
            "Users should be created"

        # Cleanup the created users
        db.session.delete(user1)
        db.session.delete(user2)
        db.session.commit()

        # Verify the cleanup
        user1_deleted = User.query \
            .filter_by(email='t.test1@campus.unimib.test').first() is None
        user2_deleted = User.query \
            .filter_by(email='t.test2@campus.unimib.test').first() is None
        book_deleted = Book.query \
            .filter_by(title="Test Book").first() is None
        assert user1_deleted and user2_deleted and book_deleted, \
            "Users and book should be deleted from the database"
