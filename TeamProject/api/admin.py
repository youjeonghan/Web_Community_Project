# from flask import jsonify
from api import api
from flask import jsonify, request
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import Admin, User, db, Category
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


# 카테고리 추가
@api.route('/admin/category_add', methods = ['POST'])
def add_category():
	data = request.get_json()
	board_name = data.get('board_name')

	category = Category()
	category.board_name = board_name

	db.session.add(category)
	db.session.commit()

	categories = Category.query.all()	
	
	return jsonify([cat.serialize for cat in categories])


# 카테고리 수정, 삭제
@api.route('/admin/category_set/<title>', methods = ['DELETE','PUT'])
def category_set(title):
	# 카테고리 삭제
	if request.method == 'DELETE':
		category = Category.query.filter(Category.board_name == title).first()
		db.session.delete(category)
		db.session.commit()
		return "delete success"

	# 카테고리 수정
	data = request.get_json()
	Category.query.filter(Category.board_name == title).update(data)
	return "수정이 완료되었습니다"

	#----------------확인 코드------------------------------------
	# category = Category.query.all()
	# return jsonify([cat_data.serialize for cat_data in category])
