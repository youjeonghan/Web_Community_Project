from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Board(db.Model):				# 게시글 모델 : id,제목,내용,생성시간
    __tablename__ = 'noticeboard'
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    content2 = db.Column(db.Text(), nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'content': self.content,
            'create_date': self.create_date
        }


# ------------------------------------------------------------------------------------------------------------
# board 속성은 comment모델에서 게시글 모델을 참조하기 위해서 추가된 속성
# 즉, comment.board.subject 처럼 댓글 모델 객체(comment)를 통해서 게시글모델 객체(board)를 참조할 수 있게 된다
# 이렇게 쓰기위해서 위해서는 db.relationship 을 이용하여 속성을 추가해 주어야 한다
# -------------------------------------------------------------------------------------------------------------
class Comment(db.Model):            # 댓글 모델
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)       # ondelete=CASCADE 댓글과 연결된 유저가 삭제될 경우 댓글도 함께 삭제된다는 의미
    # board = db.relationship('Board', backref=db.backref('comment_set'))
    # board_id = db.Column(db.Integer, db.ForeignKey('board.id', ondelete='CASCADE'), nullable=False)      # ondelete=CASCADE 댓글과 연결된 글이 삭제될 경우 댓글도 함께 삭제된다는 의미
    

    @property
    def serialize(self):
        return {
            # pass
        }