from flask import jsonify
from flask import request
from flask import g
from flask_jwt_extended import jwt_required
from api import api
from models import Post, Board, Post_img, Category
from controllers.post_con import *
from controllers.user_controller import access_user_return, check_gm


@api.route("/category_info", methods=["GET"])
def all_category():
    return jsonify([category.serialize for category in Category.query.all()]), 200


@api.route("/bestboard", methods=["GET"])
def bestboard_list():
    bestboard_list = Board.query.order_by(Board.post_num.desc()).limit(10).all()
    return jsonify([bestboard.serialize for bestboard in bestboard_list]), 200


@api.route("/board/<category_id>", methods=["GET"])
def category_board_list(category_id):
    board_list = Board.query.filter(Board.category_id == category_id)
    board_list = board_list.order_by(Board.post_num.desc()).all()
    return jsonify([board.serialize for board in board_list]), 200


@api.route("/board_info/<board_id>", methods=["GET"])
def board_info(board_id):
    board = Board.query.filter(Board.id == board_id).first()
    return jsonify(board.serialize), 200


@api.route("/bestpost", methods=["GET"])
def bestpost_list():
    return bestpost_list_con()


@api.route("/bestpost/<board_id>", methods=["GET"])
def board_bestpost(board_id):
    return board_bestpost_con(board_id)


@api.route("/post", methods=["GET"])
def board_post_list():
    return board_post_list_con()


@api.route("/post", methods=["POST"])
@jwt_required
def post_create():
    check_gm()
    return post_insert()


@api.route("/post/<post_id>", methods=["GET"])
def post_detail(post_id):
    return post_detail_con(post_id)


@api.route("/post/<post_id>", methods=["PUT", "DELETE"])
@jwt_required
def post_put_delete(post_id):
    check_gm()
    if request.method == "DELETE":
        return post_delete(post_id)

    if request.method == "PUT":
        return post_put(post_id)


@api.route("/postlike/<post_id>")
@jwt_required
def post_like(post_id):
    g.user = access_user_return()
    if g.user is None:
        return jsonify(), 403
    else:
        return check_my_postlike(post_id, g.user)


@api.route("/postupload/<post_id>", methods=["POST"])
@jwt_required
def post_img_upload(post_id):
    return img_upload(post_id)