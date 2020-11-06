import * as LINK from "../config.js"
import * as MAIN from "./main.js"
//보드 게시판 (개별)조회
export async function fetch_getBoard(board_id) {
	const response = await fetch(LINK.BOARD + `/${board_id}`);
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}

//post 조회  (get)
export async function fetch_getPost(id, page) {
	//get 요청 url 방식 /api/post?board_id=1&page=1 (id,page가 1일때 예시)
	const param = `?board_id=${id}&page=${page}`; //url뒤 변수부분
	
	const response = await fetch(LINK.POST+ param);
	if (response.ok) {

		// const result = {post : response.json(),code : response.status};
		return response;
	} else {
		console.log("HTTP-ERROR: " + response.status);
		return null;
	}
}

///========Post info fetch=========== //
//재민part
export async function fetch_getPostInfo(post_id) {
	const response = await fetch(LINK.POST + `/${post_id}`);
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}
// router로 부터 주소로 구분된 hashValue를 인자로 받아와 post_id에 넣어주고
// POST_URL과 해당 게시글의 아이디가 유효한지 확인할 때까지 기다린 후에
// response.ok에 해당될 경우 reponse.json(게시글에 대한 데이터)를 리턴시켜준다. 

///========Post info Comment fetch=========== //
//재민part
export async function fetch_getComment(post_id, page) {
	const response = await fetch(LINK.COMMENT + post_id + `?page=${page}`); //페이지넘버 같이보내줘야함
	if (response.status == 200) {
		return response.json();
	} else if (response.status == 204) {
		return null;
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}
// main.js에서 게시글 데이터를 불러올 때 load_comment를 실행하고 그 과정에서
// fetch_getComment를 불러온다. 게시글 데이터를 불러올 때 게시글 아이디에 대한 data를 받아오고
// response에 fetch를 통해 comment_url과 게시글 작성자의 아이디, 페이지를 넣어준다.
// 페이지네이션이 없지만 페이지가 존재하는 이유는 api상으로는 존재하며 페이지당 20개의 댓글을 보여줄 것이기 때문에
// Backend로부터 페이지당 20개의 댓글을 받아온다.

//////////post 입력//////
//재민 part
export async function fetch_insert(data) {
	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.POST, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});

	if (response.ok) {
		return response.json();
	} else if (response.status === 403) {
		response.json().then((response) => {
			alert(response.error);
		});
	} else if (response.status === 400) {
		response.json().then((response) => {
			alert(response.error);
		});
	} else {
		console.log("HTTP-ERROR: " + response.status);
	}
}

export function checkerror(response) {
	response.status === 400
}
// post 게시를 위한 요청함수
// token을 통해 게시글 작성권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// token이 없을 시에는 에러를 보여주고
// token이 있을 시에는 POST_URL과 data(제목,컨텐츠,작성자) 받아오며 작성요청을 받아 
// option으로 method는 post, response headers에 받을 수 있는 양식을 모두 json 데이터로 설정해주고
// body에는 요청본문이 들어가며 data(작성된 제목, 컨텐츠, 사용자 id, 카테고리)를 JSON화 시킨 내용을 넣어준다.
// response 요청이 허가돠있을 경우 json화 시킨 데이터를 retrun 시켜주고
// 오류에 대해서도 오류처리를 했다.

//post 삭제//
//재민 part
export async function fetch_delete(id) {

	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.POST + '/'+`${id}`, {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	})
	if (response.ok) {
		return true;
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
}
// post 삭제를 위한 요청함수
// token을 통해 게시글 삭제권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// token이 없을 시에는 에러를 보여주고
// token이 있을 시에는 POST_URL에서 삭제요청을 받아 
// option으로 method는 delete, response headers에 받을 수 있는 양식을 모두 json 데이터로 설정해주고
// response 요청이 허가되었을 경우 삭제되었다는 알람을 띄어준다.

//post 수정 //
//재민 part
export async function fetch_update(id, data) {

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
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);
	}
}
// post 수정을 위한 요청함수
// token을 통해 게시글 수정권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// token이 없을 시에는 에러를 보여주고
// token이 있을 시에는 POST_URL과 id값을 받아오며 수정요청을 받아 
// option으로 method는 put, response headers에 받을 수 있는 양식을 모두 json 데이터로 설정해주고
// body에는 요청본문이 들어가며 data(수정된 제목, 수정된 컨텐츠, id)를 JSON화 시킨 내용을 넣어준다.
// response 요청이 허가돠있을 경우 json화 시킨 데이터를 retrun 시켜주고
// 오류에 대해서도 오류처리를 하였습니다.


//============유저 정보 불러오는 fetch api=================//
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

//======================유저 ID로 정보받아오기=====================
export async function fetch_getUserdata(id) { //user의 user.id
	let response = await fetch(LINK.USER_SPECIFIC + id);
	if (response.ok) {
		return response.json();
	} else {
		alert("HTTP-ERROR: " + response.status);

	}
}

//재민 part
//파일업로드 페치
export async function fetch_upload(id, data) {

	const token = sessionStorage.getItem('access_token');
	const response = await fetch(LINK.FILE_UPLOAD + '/' + id, {
		method: 'POST',
		headers: {
			'Authorization': token
		},
		body: data
	});

	if (response.ok) {
		MAIN.INPUT_DATA_FILE.reset_files();
		return true;
	} else if (response.status == 400) { //파일을 고르지 않았을 경우
		MAIN.INPUT_DATA_FILE.reset_files();
		console.log("HTTP-ERROR: " + response.status);
	}
}
// 파일업로드 요청함수
// token을 통해 게시글 작성권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 업로드는 post과정에서 이루어지기 때문에 method로 post를, 권한확인을 token을 통해 실시한다.
// 본문요청에는 file_hub에서 class로 생성한 image_data를 넣어준다.
// 이미지 업로드 요청이 허가되었을 경우 기존에 이미지가 들어간 배열을 초기화해준다.
// 오류가 발생하더라도 이미지가 들어간 배열은 초기화시켜주며 에러 출력

// post 좋아요
//재민 part
export async function fetch_postLikes(id) {
	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.POSTLIKES + id, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if (response.ok) {
		alert('추천 되었습니다.');
		return true;
	} else {
		console.log("HTTP-ERROR: " + response.status);
		return response.status;
	}
}
// 게시글 좋아요 클릭 시 요청 함수
// token을 통해 게시글 좋아요 권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 response headers에 json 데이터로 설정하여 넣어주고, token을 통해 권한확인을 실시한다.
// response ok인 경우 추천되었다는 알람을 띄어준다.
// 오류 발생시 오류를 return한다.

//댓글 좋아요
//재민 part
export async function fetch_commentLikes(id) {
	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.COMMENTLIKES + id, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if (response.ok) {
		alert('추천 되었습니다.');
		return true;
	} else {
		return response.status;
	}
}
// 댓글 좋아요 클릭 시 요청 함수
// token을 통해 댓글 좋아요 권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 response headers에 json 데이터로 설정하여 넣어주고, token을 통해 권한확인을 실시한다.
// response ok인 경우 추천되었다는 알람을 띄어준다.
// 오류 발생시 오류를 return한다.

/*=============댓글 CRUD================*/
//재민 part
export async function fetch_commentInput(id, data) {
	const token = sessionStorage.getItem('access_token');
	const response = await fetch(LINK.COMMENT + id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
	if (response.status === 403) {
		response.json().then((response) => {
			alert(response.error);
		});
	} else if (response.status === 400) {
		response.json().then((response) => {
			alert(response.error);
		});
	} else {
		console.log("HTTP-ERROR: " + response.status);
	}
}
// 댓글 작성 시 요청
// token을 통해 댓글 생성권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 method로 post를 response headers에 json 데이터로 설정하여 넣어주고, token을 통해 권한확인을 실시한다.
// 본문요청에는 받아온 댓글 내용과 사용자 id를 json화 시킨다.
// response ok인 경우 console로 받아온 데이터에 대한 확인
// 오류 발생시 오류를 return한다.

//재민part
export async function fetch_commentDelete(id, data) {

	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.COMMENT + id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
}
// 댓글 삭제 시 요청
// token을 통해 댓글 삭제권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 method로 post를 response headers에 json 데이터로 설정하여 넣어주고, token을 통해 권한확인을 실시한다.
// 본문요청에는 받아온 댓글 내용과 사용자 id를 json화 시킨다.
// response ok인 경우 console로 받아온 데이터에 대한 확인
// 오류 발생시 오류를 return한다.

//재민part
export async function fetch_commentUpdate(id, data) {

	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.COMMENT + id, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
}
// 댓글 수정 시 요청
// token을 통해 댓글 수정권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 method로 put을 response headers에 json 데이터로 설정하여 넣어주고, token을 통해 권한확인을 실시한다.
// 본문요청에는 받아온 수정한 댓글 내용과 사용자 id를 json화 시킨다.

/* 베스트 게시글 가져오기 */
export async function fetch_getBestPost(id) {
	let url = LINK.BEST_POST;
	if (id != 'total') url += `/${id}`; //total이면 전체 게시글
	const response = await fetch(url);
	if (response.ok) return response.json();
	else alert("HTTP-ERROR: " + response.status);
}

//========검색 기능==========//
export async function fetch_search(param, id) {
	console.log(param);
	let url = LINK.SEARCH;
	if (id != 'total') url += `/${id}`; //total이면 전체
	url += `?${param}`;
	const response = await fetch(url);
	if (response.ok) return response;
	else {
		alert("HTTP-ERROR: " + response.status);
		return null;
	}
}

//게시글 신고
//재민 part
export async function fetch_postReport(id) {

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
// 게시글 신고 시 요청 함수
// token을 통해 게시글 신고권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// url로 response headers에 json 데이터로 설정하여 넣어주고, token을 통해 권한확인을 실시한다.
// method로 post를 요청하고 response headers에 받을 수 있는 양식을 모두 json 데이터로 설정해주고
// Backend로 부터 받아와 ok시에 boolean값으로 true return

//댓글 신고
//재민 part
export async function fetch_commentReport(id) {

	const token = sessionStorage.getItem('access_token');
	if (token === null) {
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(LINK.REPORT_COMMENT + id, {
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
		return response.status;
	}
}
// 댓글 신고 시 요청 함수
// token을 통해 댓글 신고권한을 확인하며 이 과정에서 로그인 시 저장되는 access_token을 받아온다.
// method로 post를 요청하고 response headers에 받을 수 있는 양식을 모두 json 데이터로 설정해주고
// Backend로 부터 받아와 ok시에 boolean값으로 true return
import {after_login} from '/static/js/auth.js';
// --------------------- 회원가입 Fetch API ------------------
function signup_FetchAPI(name, id, pw, pw2, email, nick, birth) {

    const send_data = new FormData();

    const image = document.querySelector('input[type="file"]');

    send_data.append('userid', id.value);
    send_data.append('password', pw.value);
    send_data.append('repassword', pw2.value);
    send_data.append('username', name.value);
    send_data.append('nickname', nick.value);
    send_data.append('email', email.value);
    send_data.append('birth', birth.value);

    if (image.value == "") send_data.append('profile_img', "");
    else send_data.append('profile_img', image.files[0]);

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
                pw.focus();
            } else if (res['error'] == "비밀번호에 특수문자가 포함되어 있어야 합니다.") {
                alert("비밀번호에 특수문자 1자 이상 포함되어야 합니다.");
                pw.focus();
            } else if (res['error'] == "이메일 형식이 옳지 않습니다.") {
                alert("이메일 형식이 옳지 않습니다.");
                document.querySelector("#signup_email").style.border = "solid 2px red";
            } else if(res['error'] == '이미 있는 닉네임입니다.'){
				alert("이미 존재하는 닉네임 입니다.");
				nick.focus();
			} else if(res['error'] == "already exist"){
				alert("이미 존재하는 아이디 입니다.");
				id.focus();
			} else if(res['error'] == "잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요"){
				alert("잘못된 날짜를 입력하셨습니다. YYYY-MM-DD 형식으로 입력해주세요");
				email.focus();
			}

        })
}

// -------------------------- 유저 정보 불러오기 fetch api ------------------------
function get_userinfo_FetchAPI() {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem("access_token") == 0) return;

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
            after_login(res);
        })
}

export {signup_FetchAPI, get_userinfo_FetchAPI};
//{signup_FetchAPI,get_userinfo_FetchAPI} auth.js 에서 fetch 함수 fetch.js로 옮기고 export 시키기