from app.models.role_models import Role
from app.exceptions.role_exceptions import (
    InvalidRoleIdsException,
    RolesWasNotUpdatedException,
)
from app.extensions import db


def update_roles(user, role_ids):
    try:
        valid_roles = []
        invalid_ids = []

        for id in role_ids:
            role = Role.query.get(id)

            if role:
                valid_roles.append(role)
            else:
                invalid_ids.append(str(id))

        if invalid_ids:
            raise InvalidRoleIdsException(
                message=f"The ids {",".join(invalid_ids)} are invalid."
            )

        user.roles = valid_roles
        db.session.commit()
    except InvalidRoleIdsException as error:
        raise error
    except:
        raise RolesWasNotUpdatedException()
