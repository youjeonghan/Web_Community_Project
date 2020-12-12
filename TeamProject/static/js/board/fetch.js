import * as LINK from "../config.js"
import * as AUTH from "../Auth/main.js"
import * as POST_INDEX from "./post/index.js";
import * as COMMON from "./post/common.js"

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