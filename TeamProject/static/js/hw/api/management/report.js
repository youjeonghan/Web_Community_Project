import * as URL from '/static/js/config.js';
import {
    view_report_list
} from '/static/js/hw/manager.js';

export function get_all_report_post() {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const get_report_post_url = URL.GET_POST_REPORTS;
    fetch(get_report_post_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            view_report_list('post', res);
        })
}

export function get_all_report_comment() {

    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const get_report_comment_url = URL.GET_COMMENT_REPORTS;
    fetch(get_report_comment_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            view_report_list('comment', res);
        })
}

export function add_user_blacklist(user_id, punishment_date, type, id) {

    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    let send_data;
    if (type == 'post') {
        send_data = {
            'user_id': user_id,
            'punishment_date': punishment_date,
            'post_id': id,
            'comment_id': ''
        }
    } else {
        send_data = {
            'user_id': user_id,
            'punishment_date': punishment_date,
            'post_id': '',
            'comment_id': id
        }
    }

    const report_blacklist_url = URL.ADD_USER_BLACKLIST;
    fetch(report_blacklist_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(send_data)
        })
        .then(res => res.json())
        .then((res) => {
            alert('해당 회원이 블랙리스트에 추가되었습니다.');
            document.querySelector('#modal_container').innerHTML = '';
            if (type == 'post') get_all_report_post();
            else get_all_report_comment();
        })
}

export function delete_report(type, id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const send_data = id;

    let report_del_url;
    if (type == 'post') report_del_url = URL.DELETE_POST_REPORT;
    else report_del_url = URL.DELETE_COMMENT_REPORT;

    fetch(report_del_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(send_data)
        })
        .then(res => {
            if (type == 'post') {
                alert('해당 게시글이 삭제되었습니다.');
                get_all_report_post();
            } else {
                alert('해당 댓글이 삭제되었습니다.');
                get_all_report_comment();
            }
        })
}

export function delete_report_in_reportlist(type, id) {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem('access_token') == 0) return;
    const token = sessionStorage.getItem('access_token');

    const send_data = [{
        'id': id
    }]

    let report_list_delete_url;
    if (type == 'post') report_list_delete_url = URL.DELETE_POST_REPORTLIST;
    else report_list_delete_url = URL.DELETE_COMMENT_REPORTLIST;

    fetch(report_list_delete_url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(send_data)
        })
        .then(res => {
            if (type == 'post') {
                alert('해당 게시글 신고가 처리되었습니다.');
                get_all_report_post();
            } else {
                alert('해당 댓글 신고가 처리되었습니다.');
                get_all_report_comment();
            }
        })
}