import os
from flask import request, redirect, abort
from flask import jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User
from models import db
from datetime import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import re
from controllers.temp_con import *
from controllers.db_con import *
from controllers.error_con import *
from config import *


def access_user_return():
	user_id = get_jwt_identity()
	access_user = search_table_by_id(User,user_id)
	if access_user is None and user_id != "GM":
		return None
	else:
		return access_user


def check_gm():
	check_user = get_jwt_identity()
	if check_user == "GM":
		return {"error": "GM은 이용할수없습니다."}, 403


def sign_up_con(request):
	data = dictionaryfy_input_signup_data(request)

	error_msg, error_code = check_signup(data)
	if error_code:
		return jsonify(error_msg), error_code

	data["profile_img"] = request.files.get("profile_img")
	db.session.add(store_signup_db(data))
	db.session.commit()
	return jsonify({"msg": "success"}), 201


def login_con(data):
	user = search_table_by_userid(User, data.get("userid"))

	error_msg, error_code = check_login(data, user)
	if error_code:
		return jsonify(error_msg), error_code

	return jsonify(
		result="success",
		access_token=create_access_token(
			identity=data.get("userid"), expires_delta=False
		),
	)

def user_info_con():
	check_user = get_jwt_identity()  # 토큰에서 identity꺼내서 userid를 넣는다.
	if check_user == "GM":
		return jsonify({"nickname": "GM", "profile_img": "GM.png"}), 201
	access_user = search_table_by_userid(User,check_user)
	if access_user is None:  # 제대로 된 토큰인지 확인
		return jsonify({"error": "해당 정보에 대한 접근 권한이 없습니다."}), 402
	else:
		access_user_info = access_user.serialize
		del access_user_info['password']
		return jsonify(access_user_info), 201  # 모든 사용자정보 반환

def dictionaryfy_input_signup_data(input):
	return {
		"userid": input.form.get("userid"),
		"username": input.form.get("username"),
		"nickname": input.form.get("nickname"),
		"birth": input.form.get("birth"),
		"email": input.form.get("email"),
		"password": input.form.get("password"),
		"repassword": input.form.get("repassword"),
	}


def check_signup(data):
	check_function_list = [
		check_gm_id
		,check_same_id
		,check_data_exist
		,check_password
		,check_repassword
		,check_same_nickname
		,check_email
		]

	for func in check_function_list:
		error_msg ,error_code = func(data)
		if error_code:
			return error_msg ,error_code

	try:
		data["birth"] = datetime.strptime(
			data["birth"], "%Y-%m-%d"
		)  # json형식으로 받은 data를 날짜 형식으로 변환
	except ValueError:
		return {"error": "잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요"}, 403

	return {}, False


def store_signup_db(data):
	# db 6개 회원정보 저장
	user = User()
	user.userid = data["userid"]
	user.username = data["username"]
	user.birth = data["birth"]
	user.nickname = data["nickname"]
	user.email = data["email"]
	user.password = generate_password_hash(data["password"])  # 비밀번호 해시
	user.profile_img = manufacture_img(data.get("profile_img"), UPLOAD_PROFILE_FOLDER)
	return user


def check_login(data, user):
	check_function_list = [check_login_id,check_login_password]

	for func in check_function_list:
		error_msg ,error_code = func(data,user)
		if error_code:
			return error_msg ,error_code
	return {}, False



def user_get(check_user):
	user = search_table_by_id(User,check_user.id)
	access_user_info = access_user.serialize
	del access_user_info['password']

	return access_user_info, 200


def user_delete(check_user):  # 삭제
	delete_column_by_id(User,check_user.id)
	return {"result": "success"}, 204  # 204s는 상태 콜


# def user_put(check_user):

# 	username = request.form.get("username")
# 	nickname = request.form.get("nickname")
# 	birth = request.form.get("birth")  # 생년월일를 보낼 때는 YYYY-MM-XX형식으로
# 	email = request.form.get("email")
# 	password = request.form.get("password")
# 	profile_img = request.files.get("profile_img")

# 	updated_data = {}
# 	# 바꿀 username을 입력받았는지와 기존의 username과 같은지를 확인
# 	if username and username != check_user.username:
# 		updated_data["username"] = username

# 	# 바꿀 password를 입력받으면
# 	if password and check_password_hash(check_user.password, password):
# 		if pwd_check(password):  # 비밀번호 체크 코드
# 			result = pwd_check(password)
# 			return result, result["error_code"]
# 		updated_data["password"] = generate_password_hash(password)

# 	if nickname and nickname != check_user.nickname:  # 바꿀 nickname을 입력받으면
# 		if User.query.filter(User.nickname == nickname).first():  # nickname 중복 검사
# 			return {"error": "이미 있는 닉네임입니다."}, 409
# 		updated_data["nickname"] = nickname

# 	if email and email != check_user.email:  # 바꿀 email를 입력받으면
# 		if email_check(email):
# 			result = email_check(email)
# 			return result, result["error_code"]
# 		updated_data["email"] = email

# 	if birth and birth != check_user.birth:  # 바꿀 생년월일을 입력받으면
# 		try:
# 			dt = datetime.strptime(birth, "%Y-%m-%d")  # json형식으로 받은 data를 날짜 형식으로 변환
# 		except ValueError:
# 			return {"error": "잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요"}, 403
# 		updated_data["birth"] = dt

# 	# 프로필 사진이 존재하고 그 사진이 제대로 된 파일인지 확인
# 	if profile_img and allowed_file(profile_img):  # 프로필 이미지 확장자 확인
# 		folder_url = "static/img/profile_img/"
# 		if check_user.profile_img != "user-image.png":  # 기존에 프로필 사진이 있을 때 해당 프로필 사진 삭제
# 			delete_target = folder_url + check_user.profile_img
# 			if os.path.isfile(delete_target):  # 해당 프로필 사진 삭제
# 				os.remove(delete_target)

# 		suffix = datetime.now().strftime("%y%m%d_%H%M%S")
# 		filename = "_".join(
# 			[profile_img.filename.rsplit(".", 1)[0], suffix]
# 		)  # 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
# 		extension = profile_img.filename.rsplit(".", 1)[1]
# 		filename = secure_filename(f"{filename}.{extension}")

# 		updated_data["profile_img"] = filename
# 		profile_img.save(os.path.join(UPLOAD_PROFILE_FOLDER, filename))

# 	if updated_data:
# 		User.query.filter(User.id == check_user.id).update(
# 			updated_data
# 		)  # PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
# 		db.session.commit()

# 	return {"result": "success"}, 201


def user_put(check_user):

	username = request.form.get("username")
	nickname = request.form.get("nickname")
	birth = request.form.get("birth")  # 생년월일를 보낼 때는 YYYY-MM-XX형식으로
	email = request.form.get("email")
	password = request.form.get("password")
	profile_img = request.files.get("profile_img")
	print()
	updated_data = {}

	# 바꿀 username을 입력받았는지와 기존의 username과 같은지를 확인
	if username and username != check_user.username:
		updated_data["username"] = username

	# 바꿀 password를 입력받으면
	if password and check_password_hash(check_user.password, password):
		if pwd_check(password):  # 비밀번호 체크 코드
			result = pwd_check(password)
			return result, result["error_code"]
		updated_data["password"] = generate_password_hash(password)

	if nickname and nickname != check_user.nickname:  # 바꿀 nickname을 입력받으면
		if User.query.filter(User.nickname == nickname).first():  # nickname 중복 검사
			return {"error": "이미 있는 닉네임입니다."}, 409
		updated_data["nickname"] = nickname

	if email and email != check_user.email:  # 바꿀 email를 입력받으면
		if email_check(email):
			result = email_check(email)
			return result, result["error_code"]
		updated_data["email"] = email

	if birth and birth != check_user.birth:  # 바꿀 생년월일을 입력받으면
		birth_list = birth.split()
		month_dic = {'Jan' : '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06'
		, 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
		result = birth_list[3] + "-" + month_dic[birth_list[2]] + "-" + birth_list[1]
		dt = datetime.strptime(result, "%Y-%m-%d")  # json형식으로 받은 data를 날짜 형식으로 변환
		updated_data["birth"] = dt

	# 프로필 사진이 존재하고 그 사진이 제대로 된 파일인지 확인
	updated_data["profile_img"] = manufacture_img(profile_img,UPLOAD_PROFILE_FOLDER)

	if updated_data:
		User.query.filter(User.id == check_user.id).update(
			updated_data
		)  # PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
		db.session.commit()

	return {"result": "success"}, 201