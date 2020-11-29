import * as URL from '/static/js/config.js';
import {
    category_init,
    board_in_category_pagination,
    category_container_init,
    board_container_init
} from '/static/js/controllers/management/category.js';

export function get_all_category() {
    const get_category_url = URL.GET_ALL_CATEGORY;
    fetch(get_category_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((res) => {
            category_init(res);
        })
}

export function get_all_board_in_category(category_id) {
    const get_board_url = URL.GET_ALL_BOARD_IN_CATEGORY + category_id;
    fetch(get_board_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((res) => {
            board_in_category_pagination(res, category_id);
        })
}

export function modify_board_image(board_id, category_id) {
    // 로그인 토근 여부 확인
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const send_data = new FormData();

    const board_image = document.querySelector('.board_modify_image');
    if (board_image.value == '') send_data.append('profile_img', '');
    else send_data.append('board_image', board_image.files[0]);

    const board_modify_url = URL.MODIFY_BOARD_IMAGE + board_id;
    fetch(board_modify_url, {
            method: 'POST',
            body: send_data,
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (res['result'] == 'modify_success') {
                alert('게시판 사진 수정 완료');
                get_all_board_in_category(category_id);
                document.querySelector('#modal_container').innerHTML = '';
            }
        })
}

export function delete_category(category_id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const del_category_url = URL.DELETE_CATEGORY + category_id;
    fetch(del_category_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((res) => {
            alert('해당 카테고리가 삭제되었습니다.');
            category_container_init();
            get_all_category();
        })
}

export function delete_board(board_id, category_id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const del_board_url = URL.DELETE_BOARD + board_id;
    fetch(del_board_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((res) => {
            alert('게시판이 삭제되었습니다.');
            board_container_init();
            get_all_board_in_category(category_id);
        })
}

export function add_category(category_name) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const send_data = {
        'category_name': category_name
    }
    const insert_category_url = URL.ADD_CATEGORY;
    fetch(insert_category_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(send_data)
        })
        .then(res => res.json())
        .then((res) => {
            if (res['error'] == '이미 있는 카테고리입니다.') {
                alert('이미 존재하는 카테고리입니다.');
            } else {
                alert('카테고리[' + category_name + ']가 추가되었습니다.');
                category_container_init();
                get_all_category();
            }
        })
}

export function add_board(category_id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const board_name = document.querySelector('.board_insert_name').value;
    const board_description = document.querySelector('.board_insert_description').value;
    const board_image = document.querySelector('.board_insert_image');

    let send_data = new FormData();
    send_data.append('board_name', board_name);
    send_data.append('category_id', category_id);
    send_data.append('description', board_description);

    if (!board_image.value) send_data.append('board_image', '');
    else send_data.append('board_image', board_image.files[0]);

    const insert_board_url = URL.ADD_BOARD;
    fetch(insert_board_url, {
            method: 'POST',
            body: send_data,
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (res['result'] == 'success') {
                alert('게시판[' + board_name + ']이 추가되었습니다.');
                board_container_init();
                get_all_board_in_category(category_id);
            }
        })
}