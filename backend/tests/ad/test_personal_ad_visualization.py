import pytest
from app import create_app
from app.models.user import db
from app.models.ad import Ad # noqa


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()

    yield app.test_client()

    with app.app_context():
        db.drop_all()


def create_ad(client, ad_data):
    response = client.post("/new-ad", json=ad_data)
    assert response.status_code == 201


def login(client, email, password):
    user_login = {
        'email': email,
        'password': password,
    }
    response = client.post('/login', json=user_login)
    assert response.status_code == 200


def test_personal_ad_visualization(client):
    # Signup user
    user_data = {
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
    response = client.post('/signup', json=user_data)
    assert response.status_code == 201

    # Login user
    login(client, 't.test@campus.unimib.test', 'Testpassword0!')

    # Create ads
    ads = [
        {
            "title": "Test Ad",
            "description": "This is a test ad",
            "max_members": 5,
            "time": "10:00:00",
            "location": "Test Location",
            "classroom": "Test",
            "date": '2000-01-01T00:00:00.000Z',
            "subject": "Test Subject",
            "adType": "Ripetizioni",
            "student_email": "t.test@campus.unimib.test"
        },
        {
            "title": "Test Ad",
            "description": "This is a test ad",
            "max_members": 5,
            "time": "10:00:00",
            "location": "Test Location",
            "classroom": "Test",
            "date": '2000-01-01T00:00:00.000Z',
            "subject": "Test Subject",
            "adType": "Tutoraggio",
            "student_email": "t.test@campus.unimib.test"
        },
        {
            "title": "Test Ad",
            "description": "This is a test ad",
            "max_members": 5,
            "time": "10:00:00",
            "location": "Test Location",
            "classroom": "Test",
            "date": '2000-01-01T00:00:00.000Z',
            "subject": "Test Subject",
            "adType": "Gruppo studio",
            "student_email": "t.test@campus.unimib.test"
        }
    ]

    for ad_data in ads:
        create_ad(client, ad_data)

    # Check personal ads
    response_ads = client.get('/personal-ads')
    assert response_ads.status_code == 200
    data = response_ads.get_json()

    # Verify ad types and required fields
    allowed_ad_types = ["Tutoraggio", "Ripetizioni", "Gruppo studio"]
    required_fields = ['id', 'title', 'description', 'date',
                       'time', 'location', 'max_members', 'actual_members',
                       'rate', 'subject', 'ad_type', 'student_email']

    for ad in data:
        assert ad['ad_type'] in allowed_ad_types
        assert all(field in ad for field in required_fields)
