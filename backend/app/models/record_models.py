from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, DateTime, func
from datetime import datetime
import psutil


class Record(db.Model):
    __tablename__ = "record_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    path: Mapped[str] = mapped_column(unique=True, nullable=False)
    camera_id: Mapped[int] = mapped_column(ForeignKey("camera_table.id"))
    camera: Mapped["Camera"] = relationship(back_populates="records")
    size_in_mb: Mapped[float] = mapped_column(default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class OrganizeRecord(db.Model):
    __tablename__ = "organize_record_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    pid: Mapped[int] = mapped_column(nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    def has_process_running(self):
        if (
            self.pid
            and psutil.pid_exists(self.pid)
            and psutil.Process(self.pid).create_time() == self.started_at.timestamp()
        ):
            return True

        return False
