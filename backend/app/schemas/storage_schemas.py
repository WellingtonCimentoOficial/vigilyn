from marshmallow import Schema, fields


class StorageSchema(Schema):
    free = fields.Float()
    used = fields.Float()
    total = fields.Float()
    percent_used = fields.Float()


class StorageMonthlySchema(Schema):
    id = fields.Int()
    month = fields.Str()
    total = fields.Float()
