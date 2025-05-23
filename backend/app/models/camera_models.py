from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
import psutil


class Camera(db.Model):
    __tablename__ = "camera_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    ip_address: Mapped[str] = mapped_column(nullable=False)
    port: Mapped[int] = mapped_column(default=554, nullable=False)
    username: Mapped[str] = mapped_column(default="", nullable=False)
    password: Mapped[str] = mapped_column(default="", nullable=False)
    path: Mapped[str] = mapped_column(default="/", nullable=False)
    records: Mapped[List["Record"]] = relationship(back_populates="camera")
    pid: Mapped[int] = mapped_column(nullable=True)
    requires_restart: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_recording: Mapped[bool] = mapped_column(default=False, nullable=False)

    def has_process_running(self):
        if self.pid and psutil.pid_exists(self.pid):
            return True

        return False
