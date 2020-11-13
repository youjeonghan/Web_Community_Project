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
from controllers.user_controller import allowed_file


