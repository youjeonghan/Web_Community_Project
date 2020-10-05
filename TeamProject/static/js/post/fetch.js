
const POST_URL = 'http://127.0.0.1:5000/api/post';
const FILE_UPLOAD_URL = 'http://127.0.0.1:5000/api/postupload';
const USER_INFO_URL = 'http://127.0.0.1:5000/api/user_info';
const BOARD_URL = 'http://127.0.0.1:5000/api/board_info';
const COMMENT_URL = 'http://127.0.0.1:5000/api/comment/';
const POSTLIKES_URL = 'http://127.0.0.1:5000/api/postlike/';
const COMMENTLIKES_URL = 'http://127.0.0.1:5000/api/commentlike/';
const BEST_POST_URL = 'http://127.0.0.1:5000/api/bestpost';
const USER_SPECIFIC_URL = 'http://127.0.0.1:5000/api/user_specific_info/';
const SEARCH_URL = 'http://127.0.0.1:5000/api/search';
const REPORT_URL ='http://127.0.0.1:5000/api/report_post/';
const REPORT_COMMENT_URL ='http://127.0.0.1:5000/api/report_comment/';
const CHECK_AUTH_URL = 'http://127.0.0.1:5000/api//who_are_you';

//보드 게시판 (개별)조회
async function fetch_getBoard(board_id){
	const response = await fetch(BOARD_URL+`/${board_id}`);

	if(response.ok){
		return response.json();
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();

}

//post 조회  (get)
async function fetch_getPost(id,page){
	const param = `?board_id=${id}&page=${page}`; //url뒤 변수부분
	//get 요청 url 방식 /api/post?board_id=1&page=1 (id,page가 1일때 예시)
	const response = await fetch(POST_URL+param);
	if(response.ok){

		// const result = {post : response.json(),code : response.status};
		return response;
	}

	else{
		console.log("HTTP-ERROR: " + response.status);
		return null;
	}
}
/*=============추가페이지 로드 post get====================*/
// async function fetch_getNewPost(id,page){
// 	const param = `?board_id=${id}&page=${page}`; //url뒤 변수부분
// 	//get 요청 url 방식 /api/post?board_id=1&page=1 (id,page가 1일때 예시)
// 	const response = await fetch(POST_URL+param);
// 	if(response.ok){

// 		return response.json();
// 	}

// 	else{
// 		return null;
// 	}

// }

///========Post info fetch=========== //
async function fetch_getPostInfo(post_id){
	const response = await fetch(POST_URL+`/${post_id}`);
	if(response.ok){
		return response.json();
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}
///========Post info Comment fetch=========== //

async function fetch_getComment(post_id,page){
	const response = await fetch(COMMENT_URL+post_id+`?page=${page}`);//페이지넘버 같이보내줘야함
	if(response.status == 200){
		return response.json();
	}
	else if(response.status == 204){
		return null;
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}

//////////post 입력//////
async function fetch_insert(data){
	console.log('입력');

	const token = sessionStorage.getItem('access_token');
	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(POST_URL,{
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});

	if(response.ok){
		return response.json();
	}
	else if(response.status === 403){
		response.json().then((response)=>{
			alert(response.error);
		});
	}
	else if(response.status === 400){
		response.json().then((response)=>{
			alert(response.error);
		});
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
	}
}

//post 삭제//
async function fetch_delete(id){

	const token = sessionStorage.getItem('access_token');
	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(POST_URL+`/${id}`,{
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	})
	if(response.ok){
		return alert("삭제되었습니다!");
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
}

//post 수정 //
async function fetch_update(id , data){

 const token = sessionStorage.getItem('access_token');
	const url = POST_URL + '/' + id;
	const response = await fetch(url,{
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
	if(response.ok){
		return response.json();
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
}


//============유저 정보 불러오는 fetch api=================//
async function fetch_userinfo(){

	const token = sessionStorage.getItem('access_token');

	if(token === null){
		console.log("로그인을 안한 사용자 ");
		return {'id' : null};
	}

	const response = await fetch(USER_INFO_URL,{
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		return response.json();
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
		return null;

	}
}
//======================유저 ID로 정보받아오기=====================
async function fetch_getUserdata(id){//user의 user.id
	let response = await fetch(USER_SPECIFIC_URL+id);
	if(response.ok){
		return response.json();
	}
	else{
		alert("HTTP-ERROR: " + response.status);

	}
}

//============이미지 파일 업로드  fetch api=================//
// function fetch_upload(id,files){//파일받아와서
// 	const url = FILE_UPLOAD_URL + '/' + id;
// 	const data = new FormData();
//   data.append('file',files); //data에 파일연결
//   return fetch(url,{
//   	method: 'POST',
//   	body: data
//   }).then(function(response) {
//   	if(response.ok){
//   		return alert("파일업로드 완료!");
//   	}
//   	else{
//   		alert("HTTP-ERROR: " + response.status);
//   	}````````


//   });
// }


async function fetch_upload(id,data){//파일업로드
	// const data = new FormData();

	// for (const value of files){
 //    	data.append('file',value); //data에 파일연결
 //    }


 const token = sessionStorage.getItem('access_token');
 const response = await fetch(FILE_UPLOAD_URL + '/' + id,{
 	method: 'POST',
 	headers: {
 		'Authorization': token
 	},
 	body : data
 });

 if(response.ok){
 	INPUT_DATA_FILE.reset_files();
 	return console.log("업로드완료!");
 }
    else if(response.status == 400){ //파일을 고르지 않았을 경우
    	INPUT_DATA_FILE.reset_files();
    	console.log("HTTP-ERROR: " + response.status);
    }
}


async function fetch_postLikes(id){
 const token = sessionStorage.getItem('access_token');
 	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(POSTLIKES_URL+id,{
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		alert('추천 되었습니다.');
		return true;
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
		return response.status;
	}
}

async function fetch_commentLikes(id){
 const token = sessionStorage.getItem('access_token');
 	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(COMMENTLIKES_URL+id,{
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		alert('추천 되었습니다.');
		return true;
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
		return response.status;

	}
}

/*=============댓글 CRUD================*/
async function fetch_commentInput(id , data){
	const token = sessionStorage.getItem('access_token');
	const response = await fetch(COMMENT_URL+id,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
	if(response.ok){
		console.log(response.json());
	}
	else if(response.status === 403){
		response.json().then((response)=>{
			alert(response.error);
		});
	}
	else if(response.status === 400){
		response.json().then((response)=>{
			alert(response.error);
		});
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
	}
}

async function fetch_commentDelete(id,data){

	const token = sessionStorage.getItem('access_token');
	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(COMMENT_URL+id,{
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
}

async function fetch_commentUpdate(id , data){

	const token = sessionStorage.getItem('access_token');
	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	console.log(data);
	const response = await fetch(COMMENT_URL+id,{
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
}
/*베스트 게시글 가져오기 */
async function fetch_getBestPost(id){
	let url = BEST_POST_URL;
	if(id != 'total')url +=`/${id}`;//total이면 전체 게시글
	const response = await fetch(url);
	if (response.ok) return response.json();
	else alert("HTTP-ERROR: " + response.status);
}
//========검색 기능==========//
async function fetch_search(param,id){
	console.log(param);
	let url = SEARCH_URL;
	if(id != 'total')url +=`/${id}`;//total이면 전체
	url+=`?${param}`;
	const response = await fetch(url);
	if (response.ok) return response;
	else {
		alert("HTTP-ERROR: " + response.status);
		return null;
	}
}

//신고
async function fetch_postReport(id){

	const token = sessionStorage.getItem('access_token');
	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(REPORT_URL+id,{
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		return true;
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
		return response.status;

	}
}

async function fetch_commentReport(id){

	const token = sessionStorage.getItem('access_token');
	if(token === null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const response = await fetch(REPORT_COMMENT_URL+id,{
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		return true;
	}
	else{
		console.log("HTTP-ERROR: " + response.status);
		return response.status;

	}
}

// async function fetch_getauthority(data){
// 	const token = sessionStorage.getItem('access_token');
// 	if(token === null){
// 		alert('로그인을 먼저 해주세요');
// 		return null;
// 	}
// 	const response = await fetch(CHECK_AUTH_URL{
// 		method: 'POST',
// 		headers: {
// 			'Accept': 'application/json',
// 			'Content-Type': 'application/json',
// 			'Authorization': token
// 		}
// 	});
// 	if(response.ok){
// 		return true;
// 	}
// 	else{
// 		console.log("HTTP-ERROR: " + response.status);
// 		return response.status;

// 	}
// }