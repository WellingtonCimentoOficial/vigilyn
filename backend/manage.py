from flask.cli import FlaskGroup
from app.factory import create_app
from app.commands import init_settings, init_permissions, init_roles, init_default_user
from app.extensions import db
from app.models.camera_models import Camera
from app.models.permission_models import Permission
from app.models.record_models import Record
from app.models.role_models import Role
from app.models.user_models import User
import code

cli = FlaskGroup(create_app=create_app)
cli.add_command(init_settings)
cli.add_command(init_permissions)
cli.add_command(init_roles)
cli.add_command(init_default_user)


@cli.command("shell")
def shell():
    app = create_app()
    ctx = app.app_context()
    ctx.push()

    vars = {
        "app": app,
        "db": db,
        "User": User,
        "Camera": Camera,
        "Record": Record,
        "Role": Role,
        "Permission": Permission,
    }
    code.interact(local=vars)


if __name__ == "__main__":
    cli()
