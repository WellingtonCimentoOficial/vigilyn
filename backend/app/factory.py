from flask import Flask
from app.extensions import db, migrate, mail, jwt, cors, limiter
from .routes.camera_routes import camera_bp
from .routes.record_routes import record_bp
from .routes.setting_routes import setting_bp
from .routes.system_routes import system_bp
from .routes.auth_routes import auth_bp
from .routes.user_routes import user_bp
from .routes.role_routes import role_bp
from .routes.base_routes import base_bp
from .commands import setup_cli
from app.handlers import register_error_handlers
from app.services.camera_services import initialize_camera_processes
from app.services.record_services import initialize_organize_records
from app.services.storage_services import initialize_storage_checker
from app.utils.utils import tables_exists
import os


def create_app():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    template_folder = os.path.join(base_dir, "..", "..", "frontend", "build")
    static_folder = os.path.join(template_folder, "static")

    app = Flask(__name__, template_folder=template_folder, static_folder=static_folder)

    app.register_blueprint(base_bp)
    app.register_blueprint(camera_bp)
    app.register_blueprint(record_bp)
    app.register_blueprint(setting_bp)
    app.register_blueprint(system_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(role_bp)

    app.config.from_object("config.Config")

    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    if app.debug:
        cors.init_app(app, resources={r"/*": {"origins": "*"}})

    app.cli.add_command(setup_cli)

    register_error_handlers(app)

    with app.app_context():
        if tables_exists(["camera_table", "organize_record_table"]):
            initialize_camera_processes()
            initialize_organize_records()
            initialize_storage_checker()

    return app
