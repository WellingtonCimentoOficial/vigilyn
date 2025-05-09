from app.extensions import db, bcrypt
from app.models.user_models import User
from app.exceptions.user_exceptions import (
    UserWasNotCreatedException,
    UserWasNotUpdatedException,
    UserWasNotDeletedException,
    UserIsActiveParamException,
)
from app.exceptions.url_exceptions import UrlLimitParamException, UrlPageParamException
from sqlalchemy import or_
from app.models.role_models import Role
from sqlalchemy.orm import joinedload


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


def filter_user(search_param, role_param, is_active_param, page, limit):
    if is_active_param != "false" and is_active_param != "true":
        raise UserIsActiveParamException()

    if not str(page).isdigit():
        raise UrlPageParamException()

    if not str(limit).isdigit():
        raise UrlLimitParamException()

    role_param = int(role_param) if role_param.isdigit() else role_param
    is_active_param = True if is_active_param == "true" else False
    page = int(page)
    limit = int(limit)
    query = db.session.query(User).options(joinedload(User.roles))

    if search_param:
        query = query.filter(
            or_(
                User.name.ilike(f"%{search_param}%"),
                User.email.ilike(f"%{search_param}%"),
            )
        )

    if role_param:
        query = query.filter(
            User.roles.any(
                or_(
                    Role.name.ilike(f"%{role_param}%"),
                    Role.id == role_param,
                )
            )
        )

    query = query.filter(User.is_active == is_active_param)

    return query.offset((page - 1) * limit).limit(limit)
