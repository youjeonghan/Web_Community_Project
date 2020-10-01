import os
from api import api
from flask import request, redirect,abort
from flask import jsonify,current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from werkzeug.utils import secure_filename
import re
# 임시
from flask import g
# 이미지 기본 설정
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/img/profile_img'
def allowed_file(file):
   check = 1
   if file.filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS or '.' not in file.filename:
      check = 0
         
   return check

# 프로필 사진 업로드
@api.route('/profile_img_upload/<id>', methods=['POST']) 
@jwt_required
def projile_img_upload(id):
	profile_img = request.files['profile_img']		# 프로필 사진 받아도 되고 안받아도 됨
	# POST request에 파일 정보가 있는지 확인
	print(request.files)

	if 'profile_img' not in request.files:
		print('No file part')
		return redirect('api/progile_img_upload/<id>')

	# 만약 유저가 파일을 고르지 않았을 경우
	if profile_img.filename == '':
		print('No selected file')
		return redirect('api/progile_img_upload/<id>')
	
	# 프로필 사진 이름 유저 테이블에 삽입 및 저장
	if profile_img and allowed_file(profile_img):		# 프로필 이미지 확장자 확인
		suffix = datetime.now().strftime("%y%m%d_%H%M%S")				
		filename = "_".join([profile_img.filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
		extension = profile_img.filename.rsplit('.', 1)[1]
		filename = secure_filename(f"{filename}.{extension}")

		user = User.query.filter(User.id == id).first()
		user.profile_img = filename 
		db.session.add(user)
		db.session.commit()

		profile_img.save(os.path.join(UPLOAD_FOLDER, filename))
		return {"msg": "프로필 사진 등록 완료"}, 201
	return	{"msg": "프로필 사진 등록이 안댓다"}, 404

def pwd_check(password):
	result={}
	if len(password) < 6 or len(password) > 12:
		result = {
			'error':'비밀번호는 6자리 이상 12자리 이하입니다.',
			'error_code':403		# 데이터 유효성 검사
			}
		return result
	if len(re.findall("[^a-zA-Z0-9]",password)) == 0:
		result = {
			'error':'비밀번호에 특수문자가 포함되어 있어야 합니다.',
			'error_code':403		# 데이터 유효성 검사
		}
		return result
	return result

def email_check(email):
	result = {}
	reg = re.findall("^[a-z0-9]{2,}@[a-z]{2,}\.[a-z]{2,}$",email)
	if len(reg) == 0:
		result = {
			'error':'이메일 형식이 옳지 않습니다.',
			'error_code':403		# 데이터 유효성 검사
		}
		return result
	if User.query.filter(User.email == email).first():
		result = {
			'error':'이미 가입이 된적 있는 이메일입니다.',
			'error_code':409		#중복 오류 코드
		}
		return result
	return result

@api.route('/sign_up', methods=['POST'])# 회원 가입 api 및 임시로 데이터 확인api
def sign_up():
	
	# 6개 데이터 받기(실명, 생년월일, 아이디, 비번, 이메일, 닉네임)
	userid = request.form.get('userid')
	username = request.form.get('username')
	nickname = request.form.get('nickname')
	birth = request.form.get('birth')		# 생년월일를 보낼 때는 YYYY-MM-XX형식으로
	email = request.form.get('email')
	password = request.form.get('password')
	repassword = request.form.get('repassword')
	try:		# 프로필 사진 받아도 되고 안받아도 됨
		profile_img = request.files['profile_img']
	except:
		profile_img = None
	if userid == "GM":
		return jsonify({'error':'이 아이디로는 가입하실 수 없습니다.'}),403
	if User.query.filter(User.userid == userid).first():		# id중복 검사
		return jsonify({'error':'already exist'}), 409			#중복 오류 코드
	if not (userid and username and password and repassword and birth):			# email를 제외한 5가지중 하나라도 입력받지 못한 경우 오류 코드
		return jsonify({'error': 'No arguments'}), 400
	if pwd_check(password):		# 비밀번호 체크 코드
		result = pwd_check(password)
		return jsonify(result),result['error_code']
	if password != repassword:		# 비밀번호 재확인과 비밀번호 일치 확인 코드
		return jsonify({'error':'비밀번호 재확인과 일치하지 않습니다.'}), 401
	if User.query.filter(User.nickname == nickname).first():		# nickname 중복 검사
		return jsonify({'error':'이미 있는 닉네임입니다.'}), 409		#중복 오류 코드
	if email:
		if email_check(email):
			result = email_check(email)
			return jsonify(result),result['error_code']
	try:
		dt = datetime.strptime(birth, "%Y-%m-%d")		# json형식으로 받은 data를 날짜 형식으로 변환
	except ValueError:
		return jsonify({'error':'잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요'}), 403
	
	
	
	# db 6개 회원정보 저장
	user = User()
	user.userid = userid
	user.username = username
	user.birth = dt
	user.nickname = nickname
	user.email = email
	user.password = generate_password_hash(password)# 비밀번호 해시
	
	
	# 프로필 사진 이름 유저 테이블에 삽입 및 저장
	if profile_img and allowed_file(profile_img):		# 프로필 이미지 확장자 확인
		suffix = datetime.now().strftime("%y%m%d_%H%M%S")				
		filename = "_".join([profile_img.filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
		extension = profile_img.filename.rsplit('.', 1)[1]
		filename = secure_filename(f"{filename}.{extension}")
		profile_img.save(os.path.join(UPLOAD_FOLDER, filename)) 
		user.profile_img = filename


	db.session.add(user)
	db.session.commit()
	return jsonify({'msg':'success'}), 201
	
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
	
	if user is None and userid != current_app.config['ADMIN_ID']:
		return jsonify({'error':'당신은 회원이 아니십니다.'}), 401			# 클라이언트 인증 실패, 로그인 실패 오류 코드
	if userid == current_app.config['ADMIN_ID']:		# 관리자 아이디 권한 부여
		if password == current_app.config['ADMIN_PW']:
			return jsonify(
				result = "success",
				access_token = create_access_token(
					identity = userid,
					expires_delta = False
				)
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
		return jsonify(result = "incorrect Password"), 403		# 패스워드 잘못 입력 오류 코드


# 로그인하지 않은 유저가 들어올때 처리를 다르게 해준다
# 유저정보 반환
@api.route('/user_info', methods=['GET'])
@jwt_required		# 데코레이터로 로그인 사용자만 화면에 접근할 수 있게 하는 구문,이 구문이 있는 페이지에 들어가려면  Authorization에 토큰을 보내주어야한다.
def user_info():
	check_user = get_jwt_identity()		# 토큰에서 identity꺼내서 userid를 넣는다.
	if check_user == 'GM':
		return jsonify({
			'nickname':'GM'
			# 'profile_img':''
			}),201
	access_user = User.query.filter(User.userid == check_user).first()# 꺼낸 토큰이 유효한 토큰인지 확인
	if access_user is None:		# 제대로 된 토큰인지 확인
		return jsonify({'error':'해당 유저에 대한 '})
	else:
		return jsonify(access_user.serialize)# 모든 사용자정보 반환

	# ------------------------------신경 안써도댐------------------------------
	#  res_users = {}
	#  for user in users:# 반복문을 돌면서 직렬화된 변수를 넣어서 새로운 리스트를 만든다.
	#      res_users.append(user.serialize)
	#  return jsonify(res_users)
	# ------------------------------------------------------------------------

# 해당 유저 정보 전부 반환
@api.route('/users_all_info')
def users_all_info():
	users = User.query.all()
	return jsonify([user.serialize for user in users])# 모든 사용자정보 반환
	# res_users = {}
	# for user in users:# 반복문을 돌면서 직렬화된 변수를 넣어서 새로운 리스트를 만든다.
	#     res_users.append(user.serialize)
	# return jsonify(res_users)

# 아이디 삭제, 수정, id(primary key)값에 따른 정보확인
@api.route('/users/<id>', methods=['GET','PUT','DELETE'])
@jwt_required
def user_detail(id):
	# 토큰을 가지고 들어오면 해당 토큰의 userid가 접근하려는 정보의 userid값과 같은지를 확인
	check_user_token = get_jwt_identity()
	check_user = User.query.filter(User.id == id).first()
	if check_user_token != check_user.userid: # 들어온 토큰의 userid와 확인하려는 user의 id값이 다르면, 정보 확인 거절 -> 즉 다른 사용자가 다른 사용자의 userid를 확인하려는 경우
		return jsonify({'error':'Not your information'}), 400		# 같지 않은 경우 접근금지

	if request.method == 'GET':# 아이디 정보 확인
		user = User.query.filter(User.id == id).first()
		return jsonify(user.serialize), 200

	elif request.method == 'DELETE':# 삭제
		db.session.query(User).filter(User.id == id).delete()
		db.session.commit()
		return jsonify({'status':'delete_success'}), 204		# 204s는 상태 콜
		
	# 밑에 코드의 method는 'PUT'으로 아이디 수정

	username = request.form.get('username')
	nickname = request.form.get('nickname')
	birth = request.form.get('birth')		# 생년월일를 보낼 때는 YYYY-MM-XX형식으로
	email = request.form.get('email')
	password = request.form.get('password')
	try:		# 프로필 사진 받아도 되고 안받아도 됨
		profile_img = request.files['profile_img']
	except:
		profile_img = None

	updated_data = {}
	if username:		# 바꿀 username을 입력받으면
		updated_data['username'] = username
	if password:		# 바꿀 password를 입력받으면
		if pwd_check(password):		# 비밀번호 체크 코드
			result = pwd_check(password)
			return jsonify(result),result['error_code']
		updated_data['password'] = password
	if nickname:		# 바꿀 nickname을 입력받으면
		if User.query.filter(User.nickname == nickname).first():		# nickname 중복 검사
			return jsonify({'error':'이미 있는 닉네임입니다.'}), 409
		updated_data['nickname'] = nickname
	if email:		# 바꿀 email를 입력받으면
		if email_check(email):
			result = email_check(email)
			return jsonify(result),result['error_code']
		updated_data['email'] = email
	if birth:		# 바꿀 생년월일을 입력받으면
		try:
			dt = datetime.strptime(birth, "%Y-%m-%d")		# json형식으로 받은 data를 날짜 형식으로 변환
		except ValueError:
			return jsonify({'error':'잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요'}), 403
		updated_data['birth'] = dt

	# 프로필 사진이 존재하고 그 사진이 제대로 된 파일인지 확인
	if profile_img and allowed_file(profile_img):		# 프로필 이미지 확장자 확인
		folder_url = "static/img/profile_img"
		if check_user.profile_img != "user-image.png":		# 기존에 프로필 사진이 있을 때 해당 프로필 사진 삭제
			delete_target = folder_url + check_user.profile_img
			if os.path.isfile(delete_target):		# 해당 프로필 사진 삭제
				os.remove(delete_target)
		suffix = datetime.now().strftime("%y%m%d_%H%M%S")				
		filename = "_".join([profile_img.filename.rsplit('.', 1)[0], suffix])			# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
		extension = profile_img.filename.rsplit('.', 1)[1]
		filename = secure_filename(f"{filename}.{extension}")

		updated_data['profile_img'] = filename
		profile_img.save(os.path.join(UPLOAD_FOLDER,filename))

	User.query.filter(User.id == id).update(updated_data)# PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
	user = User.query.filter(User.id == id).first()
	return jsonify(user.serialize), 201


# 자동로그인을 할지 안할지를 반환
# 인자로 자동로그인을 할 떄는 1 아닐 때는 0을 반환해주어야 한다.
@api.route('/auto_login/<int:auto_login>') # methods가 아무것도 안적혀 있을 때는 GET으로 설정되어있음
@jwt_required
def auto_login():
	check_user= get_jwt_identity()
	access_user = User.query.filter(User.userid == check_user).first()# 꺼낸 토큰이 유효한 토큰인지 확인
	if access_user is None:
		return {'error':'잘못된 토큰입니다.'}, 403
	# 1아니면 0 값을 보내야하는데 다른 값을 보내는 경우 오류
	if auto_login != 1 or auto_login != 0:
		return {'error':'Wrong Value of auto_login'}, 403

	access_user.auto_login = auto_login
	result = access_user.auto_login
	db.session.commit()
	return jsonify(
		result = result
	)


# id로 프로필, 닉네임, 이메일(특정정보) 불러오는 api
@api.route('/user_specific_info/<id>')
def users_specific_info(id):
	user = User.query.filter(User.id == id).first()
	if user is None:
		print("없는 아이디입니다.")
		return {'error:''없는 아이디'}, 403
	user_specific_info = {
		'nickname' : user.nickname,
		'profile_img' : user.profile_img,
		'email' : user.email
	}
	return jsonify(user_specific_info)
