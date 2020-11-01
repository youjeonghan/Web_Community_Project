import * as URL from '/static/js/config.js'

export function get_category_FetchAPI() {
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

export function get_board_FetchAPI(category_id) {
    const get_board_url = URL.GET_BOARDS_IN_CATEGORY + category_id;
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