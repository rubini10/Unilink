import pytest
from app import create_app
from app.models.ad import db, Ad
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
def new_user():
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


@pytest.fixture
def new_ad():
    return {
        "title": "Test Ad",
        "description": "This is a test ad",
        "max_members": 5,
        "time": "10:00:00",
        "location": "Test Location",
        "classroom": "Test",
        "date": '2000-01-01T00:00:00.000Z',
        "subject": "Test Subject",
        "adType": "Ripetizioni",
        "rate": 10,
        "student_email": "t.test@campus.unimib.test"
    }


def test_publication_ad(test_client, new_user, user_login, new_ad):

    # Signup
    response = test_client.post('/signup', json=new_user)
    assert response.status_code == 201, f"Got {response.status_code}"

    # Login test
    response = test_client.post('/login', json=user_login)
    assert response.status_code == 200, f"Got {response.status_code}"

    # New ad test
    response = test_client.post("new-ad", json=new_ad)
    assert response.status_code == 201, f"Got {response.status_code}"

    with test_client.application.app_context():
        # Verify the ad was created
        ad = Ad.query.filter_by(title="Test Ad").first()
        assert ad is not None, "Ad should be created"

        # Cleanup the created book
        db.session.delete(ad)
        db.session.commit()

        # Verify the user was created
        user = User.query \
            .filter_by(email='t.test@campus.unimib.test').first()
        assert user is not None, "User should be created"

        # Cleanup the created user
        db.session.delete(user)
        db.session.commit()

        # Verify the cleanup
        user_deleted = User.query  \
            .filter_by(email='t.test@campus.unimib.test').first() is None
        ad_deleted = Ad.query \
            .filter_by(title="Test Ad").first() is None
        assert user_deleted and ad_deleted
