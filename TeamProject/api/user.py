import os
from api import api
from flask import request, redirect, abort
from flask import jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from werkzeug.utils import secure_filename
from controllers.user_con import *
from controllers.db_con import *
from controllers.temp_con import *
import re


@api.route("/sign_up", methods=["POST"])  # 회원 가입 api 및 임시로 데이터 확인api
def sign_up():

    data = stringfy_input_signup_data(request.form)

    error_msg, error_code = check_signup(data)
    if error_code:
        return jsonify(error_msg), error_code

    try:
        data["birth"] = datetime.strptime(
            data["birth"], "%Y-%m-%d"
        )  # json형식으로 받은 data를 날짜 형식으로 변환
    except ValueError:
        return jsonify({"error": "잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요"}), 403

    data["profile_img"] = request.files.get("profile_img")

    db.session.add(store_signup_db(data))
    db.session.commit()
    return jsonify({"msg": "success"}), 201


# 로그인 api
@api.route("/login", methods=["POST"])
def login():
    # id와 패스워드 받기
    data = request.get_json()

    user = User.query.filter(User.userid == data.get("userid")).first()

    error_msg, error_code = check_login(data, user)
    if error_code:
        return jsonify(error_msg), error_code

    return jsonify(
        result="success",
        access_token=create_access_token(
            identity=data.get("userid"), expires_delta=False
        ),
    )


# 로그인하지 않은 유저가 들어올때 처리를 다르게 해준다
# 유저정보 반환
@api.route("/user_info", methods=["GET"])
@jwt_required  # 데코레이터로 로그인 사용자만 화면에 접근할 수 있게 하는 구문,이 구문이 있는 페이지에 들어가려면  Authorization에 토큰을 보내주어야한다.
def user_info():
    check_user = get_jwt_identity()  # 토큰에서 identity꺼내서 userid를 넣는다.
    if check_user == "GM":
        return jsonify({"nickname": "GM", "profile_img": "GM.png"}), 201
    access_user = User.query.filter(
        User.userid == check_user
    ).first()  # 꺼낸 토큰이 유효한 토큰인지 확인
    if access_user is None:  # 제대로 된 토큰인지 확인
        return jsonify({"error": "해당 정보에 대한 접근 권한이 없습니다."}), 402
    else:
        access_user_info = {
            "id": access_user.id,
            "birth": access_user.birth.strftime("%Y-%m-%d"),
            "nickname": access_user.nickname,
            "username": access_user.username,
            "profile_img": access_user.profile_img,
            "black_num": access_user.black_num,
            "userid": access_user.userid,
            "email": access_user.email,
        }
        return jsonify(access_user_info), 201  # 모든 사용자정보 반환


# 아이디 삭제, 수정, id(primary key)값에 따른 정보확인
@api.route("/users/<id>", methods=["GET", "PUT", "DELETE"])
@jwt_required
def user_detail(id):
    # 토큰을 가지고 들어오면 해당 토큰의 userid가 접근하려는 정보의 userid값과 같은지를 확인
    check_user_token = get_jwt_identity()
    check_user = User.query.filter(User.id == id).first()
    if check_user_token != check_user.userid:
        # 들어온 토큰의 userid와 확인하려는 user의 id값이 다르면, 정보 확인 거절 -> 즉 다른 사용자가 다른 사용자의 userid를 확인하려는 경우
        return jsonify({"error": "Not your information"}), 400  # 같지 않은 경우 접근금지

    dict_methods_func = {"GET": user_get, "DELETE": user_delete, "PUT": user_put}

    json, code = dict_methods_func[request.method](check_user)
    return jsonify(json), code


# id로 프로필, 닉네임, 이메일(특정정보) 불러오는 api
@api.route("/user_specific_info/<id>")
def users_specific_info(id):
    user = User.query.filter(User.id == id).first()
    if user is None:
        print("없는 아이디입니다.")
        return {"error" : "없는 아이디"}, 403

    return jsonify({
        "nickname": user.nickname,
        "profile_img": user.profile_img,
        "email": user.email,
    })
