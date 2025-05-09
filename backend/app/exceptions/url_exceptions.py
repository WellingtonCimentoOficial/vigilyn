from .base_exception import AppException


class UrlPageParamException(AppException):
    default_error = "invalid_url_page_param"
    default_message = "The value of the 'page' field is invalid"
    status_code = 400


class UrlLimitParamException(AppException):
    default_error = "invalid_url_is_active_param"
    default_message = "The value of the 'is_active' field is invalid"
    status_code = 400
