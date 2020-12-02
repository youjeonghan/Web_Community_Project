import * as LINK from "../../config.js"
//보드 게시판 (개별)조회
export async function get_Board(board_id) {
	const response = await fetch(LINK.BOARD + `/${board_id}`);
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}

//post 조회  (get)
export async function get_Post(id, page) {
	//get 요청 url 방식 /api/post?board_id=1&page=1 (id,page가 1일때 예시)
	const param = `?board_id=${id}&page=${page}`; //url뒤 변수부분
	const response = await fetch(LINK.POST + param);

	if (response.ok) {
		// const result = {post : response.json(),code : response.status};
		return response;
	} else {
		console.log("HTTP-ERROR: " + response.status);
		return null;
	}
}