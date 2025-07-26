from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, DateTime, func
from datetime import datetime
from typing import List
import psutil


class Thumbnail(db.Model):
    __tablename__ = "thumbnail_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    path: Mapped[str] = mapped_column(unique=True, nullable=False)
    size_in_mb: Mapped[float] = mapped_column(default=0, nullable=False)
    record: Mapped["Record"] = relationship(back_populates="thumbnail")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class Record(db.Model):
    __tablename__ = "record_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    path: Mapped[str] = mapped_column(unique=True, nullable=False)
    format: Mapped[str] = mapped_column(nullable=False)
    size_in_mb: Mapped[float] = mapped_column(default=0, nullable=False)
    duration_seconds: Mapped[float] = mapped_column(nullable=False)
    is_public: Mapped[bool] = mapped_column(default=False, nullable=False)
    thumbnail_id: Mapped[int] = mapped_column(
        ForeignKey("thumbnail_table.id", ondelete="CASCADE"), nullable=False
    )
    thumbnail: Mapped["Thumbnail"] = relationship(
        back_populates="record", single_parent=True
    )
    camera_id: Mapped[int] = mapped_column(ForeignKey("camera_table.id"))
    camera: Mapped["Camera"] = relationship(back_populates="records")
    favorites: Mapped[List["UserFavorite"]] = relationship(
        secondary="user_favorite_record_table", back_populates="records"
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


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
