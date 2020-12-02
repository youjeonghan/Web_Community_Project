import re
from datetime import datetime
from flask import current_app
from werkzeug.security import check_password_hash
from models import User
from controllers.db_con import *

def check_gm_id(data):
	if data.get("userid") == "GM":
		return {"error": "이 아이디로는 가입하실 수 없습니다."}, 403
	return {}, False

def check_same_id(data):
	if search_table_by_id(User,data.get("userid")):  # id중복 검사
		return {"error": "already exist"}, 409  # 중복 오류 코드
	return {}, False

def check_data_exist(data):
	if None in data.values():
		# 데이터중 하나라도 입력받지 못한 경우 오류 코드
		return {"error": "No arguments"}, 400
	return {}, False

def check_password(data):
	password = data.get("password")
	if len(password) < 6 or len(password) > 12:
		return {"error": "비밀번호는 6자리 이상 12자리 이하입니다."}, 403  # 데이터 유효성 검사
	if len(re.findall("[^a-zA-Z0-9]", password)) == 0:
		return {"error": "비밀번호에 특수문자가 포함되어 있어야 합니다."}, 403  # 데이터 유효성 검사
	return {}, False

def check_repassword(data):
	if data.get("password") != data.get("repassword"):  # 비밀번호 재확인과 비밀번호 일치 확인 코드
		return {"error": "비밀번호 재확인과 일치하지 않습니다."}, 401
	return {}, False

def check_same_nickname(data):
	if search_table_by_nickname(User,data.get("nickname")):  # nickname 중복 검사
		return {"error": "이미 있는 닉네임입니다."}, 409  # 중복 오류 코드
	return {}, False

def check_email(data):
	email = data.get("email")
	reg = re.findall("^[a-z0-9]{2,}@[a-z]{2,}\.[a-z]{2,}$", email)
	if len(reg) == 0:
		return {"error": "이메일 형식이 옳지 않습니다."}, 403  # 데이터 유효성 검사
	if search_table_by_email(User,email):
		return {"error": "이미 가입이 된적 있는 이메일입니다."}, 409  # 중복 오류 코드
	return {}, False

def check_login_id(data,user):
	if user is None and data.get("userid") != current_app.config["ADMIN_ID"]:
		return {"error": "당신은 회원이 아니십니다."}, 401  # 클라이언트 인증 실패, 로그인 실패 오류 코드
	return {}, False


def check_login_password(data,user):
	if data.get("userid") == current_app.config["ADMIN_ID"]:  # 관리자 아이디 권한 부여
		if data.get("password") == current_app.config["ADMIN_PW"]:
			return {}, False

	if check_password_hash(user.password, data.get("password")):  # 해시화한 비밀번호 비교하기
		return {}, False
	return {"error": "패스워드가 다릅니다."}, 401  # 패스워드 잘못 입력 오류 코드


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

def check_login(data, user):
	check_function_list = [check_login_id,check_login_password]

	for func in check_function_list:
		error_msg ,error_code = func(data,user)
		if error_code:
			return error_msg ,error_code
	return {}, False