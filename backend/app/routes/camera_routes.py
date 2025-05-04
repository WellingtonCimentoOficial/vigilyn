from flask import Blueprint, jsonify, request, Response
from app.models.camera_models import Camera
from app.schemas.camera_schemas import CameraSchema, CameraCreateUpdateSchema
from app.services.camera_services import (
    create_camera,
    delete_camera,
    update_camera,
    start_camera_async,
    stop_camera_async,
    restart_camera_async,
)
from app.services.record_services import (
    start_organize_records_async,
)
from app.services.storage_services import (
    start_storage_checker_async,
)
from flask_jwt_extended import jwt_required
from app.exceptions.camera_exceptions import (
    CameraWasNotFoundException,
    CameraProcessAlreadyRunningException,
    CameraProcessAlreadyStoppedException,
)

camera_bp = Blueprint("cameras", __name__, url_prefix="/api/cameras/")


@camera_bp.route("", methods=["GET"])
@jwt_required()
def get_all():
    all_cameras = Camera.query.all()

    schema = CameraSchema()
    data = schema.dump(all_cameras, many=True)

    return jsonify(data)


@camera_bp.route("<int:pk>/", methods=["GET"])
@jwt_required()
def get(pk):
    camera = Camera.query.get(pk)

    if not camera:
        raise CameraWasNotFoundException()

    schema = CameraSchema()
    camera_schema = schema.dump(camera)

    return jsonify(camera_schema)


@camera_bp.route("", methods=["POST"])
@jwt_required()
def create():
    schema = CameraCreateUpdateSchema()
    data = schema.load(request.json)

    new_camera = create_camera(**data)
    new_camera_schema = CameraSchema()
    new_camera_data = new_camera_schema.dump(new_camera)

    return jsonify(new_camera_data), 201


@camera_bp.route("<int:pk>/", methods=["PUT"])
@jwt_required()
def update(pk):
    camera = Camera.query.get(pk)

    if not camera:
        raise CameraWasNotFoundException()

    schema = CameraCreateUpdateSchema()
    data = schema.load(request.json)

    camera_updated = update_camera(camera, **data)
    camera_updated_schema = CameraSchema()
    camera_updated_data = camera_updated_schema.dump(camera_updated)

    return jsonify(camera_updated_data)


@camera_bp.route("<int:pk>/", methods=["DELETE"])
@jwt_required()
def delete(pk):
    camera = Camera.query.get(pk)

    if not camera:
        raise CameraWasNotFoundException()

    delete_camera(camera)

    return Response(status=204)


@camera_bp.route("<int:pk>/start/", methods=["POST"])
@jwt_required()
def start(pk):
    camera = Camera.query.get(pk)

    if not camera:
        raise CameraWasNotFoundException()

    if camera.has_process_running():
        raise CameraProcessAlreadyRunningException()

    camera_with_pid = start_camera_async(camera)
    schema = CameraSchema()
    data = schema.dump(camera_with_pid)

    start_organize_records_async()
    start_storage_checker_async()

    return jsonify(data), 200


@camera_bp.route("<int:pk>/stop/", methods=["POST"])
@jwt_required()
def stop(pk):
    camera = Camera.query.get(pk)

    if not camera:
        raise CameraWasNotFoundException()

    if not camera.has_process_running():
        raise CameraProcessAlreadyStoppedException()

    stop_camera_async(camera.id)

    return Response(status=200)


@camera_bp.route("<int:pk>/restart/", methods=["POST"])
@jwt_required()
def restart(pk):
    camera = Camera.query.get(pk)

    if not camera:
        raise CameraWasNotFoundException()

    restart_camera_async(camera.id)

    return Response(status=200)
