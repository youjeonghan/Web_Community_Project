import * as LINK from "../../config.js"

export function save_about_search_data(search_type, input_data) {
    const data = { //검색한 내용에대한 데이터
        'searchType': search_type.querySelector('select').value,
        'text': `${input_data.value}`
    }
    return data;
}
export async function get_best_post_information(id) {
    let url = LINK.BEST_POST;
    if (id != 'total') url += `/${id}`;
    const response = await fetch(url);
    if (response.ok) return response.json();
    else alert("HTTP-ERROR: " + response.status);
}
export async function get_search_information(param, id) {
    let url = LINK.SEARCH;
    if (id != 'total') url += `/${id}`;
    url += `?${param}`;
    const response = await fetch(url);
    if (response.ok) return response;
    else {
        alert("HTTP-ERROR: " + response.status);
        return null;
    }
}