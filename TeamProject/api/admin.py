import os
from api import api
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db, Category, Board, Post, Comment, Blacklist, Post_img
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from api.decoration import admin_required
from werkzeug.utils import secure_filename

# 이미지 기본 설정
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/img/board_img'
def allowed_file(file):
   check = 1
   if file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS or '.' not in file.filename:
      check = 0

   return check


# 게시판 추가
@api.route('/admin/board_add', methods = ['POST'])
@admin_required
def add_board():
		board_name = request.form.get('board_name')
		description = request.form.get('description')
		category_id = request.form.get('category_id')
		try:		# 게시판 사진 받아도 되고 안받아도 됨
			board_image = request.files['board_image']
		except:
			board_image = None

		if not board_name:
			return jsonify({'error': '게시판 제목이 없습니다.'}), 400

		category = Category.query.filter(Category.id == category_id).first()
		category.board_num += 1
		
		board = Board()
		board.board_name = board_name
		board.description = description
		board.category_id = category_id
		board.category = category

		if board_image and allowed_file(board_image):		# 프로필 이미지 확장자 확인
			suffix = datetime.now().strftime("%y%m%d_%H%M%S")
			filename = "_".join([board_image.filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
			extension = board_image.filename.rsplit('.', 1)[1]
			filename = secure_filename(f"{filename}.{extension}")
			board_image.save(os.path.join(UPLOAD_FOLDER, filename))
			board.board_image = filename

		db.session.add(board)
		db.session.commit()                                         # db에 저장

		return jsonify(
			result = "success"
			), 201

# 게시판 이미지 수정
@api.route('/admin/board_img_modify/<id>', methods = ['POST'])			# id는 board의 id값
@admin_required
def board_img_modify(id):
	board = Board.query.filter(Board.id == id).first()
	board_image = request.files['board_image']
	if board_image and allowed_file(board_image):
		folder_url = "static/img/board_img/"
		if board.board_image != None:
			delete_target = folder_url + board.board_image
			if os.path.isfile(delete_target):
				os.remove(delete_target)
		suffix = datetime.now().strftime("%y%m%d_%H%M%S")
		filename = "_".join([board_image.filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
		extension = board_image.filename.rsplit('.', 1)[1]
		filename = secure_filename(f"{filename}.{extension}")
		board_image.save(os.path.join(UPLOAD_FOLDER, filename))
		board.board_image = filename
		db.session.commit()

	return jsonify(result = "modify_success"),201


# 게시판 삭제
@api.route('/admin/board_set/<id>', methods = ['DELETE'])
@admin_required
def board_set(id):
	board = Board.query.filter(Board.id == id).first()
	category = Category.query.filter(Category.id == board.category_id).first()		# 삭제할 게시판의 카테고리 찾기
	category.board_num -= 1 

	# board 삭제하기전 board_img 먼저 삭제

	if board.board_image != None:
		delete_board_img = "static/img/board_img/" + board.board_image
		if os.path.isfile(delete_board_img):
			os.remove(delete_board_img)

	# post 삭제하기전 post에 속한 img 먼저 삭제
	del_post_list = Post.query.filter(Post.board_id == id).all()
	for post in del_post_list:
		del_img_list = Post_img.query.filter(Post_img.post_id == post.id).all()
		floder_url = "static/img/post_img/"
		for file in del_img_list:
			file_url = floder_url + file.filename
			if os.path.isfile(file_url):
				os.remove(file_url)

	db.session.delete(board)
	db.session.commit()
	return jsonify(
		result = "delete_success"
	), 202


# 카테고리 추가
@api.route('/admin/category_add', methods = ['POST'])
@admin_required
def add_category():
	data = request.get_json()
	category_name = data.get('category_name')

	if Category.query.filter(Category.category_name == category_name).first():
		return jsonify({'error':'이미 있는 카테고리입니다.'}), 409
	if not category_name :
		return jsonify({'error':'이름을입력해주세요'}), 403
	
	category = Category()
	category.category_name = category_name

	db.session.add(category)
	db.session.commit()

	categories = Category.query.all()	
	
	return jsonify([cat.serialize for cat in categories]), 201


# 카테고리 수정, 삭제
@api.route('/admin/category_set/<id>', methods = ['DELETE','PUT'])
@admin_required
def category_set(id):
	# 카테고리 삭제
	if request.method == 'DELETE':
		category = Category.query.filter(Category.id == id).first()

		# post 삭제하기전 post에 속한 img 먼저 삭제
		del_board_list = Board.query.filter(Board.category_id == id).all()
		for board in del_board_list:
			del_post_list = Post.query.filter(Post.board_id == board.id).all()
			for post in del_post_list:
				del_img_list = Post_img.query.filter(Post_img.post_id == post.id).all()
				floder_url = "static/img/post_img/"
				for file in del_img_list:
					file_url = floder_url + file.filename
					if os.path.isfile(file_url):
						os.remove(file_url)

		db.session.delete(category)
		db.session.commit()
		return jsonify(
			result = "delete_success"
			)

	#----------------확인 코드------------------------------------
	# category = Category.query.all()
	# return jsonify([cat_data.serialize for cat_data in category])



# 게시글 신고 리스트 반환 - 신고 횟수가 1이상인 게시판 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route('/admin/post_report')
@admin_required
def post_report():
	reportlist_info = []
	post_reportlist = Post.query.filter(Post.report_num > 0).order_by(Post.report_num.desc()).all()
	for post_report in post_reportlist:
		updated_data = {}
		user = User.query.filter(User.id == post_report.userid).first()
		updated_data['nickname'] = user.nickname
		updated_data.update(post_report.serialize)
		reportlist_info.append(updated_data)
	return jsonify(reportlist_info), 201

# 댓글 신고 리스트 반환 - 신고 횟수가 1이상인 댓글 제목과 신고당한 횟수 반환 api(신고횟수에 따라 내림차순으로)
@api.route('/admin/comment_report')
@admin_required
def comment_report():
	reportlist_info = []
	comment_reportlist = Comment.query.filter(Comment.report_num > 0).order_by(Comment.report_num.desc()).all()
	for comment_report in comment_reportlist:
		updated_data = {}
		user = User.query.filter(User.id == comment_report.userid).first()
		updated_data['nickname'] = user.nickname
		updated_data.update(comment_report.serialize)
		reportlist_info.append(updated_data)
	return jsonify(reportlist_info), 201

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

		# post 삭제하기전 post에 속한 img 먼저 삭제
		del_img_list = Post_img.query.filter(Post_img.post_id == id).all()
		floder_url = "static/img/post_img/"
		for file in del_img_list:
			file_url = floder_url + file.filename
			if os.path.isfile(file_url):
				os.remove(file_url)

		db.session.delete(post)
		db.session.commit()
	return jsonify(result = "success"), 204

# 게시글 신고 리스트 목록에서만 삭제(해당 게시물 삭제가 아님)
@api.route('/admin/post_report_list_delete', methods = ['DELETE'])
@admin_required
def post_report_list_delete():
	data = request.get_json()		# 신고한 post의 id값 여러개 받기
	for i in range(0, len(data)):
		post_id = data[i].get('id')
		post = Post.query.filter(Post.id == post_id).first()
		post.report_num = 0
		db.session.commit()
	return jsonify(result = "success"), 204

# 신고 당한 해당 댓글 삭제 후 메시지로 변환
@api.route('/admin/comment_report_delete', methods = ['DELETE'])
@admin_required
def comment_report_delete():
	data = request.get_json()
	for i in range(0, len(data)):
		comment_id = data[i].get('id')
		comment = Comment.query.filter(Comment.id == comment_id).first()
		comment.content = "이미 삭제된 댓글입니다."
		comment.report_num = 0
		db.session.commit()
	return jsonify(result = "success"), 204

# 댓글 신고 리스트 목록에서만 삭제
@api.route('/admin/comment_report_list_delete', methods = ['DELETE'])
@admin_required
def comment_report_list_delete():
	data = request.get_json()
	for i in range(0, len(data)):
		comment_id = data[i].get('id')
		comment = Comment.query.filter(Comment.id == comment_id).first()
		comment.report_num = 0
		db.session.commit()
	return jsonify(result = "success"), 204

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
	return jsonify(result = "블랙리스트에 추가되었습니다."), 202

# 블랙리스트 조회
@api.route('/admin/who_is_black')
def who_is_black():
	blacklist = Blacklist.query.order_by(Blacklist.punishment_end.desc()).all()		# 블랙리스트 정지 풀리는 날짜가 느린 순으로 반환
	return jsonify([black.serialize for black in blacklist]), 201


# 유저 정보 전부 반환
@api.route('/admin/users_all_info')
@admin_required
def users_all_info():
	users = User.query.all()
	user_list = []
	for user in users:
		access_user_info = {
			'id' : user.id,
			'auto_login': user.auto_login,
			'birth' : user.birth.strftime('%Y-%m-%d'),
			'nickname' : user.nickname,
			'username':user.username,
			'profile_img' : user.profile_img,
			'black_num':user.black_num,
			'userid': user.userid,
			'email' : user.email
		}
		user_list.append(access_user_info)
	return jsonify(user_list), 201			# 모든 사용자정보 반환

# 관리자 권한으로 유저 삭제
@api.route('/admin/user_delete/<id>', methods = ['DELETE'])			# id값은 유저 프라이머리키
@admin_required
def user_delete(id):
	db.session.query(User).filter(User.id == id).delete()
	db.session.commit()
	return jsonify(result = "success")

# 관리자 권한으로 닉네임 변경
@api.route('/admin/user_nickname_modify/<id>', methods = ['DELETE'])			# id값은 유저 프라이머리키
@admin_required
def user_nickname_modify(id):
	nickname = request.form.get('nickname')
	check_user = User.query.filter(User.id == id).first()
	updated_data = {}
	if nickname and nickname !=check_user.nickname:		# 바꿀 nickname을 입력받으면
		if User.query.filter(User.nickname == nickname).first():		# nickname 중복 검사
			return jsonify({'error':'이미 있는 닉네임입니다.'}), 409
		updated_data['nickname'] = nickname
	if updated_data :
		User.query.filter(User.id == id).update(updated_data)# PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
		db.session.commit()
	return jsonify(result = "success")