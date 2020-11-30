import * as MAIN from "./main.js"
import * as REND from "./render.js"
import * as FETCH from "./fetch.js"
import * as EVENT_ASIDE from "../board/aside/event.js"
import * as EVENT_LIST from "../board/list/event.js"
//===========보드 메인 포스트 페이지 ==========

//===========보드 메인 포스트 인풋창  ==========
// 인풋창 커지게하는 함수
// 재민part
// 옮김
export function handle_Input() {
  const ele = document.querySelector('.input__off');
  ele.addEventListener('click', async function () {
    const token = sessionStorage.getItem('access_token');
    if (token === null) {
      alert('로그인을 먼저 해주세요');
      return null;
    }
    await MAIN.input_post();
    handle_inputOff();
    handle_fileInputTag();
  });
}

//인풋창 작아지게 하는 함수
//재민part
//옭김
export function handle_inputOff() {
  const btn = document.querySelector('.inputoff_button');
  btn.addEventListener("click", function () {
    REND.render_inputOff();
    handle_Input();
  })
}

//인풋창에서 제출 하는함수
//재민 part
//옮김
export function handle_submitPost() { //인풋창 submit
  const submit = document.getElementById('button_submit');
  //파일 제출 버튼 태그
  submit.addEventListener('click', async function () { // 제출 이벤트 리스너
    const post = await MAIN.submit_post();
    // console.log(post.post_id);
    const image_data = MAIN.INPUT_DATA_FILE.return_files();
    await FETCH.fetch_upload(post.post_id, image_data);
    await location.reload();
  });
}

//파일 추가해주는 함수
//재민 part
//옮김
export function handle_fileInputTag() {
  const input = document.querySelector('.file_input').querySelector('input');
  input.addEventListener('change', function () { //파일 미리보기 이벤트 리스너
    // console.log(input.files);
    MAIN.INPUT_DATA_FILE.append_file(input.files);
  });
}

//업로드중에 파일을 삭제하는 함수
//재민part
//옮김
export function handle_inputFileDelete() {
  const ele = document.querySelectorAll('.previewimageItem_button');
  for (const value of ele) {
    value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
      const index = event.currentTarget.id.split('__')[1];
      MAIN.INPUT_DATA_FILE.delete_file(index);
    });
  }
}

//게시글수정중에 기존이미지 삭제하는 함수
//재민 part
//옮김
export function handle_currentFileDelete() {
  const ele = document.querySelectorAll('.currentPreviewImageItem_button');
  for (const value of ele) {
    value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
      const filename = event.currentTarget.id.split('__')[1];
      MAIN.INPUT_DATA_FILE.delete_currentFile(filename);
      const delete_node = value.parentNode;
      delete_node.parentNode.removeChild(delete_node);
    });
  }
}
//===========보드 Postinfo 페이지 ==========
//post info 창 페이지 이동
//재민part
//옮김
export function handle_postinfo() {
  const id = event.currentTarget.id.split('__');
  location.href = `#${id[1]}#postinfo#${id[2]}`; //페이지 이동
}

//post info삭제
//재민 part
//옮김
export function handle_delete() {
  const delete_update_btn = document.querySelector('[id^="deletePost__"]');
  delete_update_btn.addEventListener('click', function () {
    const confirmflag = confirm("삭제하시겠습니까?");
    const posting_id = delete_update_btn.id.split('__')[1];
    if (confirmflag) MAIN.delete_post(posting_id);
  })
}

//post info수정
//재민part
export function handle_update() {
  const postUpdateBtn = document.querySelector('[id^="updatePost__"]');
  postUpdateBtn.addEventListener('click', function () {
    const target = postUpdateBtn.id.split('__');
    // console.log(target);
    MAIN.update_post(target[1]);
  })
}

//재민 part
//옮김
export function handle_submit_updatePost() { //수정창 제출 함수
  const submit_update_posting_btn = document.querySelector('[id^="updateSubmitPost__"]');
  submit_update_posting_btn.addEventListener('click', async function () {
    const target = submit_update_posting_btn.id.split('__')[1];
    const update_subject = document.querySelector('.update_subject');
    const update_article = document.querySelector('.update_article');
    const token = sessionStorage.getItem('access_token');
    if (token === null) alert('로그인을 먼저 해주세요');
    else {
      const image_data = MAIN.INPUT_DATA_FILE.return_files(); //저장한 이미지 데이터 반환    
      console.log(image_data);
      let data = {
        'subject': update_subject.value,
        'content': update_article.value,
        'id': target
      };
      await FETCH.fetch_update(target, data); //텍스트업로드
      // if (image_data.has('file') === true) {
      //   console.log('fetch_upload_in');
      //   await FETCH.fetch_upload(target, image_data); // 이미지 업로드
      // }
      // if(image_data.has('delete_img')===true){
      //   console.log('fetch_delete_upload');
      //   await FETCH.fetch_upload(target,image_data);
      // }
      if(image_data!==null) await FETCH.fetch_upload(target,image_data);
    }
    const hashValue = location.hash.split('#');
    MAIN.load_postinfo(hashValue); //해당 게시글 재조회
  })
}

//////////////////////////사진 drag&drop 기능/////////////////////////////
//재민 part
//옮김
export function handle_drop() { //drag&drop

  const drop_zone = document.getElementById('drag_drop'); //드레그&드롭 드롭존 태그

  drop_zone.addEventListener('dragenter', function (event) { //드래그 드롭존위에서 점선표시
    drop_zone.style.cssText = "border: 3px dashed gray;";
  });

  drop_zone.addEventListener('dragleave', function (event) { //드래그 드롭존 밖에서  점선제거
    drop_zone.style.cssText = "border: border: 3px dashed lightgray;";

  });
  drop_zone.addEventListener('dragover', function (event) {
    event.preventDefault(); // 이 부분이 없으면 ondrop 이벤트가 발생하지 않습니다.
    drop_zone.style.cssText = "border: 3px dashed gray;";
  });

  drop_zone.addEventListener('drop', function (event) {
    event.preventDefault(); // 이 부분이 없으면 파일을 브라우저 실행해버립니다.
    const data = event.dataTransfer;
    const MAX_FILE = 5;
    drop_zone.style.cssText = "border: 3px dashed lightgray;";
    MAIN.INPUT_DATA_FILE.append_file(data.files); //파일 객체에 추가
  });
}

//==========post 좋아요 이벤트===========//
//재민 part
//옮김
export async function handle_likes() {
  const posting_likes_btn = document.querySelector('[id^="postinfo_likes_"]');
  // [id^="deletePost__"]
  //파일 제출 버튼 태그
  posting_likes_btn.addEventListener("click", async function () { // 제출 이벤트 리스너
    const token = sessionStorage.getItem('access_token');
    if (token === null) {
      alert('로그인을 먼저 해주세요');
      return null;
    }
    const post_id = posting_likes_btn.id.split('_')[2];
    let like_num = posting_likes_btn.value.split(' ')[1];
    like_num *= 1; //*= 형변환 int
    const check = await MAIN.add_likes('post', post_id);
    if (check == true) {
      posting_likes_btn.value = `추천 ${like_num+1}`;
    } else if (check == 403) { //자신의 글일때
      alert('본인이 작성한 글은 추천할수 없습니다!');
    } else if (check == 400) { //이미추천한글일때
      alert('이미 추천한 글입니다.');
    }
  });
}
//==========post 신고  이벤트===========//
//재민 part
//옮김
export function handle_report() {
  const report = document.querySelector("#btn_postinfo_report");
  //파일 제출 버튼 태그
  report.addEventListener("click", async function () { // 제출 이벤트 리스너

    const token = sessionStorage.getItem('access_token');
    if (token === null) {
      alert('로그인을 먼저 해주세요');
      return null;
    }

    const post_id = location.hash.split('#')[3];
    const check = await MAIN.add_report('post', post_id);

    if (check == true) {
      alert('신고가 접수 되었습니다.')
    } else if (check == 403) { //자신의 글일때
      alert('유효하지 않은 토큰입니다. ');
    } else if (check == 409) { //이미추천한글일때
      alert('이미 신고한 글입니다.');
    }
  });
}
//==========댓글 crud===========//
//재민 part
//옮김 
export function handle_commentInsert() {
  const commentBtn = document.querySelector('[id^="comment_id_"]');
  //파일 제출 버튼 태그
  commentBtn.addEventListener("click", async function () { // 제출 이벤트 리스너
    const token = sessionStorage.getItem('access_token');
    if (token === null) {
      alert('로그인을 먼저 해주세요');
      return null;
    }
    const post_id = event.currentTarget.id.split('_')[2];
    await MAIN.input_comment(post_id);
    const footer = document.querySelector('.footer').offsetTop;
    window.scrollTo({
      top: footer,
      behavior: 'smooth'
    });
  });
}
//==========댓글 삭제 이벤트==========
//재민part
export function handle_commentDelete() {
  const comment_del_btn = document.querySelectorAll('[id^="deleteComment__"]');
  for (let i = 0; i < comment_del_btn.length; i++) {
    comment_del_btn[i].addEventListener('click', function () {
      const confirmflag = confirm("삭제하시겠습니까?");
      const comment_id = comment_del_btn[i].id.split('__')[1];
      if (confirmflag) MAIN.delete_comment(comment_id);
    })
  }
}

//==========댓글 수정 이벤트==========
//재민part
export function handle_commentUpdate() {
  const comment_update_btn = document.querySelectorAll('[id^="updateComment__"]');
  for (let i = 0; i < comment_update_btn.length; i++) {
    comment_update_btn[i].addEventListener('click', function () {
      const comment_id = comment_update_btn[i].id.split('__')[1];
      console.log(comment_id);
      MAIN.update_comment(comment_id);
    });
  }
}

//==========댓글 수정 후 완료 이벤트==========
//재민part
export const handle_commentUpdateSubmit = () => {
  const comment_update_submit_btn = document.querySelector('[id^="updateCommentSubmit__"]');
  console.log(comment_update_submit_btn);
  comment_update_submit_btn.addEventListener('click', async function () {
    const comment_id = comment_update_submit_btn.id.split('__')[1];
    MAIN.update_commentSubmit(comment_id);
  });
}

//==========댓글 좋아요 이벤트===========//
//재민 part
export function handle_Commentlikes() {
  const commentLikeBtn = document.querySelectorAll('[id^="comment_likes_"]');
  for (let i = 0; i < commentLikeBtn.length; i++) {
    commentLikeBtn[i].addEventListener('click', async function () {
      const token = sessionStorage.getItem('access_token');
      if (token === null) {
        alert('로그인을 먼저 해주세요');
        return null;
      }
      const comment_id = commentLikeBtn[i].id.split('_')[2];
      let like_num = commentLikeBtn[i].value.split(' ')[1];
      like_num *= 1; //*= 형변환 int
      const check = await MAIN.add_likes('comment', comment_id);
      if (check == true) {
        commentLikeBtn[i].value = `추천 ${like_num+1}`;
      } else if (check == 403) { //자신의 글일때
        alert('본인이 작성한 글은 추천할수 없습니다!');
      } else if (check == 400) { //이미추천한글일때
        alert('이미 추천한 글입니다.');
      }
    });
  }
}

//========== 댓글 신고 이벤트===========//
//재민 part
export function handle_commentReport() {
  const commentReportBtn = document.querySelectorAll('[id^="comment_report_"]');
  for (let i = 0; i < commentReportBtn.length; i++) {
    commentReportBtn[i].addEventListener('click', async function () {
      const token = sessionStorage.getItem('access_token');
      if (token === null) {
        alert('로그인을 먼저 해주세요');
        return null;
      }
      const comment_id = commentReportBtn[i].id.split('_')[2];
      const check = await MAIN.add_report('comment', comment_id);
      if (check == true) {
        alert('신고가 접수 되었습니다.')
      } else if (check == 403) { //자신의 글일때
        alert('유효하지 않은 토큰입니다. ');
      } else if (check == 409) { //이미추천한글일때
        alert('이미 신고한 글입니다.');
      }
    });
  }
}

//========= 아래부터 남길거에용============== // 
//타이틀 클릭 이벤트 발생 함수
export function attach_event_when_title_click() { //handle_clickTitle()

  document.querySelector('.post_title').addEventListener('click', function () {
    if (location.hash.split('#')[1] == 'total') {
      location.href = 'http://127.0.0.1:5000/';
    }
    if (location.hash.split('#')[1] !== null) {
      location.href = 'http://127.0.0.1:5000/post#' + location.hash.split('#')[1] + '#postmain';
    }
  });
}
// 필요없는 매개변수 없애기
//==========검색기능 이벤트===========//
export function handle_search() {
  attach_event_when_search(document.querySelector('.side_search'), 'side');
  attach_event_when_search(document.querySelector('.search_bar'), 'total');
};
// side, nav 함수 추출 , 함수명 변경
export function attach_event_when_search(search_type, search_range) {
  const input_data = search_type.querySelector('input');
  search_type.querySelector('input').addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      location.href = move_page_when_search(save_about_search_data(search_type, input_data), search_range);
    }
  });
  search_type.querySelector('button').addEventListener('click', function () {
    location.href = move_page_when_search(save_about_search_data(search_type, input_data), search_range);
  });
  //검색창 초기화
  input_data.value = '';
}

export function save_about_search_data(search_type, input_data) {
  const data = { //검색한 내용에대한 데이터
    'searchType': search_type.querySelector('select').value,
    'text': `${input_data.value}`
  }
  return data;
}

export function move_page_when_search(data, search_type) { // page_when_search
  if (search_type == 'total') return `#total#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
  else {
    const board_id = location.hash.split('#')[1];
    return `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
  }
}