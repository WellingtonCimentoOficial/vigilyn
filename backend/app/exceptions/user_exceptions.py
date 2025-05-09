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


class UserInactiveException(AppException):
    default_error = "user_inactive"
    default_message = "The user is not active."
    status_code = 403


class UserIsActiveParamException(AppException):
    default_error = "invalid_user_is_active_param"
    default_message = "The value of the 'is_active' field is invalid"
    status_code = 400
