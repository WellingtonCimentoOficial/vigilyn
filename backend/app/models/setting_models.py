from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column


class Setting(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    tmp_directory_path: Mapped[str] = mapped_column(nullable=False)
    save_directory_path: Mapped[str] = mapped_column(nullable=False)
    allow_notifications: Mapped[bool] = mapped_column(nullable=False, default=True)
    segment_time: Mapped[int] = mapped_column(default=300, nullable=False)
    requires_restart: Mapped[bool] = mapped_column(default=False, nullable=False)
    auto_delete_enabled: Mapped[bool] = mapped_column(default=True, nullable=False)
