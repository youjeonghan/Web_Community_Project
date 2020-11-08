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
from config import *


# 이미지 기본 설정
def allowed_file(file):
    check = 1
    if (
        file.filename.rsplit(".", 1)[1].lower() not in ALLOWED_EXTENSIONS
        or "." not in file.filename
    ):
        check = 0

    return check


def pwd_check(password):
    result = {}
    if len(password) < 6 or len(password) > 12:
        result = {"error": "비밀번호는 6자리 이상 12자리 이하입니다.", "error_code": 403}  # 데이터 유효성 검사
        return result
    if len(re.findall("[^a-zA-Z0-9]", password)) == 0:
        result = {"error": "비밀번호에 특수문자가 포함되어 있어야 합니다.", "error_code": 403}  # 데이터 유효성 검사
        return result
    return result


def email_check(email):
    result = {}
    reg = re.findall("^[a-z0-9]{2,}@[a-z]{2,}\.[a-z]{2,}$", email)
    if len(reg) == 0:
        result = {"error": "이메일 형식이 옳지 않습니다.", "error_code": 403}  # 데이터 유효성 검사
        return result
    if User.query.filter(User.email == email).first():
        result = {"error": "이미 가입이 된적 있는 이메일입니다.", "error_code": 409}  # 중복 오류 코드
        return result
    return result



def stringfy_input_signup_data(input):
    return {
    "userid" : input.get("userid")
    ,"username" : input.get("username")
    ,"nickname" : input.get("nickname")
    ,"birth" : input.get("birth")
    ,"email" : input.get("email")
    ,"password" : input.get("password")
    ,"repassword" : input.get("repassword")
    }



def check_signup(data):
    if data["userid"] == "GM":
        return {"error": "이 아이디로는 가입하실 수 없습니다."}, 403
    if User.query.filter(User.userid == data["userid"]).first():  # id중복 검사
        return {"error": "already exist"}, 409  # 중복 오류 코드
    if not (data["userid"] and data["username"] and data["password"] and data["repassword"] and data["birth"]):
        # email를 제외한 5가지중 하나라도 입력받지 못한 경우 오류 코드
        return {"error": "No arguments"}, 400
    if pwd_check(data["password"]):  # 비밀번호 체크 코드
        result = pwd_check(data["password"])
        return result, result["error_code"]
    if data["password"] != data["repassword"]:  # 비밀번호 재확인과 비밀번호 일치 확인 코드
        return {"error": "비밀번호 재확인과 일치하지 않습니다."}, 401
    if User.query.filter(User.nickname == data["nickname"]).first():  # nickname 중복 검사
        return {"error": "이미 있는 닉네임입니다."}, 409  # 중복 오류 코드
    if data["email"]:

        if email_check(data["email"]):
            result = email_check(data["email"])
            return result, result["error_code"]

    return {},False


def detail_profile_img(profile_img):
    # 프로필 사진 이름 유저 테이블에 삽입 및 저장
    if profile_img and allowed_file(profile_img):  # 프로필 이미지 확장자 확인
        suffix = datetime.now().strftime("%y%m%d_%H%M%S")
        filename = "_".join(
            [profile_img.filename.rsplit(".", 1)[0], suffix]
        )  # 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
        extension = profile_img.filename.rsplit(".", 1)[1]
        filename = secure_filename(f"{filename}.{extension}")
        profile_img.save(os.path.join(UPLOAD_FOLDER, filename))
        return filename


def store_signup_db(data):
        # db 6개 회원정보 저장
    user = User()
    user.userid = data["userid"]
    user.username = data["username"]
    user.birth = data["birth"]
    user.nickname = data["nickname"]
    user.email = data["email"]
    user.password = generate_password_hash(data["password"])  # 비밀번호 해시
    user.profile_img = detail_profile_img(data["profile_img"])
    return user

def check_login(data,user):
    if user is None and data.get("userid") != current_app.config["ADMIN_ID"]:
        return {"error": "당신은 회원이 아니십니다."}, 401  # 클라이언트 인증 실패, 로그인 실패 오류 코드

    if data.get("userid") == current_app.config["ADMIN_ID"]:  # 관리자 아이디 권한 부여
        if data.get("password") == current_app.config["ADMIN_PW"]:
            return {},False
        else:
            return {"error": "패스워드가 다릅니다."}, 401  # 패스워드 잘못 입력 오류 코드

    if check_password_hash(user.password, data.get("password")):  # 해시화한 비밀번호 비교하기
        return {},False
    else:
        return {"error": "패스워드가 다릅니다."}, 401  # 패스워드 잘못 입력 오류 코드
