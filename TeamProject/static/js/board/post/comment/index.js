import * as RENDER from "./render.js";
import * as EVENT from "./event.js"
import * as FETCH from "./fetch.js"
import * as USR_FETCH from "../../user/fetch.js"

export async function input_comment(post_id) { //post id 불러옴
    try {
        const ele = document.querySelector('.comment_value');
        const userdata = await USR_FETCH.get_user_info();
        const data = {
            'content': ele.value,
            'userid': userdata.id,
        }
        await FETCH.input_comment(post_id, data);
        await load_comment(post_id);
        ele.value = '';
    } catch (error) {
        console.log(error);
    }
}

export async function load_comment(post_id) {
    try {
        const json = await FETCH.get_comment(post_id, 1);
        if (json !== null) await RENDER.post_comment(json);
        else if(json === null) return false;
    } catch (error) {
        console.log(error);
    }
}

export async function update_comment(comment_id) { //comment_id 불러옴
    try {
        await RENDER.post_comment_update(comment_id);
        EVENT.submit_update_comment();
    } catch (error) {
        console.log(error);
    }
}

export async function submit_comment_update(comment_id) { //comment id 불러옴
    try {
        const user_id = await USR_FETCH.get_user_info();
        const target = document.querySelector(`#comment_id_${comment_id}`);
        const text = target.querySelector('textarea').value;
        const data = {
            'comment_id': comment_id,
            'content': text,
            'userid': user_id.id,
        }
        await FETCH.update_comment(user_id.id, data);
        await load_comment(location.hash.split('#')[3]); //댓글 재조회
    } catch (error) {
        console.log(error);
    }
}

export async function delete_comment(comment_id) {
    try {
        const post_id = location.hash.split('#')[3];
        await FETCH.delete_comment(post_id, {
            'comment_id': comment_id
        });
        await load_comment(location.hash.split('#')[3]);
    } catch (error) {
        console.log(error);
    }
}

export function is_comment_exist(currentUserId, comments) {
    const found = comments.find(comment => comment.userid === currentUserId);
    return found;
}