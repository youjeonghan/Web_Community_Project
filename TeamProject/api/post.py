import os
from datetime import datetime
from flask import jsonify
from flask import url_for
from flask import request
from flask import current_app
from flask import g
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import and_
from api import api
from models import Post, Comment, Board, User, Post_img, Category, Blacklist
from models import db
from controllers.post_con import *


@api.route("/category_info")
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
    postlist = Post.query.filter(Post.like_num > 0).order_by(Post.like_num.desc())
    postlist = postlist.limit(10).all()

    return jsonify(dic_update_boardname(postlist)), 200


@api.route("/bestpost/<board_id>", methods=["GET"])
def board_bestpost(board_id):
    postlist = Post.query.filter(and_(Post.board_id == board_id, Post.like_num > 0))
    postlist = postlist.order_by(Post.like_num.desc()).limit(10).all()

    return jsonify(dic_update_boardname(postlist)), 200


@api.route("/post", methods=["GET"])
def board_post_list():
    board_id = int(request.args.get("board_id"))
    select_page_num = int(request.args.get("page"))

    postlist = []
    postlist = Post.query.filter(Post.board_id == board_id).order_by(Post.create_date.desc())
    if (select_page_num - 1) * 20 >= len(postlist.all()):
        return jsonify(), 204
    postlist = postlist.paginate(select_page_num, per_page=20).items

    return jsonify(dic_update_boardname(postlist)), 200


@api.route("/post", methods=["POST"])
@jwt_required
def post_create():
    check_users()
    return post_insert()


@api.route("/post/<post_id>", methods=["GET"])
def post_detail(post_id):
    temp = Post.query.filter(Post.id == post_id).first()
    post = temp.serialize
    post.update(
        {
            "post_img_filename": [
                li.filename for li in Post_img.query.filter(Post_img.post_id == post_id).all()
            ],
            "like_userid": [like_user.id for like_user in temp.like],
        }
    )
    return jsonify(post), 200


@api.route("/post/<post_id>", methods=["PUT", "DELETE"])
@jwt_required
def post_put_delete(post_id):
    check_users()
    if request.method == "DELETE":
        return post_delete(post_id)

    if request.method == "PUT":
        return post_put(post_id)


@api.route("/comment/<post_id>", methods=["GET"])
def comment(post_id):
    return comment_get(post_id)


@api.route("/comment/<post_id>", methods=["PUT", "POST", "DELETE"])
@jwt_required
def comment_modified(post_id):
    check_users()
    data = request.get_json()
    if request.method == "POST":
        return comment_post(post_id, data)

    elif request.method == "DELETE":
        return comment_delete(data)

    elif request.method == "PUT":
        return comment_put(data)


@api.route("/postlike/<post_id>")
@jwt_required
def post_like(post_id):
    g.user = access_user_return()
    if g.user is None:
        return jsonify(), 403
    else:
        return check_my_postlike(post_id, g.user)


@api.route("/commentlike/<comment_id>")
@jwt_required
def comment_like(comment_id):
    g.user = access_user_return()
    if g.user is None:
        return jsonify(), 403
    else:
        return check_my_commentlike(comment_id, g.user)


### 이미지 업로드 ###
@api.route("/postupload/<post_id>", methods=["POST"])
@jwt_required
def post_img_upload(post_id):
    return img_upload(post_id)


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
    if access_user is None:
        return jsonify({"error": "Bad Access Token"}), 403
    return report_comment_con(access_user, comment_id)
