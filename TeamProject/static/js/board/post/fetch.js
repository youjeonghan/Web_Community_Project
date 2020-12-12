import * as INDEX from "./index.js"
import * as COMMON from "./error.js"
import * as LINK from "../../config.js"

const author_token = sessionStorage.getItem('access_token');

export async function insert_post(data) {
	const token = COMMON.check_token();
	if(token){
		const response = await fetch(LINK.POST, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': author_token
			},
			body: JSON.stringify(data)
        });
        return COMMON.check_response_json(response);
	}
}

export async function get_post(post_id) {
    const response = await fetch(LINK.POST + `/${post_id}`);
	return COMMON.check_response_json(response);
}

export async function update_post(id, data) {
    const url = LINK.POST + '/' + id;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': author_token
        },
        body: JSON.stringify(data)
    });
    return COMMON.check_response_json(response);
}

export async function delete_post(id) {
	const token = COMMON.check_token();
	if(token) {
		const response = await fetch(LINK.POST + '/' + `${id}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': author_token
			}
        });
        return COMMON.check_response_boolean(response);
	}
}

export async function upload_image(id, data) {
	const token = COMMON.check_token();
	if(token) {
		const response = await fetch(LINK.FILE_UPLOAD + '/' + id, {
			method: 'POST',
			headers: {
				'Authorization': author_token
			},
			body: data
        });
        if (response.ok) {
            INDEX.INPUT_DATA_FILE.reset_files();
        } else if (response.status == 400) { //파일을 고르지 않았을 경우
            INDEX.INPUT_DATA_FILE.reset_files();
            console.log("HTTP-ERROR: " + response.status);
        }
	}
}

export async function insert_post_likes(id) {
	const token = COMMON.check_token();
	if(token) {
		const response = await fetch(LINK.POSTLIKES + id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': author_token
			}
        });
        return COMMON.check_report_likes(response);
	}
}

export async function insert_post_report(id) {
    const token = COMMON.check_token();
    if(token) {
    const response = await fetch(LINK.REPORT + id, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': author_token
        }
    });
    return COMMON.check_response_boolean(response);
    }
}