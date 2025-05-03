from flask import Blueprint, jsonify
from app.services.record_services import (
    restart_organize_records_async,
    stop_organize_records_async,
)
from app.services.camera_services import (
    restart_all_cameras_async,
    stop_all_cameras_async,
)
from app.services.setting_services import update_requires_restart
from app.services.storage_services import (
    stop_storage_checker_async,
    restart_storage_checker_async,
)
from flask_jwt_extended import jwt_required

system_bp = Blueprint("system", __name__, url_prefix="/api/system/")


@system_bp.route("restart/", methods=["POST"])
@jwt_required()
def restart():
    restart_all_cameras_async(only_active=True)
    restart_organize_records_async()
    restart_storage_checker_async()
    update_requires_restart(False)

    return jsonify({}), 200


@system_bp.route("stop/", methods=["POST"])
@jwt_required()
def stop():
    stop_all_cameras_async()
    stop_organize_records_async()
    stop_storage_checker_async()

    return jsonify({}), 200
