from flask import jsonify
from flask import redirect
from flask import request
from models import Post, Comment, Board, User
from api import api
from sqlalchemy import and_, or_

### 전체 게시판 검색 (게시글) ###
@api.route('/search', methods=['GET'])
def search_all():
	search_type = request.args.get("search_type")
	input_value = request.args.get("input_value")
	input_value = f"%{input_value}%"
	
	if search_type == "전체":
		postlist = Post.query.filter(and_(Post.board_id == id,\
			or_(Post.subject.ilike(input_value),\
				Post.content.ilike(input_value),\
				Post.user.username.ilike(input_value))))

	elif search_type == "제목":
		postlist = Post.query.filter(Post.subject.ilike(input_value)).all()
		return jsonify([post.serialize for post in postlist])

	elif search_type == "내용":
		postlist = Post.query.filter(Post.subject.ilike(input_value)).all()
		return jsonify([post.serialize for post in postlist])

	elif search_type == "글쓴이":
		postlist = Post.query.filter(Post.user.username.ilike(input_value)).all()
		return jsonify([post.serialize for post in postlist])



### 해당 게시판 검색 (게시글) ###
@api.route('/search/<id>', methods=['GET'])			# id = 게시판id
def search_inboard(id):
	search_type = request.args.get("search_type")
	input_value = request.args.get("input_value")
	input_value = f"%{input_value}%"

	if search_type == "전체":
		postlist = Post.query.filter(Post.board_id == id &\
			(Post.subject.ilike(input_value) | Post.content.ilike(input_value) |\
			Post.user.username.ilike(input_value)))

	elif search_type == "제목":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.subject.ilike(input_value))).all()
		return jsonify([post.serialize for post in postlist])

	elif search_type == "내용":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.subject.ilike(input_value))).all()
		return jsonify([post.serialize for post in postlist])

	elif search_type == "글쓴이":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.user.username.ilike(input_value))).all()
		return jsonify([post.serialize for post in postlist])