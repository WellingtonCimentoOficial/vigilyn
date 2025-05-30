from .settings import get_settings
from .logger import Log
import time
from .email import Email
from .utils import generate_rtsp_url
import subprocess


class Fmpeg:
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
        email = Email()
        log = Log()

        title = "%H-%M-%S"
        filename = "_".join([str(camera.id), "%d-%m-%Y", title]) + self.video_format

        tmp_dir = get_settings().tmp_directory_path
        output_path = f"{tmp_dir}/{filename}"

        url = generate_rtsp_url(camera)
        log.write(category=log.RTSP, message=f"Trying to connect to {url}...")

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
            "-f",
            "segment",
            "-segment_time",
            str(self.segment_time),
            "-reset_timestamps",
            "1",
            "-strftime",
            "1",
            "-metadata",
            f"title={title}",
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
        except Exception as e:
            log = Log()
            log.write(
                log.GENERAL,
                level="error",
                message=f"func: generate_thumbnail error: {str(e)}",
            )
