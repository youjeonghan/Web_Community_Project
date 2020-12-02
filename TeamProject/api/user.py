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
    return sign_up_con(request)


# 로그인 api
@api.route("/login", methods=["POST"])
def login():
    return login_con(request.get_json())



#유저 정보 반환
@api.route("/user_info", methods=["GET"])
@jwt_required  # 데코레이터로 로그인 사용자만 화면에 접근할 수 있게 하는 구문,이 구문이 있는 페이지에 들어가려면  Authorization에 토큰을 보내주어야한다.
def user_info():
    return user_info_con()



# 아이디 삭제, 수정, id(primary key)값에 따른 정보확인
@api.route("/users/<id>", methods=["GET", "PUT", "DELETE"])
@jwt_required
def user_detail(id):
    # 토큰을 가지고 들어오면 해당 토큰의 userid가 접근하려는 정보의 userid값과 같은지를 확인
    check_user_token = get_jwt_identity()
    check_user = search_table_by_id(User,id)
    if check_user_token != check_user.userid:
        # 들어온 토큰의 userid와 확인하려는 user의 id값이 다르면, 정보 확인 거절 -> 즉 다른 사용자가 다른 사용자의 userid를 확인하려는 경우
        return jsonify({"error": "Not your information"}), 400  # 같지 않은 경우 접근금지

    methods_function_dictionary = {"GET": user_get, "DELETE": user_delete, "PUT": user_put}

    json, code = methods_function_dictionary[request.method](check_user)
    return jsonify(json), code


# id로 프로필, 닉네임, 이메일(특정정보) 불러오는 api
@api.route("/user_specific_info/<id>")
def users_specific_info(id):
    user = search_table_by_id(User,id)
    if user is None:
        print("없는 아이디입니다.")
        return {"error" : "없는 아이디"}, 403

    return jsonify({
        "nickname": user.nickname,
        "profile_img": user.profile_img,
        "email": user.email,
    })
