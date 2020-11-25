from models import User
from models import db

def search_table_by_id(table , id):
	return table.query.filter(table.id == id).first()

