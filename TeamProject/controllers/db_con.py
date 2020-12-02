from models import User
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


def delete_column_by_id(table, id):
	db.session.query(table).filter(table.id == id).delete()
	db.session.commit()


def update_column(table, id, data):
	table.query.filter(table.id == id).update(
		data
	)  # PUT은 전체를 업데이트할 때 사용하지만 일부 업데이트도 가능은함
	db.session.commit()


def insert_user_table(data):
	# db 6개 회원정보 저장
	user = User()
	user.userid = data["userid"]
	user.username = data["username"]
	user.birth = data["birth"]
	user.nickname = data["nickname"]
	user.email = data["email"]
	user.password = generate_password_hash(data["password"])  # 비밀번호 해시
	user.profile_img = manufacture_img(data.get("profile_img"), UPLOAD_PROFILE_FOLDER)

	db.session.add(user)
	db.session.commit()
