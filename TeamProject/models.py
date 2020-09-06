from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 유저정보
class User(db.Model):
    __tablename__ = 'user'
    id=db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80), nullable=False)#실명
    birth = db.Column(db.DateTime(), nullable=False)#생년월일
    userid = db.Column(db.String(32), nullable=False)#아이디
    password = db.Column(db.String(256), nullable=False)#비번
    email = db.Column(db.String(32))#이메일
    nickname = db.Column(db.String(10), nullable=False)#닉네임
 
    # 직렬화
    @property# 실제로 함수로 만들지만 접근할 때는 변수처럼 사용할 수 있게 한다.
    def serialize(self):#serialize라는 변수
        return{
            'id': self.id,
            'password': self.password,
            'userid': self.userid,
            'username': self.username,
            'nickname': self.nickname,
            'email': self.email
        }

# ---------------------------------------------------------------------------
# db.String은 제목(subject)처럼 글자수의 길이가 제한된 텍스트에 사용 
# db.Texts는 내용(content)처럼 글자수를 제한할 수 없는 텍스트에 사용
# ---------------------------------------------------------------------------

# 게시판 모델
# 게시판 삭제시 연관된 게시글 및 댓글 같이 삭제됨

class Board(db.Model):
    __tablename__ = 'board'
    id = db.Column(db.Integer, primary_key=True)
    board_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text())

    @property
    def serialize(self):
        return {
            'id': self.id,
            'board_name': self.board_name,
            'description': self.description
        }


# 게시글 모델
class Post(db.Model):				
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    user = db.relationship('User', backref = db.backref('user_set', cascade = "all,delete"))
    subject = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    # (db.타입, db.ForeignKey('테이블이름.id', 옵션)# ondelete=CASCADE 댓글과 연결된 글이 삭제될 경우 댓글도 함께 삭제된다는 의미
    board_id = db.Column(db.Integer, db.ForeignKey('board.id', ondelete='CASCADE')) 
    board = db.relationship('Board', backref=db.backref('post_set', cascade="all,delete"))

    @property
    def serialize(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'content': self.content,
            'create_date': self.create_date
        }


# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# post_id 는 Post모델의 id값을 의미하며 이를 나타내기 위해 db.ForeignKey를 사용해야 한다. (db.ForeignKey는 다른 모델과의 연결을 의미)
# post 속성은 comment모델에서 게시글 모델을 참조하기 위해서 추가된 속성
# 즉, comment.post.subject 처럼 댓글 모델 객체(comment)를 통해서 게시글모델 객체(post)를 참조할 수 있게 된다 (이렇게 쓰기위해서 위해서는 db.relationship 을 이용하여 속성을 추가해 주어야 한다)
# db.relationship에서 사용된 backref 속성은 comment.post.subject 와는 반대로 게시글에서 댓글모델을 참조하기 위해서 사용되는 속성이다. 
# (어떤 게시글에 해당되는 객체가 a_post 라면 이 게시글에 작성된 댓글들을 참조하기 위해서 a_post.comment_set 과 같이 사용)
# --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# 댓글 모델
class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    user = db.relationship('User', backref = db.backref('user_set', cascade = "all,delete"))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id', ondelete='CASCADE'))
    post = db.relationship('Post', backref=db.backref('comment_set', cascade="all,delete"))
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    
    @property
    def serialize(self):
        return {                                # post (relationship)는 직렬화 하지않는다
            'id': self.id,
            'post_id': self.post_id,
            'content': self.content,
            'create_date': self.create_date
        }
