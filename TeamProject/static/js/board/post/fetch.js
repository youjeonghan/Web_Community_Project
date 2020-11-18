import * as INDEX from "./index.js"
import * as EVENT from "./event.js"
import * as RENDER from "./render.js"
import * as MAIN from "../main.js"

export async function get_post(post_id) {
    const response = await fetch(LINK.POST + `/${post_id}`);
    if (response.ok) {
        return response.json();
    } else {
        alert("HTTP-ERROR: " + response.status);
    }
    return response.json();
}

export async function get_comment(post_id, page) {
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

export async function insert_post(data) {
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

export async function delete_post(id) {

    const token = sessionStorage.getItem('access_token');
    if (token === null) {
        alert('로그인을 먼저 해주세요');
        return null;
    }
    const response = await fetch(LINK.POST + '/' + `${id}`, {
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
    if (response.ok) {
        return response.json();
    } else {
        alert("HTTP-ERROR: " + response.status);
    }
}

export async function upload_image(id, data) {
    const token = sessionStorage.getItem('access_token');
    const response = await fetch(LINK.FILE_UPLOAD + '/' + id, {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: data
    });
    if (response.ok) {
        INDEX.INPUT_DATA_FILE.reset_files();
        return true;
    } else if (response.status == 400) { //파일을 고르지 않았을 경우
        INDEX.INPUT_DATA_FILE.reset_files();
        console.log("HTTP-ERROR: " + response.status);
    }
}

export async function insert_post_likes(id) {
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

export async function insert_comment_likes(id) {
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

export async function delete_comment(id, data) {

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

export async function update_comment(id, data) {

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