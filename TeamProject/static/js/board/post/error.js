export function check_token() {
    const token = sessionStorage.getItem('access_token');
    if (token == null) {
        alert('로그인을 먼저 해주세요.');
        return false;
    } else return true;
}

export async function check_response_json(response) {
    if(response.status===200) {
        return response.json();
    } else if(response.status===204){
        return null;
    } else if(response.ok) {
        return response.json();
    }
       else await alert("HTTP-ERROR : " + response.error);
    return response.json();
}

export async function check_response_boolean(response) {
    if (response.ok){
        return true;
    } else {
        return response.status;
    }
}

export async function check_report_likes(response) {
    if (response.ok) {
        return true;
    } else {
        return response.status;
    }
}