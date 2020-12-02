from models import User
from models import db

def search_table_by_id(table , id):
	return table.query.filter(table.id == id).first()

def search_table_by_id_all(table , id):
	return table.query.filter(table.id == id).all()

def search_table_by_nickname(table , nickname):
	return table.query.filter(table.nickname == nickname).first()

def search_table_by_userid(table, userid):
	return table.query.filter(table.userid == userid).first()