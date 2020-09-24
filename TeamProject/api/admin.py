from api import api
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db, Category, Board, Post, Comment, Blacklist
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from api.decoration import admin_required


# @api.route('/admin/testify')
# def testify():
	# user = current_app.config['ADMIN_ID']
	
	# adminuser = Admin(id = 2,
	# 				nickname = "a",
	# 				password = "a",
	# 				userid = "a"
	# )
	# db.session.add(adminuser)
	# db.session.commit()
	# return adminuser
	# return user

#게시판 추가
@api.route('/admin/board_add', methods = ['POST'])
@admin_required
def add_board():
		data = request.get_json()
		board_name = data.get('board_name')
		description = data.get('description')
		category_id = data.get('category_id')

		if not board_name:
			return jsonify({'error': '게시판 제목이 없습니다.'}), 400

		category = Category.query.filter(Category.id == category_id).first()
		category.board_num += 1

		board = Board()
		board.board_name = board_name
		board.description = description
		board.category_id = category_id
		board.category = category
		db.session.add(board)
		db.session.commit()                                         # db에 저장

		return jsonify(board.serialize), 201


#게시판 삭제
@api.route('/admin/board_set/<id>', methods = ['DELETE'])
@admin_required
def board_set(id):
	board = Board.query.filter(Board.id == id).first()
	category = Category.query.filter(Category.id == board.category_id).first()		# 삭제할 게시판의 카테고리 찾기
	category.board_num -= 1 # 
	db.session.delete(board)
	db.session.commit()
	return "delete success"


# 카테고리 추가
@api.route('/admin/category_add', methods = ['POST'])
@admin_required
def add_category():
	data = request.get_json()
	category_name = data.get('category_name')

	if Category.query.filter(Category.category_name == category_name).first():
		return "Already exist"
	if not category_name :
		return "No insert data"
	
	category = Category()
	category.category_name = category_name

	db.session.add(category)
	db.session.commit()

	categories = Category.query.all()	
	
	return jsonify([cat.serialize for cat in categories])


# 카테고리 수정, 삭제
@api.route('/admin/category_set/<id>', methods = ['DELETE','PUT'])
@admin_required
def category_set(id):
	# 카테고리 삭제
	if request.method == 'DELETE':
		category = Category.query.filter(Category.id == id).first()
		db.session.delete(category)
		db.session.commit()
		return "delete success"

	# 카테고리 수정
	data = request.get_json()
	Category.query.filter(Category.id == id).update(data)
	return "수정이 완료되었습니다"

	#----------------확인 코드------------------------------------
	# category = Category.query.all()
	# return jsonify([cat_data.serialize for cat_data in category])



# 게시글 신고 리스트 반환 - 신고 횟수가 1이상인 게시판 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route('/admin/post_report')
@admin_required
def post_report():
	post_reportlist = Post.query.filter(Post.report_num > 0).order_by(Post.report_num.desc())
	return jsonify([post_report.serialize for post_report in post_reportlist])

# 댓글 신고 리스트 반환 - 신고 횟수가 1이상인 댓글 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route('/admin/comment_report')
@admin_required
def comment_report():
	comment_reportlist = Comment.query.filter(Comment.report_num > 0).order_by(Comment.report_num.desc())
	return jsonify([comment_report.serialize for comment_report in comment_reportlist])

# 신고 당한 해당 게시글 삭제
@api.route('/admin/post_report_delete', methods = ['DELETE'])
@admin_required
def post_report_delete():
	data = request.get_json()		# 신고한 post의 id값 여러개 받기
	for i in range(0, len(data)):
		post_id = data[i].get('id')
		post = Post.query.filter(Post.id == post_id).first()
		board = Board.query.filter(Board.id == post.board_id).first()
		board.post_num -= 1
		db.session.delete(post)
		db.session.commit()
	return jsonify(), 204

# 게시글 신고 리스트 목록에서만 삭제(해당 게시물 삭제가 아님)
@api.route('/admin/post_report_list_delete', methods = ['DELETE'])
@admin_required
def post_report_list_delete():
	data = request.get_json()		# 신고한 post의 id값 여러개 받기
	for i in range(0, len(data)):
		post_id = data[i].get('id')
		post = Post.query.filter(Post.id == post_id).first()
		post.report_num = 0
	return jsonify(), 204

# 신고 당한 해당 댓글 삭제 후 메시지로 변환
@api.route('/admin/comment_report_delete', methods = ['DELETE'])
@admin_required
def comment_report_delete():
	data = request.get_json()
	for i in range(0, len(data)):
		comment_id = data[i].get('id')
		comment = Comment.query.filter(Comment.id == comment_id).first()
		post = Post.query.filter(post.id == comment.post_id).first()
		comment.content = "이미 삭제된 댓글입니다."
		comment.report_num = 0
	return jsonify(), 204

# 댓글 신고 리스트 목록에서만 삭제
@api.route('/admin/comment_report_list_delete', methods = ['DELETE'])
@admin_required
def comment_report_list_delete():
	data = request.get_json()
	for i in range(0, len(data)):
		comment_id = data[i].get('id')
		comment = Comment.query.filter(Comment.id == comment_id).first()
		comment.report_num = 0
	return jsonify(), 204

# 블랙리스트 정지
@api.route('/admin/blacklist',methods = ['POST'])
def blacklist():
	data = request.get_json()
	userid = data.get('userid')			# 해당 아이디
	punishment_date = int(data.get('punishment_date'))		# 정지 일수

	if punishment_date > 30:		# 영구정지(30일이 넘는 숫자를 입력받으면 영구정지로 처리)
		punishment_end = datetime(4000,1,1)
	
	else :
		punishment_start = datetime.now()
		punishment_end = punishment_start + timedelta(days = int(punishment_date))
	
	user = User.query.filter(User.userid == userid).first()
	# already_black = Blacklist.query.filter(Blacklist.userid == user.id).first()		# 이미 정지가 된적이 있는 아이디

	# if already_black is None:
	Black = Blacklist()
	Black.userid = user.id
	Black.punishment_date = punishment_date
	Black.punishment_end = punishment_end

	db.session.add(Black)
	db.session.commit()
	return {"msg" : "블랙리스트에 추가되었습니다."}, 202

# 블랙리스트 조회
@api.route('/admin/who_is_black')
def who_is_black():
	blacklist = Blacklist.query.order_by(Blacklist.punishment_end.desc()).all()		# 블랙리스트 정지 풀리는 날짜가 느린 순으로 반환
	return jsonify([black.serialize for black in blacklist])

