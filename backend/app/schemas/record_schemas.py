from marshmallow import Schema, fields, validate


class RecordSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    path = fields.Str(dump_only=True)
    format = fields.Str(dump_only=True)
    duration_seconds = fields.Float(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class RecordIdsSchema(Schema):
    ids = fields.List(fields.Int(), required=True)


class RecordUpdateSchema(Schema):
    name = fields.Str(
        required=True,
        validate=[
            validate.Length(
                min=10,
                max=130,
                error="The name must contain at least 10 characters and a maximum of 130.",
            )
        ],
    )
