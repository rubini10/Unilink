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


@pytest.fixture(scope='module')
def setup_database():
    with create_app().app_context():
        # Add a user to create ads
        user1 = User(
            email="test@campus.unimib.it",
            password="Testpassword0!",
            first_name="Luca",
            last_name="Rossi",
            birth_year="2000-01-01",
            gender="Male",
            course_type="Triennale",
            subject_area="Sociologica",
            course_year="1"
        )
        db.session.add(user1)
        db.session.commit()  # Commit user to the db before adding ads

        # Add some ads
        ads = [
            Ad(title="Lezione di Matematica", ad_type="Ripetizioni",
               student_email=user1.email, date="2024-12-28", time="15:00:00",
               location="U5", max_members="2", rate="15",
               subject="Analisi", classroom="21"),
            Ad(title="Studio di gruppo di Fisica", ad_type="Gruppo studio",
               student_email=user1.email, date="2024-12-28", time="15:00:00",
               location="U14", max_members="2", rate="15",
               subject="Analisi", classroom="21"),
            Ad(title="Studio di gruppo di Italiano", ad_type="Gruppo studio",
               student_email=user1.email, date="2024-12-28", time="15:00:00",
               location="U7", max_members="2", rate="15",
               subject="Italiano", classroom="21"),
            Ad(title="Tutoraggio studenti", ad_type="Tutoraggio",
               student_email=user1.email, date="2024-12-28", time="15:00:00",
               location="U6", max_members="2", rate="15",
               subject="Ascolto", classroom="21")
        ]

        db.session.bulk_save_objects(ads)
        db.session.commit()

        yield

        db.drop_all()


def test_study_group_announcements(test_client, setup_database):
    response = test_client.get('/study-group')
    assert response.status_code == 200

    data = response.get_json()

    # Ensure only "Gruppo studio" ads are visualized
    assert all(
        ad['ad_type'] == "Gruppo studio" for ad in data
        ), "Unexpected ad_type found"

    # Ensure all required fields are present in each advertisement
    required_fields = ['id', 'title', 'description',
                       'date', 'time', 'location', 'max_members',
                       'actual_members', 'rate', 'subject',
                       'ad_type', 'student_email']
    assert all(
        all(field in ad for field in required_fields) for ad in data
        ), "Some fields are missing in the response data"

    # Additional assertion to verify number of "Gruppo studio" ads if needed
    expected_ads_count = 2  # Update this count based on the actual number
    assert len(data) == expected_ads_count, \
        f"Expected {expected_ads_count} ads, got {len(data)}"
