from functools import wraps
from app.models.user_models import User
from flask_jwt_extended import get_jwt_identity
from app.exceptions.permission_exceptions import PermissionDeniedException


def permission_required(permission_name):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user.has_permission(permission_name):
                raise PermissionDeniedException()

            return fn(*args, **kwargs)

        return wrapper

    return decorator
