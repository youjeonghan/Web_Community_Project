from flask import request
from models import User, db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re
from config import ALLOWED_EXTENSIONS, UPLOAD_FOLDER


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


# def get_sign_up_data(data):
#         # 6개 데이터 받기(실명, 생년월일, 아이디, 비번, 이메일, 닉네임)
#     userid = data.get("userid")
#     username = data.get("username")
#     nickname = data.get("nickname")
#     birth = data.get("birth")  # 생년월일를 보낼 때는 YYYY-MM-XX형식으로
#     email = data.get("email")
#     password = data.get("password")
#     repassword = data.get("repassword")
#     return
