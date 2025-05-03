from marshmallow import Schema, fields


class SettingSchema(Schema):
    save_directory_path = fields.Str()
    allow_notifications = fields.Bool()
    tmp_directory_path = fields.Str()
    video_format = fields.Str()
    segment_time = fields.Int()
    requires_restart = fields.Bool()
