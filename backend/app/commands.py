import click
from flask.cli import with_appcontext
from app.utils.settings import create_default_settings
from flask.cli import AppGroup
from config import Config
import subprocess
import os

setup_cli = AppGroup("setup")


@click.command("init-settings")
@with_appcontext
def init_settings():
    created = create_default_settings()

    if created:
        print("Default settings create successfully!")
    else:
        print("There is already a settings in the db")


@setup_cli.command("all")
def setup_all():
    venv_python = os.path.join(Config.BASE_DIR, "venv", "bin", "python3")

    click.echo("\n🔧 Rodando: flask db init")
    subprocess.call([venv_python, "manage.py", "db", "init"])

    click.echo("\n📦 Rodando: flask db migrate")
    subprocess.call(
        [venv_python, "manage.py", "db", "migrate", "-m", "first migration"]
    )

    click.echo("\n📈 Rodando: flask db upgrade")
    subprocess.call([venv_python, "manage.py", "db", "upgrade"])

    click.echo("\n⚙️ Rodando: init-settings")
    subprocess.call([venv_python, "manage.py", "init-settings"])

    click.echo("\n✅ Setup completo!")
