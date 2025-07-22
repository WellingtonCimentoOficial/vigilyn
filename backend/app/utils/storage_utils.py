import time
from app.services.system_services import get_storage
from .settings_utils import get_settings
from app.services.storage_services import notify_storage_threshold_reached
from app.services.record_services import delete_oldest_records_async


def storage_checker():
    settings = get_settings()

    was_storage_alert_sent = False
    has_deleted_old_recordings = False

    while True:
        storage = get_storage()

        if storage["percent_used"] >= 95:
            if settings.allow_notifications and not was_storage_alert_sent:
                notify_storage_threshold_reached(
                    total=storage["total"],
                    used=storage["used"],
                    free=storage["free"],
                    percent=storage["percent_used"],
                )
                was_storage_alert_sent = True

            if settings.auto_delete_enabled and not has_deleted_old_recordings:
                delete_oldest_records_async()
                has_deleted_old_recordings = True
        else:
            was_storage_alert_sent = False
            has_deleted_old_recordings = False

        time.sleep(3)
