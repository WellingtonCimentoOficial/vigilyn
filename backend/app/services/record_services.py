from app.extensions import db
from app.models.record_models import Record, OrganizeRecord
from app.utils.utils import kill_processes
from flask import current_app
from datetime import datetime
import os
import subprocess
import threading
import psutil


def create_record(camera, filepath, size_in_mb):
    record = Record(camera=camera, path=filepath, size_in_mb=size_in_mb)

    db.session.add(record)
    db.session.commit()

    return record


def delete_records(records):
    for record in records:
        os.remove(record.path)
        db.session.delete(record)

    db.session.commit()


def create_organize_record(pid, timestamp):
    OrganizeRecord.query.delete()
    db.session.commit()

    organize_record = OrganizeRecord(
        pid=pid, started_at=datetime.fromtimestamp(timestamp)
    )
    db.session.add(organize_record)
    db.session.commit()

    return organize_record


def get_organize_record():
    organize_records = OrganizeRecord.query.first()
    return organize_records


def start_organize_records_async():
    organize_record = get_organize_record()

    if not organize_record or (
        organize_record and not organize_record.has_process_running()
    ):
        venv_python = os.path.join(
            current_app.config["BASE_DIR"], "venv", "bin", "python3"
        )
        command = [venv_python, "-m", "app.workers.record_worker"]

        process = subprocess.Popen(
            command,
            start_new_session=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        create_organize_record(process.pid, psutil.Process(process.pid).create_time())


def stop_organize_records():
    organize_record = get_organize_record()

    if organize_record and organize_record.has_process_running():
        killed_processes = kill_processes([organize_record.pid])

        if killed_processes:
            db.session.delete(organize_record)
            db.session.commit()

            return True
        return False
    return True


def stop_organize_records_async():
    app = current_app._get_current_object()

    def _stop():
        with app.app_context():
            stop_organize_records()

    thread = threading.Thread(target=_stop, daemon=True)
    thread.start()


def restart_organize_records_async():
    app = current_app._get_current_object()

    def _restart():
        with app.app_context():
            was_stopped = stop_organize_records()
            if was_stopped:
                start_organize_records_async()

    thread = threading.Thread(target=_restart, daemon=True)
    thread.start()


def initialize_organize_records():
    organize_records = OrganizeRecord.query.first()
    if organize_records and not organize_records.has_process_running():
        start_organize_records_async()
