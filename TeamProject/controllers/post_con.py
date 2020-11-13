from datetime import datetime
from flask import request
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models import Post, Comment, Board, User, Post_img, Category, Blacklist
from models import db


def dic_update_boardname(postlist):
    returnlist = []
    for i, post in enumerate(postlist):
        returnlist.append(post.serialize)
        returnlist[i].update(board_name=post.board.board_name)
    return returnlist


def check_update_blacklist(userid):
    user = User.query.filter(User.id == userid).first()
    if user.Black_set_user:
        black = Blacklist.query.filter(Blacklist.userid == userid).first()
        if black.punishment_end > datetime.now():
            return jsonify({"error": "현재 당신의 아이디는 게시글을 쓸 수 없습니다."}), 403
        else:
            db.session.delete(black)
            db.session.commit()


def check_users():
    check_user = get_jwt_identity()
    if check_user == "GM":
        return {"error": "GM은 이용할수없습니다."}, 403


def post_insert():
    data = request.get_json()
    userid = data.get("userid")
    subject = data.get("subject")
    content = data.get("content")
    create_date = datetime.now()
    board_name = data.get("board_name")

    check_update_blacklist(userid)

    if not subject:
        return jsonify({"error": "제목이 없습니다."}), 400

    if not content:
        return jsonify({"error": "내용이 없습니다."}), 400

    board = Board.query.filter(Board.board_name == board_name).first()
    board.post_num += 1  # 해당하는 게시판의 게시글 카운트 + 1
    post = Post()
    post.userid = userid
    post.subject = subject
    post.content = content
    post.create_date = create_date
    post.board_id = board.id

    post.user = User.query.filter(User.id == userid).first()
    post.board = board

    db.session.add(post)
    db.session.commit()
    return jsonify({"post_id": post.id}), 201
