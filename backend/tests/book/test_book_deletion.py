import pytest
from app import create_app
from app.models.book import db, Book
from app.models.user import User
from app.models.ad import Notification, GenericNotification


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()
    flask_app.config['TESTING'] = True

    with flask_app.app_context():
        db.create_all()
        try:
            yield flask_app.test_client()
        finally:
            db.session.remove()
            db.drop_all()


@pytest.fixture
def signup_users(test_client):
    users_data = [
        {
            'email': 't.test1@campus.unimib.it',
            'password': 'Testpassword1!',
            'confirmPassword': 'Testpassword1!',
            'firstName': 'Luca',
            'lastName': 'Rossi',
            'birthdate': '2000-01-01T00:00:00.000Z',
            'gender': 'Male',
            'courseType': 'Triennale',
            'subjectArea': 'Sociologica',
            'courseYear': '1'
        },
        {
            'email': 't.test2@campus.unimib.it',
            'password': 'Testpassword2!',
            'confirmPassword': 'Testpassword2!',
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
def new_book(test_client, signup_users):
    login_user(test_client,
               't.test1@campus.unimib.it',
               'Testpassword1!')
    book_data = {
        "ad_id": 1,
        "title": "Test Book",
        "subject": "Test Subject",
        "price": 10,
        "condition": "Book condition",
        "student_email": "t.test1@campus.unimib.test",
        "state": "in vendita"
    }
    response = test_client.post("/new-book", json=book_data)
    assert response.status_code == 201
    return book_data


def login_user(test_client, email, password):
    return test_client.post('/login', json={'email': email,
                                            'password': password})


def notify_interest_in_book(test_client, book_id):
    # Assuming the book notification uses the book_id
    data = {"ad_id": book_id}
    return test_client.post('/notificate-book', json=data)


def delete_book(test_client, book_id):
    return test_client.delete(f'/delete-book/{book_id}')


@pytest.mark.timeout(5)
def test_book_deletion_and_notification(test_client, new_book):
    # User 2 logs in and shows interest in the book
    login_user(test_client, 't.test2@campus.unimib.it', 'Testpassword2!')
    notify_interest_in_book(test_client, new_book['ad_id'])

    # User 1 logs back in and deletes the book
    login_user(test_client, 't.test1@campus.unimib.it', 'Testpassword1!')
    delete_book(test_client, new_book['ad_id'])

    # Verify User 2 receives the notification of deletion
    login_user(test_client, 't.test2@campus.unimib.it', 'Testpassword2!')
    response = test_client.get('/notifications')
    notifications = response.get_json()
    assert response.status_code == 200
    assert any(
        n['notification_type'] == 'deleted-book' for n in notifications
        ), "Notification of deleted book not received"

    # Cleanup
    with test_client.application.app_context():
        Notification.query.delete()
        GenericNotification.query.delete()
        Book.query.delete()
        User.query.delete()
        db.session.commit()
