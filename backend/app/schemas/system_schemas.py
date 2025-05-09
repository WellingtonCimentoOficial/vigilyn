from marshmallow import Schema, fields


class CpuSchema(Schema):
    cores = fields.Int()
    threads = fields.Int()
    percent_used = fields.Float()


class RamSchema(Schema):
    free = fields.Float()
    used = fields.Float()
    total = fields.Float()
    percent_used = fields.Float()


class StorageSchema(Schema):
    free = fields.Float()
    used = fields.Float()
    total = fields.Float()
    percent_used = fields.Float()


class StorageMonthlySchema(Schema):
    id = fields.Int()
    month = fields.Str()
    total = fields.Float()


class SystemSchema(Schema):
    cpu = fields.Nested(CpuSchema)
    ram = fields.Nested(RamSchema)
    storage = fields.Nested(StorageSchema)
