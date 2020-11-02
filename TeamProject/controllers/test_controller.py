import random
from models import db, Post, User, Category, Board, Comment, Blacklist


def board_create(order, category_id):
    board = Board()

    board.board_name = f"게시판 이름{order}"
    board.description = f"게시판 설명{order}"
    board.category_id = ran
    board.post_num = 0

    board.category = Category.query.filter(Category.id == category_id).first()
    board.category.board_num += 1

    return board
