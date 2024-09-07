from flask import Flask
from flask_cors import CORS
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from app.models.base import db
from app.controllers.user_controller import user_bp
from app.controllers.ad_controller import ad_bp
from app.controllers.book_controller import book_bp
from app.config import config


def create_app(config_name='development'):
    app = Flask(__name__)

    # Basic application configuration
    app.config.from_object(config[config_name])

    # Components initialization
    db.init_app(app)
    Session(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Check and create the database if it does not exist
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    if not database_exists(engine.url):
        create_database(engine.url)

    with app.app_context():
        db.create_all()

    # Blueprint registration
    app.register_blueprint(user_bp)
    app.register_blueprint(ad_bp)
    app.register_blueprint(book_bp)

    return app
