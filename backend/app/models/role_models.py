from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List


class Role(db.Model):
    __tablename__ = "role_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    permissions: Mapped[List["Permission"]] = relationship(
        secondary="role_permission_table", back_populates="roles"
    )
    users: Mapped[List["User"]] = relationship(
        secondary="user_role_table", back_populates="roles"
    )
