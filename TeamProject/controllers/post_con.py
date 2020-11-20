import os
from datetime import datetime
from flask import request
from flask import jsonify
from flask import current_app
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


def post_delete(post_id):
    post = Post.query.filter(Post.id == post_id).first()

    board = Board.query.filter(
        Board.board_name == post.board.board_name
    ).first()  # 현재 삭제하려는 게시글의 게시판 객체
    board.post_num -= 1

    del_img_list = Post_img.query.filter(Post_img.post_id == post_id).all()
    for file in del_img_list:
        file_url = current_app.config["UPLOAD_FOLDER"] + "/" + file.filename
        if os.path.isfile(file_url):
            os.remove(file_url)

    db.session.delete(post)
    db.session.commit()
    return jsonify(), 204


def post_put(post_id):
    data = request.get_json()
    Post.query.filter(Post.id == post_id).update(data)
    post = Post.query.filter(Post.id == post_id).first()
    return jsonify(post.serialize), 201


def comment_get(post_id):
    page = int(request.args.get("page"))
    temp = Comment.query.filter(Comment.post_id == post_id).order_by(Comment.create_date.desc())
    if (page - 1) * 20 >= len(temp.all()):
        return jsonify(), 204
    temp = temp.paginate(page, per_page=20).items

    commentlist = []
    for i, comment in enumerate(temp):
        commentlist.append(comment.serialize)
        commentlist[i].update({"like_userid": [like_user.id for like_user in comment.like]})
    return jsonify(commentlist), 200


def comment_post(post_id, data):
    userid = data.get("userid")
    content = data.get("content")
    create_date = datetime.now()

    check_update_blacklist(userid)

    if not content:
        return jsonify({"error": "내용이 없습니다."}), 400

    post = Post.query.filter(Post.id == post_id).first()

    comment = Comment()
    comment.userid = userid
    comment.post_id = post_id
    comment.content = content
    comment.create_date = create_date

    comment.user = User.query.filter(User.id == userid).first()
    comment.post = post
    comment.post.comment_num += 1

    db.session.add(comment)
    db.session.commit()
    return jsonify(), 201


def comment_delete(data):
    comment_id = data.get("comment_id")

    comment = Comment.query.filter(Comment.id == comment_id).first()
    comment.post.comment_num -= 1

    db.session.delete(comment)
    db.session.commit()
    return jsonify(), 204


def comment_put(data):
    comment_id = data.get("comment_id")
    del data["comment_id"]

    Comment.query.filter(Comment.id == comment_id).update(data)
    comment = Comment.query.filter(Comment.id == comment_id).first()
    db.session.commit()
    return jsonify(comment.serialize), 201