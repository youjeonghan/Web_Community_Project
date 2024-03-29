import * as URL from '/static/js/config.js';
import {
    category_init,
    boards_in_category_pagination,
    category_container_init,
    board_container_init
} from '/static/js/controllers/management/category.js';
import * as FETCH from '/static/js/controllers/fetch.js';

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
        .catch((err) => FETCH.handle_error(err));
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
            boards_in_category_pagination(res, category_id);
        })
        .catch((err) => FETCH.handle_error(err));
}

export function modify_board_image(board_id, category_id) {

    const token = sessionStorage.getItem('access_token');
    if (!FETCH.check_token(token)) return;

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
            if (res.result === 'modify_success') {
                alert('게시판 사진 수정 완료');
                get_all_board_in_category(category_id);
                document.querySelector('#modal_container').innerHTML = '';
            }
        })
        .catch((err) => FETCH.handle_error(err));
}

export function delete_category(category_id) {

    const token = sessionStorage.getItem('access_token');
    if (!FETCH.check_token(token)) return;

    const del_category_url = URL.DELETE_CATEGORY + category_id;
    fetch(del_category_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if(res.result === 'delete_success'){
                alert('해당 카테고리가 삭제되었습니다.');
                category_container_init();
                get_all_category();
            }
        })
        .catch((err) => FETCH.handle_error(err));
}

export function delete_board(board_id, category_id) {

    const token = sessionStorage.getItem('access_token');
    if (!FETCH.check_token(token)) return;

    const del_board_url = URL.DELETE_BOARD + board_id;
    fetch(del_board_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (res.result === 'delete_success') {
                alert('게시판이 삭제되었습니다.');
                board_container_init();
                get_all_board_in_category(category_id);
            }
        })
        .catch((err) => FETCH.handle_error(err));
}

export function add_category(category_name) {

    const token = sessionStorage.getItem('access_token');
    if (!FETCH.check_token(token)) return;

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
            if (res.error == '이미 있는 카테고리입니다.') {
                alert('이미 존재하는 카테고리입니다.');
            } else {
                alert('카테고리[' + category_name + ']가 추가되었습니다.');
                category_container_init();
                category_init(res);
            }
        })
        .catch((err) => FETCH.handle_error(err));
}

export function add_board(category_id) {

    const token = sessionStorage.getItem('access_token');
    if (!FETCH.check_token(token)) return;

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
            if (res.result == 'success') {
                alert('게시판[' + board_name + ']이 추가되었습니다.');
                board_container_init();
                get_all_board_in_category(category_id);
            }
        })
        .catch((err) => FETCH.handle_error(err));
}