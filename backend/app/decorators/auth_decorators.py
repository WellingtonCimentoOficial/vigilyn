from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.user_models import User
from app.models.token_models import Token
from app.exceptions.auth_exceptions import (
    AuthenticationUnauthorizedException,
    AuthenticationRequiredException,
)
from app.exceptions.record_exceptions import (
    InvalidRecordTokenException,
    RecordTokenExpiredException,
)
from flask import request, current_app
import jwt


def authentication_required(*jwt_args, **jwt_kwargs):
    def decorator(fn):
        @wraps(fn)
        @jwt_required(*jwt_args, **jwt_kwargs)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                raise AuthenticationUnauthorizedException()

            jwt_jti = get_jwt()["jti"]

            if jwt_kwargs.get("refresh"):
                token = Token.query.filter_by(
                    user_id=user_id, refresh_jti=jwt_jti
                ).first()
            else:
                token = Token.query.filter_by(
                    user_id=user_id, access_jti=jwt_jti
                ).first()

            if not token:
                raise AuthenticationUnauthorizedException()

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def required_record_token(*jwt_args, **jwt_kwargs):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            token = request.args.get("token")
            if not token:
                raise AuthenticationRequiredException()

            secret_key = current_app.config["JWT_SECRET_KEY"]
            try:
                decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                raise RecordTokenExpiredException()
            except jwt.InvalidTokenError:
                raise InvalidRecordTokenException()

            record_pk = kwargs.get("record_pk")
            if record_pk != decoded.get("video_id"):
                raise InvalidRecordTokenException()

            return fn(*args, **kwargs)

        return wrapper

    return decorator
