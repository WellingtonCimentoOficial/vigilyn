from flask import Flask
from app.extensions import db, migrate, mail, jwt
from .routes.camera_routes import camera_bp
from .routes.record_routes import record_bp
from .routes.storage_routes import storage_bp
from .routes.setting_routes import setting_bp
from .routes.system_routes import system_bp
from .routes.auth_routes import auth_bp
from .commands import setup_cli
from app.handlers import register_error_handlers


def create_app():
    app = Flask(__name__)

    app.register_blueprint(camera_bp)
    app.register_blueprint(record_bp)
    app.register_blueprint(storage_bp)
    app.register_blueprint(setting_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(auth_bp)

    app.config.from_object("config.Config")

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)

    app.cli.add_command(setup_cli)

    register_error_handlers(app)

    return app
