import os


SQLALCHEMY_DATABASE_URI = "mysql://root:1234@localhost:3306/flask_teamproject"
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = False
JSON_AS_ASCII = False
SECRET_KEY = "123456789"
JWT_SECRET_KEY = "1232132152142"
ADMIN_ID = "GM"
ADMIN_PW = "1234"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
UPLOAD_FOLDER = "static/img/post_img"
UPLOAD_BOARD_FOLDER = "static/img/board_img"
UPLOAD_PROFILE_FOLDER = "static/img/profile_img"