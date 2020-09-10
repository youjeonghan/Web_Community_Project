from api import api
from flask import request
from flask import jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# 임시
from flask import g


# @api.before_app_request은 플라스크에서 제공하는 기능으로 이 어노테이션이 적용된 함수는 라우트 함수 실행전에 항상 먼저 실행된다
# @api.before_app_request
# def load_logged_in_user():
# 	user = get_jwt_identity()
# 	print(user)
# 	access_user = User.query.filter(User.userid == user).first()
# 	print(access_user)
# 	if user is None:
# 		g.user = None
# 		print("Fail")
# 	else:
# 		g.user = User.query.get(user.id)
# 		print(g.user.id)

@api.route('/sign_up', methods=['POST'])# 회원 가입 api 및 임시로 데이터 확인api
def sign_up():
	
	data = request.get_json()
	  # 6개 데이터 받기(실명, 생년월일, 아이디, 비번, 이메일, 닉네임)
	userid = data.get('userid')
	username = data.get('username')
	nickname = data.get('nickname')
	birth = data.get('birth')# 생년월일를 보낼 때는 YYYY-MM-XX형식으로
	email = data.get('email')
	password = data.get('password')
	repassword = data.get('repassword')

	dt = datetime.strptime(birth, "%Y-%m-%d")# json형식으로 받은 data를 날짜 형식으로 변환

	if User.query.filter(User.userid == userid).first():# id중복 검사
		return jsonify({'error':'already exist'}), 400
	
	if not (userid and username and password and repassword and birth):# email를 제외한 5가지중 하나라도 입력받지 못한 경우 오류 코드
		return jsonify({'error': 'No arguments'}), 400
	if password != repassword:# 비밀번호 재확인과 비밀번호 일치 확인 코드
		return jsonify({'error':'Wrong password'}), 400
	
	# db 6개 회원정보 저장
	user = User()
	user.userid = userid
	user.username = username
	user.birth = dt
	user.nickname = nickname
	user.email = email
	user.password = generate_password_hash(password)# 비밀번호 해시

	db.session.add(user)
	db.session.commit()

	response_object = {
		'status': '성공'
	}
	return jsonify(response_object), 201
	
	# users = User.query.all()
	# return jsonify([user.serialize for user in users])# 모든 사용자정보 반환
	# res_users = {}
	# for user in users:# 반복문을 돌면서 직렬화된 변수를 넣어서 새로운 리스트를 만든다.
	#     res_users.append(user.serialize)
	# return jsonify(res_users)


# 로그인 api 
@api.route('/login', methods=['POST'])
def login():
	# id와 패스워드 받기
	data = request.get_json()
	userid = data.get('userid')
	password = data.get('password')

	user = User.query.filter(User.userid == userid).first()
	
	if user is None:
		return jsonify(
			result = "not found"
		)
	
	if check_password_hash(user.password, password):		# 해시화한 비밀번호 비교하기
		return jsonify(
			result = "success",
			access_token = create_access_token(
				identity = userid,
				expires_delta = False
			)
		)
	else:
		return jsonify(result = "incorrect Password")

# 유저정보 반환
@api.route('/user_info', methods=['GET'])
@jwt_required		# 데코레이터로 로그인 사용자만 화면에 접근할 수 있게 하는 구문,이 구문이 있는 페이지에 들어가려면  Authorization에 토큰을 보내주어야한다.
def user_info():
	check_user = get_jwt_identity()		# 토큰에서 identity꺼내서 userid를 넣는다.
	print(check_user)
	access_user = User.query.filter(User.userid == check_user).first()# 꺼낸 토큰이 유효한 토큰인지 확인
	
	if access_user is None:		# 제대로 된 토큰인지 확인
		return "user only"
	else:
		return jsonify(access_user.serialize)# 모든 사용자정보 반환

	# ------------------------------신경 안써도댐------------------------------
	#  res_users = {}
	#  for user in users:# 반복문을 돌면서 직렬화된 변수를 넣어서 새로운 리스트를 만든다.
	#      res_users.append(user.serialize)
	#  return jsonify(res_users)
	# ------------------------------------------------------------------------

# 주의 : primary 키인 id가 아니라 userid를 uri로 받음..
# 아이디 삭제, 수정, id(primary key)값에 따른 정보확인
@api.route('/users/<userid>', methods=['GET','PUT','DELETE'])
@jwt_required
def user_detail(userid):
	# 토큰을 가지고 들어오면 해당 토큰의 userid가 접근하려는 정보의 userid값과 같은지를 확인
	check_user_token = get_jwt_identity()
	if check_user_token != userid: # 들어온 토큰의 userid와 확인하려는 user의 id값이 다르면, 정보 확인 거절 -> 즉 다른 사용자가 다른 사용자의 userid를 확인하려는 경우
			return "Not your information"# 같지 않은 경우 접근금지

	if request.method == 'GET':# 아이디 정보 확인
		user = User.query.filter(User.userid == userid).first()
		return jsonify(user.serialize)

	elif request.method == 'DELETE':# 삭제
		db.session.query(User).filter(User.userid == userid).delete()
		db.session.commit()
		return jsonify("delete_success")# 204s는 상태 콜
	# 밑에 코드의 method는 'PUT'으로 아이디 수정

	data = request.get_json()# POST형식에 경우 form형식으로 데이터를 전달하지만 api호출할 때처럼 json데이터를 전달할 때는 form에 데이터가 없으므로 다른 방식을 써야한다.

	username = data.get('username')
	password = data.get('password')
	nickname = data.get('nickname')
	email = data.get('email')
	birth = data.get('birth')

	dt = datetime.strptime(birth, "%Y-%m-%d")# json형식으로 받은 data를 날짜 형식으로 변환

	updated_data = {}
	if username:# 바꿀 username을 입력받으면
		updated_data['username'] = username
	if password:# 바꿀 password를 입력받으면
		updated_data['password'] = password
	if nickname:# 바꿀 nickname을 입력받으면
		updated_data['nickname'] = nickname
	if email:# 바꿀 email를 입력받으면
		updated_data['email'] = email
	if birth:# 바꿀 생년월일을 입력받으면
		updated_data['birth'] = dt

	User.query.filter(User.userid == userid).update(updated_data)# PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
	user = User.query.filter(User.userid == userid).first()
	return jsonify(user.serialize)

# 자동로그인을 할지 안할지를 반환
# 인자로 자동로그인을 할 떄는 1 아닐 때는 0을 반환해주어야 한다.
@api.route('/auto_login/<int:auto_login>') # methods가 아무것도 안적혀 있을 때는 GET으로 설정되어있음
@jwt_required
def auto_login():
    check_user= get_jwt_identity()
    access_user = User.query.filter(User.userid == check_user).first()# 꺼낸 토큰이 유효한 토큰인지 확인
    if access_user is None:
        return "User only"
    # 1아니면 0 값을 보내야하는데 다른 값을 보내는 경우 오류
    if auto_login != 1 or auto_login != 0:
        return "Wrong Value of auto_login"

    access_user.auto_login = auto_login
    result = access_user.auto_login
    return jsonify(
        result = result
    )

