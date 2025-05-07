from flask import jsonify
from marshmallow import ValidationError
from app.exceptions.base_exception import AppException
from werkzeug.exceptions import MethodNotAllowed, NotFound, UnsupportedMediaType
from app.utils.utils import generate_error_message


def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(error):
        if isinstance(error, ValidationError):
            return generate_error_message("validation", error.messages, 400)
        elif isinstance(error, AppException):
            return generate_error_message(error.error, error.message, error.status_code)
        elif isinstance(error, MethodNotAllowed):
            return generate_error_message(
                "method_not_allowed", "You are not allowed to use this method.", 405
            )
        elif isinstance(error, NotFound):
            return generate_error_message(
                "not_found", "We couldn’t find what you were looking for.", 404
            )
        elif isinstance(error, UnsupportedMediaType):
            return generate_error_message(
                "unsupported_media_type",
                "Requests to this endpoint must have the 'Content-Type: application/json' header and a valid JSON body.",
                415,
            )
        else:
            return generate_error_message("internal", "An error occurred.", 500)
