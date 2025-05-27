from marshmallow import Schema, fields


class RecordSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    path = fields.Str()
    duration_seconds = fields.Float(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class RecordIdsSchema(Schema):
    ids = fields.List(fields.Int(), required=True)
