import os
from datetime import datetime
from flask import request
from flask import jsonify
from flask import current_app
from flask import g
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


def access_user_return():
    user_id = get_jwt_identity()
    access_user = User.query.filter(User.userid == user_id).first()
    if access_user is None and user_id != "GM":
        return None
    else:
        return access_user


def check_my_postlike(post_id, user):
    post = Post.query.get_or_404(post_id)
    if user.id == post.userid:
        print("본인이 작성한 게시글은 추천할수 없습니다!")
        return jsonify(), 403

    elif user not in post.like:
        post.like.append(user)
        post.like_num += 1
        db.session.commit()
        return jsonify(), 201

    elif user in post.like:
        print("이미 추천한 게시글입니다.")
        return jsonify({"error": "이미 추천한 게시글"}), 400


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


def allowed_file(files):
    check = True
    for i in range(0, len(files)):
        if (
            files[i].filename.rsplit(".", 1)[1].lower()
            not in current_app.config["ALLOWED_EXTENSIONS"]
            or "." not in files[i].filename
        ):
            check = False
    return check


def img_upload():
    uploaded_files = request.files.getlist("file")
    delete_img = request.form.getlist("delete_img")
    post = Post.query.filter(Post.id == post_id).first()

    """ 수정 과정에서 사라지는 이미지 DB상에서 삭제 """
    for img in delete_img:
        os.remove(os.path.join(current_app.config["UPLOAD_FOLDER"], img))
        post_img = Post_img.query.filter(Post_img.filename == img).first()
        db.session.delete(post_img)
        db.session.commit()

    """ POST request에 file 이 있는지 확인 """
    if "file" not in request.files not in request.form:
        print("No file part")
        return jsonify(), 400

    """ 알맞은 확장자인지 확인후 저장 """
    if uploaded_files and allowed_file(uploaded_files):
        suffix = datetime.now().strftime("%y%m%d_%H%M%S")

        post.preview_image = None
        for i in range(0, len(uploaded_files)):
            filename = "_".join([uploaded_files[i].filename.rsplit(".", 1)[0], suffix])
            extension = uploaded_files[i].filename.rsplit(".", 1)[1]
            filename = secure_filename(f"{filename}.{extension}")

            uploaded_files[i].save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))

            post_img = Post_img()
            post_img.filename = filename
            post_img.post_id = post_id
            post_img.post = post
            post.img_num += 1
            db.session.add(post_img)
            db.session.commit()

        # preview_image = (
        #     Post_img.query.filter(Post_img.post_id == post_id).order_by(Post_img.id).first()
        # )
        # if preview_image == None:
        #     post.preview_image = post.board.board_image
        # else:
        #     post.preview_image = preview_image.filename
        # return jsonify(), 201

    preview_image = Post_img.query.filter(Post_img.post_id == post_id)
    preview_image = preview_image.order_by(Post_img.id).first()
    print(preview_image)

    if preview_image == None:
        post.preview_image = post.board.board_image
    else:
        post.preview_image = preview_image.filename
    return jsonify(), 201


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
    if g.user not in comment.report:  # 첫 신고
        comment.report.append(g.user)
        comment.report_num += 1  # 해당 댓글 신고 횟수 추가
        db.session.commit()
    elif g.user in comment.report:  # 해당 유저가 한번 더 신고 하는 경우
        return jsonify({"error": "신고 접수가 이미 되었습니다."}), 409

    return jsonify(result="success"), 201