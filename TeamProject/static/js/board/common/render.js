import * as MAIN from "./main.js"
import * as EVENT from "./event.js"
import * as FETCH_USR from "../user/fetch.js"
import * as REND_LIST from "../list/render.js"
import * as FETCH_LIST from "../list/fetch.js"

/*============best 게시물 랜더링 ==========*/
export const best_post = async (data) => { //render_bestPost()
    const ele = document.querySelector('.side_bestContentsList');
    ele.innerHTML = '';
    for (const value of data) {
        const board = await FETCH_LIST.get_Board(value.board_id);
        const user_data = await FETCH_USR.get_user_data(value.userid);
        const div = best_post_item(value, user_data, board);
        ele.appendChild(div);
    }
}
//create_html_object(tag,A,B,C):tag 생성기 , tag = tag명 A = 속성 ,B = 속성에 들어갈 내용 , C= textNode

//best 게시물 각하나씩 만들어주는 함수
export const best_post_item = (value, user_data, board) => { //render_bestPostItem() , export 없어도되나? (다른 Js에서는 안쓰임)
    const div = MAIN.create_html_object('div', ['class', 'id', 'onclick'], ['side_bestContentsItem', `side_bestid__${board.id}__${value.id}`, 'handle_postinfo();']);
    const span = MAIN.create_html_object('span', [], []);
    const fire = MAIN.create_html_object('i', ['class'], ['fas fa-fire']);

    span.appendChild(fire);

    const img = MAIN.create_html_object('img', ['src'], ['http://127.0.0.1:5000/static/img/profile_img/' + user_data.profile_img]);
    const p = MAIN.create_html_object('p', [], [], value.subject);

    const span_like = MAIN.create_html_object('span', ['class'], ['best_like']);
    const icon_like = MAIN.create_html_object('i', ['class'], ["far fa-thumbs-up"]);
    const add_likeText = document.createTextNode(`${value.like_num}`);

    span_like.appendChild(icon_like);
    span_like.appendChild(add_likeText);

    const span_comment = MAIN.create_html_object('span', ['class'], ["best_comment"]);
    const icon_comment = MAIN.create_html_object('i', ['class'], ["far fa-comment"]);
    const add_CommentText = document.createTextNode(`${value.comment_num}`);

    span_comment.appendChild(icon_comment);
    span_comment.appendChild(add_CommentText);

    div.appendChild(span);
    div.appendChild(p);
    div.appendChild(img);
    div.appendChild(span_like);
    div.appendChild(span_comment);

    return div;
}

export async function title_and_side_setting(hash_value) { //render_board()
    try {
        if (hash_value[1] == 'total') {
            document.querySelector('.post_title').querySelector('h1').textContent = `메인으로`;
            document.querySelector('.side_search').style.cssText = 'display : none';
        } else {
            const board = await FETCH_LIST.get_Board(hash_value[1]);
            document.querySelector('.post_title').querySelector('h1').textContent = board.board_name;
            document.querySelector('.side_search').style.cssText = 'display : inherit';
        }
        EVENT.attach_event_when_title_click();
    } catch (error) {
        console.log(error);
    }
}

export async function search_result(hash_value, data) {
    REND_LIST.init_post();
    const code = data.status;
    const input_data = decodeURI(hash_value[3].split('&')[1].split('=')[1]);

    let board;
    await MAIN.loading_board_information(hash_value).then((result) => {
        board = result;
    })
    let div;
    if (code == 204) {
        if (hash_value[1] === 'total') title_and_side_setting(hash_value);
        div = MAIN.create_html_object('div', ['class'], ['search_result'], `'${input_data}' ${ board.board_name} 게시판 검색결과가 없습니다.`);
        document.querySelector('.post_input').appendChild(div);
        REND_LIST.no_Post();
    } else {
        const json = await data.json();
        const data_num = json.search_num;
        div = MAIN.create_html_object('div', ['class'], ['search_result'], `'${input_data}' ${ board.board_name} 게시판 검색결과 ${data_num}개`);
        document.querySelector('.post_input').appendChild(div);
        await MAIN.loading_search_results_posts(hash_value, json);
    }
}