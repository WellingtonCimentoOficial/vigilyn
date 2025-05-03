from app.models.storage_models import StorageChecker
from app.models.record_models import Record
from sqlalchemy import func
from app.extensions import db
from config import Config
from app.utils.utils import kill_processes
from flask import current_app
import os
import subprocess
import threading


def get_monthly_storage():
    results = (
        db.session.query(
            func.strftime("%m", Record.created_at).label("month"),
            func.sum(Record.size_in_mb).label("total"),
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    result_dict = {month: total_mb for month, total_mb in results}

    data = []
    for num in range(1, 13):
        month_str = f"{num:02d}"
        total = result_dict.get(month_str, 0)
        data.append(
            {
                "id": num,
                "month": month_str,
                "total": round(total / 1024, 2) if total else 0,
            }
        )

    return data


def create_storage_checker(pid):
    StorageChecker.query.delete()
    db.session.commit()

    storage_checker = StorageChecker(pid=pid)
    db.session.add(storage_checker)
    db.session.commit()

    return storage_checker


def get_storage_checker():
    storage_checker = StorageChecker.query.first()
    return storage_checker


def start_storage_checker_async():
    storage_checker = get_storage_checker()

    if not storage_checker or (
        storage_checker and not storage_checker.has_process_running()
    ):
        venv_python = os.path.join(Config.BASE_DIR, "venv", "bin", "python3")
        command = [venv_python, "-m", "app.workers.storage_checker_worker"]

        process = subprocess.Popen(
            command,
            start_new_session=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        create_storage_checker(process.pid)


def stop_storage_checker():
    storage_checker = get_storage_checker()

    if storage_checker and storage_checker.has_process_running():
        killed_processes = kill_processes([storage_checker.pid])

        if killed_processes:
            db.session.delete(storage_checker)
            db.session.commit()

            return True
        return False
    return True


def stop_storage_checker_async():
    app = current_app._get_current_object()

    def _stop():
        with app.app_context():
            stop_storage_checker()

    thread = threading.Thread(target=_stop, daemon=True)
    thread.start()


def restart_storage_checker_async():
    app = current_app._get_current_object()

    def _restart():
        with app.app_context():
            was_stopped = stop_storage_checker()
            if was_stopped:
                start_storage_checker_async()

    thread = threading.Thread(target=_restart, daemon=True)
    thread.start()
