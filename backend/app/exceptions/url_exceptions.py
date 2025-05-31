from .base_exception import AppException


class UrlPageParamException(AppException):
    default_error = "invalid_url_page_param"
    default_message = "The value of the 'page' field is invalid"
    status_code = 400


class UrlLimitParamException(AppException):
    default_error = "invalid_url_is_active_param"
    default_message = "The value of the 'is_active' field is invalid"
    status_code = 400


class InvalidInitialDateParamException(AppException):
    default_error = "invalid_initial_data_param"
    default_message = "The value of the 'initial_date' field is invalid"
    status_code = 400


class InvalidFinalDateParamException(AppException):
    default_error = "invalid_final_date_param"
    default_message = "The value of the 'final_date' field is invalid"
    status_code = 400


class InvalidDateRangeParamException(AppException):
    default_error = "invalid_date_range_param"
    default_message = (
        "The value of the 'final_date' field cannot be earlier than initial date."
    )
    status_code = 400


class MissingDateParamException(AppException):
    default_error = "missing_date_param"
    default_message = "Both initial_date and final_date must be provided together."
    status_code = 400
