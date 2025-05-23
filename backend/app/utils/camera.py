from datetime import datetime, timedelta
from app.utils.fmpeg import Fmpeg
from app.utils.logger import Log
from app.utils.email import Email
from app.utils.settings import get_settings
from flask import current_app
import time


def start_record(camera):
    settings = get_settings()

    fmpeg = Fmpeg(
        video_format=settings.video_format, segment_time=settings.segment_time
    )
    email = Email()

    last_email_sent = datetime.now() - timedelta(hours=1)

    process = fmpeg.start(camera)
    
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

            time.sleep(5)
            process = fmpeg.start(camera)

        time.sleep(1)
