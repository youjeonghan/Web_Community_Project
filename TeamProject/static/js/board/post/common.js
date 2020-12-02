export function check_token() {
    const token = sessionStorage.getItem('access_token');
    if (token == null) {
        alert('로그인을 먼저 해주세요.');
        return false;
    } else return true;
}

export async function check_response_json(response) {
    if(response.ok) {
        return response.json();
    } else {
        await alert("HTTP-ERROR: "+response.error);
        return null;
    }
}

export async function check_response_boolean(response) {
    if (response.ok){
        return true;
    } else {
        await alert(response.error);
        return null;
    }
}

export async function check_report_likes(response) {
    if (response.ok) {
        alert('추천 되었습니다.');
        return true;
    } else {
        console.log("HTTP-ERROR " + response.status);
        return response.status;
    }
}