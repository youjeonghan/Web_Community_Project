import os
from flask import jsonify, flash, url_for, redirect
from flask import request
from models import Board, db
from datetime import datetime
from app import app
from werkzeug.utils import secure_filename
from . import api

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# 게시판 기능
@api.route('/board', methods=['GET','POST'])            # 게시판 목록 보여주기, 글쓰기
def board():
	# POST
	if request.method == 'POST':                                    # 게시판 목록 추가 
		data = request.get_json()
		subject = data.get('subject')
		content = data.get('content')
		create_date = datetime.now()

		if not subject:
			return jsonify({'error': '제목이 없습니다.'}), 400

		if not content:
			return jsonify({'error': '내용이 없습니다.'}), 400

		board = Board()
		board.subject = subject
		board.content = content
		board.create_date = create_date

		db.session.add(board)
		db.session.commit()                                         # db에 저장

		return jsonify(), 201

	# GET
	boardlist = Board.query.all()
	return jsonify([board.serialize for board in boardlist])      # json으로 게시판 목록 리턴

@api.route('/board/<id>', methods=['GET','PUT','DELETE'])
def board_detail(id):
	if request.method == 'GET':                                 # 어떤id의 글
		board = Board.query.filter(Board.id == id).first()
		return jsonify(board.serialize)

	elif request.method == 'DELETE':                            # 삭제
		board = Board.query.filter(Board.id == id).first()
		db.session.delete(board)
		db.session.commit()
		return jsonify(), 204       # 204는 no contents를 의미한다(앞으로 이용할수 없다는 뜻을 명시적으로알림, 성공을 알리는거긴함)

	data = request.get_json()
	Board.query.filter(Board.id == id).update(data)
	board = Board.query.filter(Board.id == id).first()
	return jsonify(board.serialize)                             # 수정

@api.route('/boardupload/<id>', methods=['GET','POST'])
def board_uploadimg(id):
	if request.method == 'POST':
		print(request.files)
		# POST request에 파일 정보가 있는지 확인
		if 'file' not in request.files:
			flash('No file part')
			print(1)
			return redirect('api/boardupload/<id>')

		file = request.files['file']
		print(file)
		# 만약 유저가 파일을 고르지 않았을 경우
		if file.filename == '':
			flash('No selected file')
			print(2)
			return redirect('api/boardupload/<id>')

		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			print(22)
			print(filename)
			print(app.config['UPLOAD_FOLDER'])
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			print(33)
			return redirect(url_for('api.board_uploadimg', id=id))

	return '''
	<!doctype html>
	<title>Upload new File</title>
	<h1>Upload new File</h1>
	<form method=post enctype=multipart/form-data>
	  <input type=file name=file>
	  <input type=submit value=Upload>
	</form>
	'''