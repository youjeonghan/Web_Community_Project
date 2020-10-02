import os
from flask import jsonify
from flask import url_for
from flask import redirect
from flask import request
from models import Post, Comment, Board, User, Post_img, Category, Blacklist
from models import db
from datetime import datetime
from werkzeug.utils import secure_filename
from api import api
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import g
from sqlalchemy import and_
from filecmp import cmp

# 카테고리 전체 반환
@api.route('/category_info')
def category_info():
	categories = Category.query.all()
	return jsonify([category.serialize for category in categories]), 200

### 베스트 게시판 ###
@api.route('/bestboard', methods=['GET'])			# 베스트 게시판
def bestboard():
	# GET
	board = Board.query.filter(Board.id == 1).first()
	boardlist = Board.query.order_by(Board.post_num.desc())
	boardlist = boardlist.paginate(1, per_page=10).items

	returnlist = []
	for board in boardlist:
		returnlist.append(board.serialize)

	return jsonify(returnlist), 200

### 게시판 (목록) ###
@api.route('/board/<id>', methods=['GET']) 		# id = category_id
def board_get(id):
	# GET
	if request.method == 'GET':
		boardlist = Board.query.filter(Board.category_id == id).order_by(Board.post_num.desc()).all()		# 게시글수가 많은 순으로 보내줌
		return jsonify([board.serialize for board in boardlist]), 200			# json으로 게시글 목록 리턴

### 게시판 (추가) ###
@api.route('/board/<id>', methods=['POST']) 		# id = category_id
@jwt_required
def board_post(id):
	# POST
	if request.method == 'POST':
		data = request.get_json()
		board_name = data.get('board_name')
		description = data.get('description')
		category_id = data.get('category_id')

		if not board_name:
			return jsonify({'error': '게시글 제목이 없습니다.'}), 400

		board = Board()
		board.board_name = board_name
		board.description = description
		board.category_id = category_id

		db.session.add(board)
		db.session.commit()                                         # db에 저장

		return jsonify(), 201

### 게시판 (개별) - 정보 출력 ###
@api.route('/board_info/<id>', methods=['GET'])
def board_info(id):
	# GET
	board = Board.query.filter(Board.id == id).first()
	return jsonify(board.serialize), 200

### 전체 베스트 게시글 ###
@api.route('/bestpost', methods=['GET'])			# 베스트 게시글
def bestpost_all():
	# GET
	postlist = Post.query.filter(Post.like_num > 0).order_by(Post.like_num.desc())
	postlist = postlist.paginate(1, per_page=10).items

	returnlist = []
	for i, post in enumerate(postlist):
		returnlist.append(post.serialize)
		returnlist[i].update(board_name=post.board.board_name)		# board_name = 해당 글이 속하는 게시판 이름
	return jsonify(returnlist), 200      # json으로 게시글 목록 리턴

### 해당 게시판 베스트 게시글 ###
@api.route('/bestpost/<id>', methods=['GET'])			# 베스트 게시글
def bestpost_board(id):
	# GET
	if request.method == 'GET':
		postlist = Post.query.filter(and_(Post.board_id == id, Post.like_num > 0)).order_by(Post.like_num.desc())
		postlist = postlist.paginate(1, per_page=10).items

		returnlist = []
		for i, post in enumerate(postlist):
			returnlist.append(post.serialize)
			returnlist[i].update(board_name=post.board.board_name)
		return jsonify(returnlist), 200

### 게시글 (목록) ###
@api.route('/post', methods=['GET'])
def post_get():
	# GET
	if request.method == 'GET':
		board_id = int(request.args.get("board_id"))			# 어떤 게시판의 글을 불러올지
		page = int(request.args.get("page"))					# 불러올 페이지의 숫자

		postlist = Post.query.filter(Post.board_id == board_id).order_by(Post.create_date.desc())
		postlist = postlist.paginate(page, per_page=10).items

		returnlist = []
		for i,post in enumerate(postlist):
			returnlist.append(post.serialize)
			returnlist[i].update(board_name=post.board.board_name)

		return jsonify(returnlist), 200      # json으로 게시글 목록 리턴

### 게시글 (글쓰기) ###
@api.route('/post', methods=['POST'])
# @jwt_required
def post_post():
	# POST
	if request.method == 'POST':
		data = request.get_json()
		userid = data.get('userid')
		subject = data.get('subject')
		content = data.get('content')
		create_date = datetime.now()
		board_name = data.get('board_name')			# 해당하는 게시판의 이름

		# 블랙리스트 확인
		user = User.query.filter(User.id == userid).first()
		if user.Black_set_user:
			black = Blacklist.query.filter(Blacklist.userid == userid).first()
			if black.punishment_end > datetime.now():
				return jsonify({'error':'현재 당신의 아이디는 게시글을 쓸 수 없습니다.'}), 403
			else :		# 블랙은 되었었으나, 정지가 풀리는 날 이후인 경우 블랙리스트에서 제외
				# black = Blacklist.query.filter(Blacklist.userid == userid).first()
				db.session.delete(black)
				db.session.commit()

		if not subject:
			return jsonify({'error': '제목이 없습니다.'}), 400

		if not content:
			return jsonify({'error': '내용이 없습니다.'}), 400

		board = Board.query.filter(Board.board_name == board_name).first()
		board.post_num += 1			# 해당하는 게시판의 게시글 카운트 + 1
		post = Post()
		post.userid = userid
		post.subject = subject
		post.content = content
		post.create_date = create_date
		post.board_id = board.id

		post.user = User.query.filter(User.id == userid).first()
		post.board = board

		db.session.add(post)
		db.session.commit()
		return jsonify({"post_id": post.id}), 201

### 게시글 (개별) ###
@api.route('/post/<id>', methods=['GET'])
def post_detail(id):
	# GET
	if request.method == 'GET':                                 # 어떤id의 글
		temp = Post.query.filter(Post.id == id).first()
		post = temp.serialize
		post.update({"post_img_filename": [li.filename for li in Post_img.query.filter(Post_img.post_id == id).all()]})
		post.update({"like_userid": [like_user.id for like_user in temp.like]})

		return jsonify(post), 200

### 게시글 (개별 수정, 삭제) ###
@api.route('/post/<id>', methods=['PUT', 'DELETE'])
@jwt_required
def post_detail_modified(id):

	# DELETE
	if request.method == 'DELETE':                            # 삭제
		post = Post.query.filter(Post.id == id).first()

		board = Board.query.filter(Board.board_name == post.board.board_name).first()			# 현재 삭제하려는 게시글의 게시판 객체
		board.post_num -= 1			# 해당하는 게시판의 게시글 카운트 - 1

		# post 삭제하기전 post에 속한 img 먼저 삭제
		del_img_list = Post_img.query.filter(Post_img.post_id == id).all()
		floder_url = "static/img/post_img/"
		for file in del_img_list:
			file_url = floder_url + file.filename
			if os.path.isfile(file_url):
				os.remove(file_url)

		db.session.delete(post)
		db.session.commit()
		return jsonify(), 204       # 204는 no contents를 의미한다(앞으로 이용할수 없다는 뜻을 명시적으로알림, 성공을 알리는거긴함)

	# PUT
	if request.method == 'PUT':
		data = request.get_json()
		Post.query.filter(Post.id == id).update(data)
		post = Post.query.filter(Post.id == id).first()
		return jsonify(post.serialize), 201


### 댓글 출력 ###
@api.route('/comment/<id>',methods=['GET'])		# id = post의 id
def comment(id):
	# GET
	if request.method == 'GET':
		page = int(request.args.get("page"))					# 불러올 페이지의 숫자

		temp = Comment.query.filter(Comment.post_id == id).order_by(Comment.create_date.desc())
		commentlist = []
		temp = temp.paginate(page, per_page=20).items
		for i, comment in enumerate(temp):
			commentlist.append(comment.serialize)
			commentlist[i].update({"like_userid": [like_user.id for like_user in comment.like]})

		return jsonify(commentlist), 200		# json으로 댓글 목록 리턴

### 댓글 수정 ###
@api.route('/comment/<id>',methods=['PUT', 'POST', 'DELETE'])		# id = post의 id
@jwt_required
def comment_modified(id):
	# POST
	if request.method == 'POST':
		data = request.get_json()
		userid = data.get('userid')
		content = data.get('content')
		create_date = datetime.now()

		# 블랙리스트 확인
		user = User.query.filter(User.id == userid).first()
		if user.Black_set_user:
			black = Blacklist.query.filter(Blacklist.userid == userid).first()
			if black.punishment_end > datetime.now():
				return jsonify({'error':'현재 당신의 아이디는 댓글을 쓸 수 없습니다.'}),201
			else :		# 블랙은 되었었으나, 정지가 풀리는 날 이후인 경우 블랙리스트에서 제외
				# black = Blacklist.query.filter(Blacklist.userid == userid).first()
				db.session.delete(black)
				db.session.commit()

		if not content:
			return jsonify({'error': '내용이 없습니다.'}), 400

		post = Post.query.filter(Post.id == id).first()

		comment = Comment()
		comment.userid = userid
		comment.post_id = id
		comment.content = content
		comment.create_date = create_date

		comment.user = User.query.filter(User.id == userid).first()
		comment.post = post
		comment.post.comment_num += 1

		db.session.add(comment)
		db.session.commit()		# db에 저장

		return jsonify(), 201

	# DELETE
	elif request.method == 'DELETE':
		data = request.get_json()
		comment_id = data.get('comment_id')

		comment = Comment.query.filter(Comment.id == comment_id).first()
		comment.post.comment_num -= 1

		db.session.delete(comment)
		db.session.commit()
		return jsonify(), 204

	# PUT
	elif request.method == 'PUT':
		data = request.get_json()

		comment_id = data.get('comment_id')
		del(data['comment_id'])

		Comment.query.filter(Comment.id == comment_id).update(data)
		comment = Comment.query.filter(Comment.id == comment_id).first()
		db.session.commit()
		return jsonify(comment.serialize), 201

### 게시글 좋아요 ###
@api.route('/postlike/<id>')
@jwt_required
def postlike(id):
	user_id = get_jwt_identity()
	access_user = User.query.filter(User.userid == user_id).first()

	if access_user is None:
		print("None")
		g.user = None
	else:
		g.user = access_user
		post = Post.query.get_or_404(id)
		if g.user.id == post.userid:		# 자신의 글일때
			print('본인이 작성한 글은 추천할수 없습니다!')
		elif g.user not in post.like:		# 처음 추천할때
			post.like.append(g.user)
			post.like_num += 1				# 추천수 +1
			db.session.commit()
		elif g.user in post.like:			# 이미 추천한 글일때
			print("이미 추천한 게시글입니다.")

	return jsonify(), 201

### 댓글 좋아요 ###
@api.route('/commentlike/<id>')
@jwt_required
def commentlike(id):
	user_id = get_jwt_identity()
	access_user = User.query.filter(User.userid == user_id).first()

	if access_user is None:
		print("None")
		g.user = None
	else:
		g.user = access_user
		comment = Comment.query.get_or_404(id)
		if g.user.id == comment.userid:		# 자신의 댓글일때
			print('본인이 작성한 댓글은 추천할수 없습니다!')
			return jsonify(), 403		# 403 Forbidden 클라이언트는 콘텐츠에 접근할 권리X

		elif g.user not in comment.like:		# 처음 추천할때
			comment.like.append(g.user)
			comment.like_num += 1				# 추천수 +1
			db.session.commit()
			return jsonify(), 201

		elif g.user in comment.like:			# 이미 추천한 댓글일때
			print("이미 추천한 댓글입니다.")
			return jsonify({"error": "이미 추천한 댓글입니다."}), 400

	return jsonify(), 201


### 이미지 (설정) ###
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/img/post_img'
def allowed_file(file):
	check = 1
	for i in range(0, len(file)):
		if file[i].filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS or '.' not in file[i].filename:
				check = 0

	return check		# 0이면 잘못된 파일(확장자) 1이면 옭은 파일

### 이미지 업로드 ###
@api.route('/postupload/<id>', methods=['POST'])		# 해당 포스트의 id
@jwt_required
def post_uploadimg(id):
	if request.method == 'POST':
		uploaded_files = request.files.getlist("file")
		# POST request에 파일 정보가 있는지 확인
		if 'file' not in request.files:
			print('No file part')
			return jsonify(), 400

		# 만약 유저가 파일을 고르지 않았을 경우
		if uploaded_files[0].filename == '':
			print('No selected file')
			return jsonify(), 400

		# 알맞은 확장자인지 확인후 저장
		if uploaded_files and allowed_file(uploaded_files):
			suffix = datetime.now().strftime("%y%m%d_%H%M%S")
			temp_list = Post_img.query.filter(Post_img.post_id == id).all()
			original_post_img_list = [os.path.join(UPLOAD_FOLDER, img.filename) for img in temp_list]
			post = Post.query.filter(Post.id == id).first()
			post.preview_image = None
			for i in range(0, len(uploaded_files)):
				overlap = 0			# 중복 체크변수
				
				filename = "_".join([uploaded_files[i].filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
				extension = uploaded_files[i].filename.rsplit('.', 1)[1]
				filename = secure_filename(f"{filename}.{extension}")


				uploaded_files[i].save(os.path.join(UPLOAD_FOLDER, filename))				# 일단 저장한후
				for img in original_post_img_list:											# 기존에 있던 Post_img 들과 비교해 중복이면 삭제
					if cmp(img, os.path.join(UPLOAD_FOLDER, filename)):
						os.remove(os.path.join(UPLOAD_FOLDER, filename))
						post_img = Post_img.query.filter(Post_img.filename == filename)
						db.session.delete(post_img)
						db.session.commit()
						overlap = 1
						break

				if overlap == 0:
					post_img = Post_img()
					post_img.filename = filename
					post_img.post_id = id
					post_img.post = post
					post.img_num += 1			# 해당 post의 img_num 저장한 이미지의 수만큼 수정
					db.session.add(post_img)
					db.session.commit()

				if overlap == 0 and post.preview_image == None:
					post.preview_image = filename

			return jsonify(), 201

	return jsonify(), 400		# 잘못된 확장자의 파일을 올린경우

# 게시글 신고 기능
@api.route('/report_post/<id>', methods = ['POST'])			# id는 게시글 프라이머리키
@jwt_required
def report_post(id):
	userid = get_jwt_identity()
	access_user = User.query.filter(User.userid == userid).first()
	if access_user is None:		# 유효하지 않은 토큰이 들어있는 경우
		return jsonify({'error':'Bad Access Token'}), 403

	g.user = access_user
	post = Post.query.get_or_404(id)
	if g.user not in post.report:		# 첫 신고
		post.report.append(g.user)
		post.report_num += 1		#해당 게시물 신고 횟수 추가
		db.session.commit()
	elif g.user in post.report:		# 해당 유저가 한번 더 신고 하는 경우
		return jsonify({'error':'신고 접수가 이미 되었습니다.'}), 409

	return jsonify(result = "success"), 201

@api.route('/report_comment/<id>', methods = ['POST'])
@jwt_required
def report_comment(id):
	userid = get_jwt_identity()
	access_user = User.query.filter(User.userid == userid).first()
	if access_user is None:		# 유효하지 않은 토큰이 들어있는 경우
		return jsonify({'error':'Bad Access Token'}), 403

	g.user = access_user
	comment = Comment.query.get_or_404(id)
	if g.user not in comment.report:		# 첫 신고
		comment.report.append(g.user)
		comment.report_num += 1		#해당 게시물 신고 횟수 추가
		db.session.commit()
	elif g.user in comment.report:		# 해당 유저가 한번 더 신고 하는 경우
		return jsonify({'error':'신고 접수가 이미 되었습니다.'}), 409

	return jsonify(result = "success"), 201