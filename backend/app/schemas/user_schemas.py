from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class UserSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    email = fields.Str()
    password = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class UserCreateSchema(Schema):
    name = fields.Str(
        required=True,
        validate=[
            validate.Length(min=5),
            validate.Regexp("^[a-zA-Z]+$", error="The name must be only letters."),
        ],
    )
    email = fields.Str(
        required=True,
        validate=[
            validate.Regexp(
                r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
                error="The e-mail format is invalid.",
            )
        ],
    )
    password = fields.Str(
        required=True,
        validate=[
            validate.Regexp(
                r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$",
                error="The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.",
            )
        ],
    )
    confirm_password = fields.Str(required=True)

    @validates_schema
    def validate_passwords_match(self, data, **kwargs):
        if data.get("password") != data.get("confirm_password"):
            raise ValidationError(
                "The passwords do not match.", field_name="confirm_password"
            )


class UserLoginSchema(Schema):
    email = fields.Str(
        required=True,
        validate=[
            validate.Regexp(
                r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
                error="The e-mail format is invalid.",
            )
        ],
    )
    password = fields.Str(
        required=True,
        validate=[
            validate.Regexp(
                r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$",
                error="The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.",
            )
        ],
    )
