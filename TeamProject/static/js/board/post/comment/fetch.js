import * as LINK from "../../../config.js"
import * as COMMON from "../common.js"

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
	return COMMON.check_response_json(response);
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
        return COMMON.check_report_likes(response);
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
        return COMMON.check_response_boolean(response);
	}
}