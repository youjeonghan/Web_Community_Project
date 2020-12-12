import * as LINK from "../../../config.js"
import * as ERROR from "../error.js"

const author_token = sessionStorage.getItem('access_token');

export async function input_comment(id, data) {
    const response = await fetch(LINK.COMMENT + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': author_token
        },
        body: JSON.stringify(data)
    });
	ERROR.check_response_json(response);
}

export async function get_comment(post_id, page) {
	const response = await fetch(LINK.COMMENT + post_id + `?page=${page}`); //페이지넘버 같이보내줘야함
	return ERROR.check_response_json(response);
}

export async function update_comment(id, data) {
	const token = ERROR.check_token();
	if(token){
		const response = await fetch(LINK.COMMENT + id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': author_token
			},
			body: JSON.stringify(data)
		});
	}
}

export async function delete_comment(id, data) {
	const token = ERROR.check_token();
	if(token){
		const response = await fetch(LINK.COMMENT + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				'Authorization': author_token
			},
			body: JSON.stringify(data)
		});
	}
}

export async function insert_comment_likes(id) {
	const token = ERROR.check_token();
	if(token) {
		const response = await fetch(LINK.COMMENTLIKES + id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': author_token
			}
        });
        return ERROR.check_report_likes(response);
	}
}

export async function insert_comment_report(id) {

	const token = ERROR.check_token();
	if(token) {
		const response = await fetch(LINK.REPORT_COMMENT + id, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': author_token
			}
        });
        return ERROR.check_response_boolean(response);
	}
}