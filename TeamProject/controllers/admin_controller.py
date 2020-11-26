import os
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db, Category, Board, Post, Comment, Blacklist, Post_img
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from api.decoration import admin_required
from werkzeug.utils import secure_filename
from sqlalchemy import and_, or_
from config import *
from controllers.temp_controller import *
from controllers.db_controller import *

#  werkzeuh dic 객체에서 dic으로
def return_dictionary_input_board_data(request):
	return {
		"board_name": request.form.get("board_name"),
		"description": request.form.get("description"),
		"category_id": request.form.get("category_id"),
		"board_image": request.files.get("board_image"),
	}


def make_board_object(data, category):
	# db 6개 회원정보 저장
	board = Board()
	board.board_name = data.get("board_name")
	board.description = data.get("description")
	board.category_id = data.get("category_id")
	board.category = category
	board.board_image = manufacture_img(data.get("board_image"), UPLOAD_BOARD_FOLDER)

	return board


def delete_post_img(id):
	del_img_list = Post_img.query.filter(Post_img.post_id == id).all()
	for file in del_img_list:
		delete_img(UPLOAD_FOLDER + "/" + file.filename)


def delete_all_post_img_of_board(id):
	del_post_list = Post.query.filter(Post.board_id == id).all()
	for post in del_post_list:
		delete_post_img(post.id)


def return_report_post(report_post):
	updated_data = {}
	user = User.query.filter(User.id == report_post.userid).first()
	updated_data["nickname"] = user.nickname
	updated_data.update(report_post.serialize)
	return updated_data


def init_report_comment(comment_id):
	comment = search_table_by_id(Comment, comment_id)
	comment.report_num = 0
	return comment


def delete_report_post(post_id):
	post = search_table_by_id(Post, post_id)
	board = search_table_by_id(Board, post.board_id)
	board.post_num -= 1

	# post 삭제하기전 post에 속한 img 먼저 삭제
	delete_post_img(post_id)
	db.session.delete(post)
	db.session.commit()


def detail_blacklist(userid, punishment_date):
	Black_history = search_table_by_id(Blacklist, userid)
	if Black_history:  # 전에 블랙먹은 기록이 있는가?
		already_blacked(Black_history, punishment_date)

	else:  # 정지먹은 적이 없으므로
		new_blacklist(userid, punishment_date)


def already_blacked(Black_history, punishment_date):
	# 전에 정지 이수와 현재 정지 일수를 비교하여 큰 수로 정지
	if Black_history.punishment_date < punishment_date:
		if punishment_date > 30:  # 영구정지(30일이 넘는 숫자를 입력받으면 영구정지로 처리)
			punishment_end = datetime(4000, 1, 1)

		else:
			punishment_start = datetime.now()
			punishment_end = punishment_start + timedelta(days=int(punishment_date))

		Black_history.punishment_date = punishment_date
		Black_history.punishment_end = punishment_end
		db.session.commit()


def new_blacklist(userid, punishment_date):
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
