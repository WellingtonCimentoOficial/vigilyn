from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.user_models import User
from app.models.token_models import Token
from app.exceptions.auth_exceptions import AuthenticationUnauthorizedException


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
