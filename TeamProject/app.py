from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask import redirect
from flask import render_template
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from models import db
from api import api
import config


app = Flask(__name__)
app.config.from_object(config)
app.register_blueprint(api, url_prefix="/api")
jwt = JWTManager(app)
migrate = Migrate()
db.init_app(app)
migrate.init_app(app, db)

db.app = app
db.create_all()


@app.route("/")
def main():
    return render_template("main.html")


@app.route("/post")
def post():
    return render_template("post.html")


@app.route("/signup")
def signup():
    return render_template("signup.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/manager")
def manager():
    return render_template("manager.html")


@app.route("/mypage")
def mypage():
    return render_template("mypage.html")


@app.route("/test")
def test():
    return render_template("test.html")


if __name__ == "__main__":
    # ------테스트db 넣기 (한번만 넣고 주석 바꾸기)--------
    # test_db_insert()
    # game_insert()
    # update_best()
    # update_bestpost()
    # app.run(host='127.0.0.1', port=5000, debug=False)
    # -----------------------------------------------------

    # -----------------테스트db 안넣기---------------------
    app.run(host="127.0.0.1", port=5000, debug=True)