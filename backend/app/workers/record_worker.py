from app.factory import create_app
from app.utils.record_utils import organize_records

app = create_app()

with app.app_context():
    organize_records()
