import * as URL from '/static/js/config.js';
import {
    insert_user_list
} from '/static/js/controllers/management/user.js';
import * as FETCH from '/static/js/controllers/fetch.js';

export function get_all_user_info() {
    
    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

    const get_all_user_url = URL.GET_ALL_USER_INFO;

    fetch(get_all_user_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            insert_user_list(res);
        })
        .catch((err) => FETCH.handle_error(err));
}

export function get_search_user(user_search_input) {
    
    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

    const user_search_url = URL.GET_SEARCH_USER + user_search_input.value;
    fetch(user_search_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            insert_user_list(res);
        })
        .catch((err) => FETCH.handle_error(err));
}

export function modify_user_nickname(user_id) {

    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

    const send_data = new FormData();

    const user_nickname = document.querySelector('.user_modal_input');
    send_data.append('nickname', user_nickname.value);

    const user_modify_url = URL.MODIFY_USER_NICKNAME + user_id;
    fetch(user_modify_url, {
            method: 'DELETE',
            body: send_data,
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (res.result === 'success') {
                alert('회원 정보 수정 완료');
                document.querySelector('#modal_container').innerHTML = '';
                get_all_user_info();
            } else if (res.error == '이미 있는 닉네임입니다.') {
                alert('이미 존재하는 닉네임입니다.');
                user_nickname.focus();
            }
        })
        .catch((err) => FETCH.handle_error(err));
}

export function delete_user(user_id) {
    
    const token = sessionStorage.getItem('access_token');
    if(!FETCH.check_token(token)) return;

    const user_del_url = URL.DELETE_USER + user_id;
    fetch(user_del_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.result === 'success') {
                alert('회원이 삭제되었습니다.');
                get_all_user_info();
            }
        })
        .catch((err) => FETCH.handle_error(err));
}