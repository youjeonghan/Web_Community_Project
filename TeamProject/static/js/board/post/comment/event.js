import * as INDEX from "./index.js";
import * as COMMON_INDEX from "../index.js";
import * as ERROR from "../error.js";

export function submit_comment() {
  const submit_comment_btn = document.querySelector('[id^="comment_id_"]');
  submit_comment_btn.addEventListener("click", async function () { // 제출 이벤트 리스너
    const token = ERROR.check_token();
    const post_id = event.currentTarget.id.split('_')[2];
    const footer = document.querySelector('.footer').offsetTop;
    if (token) {
      await INDEX.input_comment(post_id);
      window.scrollTo({
        top: footer,
        behavior: 'smooth'
      });
    }
  });
}

export function delete_comment() {
  const comment_del_btn = document.querySelectorAll('[id^="deleteComment__"]');
  for (let i = 0; i < comment_del_btn.length; i++) {
    comment_del_btn[i].addEventListener('click', function () {
      const confirm_flag = confirm("삭제하시겠습니까?");
      const comment_id = comment_del_btn[i].id.split('__')[1];
      if (confirm_flag) INDEX.delete_comment(comment_id);
      location.reload();
    })
  }
}

export function update_comment() {
  const comment_update_btn = document.querySelectorAll('[id^="updateComment__"]');
  for (let i = 0; i < comment_update_btn.length; i++) {
    comment_update_btn[i].addEventListener('click', function () {
      const comment_id = comment_update_btn[i].id.split('__')[1];
      INDEX.update_comment(comment_id);
    });
  }
}

export const submit_update_comment = () => {
  const comment_update_submit_btn = document.querySelector('[id^="updateCommentSubmit__"]');
  comment_update_submit_btn.addEventListener('click', async function () {
    const comment_id = comment_update_submit_btn.id.split('__')[1];
    INDEX.submit_comment_update(comment_id);
  });
}

export function add_comment_likes() {
  const comment_like_btn = document.querySelectorAll('[id^="comment_likes_"]');
  for (let i = 0; i < comment_like_btn.length; i++) {
    comment_like_btn[i].addEventListener('click', async function () {
      const token = ERROR.check_token();
      const comment_id = commentLikeBtn[i].id.split('_')[2];
      let like_num = commentLikeBtn[i].value.split(' ')[1];
      like_num *= 1; //*= 형변환 int
      if (token) {
        const check = await COMMON_INDEX.add_likes('comment', comment_id);
        if (check === true) {
          comment_like_btn[i].value = `추천 ${like_num+1}`;
          alert('추천되었습니다.');
        } else if (check === 403) { //자신의 글일때
          alert('본인이 작성한 글은 추천할수 없습니다!');
        } else if (check === 400) { //이미추천한글일때
          alert('이미 추천한 글입니다.');
        }
      }
    });
  }
}

export function add_comment_report() {
  const comment_report_btn = document.querySelectorAll('[id^="comment_report_"]');
  for (let i = 0; i < comment_report_btn.length; i++) {
    comment_report_btn[i].addEventListener('click', async function () {
      const token = ERROR.check_token();
      const comment_id = comment_report_btn[i].id.split('_')[2];
      if(token) {
        const check = await COMMON_INDEX.add_report('comment', comment_id);
        if (check === true) {
          alert('신고가 접수 되었습니다.')
        } else if (check === 403) {
          alert('유효하지 않은 토큰입니다. ');
        } else if (check === 409) { 
          alert('이미 신고한 글입니다.');
        } else if (check === 404) {
          alert('본인 댓글은 신고할 수 없습니다.');
        }
      }
    });
  }
}