from flask import jsonify
from marshmallow import ValidationError
from app.exceptions.base_exception import AppException
from werkzeug.exceptions import MethodNotAllowed


def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(error):
        if isinstance(error, ValidationError):
            return jsonify(error.messages), 400
        elif isinstance(error, AppException):
            return jsonify({"error": error.default_message}), error.status_code
        elif isinstance(error, MethodNotAllowed):
            return jsonify({"error": "You are not allowed to use this method."}), 405
        else:
            print(error)
            return jsonify({"error": "An error occurred."}), 500
