import os
SQLALCHEMY_DATABASE_URI = 'mysql://root:root@localhost:3306/flask_teamproject'
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = False
JSON_AS_ASCII = False
SECRET_KEY = "123456789"

UPLOAD_FOLDER = 'C:/Users/win7/Documents/GitHub/WEB-Project1/TeamProject/static/img'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}