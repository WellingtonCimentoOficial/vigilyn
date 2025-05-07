from .base_exception import AppException


class AuthenticationUnauthorizedException(AppException):
    default_error = "authentication_unauthorized"
    default_message = "The authentication was unauthorized."
    status_code = 401


class AuthenticationRequiredException(AppException):
    default_error = "authentication_required"
    default_message = "You must be authenticated to access this resource."
    status_code = 401
