from .base_exception import AppException


class SettingsWasNotUpdated(AppException):
    default_message = "The settings was not updated."
    status_code = 400
