from .base_exception import AppException


class RecordNotFoundException(AppException):
    default_error = "record_not_found"
    default_message = "The requested record does not exist on the server."
    status_code = 404


class RecordThumbnailNotFoundException(AppException):
    default_error = "record_thumbnail_not_found"
    default_message = (
        "The thumbnail for the requested record was not found on the server."
    )
    status_code = 404


class RecordShowFavoritesParamException(AppException):
    default_error = "invalid_record_show_favorites_param"
    default_message = "The value of the 'show_favorites' field is invalid"
    status_code = 400
