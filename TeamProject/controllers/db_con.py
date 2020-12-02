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

def search_table_by_email(table, email):
	return table.query.filter(table.email == email).first()

def delete_column_by_id(table,id):
	db.session.query(table).filter(table.id == id).delete()
	db.session.commit()