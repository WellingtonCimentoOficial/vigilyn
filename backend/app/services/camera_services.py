from app.extensions import db
from app.models.camera_models import Camera
from app.utils.utils import kill_processes
from config import Config
from flask import current_app
import threading
import subprocess
import os


def stop_camera(camera):
    if camera.has_process_running():
        killed_processes = kill_processes([camera.pid])

        if killed_processes:
            camera.pid = None

            db.session.add(camera)
            db.session.commit()

            return True
        return False
    return True


def stop_camera_async(camera_id):
    app = current_app._get_current_object()

    def _stop():
        with app.app_context():
            camera = Camera.query.get(camera_id)
            stop_camera(camera)

    thread = threading.Thread(target=_stop, daemon=True)
    thread.start()


def restart_camera_async(camera_id):
    app = current_app._get_current_object()

    def _restart():
        with app.app_context():
            camera = Camera.query.get(camera_id)
            was_stopped = stop_camera(camera)
            if was_stopped:
                start_camera_async(camera)

            camera.requires_restart = False
            db.session.commit()

    thread = threading.Thread(target=_restart, daemon=True)
    thread.start()


def restart_all_cameras_async(only_active=False):
    if only_active:
        cameras = Camera.query.filter(Camera.pid.isnot(None)).all()
    else:
        cameras = Camera.query.all()

    for camera in cameras:
        restart_camera_async(camera.id)


def stop_all_cameras_async():
    cameras = Camera.query.all()

    for camera in cameras:
        stop_camera_async(camera.id)


def create_camera(**kwargs):
    camera = Camera(**kwargs)

    db.session.add(camera)
    db.session.commit()

    return camera


def update_camera(camera, **kwargs):
    for key, value in kwargs.items():
        setattr(camera, key, value)

    camera.requires_restart = True
    db.session.commit()

    return camera


def delete_camera(camera):
    was_stopped = stop_camera()
    if was_stopped:
        db.session.delete(camera)
        db.session.commit()


def start_camera_async(camera):
    venv_python = os.path.join(Config.BASE_DIR, "venv", "bin", "python3")
    command = [venv_python, "-m", "app.workers.camera_worker", str(camera.id)]

    process = subprocess.Popen(
        command,
        start_new_session=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    camera.pid = process.pid
    db.session.commit()
