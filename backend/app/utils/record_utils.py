import time
from app.utils.logger_utils import Log
from app.utils.ffmpeg_utils import Ffmpeg
from app.utils.settings_utils import get_settings
from app.utils.utils import is_idle
from app.models.camera_models import Camera
from app.services.record_services import create_record
from app.utils.ffmpeg_utils import Ffmpeg
from datetime import datetime, timezone
import os


def organize_records():
    log = Log()

    hwaccel, vcodec = Ffmpeg.get_hwaccel_and_vcodec()
    ffmpeg = Ffmpeg(video_format=".mp4", hwaccel=hwaccel, vcodec=vcodec)

    settings = get_settings()
    base_dir = settings.save_directory_path
    records_dir = os.path.join(base_dir, "records")
    thumbnails_dir = os.path.join(base_dir, "thumbnails")
    tmp_dir = settings.tmp_directory_path
    timeout = Ffmpeg.TIMEOUT + 5

    while True:
        for filename in os.listdir(tmp_dir):
            filepath = os.path.join(tmp_dir, filename)
            if not filename.endswith(Ffmpeg.VIDEO_FORMAT):
                continue
            if not os.path.isfile(filepath):
                continue
            if not is_idle(filepath, timeout):
                continue

            try:
                camera = Camera.query.get(int(filename.split("_")[0]))

                if not camera or camera.is_hidden:
                    os.remove(filepath)
                    continue

                filename_without_ext = os.path.splitext(filename)[0]
                duration_seconds = Ffmpeg.get_duration(filepath)

                os.makedirs(records_dir, exist_ok=True)

                new_filename = filename_without_ext + ".mp4"
                new_filepath = os.path.join(records_dir, new_filename)

                ffmpeg.transcode(camera.name, filepath, new_filepath)
                os.remove(filepath)

                thumbnail_filename = filename_without_ext + ".jpg"
                thumbnail_filepath = os.path.join(thumbnails_dir, thumbnail_filename)
                os.makedirs(thumbnails_dir, exist_ok=True)

                Ffmpeg.generate_thumbnail(new_filepath, thumbnail_filepath)

                datetime_obj = datetime.strptime(
                    " ".join(filename_without_ext.split("_")[1:]), "%Y-%m-%d %H-%M-%S"
                ).replace(tzinfo=timezone.utc)
                date_str = datetime_obj.strftime("%Y/%m/%d")
                time_str = datetime_obj.strftime("%H:%M:%S")

                try:
                    create_record(
                        camera=camera,
                        filename=f"Recording from {camera.name} - {date_str} {time_str}",
                        filepath=new_filepath,
                        thumbnail_filepath=thumbnail_filepath,
                        thumbnail_size_in_mb=os.path.getsize(thumbnail_filepath)
                        / (1024 * 1024),
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
                        message=f"{new_filename} moved to {records_dir}",
                    )
                except:
                    os.remove(new_filepath)
                    os.remove(thumbnail_filepath)

            except Exception as e:
                log.write(
                    category=log.ORGANIZER,
                    message=f"func: organize_records error: Error moving {new_filename} {str(e)}",
                    level="error",
                )

        time.sleep(1)
