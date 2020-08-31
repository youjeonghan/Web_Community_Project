from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import *

db=SQLAlchemy()

class Ruser(db.Model):
    __tablename = 'ruser'
    id=db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80))#실명
    birth = db.Column(db.Date)#생년월일
    userid = db.Column(db.String(32))#아이디
    password = db.Column(db.String(64))#비번
    email = db.Column(db.String(32))#이메일
    nickname = db.Column(db.String(10))#닉네임
 
    # 직렬화
    @property#실제로 함수로 만들지만 접근할 때는 변수처럼 사용할 수 있게 한다.
    def serialize(self):#serialize라는 변수
        return{
            'id': self.id,
            'password': self.password,
            'userid': self.userid,
            'username': self.username
        }