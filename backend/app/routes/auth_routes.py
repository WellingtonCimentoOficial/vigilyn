from flask import Blueprint, request, jsonify
from app.schemas.user_schemas import UserCreateSchema, UserLoginSchema
from marshmallow import ValidationError
from app.services.user_services import create_user, login_user
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.auth_services import generate_tokens, revoke_token
from app.schemas.auth_schemas import TokensSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth/")


@auth_bp.route("/signup/", methods=["POST"])
def signup():
    try:
        data = UserCreateSchema().load(request.json)
        created, _ = create_user(
            name=data["name"], email=data["email"], password=data["password"]
        )
        if created:
            return jsonify({"message": "The user was created successfully."}), 201
        return jsonify({"message": "The user was not created."}), 400
    except ValidationError as err:
        return jsonify(err.messages), 400


@auth_bp.route("/signin/", methods=["POST"])
def signin():
    try:
        data = UserLoginSchema().load(request.json)

        credentials = login_user(email=data["email"], password=data["password"])
        if credentials:
            credentials_data = TokensSchema().load(credentials)
            return jsonify(credentials_data), 200
        return jsonify({"error": "The username or password is invalid."})
    except ValidationError as err:
        return jsonify(err.messages), 500


@auth_bp.route("/signout/", methods=["POST"])
@jwt_required(refresh=True)
def signout():
    try:
        jwt_data = get_jwt()
        refresh_token_jti = jwt_data["jti"]
        access_token_jti = jwt_data["access_jti"]
    except:
        return jsonify({"error": "The token is invalid!"}), 400

    user_id = get_jwt_identity()
    revoke_token(user_id, refresh_token_jti)
    revoke_token(user_id, access_token_jti)

    return jsonify({}), 200


@auth_bp.route("/refresh/", methods=["POST"])
@jwt_required(refresh=True)
def refresh_tokens():
    try:
        jwt_data = get_jwt()
        refresh_token_jti = jwt_data["jti"]
        access_token_jti = jwt_data["access_jti"]
    except:
        return jsonify({"error": "The token is invalid!"}), 400

    user_id = get_jwt_identity()

    revoke_token(user_id, refresh_token_jti)
    revoke_token(user_id, access_token_jti)

    new_tokens = generate_tokens(identity=user_id)
    data = TokensSchema().load(new_tokens)

    return jsonify(data), 200
