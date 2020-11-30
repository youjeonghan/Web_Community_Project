from flask import request
from flask import g
from flask_jwt_extended import jwt_required
from api import api
from controllers.comment_con import *
from controllers.user_con import access_user_return, check_gm


@api.route("/comment/<post_id>", methods=["GET"])
def comment(post_id):
    return comment_get(post_id)


@api.route("/comment/<post_id>", methods=["PUT", "POST", "DELETE"])
@jwt_required
def comment_modified(post_id):
    check_gm()
    data = request.get_json()
    if request.method == "POST":
        return comment_post(post_id, data)

    elif request.method == "DELETE":
        return comment_delete(data)

    elif request.method == "PUT":
        return comment_put(data)


@api.route("/commentlike/<comment_id>")
@jwt_required
def comment_like(comment_id):
    g.user = access_user_return()
    if g.user is None:
        return jsonify(), 403
    else:
        return check_my_commentlike(comment_id, g.user)