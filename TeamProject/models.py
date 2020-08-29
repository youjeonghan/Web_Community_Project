from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ---------------------------------------------------------------------------
# db.String은 제목(subject)처럼 글자수의 길이가 제한된 텍스트에 사용 
# db.Texts는 내용(content)처럼 글자수를 제한할 수 없는 텍스트에 사용
# ---------------------------------------------------------------------------
# 게시글 모델
class Board(db.Model):				
    __tablename__ = 'board'
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'content': self.content,
            'create_date': self.create_date
        }


# ------------------------------------------------------------------------------------------------------------------------------------------------------------
# board_id 는 Board모델의 id값을 의미하며 이를 나타내기 위해 db.ForeignKey를 사용해야 한다. (db.ForeignKey는 다른 모델과의 연결을 의미)
# board 속성은 comment모델에서 게시글 모델을 참조하기 위해서 추가된 속성
# 즉, comment.board.subject 처럼 댓글 모델 객체(comment)를 통해서 게시글모델 객체(board)를 참조할 수 있게 된다 (이렇게 쓰기위해서 위해서는 db.relationship 을 이용하여 속성을 추가해 주어야 한다)
# db.relationship에서 사용된 backref 속성은 comment.board.subject 와는 반대로 질문에서 답변모델을 참조하기 위해서 사용되는 속성이다. 
# (어떤 게시글에 해당되는 객체가 a_board 라면 이 질문에 작성된 답변들을 참조하기 위해서 a_board.comment_set 과 같이 사용)
# ------------------------------------------------------------------------------------------------------------------------------------------------------------

# 댓글 모델
class Comment(db.Model):            
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('board.id', ondelete='CASCADE'), nullable=False)      # (db.타입, db.ForeignKey('테이블이름.id', 옵션)# ondelete=CASCADE 댓글과 연결된 글이 삭제될 경우 댓글도 함께 삭제된다는 의미
    board = db.relationship('Board', backref=db.backref('comment_set'))
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)       # ondelete=CASCADE 댓글과 연결된 유저가 삭제될 경우 댓글도 함께 삭제된다는 의미
    
    @property
    def serialize(self):
        return {                                # board는 직렬화 하지않는다
            'id': self.id,
            'board_id': self.board_id,
            'content': self.content,
            'create_date': self.create_date
        }