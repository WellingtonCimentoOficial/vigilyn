from app.models.setting_models import Setting
from app.extensions import db, bcrypt
from app.models.permission_models import Permission
from app.models.role_models import Role
from app.models.user_models import User


def get_settings():
    return Setting.query.first()


def is_settings_ready():
    exists = get_settings() != None
    return exists


def create_default_settings():
    if not get_settings():
        default_settings = Setting(
            save_directory_path="/",
            tmp_directory_path="/",
        )
        db.session.add(default_settings)
        db.session.commit()

        return default_settings


def create_permissions():
    permission_names = [
        "create_user",
        "view_camera",
        "create_camera",
        "update_camera",
        "delete_camera",
        "start_camera",
        "stop_camera",
        "restart_camera",
        "view_recordings",
        "delete_recordings",
        "view_settings",
        "update_settings",
        "stop_system",
        "restart_system",
    ]

    for permission_name in permission_names:
        permission = Permission(name=permission_name)
        db.session.add(permission)
        db.session.commit()


def create_roles():
    roles = {
        "admin": [
            "create_user",
            "view_camera",
            "create_camera",
            "update_camera",
            "delete_camera",
            "start_camera",
            "stop_camera",
            "restart_camera",
            "view_recordings",
            "delete_recordings",
            "view_settings",
            "update_settings",
            "stop_system",
            "restart_system",
        ],
        "manager": [
            "view_camera",
            "create_camera",
            "update_camera",
            "delete_camera",
            "view_recordings",
            "delete_recordings",
            "view_settings",
            "update_settings",
            "stop_system",
            "restart_system",
        ],
        "operator": [
            "view_camera",
            "start_camera",
            "stop_camera",
            "restart_camera",
            "view_recordings",
        ],
        "viewer": ["view_recordings"],
        "settings_admin": [
            "view_settings",
            "update_settings",
            "stop_system",
            "restart_system",
        ],
    }

    for role_name, permissions in roles.items():
        role = Role(name=role_name)
        db.session.add(role)

        for permission_name in permissions:
            permission = Permission.query.filter_by(name=permission_name).first()
            role.permissions.append(permission)

        db.session.commit()


def create_default_user():
    role = Role.query.filter_by(name="admin").first()
    user = User(
        name="admin",
        email="admin@admin.com",
        password=bcrypt.generate_password_hash("Admin@123").decode("utf-8"),
        roles=[role],
    )
    db.session.add(user)
    db.session.commit()
