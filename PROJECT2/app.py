from flask import Flask, render_template, redirect,request
from api_v1 import api as api_v1
from models import db, Ruser
from flask_jwt import JWT
from flask_jwt_extended import *
import os
from werkzeug.security import *


app = Flask(__name__)
app.register_blueprint(api_v1, url_prefix='/api/v1')#blueprint라는 건 작성한 컨트롤러 코드들을 분리해서 작성할 수 있게 하는 기능
app.config.update(
		DEBUG = True,
		JWT_SECRET_KEY = "1232132152142",
	)
jwt = JWTManager(app)

@app.route('/login', methods = ['GET','POST'])
def login():
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('register.html')

@app.route('/')
def hello():
    return render_template('home.html')

basedir = os.path.abspath(os.path.dirname(__file__))#현재 있는 파일의 절대 경로가 나오게 된다.
dbfile = os.path.join(basedir, 'db.sqlite')#현재 디렉토리 안에 db.sqlite라는 데이터베이스를 만든다.

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + dbfile # 사용하는 데이터베이스에 따라 ''가 달라진다. 
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True # teardown(사용자 요청의 끝)일때 commit(데이터베이스에 반영하는 역할)을 한다는 듯으로 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '13123123'


db.init_app(app)# 초기화하는 함수
db.app = app
db.create_all()

# #인증한 뒤 user반환
# def authenticate(username,password):
#     user = Ruser.query.filter(Ruser.userid == username).first()
#     if check_password_hash(user.password,password):
#         return user

# #인증을 하고나서 인증한 사용자가 토큰을 전달했을 때 그 정보를 다시 유저정보로 변환해주는 함수가 필요하다.
# def identity(payload):
#     userid = payload['identity']# 함수에서 전달했었던 값의 id값이 identity에 저장되어 있다.
#     return Ruser.query.filter(Ruser.id == userid).first()
    

# jwt = JWT(app,authenticate, identity)#app에다가 authenticate라는 인증하는 함수를 넣어놨다.


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)