from marshmallow import Schema, fields


class CameraSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    ip_address = fields.Str()
    port = fields.Int()
    username = fields.Str()
    password = fields.Str()
    path = fields.Str()
    pid = fields.Int(allow_none=True)
    requires_restart = fields.Bool()


class CameraCreateUpdateSchema(Schema):
    name = fields.Str()
    ip_address = fields.Str()
    port = fields.Int()
    username = fields.Str()
    password = fields.Str()
    path = fields.Str()
