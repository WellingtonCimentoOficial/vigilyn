import threading
from .email import Email
from .logger import Log
from app.models.setting_models import Setting
import shutil
import time


def get_storage():
    save_directory_path = Setting.query.first().save_directory_path

    storage = shutil.disk_usage(save_directory_path)
    total = round(storage.total / (1024**3), 2)
    used = round(storage.used / (1024**3), 2)
    free = round(storage.free / (1024**3), 2)
    percent_used = round((used / total) * 100, 2)

    data = {"total": total, "used": used, "free": free, "percent_used": percent_used}

    return data


def storage_checker():
    done_event = threading.Event()
    email = Email()
    log = Log()

    while True:
        storage = get_storage()

        if storage["percent_used"] >= 90:
            text = f"Storage is at {storage['percent_used']}% usage."
            log.write(category=log.STORAGE, message=text, level="warning")
            email.send_async(
                subject=text,
                body=f"Total: {storage['total']}\nUsed: {storage['used']}\nFree: {storage['free']}",
                category=log.STORAGE,
            )
            done_event.wait()
            break

        time.sleep(5)
