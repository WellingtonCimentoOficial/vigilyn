from .base_exception import AppException


class RecordNotFoundException(AppException):
    default_error = "record_not_found"
    default_message = "The requested record does not exist on the server."
    status_code = 404


class NoRecordingsFoundException(AppException):
    default_error = "not_recordings_found"
    default_message = "The requested records do not exist on the server."
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


class RecordAlreadyExistsException(AppException):
    default_error = "record_already_exists"
    default_message = "A record with that name already exists"
    status_code = 400


class RecordWasNotUpdatedException(AppException):
    default_error = "record_was_not_updated"
    default_message = "The record was not updated."
    status_code = 400


class RecordTokenExpiredException(AppException):
    default_error = "video_token_expired"
    default_message = "The video access token has expired."
    status_code = 401


class InvalidRecordTokenException(AppException):
    default_error = "invalid_video_token"
    default_message = "The video access token is invalid."
    status_code = 401
