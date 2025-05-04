from app.extensions import db
from app.models.setting_models import Setting
from app.exceptions.setting_exceptions import SettingsWasNotUpdated


def update_setting(setting, **kwargs):
    try:
        for key, value in kwargs.items():
            setattr(setting, key, value)

        setting.requires_restart = True
        db.session.commit()

        return setting
    except:
        raise SettingsWasNotUpdated()


def update_requires_restart(value):
    setting = Setting.query.first()
    setting.requires_restart = value
    db.session.commit()
