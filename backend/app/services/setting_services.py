from app.extensions import db
from app.models.setting_models import Setting


def update_setting(setting, **kwargs):
    for key, value in kwargs.items():
        setattr(setting, key, value)

    setting.requires_restart = True
    db.session.commit()

    return setting


def update_requires_restart(value):
    setting = Setting.query.first()
    setting.requires_restart = value
    db.session.commit()
