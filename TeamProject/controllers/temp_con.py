import os
from datetime import datetime
from werkzeug.utils import secure_filename
from config import *

# 이미지 기본 설정
def allowed_file(file):
	if (
		file.filename.rsplit(".", 1)[1].lower() not in ALLOWED_EXTENSIONS
		or "." not in file.filename
	):
		return False

	return True

def manufacture_img(input_img, folderurl):
	# 사진 이름 테이블에 삽입 및 저장
	if input_img and allowed_file(input_img):  #  이미지 확장자 확인
		suffix = datetime.now().strftime("%y%m%d_%H%M%S")
		filename = "_".join(
			[input_img.filename.rsplit(".", 1)[0], suffix]
		)  # 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
		extension = input_img.filename.rsplit(".", 1)[1]
		filename = secure_filename(f"{filename}.{extension}")
		input_img.save(os.path.join(folderurl, filename))
		return filename

def delete_img(target):
	if os.path.isfile(target):
		os.remove(target)
