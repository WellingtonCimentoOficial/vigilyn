from app.factory import create_app
from app.utils.storage_utils import storage_checker

app = create_app()

with app.app_context():
    storage_checker()
