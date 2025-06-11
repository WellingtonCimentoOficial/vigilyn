from app.extensions import db
from app.models.camera_models import Camera
from app.utils.utils import kill_process
from flask import current_app
from app.exceptions.camera_exceptions import (
    CameraAlreadyExistsException,
    CameraWasNotCreatedException,
    CameraWasNotUpdatedException,
    CameraWasNotDeletedException,
    CameraWasNotStoppedException,
    CameraWasNotStartedException,
    CameraPidParamException,
    CameraRequiresRestartParamException,
    CameraIsRecordingParamException,
)
from app.exceptions.url_exceptions import UrlLimitParamException, UrlPageParamException
from sqlalchemy import or_, desc
from datetime import datetime
import threading
import subprocess
import os
import psutil
import fcntl


def stop_camera(camera):
    try:
        if camera.has_process_running():
            killed_processes = kill_process(camera.pid)

            if killed_processes:
                camera.pid = None
                camera.is_recording = False

                db.session.add(camera)
                db.session.commit()

                return True
            return False
        return True
    except:
        raise CameraWasNotStoppedException()


def stop_camera_async(camera_id):
    try:
        app = current_app._get_current_object()

        def _stop():
            with app.app_context():
                camera = Camera.query.get(camera_id)
                stop_camera(camera)

        thread = threading.Thread(target=_stop, daemon=True)
        thread.start()
    except:
        raise CameraWasNotStoppedException()


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


def create_camera(name, ip_address, port, **kwargs):
    try:
        exists = db.session.query(Camera.query.filter_by(name=name).exists()).scalar()

        if exists:
            raise CameraAlreadyExistsException()

        camera = Camera(
            name=name,
            ip_address=ip_address,
            port=port,
        )

        for key, value in kwargs.items():
            setattr(camera, key, value)

        db.session.add(camera)
        db.session.commit()

        return camera

    except CameraAlreadyExistsException as error:
        raise error
    except:
        raise CameraWasNotCreatedException()


def update_camera(camera, **kwargs):
    try:
        camera_by_name = Camera.query.filter_by(name=kwargs["name"]).first()

        if camera_by_name and camera_by_name.id != camera.id:
            raise CameraAlreadyExistsException()

        for key, value in kwargs.items():
            setattr(camera, key, value)

        camera.requires_restart = True
        db.session.commit()

        return camera
    except CameraAlreadyExistsException as error:
        raise error
    except:
        raise CameraWasNotUpdatedException()


def delete_camera(camera):
    try:
        was_stopped = stop_camera(camera)
        if was_stopped:
            db.session.delete(camera)
            db.session.commit()
    except:
        raise CameraWasNotDeletedException()


def start_camera_async(camera):
    try:
        venv_python = os.path.join(
            current_app.config["BASE_DIR"], "venv", "bin", "python3"
        )
        command = [
            venv_python,
            "-m",
            "app.workers.camera_worker",
            str(camera.id),
        ]

        process = subprocess.Popen(
            command,
            start_new_session=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        camera.pid = process.pid
        camera.started_at = datetime.fromtimestamp(
            psutil.Process(process.pid).create_time()
        )
        camera.requires_restart = False
        db.session.commit()

        return camera
    except:
        raise CameraWasNotStartedException()


def filter_camera(
    search_param, page, limit, pid_param, requires_restart_param, is_recording_param
):
    if not str(page).isdigit():
        raise UrlPageParamException()

    if not str(limit).isdigit():
        raise UrlLimitParamException()

    if pid_param != None and pid_param != "false" and pid_param != "true":
        raise CameraPidParamException()

    if (
        requires_restart_param != None
        and requires_restart_param != "false"
        and requires_restart_param != "true"
    ):
        raise CameraRequiresRestartParamException()

    if (
        is_recording_param != None
        and is_recording_param != "false"
        and is_recording_param != "true"
    ):
        raise CameraIsRecordingParamException()

    page = int(page)
    limit = int(limit)
    query = db.session.query(Camera)

    if search_param:
        query = query.filter(
            or_(
                Camera.name.ilike(f"%{search_param}%"),
                Camera.ip_address.ilike(f"%{search_param}%"),
                Camera.port.ilike(f"%{search_param}%"),
                Camera.username.ilike(f"%{search_param}%"),
                Camera.password.ilike(f"%{search_param}%"),
                Camera.pid.ilike(f"%{search_param}%"),
            )
        )

    if pid_param is not None:
        if pid_param == "true":
            query = query.filter(Camera.pid.isnot(None))
        else:
            query = query.filter(Camera.pid.is_(None))

    if requires_restart_param is not None:
        if requires_restart_param == "true":
            query = query.filter(Camera.requires_restart == True)
        else:
            query = query.filter(Camera.requires_restart == False)

    if is_recording_param is not None:
        if is_recording_param == "true":
            query = query.filter(Camera.is_recording == True)
        else:
            query = query.filter(Camera.is_recording == False)

    total = query.count()
    paginated_query = (
        query.order_by(desc(Camera.id)).offset((page - 1) * limit).limit(limit)
    )

    return paginated_query.all(), total


def initialize_camera_processes():
    base_dir = current_app.config["BASE_DIR"]
    lock_file = os.path.join(base_dir, "initialize_camera.lock")

    with open(lock_file, "w") as lockfile:
        try:
            fcntl.flock(lockfile, fcntl.LOCK_EX)

            cameras = Camera.query.filter(Camera.pid.isnot(None)).all()
            for camera in cameras:
                if not camera.has_process_running():
                    start_camera_async(camera)
        finally:
            fcntl.flock(lockfile, fcntl.LOCK_UN)
