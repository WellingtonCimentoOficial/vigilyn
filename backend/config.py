import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]
    DEBUG = True if os.getenv("FLASK_ENV", "development") == "development" else False

    SQLALCHEMY_DATABASE_URI = "sqlite:///sqlite.db"
    WTF_CSRF_ENABLED = False

    MAIL_SERVER = os.environ["SMTP_HOST"]
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ["SMTP_LOGIN_USERNAME"]
    MAIL_PASSWORD = os.environ["SMTP_LOGIN_PASSWORD"]
    MAIL_DEFAULT_SENDER = os.environ["SMTP_DEFAULT_SENDER"]
    MAIL_DEFAULT_RECEIVER = os.environ["SMTP_DEFAULT_RECEIVER"]
    MAIL_INTERVAL = 300

    BASE_DIR = BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=15)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]

    DEFAULT_PAGINATION_LIMIT = 999999999
