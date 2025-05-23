from flask import Blueprint, jsonify, request, current_app
from app.models.camera_models import Camera
from app.schemas.camera_schemas import CameraSchema, CameraCreateUpdateSchema
from app.services.camera_services import (
    create_camera,
    delete_camera,
    update_camera,
    start_camera_async,
    stop_camera_async,
    restart_camera_async,
    filter_camera,
)
from app.services.record_services import (
    start_organize_records_async,
)
from app.services.storage_services import (
    start_storage_checker_async,
)
from app.decorators.auth_decorators import authentication_required
from app.decorators.permission_decorators import permission_required
from app.exceptions.camera_exceptions import (
    CameraProcessAlreadyRunningException,
    CameraProcessAlreadyStoppedException,
)
from app.utils.utils import generate_pagination_response

camera_bp = Blueprint("cameras", __name__, url_prefix="/api/cameras/")


@camera_bp.route("", methods=["GET"])
@authentication_required()
@permission_required("view_camera")
def get_all():
    search_param = request.args.get("search", default="")
    page_param = request.args.get("page", default=1)
    pid_param = request.args.get("pid")
    is_recording_param = request.args.get("is_recording")
    requires_restart_param = request.args.get("requires_restart")
    limit_param = request.args.get(
        "limit", default=current_app.config["DEFAULT_PAGINATION_LIMIT"],
        type=int
    )

    cameras, total = filter_camera(
        search_param=search_param,
        pid_param=pid_param,
        requires_restart_param=requires_restart_param,
        is_recording_param=is_recording_param,
        limit=limit_param,
        page=page_param,
    )
    cameras_schema = CameraSchema(many=True).dump(cameras)
    
    data = generate_pagination_response(
        current_page=page_param, 
        total_count=total,
        limit=limit_param, 
        data=cameras_schema
    )
    
    return jsonify(data)


@camera_bp.route("<int:pk>/", methods=["GET"])
@authentication_required()
@permission_required("view_camera")
def get(pk):
    camera = Camera.query.get_or_404(pk)
    schema = CameraSchema()
    camera_schema = schema.dump(camera)

    return jsonify(camera_schema)


@camera_bp.route("", methods=["POST"])
@authentication_required()
@permission_required("create_camera")
def create():
    schema = CameraCreateUpdateSchema()
    data = schema.load(request.json)
    
    new_camera = create_camera(**data)
    new_camera_schema = CameraSchema()
    new_camera_data = new_camera_schema.dump(new_camera)

    return jsonify(new_camera_data), 201


@camera_bp.route("<int:pk>/", methods=["PATCH"])
@authentication_required()
@permission_required("update_camera")
def update(pk):
    camera = Camera.query.get_or_404(pk)
    schema = CameraCreateUpdateSchema()
    data = schema.load(request.json)
    
    camera_updated = update_camera(camera, **data)
    camera_updated_schema = CameraSchema()
    camera_updated_data = camera_updated_schema.dump(camera_updated)

    return jsonify(camera_updated_data)


@camera_bp.route("<int:pk>/", methods=["DELETE"])
@authentication_required()
@permission_required("delete_camera")
def delete(pk):
    camera = Camera.query.get_or_404(pk)
    delete_camera(camera)

    return jsonify({"message": "The camera was deleted successfully!"}), 200


@camera_bp.route("<int:pk>/start/", methods=["POST"])
@authentication_required()
@permission_required("start_camera")
def start(pk):
    camera = Camera.query.get_or_404(pk)

    if camera.has_process_running():
        raise CameraProcessAlreadyRunningException()

    camera_with_pid = start_camera_async(camera)
    schema = CameraSchema()
    data = schema.dump(camera_with_pid)

    start_organize_records_async()
    start_storage_checker_async()

    return jsonify(data), 200


@camera_bp.route("<int:pk>/stop/", methods=["POST"])
@authentication_required()
@permission_required("stop_camera")
def stop(pk):
    camera = Camera.query.get_or_404(pk)

    if not camera.has_process_running():
        raise CameraProcessAlreadyStoppedException()

    stop_camera_async(camera.id)

    return jsonify({"message": "The camera was stopped successfully!"}), 200


@camera_bp.route("<int:pk>/restart/", methods=["POST"])
@authentication_required()
@permission_required("restart_camera")
def restart(pk):
    camera = Camera.query.get_or_404(pk)
    restart_camera_async(camera.id)

    return jsonify({"message": "The camera was restarted successfully!"})
