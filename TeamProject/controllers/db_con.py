from models import db


def search_table_by_id(table, id):
	return table.query.filter(table.id == id).first()


def search_table_by_id_all(table, id):
	return table.query.filter(table.id == id).all()


def search_table_by_nickname(table, nickname):
	return table.query.filter(table.nickname == nickname).first()


def search_table_by_userid(table, userid):
	return table.query.filter(table.userid == userid).first()


def search_table_by_email(table, email):
	return table.query.filter(table.email == email).first()

def search_table_by_post_id_all(table,id):
	return table.query.filter(table.post_id == id).all()

def search_table_by_board_id_all(table,id):
	return table.query.filter(table.board_id == id).all()

def search_table_by_category_name(table,category_name):
	return table.query.filter(table.category_name == category_name).first()


def search_table_by_category_id_all(table ,category_id):
	return table.query.filter(table.category_id == category_id).all()

def delete_column_by_id(table, id):
	db.session.query(table).filter(table.id == id).delete()
	db.session.commit()

def delete_column_by_object(table):
	db.session.delete(table)
	db.session.commit()

def update_column(table, id, data):
	table.query.filter(table.id == id).update(data)
	db.session.commit()

def insert_table(table):
	db.session.add(table)
	db.session.commit()

def commit_session_to_db():
	db.session.commit()