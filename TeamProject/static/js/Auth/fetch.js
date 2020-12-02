import * as LINK from "../config.js"
import * as AUTH from "./main.js"
import * as EVENT_AUTH from "./event.js"

// --------------------- 회원가입 Fetch API ------------------
export function get_membership_information() { // main 옮기기
	var profile = new Array();

	profile[0] = document.querySelector("#signup_name");
	profile[1] = document.querySelector("#signup_id");
	profile[2] = document.querySelector("#signup_pw");
	profile[3] = document.querySelector("#signup_pw2");
	profile[4] = document.querySelector("#signup_nickname");
	profile[5] = document.querySelector("#signup_email");
	profile[6] = document.querySelector("#signup_birth");


	if (signup_input_check(profile)) send_data_enterd_at_signup(profile);
}
// ----------- 회원가입 정보 체크 ------------
export function signup_input_check(profile) {
    for (var i = 0; i < 7; i++) {
        if (!profile[i].value) {
            alert_message(profile[i]);
            return false;
        }else if(i===3 && profile[i-1].value !==profile[i].value){
            alert_message(profile[i],false);
            return false;
        }
    }
    return true;
}
export function alert_message(input, pw_check) {
    input.focus();
    if (input.id === "signup_name") {
        alert("이름을 입력해주세요.");
        return;
    } else if (input.id === "signup_id") {
        alert("아이디를 입력해주세요.");
        return;
    } else if (input.id === "signup_pw") {
        alert("비밀번호를 입력해주세요.");
        return;
    } else if (input.id === "signup_pw2") {
        if (pw_check == false) {
            alert("비밀번호 확인란을 확인해주세요.")
            return;
        }
        alert("비밀번호 확인란을 입력해주세요.");
        return;
    } else if (input.id === "signup_nickname") {
        alert("닉네임을 입력해주세요.");
        return;
    } else if (input.id === "signup_email") {
        alert("이메일을 입력해주세요.");
        return;
    } else if (input.id === "signup_birth") {
        alert("생년월일을 입력해주세요.");
        return;
    }
}
export function send_data_enterd_at_signup(profile) {

	const send_data = new FormData();

	const image = document.querySelector('input[type="file"]');

	send_data.append('username', profile[0].value);
	send_data.append('userid', profile[1].value);
	send_data.append('password', profile[2].value);
	send_data.append('repassword', profile[3].value);
	send_data.append('nickname', profile[4].value);
	send_data.append('email', profile[5].value);
	send_data.append('birth', profile[6].value);

	if (image.value == "") send_data.append('profile_img', "");
	else send_data.append('profile_img', image.files[0]);

	check_input_data_at_signup(profile, send_data);
}
export function check_input_data_at_signup(profile, send_data) {

	const signup_url = LINK.AUTH_API + "/sign_up";

	fetch(signup_url, {
			method: "POST",
			body: send_data
		})
		.then(res => res.json())
		.then((res) => {
			if (res['msg'] == "success") {
				alert("회원가입 완료");
				document.querySelector("#signup_container").innerHTML = '';
			} else if (res['error'] == "비밀번호는 6자리 이상 12자리 이하입니다.") {
				alert("비밀번호는 6~12 자리입니다.");
				profile[2].focus();
			} else if (res['error'] == "비밀번호에 특수문자가 포함되어 있어야 합니다.") {
				alert("비밀번호에 특수문자 1자 이상 포함되어야 합니다.");
				profile[2].focus();
			} else if (res['error'] == "이메일 형식이 옳지 않습니다.") {
				alert("이메일 형식이 옳지 않습니다.");
				document.querySelector("#signup_email").style.border = "solid 2px red";
			} else if (res['error'] == '이미 있는 닉네임입니다.') {
				alert("이미 존재하는 닉네임 입니다.");
				profile[4].focus();
			} else if (res['error'] == "already exist") {
				alert("이미 존재하는 아이디 입니다.");
				profile[1].focus();
			} else if (res['error'] == "잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요") {
				alert("잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요");
				profile[6].focus();
			}
		})
}
// ---------------- 메인의 로그인 버튼 실행 함수 ----------------
export function main_login_btn_func() {

    const main_login_btn = document.querySelector(".main_login_btn");
    const main_login_id = document.querySelector("#main_login_id");
    const main_login_pw = document.querySelector("#main_login_pw");

    EVENT_AUTH.attach_login_event(main_login_btn, main_login_id, main_login_pw);
}
// ------------------------ 로그인 Fetch API ----------------------------
export function send_data_enterd_at_login(id, pw) {
	const send_data = {
		'userid': id.value,
		'password': pw.value
	};
	check_input_data_at_login(send_data);
}
export function check_input_data_at_login(send_data) {
	const login_url = LINK.AUTH_API + "/login";
	fetch(login_url, {
			method: "POST",
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify(send_data)
		})
		.then(res => res.json())
		.then((res) => {
			if (res['result'] == "success") {
				sessionStorage.setItem('access_token', "Bearer " + res['access_token']);
				document.querySelector("#login_container").innerHTML = '';
				get_user_information();
			} else if (res['error'] == "패스워드가 다릅니다.") {
				alert("비밀번호를 다시 확인해주세요.");
				pw.focus();
			} else if (res['error'] == "당신은 회원이 아니십니다.") {
				alert("아이디를 다시 확인해주세요.");
				id.focus();
			}
		})
}
// -------------------------- 유저 정보 불러오기 fetch api ------------------------
export function get_user_information() {
	if (sessionStorage.length === 0) return;
	else if (sessionStorage.length === 1)
		if (sessionStorage.getItem("access_token") === 0) return;

	const token = sessionStorage.getItem('access_token');

	const user_info_url = LINK.AUTH_API + "/user_info";
	fetch(user_info_url, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			}
		})
		.then(res => res.json())
		.then((res) => {
			AUTH.mainpage_after_login(res);
		})
}