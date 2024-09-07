import pytest
from app import create_app
from app.models.ad import db, Ad
from app.models.user import User


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()
        create_test_data()

    yield app.test_client()

    with app.app_context():
        db.drop_all()


def create_test_data():
    user = User(email="test2@campus.unimib.it",
                password="Testpassword0!",
                first_name="Luca",
                last_name="Rossi",
                birth_year="2000-01-01",
                gender="Male",
                course_type="Triennale",
                subject_area="Sociologica",
                course_year="1")
    db.session.add(user)

    ads = [
        {
            "title": "Lezione di Matematica",
            "ad_type": "Ripetizioni",
            "date": "2025-04-28",
            "time": "15:00:00",
            "location": "U5",
            "max_members": 2,
            "rate": 15,
            "subject": "Analisi"
        },
        {
            "title": "Studio di gruppo di Fisica",
            "ad_type": "Gruppo studio",
            "date": "2025-04-28",
            "time": "15:00:00",
            "location": "U14",
            "max_members": 2,
            "rate": 15,
            "subject": "Analisi"
        },
        {
            "title": "Studio di gruppo di Italiano",
            "ad_type": "Gruppo studio",
            "date": "2025-04-28",
            "time": "15:00:00",
            "location": "U7",
            "max_members": 2,
            "rate": 15,
            "subject": "Italiano"
        },
        {
            "title": "Tutoraggio studenti",
            "ad_type": "Tutoraggio",
            "date": "2025-04-28",
            "time": "15:00:00",
            "location": "U6",
            "max_members": 2,
            "rate": 15,
            "subject": "Ascolto"
        }
    ]

    for ad_data in ads:
        ad = Ad(**ad_data, student_email="test2@campus.unimib.it")
        db.session.add(ad)

    db.session.commit()


def test_tutoring_announcements(client):
    response = client.get('/tutoring')
    assert response.status_code == 200
    data = response.get_json()

    # Verify ad types and required fields
    allowed_ad_types = ["Tutoraggio", "Ripetizioni"]
    required_fields = ['id', 'title', 'description',
                       'date', 'time', 'location',
                       'max_members', 'actual_members',
                       'rate', 'subject', 'ad_type', 'student_email']

    for ad in data:
        assert ad['ad_type'] in allowed_ad_types
        assert all(field in ad for field in required_fields)
