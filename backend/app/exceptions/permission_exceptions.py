from .base_exception import AppException


class PermissionDeniedException(AppException):
    default_error = "permission_denied"
    default_message = "You do not have permission to perform this action."
    status_code = 403
