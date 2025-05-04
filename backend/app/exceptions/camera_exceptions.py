from .base_exception import AppException


class CameraAlreadyExistsException(AppException):
    default_message = "A camera with that name already exists"
    status_code = 400


class CameraWasNotCreatedException(AppException):
    default_message = "The camera was not created."
    status_code = 400


class CameraWasNotUpdatedException(AppException):
    default_message = "The camera was not updated."
    status_code = 400


class CameraWasNotDeletedException(AppException):
    default_message = "The camera was not deleted."
    status_code = 400


class CameraWasNotStartedException(AppException):
    default_message = "The camera was not started."
    status_code = 400


class CameraWasNotStoppedException(AppException):
    default_message = "The camera was not stopped."
    status_code = 400


class CameraWasNotFoundException(AppException):
    default_message = "The camera was not found."
    status_code = 404


class CameraProcessAlreadyRunningException(AppException):
    default_message = "The camera process already running."
    status_code = 400


class CameraProcessAlreadyStoppedException(AppException):
    default_message = "The camera process already stopped."
    status_code = 400
