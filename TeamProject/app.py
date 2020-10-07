from flask import Flask, jsonify, request
from models import db
from flask import redirect
from flask import render_template
from api import api
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import config
from datetime import datetime, timedelta
# 테스트db함수를 위해추가
import random
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from models import Post, User, Category, Board, Comment, Blacklist

app = Flask(__name__)
app.config.from_object(config)
app.register_blueprint(api, url_prefix='/api')
# jw인증을 위한 선언문들---------------------


jwt = JWTManager(app)
# -------------------------------------------
migrate = Migrate()
# ------------------------------------------------------------------------------------------------------------------------------------------------------------
# flask db init 명령은 최초 한번만 수행하면 된다. 앞으로 모델을 추가하고 변경할때는 flask db migrate와 flask db upgrade 명령 두개만 반복적으로 사용하면 된다.
# flask db migrate - 모델을 신규로 생성하거나 변경할때 사용
# flask db upgrade - 변경된 내용을 적용할때 사용
# ------------------------------------------------------------------------------------------------------------------------------------------------------------
db.init_app(app)
migrate.init_app(app, db)

db.app = app
db.create_all()		# db를 초기화 해줌

@app.route('/')
def main():
	return render_template('main.html')

@app.route('/post')
def post():
	return render_template('post.html')

@app.route('/signup')
def signup():
	return render_template('signup.html')

@app.route('/login')
def login():
	return render_template('login.html')

@app.route('/manager')
def manager():
	return render_template('manager.html')

@app.route('/mypage')
def mypage():
	return render_template('mypage.html')

@app.route('/test')
def test():
	return render_template('test.html')


def User_insert():
	print("테스트 유저 입력 시작...")
	nickname_list = ["킹카아무무", "잠만보", "19늑대", "후크선장", "롤창최고",
					"코미디언","바람요정","분당칼국수", "음색깡패", "그냥깡패",
					"영정먹이지마","난쟁이","응답하지마1996","루카쿠","정병터짐",
					"세주아님","세수하고옴","말대답하지마12","심신건강","존나화남"]
	for i in range(0,20):
		user = User()
		ran = random.randrange(1,9999)
		user.userid = f"coding_egg{ran}"
		user.username = f"유저{i}"
		user.birth = datetime.now()

		user.nickname = nickname_list[i]
		user.email = f"coding_egg{ran}@naver.com"
		user.password = generate_password_hash("1234")	# 비밀번호 해시

		db.session.add(user)
		db.session.commit()
	print("테스트 유저 입력 성공")

def Category_insert():
	print("테스트 카테고리 입력 시작...")
	category_list = ["게임","스포츠","연예인","방송"]
	for i in range(0,20):
		category = Category()
		
		if i <= 3:
			category.category_name = category_list[i]	
		else:
			category.category_name = f"카테고리{i}"

		category.board_num = 0

		db.session.add(category)
		db.session.commit()
	print("테스트 카테고리 입력 성공")

def Board_insert():
	print("테스트 게시판 입력 시작...")
	for i in range(0,20):
		ran = random.randrange(1,20)

		board = Board()


		board.board_name = f"게시판 이름{i}"
		board.description = f"게시판 설명{i}"
		board.category_id = ran
		board.post_num = 0

		board.category = Category.query.filter(Category.id == ran).first()
		board.category.board_num += 1

		db.session.add(board)
		db.session.commit()
	print("테스트 게시판 입력 성공")

def Post_insert():
	print("테스트 게시글 입력 시작...")
	for i in range(0,200):
		ran = random.randrange(1,20)
		ran2 = random.randrange(1,20)

		post = Post()
		post.userid = ran
		post.subject = f"게시글 제목{i}"
		post.content = f"게시글 내용{i}"
		post.create_date = datetime.now()
		post.board_id = ran2
		post.comment_num = 0
		post.like_num = 0

		post.user = User.query.filter(User.id == ran).first()
		post.board = Board.query.filter(Board.id == ran2).first()
		post.board.post_num += 1

		db.session.add(post)
		db.session.commit()
	print("테스트 게시글 입력 성공")

def Comment_insert():
	print("테스트 댓글 입력 시작...")
	for i in range(0,20):				# 몇번의 게시글에
		ran = random.randrange(0,7)		# 몇번의 댓글을 쓸건지

		for j in range(0, ran):
			comment = Comment()
			comment.userid = random.randrange(1,20)			# 몇번의 유저가
			comment.post_id = i + 1
			comment.content = f"유저{comment.userid}이쓴 내용이다~"
			comment.create_date = datetime.now()
			comment.like_num = 0

			comment.user = User.query.filter(User.id == comment.userid).first()
			comment.post = Post.query.filter(Post.id == i + 1).first()
			comment.post.comment_num += 1

			db.session.add(comment)
			db.session.commit()
	print("테스트 댓글 입력 성공")

# def Post_report_insert():
# 	print("게시글 신고 입력 시작..")
# 	for i in range(1,11):
# 		ran = random.randrange(1,10)
# 		ran2 = random.randrange(1,10)
# 		user = User.query.filter(User.id == ran2).first()
# 		post = Post.query.filter(Post.id == i).first()
# 		post.report.append(user)
# 		post.report_num = ran
# 		db.session.commit()
# 	print("테스트 신고 입력 성공")

# def Comment_report_insert():
# 	print("댓글 신고 입력 시작..")
# 	for i in range(1,11):
# 		ran = random.randrange(1,10)
# 		ran2 = random.randrange(1,10)
# 		user = User.query.filter(User.id == ran2).first()
# 		comment = Comment.query.filter(Comment.id == i).first()
# 		comment.report.append(user)
# 		comment.report_num = ran
# 		db.session.commit()
# 	print("댓글 신고 입력 성공")

def Blacklist_insert():
	print("블랙리스트 입력 시작..")
	for i in range(1,8):
		a = [-10,-7,3,5,30,40,50]
		punishment_date = random.choice(a)

		if punishment_date > 30:		# 영구정지(30일이 넘는 숫자를 입력받으면 영구정지로 처리)
			punishment_end = datetime(4000,1,1)
		else :
			punishment_start = datetime.now()
			punishment_end = punishment_start + timedelta(days = int(punishment_date))

		user = User.query.filter(User.id == i).first()
		Black = Blacklist()
		Black.userid = user.id
		Black.punishment_date = punishment_date
		Black.punishment_end = punishment_end
	
		db.session.add(Black)
		db.session.commit()

	print("테스트 블랙리스트 입력 성공")


def test_db_insert():
	User_insert()
	Category_insert()
	Board_insert()
	Post_insert()
	Comment_insert()
	# Post_report_insert()
	# Comment_report_insert()
	Blacklist_insert()

if __name__ == "__main__":
	# ------테스트db 넣기 (한번만 넣고 주석 바꾸기)--------
	test_db_insert()
	app.run(host='127.0.0.1', port=5000, debug=False)
	# -----------------------------------------------------
	# -----------------테스트db 안넣기---------------------
	# app.run(host='127.0.0.1', port=5000, debug=True)
	# -----------------------------------------------------

	# user1 = Admin('a', 'a','a')
	# db.session.add(user1)
	# db.session.commit()