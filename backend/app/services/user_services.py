from app.extensions import db, bcrypt
from app.models.user_models import User
from app.exceptions.user_exceptions import (
    UserWasNotCreatedException,
    UserWasNotUpdatedException,
    UserWasNotDeletedException,
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


def update_user(user, **kwargs):
    try:
        for key, value in kwargs.items():
            setattr(user, key, value)

        db.session.commit()

        return user
    except:
        raise UserWasNotUpdatedException()


def delete_user(user):
    try:
        db.session.delete(user)
        db.session.commit()
    except:
        raise UserWasNotDeletedException()
