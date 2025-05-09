from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from app.models.token_models import TokenBlocklist, Token
from app.extensions import db, jwt
from app.models.user_models import User
from app.exceptions.user_exceptions import (
    UsernameOrPasswordInvalidException,
    UserInactiveException,
)


def generate_tokens(identity):
    access_token = create_access_token(identity=str(identity))
    access_jti = decode_token(access_token)["jti"]
    refresh_token = create_refresh_token(
        identity=str(identity),
        additional_claims={"access_jti": access_jti},
    )
    refresh_jti = decode_token(refresh_token)["jti"]

    data = {"access_token": access_token, "refresh_token": refresh_token}

    token = Token(access_jti=access_jti, refresh_jti=refresh_jti, user_id=identity)
    db.session.add(token)
    db.session.commit()

    return data


def revoke_token(jti):
    revoked_token = TokenBlocklist(jti=jti)
    db.session.add(revoked_token)
    db.session.commit()


@jwt.token_in_blocklist_loader
def is_token_revoked(_jwt_header, jwt_data):
    jti = jwt_data["jti"]
    revoke_token = TokenBlocklist.query.filter_by(jti=jti).first()
    return revoke_token is not None


def login(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        if not user.is_active:
            raise UserInactiveException()

        tokens = generate_tokens(identity=user.id)
        return tokens
    raise UsernameOrPasswordInvalidException()
