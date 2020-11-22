import * as URL from '/static/js/config.js';
import {
    user_info_view,
    modify_user_info_init
} from '/static/js/mypage.js';

export function get_user_info(func_name) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const user_info_url = URL.USER_INFO;
    fetch(user_info_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (func_name == 'view') user_info_view(res);
            else if (func_name == 'modify') modify_user_info_init(res);
        })
}

export function modify_user_info(id) {
    // 로그인 토근 여부 확인
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const send_data = new FormData();

    const user_name = document.querySelector('#user_info_modify_name').value;
    const user_nickname = document.querySelector('#user_info_modify_nickname');
    const user_email = document.querySelector('#user_info_modify_email').value;
    const user_birth = document.querySelector('#user_info_modify_birth').value;
    const user_image = document.querySelector('#user_info_modify_image');

    send_data.append('username', user_name);
    send_data.append('nickname', user_nickname.value);
    send_data.append('email', user_email);
    send_data.append('birth', user_birth);
    if (user_image.value == '') send_data.append('profile_img', '');
    else send_data.append('profile_img', user_image.files[0]);

    const user_modify_url = URL.MODIFY_OR_DELETE_USER_INFO + id;
    fetch(user_modify_url, {
            method: 'PUT',
            body: send_data,
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (res['result'] == 'success') {
                alert('회원 정보 수정 완료');
                document.querySelector('#signup_container').innerHTML = '';
                get_user_info('view');
                // get_userinfo_FetchAPI();
                // 이거 auth.js 에 있는 api 라서 따로 처리해야됌
            } else if (res['error'] == 'already exist') {
                alert('이미 존재하는 ID 입니다.');
            } else if (res['error'] == '이미 있는 닉네임입니다.') {
                alert('이미 존재하는 닉네임입니다.');
                user_nickname.focus();
            }
        })
}

export function delete_user(id){
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const user_delete_url = URL.MODIFY_OR_DELETE_USER_INFO + id;
    fetch(user_delete_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((res) => {
            alert('회원 탈퇴 완료');
            sessionStorage.removeItem('access_token');
            location.href = '/';
        });
}