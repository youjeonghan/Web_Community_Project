import * as LINK from "../config.js"
import * as AUTH from "../Auth/main.js"
import * as POST_INDEX from "./post/index.js";
import * as COMMON from "./post/common.js"

export async function get_Board(board_id) {
	const response = await fetch(LINK.BOARD + `/${board_id}`);
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}

export async function get_Post(id, page) {

	const param = `?board_id=${id}&page=${page}`;
	const response = await fetch(LINK.POST + param);

	if (response.ok) {
		return response;
	} else {
		console.log("HTTP-ERROR: " + response.status);
		return null;
	}
}

export async function get_post(post_id) {
    const response = await fetch(LINK.POST + `/${post_id}`);
	return COMMON.check_response_json(response);
}

export async function insert_post(data) {
	const token = check_token();
	if(token){
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.POST, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': AuthorToken
			},
			body: JSON.stringify(data)
		});
	}
	return check_response_json(response);
}

export async function delete_post(id) {

	const token = check_token();
	if(token) {
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.POST + '/' + `${id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': AuthorToken			}
		})
	}
    return COMMON.check_response_boolean(response);
}

export async function update_post(id, data) {
    const token = sessionStorage.getItem('access_token');
    const url = LINK.POST + '/' + id;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(data)
    });
    return check_response_json(response);
}

export async function fetch_userinfo() {

	const token = sessionStorage.getItem('access_token');

	if (token === null) {
		alert("로그인을 해주시기 바랍니다.");
		return {
			'id': null
		};
	}
	const response = await fetch(LINK.USER_INFO, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if (response.ok) {
		return response.json();
	} else {
		console.log("HTTP-ERROR: " + response.status);
		return null;
	}
}


export async function fetch_getUserdata(id) { //user의 user.id
	let response = await fetch(LINK.USER_SPECIFIC + id);
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
}

export async function upload_image(id, data) {
	const token = check_token();
	if(token) {
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.FILE_UPLOAD + '/' + id, {
			method: 'POST',
			headers: {
				'Authorization': AuthorToken
			},
			body: data
		});
	}
    if (response.ok) {
        POST_INDEX.INPUT_DATA_FILE.reset_files();
    } else if (response.status == 400) {
        POST_INDEX.INPUT_DATA_FILE.reset_files();
        console.log("HTTP-ERROR: " + response.status);
    }
}

export async function insert_post_likes(id) {
	const token = check_token();
	if(token) {
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.POSTLIKES + id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': AuthorToken
			}
		});
	}
   COMMON.check_report_likes(response);
}

export async function insert_comment_likes(id) {
	const token = COMMON.check_token();
	if(token) {
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.COMMENTLIKES + id, {
			headers: {
				'Accept': 'application/json',

				'Content-Type': 'application/json',
				'Authorization': AuthorToken
			}
		});
	}
    COMMON.check_report_likes(response);
}

export async function input_comment(id, data) {
    const token = sessionStorage.getItem('access_token');
    const response = await fetch(LINK.COMMENT + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': token
        },
        body: JSON.stringify(data)
    });
	COMMON.check_response_json(response);
}

export async function get_comment(post_id, page) {
    const response = await fetch(LINK.COMMENT + post_id + `?page=${page}`); //페이지넘버 같이보내줘야함
    COMMON.check_response_json(response);
}

export async function delete_comment(id, data) {
	const token = COMMON.check_token();
	if(token){
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.COMMENT + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': AuthorToken
			},
			body: JSON.stringify(data)
		});
	}
}

export async function update_comment(id, data) {
	const token = COMMON.check_token();
	if(token){
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.COMMENT + id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': AuthorToken
			},
			body: JSON.stringify(data)
		});
	}
}

export async function get_best_post_information(id) {
	let url = LINK.BEST_POST;
	if (id != 'total') url += `/${id}`; 
	const response = await fetch(url);
	if (response.ok) return response.json();
	else alert("HTTP-ERROR: " + response.status);
}


export async function get_search_information(param, id) {
	let url = LINK.SEARCH;
	if (id != 'total') url += `/${id}`;
	url += `?${param}`;
	const response = await fetch(url);
	if (response.ok) return response;
	else {
		alert("HTTP-ERROR: " + response.status);
		return null;
	}
}

export async function insert_post_report(id) {

	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.REPORT + id, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if (response.ok) {
		return true;
	} else {
		console.log("HTTP-ERROR: " + response.status);
		return response.status;

	}
}

export async function insert_comment_report(id) {

	const token = COMMON.check_token();
	if(token) {
		const AuthorToken = sessionStorage.getItem('access_token');
		const response = await fetch(LINK.REPORT_COMMENT + id, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': AuthorToken
			}
		});
	}
	COMMON.check_response_boolean(response);
}
// 댓글 신고 시 요청 함수
// token을 통해 댓글 신고권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// method로 post를 요청하고 response headers에 받을 수 있는 양식을 모두 json 데이터로 설정해주고
// Backend로 부터 받아와 ok시에 boolean값으로 true return
// --------------------- 회원가입 Fetch API ------------------
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
// ------------------------ 로그인 Fetch API ----------------------------
export function send_data_enterd_at_login(id, pw) {
	const send_data = {
		'userid': id.value,
		'password': pw.value
	};
	check_input_data_at_login(send_data);
}
export function check_input_data_at_login(send_data) {
	//const login_url = LINK.AUTH_API + "/login";
	fetch(LINK.AUTH_API + "/login", {
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