from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, func, String, ForeignKey
from datetime import datetime


class Token(db.Model):
    __tablename__ = "token_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    access_jti: Mapped[str] = mapped_column(String(36), unique=True, nullable=True)
    refresh_jti: Mapped[str] = mapped_column(String(36), unique=True, nullable=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user_table.id", ondelete="CASCADE"), nullable=False
    )
    user: Mapped["User"] = relationship(back_populates="tokens")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class TokenBlocklist(db.Model):
    __table_name__ = "token_blocklist_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str] = mapped_column(String(36), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
