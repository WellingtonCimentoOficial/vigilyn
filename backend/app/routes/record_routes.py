from flask import Blueprint, jsonify, request, send_file, current_app
from app.models.record_models import Record
from app.schemas.record_schemas import RecordSchema, RecordUpdateSchema
from app.services.record_services import (
    delete_records,
    delete_records_async,
    filter_record,
    update_record,
)
from app.decorators.auth_decorators import (
    authentication_required,
    required_record_token,
)
from app.decorators.permission_decorators import permission_required
from app.utils.utils import generate_pagination_response
from app.exceptions.record_exceptions import (
    RecordNotFoundException,
    RecordThumbnailNotFoundException,
    NoRecordingsFoundException,
)
from app.models.user_models import User
from flask_jwt_extended import get_jwt_identity
from datetime import datetime, timezone, timedelta
import os
import zipfile
import tempfile
import jwt

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
    show_favorites_param = request.args.get("show_favorites")
    initial_date_param = request.args.get("initial_date")
    final_date_param = request.args.get("final_date")
    initial_hour_param = request.args.get("initial_hour")
    final_hour_param = request.args.get("final_hour")
    camera_ids_param = request.args.getlist("camera_id")

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    records, total = filter_record(
        search_param=search_param,
        limit=limit_param,
        page=page_param,
        show_favorites_param=show_favorites_param,
        initial_date_param=initial_date_param,
        final_date_param=final_date_param,
        initial_hour_param=initial_hour_param,
        final_hour_param=final_hour_param,
        favorite_record_ids=[record.id for record in user.favorite.records],
        camera_ids_param=camera_ids_param,
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


@record_bp.route("<int:record_pk>/video/token/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get_video_token(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    if not os.path.isfile(record.path):
        raise RecordNotFoundException()

    secret_key = current_app.config["JWT_SECRET_KEY"]
    exp = datetime.now(timezone.utc) + timedelta(seconds=record.duration_seconds + 120)

    payload = {"user_id": int(get_jwt_identity()), "video_id": record_pk, "exp": exp}

    token = jwt.encode(payload, secret_key, algorithm="HS256")

    return jsonify({"token": token})


@record_bp.route("<int:record_pk>/video/", methods=["GET"])
@required_record_token()
def play_video(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    if not os.path.isfile(record.path):
        raise RecordNotFoundException()

    return send_file(
        record.path,
        mimetype=f"video/mp4",
        as_attachment=False,
        conditional=True,
    )


@record_bp.route("<int:record_pk>/video/download/", methods=["GET"])
@authentication_required()
@permission_required("download_record")
def download(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    if not os.path.isfile(record.path):
        raise RecordNotFoundException()

    return send_file(record.path, as_attachment=True)


@record_bp.route("videos/download/", methods=["GET"])
@authentication_required()
@permission_required("download_record")
def download_multiple():
    ids = request.args.getlist("id", type=int)

    records = Record.query.filter(Record.id.in_(ids)).all()

    if not records:
        raise NoRecordingsFoundException()

    temp_zip = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    zip_path = temp_zip.name

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for record in records:
            if os.path.isfile(record.path):
                zipf.write(record.path, arcname=os.path.basename(record.path))

    response = send_file(zip_path, as_attachment=True, download_name="videos.zip")

    @response.call_on_close
    def cleanup():
        try:
            os.remove(zip_path)
        except Exception:
            pass

    return response


@record_bp.route("<int:record_pk>/video/thumbnail/", methods=["GET"])
@authentication_required()
@permission_required("view_record")
def get_thumbnail(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()

    thumbnail_path = record.thumbnail.path

    if not os.path.isfile(thumbnail_path):
        raise RecordThumbnailNotFoundException()

    return send_file(thumbnail_path)


@record_bp.route("<int:record_pk>/", methods=["PATCH"])
@authentication_required()
@permission_required("edit_record")
def update(record_pk):
    record = Record.query.filter_by(id=record_pk).first_or_404()
    schema = RecordUpdateSchema()
    data = schema.load(request.json)

    record_updated = update_record(record, **data)
    record_updated_schema = RecordSchema()
    record_updated_data = record_updated_schema.dump(record_updated)

    return jsonify(record_updated_data)


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
def delete_multiple():
    ids = request.args.getlist("id", type=int)

    records = Record.query.filter(Record.id.in_(ids)).all()

    if not records:
        raise NoRecordingsFoundException()

    delete_records_async(ids)

    return jsonify({"message": "The records was deleted successfully!"}), 200
