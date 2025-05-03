from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from app.models.token_models import TokenBlocklist
from app.extensions import db, jwt


def generate_tokens(identity):
    access_token = create_access_token(identity=str(identity))
    refresh_token = create_refresh_token(
        identity=str(identity),
        additional_claims={"access_jti": decode_token(access_token)["jti"]},
    )

    data = {"access_token": access_token, "refresh_token": refresh_token}

    return data


def revoke_token(user_id, jti):
    revoked_token = TokenBlocklist(user_id=user_id, jti=jti)
    db.session.add(revoked_token)
    db.session.commit()


@jwt.token_in_blocklist_loader
def is_token_revoked(_jwt_header, jwt_data):
    jti = jwt_data["jti"]
    revoke_token = TokenBlocklist.query.filter_by(jti=jti).first()
    return revoke_token is not None
