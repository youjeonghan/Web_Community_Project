from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db=SQLAlchemy()

class Ruser(db.Model):
    __tablename = 'rcuser'
    id=db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(8))
    userid = db.Column(db.String(32))
    password = db.Column(db.String(64))
    profile_image = db.Column(db.String(100), default='default.png')
    

    def __init__(self,username,userid,password):
        self.username = username
        self.userid = userid
        self.set_password(password)
    
    def __repr__(self):
        return f"<User('{self.userid}', '{self.username}', '{self.password}')>"
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
 
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    # 직렬화
    @property#실제로 함수로 만들지만 접근할 때는 변수처럼 사용할 수 있게 한다.
    def serialize(self):#serialize라는 변수
        return{
            'id': self.id,
            'password': self.password,
            'userid': self.userid,
            'username': self.username
        }