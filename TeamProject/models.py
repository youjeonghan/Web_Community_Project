from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 유저정보
class User(db.Model):
	__tablename__ = 'user'
	id = db.Column(db.Integer, primary_key = True)

	username = db.Column(db.String(80), nullable=False)#실명
	birth = db.Column(db.DateTime(), nullable=False)#생년월일
	userid = db.Column(db.String(32), nullable=False)#아이디
	password = db.Column(db.String(256), nullable=False)#비번
	email = db.Column(db.String(32))#이메일
	nickname = db.Column(db.String(10), nullable=False)#닉네임
	auto_login = db.Column(db.Integer) #자동 로그인 속성
	black_num = db.Column(db.Integer, default = 0)
	profile_img = db.Column(db.String(100))

	# 직렬화
	@property 		# 실제로 함수로 만들지만 접근할 때는 변수처럼 사용할 수 있게 한다.
	def serialize(self):		# serialize라는 변수
		return{
			'id': self.id,
			'password': self.password,
			'userid': self.userid,
			'username': self.username,
			'nickname': self.nickname,
			'email': self.email,
			'profile_img': self.profile_img
		}

# ---------------------------------------------------------------------------
# db.String은 제목(subject)처럼 글자수의 길이가 제한된 텍스트에 사용 
# db.Texts는 내용(content)처럼 글자수를 제한할 수 없는 텍스트에 사용
# ---------------------------------------------------------------------------

# 블랙리스트
class Blacklist(db.Model):
	__tablename__ = 'blacklist'
	id = db.Column(db.Integer, primary_key = True)
	userid = db.Column(db.Integer,db.ForeignKey('user.id', ondelete = 'CASCADE'))
	punishment_date = db.Column(db.Integer, default =0)
	punishment_end = db.Column(db.DateTime())		# 정지가 풀리는 날

	user = db.relationship('User', backref=db.backref('Black_set_user', cascade="all,delete"))
	
	@property	
	def serialize(self):
		return {
			'id': self.id,
			'userid': self.userid,
			'punishment_num' : self.punishment_date,
			'punishment_end' : self.punishment_end
		}

# 대분류 모델
class Category(db.Model):
	__tablename__ = 'category'
	id = db.Column(db.Integer, primary_key=True)
	category_name = db.Column(db.String(100), nullable=False)
	board_num = db.Column(db.Integer, default=0)

	@property
	def serialize(self):
		return {
			'id': self.id,
			'category_name': self.category_name,
			'board_num': self.board_num
		}
		
# 게시판 모델
# 게시판 삭제시 연관된 게시글 및 댓글 같이 삭제됨
class Board(db.Model):
	__tablename__ = 'board'
	id = db.Column(db.Integer, primary_key=True)
	board_name = db.Column(db.String(100), nullable=False)
	description = db.Column(db.Text())
	category_id = db.Column(db.Integer, db.ForeignKey('category.id', ondelete='CASCADE'))
	post_num = db.Column(db.Integer, default=0)
	
	category = db.relationship('Category', backref=db.backref('category_set', cascade="all,delete"))

	@property
	def serialize(self):
		return {
			'id': self.id,
			'board_name': self.board_name,
			'description': self.description,
			'category_id': self.category_id,
			'post_num': self.post_num
		}

# ----------------------------------------------------------------------------------------------------------------
# 유저와 게시글을 한 쌍으로 갖는 post_like 테이블 객체를 생성하였다. 
# 유저와 게시글이 모두 프라이머리키이므로 ManyToMany 관계가 성립되는 테이블
# 중복을 막을수 있는 이유는 둘다 프라이머리키이기 때문에 (1,1) (1,1) 이들어오면 데이터베이스 차원에서 오류가 난다.
# secondary 속성은 like가 ManyToMany 관계이며 post_like 테이블을 참조한다는 사실을 알려주는 역할
# ----------------------------------------------------------------------------------------------------------------
post_like = db.Table(
	'post_like',
	db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
	db.Column('post_id', db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'), primary_key=True)
)
post_report = db.Table(
	'post_report',
	db.Column('user_id',db.Integer, db.ForeignKey('user.id',ondelete = 'CASCADE'), primary_key = True),
	db.Column('post_id',db.Integer, db.ForeignKey('post.id',ondelete = 'CASCADE'), primary_key = True)
)
# 게시글 모델
class Post(db.Model):				
	__tablename__ = 'post' 
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
	subject = db.Column(db.String(100), nullable=False)
	content = db.Column(db.Text(), nullable=False)
	create_date = db.Column(db.DateTime(), nullable=False)
	# (db.타입, db.ForeignKey('테이블이름.id', 옵션)# ondelete=CASCADE 댓글과 연결된 글이 삭제될 경우 댓글도 함께 삭제된다는 의미
	board_id = db.Column(db.Integer, db.ForeignKey('board.id', ondelete='CASCADE'))
	comment_num = db.Column(db.Integer, default=0)
	like_num = db.Column(db.Integer, default=0)
	img_num = db.Column(db.Integer, default=0)
	report_num = db.Column(db.Integer, default = 0)		# 게시글 신고 횟수

	user = db.relationship('User', backref = db.backref('user_set_p', cascade = "all,delete"))
	board = db.relationship('Board', backref=db.backref('post_set', cascade="all,delete"))
	like = db.relationship('User', secondary=post_like, backref=db.backref('post_like_set'))
	report = db.relationship('User', secondary = post_report, backref = db.backref('post_report_set'))

	@property
	def serialize(self):
		return {
			'id': self.id,
			"userid": self.userid,
			'subject': self.subject,
			'content': self.content,
			'create_date': self.create_date,
			'board_id': self.board_id,
			'comment_num': self.comment_num,
			'like_num': self.like_num,
			'img_num':self.img_num,
			'report_num': self.report_num
		}
		
# (게시글에 저장된) 이미지 모델
class Post_img(db.Model):
	__tablename__ = 'post_img'
	id = db.Column(db.Integer, primary_key=True)
	filename = db.Column(db.String(100), nullable=False)
	post_id = db.Column(db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'))

	post = db.relationship('Post', backref=db.backref('img_set', cascade="all,delete"))

	@property
	def serialize(self):
		return {
			'id': self.id,
			'filename': self.filename,
			'post_id': self.post_id
		}

# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# post_id 는 Post모델의 id값을 의미하며 이를 나타내기 위해 db.ForeignKey를 사용해야 한다. (db.ForeignKey는 다른 모델과의 연결을 의미)
# post 속성은 comment모델에서 게시글 모델을 참조하기 위해서 추가된 속성
# 즉, comment.post.subject 처럼 댓글 모델 객체(comment)를 통해서 게시글모델 객체(post)를 참조할 수 있게 된다 (이렇게 쓰기위해서 위해서는 db.relationship 을 이용하여 속성을 추가해 주어야 한다)
# db.relationship에서 사용된 backref 속성은 comment.post.subject 와는 반대로 게시글에서 댓글모델을 참조하기 위해서 사용되는 속성이다. 
# (어떤 게시글에 해당되는 객체가 a_post 라면 이 게시글에 작성된 댓글들을 참조하기 위해서 a_post.comment_set 과 같이 사용)
# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
comment_like = db.Table(
	'comment_like',
	db.Column('user_id', db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
	db.Column('comment_id', db.Integer, db.ForeignKey('comment.id', ondelete='CASCADE'), primary_key=True)
)
comment_report = db.Table(
	'comment_report',
	db.Column('user_id', db.Integer, db.ForeignKey('user.id',ondelete = 'CASCADE'), primary_key = True),
	db.Column('comment_id', db.Integer, db.ForeignKey('comment.id',ondelete = 'CASCADE'), primary_key = True)
)
# 댓글 모델
class Comment(db.Model):
	__tablename__ = 'comment'
	id = db.Column(db.Integer, primary_key=True)
	userid = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
	post_id = db.Column(db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'))
	content = db.Column(db.Text(), nullable=False)
	create_date = db.Column(db.DateTime(), nullable=False)
	like_num = db.Column(db.Integer, default=0)
	report_num = db.Column(db.Integer,default = 0)		# 댓글 신고 횟수

	user = db.relationship('User', backref = db.backref('user_set_c', cascade = "all,delete"))
	post = db.relationship('Post', backref=db.backref('comment_set', cascade="all,delete"))
	like = db.relationship('User', secondary=comment_like, backref=db.backref('comment_like_set'))
	report = db.relationship('User',secondary = comment_report, backref = db.backref('comment_report_set'))

	@property
	def serialize(self):
		return {                                # post (relationship)는 직렬화 하지않는다
			'id': self.id,
			'userid': self.userid,
			'post_id': self.post_id,
			'content': self.content,
			'create_date': self.create_date,
			'like_num': self.like_num,
			'report_num': self.report_num
		}

# class Reportlist(db.Model):
# 	__tablename__ = 'reportlist'
# 	id = db.Column(db.Integer, prinmary_key = True)
# 	post_id = db.Column(db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'))
# 	comment_id = db.Column(db.Integer, db.ForeignKey('comment.id', ondelete='CASCADE'))

# 	post = db.relationship('Post', backref=db.backref('report_post_set', cascade="all,delete"))
# 	comment = db.relationship('Comment', backref = db.backref('report_comment_set', cascade = "all,delete"))
# 	@property
# 	def serialize(self):
# 		return {                                # post (relationship)는 직렬화 하지않는다
# 			'id': self.id,
# 			'post_id': self.post_id,
# 			'comment_id': self.comment_id
# 		}