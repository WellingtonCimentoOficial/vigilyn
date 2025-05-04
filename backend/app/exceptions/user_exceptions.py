from .base_exception import AppException


class UsernameOrPasswordInvalidException(AppException):
    default_message = "The username or password is invalid."
    status_code = 400


class UserWasNotCreatedException(AppException):
    default_message = "The user was not created."
    status_code = 400
