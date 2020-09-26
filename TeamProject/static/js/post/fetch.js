
const POST_URL = 'http://127.0.0.1:5000/api/post';
const FILE_UPLOAD_URL = 'http://127.0.0.1:5000/api/postupload';
const USER_INFO_URL = 'http://127.0.0.1:5000/api/user_info';
const BOARD_URL = 'http://127.0.0.1:5000/api/board_info';
const COMMENT_URL = 'http://127.0.0.1:5000/api/comment/';
const POSTLIKES_URL = 'http://127.0.0.1:5000/api/postlike/';
const COMMENTLIKES_URL = 'http://127.0.0.1:5000/api/commentlike/';
const BEST_POST_URL = 'http://127.0.0.1:5000/api/bestpost/';
const USER_SPECIFIC_URL = 'http://127.0.0.1:5000/api/user_specific_info/';
const SEARCH_URL = 'http://127.0.0.1:5000/api/search';
const REPORT_URL ='http://127.0.0.1:5000/api/report_post/';

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
		return response.json();
	}

	else{
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}
/*=============추가페이지 로드 post get====================*/
async function fetch_getNewPost(id,page){
	const param = `?board_id=${id}&page=${page}`; //url뒤 변수부분
	//get 요청 url 방식 /api/post?board_id=1&page=1 (id,page가 1일때 예시)
	const response = await fetch(POST_URL+param);
	if(response.ok){

		return response.json();
	}

	else{
		return null;
	}

}

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
	if(response.ok){
		return response.json();
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}

//////////post 입력//////
async function fetch_insert(data){
	console.log('입력');
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
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
	else if(response.status === 400){
		alert(data);
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
}

//post 삭제//
async function fetch_delete(id){
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
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
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
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
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
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
		alert("HTTP-ERROR: " + response.status);

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
//   	}
//   });
// }


async function fetch_upload(id,files){//파일업로드
	const data = new FormData();

	for (const value of files){
    	data.append('file',value); //data에 파일연결
    }

    if(sessionStorage==null){
    	alert('로그인을 먼저 해주세요');
    	return null;
    }
    const token = sessionStorage.getItem('access_token');
    const response = await fetch(FILE_UPLOAD_URL + '/' + id,{
    	method: 'POST',
    	headers: {
    		'Authorization': token
    	},
    	body: data
    });
    if(response.ok){
    	return alert("파일업로드 완료!");
    }
    else if(response.status == 400){ //파일을 고르지 않았을 경우
    	alert("HTTP-ERROR: " + response.status);
    }
}


async function fetch_postLikes(id){
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
	const response = await fetch(POSTLIKES_URL+id,{
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		return response.status;
	}
	else{
		alert("HTTP-ERROR: " + response.status);
		return response.status;
	}
}

async function fetch_commentLikes(id){
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
	const response = await fetch(COMMENTLIKES_URL+id,{
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
		alert("HTTP-ERROR: " + response.status);
		return false;

	}
}

/*=============댓글 CRUD================*/
async function fetch_commentInput(id , data){
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
	const response = await fetch(COMMENT_URL+id,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': token
		},
		body: JSON.stringify(data)
	});
}

async function fetch_commentDelete(id,data){
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
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
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
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
	const response = await fetch(BEST_POST_URL+id);
	if (response.ok) return response.json();
	else alert("HTTP-ERROR: " + response.status);
}
//========검색 기능==========//
async function fetch_search(param,id){
	let url = SEARCH_URL;
	if(id != 'total')url +=`/${id}`;
	url+=param;
	const response = await fetch(url);
	if (response.ok) return response.json();
	else alert("HTTP-ERROR: " + response.status);
}

//신고
async function fetch_report(id){
	if(sessionStorage==null){
		alert('로그인을 먼저 해주세요');
		return null;
	}
	const token = sessionStorage.getItem('access_token');
	const response = await fetch(REPORT_URL+id,{
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	});
	if(response.ok){
		alert('신고가 접수되었습니다.')
		return true;
	}
	else{
		alert("HTTP-ERROR: " + response.status);
		return false;

	}
}
