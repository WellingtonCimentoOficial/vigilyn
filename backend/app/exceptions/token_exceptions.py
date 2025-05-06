from .base_exception import AppException


class TokenInvalidException(AppException):
    default_error = "invalid_token"
    default_message = "The token is invalid."
    status_code = 400
