from .base_exception import AppException


class AuthenticationUnauthorizedException(AppException):
    default_error = "authentication_unauthorized"
    default_message = "The authentication was unauthorized."
    status_code = 401
