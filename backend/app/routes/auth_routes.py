from flask import Blueprint, request, jsonify, Response
from app.schemas.user_schemas import UserLoginSchema
from app.services.auth_services import login
from flask_jwt_extended import get_jwt_identity, get_jwt
from app.services.auth_services import generate_tokens, revoke_token
from app.schemas.auth_schemas import TokensSchema
from app.exceptions.token_exceptions import TokenInvalidException
from app.decorators.auth_decorators import authentication_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth/")


@auth_bp.route("/signin/", methods=["POST"])
def signin():
    data = UserLoginSchema().load(request.json)

    credentials = login(email=data["email"], password=data["password"])
    credentials_data = TokensSchema().load(credentials)

    return jsonify(credentials_data), 200


@auth_bp.route("/signout/", methods=["POST"])
@authentication_required(refresh=True)
def signout():
    try:
        jwt_data = get_jwt()
        refresh_token_jti = jwt_data["jti"]
        access_token_jti = jwt_data["access_jti"]
    except:
        raise TokenInvalidException()

    revoke_token(refresh_token_jti)
    revoke_token(access_token_jti)

    return Response(status=200)


@auth_bp.route("/refresh/", methods=["POST"])
@authentication_required(refresh=True)
def refresh_tokens():
    try:
        jwt_data = get_jwt()
        refresh_token_jti = jwt_data["jti"]
        access_token_jti = jwt_data["access_jti"]
    except:
        raise TokenInvalidException()

    user_id = get_jwt_identity()

    revoke_token(refresh_token_jti)
    revoke_token(access_token_jti)

    new_tokens = generate_tokens(identity=user_id)
    data = TokensSchema().load(new_tokens)

    return jsonify(data), 200
