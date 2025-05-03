from app.models.setting_models import Setting
from app.extensions import db


def get_settings():
    return Setting.query.first()


def is_settings_ready():
    exists = get_settings() != None
    return exists


def create_default_settings():
    if not get_settings():
        default_settings = Setting(
            save_directory_path="/",
            tmp_directory_path="/",
        )
        db.session.add(default_settings)
        db.session.commit()

        return default_settings
