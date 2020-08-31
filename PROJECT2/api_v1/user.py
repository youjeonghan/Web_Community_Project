from . import api
from flask import request
from flask import jsonify
from models import Ruser, db
from flask_jwt import jwt_required

@api.route('/users', methods=['POST','GET'])#GET은 데이터에 대한 조회 POST는 생성
# @jwt_required()#데코레이터로 로그인 사용자만 화면에 접근할 수 있게 하는 구문,이 구문이 있는 페이지에 들어가려면  Authorization에 토큰을 보내주어야한다.
def users():
    if request.method == 'POST':
        data = request.get_json()
        #4개 데이터 받기
        userid = data.get('userid')
        username = data.get('username')
        password = data.get('password')
        repassword = data.get('repassword')
        print(userid,username,password)
        
        if not (userid and username and password and repassword):#4가지중 하나라도 입력받지 못한 경우 오류 코드
            return jsonify({'error': 'No arguments'}), 400
        if password != repassword:#비밀번호 재확인과 비밀번호 일치 확인 코드
            return jsonify({'error':'Wrong password'}), 400
    #db 저장
        ruser = Ruser()
        ruser.userid = userid
        ruser.username = username
        ruser.password = password

        db.session.add(ruser)
        db.session.commit()

        response_object = {
                    'status': '성공'
        }
        return  jsonify(response_object), 201
    
    users = Ruser.query.all()
    # res_users = {}
    # for user in users:#반복문을 돌면서 직렬화된 변수를 넣어서 새로운 리스트를 만든다.
    #     res_users.append(user.serialize)
    # return jsonify(res_users)
    return jsonify([user.serialize for user in users])#모든 사용자정보 반환


@api.route('/user_info', methods=['GET'])
# @jwt_required()#데코레이터로 로그인 사용자만 화면에 접근할 수 있게 하는 구문,이 구문이 있는 페이지에 들어가려면  Authorization에 토큰을 보내주어야한다.
def user_info():
    users = Ruser.query.all()
    # res_users = {}
    # for user in users:#반복문을 돌면서 직렬화된 변수를 넣어서 새로운 리스트를 만든다.
    #     res_users.append(user.serialize)
    # return jsonify(res_users)
    return jsonify([user.serialize for user in users])#모든 사용자정보 반환


@api.route('/users/<uid>', methods=['GET','PUT','DELETE'])#아이디 삭제, 수정, id(primary key)값에 따른 정보확인
def user_detail(uid):
    if request.method == 'GET':#아이디 정보 확인
        user = Ruser.query.filter(Ruser.id == uid).first()
        return jsonify(user.serialize)

    elif request.method == 'DELETE':#삭제
        db.session.query(Ruser).filter(Ruser.id == uid).delete()
        db.session.commit()
        return jsonify("delete_success")#204s는 상태 콜

    #밑에 코드는 PUT으로 정보 수정시 사용
    data = request.get_json()#POST형식에 경우 form형식으로 데이터를 전달하지만 api호출할 때처럼 json데이터를 전달할 때는 form에 데이터가 없으므로 다른 방식을 써야한다.

    userid = data.get('userid')
    username = data.get('username')
    password = data.get('password')

    updated_data = {}
    if userid:#userid가 있으면
        updated_data['userid'] = userid
    if username:
        updated_data['username'] = username
    if password:
        updated_data['password'] = password
  
    Ruser.query.filter(Ruser.id == uid).update(updated_data)#PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
    user = Ruser.query.filter(Ruser.id == uid).first()
    return jsonify(user.serialize)