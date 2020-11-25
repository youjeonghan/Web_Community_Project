import os
from api import api
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db, Category, Board, Post, Comment, Blacklist, Post_img
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from api.decoration import admin_required
from werkzeug.utils import secure_filename
from sqlalchemy import and_, or_
from config import *
from controllers.admin_controller import *
from controllers.db_controller import *
from controllers.temp_controller import *


# 게시판 추가
@api.route("/admin/board_add", methods=["POST"])
@admin_required
def add_board():
    data = return_dictionary_input_board_data(request)

    if not data.get("board_name"):
        return jsonify({"error": "게시판 제목이 없습니다."}), 400

    category = search_table_by_id(Category, data.get("category_id"))
    category.board_num += 1

    table = make_board_object(data, category)
    db.session.add(table)
    db.session.commit()  # db에 저장

    return jsonify(result="success"), 201


# 게시판 이미지 수정
@api.route("/admin/board_img_modify/<id>", methods=["POST"])  # id는 board의 id값
@admin_required
def board_img_modify(id):
    print(id)
    board = search_table_by_id(Board, id)
    board_image = request.files.get("board_image")

    if board_image and allowed_file(board_image):
        if board.board_image != None:
            delete_img(UPLOAD_BOARD_FOLDER + "/" + board.board_image)

        board.board_image = manufacture_img(board_image, UPLOAD_BOARD_FOLDER)
        db.session.commit()

    return jsonify(result="modify_success"), 201


# 게시판 삭제
@api.route("/admin/board_set/<id>", methods=["DELETE"])
@admin_required
def board_set(id):
    board = search_table_by_id(Board, id)
    category = search_table_by_id(Category, board.category_id)
    category.board_num -= 1

    # board 삭제하기전 board_img 먼저 삭제

    if board.board_image != None:
        delete_img(UPLOAD_BOARD_FOLDER + "/" + board.board_image)

    # post 삭제하기전 post에 속한 img 먼저 삭제
    delete_post_img_of_board(id)

    db.session.delete(board)
    db.session.commit()
    return jsonify(result="delete_success"), 202


# 카테고리 추가
@api.route("/admin/category_add", methods=["POST"])
@admin_required
def add_category():
    data = request.get_json()
    category_name = data.get("category_name")

    if Category.query.filter(Category.category_name == category_name).first():
        return jsonify({"error": "이미 있는 카테고리입니다."}), 409
    if not category_name:
        return jsonify({"error": "이름을입력해주세요"}), 403

    category = Category()
    category.category_name = category_name

    db.session.add(category)
    db.session.commit()

    categories = Category.query.all()

    return jsonify([cat.serialize for cat in categories]), 201


# 카테고리 삭제
@api.route("/admin/category_set/<id>", methods=["DELETE"])
@admin_required
def category_set(id):
    # 카테고리 삭제
    category = search_table_by_id(Category, id)

    # post 삭제하기전 post에 속한 img 먼저 삭제
    del_board_list = Board.query.filter(Board.category_id == id).all()
    for board in del_board_list:
        delete_post_img_of_board(board.id)

    db.session.delete(category)
    db.session.commit()
    return jsonify(result="delete_success")


# 게시글 신고 리스트 반환 - 신고 횟수가 1이상인 게시판 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route("/admin/post_report")
@admin_required
def post_report():

    reportlist_info = []
    post_reportlist = (
        Post.query.filter(Post.report_num > 0).order_by(Post.report_num.desc()).all()
    )

    for post_report in post_reportlist:
        reportlist_info.append(return_report_post(post_report))

    return jsonify(reportlist_info), 201


# 댓글 신고 리스트 반환 - 신고 횟수가 1이상인 댓글 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route("/admin/comment_report")
@admin_required
def comment_report():
    reportlist_info = []
    comment_reportlist = (
        Comment.query.filter(Comment.report_num > 0)
        .order_by(Comment.report_num.desc())
        .all()
    )

    for comment_report in comment_reportlist:
        reportlist_info.append(return_report_post(comment_report))

    return jsonify(reportlist_info), 201


# 신고 당한 해당 게시글 삭제

@api.route("/admin/post_report_delete", methods=["DELETE"])
@admin_required
def post_report_delete():
    data = request.get_json()  # 신고한 post의 id값 여러개 받기
    print(data)
    for value in data:
        post_id = value.get("id")
        post = search_table_by_id(Post,post_id)
        board = search_table_by_id(Board,post.board_id)
        board.post_num -= 1

        # post 삭제하기전 post에 속한 img 먼저 삭제
        delete_post_img(post_id)

        db.session.delete(post)
        db.session.commit()
    return jsonify(result="success"), 204


# 게시글 신고 리스트 목록에서만 삭제(해당 게시물 삭제가 아님)
@api.route("/admin/post_report_list_delete", methods=["DELETE"])
@admin_required
def post_report_list_delete():
    data = request.get_json()  # 신고한 post의 id값 여러개 받기
    for value in data:
        post_id = value.get("id")
        post = search_table_by_id(Post,post_id)
        post.report_num = 0
        db.session.commit()
    return jsonify(result="success"), 204


# 신고 당한 해당 댓글 삭제 후 메시지로 변환
@api.route("/admin/comment_report_delete", methods=["DELETE"])
@admin_required
def comment_report_delete():
    data = request.get_json()
    for value in data:
        comment_id = value.get("id")
        comment = search_table_by_id(Comment,comment_id)
        comment.content = "이미 삭제된 댓글입니다."
        comment.report_num = 0
        db.session.commit()
    return jsonify(result="success"), 204


# 댓글 신고 리스트 목록에서만 삭제
@api.route("/admin/comment_report_list_delete", methods=["DELETE"])
@admin_required
def comment_report_list_delete():
    data = request.get_json()
    for value in data:
        comment_id = value.get("id")
        comment = search_table_by_id(Comment,comment_id)
        comment.report_num = 0
        db.session.commit()
    return jsonify(result="success"), 204


# 블랙리스트 정지
@api.route("/admin/blacklist", methods=["POST"])
@admin_required
def blacklist():
    data = request.get_json()
    userid = data.get("user_id")  # 유저 프라이머리키
    post_id = data.get("post_id")
    comment_id = data.get("comment_id")
    punishment_date = int(data.get("punishment_date"))  # 정지 일수

    if post_id != "":  # 포스트 프라이머리키가 들어오면 해당 게시글 아이디 정지와 동시에 삭제

        post = Post.query.filter(Post.id == post_id).first()
        board = Board.query.filter(Board.id == post.board_id).first()
        board.post_num -= 1

        # post 삭제하기전 post에 속한 img 먼저 삭제
        del_img_list = Post_img.query.filter(Post_img.post_id == id).all()
        floder_url = "static/img/post_img/"
        for file in del_img_list:
            file_url = floder_url + file.filename
            if os.path.isfile(file_url):
                os.remove(file_url)

        db.session.delete(post)
        db.session.commit()

    else:  # 댓글 프라이머리키가 들어오면 해당 댓글 삭제
        comment = Comment.query.filter(Comment.id == comment_id).first()
        comment.content = "이미 삭제된 댓글입니다."
        comment.report_num = 0
        db.session.commit()

    Black_history = Blacklist.query.filter(Blacklist.userid == userid).first()
    if Black_history:  # 전에 블랙먹은 기록이 있는가?
        if (
            Black_history.punishment_date < punishment_date
        ):  # 전에 정지 이수와 현재 정지 일수를 비교하여 큰 수로 정지
            if punishment_date > 30:  # 영구정지(30일이 넘는 숫자를 입력받으면 영구정지로 처리)
                punishment_end = datetime(4000, 1, 1)

            else:
                punishment_start = datetime.now()
                punishment_end = punishment_start + timedelta(days=int(punishment_date))
        else:  # 전에 먹은 정지 일수로 유지
            return jsonify(result="블랙리스트에 추가되었습니다."), 202
        Black_history.punishment_date = punishment_date
        Black_history.punishment_end = punishment_end
        db.session.commit()
        return jsonify(result="블랙리스트에 추가되었습니다."), 202

    else:  # 정지먹은 적이 없으므로
        if punishment_date > 30:  # 영구정지(30일이 넘는 숫자를 입력받으면 영구정지로 처리)
            punishment_end = datetime(4000, 1, 1)
        else:
            punishment_start = datetime.now()
            punishment_end = punishment_start + timedelta(days=int(punishment_date))

    user = User.query.filter(User.id == userid).first()  # 프라이머리키로 유저 찾기

    Black = Blacklist()
    Black.userid = user.id
    Black.user = user
    Black.punishment_date = punishment_date
    Black.punishment_end = punishment_end

    db.session.add(Black)
    db.session.commit()
    return jsonify(result="블랙리스트에 추가되었습니다."), 202


# 블랙리스트 조회
@api.route("/admin/who_is_black")
@admin_required
def who_is_black():
    blacklist = Blacklist.query.order_by(
        Blacklist.punishment_end.desc()
    ).all()  # 블랙리스트 정지 풀리는 날짜가 느린 순으로 반환
    return jsonify([black.serialize for black in blacklist]), 201


# 유저 정보 전부 반환
@api.route("/admin/users_all_info")
@admin_required
def users_all_info():
    users = User.query.all()
    user_list = []
    for user in users:
        access_user_info = {
            "id": user.id,
            "birth": user.birth.strftime("%Y-%m-%d"),
            "nickname": user.nickname,
            "username": user.username,
            "profile_img": user.profile_img,
            "black_num": user.black_num,
            "userid": user.userid,
            "email": user.email,
        }
        user_list.append(access_user_info)
    return jsonify(user_list), 201  # 모든 사용자정보 반환


# 관리자 권한으로 유저 삭제
@api.route("/admin/user_delete/<id>", methods=["DELETE"])  # id값은 유저 프라이머리키
@admin_required
def user_delete(id):
    db.session.query(User).filter(User.id == id).delete()
    db.session.commit()
    return jsonify(result="success")


# 관리자 권한으로 닉네임 변경
@api.route("/admin/user_nickname_modify/<id>", methods=["DELETE"])  # id값은 유저 프라이머리키
@admin_required
def user_nickname_modify(id):
    nickname = request.form.get("nickname")
    check_user = User.query.filter(User.id == id).first()
    updated_data = {}
    if nickname and nickname != check_user.nickname:  # 바꿀 nickname을 입력받으면
        if User.query.filter(User.nickname == nickname).first():  # nickname 중복 검사
            return jsonify({"error": "이미 있는 닉네임입니다."}), 409
        updated_data["nickname"] = nickname
    if updated_data:
        User.query.filter(User.id == id).update(
            updated_data
        )  # PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
        db.session.commit()
    return jsonify(result="success")


# 닉네임으로 검색
@api.route("/admin/nickname_search/<input_data>", methods=["GET"])
def nickname_search(input_data):
    # input_data = request.args.get("input_data")
    print(input_data)
    input_data_all = f"%{input_data}%"
    userlist = (
        User.query.filter(User.nickname.ilike(input_data_all))
        .order_by(User.nickname.desc())
        .all()
    )
    returnlist = []
    for user in userlist:
        returnlist.append(user.serialize)

    return jsonify(returnlist)
