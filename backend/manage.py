from flask.cli import FlaskGroup
from app.factory import create_app
from app.commands import init_settings, init_permissions, init_roles, init_default_user

cli = FlaskGroup(create_app=create_app)
cli.add_command(init_settings)
cli.add_command(init_permissions)
cli.add_command(init_roles)
cli.add_command(init_default_user)

if __name__ == "__main__":
    cli()
