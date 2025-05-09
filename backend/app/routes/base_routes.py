from flask import Blueprint, render_template

base_bp = Blueprint("base", __name__, url_prefix="/")


@base_bp.route("/", defaults={"path": ""})
@base_bp.route("/<path:path>", methods=["GET"])
def index(path):
    return render_template("index.html")
