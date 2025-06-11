from app.extensions import db, bcrypt
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, func, String, ForeignKey
from datetime import datetime
from typing import List


class User(db.Model):
    __tablename__ = "user_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    profile_color: Mapped[str] = mapped_column(default="#ff5100", nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    tokens: Mapped[List["Token"]] = relationship(
        back_populates="user", cascade="all, delete", passive_deletes=True
    )
    roles: Mapped[List["Role"]] = relationship(
        secondary="user_role_table", back_populates="users"
    )
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    favorite: Mapped["UserFavorite"] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    def check_password(self, password):
        is_correct = bcrypt.check_password_hash(self.password, password)
        return is_correct

    def has_permission(self, permission_name):
        for role in self.roles:
            exists = any(
                permission.name == permission_name for permission in role.permissions
            )
            if exists:
                return True

        return False


class UserFavorite(db.Model):
    __tablename__ = "user_favorite_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"))
    user: Mapped["User"] = relationship(back_populates="favorite", single_parent=True)
    records: Mapped[List["Record"]] = relationship(
        secondary="user_favorite_record_table", back_populates="favorites"
    )
