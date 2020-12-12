import * as LINK from "../../config.js"
import * as COMMON from "../post/error.js"

export async function get_user_info() {
	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		// alert("로그인을 해주시기 바랍니다.");
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
    return COMMON.check_response_json(response);
}

export async function get_user_data(id) { //user의 user.id
	let response = await fetch(LINK.USER_SPECIFIC + id);
	return COMMON.check_response_json(response);
}