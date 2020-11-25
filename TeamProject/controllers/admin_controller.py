import os
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from models import User, db, Category, Board, Post, Comment, Blacklist, Post_img
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from api.decoration import admin_required
from werkzeug.utils import secure_filename
from sqlalchemy import and_, or_
from config import *
from controllers.temp_controller import *

#  werkzeuh dic 객체에서 dic으로
def return_dictionary_input_board_data(request):
    return {
        "board_name": request.form.get("board_name"),
        "description": request.form.get("description"),
        "category_id": request.form.get("category_id"),
        "board_image": request.files.get("board_image")
    }


def make_board_object(data, category):
    # db 6개 회원정보 저장
    board = Board()
    board.board_name = data.get("board_name")
    board.description = data.get("description")
    board.category_id = data.get("category_id")
    board.category = category
    board.board_image = manufacture_img(data.get("board_image"),UPLOAD_BOARD_FOLDER)

    return board

