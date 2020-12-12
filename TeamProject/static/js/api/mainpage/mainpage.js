import * as URL from '/static/js/config.js';

import {best_post_init} from '/static/js/controllers/mainpage/bestpost.js';
import {best_board_init} from '/static/js/controllers/mainpage/bestboard.js';
import {category_container_init, boards_in_category_pagination} from '/static/js/controllers/mainpage/category.js';
import * as FETCH from '/static/js/controllers/fetch.js';

export function get_best_post() {
    const get_bestpost_url = URL.BEST_POST;
    fetch(get_bestpost_url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((res) => {
            best_post_init(res);
        })
        .catch((err) => FETCH.handle_error(err));
}

export function get_best_board() {
    const get_bestboard_url = URL.GET_BEST_BOARD;
    fetch(get_bestboard_url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((res) => {
            best_board_init(res);
        })
        .catch((err) => FETCH.handle_error(err));
}

export function get_all_category() {
    const get_category_url = URL.GET_ALL_CATEGORY;
    fetch(get_category_url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((res) => {
            category_container_init(res);
        })
        .catch((err) => FETCH.handle_error(err));
}

export function get_all_board_in_category(category_id) {
    const get_board_url = URL.GET_ALL_BOARD_IN_CATEGORY + category_id;
    fetch(get_board_url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((res) => {
            boards_in_category_pagination(res);
        })
        .catch((err) => FETCH.handle_error(err));
}