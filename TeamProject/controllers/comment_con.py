from datetime import datetime
from flask import request
from flask import jsonify
from models import Post, Comment, User
from models import db
from controllers.report_con import check_update_blacklist


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


def check_my_commentlike(comment_id, user):
    comment = Comment.query.get_or_404(comment_id)
    if user.id == comment.userid:
        print("본인이 작성한 댓글은 추천할수 없습니다!")
        return jsonify(), 403

    elif user not in comment.like:
        comment.like.append(user)
        comment.like_num += 1
        db.session.commit()
        return jsonify(), 201

    elif user in comment.like:
        print("이미 추천한 댓글입니다.")
        return jsonify({"error": "이미 추천한 댓글"}), 400