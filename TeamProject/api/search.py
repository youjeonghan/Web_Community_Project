from flask import jsonify
from flask import redirect
from flask import request
from models import Post, Comment, Board, User
from api import api
from sqlalchemy import and_, or_

# 시간 측정
import time

def search_all_returnlist(search_type, input_value, page):
	input_value_all = f"%{input_value}%"

	postlist = []
	if search_type == "전체":
		postlist = Post.query.join(User).filter(or_(Post.subject.ilike(input_value_all), Post.content.ilike(input_value_all), User.nickname.ilike(input_value_all)))\
					.order_by(Post.create_date.desc()).all()
	elif search_type == "제목":
		postlist = Post.query.filter(Post.subject.ilike(input_value_all)).order_by(Post.create_date.desc()).all()
	elif search_type == "내용":
		postlist = Post.query.filter(Post.content.ilike(input_value_all)).order_by(Post.create_date.desc()).all()
	elif search_type == "글쓴이":
		postlist = Post.query.join(User).filter(User.nickname.ilike(input_value_all)).order_by(Post.create_date.desc()).all()

	input_value_list = input_value.split(" ")
	for value in input_value_list:
		if search_type == "전체":
			postlist_split = Post.query.join(User).filter(or_(Post.subject.ilike(f"%{value}%"), Post.content.ilike(f"%{value}%"), User.username.ilike(f"%{value}%")))\
						.order_by(Post.create_date.desc()).all()
		elif search_type == "제목":
			postlist_split = Post.query.filter(Post.subject.ilike(f"%{value}%")).order_by(Post.create_date.desc()).all()
		elif search_type == "내용":
			postlist_split = Post.query.filter(Post.content.ilike(f"%{value}%")).order_by(Post.create_date.desc()).all()
		elif search_type == "글쓴이":
			postlist_split = Post.query.join(User).filter(User.nickname.ilike(f"%{value}%")).order_by(Post.create_date.desc()).all()

		for post in postlist_split:
			if post not in postlist:
				postlist.append(post)
	
	paging_number = 20
	list_num = len(postlist)
	if len(postlist) > paging_number*page:
		postlist = postlist[paging_number*(page-1) : paging_number*page]
	elif len(postlist) > paging_number*(page-1):
		postlist = postlist[paging_number*(page-1) : len(postlist)]
	elif len(postlist) <= paging_number*(page-1):
		postlist = []

	returnlist = []
	for i, post in enumerate(postlist):
		returnlist.append(post.serialize)
		returnlist[i].update(board_name=post.board.board_name)

	return list_num, returnlist

def search_inboard_returnlist(id, search_type, input_value, page):
	input_value_all = f"%{input_value}%"

	postlist = []
	if search_type == "전체":
		postlist = Post.query.join(User).filter(and_(Post.board_id == id, or_(Post.subject.ilike(input_value_all), Post.content.ilike(input_value_all), User.nickname.ilike(input_value_all))))\
					.order_by(Post.create_date.desc()).all()
	elif search_type == "제목":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.subject.ilike(input_value_all))).order_by(Post.create_date.desc()).all()
	elif search_type == "내용":
		postlist = Post.query.filter(and_(Post.board_id == id, Post.content.ilike(input_value_all))).order_by(Post.create_date.desc()).all()
	elif search_type == "글쓴이":
		postlist = Post.query.join(User).filter(and_(Post.board_id == id, User.nickname.ilike(input_value_all))).order_by(Post.create_date.desc()).all()

	input_value_list = input_value.split(" ")
	for value in input_value_list:
		if search_type == "전체":
			postlist_split = Post.query.join(User).filter(and_(Post.board_id == id, or_(Post.subject.ilike(f"%{value}%"), Post.content.ilike(f"%{value}%"), User.nickname.ilike(f"%{value}%"))))\
					.order_by(Post.create_date.desc()).all()
		elif search_type == "제목":
			postlist_split = Post.query.filter(and_(Post.board_id == id, Post.subject.ilike(f"%{value}%"))).order_by(Post.create_date.desc()).all()
		elif search_type == "내용":
			postlist_split = Post.query.filter(and_(Post.board_id == id, Post.content.ilike(f"%{value}%"))).order_by(Post.create_date.desc()).all()
		elif search_type == "글쓴이":
			postlist_split = Post.query.join(User).filter(and_(Post.board_id == id, User.nickname.ilike(f"%{value}%"))).order_by(Post.create_date.desc()).all()

		for post in postlist_split:
			if post not in postlist:
				postlist.append(post)
	
	paging_number = 20
	list_num = len(postlist)
	if list_num > paging_number*page:
		postlist = postlist[paging_number*(page-1) : paging_number*page]
	elif list_num > paging_number*(page-1):
		postlist = postlist[paging_number*(page-1) : list_num]
	elif list_num <= paging_number*(page-1):
		postlist = []

	returnlist = []
	for i, post in enumerate(postlist):
		returnlist.append(post.serialize)
		returnlist[i].update(board_name=post.board.board_name)


	return list_num, returnlist

def search_board_returnlist(input_value):
	input_value = f"%{input_value}%"

	boardlist = []
	boardlist = Board.query.filter(Board.board_name.ilike(input_value)).order_by(Board.post_num.desc()).all()
	list_num = len(boardlist)

	# paging_number = 20
	# if list_num > paging_number*page:
	# 	boardlist = boardlist[paging_number*(page-1) : paging_number*page]
	# elif list_num > paging_number*(page-1):
	# 	boardlist = boardlist[paging_number*(page-1) : list_num]
	# elif list_num <= paging_number*(page-1):
	# 	boardlist = []

	returnlist = []
	for i, board in enumerate(boardlist):
		returnlist.append(board.serialize)
		returnlist[i].update(category_name=board.category.category_name)

	return list_num, returnlist

### 전체 게시판의 게시글 검색 ###
@api.route('/search', methods=['GET'])
def search_all():
	search_type = request.args.get("search_type")
	input_value = request.args.get("input_value")
	page = int(request.args.get("page"))
	
	search_num, returnlist = search_all_returnlist(search_type, input_value, page)
	if not returnlist:
		return jsonify(), 204

	return jsonify({"search_num": search_num, "returnlist": returnlist}), 201

### 해당 게시판의 게시글 검색 ###
@api.route('/search/<id>', methods=['GET'])			# id = 게시판id
def search_inboard(id):
	search_type = request.args.get("search_type")
	input_value = request.args.get("input_value")
	page = int(request.args.get("page"))

	search_num, returnlist = search_inboard_returnlist(id, search_type, input_value, page)
	if not returnlist:
		return jsonify(), 204			# 204 No Content: 성공적으로 처리했지만 컨텐츠를 제공하지는 않는다.(페이징 범위때문)

	return jsonify({"search_num": search_num, "returnlist": returnlist}), 201

### 게시판 검색 ###
@api.route('/board_search', methods=['GET'])
def search_board():
	input_value = request.args.get("input_value")

	search_num, returnlist = search_board_returnlist(input_value)
	if not returnlist:
		return jsonify(), 204

	return jsonify({"search_num": search_num, "returnlist": returnlist}), 201