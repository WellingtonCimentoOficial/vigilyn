import logging
import os
from .settings import get_settings


class Log:
    STORAGE = "[STORAGE]"
    RTSP = "[RTSP]"
    ORGANIZER = "[ORGANIZER]"
    METADATA = "[METADATA]"

    def __init__(self, output_filename="log.txt"):
        self.output_filename = output_filename
        self._logger_initialized = False

    def _initialize_logger(self):
        if self._logger_initialized:
            return

        base_dir = get_settings().save_directory_path
        log_path = os.path.join(base_dir, self.output_filename)

        logging.basicConfig(
            filename=log_path,
            level=logging.INFO,
            format="%(asctime)s [%(levelname)s] %(message)s",
            datefmt="%d-%m-%Y %H:%M:%S",
        )
        self._logger_initialized = True

    def write(
        self,
        category,
        message,
        level="info",
    ):
        self._initialize_logger()

        level = level.lower()

        if level == "info":
            logging.info(f"{category} {message}")
        elif level == "error":
            logging.error(f"{category} {message}")
        elif level == "warning":
            logging.warning(f"{category} {message}")
        elif level == "critical":
            logging.critical(f"{category} {message}")
        else:
            logging.info(f"{category} {message}")
