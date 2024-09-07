import pytest
from app import create_app
from app.models.ad import db, Ad, Enrollment, Notification
from app.models.user import User


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
def signup_users(client):
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
        },
        {
            'email': 't.test3@campus.unimib.test',
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

    responses = []
    for user_data in users_data:
        response = client.post('/signup', json=user_data)
        responses.append(response)

    return responses


def test_enrollment(client, signup_users):
    # Check signup responses
    for response in signup_users:
        assert response.status_code == 201

    # Login user1
    user_login = {
        'email': 't.test1@campus.unimib.test',
        'password': 'Testpassword0!',
    }
    response = client.post('/login', json=user_login)
    assert response.status_code == 200

    # New ad from user 1
    ad_data = {
        "title": "Test Ad",
        "description": "This is a test ad",
        "max_members": 1,
        "time": "10:00:00",
        "location": "Test Location",
        "date": '2000-01-01T00:00:00.000Z',
        "subject": "Test Subject",
        "adType": "Ripetizioni",
        "rate": 10,
        "student_email": "t.test1@campus.unimib.test"
    }

    ad_response = client.post("/new-ad", json=ad_data)
    assert ad_response.status_code == 201

    # Check the last ad
    with client.application.app_context():
        last_ad = Ad.query.order_by(Ad.id.desc()).first()
        ad_id = last_ad.id

        # The author tries to subscribe to his own announcement
        enrollment_data = {"ad_id": ad_id,
                           "student_email": "t.test1@campus.unimib.test"}
        enrollment_response_error2 = client.post("/enroll",
                                                 json=enrollment_data)
        assert enrollment_response_error2.status_code == 403

        # Login user2
        user_login = {'email': 't.test2@campus.unimib.test',
                      'password': 'Testpassword0!'}
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # Enrollment
        enrollment_data = {"ad_id": ad_id,
                           "student_email": "t.test2@campus.unimib.test"}
        enrollment_response = client.post("/enroll", json=enrollment_data)
        assert enrollment_response.status_code == 201

        # Already enrolled
        enrollment_response_error = client.post("/enroll",
                                                json=enrollment_data)
        assert enrollment_response_error.status_code == 409

        # Login user 3
        user_login = {'email': 't.test3@campus.unimib.test',
                      'password': 'Testpassword0!'}
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # Enrollment in waiting list
        enrollment_data = {"ad_id": ad_id,
                           "student_email": "t.test3@campus.unimib.test",
                           "position": 1}
        enrollment_response = client.post("/waiting-list",
                                          json=enrollment_data)
        assert enrollment_response.status_code == 201

        # Login user 2
        user_login = {'email': 't.test2@campus.unimib.test',
                      'password': 'Testpassword0!'}
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # Unsubscribe
        unsubscribe_data = {"ad_id": ad_id}
        unsubscribe_response = client.post('/unsubscribe',
                                           json=unsubscribe_data)
        assert unsubscribe_response.status_code == 201

        # Check if enrollment exists
        enrollment = Enrollment.query \
            .filter_by(ad_id=ad_id,
                       student_email="t.test3@campus.unimib.test").first()
        assert enrollment

    # Clean up the database
    with client.application.app_context():
        db.session.query(Notification).delete()
        db.session.query(Enrollment).delete()
        db.session.query(Ad).delete()
        db.session.query(User).delete()
        db.session.commit()
