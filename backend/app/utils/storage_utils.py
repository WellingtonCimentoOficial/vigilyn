import threading
from .email_utils import Email
from .logger_utils import Log
import time
from app.services.system_services import get_storage
from .settings_utils import get_settings


def storage_checker():
    done_event = threading.Event()
    settings = get_settings()
    email = Email(notifications_enabled=settings.allow_notifications)
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
