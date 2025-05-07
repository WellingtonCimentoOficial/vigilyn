from .base_exception import AppException


class InvalidRoleIdsException(AppException):
    default_error = "invalid_role_ids"
    default_message = "Some roles do not exist."
    status_code = 400


class RolesWasNotUpdatedException(AppException):
    default_error = "roles_was_not_updated"
    default_message = "The roles was not updated."
    status_code = 400
