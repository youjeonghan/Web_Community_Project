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
from controllers.user_controller import allowed_file,manufacture_img

#  werkzeuh dic 객체에서 dic으로
def stringfy_input_board_data(input):
    return {
	    "board_name": input.get("board_name"),
	    "description": input.get("description"),
	    "category_id": input.get("category_id")
    }


def store_board_db(data):
    # db 6개 회원정보 저장
    board = Board()
    board.board_name = data.get("board_name")
    board.description = data.get("description")
    board.category_id = data.get("category_id")
    board.category = data.get("category")
    board.board_image = manufacture_img(data.get("board_image"))

    return board
