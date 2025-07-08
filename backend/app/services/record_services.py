from app.extensions import db
from app.models.record_models import Record, OrganizeRecord
from app.utils.utils import kill_process
from app.utils.validators import (
    validate_date_range,
    validate_hour_range,
    validate_camera_ids_param,
)
from app.utils.logger_utils import Log
from flask import current_app
from sqlalchemy import desc
from datetime import datetime
from app.exceptions.url_exceptions import (
    UrlLimitParamException,
    UrlPageParamException,
)
from app.exceptions.record_exceptions import (
    RecordShowFavoritesParamException,
    RecordAlreadyExistsException,
    RecordWasNotUpdatedException,
)
import os
import subprocess
import threading
import psutil
import fcntl


def get_duration(filepath):
    try:
        duration_seconds = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                filepath,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        return float(duration_seconds.stdout.strip())
    except Exception as e:
        log = Log()
        log.write(
            log.GENERAL,
            level="error",
            message=f"func: get_duration error: {str(e.stderr)}",
        )


def create_record(
    camera,
    filename,
    filepath,
    size_in_mb,
    thumbnail_filepath,
    created_at,
    duration_seconds,
):
    try:
        if not db.session.query(
            Record.query.filter_by(path=filepath).exists()
        ).scalar():
            record = Record(
                camera=camera,
                name=filename,
                path=filepath,
                format=filepath.split(".")[-1],
                size_in_mb=size_in_mb,
                created_at=created_at,
                duration_seconds=duration_seconds,
                thumbnail_path=thumbnail_filepath,
            )

            db.session.add(record)
            db.session.commit()

        return record
    except Exception as e:
        log = Log()
        log.write(
            log.GENERAL, level="error", message=f"func: create_record error: {str(e)}"
        )


def update_record(record, **kwargs):
    try:
        record_by_name = Record.query.filter_by(name=kwargs["name"]).first()

        if record_by_name and record_by_name.id != record.id:
            raise RecordAlreadyExistsException()

        for key, value in kwargs.items():
            setattr(record, key, value)

        db.session.commit()

        return record
    except RecordAlreadyExistsException as error:
        raise error
    except:
        raise RecordWasNotUpdatedException()


def delete_records(records):
    try:
        for record in records:
            try:
                for file_path in [record.path, record.thumbnail_path]:
                    try:
                        os.remove(file_path)
                    except FileNotFoundError:
                        pass
                    except Exception:
                        raise

                db.session.delete(record)
            except Exception as e:
                log = Log()
                log.write(
                    category=log.GENERAL,
                    level="error",
                    message=f"func: delete_records error: {str(e)}",
                )
        db.session.commit()
    except Exception as e:
        log = Log()
        log.write(
            category=log.GENERAL,
            level="error",
            message=f"func: delete_records error: {str(e)}",
        )


def create_organize_record(pid, timestamp):
    try:
        OrganizeRecord.query.delete()
        db.session.commit()

        organize_record = OrganizeRecord(
            pid=pid, started_at=datetime.fromtimestamp(timestamp)
        )
        db.session.add(organize_record)
        db.session.commit()

        return organize_record
    except Exception as e:
        log = Log()
        log.write(
            log.GENERAL,
            level="error",
            message=f"func: create_organize_record error: {str(e)}",
        )


def get_organize_record():
    try:
        organize_records = OrganizeRecord.query.first()
        return organize_records
    except Exception as e:
        log = Log()
        log.write(
            log.GENERAL,
            level="error",
            message=f"func: get_organize_record error: {str(e)}",
        )


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
        killed_processes = kill_process(organize_record.pid)

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
    base_dir = current_app.config["BASE_DIR"]
    lock_file = os.path.join(base_dir, "initialize_organize_records.lock")

    with open(lock_file, "w") as lockfile:
        try:
            fcntl.flock(lockfile, fcntl.LOCK_EX)

            organize_records = OrganizeRecord.query.first()
            if organize_records and not organize_records.has_process_running():
                start_organize_records_async()
        finally:
            fcntl.flock(lockfile, fcntl.LOCK_UN)


def filter_record(
    search_param,
    page,
    limit,
    show_favorites_param,
    initial_date_param,
    final_date_param,
    initial_hour_param,
    final_hour_param,
    favorite_record_ids,
    camera_ids_param,
):
    try:
        if not str(page).isdigit():
            raise UrlPageParamException()

        if not str(limit).isdigit():
            raise UrlLimitParamException()

        if (
            show_favorites_param != None
            and show_favorites_param != "true"
            and show_favorites_param != "false"
        ):
            raise RecordShowFavoritesParamException()

        if initial_date_param != None or final_date_param != None:
            initial_date_param, final_date_param = validate_date_range(
                initial_date_param, final_date_param
            )

        if initial_hour_param != None or final_hour_param != None:
            initial_hour_param, final_hour_param = validate_hour_range(
                initial_hour_param, final_hour_param
            )

        if camera_ids_param:
            validate_camera_ids_param(camera_ids_param)

        page = int(page)
        limit = int(limit)
        query = db.session.query(Record)

        if show_favorites_param == "true":
            query = query.filter(Record.id.in_(favorite_record_ids))

        if initial_date_param and final_date_param:
            if initial_hour_param and final_hour_param:
                initial_datetime = datetime.combine(
                    initial_date_param, initial_hour_param
                )
                final_datetime = datetime.combine(final_date_param, final_hour_param)
            else:
                initial_datetime = initial_date_param
                final_datetime = final_date_param

            query = query.filter(
                Record.created_at.between(initial_datetime, final_datetime)
            )

        if camera_ids_param:
            query = query.filter(Record.camera_id.in_(camera_ids_param))

        if search_param:
            query = query.filter(Record.name.ilike(f"%{search_param}%"))

        total = query.count()
        paginated_query = (
            query.order_by(desc(Record.id)).offset((page - 1) * limit).limit(limit)
        )

        return paginated_query.all(), total
    except Exception as e:
        log = Log()
        log.write(
            log.GENERAL, level="error", message=f"func: filter_record error: {str(e)}"
        )
        raise
