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


@pytest.fixture(scope='module')
def setup_database():
    with create_app().app_context():
        # Add a user to create ads
        user1 = User(
            email="test2@campus.unimib.it",
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
        db.session.commit()  # Commit the user to db

        # Add some book ads
        ads = [
            Book(title="Libro 1", subject="Analisi",
                 price="15", condition="Nuovo",
                 student_email=user1.email, state="in vendita"),
            Book(title="Libro 2", subject="Analisi",
                 price="15", condition="Nuovo",
                 student_email=user1.email, state="in vendita"),
            Book(title="Libro 3", subject="Analisi",
                 price="15", condition="Nuovo",
                 student_email=user1.email, state="in vendita"),
            Book(title="Libro 4", subject="Analisi",
                 price="15", condition="Nuovo",
                 student_email=user1.email, state="in vendita")
        ]

        db.session.bulk_save_objects(ads)
        db.session.commit()

        yield

        db.drop_all()


def test_bookShop_announcementsVisualization(test_client, setup_database):
    response = test_client.get('/book-shop')
    assert response.status_code == 200

    data = response.get_json()

    # Ensure that all required fields are present in each advertisement
    required_fields = ['id', 'title', 'subject', 'price',
                       'condition', 'student_email']
    assert all(all(field in ad for field in required_fields)
               for ad in data), "Some fields are missing in the response data"

    # Additional assertion to verify the number of ads if needed
    assert len(data) == 4, f"Expected 4 ads, got {len(data)}"
