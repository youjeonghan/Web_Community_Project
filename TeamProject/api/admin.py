from flask import jsonify, request
from models import User, Post
from api.decoration import admin_required
from api import api
from controllers.admin_con import *
from controllers.db_con import *


# 게시판 추가
@api.route("/admin/board_add", methods=["POST"])
@admin_required
def add_board():
    return add_board_con(request)


# 게시판 이미지 수정
@api.route("/admin/board_img_modify/<id>", methods=["POST"])  # id는 board의 id값
@admin_required
def board_img_modify(id):
    return board_img_modify_con(request, id)


# 게시판 삭제
@api.route("/admin/board_set/<id>", methods=["DELETE"])
@admin_required
def board_delete(id):
    return board_delete_con(id)


# 카테고리 추가
@api.route("/admin/category_add", methods=["POST"])
@admin_required
def add_category():
    return add_category_con(request)


# 카테고리 삭제
@api.route("/admin/category_set/<id>", methods=["DELETE"])
@admin_required
def category_set(id):
    return category_set_con(id)


# 게시글 신고 리스트 반환 - 신고 횟수가 1이상인 게시판 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route("/admin/post_report")
@admin_required
def post_report():
    return report_con(Post)


# 댓글 신고 리스트 반환 - 신고 횟수가 1이상인 댓글 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route("/admin/comment_report")
@admin_required
def comment_report():
    return report_con(Comment)


# 신고 당한 해당 게시글 삭제


@api.route("/admin/post_report_delete", methods=["DELETE"])
@admin_required
def post_report_delete():
    data = request.get_json()  # 신고한 post의 id값 여러개 받기
    for value in data:
        delete_report_post(value.get("id"))
    return jsonify(result="success"), 204


# 게시글 신고 리스트 목록에서만 삭제(해당 게시물 삭제가 아님)
@api.route("/admin/post_report_list_delete", methods=["DELETE"])
@admin_required
def post_report_list_delete():
    data = request.get_json()  # 신고한 post의 id값 여러개 받기
    for value in data:
        post_id = value.get("id")
        post = search_table_by_id(Post, post_id)
        post.report_num = 0
        commit_session_to_db()
    return jsonify(result="success"), 204


# 신고 당한 해당 댓글 삭제 후 메시지로 변환
@api.route("/admin/comment_report_delete", methods=["DELETE"])
@admin_required
def comment_report_delete():
    data = request.get_json()
    for value in data:
        comment = init_report_comment(value.get("id"))
        comment.content = "이미 삭제된 댓글입니다."
        commit_session_to_db()
    return jsonify(result="success"), 204


# 댓글 신고 리스트 목록에서만 삭제
@api.route("/admin/comment_report_list_delete", methods=["DELETE"])
@admin_required
def comment_report_list_delete():
    data = request.get_json()
    for value in data:
        init_report_comment(value.get("id"))
        commit_session_to_db()
    return jsonify(result="success"), 204


# 블랙리스트 게시글로 정지
@api.route("/admin/post-blacklist", methods=["POST"])
@admin_required
def post_blacklist():
    data = request.get_json()
    delete_report_post(data.get("post_id"))
    detail_blacklist(data.get("user_id"), int(data.get("punishment_date")))
    return jsonify(result="블랙리스트에 추가되었습니다."), 202


# 블랙리스트 댓글로 정지
@api.route("/admin/comment-blacklist", methods=["POST"])
@admin_required
def comment_blacklist():
    data = request.get_json()

    comment = init_report_comment(data.get("comment_id"))
    comment.content = "이미 삭제된 댓글입니다."
    commit_session_to_db()
    detail_blacklist(data.get("user_id"), int(data.get("punishment_date")))
    return jsonify(result="블랙리스트에 추가되었습니다."), 202


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
    delete_column_by_id(User, id)
    return jsonify(result="success")


# 관리자 권한으로 닉네임 변경
@api.route("/admin/user_nickname_modify/<id>", methods=["DELETE"])  # id값은 유저 프라이머리키
@admin_required
def user_nickname_modify(id):
    return user_nickname_modify_con(request, id)


# 닉네임으로 검색
@api.route("/admin/nickname_search/<input_data>", methods=["GET"])
def nickname_search(input_data):
    input_data_all = f"%{input_data}%"
    userlist = (
        User.query.filter(User.nickname.ilike(input_data_all)).order_by(User.nickname.desc()).all()
    )
    returnlist = []
    for user in userlist:
        returnlist.append(user.serialize)

    return jsonify(returnlist)
