from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List


class Permission(db.Model):
    __tablename__ = "permission_table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    roles: Mapped[List["Role"]] = relationship(
        secondary="role_permission_table", back_populates="permissions"
    )
