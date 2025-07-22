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
        hwaccel=None,
        acodec="aac",
        profile="baseline",
        audio_bitrate="128k",
        video_format=".mp4",
        segment_time=300,
    ):
        self.rtsp_transport = rtsp_transport
        self.vcodec = vcodec
        self.hwaccel = hwaccel
        self.acodec = acodec
        self.profile = profile
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

    def transcode(self, filepath, output_path):
        log = Log()

        command = ["ffmpeg"]

        if self.hwaccel:
            command += ["-hwaccel", self.hwaccel]

        command += [
            "-i",
            filepath,
            "-vcodec",
            self.vcodec,
            "-profile:v",
            self.profile,
            "-g",
            "25",
            "-f",
            "mp4",
            "-acodec",
            self.acodec,
            "-b:a",
            self.audio_bitrate,
            "-movflags",
            "frag_keyframe+empty_moov",
            output_path,
        ]

        try:
            subprocess.run(command, check=True)
        except Exception as e:
            log.write(
                log.GENERAL,
                level="error",
                message=f"func: transcode error: {str(e)}",
            )
            raise

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

    @staticmethod
    def get_duration(filepath):
        log = Log()
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
            log.write(
                log.GENERAL,
                level="error",
                message=f"func: get_duration error: {str(e.stderr)}",
            )

    @staticmethod
    def get_codec(filepath):
        log = Log()
        try:
            codec = subprocess.run(
                [
                    "ffprobe",
                    "-v",
                    "error",
                    "-select_streams",
                    "v:0",
                    "-show_entries",
                    "stream=codec_name",
                    "-of",
                    "default=nw=1:nk=1",
                    filepath,
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=True,
            )
            return codec.stdout.strip()
        except Exception as e:
            log.write(
                log.GENERAL,
                level="error",
                message=f"func: get_codec error: {str(e.stderr)}",
            )

    @staticmethod
    def get_hwaccel_and_vcodec():
        log = Log()

        try:
            encoders_raw = subprocess.run(
                ["ffmpeg", "-encoders"], stdout=subprocess.PIPE, text=True, check=True
            ).stdout.lower()
            hwaccels_raw = subprocess.run(
                ["ffmpeg", "-hwaccels"], stdout=subprocess.PIPE, text=True, check=True
            ).stdout.lower()

            priority = [
                ("rkmpp", "h264_rkmpp"),
                ("v4l2m2m", "h264_v4l2m2m"),
                ("videotoolbox", "h264_videotoolbox"),
                ("qsv", "h264_qsv"),
                ("vaapi", "h264_vaapi"),
                ("cuda", "h264_nvenc"),
                ("d3d11va", "h264_amf"),
                ("dxva2", "h264_amf"),
                ("vdpau", "h264"),
            ]

            for hwaccel, encoder in priority:
                if hwaccel in hwaccels_raw and encoder in encoders_raw:
                    return hwaccel, encoder

            return None, "libx264"
        except Exception as e:
            log.write(
                log.GENERAL,
                level="error",
                message=f"func: get_hwaccel_and_vcodec error: {str(e.stderr)}",
            )
