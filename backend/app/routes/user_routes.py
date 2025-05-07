from flask import Blueprint, jsonify, request
from app.decorators.auth_decorators import authentication_required
from app.models.user_models import User
from app.schemas.user_schemas import (
    UserSchema,
    UserUpdateSchema,
    UserCreateSchema,
    UserAdminUpdateSchema,
)
from app.schemas.role_schemas import RoleSchema, RoleUpdateSchema
from app.services.user_services import update_user, delete_user, create_user
from app.services.role_services import update_roles
from app.decorators.permission_decorators import permission_required
from flask_jwt_extended import get_jwt_identity

user_bp = Blueprint("user", __name__, url_prefix="/api/users/")


@user_bp.route("", methods=["POST"])
@authentication_required()
@permission_required("create_user")
def create():
    data = UserCreateSchema().load(request.json)
    create_user(name=data["name"], email=data["email"], password=data["password"])

    return jsonify({"message": "The user was created successfully."}), 201


@user_bp.route("", methods=["GET"])
@authentication_required()
@permission_required("view_all_users")
def get_all():
    users = User.query.all()
    schema = UserSchema()
    data = schema.dump(users, many=True)
    return jsonify(data), 200


@user_bp.route("me/", methods=["GET"])
@authentication_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    schema = UserSchema()
    data = schema.dump(user)
    return jsonify(data), 200


@user_bp.route("me/", methods=["PATCH"])
@authentication_required()
def update_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    schema = UserUpdateSchema()
    data = schema.load(request.json)
    data.pop("confirm_password", None)

    updated_user = update_user(user, **data)
    user_schema = UserSchema()
    updated_data = user_schema.dump(updated_user)

    return jsonify(updated_data), 200


@user_bp.route("<int:pk>/", methods=["GET"])
@authentication_required()
@permission_required("view_user")
def get(pk):
    user = User.query.get_or_404(pk)
    schema = UserSchema()
    data = schema.dump(user)
    return jsonify(data), 200


@user_bp.route("<int:pk>/", methods=["PATCH"])
@authentication_required()
@permission_required("update_user")
def update(pk):
    user = User.query.get_or_404(pk)
    schema = UserAdminUpdateSchema()
    data = schema.load(request.json)
    data.pop("confirm_password", None)

    updated_user = update_user(user, **data)
    user_schema = UserSchema()
    updated_data = user_schema.dump(updated_user)

    return jsonify(updated_data), 200


@user_bp.route("<int:pk>/", methods=["DELETE"])
@authentication_required()
@permission_required("delete_user")
def delete(pk):
    user = User.query.get_or_404(pk)
    delete_user(user)

    return jsonify({"message": "The user was deleted successfully!"}), 200


@user_bp.route("<int:pk>/roles/", methods=["GET"])
@authentication_required()
@permission_required("view_roles")
def get_user_roles(pk):
    user = User.query.get_or_404(pk)
    schema = RoleSchema(many=True)
    data = schema.dump(user.roles)

    return jsonify(data), 200


@user_bp.route("<int:pk>/roles/", methods=["PUT"])
@authentication_required()
@permission_required("update_roles")
def update_user_roles(pk):
    user = User.query.get_or_404(pk)
    schema = RoleUpdateSchema()

    data = schema.load(request.json)
    role_ids = data["role_ids"]

    update_roles(user, role_ids)

    return jsonify({"message": "The roles was updated successfully!"}), 200
