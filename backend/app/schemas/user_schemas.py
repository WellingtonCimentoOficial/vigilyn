from marshmallow import Schema, fields, validate, validates_schema, ValidationError

name_validate = [
    validate.Length(min=5),
    validate.Regexp(r"^[a-zA-Z\s]+$", error="The name must be only letters."),
]
email_validate = [
    validate.Regexp(
        r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        error="The e-mail format is invalid.",
    )
]
password_validate = [
    validate.Regexp(
        r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$",
        error="The password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.",
    )
]


def validate_passwords_match(password, confirm_password):
    if password != confirm_password:
        raise ValidationError(
            "The passwords do not match.", field_name="confirm_password"
        )


class UserSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    email = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class UserCreateSchema(Schema):
    name = fields.Str(
        required=True,
        validate=name_validate,
    )
    email = fields.Str(
        required=True,
        validate=email_validate,
    )
    password = fields.Str(
        required=True,
        validate=password_validate,
    )
    confirm_password = fields.Str(required=True)

    @validates_schema
    def check_passwords_match(self, data, **kwargs):
        validate_passwords_match(
            password=data.get("password"), confirm_password=data.get("confirm_password")
        )


class UserLoginSchema(Schema):
    email = fields.Str(
        required=True,
        validate=email_validate,
    )
    password = fields.Str(
        required=True,
        validate=password_validate,
    )


class UserUpdateSchema(Schema):
    name = fields.Str(
        required=False,
        validate=name_validate,
    )
    password = fields.Str(
        required=False,
        validate=password_validate,
    )
    confirm_password = fields.Str(required=False)

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if "password" in data and "confirm_password" not in data:
            raise ValidationError(
                {
                    "confirm_password": [
                        "The 'confirm_password' field is required when 'password' is provided."
                    ]
                }
            )

    @validates_schema
    def check_passwords_match(self, data, **kwargs):
        validate_passwords_match(
            password=data.get("password"), confirm_password=data.get("confirm_password")
        )


class UserAdminUpdateSchema(UserUpdateSchema):
    email = fields.Str(
        required=False,
        validate=email_validate,
    )
