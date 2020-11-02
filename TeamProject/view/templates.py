from flask import render_template
from view import view
from test import *
from api.decoration import admin_required


@view.route("/")
def main():
    return render_template("main.html")


@view.route("/post")
def post():
    return render_template("post.html")


@view.route("/signup")
def signup():
    return render_template("signup.html")


@view.route("/login")
def login():
    return render_template("login.html")


@view.route("/manager")
def manager():
    return render_template("manager.html")


@view.route("/mypage")
def mypage():
    return render_template("mypage.html")


@view.route("/test")
@admin_required
def test():
    test_db_insert()
    return render_template("main.html")