from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(256), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    birth = db.Column(db.DateTime(), nullable=False)
    nickname = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(32))
    black_num = db.Column(db.Integer, default=0)
    profile_img = db.Column(db.String(100), default="user-image.png")

    @property
    def serialize(self):
        return {
            "id": self.id,
            "userid": self.userid,
            "password": self.password,
            "username": self.username,
            "birth": self.birth,
            "nickname": self.nickname,
            "email": self.email,
            "black_num": self.black_num,
            "profile_img": self.profile_img,
        }


class Blacklist(db.Model):
    __tablename__ = "blacklist"
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    punishment_date = db.Column(db.Integer, default=0)
    punishment_end = db.Column(db.DateTime())

    user = db.relationship("User", backref=db.backref("Black_set_user", cascade="all,delete"))

    @property
    def serialize(self):
        return {
            "id": self.id,
            "userid": self.userid,
            "punishment_num": self.punishment_date,
            "punishment_end": self.punishment_end,
        }


class Category(db.Model):
    __tablename__ = "category"
    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False)
    board_num = db.Column(db.Integer, default=0)

    @property
    def serialize(self):
        return {"id": self.id, "category_name": self.category_name, "board_num": self.board_num}


class Board(db.Model):
    __tablename__ = "board"
    id = db.Column(db.Integer, primary_key=True)
    board_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text())
    post_num = db.Column(db.Integer, default=0)
    board_image = db.Column(db.String(100))
    category_id = db.Column(db.Integer, db.ForeignKey("category.id", ondelete="CASCADE"))

    category = db.relationship("Category", backref=db.backref("category_set", cascade="all,delete"))

    @property
    def serialize(self):
        return {
            "id": self.id,
            "board_name": self.board_name,
            "description": self.description,
            "post_num": self.post_num,
            "board_image": self.board_image,
            "category_id": self.category_id,
        }


post_like = db.Table(
    "post_like",
    db.Column(
        "user_id", db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), primary_key=True
    ),
    db.Column(
        "post_id", db.Integer, db.ForeignKey("post.id", ondelete="CASCADE"), primary_key=True
    ),
)

post_report = db.Table(
    "post_report",
    db.Column(
        "user_id", db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), primary_key=True
    ),
    db.Column(
        "post_id", db.Integer, db.ForeignKey("post.id", ondelete="CASCADE"), primary_key=True
    ),
)


class Post(db.Model):
    __tablename__ = "post"
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    subject = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey("board.id", ondelete="CASCADE"))
    comment_num = db.Column(db.Integer, default=0)
    like_num = db.Column(db.Integer, default=0)
    img_num = db.Column(db.Integer, default=0)
    report_num = db.Column(db.Integer, default=0)
    preview_image = db.Column(db.String(100))

    user = db.relationship("User", backref=db.backref("user_set_p", cascade="all,delete"))
    board = db.relationship("Board", backref=db.backref("post_set", cascade="all,delete"))
    like = db.relationship("User", secondary=post_like, backref=db.backref("post_like_set"))
    report = db.relationship("User", secondary=post_report, backref=db.backref("post_report_set"))

    @property
    def serialize(self):
        return {
            "id": self.id,
            "userid": self.userid,
            "subject": self.subject,
            "content": self.content,
            "create_date": self.create_date,
            "board_id": self.board_id,
            "comment_num": self.comment_num,
            "like_num": self.like_num,
            "img_num": self.img_num,
            "report_num": self.report_num,
            "preview_image": self.preview_image,
        }


class Post_img(db.Model):
    __tablename__ = "post_img"
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("post.id", ondelete="CASCADE"))

    post = db.relationship("Post", backref=db.backref("img_set", cascade="all,delete"))

    @property
    def serialize(self):
        return {"id": self.id, "filename": self.filename, "post_id": self.post_id}


comment_like = db.Table(
    "comment_like",
    db.Column(
        "user_id", db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), primary_key=True
    ),
    db.Column(
        "comment_id", db.Integer, db.ForeignKey("comment.id", ondelete="CASCADE"), primary_key=True
    ),
)

comment_report = db.Table(
    "comment_report",
    db.Column(
        "user_id", db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), primary_key=True
    ),
    db.Column(
        "comment_id", db.Integer, db.ForeignKey("comment.id", ondelete="CASCADE"), primary_key=True
    ),
)


class Comment(db.Model):
    __tablename__ = "comment"
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))
    content = db.Column(db.Text(), nullable=False)
    create_date = db.Column(db.DateTime(), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("post.id", ondelete="CASCADE"))
    like_num = db.Column(db.Integer, default=0)
    report_num = db.Column(db.Integer, default=0)

    user = db.relationship("User", backref=db.backref("user_set_c", cascade="all,delete"))
    post = db.relationship("Post", backref=db.backref("comment_set", cascade="all,delete"))
    like = db.relationship("User", secondary=comment_like, backref=db.backref("comment_like_set"))
    report = db.relationship(
        "User", secondary=comment_report, backref=db.backref("comment_report_set")
    )

    @property
    def serialize(self):
        return {
            "id": self.id,
            "userid": self.userid,
            "content": self.content,
            "create_date": self.create_date,
            "post_id": self.post_id,
            "like_num": self.like_num,
            "report_num": self.report_num,
        }