from flask import jsonify
from flask import redirect
from flask import request
from models import Post, Comment, Board, User
from api import api
from sqlalchemy import and_, or_

# 시간 측정
import time

### 전체 게시판 검색 (게시글) ###
@api.route('/search', methods=['GET'])
def search_all():
	start = time.time()  									# 시작 시간 저장 (측정 시작)
	search_type = request.args.get("search_type")
	input_value = request.args.get("input_value")
	page = int(request.args.get("page"))
	input_value_all = f"%{input_value}%"

	postlist = Post.query.filter(Post.subject.ilike(input_value_all)).order_by(Post.create_date.desc()).all()
	print(postlist)
	print(type(postlist))

	input_value_list = input_value.split(" ")
	for value in input_value_list:
		print(value)
		postlist = postlist + Post.query.filter(Post.subject.ilike(f"%{value}%")).order_by(Post.create_date.desc()).all()
		print(postlist)
		print("--------------------------------------------------------------------------------------------------")

	postlist = []
	if search_type == "전체":
		postlist = Post.query.join(User).filter(or_(Post.subject.ilike(input_value), Post.content.ilike(input_value), User.username.ilike(input_value)))\
					.order_by(Post.create_date.desc())

	elif search_type == "제목":
		postlist = Post.query.filter(Post.subject.ilike(input_value)).order_by(Post.create_date.desc())

	elif search_type == "내용":
		postlist = Post.query.filter(Post.content.ilike(input_value)).order_by(Post.create_date.desc())

	elif search_type == "글쓴이":
		postlist = Post.query.join(User).filter(User.username.ilike(input_value)).order_by(Post.create_date.desc())

	postlist = postlist.paginate(page, per_page = 20).items
	print("걸린시간 :", time.time() - start)  				# 현재시각 - 시작시간 = 실행 시간 (측정 종료)
	return jsonify([post.serialize for post in postlist])



### 해당 게시판 검색 (게시글) ###
@api.route('/search/<id>', methods=['GET'])			# id = 게시판id
def search_inboard(id):
	start = time.time()  									# 시작 시간 저장 (측정 시작)
	search_type = request.args.get("search_type")
	input_value = request.args.get("input_value")
	page = int(request.args.get("page"))
	input_value = f"%{input_value}%"

	postlist = []
	if search_type == "전체":
		postlist = Post.query.join(User).filter(and_(Post.board_id == id, or_(Post.subject.ilike(input_value), Post.content.ilike(input_value), User.username.ilike(input_value))))\
					.order_by(Post.create_date.desc())

	elif search_type == "제목":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.subject.ilike(input_value))).order_by(Post.create_date.desc())

	elif search_type == "내용":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.content.ilike(input_value))).order_by(Post.create_date.desc())

	elif search_type == "글쓴이":
		postlist = Post.query.join(User).filter(and_(Post.board_id == id, User.username.ilike(input_value))).order_by(Post.create_date.desc())

	postlist = postlist.paginate(page, per_page = 20).items
	print("걸린시간 :", time.time() - start)  				# 현재시각 - 시작시간 = 실행 시간 (측정 종료)
	return jsonify([post.serialize for post in postlist])