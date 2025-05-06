from sqlalchemy import Column, Table, ForeignKey
from app.extensions import db

user_role_table = Table(
    "user_role_table",
    db.metadata,
    Column("user_id", ForeignKey("user_table.id"), primary_key=True),
    Column("role_id", ForeignKey("role_table.id"), primary_key=True),
)

role_permission_table = Table(
    "role_permission_table",
    db.metadata,
    Column("role_id", ForeignKey("role_table.id"), primary_key=True),
    Column("permission_id", ForeignKey("permission_table.id"), primary_key=True),
)
