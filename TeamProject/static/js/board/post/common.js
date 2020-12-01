export function check_token() {
    const token = sessionStorage.getItem('access_token');
    if (token == null) {
        alert('로그인을 먼저 해주세요.');
        return false;
    } else return true;
}

export function check_response_json(response) {
    if(response.ok) {
        
    } else {
        console.log("HTTP-ERROR : " + response.status);
        return response.status;
    }
}

export function check_response_boolean(response) {
    if (response.ok){
        return true;
    } else {
        console.log("HTTP-ERROR : " + response.status);
        return response.status;
    }
}
