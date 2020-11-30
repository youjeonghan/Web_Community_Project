import * as URL from '/static/js/config.js';
import {
    user_info_view,
    modify_user_info_init
} from '/static/js/controllers/mypage/userinfo.js';
import * as FETCH from '/static/js/controllers/fetch.js';

export function get_user_info(func_name) {
    
    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

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
        .catch((err) => FETCH.handle_error(err));
}

export function modify_user_info(id) {

    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

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
            } else if (res['error'] == 'already exist') {
                alert('이미 존재하는 ID 입니다.');
            } else if (res['error'] == '이미 있는 닉네임입니다.') {
                alert('이미 존재하는 닉네임입니다.');
                user_nickname.focus();
            }
        })
        .catch((err) => FETCH.handle_error(err));
}

export function delete_user(id){

    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

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
        })
        .catch((err) => FETCH.handle_error(err));
}