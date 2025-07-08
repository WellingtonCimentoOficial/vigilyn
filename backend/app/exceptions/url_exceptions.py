from .base_exception import AppException


class UrlPageParamException(AppException):
    default_error = "invalid_url_page_param"
    default_message = "The value of the 'page' field is invalid"
    status_code = 400


class UrlLimitParamException(AppException):
    default_error = "invalid_url_is_active_param"
    default_message = "The value of the 'is_active' field is invalid"
    status_code = 400


class UrlCameraIdParamException(AppException):
    default_error = "invalid_url_camera_id"
    default_message = "The value of the 'camera_id' field is invalid"
    status_code = 400


class InvalidInitialDateParamException(AppException):
    default_error = "invalid_initial_date_param"
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


class InvalidInitialHourParamException(AppException):
    default_error = "invalid_initial_hour_param"
    default_message = "The value of the 'initial_hour' field is invalid"
    status_code = 400


class InvalidFinalHourParamException(AppException):
    default_error = "invalid_final_hour_param"
    default_message = "The value of the 'final_hour' field is invalid"
    status_code = 400


class InvalidHourRangeParamException(AppException):
    default_error = "invalid_hour_range_param"
    default_message = (
        "The value of the 'final_hour' field cannot be earlier than initial hour."
    )
    status_code = 400


class MissingHourParamException(AppException):
    default_error = "missing_hour_param"
    default_message = "Both initial_hour and final_hour must be provided together."
    status_code = 400
