from flask import Blueprint, jsonify, request, send_file, current_app
from app.models.record_models import Record
from app.schemas.record_schemas import RecordSchema, RecordIdsSchema
from app.services.record_services import delete_records, filter_record
from app.decorators.auth_decorators import authentication_required
from app.decorators.permission_decorators import permission_required
from app.utils.utils import generate_pagination_response
from app.exceptions.record_exceptions import (
    RecordNotFoundException,
    RecordThumbnailNotFoundException,
)
import os

record_bp = Blueprint("records", __name__, url_prefix="/api/records/")


@record_bp.route("", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get_all():
    search_param = request.args.get("search", default="")
    page_param = request.args.get("page", default=1)
    limit_param = request.args.get(
        "limit", default=current_app.config["DEFAULT_PAGINATION_LIMIT"], type=int
    )

    records, total = filter_record(
        search_param=search_param, limit=limit_param, page=page_param
    )
    records_schema = RecordSchema(many=True).dump(records)

    data = generate_pagination_response(
        current_page=page_param,
        total_count=total,
        limit=limit_param,
        data=records_schema,
    )

    return jsonify(data)


@record_bp.route("<int:record_pk>/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    record_schema = RecordSchema()
    record_data = record_schema.dump(record)

    return jsonify(record_data)


@record_bp.route("<int:record_pk>/video/", methods=["GET"])
# @authentication_required()
# @permission_required("view_record")
def play_video(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    if not os.path.isfile(record.path):
        raise RecordNotFoundException()

    return send_file(record.path)


@record_bp.route("<int:record_pk>/video/download/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def download_video(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    if not os.path.isfile(record.path):
        raise RecordNotFoundException()

    return send_file(record.path, as_attachment=True)


@record_bp.route("<int:record_pk>/video/thumbnail/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get_thumbnail(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    if not os.path.isfile(record.thumbnail_path):
        raise RecordThumbnailNotFoundException()

    return send_file(record.thumbnail_path)


@record_bp.route("<int:record_pk>/", methods=["DELETE"])
@authentication_required()
@permission_required("delete_record")
def delete(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    delete_records([record])

    return jsonify({"message": "The record was deleted successfully!"}), 200


@record_bp.route("", methods=["DELETE"])
@authentication_required()
@permission_required("delete_record")
def delete_all():
    schema = RecordIdsSchema()
    data = schema.load(request.json)

    records = Record.query.filter(Record.id.in_(data["ids"])).all()

    if not records:
        return jsonify({"error": "No records found"}), 404

    delete_records(records)

    return jsonify({"message": "The records was deleted successfully!"}), 200
