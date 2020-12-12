import * as EVENT from "./event.js"
import * as FETCH_USR from "../user/fetch.js"
import * as RENDER from "./render.js"
import * as FETCH from "./fetch.js"
import * as COMMENT_EVENT from "./comment/event.js"
import * as COMMENT_INDEX from "./comment/index.js"
import * as COMMENT_FETCH from "./comment/fetch.js"
import * as EVENT_AUTH from "../../Auth/event.js"
import * as FETCH_LIST from "../list/fetch.js"

export function input_post() {
    RENDER.input_post_window();
    EVENT.submit_post_input();
    EVENT.add_img_drag_drop();
}

export async function submit_post() {
    try {
        const input_subject = document.querySelector('.input__subject');
        const input_article = document.querySelector('.input__article');
        const user_data = await FETCH_USR.get_user_info();
        const board = await FETCH_LIST.get_Board(location.hash.split('#')[1]);
        let object = {
            'userid': user_data.id,
            'subject': input_subject.value,
            'content': input_article.value,
            'board_name': board.board_name
        }
        const post_id = await FETCH.insert_post(object);
        return post_id;
    } catch (error) {
        console.log(error);
    }
}

export async function load_post(hash_value) {
    try {
        const json = await FETCH.get_post(hash_value[3]); 
        const user_data = await FETCH_USR.get_user_info();
        await RENDER.post(json, user_data.id); 
        await COMMENT_INDEX.load_comment(json.id);
        EVENT.update_post();
        EVENT.add_post_report();
        EVENT.add_post_likes();
        COMMENT_EVENT.submit_comment();
        EVENT_AUTH.move_mainpage();
    } catch (error) {
        console.log(error);
    }
}

export async function update_post(id) {
    const json = await FETCH.get_post(id);
    await RENDER.post_update(json);
    EVENT.submit_update_post();
    EVENT.add_upload_file_in_post_input();
    EVENT.add_img_drag_drop();
    RENDER.current_img_preview(json.post_img_filename);
}

export async function submit_update_post() {
    const event_id = event.currentTarget.id.split('__');
    const update_subject = document.querySelector('.update_subject');
    const update_article = document.querySelector('.update_article');
    const hash_value = location.hash.split('#');
    const token = check_token();
    let data = {
        'subject': update_subject.value,
        'content': update_article.value,
        'id': event_id[1]
    };

    if(token) {
        const image_data = INPUT_DATA_FILE.return_files(); 
        await FETCH.update_post(event_id[1], data);
        if (image_data !== null) await FETCH.upload_image(event_id[1], image_data);
    }
    load_post(hash_value);
}

export async function delete_post(id) {
    try {
        const flag = await FETCH.delete_post(id);
        if (flag) {
            alert("삭제되었습니다!");
            EVENT_AUTH.move_mainpage();
        }
    } catch (error) {
        console.log(error);

    }
}

export const add_likes = async (object, id) => {
    try {
        let check = false;
        const object_map = {
            'post': async function () {
                check = await FETCH.insert_post_likes(id);
            },
            'comment': async function () {
                check = await COMMENT_FETCH.insert_comment_likes(id);
            }
        }
        await object_map[object]();
        return check;
    } catch (error) {
        console.log(error);
    }
}

export const add_report = async (object, id) => {
    try {
        let check = false;
        const object_map = {
            'post': async function () {
                check = await FETCH.insert_post_report(id);
            },
            'comment': async function () {
                check = await COMMENT_FETCH.insert_comment_report(id);
            }
        }
        await object_map[object]();
        return check;
    } catch (error) {
        console.log(error);
    }
}

export const img_file_hub = class {
    constructor() {
        this.data = null;
        this.maxnum = 5;
        this.delete_img = null;
    }

    append_file(files) {
        if (this.data === null) {
            if (files.length > 5) {
                alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`);
                return;
            }
            this.data = files;
        } else {
            if (this.data.length + files.length > this.maxnum) {
                alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`);
                return;
            }
            this.data = [...this.data, ...files];
        }
        RENDER.upload_img_preview(this.data);

    }

    delete_file(id) {
        if (this.data.length == 1) this.data = null;
        else {
            let new_data = [];
            let cnt = 0;
            for (let i = 0; i < this.data.length; i++) {
                if (i != id) new_data[cnt++] = this.data[i];
            }
            this.data = new_data;
        }

        RENDER.upload_img_preview(this.data);
    }

    delete_current_file(filename) {
        if (this.delete_img === null) this.delete_img = [filename];
        else {
            this.delete_img = [...this.delete_img, filename];
        }
    }

    return_files() {
        const form = new FormData();
        if (this.data !== null) {
            for (const value of this.data) {
                form.append('file', value);
            }
        }
        if (this.delete_img != null) {
            for (const value of this.delete_img) {
                form.append('delete_img', value);
            }
        }

        return form;
    }

    reset_files() {
        this.data = null;
        this.delete_img = null;
    }

}

export const INPUT_DATA_FILE = new img_file_hub();