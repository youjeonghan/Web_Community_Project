from models import User
from models import db

def search_table_by_id(table , id):
	return table.query.filter(table.id == id).first()

def store_table_to_db(table):
	db.session.add(table)
	db.session.commit()  # db에 저장
