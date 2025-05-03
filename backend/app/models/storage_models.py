from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, func
from datetime import datetime
import psutil


class StorageChecker(db.Model):
    __tablename__ = "storage_checker_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    pid: Mapped[int] = mapped_column(nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    def has_process_running(self):
        if self.pid and psutil.pid_exists(self.pid):
            return True

        return False
