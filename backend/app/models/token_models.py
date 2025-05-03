from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, func, String, ForeignKey
from datetime import datetime


class TokenBlocklist(db.Model):
    __table_name__ = "token_blocklist_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(36), unique=True, nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"))
    user: Mapped["User"] = relationship(back_populates="tokens")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
