import pytest
from app import create_app
from app.models.ad import db, Ad, Enrollment, Notification # noqa
from app.models.user import User # noqa


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.app_context():
        db.create_all()
    yield app.test_client()
    with app.app_context():
        db.session.remove()
        db.drop_all()


def test_notification(client):
    # Setup initial users and ads
    users_data = [
        {
            'email': 't.test1.test',
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
            'email': 't.test2.test',
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
            'email': 't.test3.test',
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
        response = client.post('/signup', json=user_data)
        assert response.status_code == 201

    # Login user1
    user_login = {
        'email': 't.test1.test',
        'password': 'Testpassword0!',
    }
    response = client.post('/login', json=user_login)
    assert response.status_code == 200

    # Create a new ad from user 1
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
        "student_email": "t.test1.test"
    }

    ad_response = client.post("/new-ad", json=ad_data)
    assert ad_response.status_code == 201

    # Get the last ad
    with client.application.app_context():
        last_ad = Ad.query.order_by(Ad.id.desc()).first()
        ad_id = last_ad.id

        # Login user2
        user_login = {
            'email': 't.test2.test',
            'password': 'Testpassword0!',
        }
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # User 2 enrolls
        enrollment = {
            "ad_id": ad_id,
            "student_email": "t.test2.test"
        }
        enrollment_response = client.post("/enroll", json=enrollment)
        assert enrollment_response.status_code == 201

        # Login user3
        user_login = {
            'email': 't.test3.test',
            'password': 'Testpassword0!',
        }
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # Enrollment to waiting list
        enrollment = {
            "ad_id": ad_id,
            "student_email": "t.test3.test",
            "position": 1
        }
        enrollment_response = client.post("/waiting-list", json=enrollment)
        assert enrollment_response.status_code == 201

        # Login user2
        user_login = {
            'email': 't.test2.test',
            'password': 'Testpassword0!',
        }
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # User 2 unsubscribes
        unsubscribe = {
            "ad_id": ad_id
        }
        unsubscribe_response = client.post('/unsubscribe', json=unsubscribe)
        assert unsubscribe_response.status_code == 201

        # Login user1 to check if he receives the notification
        user_login = {
            'email': 't.test1.test',
            'password': 'Testpassword0!',
        }
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # Check notifications
        response = client.get('/notifications')
        assert response.status_code == 200

        # Verify notification for user1
        notifications = response.json
        assert len(notifications) > 0
        last_notification = notifications[0]
        assert not last_notification['is_read']

        # Mark the notification as read
        notification_id = last_notification['id']
        response = client.post(f'/notifications/mark-read/{notification_id}')
        assert response.status_code == 200

        # Check if the notification has been marked as read
        response = client.get('/notifications/unread-count')
        assert response.status_code == 200
        unread_count = response.json['unread_count']
        assert unread_count == 2

        # Login user3 to check if he receives the auto-enrollment notification
        user_login = {
            'email': 't.test3.test',
            'password': 'Testpassword0!',
        }
        response = client.post('/login', json=user_login)
        assert response.status_code == 200

        # Check notifications for user3
        response = client.get('/notifications')
        assert response.status_code == 200

        # Verify auto-enrollment notification for user3
        notifications = response.json
        auto_enrollment_notification = next(
            (n for n in notifications
             if n['notification_type'] == 'auto-enroll'),
            None
        )
        assert auto_enrollment_notification is not None

        # Delete the auto-enrollment notification
        notification_id = auto_enrollment_notification['id']
        response = client.delete(f'/notifications/{notification_id}')
        assert response.status_code == 200

        # Check if the notification has been deleted
        response = client.get('/notifications')
        assert response
