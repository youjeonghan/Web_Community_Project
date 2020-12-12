import * as MAIN from "../../common/main.js";
import * as EVENT from "./event.js";
import * as INDEX from "./index.js";
import * as USR_FETCH from "../../user/fetch.js"

export function post_comment_list(comment, user_data, login_current_user_data) {
    let comment_html = `<div class = "comment_item" id="comment_id_${comment.id}"><div class="comment_top">` +
      `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
      `<div class = "comment_info">` +
      `<span class="comment_nickname">${user_data.nickname}</span>` +
      `<div class="comment_buttons1">` +
      `<input type="button" id = "comment_likes_${comment.id}" value="추천 ${comment.like_num}" />` +
      `<input type="button" id = "comment_report_${comment.id}" value="신고" />` +
      '</div>' +
      `<span class="comment_date">${MAIN.calc_date(comment.create_date)}</span>` +
      '</div>';
  
    if (login_current_user_data.id == comment.userid) { //수정 삭제 그릴지 판단
      comment_html = comment_html + `<div class="comment_buttons2">` +
        `<input type="button" id = "updateComment__${comment.id}" value="수정" />` +
        `<input type="button" id = "deleteComment__${comment.id}" value="삭제" />` +
        `</div>`;
    }
  
    comment_html = comment_html + '</div>' +
      `<p class="comment_content">${comment.content}</p><hr></div>`;
    return comment_html;
  }

  export async function post_comment(comments) {
    let text = '';
    const login_current_user_data = await USR_FETCH.get_user_info();
    for (let i = comments.length - 1; i >= 0; i--) {
      const user_data = await USR_FETCH.get_user_data(comments[i].userid);
      text += post_comment_list(comments[i], user_data, login_current_user_data);
      //수정
    }
    document.querySelector('.comment_list').innerHTML = text;
    EVENT.add_comment_likes();
    EVENT.add_comment_report();
    if(INDEX.is_comment_exist(login_current_user_data.id,comments)){
      EVENT.update_comment();
      EVENT.delete_comment();
    }
    document.querySelector('.comment_num').innerText = `${comments.length}개의 댓글`;
  }

  export async function post_comment_update(id){
    const comment = document.querySelector(`#comment_id_${id}`);
    const comment_textarea = MAIN.create_html_object('textarea', [], [], ele.querySelector('p').innerText);
    comment.replaceChild(comment_textarea, comment.childNodes[1]);
    const button = comment.querySelector(`#updateComment__${id}`).parentNode;
    const new_button = await MAIN.create_html_object('input',
      ['type', 'id', 'value'], ['button',`updateCommentSubmit__${id}`, '완료']);
    button.replaceChild(new_button, button.childNodes[0]);
  }