from flask.cli import FlaskGroup
from app.factory import create_app
from app.commands import init_settings

cli = FlaskGroup(create_app=create_app)
cli.add_command(init_settings)

if __name__ == "__main__":
    cli()
