from models import Post, Comment, Board, User, Post_img, Category, Blacklist
from models import db

def dic_update_boardname(postlist):
	returnlist = []
	for i, post in enumerate(postlist):
		returnlist.append(post.serialize)
		returnlist[i].update(board_name=post.board.board_name)
	return returnlist