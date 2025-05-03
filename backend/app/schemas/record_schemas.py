from marshmallow import Schema, fields


class RecordSchema(Schema):
    id = fields.Int(dump_only=True)
    path = fields.Str()
    created_at = fields.DateTime(dump_only=True)


class RecordIdsSchema(Schema):
    ids = fields.List(fields.Int(), required=True)
