from app.extensions import db, bcrypt
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, func, String, ForeignKey
from datetime import datetime
from typing import List


class User(db.Model):
    __tablename__ = "user_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    tokens: Mapped[List["TokenBlocklist"]] = relationship(back_populates="user")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    def check_password(self, password):
        is_correct = bcrypt.check_password_hash(self.password, password)
        return is_correct
