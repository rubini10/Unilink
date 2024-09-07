import pytest
from app import create_app
from app.models.user import db, User


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()

    yield app.test_client()

    with app.app_context():
        db.drop_all()


@pytest.fixture
def user_data():
    return {
        'email': 't.test@campus.unimib.test',
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


@pytest.fixture
def user_login():
    return {
        'email': 't.test@campus.unimib.test',
        'password': 'Testpassword0!',
    }


def test_signup(client, user_data):
    # Test adding a new user - signup -
    response = client.post('/signup', json=user_data)
    assert response.status_code == 201

    # Test addition of an existing user - signup -
    response = client.post('/signup', json=user_data)
    assert response.status_code == 409


def test_login(client, user_data, user_login):
    # First, sign up the user
    client.post('/signup', json=user_data)

    # Correct user login
    response = client.post('/login', json=user_login)
    assert response.status_code == 200

    # Logout test
    response = client.post('/logout')
    assert response.status_code == 200

    # Wrong password
    user_login_wrong_password = {
        'email': 't.test@campus.unimib.test',
        'password': 'testpassword0!',
    }
    response = client.post('/login', json=user_login_wrong_password)
    assert response.status_code == 401

    # Wrong email
    user_login_wrong_email = {
        'email': 't.ttest@campus.unimib.test',
        'password': 'Testpassword0!',
    }
    response = client.post('/login', json=user_login_wrong_email)
    assert response.status_code == 401


def test_user_exists(client, user_data):
    # First, sign up the user
    client.post('/signup', json=user_data)

    with client.application.app_context():
        user = User.query.filter_by(email=user_data['email']).first()
        assert user is not None


def test_user_cleanup(client, user_data):
    # First, sign up the user
    client.post('/signup', json=user_data)

    with client.application.app_context():
        user = User.query.filter_by(email=user_data['email']).first()
        db.session.delete(user)
        db.session.commit()

        user = User.query.filter_by(email=user_data['email']).first()
        assert user is None
