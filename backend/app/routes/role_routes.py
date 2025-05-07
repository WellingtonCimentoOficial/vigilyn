from flask import Blueprint, jsonify
from app.models.role_models import Role
from app.schemas.role_schemas import RoleSchema
from app.decorators.auth_decorators import authentication_required
from app.decorators.permission_decorators import permission_required

role_bp = Blueprint("role", __name__, url_prefix="/api/roles/")


@role_bp.route("", methods=["GET"])
@authentication_required()
@permission_required("view_role")
def get_all():
    roles = Role.query.all()
    schema = RoleSchema(many=True)
    data = schema.dump(roles)

    return jsonify(data), 200


@role_bp.route("<int:pk>/", methods=["GET"])
@authentication_required()
@permission_required("view_role")
def get(pk):
    role = Role.query.get_or_404(pk)
    schema = RoleSchema()
    data = schema.dump(role)

    return jsonify(data), 200
