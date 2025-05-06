from .base_exception import AppException


class CameraAlreadyExistsException(AppException):
    default_error = "camera_already_exists"
    default_message = "A camera with that name already exists"
    status_code = 400


class CameraWasNotCreatedException(AppException):
    default_error = "camera_was_not_created"
    default_message = "The camera was not created."
    status_code = 400


class CameraWasNotUpdatedException(AppException):
    default_error = "camera_was_not_updated"
    default_message = "The camera was not updated."
    status_code = 400


class CameraWasNotDeletedException(AppException):
    default_error = "camera_was_not_deleted"
    default_message = "The camera was not deleted."
    status_code = 400


class CameraWasNotStartedException(AppException):
    default_error = "camera_was_not_started"
    default_message = "The camera was not started."
    status_code = 400


class CameraWasNotStoppedException(AppException):
    default_error = "camera_was_not_stopped"
    default_message = "The camera was not stopped."
    status_code = 400


class CameraProcessAlreadyRunningException(AppException):
    default_error = "camera_process_already_running"
    default_message = "The camera process already running."
    status_code = 400


class CameraProcessAlreadyStoppedException(AppException):
    default_error = "camera_process_already_stopped"
    default_message = "The camera process already stopped."
    status_code = 400
