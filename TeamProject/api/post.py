import os
from flask import jsonify, flash		# flash는 제거할거
from flask import url_for
from flask import redirect
from flask import request
from models import Post, Comment, Board, User, Post_img
from models import db
from datetime import datetime
from werkzeug.utils import secure_filename
from api import api
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import g
from datetime import datetime

### 테스트용 api ### .update(board_name=1)
@api.route('/test', methods=['GET','POST'])
def test():
	# GET
	dic = {
		"board_id": 1,
		"comment_num": 0,
		"content": "나는 잘모르겠네??",
		"create_date": "Wed, 09 Sep 2020 15:18:04 GMT",
		"id": 2,
		"like_num": 1,
		"subject": "어몽 재밌음?",
		"userid": 1
	}
	dic.update(board_name=1)
	print(dic)

	return jsonify(), 201

### 게시판 (목록, 추가) ###
@api.route('/board', methods=['GET','POST']) 
def board():
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

	# GET
	boardlist = Board.query.order_by(Board.post_num.desc()).all()		# 게시글수가 많은 순으로 보내줌
	return jsonify([board.serialize for board in boardlist]) 			# json으로 게시글 목록 리턴

### 베스트 게시글 ###
@api.route('/bestpost', methods=['GET'])			# 베스트 게시글 
def bestpost():
	# GET
	post = Post.query.filter(Post.id == 1).first()
	postlist = Post.query.filter(Post.like_num > 0).order_by(Post.like_num.desc())
	postlist = postlist.paginate(1, per_page=10).items

	returnlist = []
	for i, post in enumerate(postlist):
		returnlist.append(post.serialize)
		returnlist[i].update(board_name=postlist[i].board.board_name)		# board_name = 해당 글이 속하는 게시판 이름
	return jsonify(returnlist)      # json으로 게시글 목록 리턴

### 게시글 (목록, 글쓰기) ###
@api.route('/post', methods=['GET','POST']) 
def post():
	# POST
	if request.method == 'POST':
		data = request.get_json()
		userid = data.get('userid')
		subject = data.get('subject')
		content = data.get('content')
		create_date = datetime.now()
		board_name = data.get('board_name')			# 해당하는 게시판의 이름


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
		db.session.commit()                                         # db에 저장

		return jsonify(), 201

	# GET
	data = request.get_json()
	board_id = data.get('board_id')			# 어떤 게시판의 글을 불러올지
	page = data.get('page')					# 불러올 페이지의 숫자
	postlist = Post.query.filter(Post.board_id == board_id).order_by(Post.create_date.desc())
	postlist = postlist.paginate(page, per_page=10).items
	return jsonify([post.serialize for post in postlist])      # json으로 게시글 목록 리턴

### 게시글 (개별) ###
@api.route('/post/<id>', methods=['GET','PUT','DELETE'])
def post_detail(id):
	# GET
	if request.method == 'GET':                                 # 어떤id의 글
		post = Post.query.filter(Post.id == id).first()
		return jsonify(post.serialize)

	# DELETE
	elif request.method == 'DELETE':                            # 삭제
		post = Post.query.filter(Post.id == id).first()

		board = Board.query.filter(Board.board_name == post.board.board_name).first()			# 현재 삭제하려는 게시글의 게시판 객체
		board.post_num -= 1			# 해당하는 게시판의 게시글 카운트 - 1

		db.session.delete(post)
		db.session.commit()
		return jsonify(), 204       # 204는 no contents를 의미한다(앞으로 이용할수 없다는 뜻을 명시적으로알림, 성공을 알리는거긴함)

	# PUT
	data = request.get_json()
	Post.query.filter(Post.id == id).update(data)
	post = Post.query.filter(Post.id == id).first()
	return jsonify(post.serialize)                             

### 댓글 ###
@api.route('/comment/<id>',methods=['GET','PUT','POST','DELETE'])		# id = post의 id
def comment(id):
	# POST
	if request.method == 'POST':
		data = request.get_json()
		userid = data.get('userid')
		content = data.get('content')
		create_date = datetime.now()

		if not content:
			return jsonify({'error': '내용이 없습니다.'}), 400

		# post = Post.query.get_or_404(id)
		# print(post)

		post = Post.query.filter(Post.id == id).first()

		comment = Comment()
		comment.userid = userid
		comment.post_id = id
		comment.content = content
		comment.create_date = create_date

		comment.user = User.query.filter(User.id == userid).first()
		comment.post = post

		db.session.add(comment)
		db.session.commit()		# db에 저장

		return jsonify(), 201

	# GET
	elif request.method == 'GET':
		commentlist = Comment.query.filter(Comment.post_id == id)
		return jsonify([comment.serialize for comment in commentlist])		# json으로 댓글 목록 리턴
	
	# DELETE
	elif request.method == 'DELETE':
		comment = Comment.query.filter(Comment.id == id).first()
		db.session.delete(comment)
		db.session.commit()
		return jsonify(), 204

	# PUT
	data = request.get_json()
	Comment.query.filter(Comment.id == id).update(data)
	comment = Comment.query.filter(Comment.id == id).first()
	return jsonify(comment.serialize)

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
		elif g.user not in comment.like:		# 처음 추천할때
			comment.like.append(g.user)
			comment.like_num += 1				# 추천수 +1
			db.session.commit()
		elif g.user in comment.like:			# 이미 추천한 댓글일때
			print("이미 추천한 댓글입니다.")

	return jsonify(), 201


### 이미지 (설정) ###
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/img/post_img'
def allowed_file(file):
	check = 1
	for i in range(0, len(file)):
		if file[i].filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS or '.' not in file[i].filename:
			check = 0
			
	return check

### 이미지 업로드 ###
@api.route('/postupload/<id>', methods=['POST'])		# 해당 포스트의 id
def post_uploadimg(id):
	if request.method == 'POST':
		uploaded_files = request.files.getlist("file")
		# POST request에 파일 정보가 있는지 확인
		print(request.files)
		if 'file' not in request.files:
			print('No file part')
			return redirect('api/postupload/<id>')

		# 만약 유저가 파일을 고르지 않았을 경우
		if uploaded_files[0].filename == '':
			print('No selected file')
			return redirect('api/postupload/<id>')

		# 알맞은 확장자인지 확인후 저장
		if uploaded_files and allowed_file(uploaded_files):
			for i in range(0, len(uploaded_files)):
				suffix = datetime.now().strftime("%y%m%d_%H%M%S")				
				filename = "_".join([uploaded_files[i].filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
				extension = uploaded_files[i].filename.rsplit('.', 1)[1]
				filename = secure_filename(f"{filename}.{extension}")
				
				post_img = Post_img()
				post = Post.query.filter(Post.id == id).first()
				post_img.filename = filename
				post_img.post_id = id
				post_img.post = post

				db.session.add(post_img)
				db.session.commit()

				post.img_num += len(uploaded_files)			# 해당 post의 img_num 저장한 이미지의 수만큼 수정
				uploaded_files[i].save(os.path.join(UPLOAD_FOLDER, filename))
			return redirect(url_for('api.post_uploadimg', id=id))

	return redirect(url_for('api.post_uploadimg', id=id))
