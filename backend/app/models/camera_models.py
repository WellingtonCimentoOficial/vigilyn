from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime
from sqlalchemy import DateTime, func
import psutil


class Camera(db.Model):
    __tablename__ = "camera_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    profile_color: Mapped[str] = mapped_column(default="#ff5100", nullable=False)
    ip_address: Mapped[str] = mapped_column(nullable=False)
    port: Mapped[int] = mapped_column(default=554, nullable=False)
    username: Mapped[str] = mapped_column(default="", nullable=False)
    password: Mapped[str] = mapped_column(default="", nullable=False)
    path: Mapped[str] = mapped_column(default="/", nullable=False)
    codec: Mapped[str] = mapped_column(default="h264", nullable=False)
    records: Mapped[List["Record"]] = relationship(back_populates="camera")
    pid: Mapped[int] = mapped_column(nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    requires_restart: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_recording: Mapped[bool] = mapped_column(default=False, nullable=False)

    def has_process_running(self):
        if (
            self.pid
            and psutil.pid_exists(self.pid)
            and psutil.Process(self.pid).create_time() == self.started_at.timestamp()
        ):
            return True

        return False
