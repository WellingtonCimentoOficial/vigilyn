from .base_exception import AppException


class UsernameOrPasswordInvalidException(AppException):
    default_error = "invalid_username_or_password"
    default_message = "The username or password is invalid."
    status_code = 400


class UserWasNotCreatedException(AppException):
    default_error = "user_was_not_created"
    default_message = "The user was not created."
    status_code = 400


class UserWasNotUpdatedException(AppException):
    default_error = "user_was_not_updated"
    default_message = "The user was not updated."
    status_code = 400


class UserWasNotDeletedException(AppException):
    default_error = "user_was_not_deleted"
    default_message = "The user was not deleted."
    status_code = 400
