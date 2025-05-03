import sys
from app.utils.camera import start_record
from app.factory import create_app
from app.models.camera_models import Camera

app = create_app()
camera_id = int(sys.argv[1])

with app.app_context():
    camera = Camera.query.filter_by(id=camera_id).first()

    if camera:
        start_record(camera)
