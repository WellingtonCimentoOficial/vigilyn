import os
import time
from .settings import get_settings
import signal


def create_tmp_dir():
    tmp_dir = get_settings().tmp_directory_path
    os.makedirs(tmp_dir, exist_ok=True)


def is_idle(file_path: str, idle_seconds: float):
    last_modified = os.path.getmtime(file_path)
    return (time.time() - last_modified) > idle_seconds


def generate_rtsp_url(camera):
    url = f"rtsp://{camera.username}:{camera.password}@{camera.ip_address}:{camera.port}{camera.path}"

    return url


def kill_processes(pids):
    killed_processes = []

    for pid in pids:
        try:
            os.killpg(os.getpgid(pid), signal.SIGTERM)
        except Exception as e:
            if not isinstance(e, ProcessLookupError):
                continue

        killed_processes.append(pid)

    return killed_processes
