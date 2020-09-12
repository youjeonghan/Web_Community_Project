from api import api
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import Admin, User, db, Category, Board
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime



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

# 카테고리 전체 반환
@api.route('/admin/category_info')
def category_info():
	categories = Category.query.all()
	return jsonify([category.serialize for category in categories])

# 카테고리 id값에 따른 게시판 반환
@api.route('/admin/board_info/<category_id>')
def board_info(category_id):
	boards = Board.query.filter(Board.category_id == category_id).first()
	return jsonify([board.serialize for board in boards])

#게시판 추가
@api.route('/admin/board_add', methods = ['POST'])
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

		return jsonify(board), 201 


#게시판 삭제
@api.route('/admin/board_set/<id>', methods = ['DELETE'])
def board_set(id):
	board = Board.query.filter(Board.id == id).first()
	category = Category.query.filter(Category.id == board.category_id).first()		# 삭제할 게시판의 카테고리 찾기
	category.board_num -= 1 # 
	db.session.delete(board)
	db.session.commit()
	return "delete success"



# 카테고리 추가
@api.route('/admin/category_add', methods = ['POST'])
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

# @api. route('/admin/user_management', methods = ['POST'])
# def user_management():
