from flask import Flask, jsonify, request
from models import db
from models import Post,User
from flask import redirect
from flask import render_template
from api import api
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import config

app = Flask(__name__)
app.config.from_object(config)
app.register_blueprint(api, url_prefix='/api')
# jw인증을 위한 선언문들---------------------
app.config.update(
	DEBUG = True,
	JWT_SECRET_KEY = "1232132152142",
)
	
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

@app.route('/group')
def group():
	return render_template('group.html')


if __name__ == "__main__":
	app.run(host='127.0.0.1', port=5000, debug=True)