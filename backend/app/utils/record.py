import time
from app.utils.logger import Log
from app.utils.settings import get_settings
from datetime import datetime
from app.utils.utils import is_idle
from app.models.camera_models import Camera
from app.services.record_services import create_record
from app.utils.fmpeg import Fmpeg
import os


def organize_records():
    log = Log()

    settings = get_settings()
    base_dir = settings.save_directory_path
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
                date = datetime.strptime(filename.split("_")[1], "%d-%m-%Y")
                year_str = str(date.year)
                month_str = date.strftime("%B")
                day_str = str(date.day)

                camera = Camera.query.get(int(filename.split("_")[0]))
                camera_dir = os.path.join(
                    base_dir, year_str, month_str, day_str, camera.name
                )
                os.makedirs(camera_dir, exist_ok=True)

                new_filename = filename.split("_")[2]
                new_filepath = os.path.join(camera_dir, new_filename)
                os.rename(filepath, new_filepath)

                thumbnail_filename = ".".join([*new_filename.split(".")[:-1], "jpg"])
                thumbnail_filepath = os.path.join(camera_dir, thumbnail_filename)
                Fmpeg.generate_thumbnail(new_filepath, thumbnail_filepath)

                create_record(
                    camera=camera,
                    filename=new_filename,
                    filepath=new_filepath,
                    thumbnail_filepath=thumbnail_filepath,
                    size_in_mb=os.path.getsize(new_filepath) / (1024 * 1024),
                    segment_time=settings.segment_time,
                )

                log.write(
                    category=log.ORGANIZER,
                    message=f"{new_filename} moved to {camera_dir}",
                )
            except Exception as e:
                log.write(
                    category=log.ORGANIZER,
                    message=f"func: organize_records error: Error moving {filename} {str(e)}",
                    level="error",
                )

        time.sleep(5)
