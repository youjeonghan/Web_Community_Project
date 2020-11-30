import * as EVENT from "./event.js"
import * as FETCH from "./fetch.js"
import * as RENDER from "./render.js"
import * as MAIN from "../main.js"
import * as COMMENT_EVENT from "../comment/event.js"
import * as COMMENT_INDEX from "../comment/index.js"
import * as EVENT_AUTH from "../../Auth/event.js"

// crud js
export function input_post() {
    // REND.render_input(); //입력창 랜더링
    RENDER.input_post_window();
    // EVENT.handle_submitPost(); //업로드 submit 이벤트리스너
    EVENT.submit_post_input();
    // EVENT.handle_drop(); //drag & drop 이벤트 리스너
    EVENT.add_img_drag_drop();
}

export async function submit_post() {
    try {
        const input_subject = document.querySelector('.input__subject');
        const input_content = document.querySelector('.input__article');
        const user_data = await FETCH.fetch_userinfo(); // 현재 로그인한 유저 정보 불러오기
        const board = await FETCH.fetch_getBoard(location.hash.split('#')[1]); //현재 보드 정보 불러옴

        //위 변수들로 받아온 정보들을 하나의 object로 묶어서 복사함
        let object = {
            'userid': user_data.id,
            'subject': input_subject.value,
            'content': input_content.value,
            'board_name': board.board_name
        }
        /*묶은정보를 서버로보내고 만들어진 post정보를 반환
        (post의 id는 서버에서 만들어지면서 매겨지기때문에 다시받아봐야 알수있음)*/
        const post_id = await FETCH.insert_post(object);
        return post_id;
    } catch (error) {
        console.log(error);
    }
}

export async function load_post(hashValue) {
    try {
        const json = await FETCH.fetch_getPostInfo(hashValue[3]); //게시글id로 게시글하나 조회
        const user = await FETCH.fetch_userinfo(); //user id로 유저정보 조회
        await RENDER.post(json, user.id); //post info 그려줌
        await COMMENT_INDEX.load_comment(json.id); //댓글리스트 불러옴
        EVENT.add_post_report();
        EVENT.add_post_likes();
        COMMENT_EVENT.submit_comment();
        EVENT_AUTH.move_mainpage();
    } catch (error) {
        console.log(error);
    }
}

export async function update_post(id) { //수정창을 만들어주는 함수
    const json = await FETCH.get_post(id);
    await RENDER.post_update(json);
    EVENT.add_upload_file_in_post_input();
    EVENT.add_img_drag_drop();
    RENDER.current_img_preview(json.post_img_filename);
}

export async function submit_update_post() { //수정창 제출 함수
    const event_id = event.currentTarget.id.split('__');
    const update_subject = document.querySelector('.update_subject');
    const update_article = document.querySelector('.update_article');
    let data = {
        'subject': update_subject.value,
        'content': update_article.value,
        'id': event_id[1]
    };
    const token = sessionStorage.getItem('access_token');
    if (token === null) alert('로그인을 먼저 해주세요');
    else {
        const image_data = INPUT_DATA_FILE.return_files(); //저장한 이미지 데이터 반환
        // await FETCH.fetch_update(event_id[1], data); //텍스트업로드
        // if (image_data !== null) await FETCH.fetch_upload(event_id[1], image_data); // 이미지 업로드
        await FETCH.update_post(event_id[1], data); //텍스트업로드
        if (image_data !== null) await FETCH.upload_image(event_id[1], image_data);
    }

    const hashValue = location.hash.split('#');
    load_post(hashValue); //해당 게시글 재조회
}

export async function delete_post(id) {
    try {
        const flag = await FETCH.delete_post(id);
        if (flag) {
            alert("삭제되었습니다!");
            EVENT_AUTH.move_mainpage();
            // 얘는 어디로 갔을까??
        }
    } catch (error) {
        console.log(error);

    }
}

// export async function input_comment(post_id) { //post id 불러옴
//     try {
//         const ele = document.querySelector('.comment_value');
//         const userdata = await FETCH.fetch_userinfo();
//         const data = {
//             'content': ele.value,
//             'userid': userdata.id,
//         }
//         await FETCH.input_comment(post_id, data);
//         await load_comment(post_id);
//         ele.value = '';
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function load_comment(post_id) {
//     try {
//         const json = await FETCH.get_comment(post_id, 1);
//         // if (json != null) await REND.render_comment(json);
//         if (json !== null) await RENDER.post_comment(json);
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function update_comment(comment_id) { //comment_id 불러옴
//     try {
//         // await REND.render_commentUpdate(comment_id);
//         await RENDER.post_comment_update(comment_id);
//         // EVENT.handle_commnetUpdateSubmit();
//         COMMENT_EVENT.update_comment();
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function submit_comment_update(comment_id) { //comment id 불러옴
//     try {
//         const userid = await FETCH.fetch_userinfo();
//         //user관련 fetch
//         const target = document.querySelector(`#comment_id_${comment_id}`);
//         const text = target.querySelector('textarea').value;
//         const data = {
//             'comment_id': comment_id,
//             'content': text,
//             'userid': userid.id,
//         }
//         // await FETCH.fetch_commentUpdate(userid.id, data); //수정된 정보 전송
//         await FETCH.update_comment(userid.id, data);
//         await load_comment(location.hash.split('#')[3]); //댓글 재조회
//     } catch (error) {
//         console.log(error);
//     }
// }

// export async function delete_comment(comment_id) {
//     try {
//         const post_id = location.hash.split('#')[3];
//         await FETCH.delete_comment(post_id, {
//             'comment_id': comment_id
//         });
//         await load_comment(location.hash.split('#')[3]);
//     } catch (error) {
//         console.log(error);
//     }
// }


export const add_likes = async (object, id) => {
    try {
        let check = false;
        const object_map = {
            'post': async function () {
                // check = await FETCH.fetch_postLikes(id);
                check = await FETCH.insert_post_likes(id);
            },
            'comment': async function () {
                // check = await FETCH.fetch_commentLikes(id);
                check = await FETCH.insert_comment_likes(id);
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
                // check = await FETCH.fetch_postReport(id);
                check = await FETCH.insert_post_report(id);
            },
            'comment': async function () {
                check = await FETCH.insert_comment_report(id);
            }
        }
        await object_map[object]();
        return check;
    } catch (error) {
        console.log(error);
    }
}

export const file_dataHub = class {
    constructor() { //생성자 함수
        this.data = null; //업로드할 파일 데이터
        this.maxnum = 5; //업로드 최대개수
        this.delete_img = null; //삭제할 파일 이름
    }

    append_file(files) { //이미지파일 추가
        if (this.data === null) {
            if (files.length > 5) {
                alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`); //이미지 개수 초과 등록시
                return;
            }
            this.data = files;
        } else {
            if (this.data.length + files.length > this.maxnum) {
                alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`);
                return;
            }
            this.data = [...this.data, ...files]; //data에 파일연결 spread syntax
        }
        // REND.render_preview(this.data);
        RENDER.upload_img_preview(this.data);

    }

    delete_file(id) { //이미지 파일삭제
        if (this.data.length == 1) this.data = null;
        else {
            let new_data = [];
            let cnt = 0;
            for (let i = 0; i < this.data.length; i++) {
                if (i != id) new_data[cnt++] = this.data[i];
            }
            this.data = new_data;
        }
        // REND.render_preview(this.data);
        RENDER.upload_img_preview(this.data);
    }

    delete_currentFile(filename) { //삭제할 기존이미지 파일이름
        if (this.delete_img === null) this.delete_img = [filename];
        else {
            this.delete_img = [...this.delete_img, filename];
        }
        console.log(this.delete_img)
    }

    return_files() { //이미지 파일데이터를 form데이터에 담아서 반환
        if (this.data !== null && this.delete_img != null) return null;
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

    reset_files() { //데이터 초기화
        this.data = null;
        this.delete_img = null;
    }

}

export const INPUT_DATA_FILE = new file_dataHub();