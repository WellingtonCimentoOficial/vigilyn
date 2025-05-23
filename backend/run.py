from app.utils.utils import create_tmp_dir
from app.factory import create_app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        create_tmp_dir()

    app.run()
