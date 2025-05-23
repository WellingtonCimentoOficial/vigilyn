from marshmallow import Schema, fields, validate, validates, ValidationError


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
    is_recording = fields.Bool()


class CameraCreateUpdateSchema(Schema):
    name = fields.Str(
        required=True,
        validate=[
            validate.Length(
                min=4,
                max=15,
                error="The name must contain at least 3 characters and a maximum of 15.",
            )
        ],
    )
    ip_address = fields.Str(
        required=True,
        validate=[
            validate.Regexp(
                r"^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$",
                error="Only numbers between 0.0.0.0 and 255.255.255.255 are allowed.",
            )
        ],
    )
    port = fields.Int(required=True)

    @validates("port")
    def validate_port(self, value, **kwargs):
        if not (1 <= value <= 65535):
            raise ValidationError("Port must be a number between 1 and 65535.")

    username = fields.Str(required=False)
    password = fields.Str(required=False)
    path = fields.Str(
        required=False,
        validate=[
            validate.Regexp(
                r"^\/(?:[a-zA-Z0-9_-]+\/?)*$",
                error="Path must be a relative path starting with /."
            )
        ]
    )
