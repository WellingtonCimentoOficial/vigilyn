from flask import Blueprint, jsonify
from app.utils.storage import get_storage
from app.schemas.storage_schemas import StorageSchema, StorageMonthlySchema
from app.services.storage_services import get_monthly_storage
from flask_jwt_extended import jwt_required

storage_bp = Blueprint("storahe", __name__, url_prefix="/api/storage/")


@storage_bp.route("", methods=["GET"])
@jwt_required()
def get():
    storage = get_storage()
    schema = StorageSchema()
    data = schema.load(storage)

    return jsonify(data)


@storage_bp.route("monthly/", methods=["GET"])
@jwt_required()
def get_monthly():
    monthly = get_monthly_storage()
    schema = StorageMonthlySchema(many=True)
    data = schema.load(monthly)

    return jsonify(data)
