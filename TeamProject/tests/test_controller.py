import random
from datetime import datetime
from werkzeug.security import generate_password_hash
from models import db, Post, User, Category, Board, Comment, Blacklist


def user_create(userid_suffix, username_suffix, nickname):
    user = User()

    user.userid = f"user{userid_suffix}"
    user.username = f"유저{username_suffix}"
    user.birth = datetime.now()

    user.nickname = nickname
    user.email = f"user{userid_suffix}@naver.com"
    user.password = generate_password_hash("1234")
    user.profile_img = "static/img/profile_img/test_img/test_user.png"

    db.session.add(user)
    db.session.commit()


def category_create(category_name):
    category = Category()

    category.category_name = category_name
    category.board_num = 0

    db.session.add(category)
    db.session.commit()


def board_create(board_name, description, category_id, board_image):
    board = Board()

    board.board_name = board_name
    board.description = description
    board.category_id = category_id
    board.post_num = 0
    board.board_image = board_image

    board.category = Category.query.filter(Category.id == category_id).first()
    board.category.board_num += 1

    db.session.add(board)
    db.session.commit()


def post_create(order, random_userid, random_board_id):
    post = Post()
    post.userid = random_userid
    post.subject = f"게시글 제목{order}"
    post.content = f"게시글 내용{order}"
    post.create_date = datetime.now()
    post.board_id = random_board_id
    post.comment_num = 0
    post.like_num = 0

    post.user = User.query.filter(User.id == random_userid).first()
    post.board = Board.query.filter(Board.id == random_board_id).first()
    post.board.post_num += 1

    db.session.add(post)
    db.session.commit()


def comment_create(target_post_id):
    comment = Comment()
    comment.userid = random.randrange(1, 20)
    comment.post_id = target_post_id + 1
    comment.content = f"유저{comment.userid}이쓴 내용이다!!!"
    comment.create_date = datetime.now()
    comment.like_num = 0

    comment.user = User.query.filter(User.id == comment.userid).first()
    comment.post = Post.query.filter(Post.id == target_post_id + 1).first()
    comment.post.comment_num += 1

    db.session.add(comment)
    db.session.commit()