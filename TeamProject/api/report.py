from flask import jsonify
from flask_jwt_extended import jwt_required
from api import api
from controllers.report_con import report_post_con, report_comment_con
from controllers.user_con import access_user_return


@api.route("/report_post/<post_id>", methods=["POST"])
@jwt_required
def report_post(post_id):
    access_user = access_user_return()
    if access_user is None:
        return jsonify({"error": "Bad Access Token"}), 403
    return report_post_con(access_user, post_id)


@api.route("/report_comment/<comment_id>", methods=["POST"])
@jwt_required
def report_comment(comment_id):
    access_user = access_user_return()
    print(access_user)
    if access_user is None:
        return jsonify({"error": "Bad Access Token"}), 403
    return report_comment_con(access_user, comment_id)