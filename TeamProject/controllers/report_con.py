from datetime import datetime
from flask import jsonify
from flask import g
from models import Post, Comment, User, Blacklist
from models import db


def report_post_con(access_user, post_id):
    g.user = access_user
    post = Post.query.get_or_404(post_id)
    if g.user not in post.report:
        post.report.append(g.user)
        post.report_num += 1
        db.session.commit()
    elif g.user in post.report:
        return jsonify({"error": "신고 접수가 이미 되었습니다."}), 409

    return jsonify(result="success"), 201


def report_comment_con(access_user, post_id):
    g.user = access_user
    comment = Comment.query.get_or_404(id)
    if g.user not in comment.report:
        comment.report.append(g.user)
        comment.report_num += 1
        db.session.commit()
    elif g.user in comment.report:
        return jsonify({"error": "신고 접수가 이미 되었습니다."}), 409

    return jsonify(result="success"), 201


def check_update_blacklist(userid):
    user = User.query.filter(User.id == userid).first()
    if user.Black_set_user:
        black = Blacklist.query.filter(Blacklist.userid == userid).first()
        if black.punishment_end > datetime.now():
            return jsonify({"error": "현재 당신의 아이디는 게시글을 쓸 수 없습니다."}), 403
        else:
            db.session.delete(black)
            db.session.commit()