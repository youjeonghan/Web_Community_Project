from datetime import datetime, timedelta
from flask import jsonify
from models import User, Category, Board, Post, Comment, Blacklist, Post_img
from config import UPLOAD_BOARD_FOLDER
from controllers.common_con import *
from controllers.db_con import *

def add_board_con(request):
	data = return_dictionary_input_board_data(request)

	if not data.get("board_name"):
		return jsonify({"error": "게시판 제목이 없습니다."}), 400

	category = search_table_by_id(Category, data.get("category_id"))
	category.board_num += 1

	insert_table(make_board_object(data, category))

	return jsonify(result="success"), 201


def board_img_modify_con(request,id):
	board = search_table_by_id(Board, id)
	board_image = request.files.get("board_image")

	if board_image and allowed_file(board_image):
		if board.board_image != None:
			delete_img(UPLOAD_BOARD_FOLDER + "/" + board.board_image)

		board.board_image = manufacture_img(board_image, UPLOAD_BOARD_FOLDER)
		commit_session_to_db()

	return jsonify(result="modify_success"), 201


def board_delete_con(id):
	board = search_table_by_id(Board, id)
	category = search_table_by_id(Category, board.category_id)
	category.board_num -= 1

	# board 삭제하기전 board_img 먼저 삭제

	if board.board_image != None:
		delete_img(UPLOAD_BOARD_FOLDER + "/" + board.board_image)

	# post 삭제하기전 post에 속한 img 먼저 삭제
	delete_all_post_img_of_board(id)
	delete_column_by_object(board)

	return jsonify(result="delete_success"), 202

def add_category_con(request):
	data = request.get_json()
	category_name = data.get("category_name")

	if search_table_by_category_name(Category,category_name):
		return jsonify({"error": "이미 있는 카테고리입니다."}), 409
	if not category_name:
		return jsonify({"error": "이름을입력해주세요"}), 403

	category = Category()
	category.category_name = category_name

	insert_table(category)

	categories = Category.query.all()

	return jsonify([cat.serialize for cat in categories]), 201


def category_set_con(id):
	# 카테고리 삭제
	category = search_table_by_id(Category, id)

	# post 삭제하기전 post에 속한 img 먼저 삭제
	del_board_list = search_table_by_category_id_all(Board,id)
	for board in del_board_list:
		delete_all_post_img_of_board(board.id)

	delete_column_by_object(category)

	return jsonify(result="delete_success")


def report_con(table):
	reportlist_info = []
	reportlist = (
		table.query.filter(table.report_num > 0).order_by(table.report_num.desc()).all()
	)

	for report in reportlist:
		reportlist_info.append(return_report_post(report))

	return jsonify(reportlist_info), 201


def user_nickname_modify_con(request, id):
	nickname = request.form.get("nickname")
	check_user = search_table_by_id(User,id)
	updated_data = {}
	if nickname and nickname != check_user.nickname:  # 바꿀 nickname을 입력받으면
		if User.query.filter(User.nickname == nickname).first():  # nickname 중복 검사
			return jsonify({"error": "이미 있는 닉네임입니다."}), 409
		updated_data["nickname"] = nickname
	if updated_data:
		User.query.filter(User.id == id).update(
			updated_data
		)  # PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
		commit_session_to_db()
	return jsonify(result="success")


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
	del_img_list = search_table_by_post_id_all(Post_img,id)
	for file in del_img_list:
		delete_img(UPLOAD_FOLDER + "/" + file.filename)


def delete_all_post_img_of_board(id):
	del_post_list = search_table_by_board_id_all(Post,id)
	for post in del_post_list:
		delete_post_img(post.id)


def return_report_post(report_post):
	updated_data = {}
	user = search_table_by_id(User,report_post.userid)
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
	delete_column_by_object(post)



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
		commit_session_to_db()


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

	insert_table(Black)
