from flask import Blueprint, jsonify, request
from app.models.camera_models import Camera
from app.models.record_models import Record
from app.schemas.record_schemas import RecordSchema, RecordIdsSchema
from app.services.record_services import delete_records
from sqlalchemy import and_
from app.decorators.auth_decorators import authentication_required
from app.decorators.permission_decorators import permission_required

record_bp = Blueprint("records", __name__, url_prefix="/api/cameras/")


@record_bp.route("<int:camera_pk>/records/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get_all(camera_pk):
    camera = Camera.query.get(camera_pk)

    if not camera:
        return jsonify({"error": "Camera was not found"}), 404

    records = camera.records
    records_schema = RecordSchema()
    records_data = records_schema.dump(records, many=True)

    return jsonify(records_data)


@record_bp.route("<int:camera_pk>/records/<int:record_pk>/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get(camera_pk, record_pk):
    record = Record.query.filter_by(id=record_pk, camera_id=camera_pk).first()

    if not record:
        return jsonify({"error": "Record was not found"}), 404

    record_schema = RecordSchema()
    record_data = record_schema.dump(record)

    return jsonify(record_data)


@record_bp.route("<int:camera_pk>/records/<int:record_pk>/", methods=["DELETE"])
@authentication_required()
@permission_required("delete_record")
def delete(camera_pk, record_pk):
    records = Record.query.filter_by(id=record_pk, camera_id=camera_pk).all()

    if not records:
        return jsonify({"error": "Record was not found"}), 404

    delete_records(records)

    return jsonify({}), 204


@record_bp.route("<int:camera_pk>/records/", methods=["DELETE"])
@authentication_required()
@permission_required("delete_record")
def delete_all(camera_pk):
    ids = request.get_json()

    schema = RecordIdsSchema()
    errors = schema.validate(ids)
    if errors:
        return jsonify(errors), 400

    records = Record.query.filter(
        and_(Record.camera_id == camera_pk, Record.id.in_(ids))
    ).all()

    if not records:
        return jsonify({"error": "No records found"}), 404

    delete_records(records)

    return jsonify({}), 204
