from app.extensions import db, bcrypt
from app.models.user_models import User
from app.services.auth_services import generate_tokens
from app.exceptions.user_exceptions import (
    UsernameOrPasswordInvalidException,
    UserWasNotCreatedException,
)


def create_user(**kwargs):
    try:
        exists = db.session.query(
            User.query.filter_by(email=kwargs["email"]).exists()
        ).scalar()

        if exists:
            raise UserWasNotCreatedException()

        hashed_password = bcrypt.generate_password_hash(kwargs["password"]).decode(
            "utf-8"
        )
        kwargs["password"] = hashed_password

        user = User(**kwargs)
        db.session.add(user)
        db.session.commit()

        return user
    except:
        raise UserWasNotCreatedException()


def login_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        tokens = generate_tokens(identity=user.id)
        return tokens
    raise UsernameOrPasswordInvalidException()
