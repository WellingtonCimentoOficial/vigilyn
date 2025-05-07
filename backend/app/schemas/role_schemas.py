from marshmallow import Schema, fields
from marshmallow.validate import Length
from .permission_schemas import PermissionSchema


class RoleSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    permissions = fields.List(fields.Nested(PermissionSchema))


class RoleUpdateSchema(Schema):
    role_ids = fields.List(fields.Int(), required=True, validate=Length(min=1))
