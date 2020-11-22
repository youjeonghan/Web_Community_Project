import * as URL from '/static/js/config.js';
import {
    insert_user_list,
} from '/static/js/manager.js';

export function get_all_user_info() {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;

    const token = sessionStorage.getItem('access_token');

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
}

export function get_search_user(user_search_input) {
    // 로그인 토근 여부 확인
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

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
}

export function modify_user_nickname(user_id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

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
            if (res['result'] == 'success') {
                alert('회원 정보 수정 완료');
                // 수정 모달 창을 없애고, 모든 유저 정보를 다시 불러온다(유사 새로고침을 위함).
                document.querySelector('#modal_container').innerHTML = '';
                get_all_user_info();
            } else if (res['error'] == '이미 있는 닉네임입니다.') {
                alert('이미 존재하는 닉네임입니다.');
                user_nickname.focus();
            }
        })
}

export function delete_user(user_id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;

    const token = sessionStorage.getItem('access_token');
    const user_del_url = URL.DELETE_USER + user_id;
    fetch(user_del_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            if (res.ok) {
                alert('회원이 삭제되었습니다.');
                get_all_user_info();
            }
        })
}