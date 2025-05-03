from marshmallow import Schema, fields


class TokensSchema(Schema):
    access_token = fields.Str()
    refresh_token = fields.Str()
