import os
from werkzeug.utils import secure_filename
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


# ### 댓글 출력 ###
# @api.route("/comment/<id>", methods=["GET"])  # id = post의 id
# def comment(id):
#     # GET
#     if request.method == "GET":
#         page = int(request.args.get("page"))  # 불러올 페이지의 숫자

#         temp = Comment.query.filter(Comment.post_id == id).order_by(Comment.create_date.desc())
#         if (page - 1) * 20 >= len(temp.all()):  # 마지막 페이지 넘어감
#             return jsonify(), 204
#         temp = temp.paginate(page, per_page=20).items

#         commentlist = []
#         for i, comment in enumerate(temp):
#             commentlist.append(comment.serialize)
#             commentlist[i].update({"like_userid": [like_user.id for like_user in comment.like]})

#         return jsonify(commentlist), 200  # json으로 댓글 목록 리턴


@api.route("/comment/<post_id>", methods=["GET"])
def comment(post_id):
    return comment_get(post_id)


@api.route("/comment/<post_id>", methods=["PUT", "POST", "DELETE"])  # id = post의 id
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


### 게시글 좋아요 ###
@api.route("/postlike/<id>")
@jwt_required
def postlike(id):
    user_id = get_jwt_identity()
    access_user = User.query.filter(User.userid == user_id).first()
    if access_user is None and user_id != "GM":
        print("None")
        g.user = None
    else:
        g.user = access_user
        post = Post.query.get_or_404(id)
        if g.user.id == post.userid:  # 자신의 글일때
            print("본인이 작성한 글은 추천할수 없습니다!")
            return jsonify(), 403

        elif g.user not in post.like:  # 처음 추천할때
            post.like.append(g.user)
            post.like_num += 1  # 추천수 +1
            db.session.commit()
            return jsonify(), 201

        elif g.user in post.like:  # 이미 추천한 글일때
            print("이미 추천한 게시글입니다.")
            return jsonify({"error": "이미 추천한 게시글"}), 400

    return jsonify(), 201


### 댓글 좋아요 ###
@api.route("/commentlike/<id>")
@jwt_required
def commentlike(id):
    user_id = get_jwt_identity()
    access_user = User.query.filter(User.userid == user_id).first()

    if access_user is None and user_id != "GM":
        print("None")
        g.user = None
    else:
        g.user = access_user
        comment = Comment.query.get_or_404(id)
        if g.user.id == comment.userid:  # 자신의 댓글일때
            print("본인이 작성한 댓글은 추천할수 없습니다!")
            return jsonify(), 403  # 403 Forbidden 클라이언트는 콘텐츠에 접근할 권리X

        elif g.user not in comment.like:  # 처음 추천할때
            comment.like.append(g.user)
            comment.like_num += 1  # 추천수 +1
            db.session.commit()
            return jsonify(), 201

        elif g.user in comment.like:  # 이미 추천한 댓글일때
            print("이미 추천한 댓글입니다.")
            return jsonify({"error": "이미 추천한 댓글"}), 400

    return jsonify(), 201


# ### 이미지 (설정) ###
# ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
# UPLOAD_FOLDER = "static/img/post_img"


def allowed_file(file):
    check = 1
    for i in range(0, len(file)):
        if (
            file[i].filename.rsplit(".", 1)[1].lower()
            not in current_app.config["ALLOWED_EXTENSIONS"]
            or "." not in file[i].filename
        ):
            check = 0

    return check  # 0이면 잘못된 파일(확장자) 1이면 옭은 파일


### 이미지 업로드 ###
@api.route("/postupload/<id>", methods=["POST"])  # 해당 포스트의 id
@jwt_required
def post_uploadimg(id):
    if request.method == "POST":
        uploaded_files = request.files.getlist("file")
        delete_img = request.form.getlist("delete_img")

        for img in delete_img:
            os.remove(os.path.join(current_app.config["UPLOAD_FOLDER"], img))
            post_img = Post_img.query.filter(Post_img.filename == img).first()
            db.session.delete(post_img)
            db.session.commit()

        # POST request에 file and delete_img가 있는지 확인
        if "file" not in request.files and "delete_img" not in request.form:
            print("No file part")
            return jsonify(), 400

        post = Post.query.filter(Post.id == id).first()
        # 알맞은 확장자인지 확인후 저장
        if uploaded_files and allowed_file(uploaded_files):
            suffix = datetime.now().strftime("%y%m%d_%H%M%S")
            temp_list = Post_img.query.filter(Post_img.post_id == id).all()
            original_post_img_list = [
                os.path.join(current_app.config["UPLOAD_FOLDER"], img.filename) for img in temp_list
            ]

            post.preview_image = None
            for i in range(0, len(uploaded_files)):
                overlap = 0  # 중복 체크변수

                filename = "_".join(
                    [uploaded_files[i].filename.rsplit(".", 1)[0], suffix]
                )  # 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
                extension = uploaded_files[i].filename.rsplit(".", 1)[1]
                filename = secure_filename(f"{filename}.{extension}")

                uploaded_files[i].save(
                    os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
                )  # 일단 저장한후

                post_img = Post_img()
                post_img.filename = filename
                post_img.post_id = id
                post_img.post = post
                post.img_num += 1  # 해당 post의 img_num 저장한 이미지의 수만큼 수정
                db.session.add(post_img)
                db.session.commit()

            preview_image = (
                Post_img.query.filter(Post_img.post_id == id).order_by(Post_img.id).first()
            )
            if preview_image == None:
                post.preview_image = post.board.board_image
            else:
                post.preview_image = preview_image.filename
            return jsonify(), 201

        preview_image = Post_img.query.filter(Post_img.post_id == id).order_by(Post_img.id).first()
        if preview_image == None:
            post.preview_image = post.board.board_image
        else:
            post.preview_image = preview_image.filename
    return jsonify(), 201  # 수정을 통해 이미지 삭제만 한 경우


# 게시글 신고 기능
@api.route("/report_post/<id>", methods=["POST"])  # id는 게시글 프라이머리키
@jwt_required
def report_post(id):
    userid = get_jwt_identity()
    access_user = User.query.filter(User.userid == userid).first()
    if access_user is None and userid != "GM":  # 유효하지 않은 토큰이 들어있는 경우
        return jsonify({"error": "Bad Access Token"}), 403

    g.user = access_user
    post = Post.query.get_or_404(id)
    if g.user not in post.report:  # 첫 신고
        post.report.append(g.user)
        post.report_num += 1  # 해당 게시물 신고 횟수 추가
        db.session.commit()
    elif g.user in post.report:  # 해당 유저가 한번 더 신고 하는 경우
        return jsonify({"error": "신고 접수가 이미 되었습니다."}), 409

    return jsonify(result="success"), 201


# 댓글 신고
@api.route("/report_comment/<id>", methods=["POST"])
@jwt_required
def report_comment(id):
    userid = get_jwt_identity()
    access_user = User.query.filter(User.userid == userid).first()
    if access_user is None and userid != "GM":  # 유효하지 않은 토큰이 들어있는 경우
        return jsonify({"error": "Bad Access Token"}), 403

    g.user = access_user
    comment = Comment.query.get_or_404(id)
    if g.user not in comment.report:  # 첫 신고
        comment.report.append(g.user)
        comment.report_num += 1  # 해당 댓글 신고 횟수 추가
        db.session.commit()
    elif g.user in comment.report:  # 해당 유저가 한번 더 신고 하는 경우
        return jsonify({"error": "신고 접수가 이미 되었습니다."}), 409

    return jsonify(result="success"), 201
