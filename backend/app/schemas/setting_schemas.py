from marshmallow import Schema, fields, validate

validators = [
    validate.Regexp(
        r"^\/(?:[a-zA-Z0-9_-]+\/?)*$",
        error="Path must start with '/' and only contain valid folder names (letters, numbers, -, _).",
    )
]


class SettingUpdateSchema(Schema):
    save_directory_path = fields.Str(validate=validators)
    allow_notifications = fields.Bool()
    tmp_directory_path = fields.Str(validate=validators)
    video_format = fields.Str()
    segment_time = fields.Int()
    auto_delete_enabled = fields.Bool()


class SettingSchema(SettingUpdateSchema):
    requires_restart = fields.Bool()
