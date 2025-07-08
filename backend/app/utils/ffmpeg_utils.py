from .settings_utils import get_settings
from .logger_utils import Log
import time
from .email_utils import Email
from .utils import generate_rtsp_url
import subprocess
import os


class Ffmpeg:
    TIMEOUT = 5

    def __init__(
        self,
        rtsp_transport="tcp",
        vcodec="copy",
        acodec="aac",
        audio_bitrate="128k",
        video_format=".mp4",
        segment_time=300,
    ):
        self.rtsp_transport = rtsp_transport
        self.vcodec = vcodec
        self.acodec = acodec
        self.audio_bitrate = audio_bitrate
        self.timeout = self.TIMEOUT * 1000000
        self.video_format = video_format
        self.segment_time = segment_time

    def start(self, camera):
        settings = get_settings()
        email = Email(notifications_enabled=settings.allow_notifications)
        log = Log()

        filename = (
            "_".join([str(camera.id), "%Y-%m-%d", "%H-%M-%S"]) + self.video_format
        )

        tmp_dir = settings.tmp_directory_path
        output_path = f"{tmp_dir}/{filename}"

        url = generate_rtsp_url(camera)
        log.write(category=log.RTSP, message=f"Trying to connect to {url}...")

        tag_param = "hvc1" if camera.codec == "h265" else "avc1"

        command = [
            "ffmpeg",
            "-rtsp_transport",
            self.rtsp_transport,
            "-timeout",
            str(self.timeout),
            "-i",
            url,
            "-vcodec",
            self.vcodec,
            "-acodec",
            self.acodec,
            "-b:a",
            self.audio_bitrate,
            "-tag:v",
            tag_param,
            "-movflags",
            "+faststart",
            "-f",
            "segment",
            "-segment_format",
            self.video_format.replace(".", ""),
            "-segment_time",
            str(self.segment_time),
            "-reset_timestamps",
            "1",
            "-strftime",
            "1",
            "-metadata",
            f"title={camera.name}",
            "-loglevel",
            "error",
            output_path,
        ]

        process = subprocess.Popen(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        time.sleep(5)

        if process.poll() is None:
            log.write(category=log.RTSP, message=f"Successfully connected to {url}")
            email.send_async(
                subject=f"{camera.name} is up!",
                body=f"Successfully connected to {camera.name}",
                category=log.RTSP,
            )

        return process

    @staticmethod
    def generate_thumbnail(filepath, output_path):
        log = Log()
        try:
            command = [
                "ffmpeg",
                "-ss",
                "00:00:03",
                "-i",
                filepath,
                "-vframes",
                "1",
                "-q:v",
                "1",
                "-y",
                output_path,
            ]
            subprocess.run(command)

            log.write(
                log.ORGANIZER,
                message=f"{os.path.basename(output_path)} moved to {os.path.dirname(output_path)}",
            )
        except Exception as e:
            log.write(
                log.GENERAL,
                level="error",
                message=f"func: generate_thumbnail error: {str(e)}",
            )
