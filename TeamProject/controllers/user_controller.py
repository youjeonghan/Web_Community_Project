from models import User, db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re
import config




# 이미지 기본 설정
def allowed_file(file):
    check = 1
    if (
        file.filename.rsplit(".", 1)[1].lower() not in ALLOWED_EXTENSIONS
        or "." not in file.filename
    ):
        check = 0

    return check


# def profile_img_upload_table(profile_img):
# 	suffix = datetime.now().strftime("%y%m%d_%H%M%S")
# 	# 중복된 이름의 사진을 받기위해서 파일명에 시간을 붙임
# 	filename = "_".join([profile_img.filename.rsplit(".", 1)[0], suffix])

# 	extension = profile_img.filename.rsplit(".", 1)[1]
# 	filename = secure_filename(f"{filename}.{extension}")

# 	user = User.query.filter(User.id == id).first()
# 	user.profile_img = filename
# 	db.session.add(user)
# 	db.session.commit()

# 	profile_img.save(os.path.join(UPLOAD_FOLDER, filename))


def pwd_check(password):
    result = {}
    if len(password) < 6 or len(password) > 12:
        result = {"error": "비밀번호는 6자리 이상 12자리 이하입니다.", "error_code": 403}  # 데이터 유효성 검사
        return result
    if len(re.findall("[^a-zA-Z0-9]", password)) == 0:
        result = {"error": "비밀번호에 특수문자가 포함되어 있어야 합니다.", "error_code": 403}  # 데이터 유효성 검사
        return result
    return result


def email_check(email):
    result = {}
    reg = re.findall("^[a-z0-9]{2,}@[a-z]{2,}\.[a-z]{2,}$", email)
    if len(reg) == 0:
        result = {"error": "이메일 형식이 옳지 않습니다.", "error_code": 403}  # 데이터 유효성 검사
        return result
    if User.query.filter(User.email == email).first():
        result = {"error": "이미 가입이 된적 있는 이메일입니다.", "error_code": 409}  # 중복 오류 코드
        return result
    return result
