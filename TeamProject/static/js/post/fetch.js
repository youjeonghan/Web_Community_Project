const POST_URL = 'http://127.0.0.1:5000/api/post';
const FILE_UPLOAD_URL = 'http://127.0.0.1:5000/api/postupload';
const USER_INFO_URL = 'http://127.0.0.1:5000/api/user_info';

//post 조회  (get)
async function fetch_getPost(id,page){
	const data = {
		//==== location.hash = post#board_id#page
		'board_id' : id,
		'get' : page//page넘버 받아오는 함수 
	}
	const response = await fetch(POST_URL,{
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(data)
	});
	if(response.ok){
		return response.json();
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
	return response.json();
}


///========Post info fetch===========미완 //
async function fetch_getPostInfo(board_id){
	const response = await fetch(POST_URL);
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
	const response = await fetch(POST_URL,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(data)
	});
	if(response.ok){
			return; //response.json();
		}
		else if(response.status === 400){
			alert("제목을 입력해주세요");
		}
		else{
			alert("HTTP-ERROR: " + response.status);
		}
	}

//post 삭제//
async function fetch_delete(url){
	const response = await fetch(url,{
		method: 'DELETE',
	})
	if(response.ok){
		return alert("삭제되었습니다!");
	}
	else{
		alert("HTTP-ERROR: " + response.status);
	}
}

//post 수정 //
async function fetch_modify(id , data){
	const url = POST_URL + '/' + id;
	const response = await fetch(url,{
		method: 'PUT',
		headers: { 
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(data)
	});

	if(response.ok){
		return load_postinfo(id);

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
	return response.json();
}