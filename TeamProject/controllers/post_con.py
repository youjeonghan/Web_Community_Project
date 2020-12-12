import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import request
from flask import jsonify
from flask import current_app
from sqlalchemy import and_
from models import Post, Board, User, Post_img
from models import db
from controllers.report_con import check_update_blacklist


def dic_update_boardname(postlist):
    returnlist = []
    for i, post in enumerate(postlist):
        returnlist.append(post.serialize)
        returnlist[i].update(board_name=post.board.board_name)
    return returnlist


def bestpost_list_con():
    postlist = Post.query.filter(Post.like_num > 0).order_by(Post.like_num.desc())
    postlist = postlist.limit(10).all()

    return jsonify(dic_update_boardname(postlist)), 200


def board_bestpost_con(board_id):
    postlist = Post.query.filter(and_(Post.board_id == board_id, Post.like_num > 0))
    postlist = postlist.order_by(Post.like_num.desc()).limit(10).all()

    return jsonify(dic_update_boardname(postlist)), 200


def board_post_list_con():
    board_id = int(request.args.get("board_id"))
    select_page_num = int(request.args.get("page"))

    postlist = []
    postlist = Post.query.filter(Post.board_id == board_id).order_by(Post.create_date.desc())
    if (select_page_num - 1) * 20 >= len(postlist.all()):
        return jsonify(), 204
    postlist = postlist.paginate(select_page_num, per_page=20).items

    return jsonify(dic_update_boardname(postlist)), 200


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


def post_detail_con(post_id):
    temp = Post.query.filter(Post.id == post_id).first()
    post = temp.serialize
    post.update(
        {
            "post_img_filename": [
                li.filename for li in Post_img.query.filter(Post_img.post_id == post_id).all()
            ],
            "like_userid": [like_user.id for like_user in temp.like],
        }
    )
    return jsonify(post), 200


def post_delete(post_id):
    post = Post.query.filter(Post.id == post_id).first()

    board = Board.query.filter(Board.board_name == post.board.board_name).first()
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


def img_upload(post_id):
    uploaded_files = request.files.getlist("file")
    delete_img = request.form.getlist("delete_img")
    print(uploaded_files)
    print(delete_img)
    post = Post.query.filter(Post.id == post_id).first()

    db_img_delete(delete_img, post)
    check_extension_save(uploaded_files, post)

    preview_image = Post_img.query.filter(Post_img.post_id == post_id)
    preview_image = preview_image.order_by(Post_img.id).first()

    if preview_image is None:
        post.preview_image = None
    else:
        post.preview_image = preview_image.filename
    return jsonify(), 201


# 수정 과정에서 사라지는 이미지 DB상에서 삭제
def db_img_delete(delete_img, post):
    for img in delete_img:
        os.remove(os.path.join(current_app.config["UPLOAD_FOLDER"], img))
        post_img = Post_img.query.filter(Post_img.filename == img).first()
        post.img_num -= 1
        db.session.delete(post_img)
        db.session.commit()


# 알맞은 확장자인지 확인후 저장하는 함수
def check_extension_save(uploaded_files, post):
    if "file" not in request.files not in request.form:
        print("No file part")

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
            post_img.post_id = post.id
            post_img.post = post
            post.img_num += 1
            db.session.add(post_img)
            db.session.commit()


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