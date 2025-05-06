from marshmallow import Schema, fields
from .permission_schemas import PermissionSchema


class RoleSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    permissions = fields.List(fields.Nested(PermissionSchema))
