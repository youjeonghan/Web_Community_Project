from datetime import datetime
from flask import request
from flask import jsonify
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from werkzeug.security import generate_password_hash
from models import User
from controllers.common_con import *
from controllers.db_con import *
from controllers.check_con import *
from config import UPLOAD_PROFILE_FOLDER


def access_user_return():
    user_id = get_jwt_identity()
    access_user = search_table_by_id(User, user_id)
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
    insert_table(make_object_user(data))

    return jsonify({"msg": "success"}), 201


def login_con(data):
    user = search_table_by_userid(User, data.get("userid"))

    error_msg, error_code = check_login(data, user)
    if error_code:
        return jsonify(error_msg), error_code

    return jsonify(
        result="success",
        access_token=create_access_token(identity=data.get("userid"), expires_delta=False),
    )


def user_info_con(check_user):
    if check_user == "GM":
        return jsonify({"nickname": "GM", "profile_img": "GM.png"}), 201
    access_user = search_table_by_userid(User, check_user)
    if access_user is None:  # 제대로 된 토큰인지 확인
        return jsonify({"error": "해당 정보에 대한 접근 권한이 없습니다."}), 402
    else:
        access_user_info = access_user.serialize
        del access_user_info["password"]
        return jsonify(access_user_info), 201  # 모든 사용자정보 반환


def user_datail_con(check_user_token, id):
    # 토큰을 가지고 들어오면 해당 토큰의 userid가 접근하려는 정보의 userid값과 같은지를 확인
    check_user = search_table_by_id(User, id)
    if check_user_token != check_user.userid:
        # 들어온 토큰의 userid와 확인하려는 user의 id값이 다르면, 정보 확인 거절 -> 즉 다른 사용자가 다른 사용자의 userid를 확인하려는 경우
        return jsonify({"error": "Not your information"}), 400  # 같지 않은 경우 접근금지

    methods_function_dictionary = {"GET": user_get, "DELETE": user_delete, "PUT": user_put}

    json, code = methods_function_dictionary[request.method](check_user)
    return jsonify(json), code


def user_specific_info_con(id):
    user = search_table_by_id(User, id)
    if user is None:
        print("없는 아이디입니다.")
        return {"error": "없는 아이디"}, 403

    return jsonify(
        {
            "nickname": user.nickname,
            "profile_img": user.profile_img,
            "email": user.email,
        }
    )


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


def dictionaryfy_update_user_data(input):
    return {
        "username": input.form.get("username"),
        "nickname": input.form.get("nickname"),
        "birth": input.form.get("birth"),
        "email": input.form.get("email"),
        "profile_img": input.files.get("profile_img"),
    }


def make_object_user(data):
    user = User()
    user.userid = data["userid"]
    user.username = data["username"]
    user.birth = data["birth"]
    user.nickname = data["nickname"]
    user.email = data["email"]
    user.password = generate_password_hash(data["password"])  # 비밀번호 해시
    user.profile_img = manufacture_img(data.get("profile_img"), UPLOAD_PROFILE_FOLDER)
    return user


def user_get(check_user):
    user = search_table_by_id(User, check_user.id)
    access_user_info = access_user.serialize
    del access_user_info["password"]

    return access_user_info, 200


def user_delete(check_user):  # 삭제
    delete_column_by_id(User, check_user.id)
    return {"result": "success"}, 204  # 204s는 상태 콜


def user_put(check_user):
    data = dictionaryfy_update_user_data(request)
    updated_data = {"username": data.get("username")}

    if data.get("nickname") and data.get("nickname") != check_user.nickname:  # 바꿀 nickname을 입력받으면
        error_msg, error_code = check_same_nickname(data)
        if error_code:
            return error_msg, error_code
        updated_data["nickname"] = data.get("nickname")

    if data.get("email") and data.get("email") != check_user.email:  # 바꿀 email를 입력받으면
        error_msg, error_code = check_email(data)
        if error_code:
            return error_msg, error_code
        updated_data["email"] = data.get("email")

    birth_list = data.get("birth").split()
    month_dic = {
        "Jan": "01",
        "Feb": "02",
        "Mar": "03",
        "Apr": "04",
        "May": "05",
        "Jun": "06",
        "Jul": "07",
        "Aug": "08",
        "Sep": "09",
        "Oct": "10",
        "Nov": "11",
        "Dec": "12",
    }

    result = birth_list[3] + "-" + month_dic[birth_list[2]] + "-" + birth_list[1]
    dt = datetime.strptime(result, "%Y-%m-%d")  # json형식으로 받은 data를 날짜 형식으로 변환
    updated_data["birth"] = dt

    # 프로필 사진이 존재하고 그 사진이 제대로 된 파일인지 확인
    if data.get("profile_img"):
        updated_data["profile_img"] = manufacture_img(
            data.get("profile_img"), UPLOAD_PROFILE_FOLDER
        )

    update_column(User, check_user.id, updated_data)

    return {"result": "success"}, 201
