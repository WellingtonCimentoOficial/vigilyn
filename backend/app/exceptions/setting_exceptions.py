from .base_exception import AppException


class SettingsWasNotUpdated(AppException):
    default_error = "settings_was_not_updated"
    default_message = "The settings was not updated."
    status_code = 400
