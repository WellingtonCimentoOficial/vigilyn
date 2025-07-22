from datetime import datetime, timedelta
from app.utils.ffmpeg_utils import Ffmpeg
from app.utils.logger_utils import Log
from app.utils.email_utils import Email
from app.utils.settings_utils import get_settings
from flask import current_app
from app.factory import db
import time


def start_record(camera):
    settings = get_settings()

    ffmpeg = Ffmpeg(segment_time=settings.segment_time)
    email = Email(notifications_enabled=settings.allow_notifications)

    last_email_sent = datetime.now() - timedelta(hours=1)

    process = ffmpeg.start(camera)

    while True:
        if process.poll() is not None:
            if (datetime.now() - last_email_sent).total_seconds() >= current_app.config[
                "MAIL_INTERVAL"
            ]:
                email.send_async(
                    subject=f"{camera.name} is down!",
                    body=f"The connection to {camera.name} is down",
                    category=Log.RTSP,
                )
                last_email_sent = datetime.now()

            camera.is_recording = False
            time.sleep(5)
            process = ffmpeg.start(camera)
        else:
            camera.is_recording = True

        db.session.commit()

        time.sleep(1)
