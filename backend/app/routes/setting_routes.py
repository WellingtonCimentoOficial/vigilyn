from flask import Blueprint, jsonify, request
from app.models.setting_models import Setting
from app.schemas.setting_schemas import SettingSchema
from app.services.setting_services import update_setting
from app.decorators.auth_decorators import authentication_required
from app.decorators.permission_decorators import permission_required

setting_bp = Blueprint("setting", __name__, url_prefix="/api/settings/")


@setting_bp.route("", methods=["GET"])
@authentication_required()
@permission_required("view_settings")
def get():
    setting = Setting.query.first()
    schema = SettingSchema()
    data = schema.dump(setting)

    return jsonify(data)


@setting_bp.route("", methods=["PATCH"])
@authentication_required()
@permission_required("update_settings")
def update():
    setting = Setting.query.first()

    schema = SettingSchema()
    request_data = schema.load(request.get_json())

    setting_update = update_setting(setting, **request_data)
    setting_updated_data = schema.dump(setting_update)

    return jsonify(setting_updated_data)
