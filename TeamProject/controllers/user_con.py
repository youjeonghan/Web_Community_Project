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
from config import *


def access_user_return():
    user_id = get_jwt_identity()
    access_user = User.query.filter(User.userid == user_id).first()
    if access_user is None and user_id != "GM":
        return None
    else:
        return access_user


def check_gm():
    check_user = get_jwt_identity()
    if check_user == "GM":
        return {"error": "GM은 이용할수없습니다."}, 403


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
    if data.get("userid") == "GM":
        return {"error": "이 아이디로는 가입하실 수 없습니다."}, 403
    if search_table_by_id(User,data.get("userid")):  # id중복 검사
        return {"error": "already exist"}, 409  # 중복 오류 코드
    print(data,None in data.values())
    if None in data.values():
        # 7가지중 하나라도 입력받지 못한 경우 오류 코드
        return {"error": "No arguments"}, 400
    if pwd_check(data.get("password")):  # 비밀번호 체크 코드
        result = pwd_check(data["password"])
        return result, result["error_code"]
    if data.get("password") != data.get("repassword"):  # 비밀번호 재확인과 비밀번호 일치 확인 코드
        return {"error": "비밀번호 재확인과 일치하지 않습니다."}, 401
    if search_table_by_nickname(User,data.get("nickname")):  # nickname 중복 검사
        return {"error": "이미 있는 닉네임입니다."}, 409  # 중복 오류 코드
    if email_check(data.get("email")):
        result = email_check(data.get("email"))
        return result, result["error_code"]
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
    if user is None and data.get("userid") != current_app.config["ADMIN_ID"]:
        return {"error": "당신은 회원이 아니십니다."}, 401  # 클라이언트 인증 실패, 로그인 실패 오류 코드

    if data.get("userid") == current_app.config["ADMIN_ID"]:  # 관리자 아이디 권한 부여
        if data.get("password") == current_app.config["ADMIN_PW"]:
            return {}, False
        else:
            return {"error": "패스워드가 다릅니다."}, 401  # 패스워드 잘못 입력 오류 코드

    if check_password_hash(user.password, data.get("password")):  # 해시화한 비밀번호 비교하기
        return {}, False
    else:
        return {"error": "패스워드가 다릅니다."}, 401  # 패스워드 잘못 입력 오류 코드


def user_get(check_user):
    id = check_user.id
    user = User.query.filter(User.id == id).first()
    return {
        "id": user.id,
        "birth": user.birth.strftime("%Y-%m-%d"),
        "nickname": user.nickname,
        "username": user.username,
        "profile_img": user.profile_img,
        "black_num": user.black_num,
        "userid": user.userid,
        "email": user.email,
    }, 200


def user_delete(check_user):  # 삭제
    id = check_user.id
    db.session.query(User).filter(User.id == id).delete()
    db.session.commit()

    return {"result": "success"}, 204  # 204s는 상태 콜


def user_put(check_user):
    username = request.form.get("username")
    nickname = request.form.get("nickname")
    birth = request.form.get("birth")  # 생년월일를 보낼 때는 YYYY-MM-XX형식으로
    email = request.form.get("email")
    password = request.form.get("password")
    profile_img = request.files.get("profile_img")

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
        try:
            dt = datetime.strptime(birth, "%Y-%m-%d")  # json형식으로 받은 data를 날짜 형식으로 변환
        except ValueError:
            return {"error": "잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요"}, 403
        updated_data["birth"] = dt

    # 프로필 사진이 존재하고 그 사진이 제대로 된 파일인지 확인
    if profile_img and allowed_file(profile_img):  # 프로필 이미지 확장자 확인
        folder_url = "static/img/profile_img/"
        if check_user.profile_img != "user-image.png":  # 기존에 프로필 사진이 있을 때 해당 프로필 사진 삭제
            delete_target = folder_url + check_user.profile_img
            if os.path.isfile(delete_target):  # 해당 프로필 사진 삭제
                os.remove(delete_target)

        suffix = datetime.now().strftime("%y%m%d_%H%M%S")
        filename = "_".join(
            [profile_img.filename.rsplit(".", 1)[0], suffix]
        )  # 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
        extension = profile_img.filename.rsplit(".", 1)[1]
        filename = secure_filename(f"{filename}.{extension}")

        updated_data["profile_img"] = filename
        profile_img.save(os.path.join(UPLOAD_PROFILE_FOLDER, filename))

    if updated_data:
        User.query.filter(User.id == check_user.id).update(
            updated_data
        )  # PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
        db.session.commit()

    return {"result": "success"}, 201
