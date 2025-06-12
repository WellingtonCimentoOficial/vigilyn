from app.extensions import db, bcrypt
from app.models.user_models import User, UserFavorite
from app.exceptions.user_exceptions import (
    UserWasNotCreatedException,
    UserWasNotUpdatedException,
    UserWasNotDeletedException,
    UserIsActiveParamException,
    UserFavoriteInvalidIDsException,
    UserAlreadyExistsException,
)
from app.exceptions.url_exceptions import UrlLimitParamException, UrlPageParamException
from sqlalchemy import or_, desc
from app.models.role_models import Role
from app.models.record_models import Record
from sqlalchemy.orm import joinedload


def create_user(**kwargs):
    try:
        exists = db.session.query(
            User.query.filter_by(email=kwargs["email"]).exists()
        ).scalar()

        if exists:
            raise UserAlreadyExistsException()

        hashed_password = bcrypt.generate_password_hash(kwargs["password"]).decode(
            "utf-8"
        )
        kwargs["password"] = hashed_password

        user = User(**kwargs)
        favorite = UserFavorite(user=user)

        db.session.add(user)
        db.session.add(favorite)
        db.session.commit()

        return user
    except UserAlreadyExistsException:
        raise
    except:
        raise UserWasNotCreatedException()


def update_user(user, **kwargs):
    try:
        for key, value in kwargs.items():
            if key == "password":
                setattr(user, key, bcrypt.generate_password_hash(value).decode("utf-8"))

            if key == "email":
                user_by_email = User.query.filter_by(email=value).first()

                if user_by_email is not None and user_by_email.id != user.id:
                    raise UserAlreadyExistsException()

            setattr(user, key, value)

        db.session.commit()

        return user
    except UserAlreadyExistsException:
        raise
    except:
        raise UserWasNotUpdatedException()


def delete_user(user):
    try:
        db.session.delete(user)
        db.session.commit()
    except:
        raise UserWasNotDeletedException()


def filter_user(search_param, role_param, is_active_param, page, limit):
    if is_active_param is not None:
        if is_active_param != "false" and is_active_param != "true":
            raise UserIsActiveParamException()

    if not str(page).isdigit():
        raise UrlPageParamException()

    if not str(limit).isdigit():
        raise UrlLimitParamException()

    role_param = int(role_param) if role_param.isdigit() else role_param
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

    if is_active_param is not None:
        query = query.filter(User.is_active == (is_active_param == "true"))

    total = query.count()
    paginated_query = (
        query.order_by(desc(User.id)).offset((page - 1) * limit).limit(limit)
    )

    return paginated_query.all(), total


def update_user_favorite(user, record_ids):
    records = Record.query.filter(Record.id.in_(record_ids)).all()

    found_ids = {record.id for record in records}
    invalid_ids = set(record_ids) - found_ids
    if invalid_ids:
        raise UserFavoriteInvalidIDsException()

    user.favorite.records = records
    db.session.commit()

    return user
