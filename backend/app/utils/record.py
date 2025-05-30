import time
from app.utils.logger import Log
from app.utils.settings import get_settings
from app.utils.utils import is_idle
from app.models.camera_models import Camera
from app.services.record_services import create_record, get_duration
from app.utils.fmpeg import Fmpeg
from datetime import datetime, timezone
import os


def organize_records():
    log = Log()

    settings = get_settings()
    base_dir = settings.save_directory_path
    records_dir = os.path.join(base_dir, "records")
    thumbnails_dir = os.path.join(base_dir, "thumbnails")
    tmp_dir = settings.tmp_directory_path
    timeout = Fmpeg.TIMEOUT

    while True:
        for filename in os.listdir(tmp_dir):
            filepath = os.path.join(tmp_dir, filename)
            if not filename.endswith(settings.video_format):
                continue
            if not os.path.isfile(filepath):
                continue
            if not is_idle(filepath, timeout):
                continue

            try:
                camera = Camera.query.get(int(filename.split("_")[0]))

                filename_without_ext = os.path.splitext(filename)[0]
                duration_seconds = get_duration(filepath)

                os.makedirs(records_dir, exist_ok=True)

                new_filepath = os.path.join(records_dir, filename)
                os.rename(filepath, new_filepath)

                thumbnail_filename = filename_without_ext + ".jpg"
                thumbnail_filepath = os.path.join(thumbnails_dir, thumbnail_filename)
                os.makedirs(thumbnails_dir, exist_ok=True)

                Fmpeg.generate_thumbnail(new_filepath, thumbnail_filepath)

                datetime_obj = datetime.strptime(
                    " ".join(filename_without_ext.split("_")[1:]), "%Y-%m-%d %H-%M-%S"
                ).replace(tzinfo=timezone.utc)
                date_str = datetime_obj.strftime("%Y/%m/%d")
                time_str = datetime_obj.strftime("%H-%M-%S")

                create_record(
                    camera=camera,
                    filename=f"Recording from {camera.name} - {date_str} {time_str}",
                    filepath=new_filepath,
                    thumbnail_filepath=thumbnail_filepath,
                    size_in_mb=os.path.getsize(new_filepath) / (1024 * 1024),
                    duration_seconds=(
                        duration_seconds
                        if isinstance(duration_seconds, float)
                        else settings.segment_time
                    ),
                    created_at=datetime_obj,
                )

                log.write(
                    category=log.ORGANIZER,
                    message=f"{filename} moved to {records_dir}",
                )
            except Exception as e:
                log.write(
                    category=log.ORGANIZER,
                    message=f"func: organize_records error: Error moving {filename} {str(e)}",
                    level="error",
                )

        time.sleep(5)
