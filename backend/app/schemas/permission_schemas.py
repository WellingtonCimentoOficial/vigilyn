from marshmallow import Schema, fields


class PermissionSchema(Schema):
    id = fields.Int()
    name = fields.Str()
