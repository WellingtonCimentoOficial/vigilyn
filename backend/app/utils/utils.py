import os
import time
import psutil
from .settings import get_settings
import signal
from flask import jsonify
from sqlalchemy import inspect
from app.extensions import db
from app.utils.logger import Log


def create_tmp_dir():
    tmp_dir = get_settings().tmp_directory_path
    os.makedirs(tmp_dir, exist_ok=True)


def is_idle(file_path: str, idle_seconds: float):
    last_modified = os.path.getmtime(file_path)
    return (time.time() - last_modified) > idle_seconds


def generate_rtsp_url(camera):
    credentials = (
        f"{camera.username}:{camera.password}"
        if camera.username and camera.password
        else camera.username or camera.password or ""
    )
    server = f"{camera.ip_address}:{camera.port}"
    url = f"rtsp://{credentials}@{server}{camera.path}"

    return url


def kill_process(pid):
    try:
        proc = psutil.Process(pid)

        children = proc.children(recursive=True)

        for child in children:
            child.terminate()

        proc.terminate()

        proc.wait(timeout=3)

        if proc.is_running():
            return False

    except psutil.NoSuchProcess:
        pass

    except Exception as e:
        log = Log()
        log.write(
            log.GENERAL,
            level="error",
            message=f"func: kill_process error (PID {pid}): {str(e)}",
        )

    return True


def generate_error_message(error, message, status_code):
    data = {"error": error, "message": message}
    return jsonify(data), status_code


def generate_pagination_response(current_page, total_count, limit, data):
    payload = {
        "current_page": current_page,
        "total_count": total_count,
        "limit": limit,
        "data": data,
    }
    return payload


def tables_exists(table_names):
    tables_verified = []
    inspector = inspect(db.engine)
    for table_name in table_names:
        if inspector.has_table(table_name):
            tables_verified.append(table_name)

    return tables_verified == table_names
