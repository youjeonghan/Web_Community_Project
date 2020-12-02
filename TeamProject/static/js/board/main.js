import * as FETCH from "./fetch.js";
import * as REND from "./render.js";
import * as REND_LIST from "./list/render.js"
import * as FETCH_LIST from "./list/fetch.js"
import * as EVENT from "./event.js"
/*
  BOARD = 게시판
  POST = 게시글, 특히 전체조회, 포스트는 20개단위로 페이징 되고 , 맨아래로 내렸을때 다음페이지를 로드함
  POST_INFO = 게시글 크게보기 (post 전체보기에서 눌렀을때)
  render_ : 랜더링 함수 , render.js에 있음
  fetch_ : fetch api를 이용한 서버에서 데이터 받아오는 함수, fetch.js에 있음
  handle_ : 이벤트 리스너 부착함수 , event.js에 있음

  location.href로 링크 이동을하면 hash change이벤트가 발생하여 router.js의 router함수가 실행됨
*/

//tag 생성기 , tag = tag명 A = 속성 ,B = 속성에 들어갈 내용 , C= textNode
export const get_htmlObject = (tag, A, B, C) => {
  const object = document.createElement(`${tag}`);
  for (var i = 0; i <= A.length - 1; i++) {
    object.setAttribute(`${A[i]}`, `${B[i]}`);
  }
  if (C != undefined) {
    const textNode = document.createTextNode(`${C}`);
    object.appendChild(textNode);
  }
  return object;
}

//============입력창 클릭시 크게만들어주는 함수===================
//재민 part
//여기부터 시작
//옮김
// export function input_post() {
//   REND.render_input(); //입력창 랜더링
//   EVENT.handle_submitPost(); //업로드 submit 이벤트리스너
//   EVENT.handle_drop(); //drag & drop 이벤트 리스너
// }

//////////입력창 submit버튼을 눌렀을때 작동하는 함수 ///////
// 재민part
// 옮김
// export async function submit_post() {
//   try {
//     const input_subject = document.querySelector('.input__subject');
//     const input_content = document.querySelector('.input__article');
//     const user_data = await FETCH.fetch_userinfo(); // 현재 로그인한 유저 정보 불러오기
//     const board = await FETCH.fetch_getBoard(location.hash.split('#')[1]); //현재 보드 정보 불러옴

//     //위 변수들로 받아온 정보들을 하나의 object로 묶어서 복사함
//     let object = {
//       'userid': user_data.id,
//       'subject': input_subject.value,
//       'content': input_content.value,
//       'board_name': board.board_name
//     }
//     /*묶은정보를 서버로보내고 만들어진 post정보를 반환
//     (post의 id는 서버에서 만들어지면서 매겨지기때문에 다시받아봐야 알수있음)*/
//     const post_id = await FETCH.fetch_insert(object);
//     return post_id;
//   } catch (error) {
//     console.log(error);
//   }
// }

///////////////////////////////post info/////////////////////////////
//게시글 개별 크게보기 c
//재민part
// 옮김
// export async function load_postinfo(hashValue) {
//   try {
//     const json = await FETCH.fetch_getPostInfo(hashValue[3]); //게시글id로 게시글하나 조회
//     const user = await FETCH.fetch_userinfo(); //user id로 유저정보 조회
//     await REND.render_postinfo(json, user.id); //post info 그려줌
//     await load_comment(json.id); //댓글리스트 불러옴
//     EVENT.handle_report();
//     EVENT.handle_likes();
//     EVENT.handle_commentInsert();
//     EVENT_AUTH.move_mainpage();
//   } catch (error) {
//     console.log(error);
//   }
// }

////////////////////////게시글 삭제////////////////////////
//재민 part
//옮김
// export async function delete_post(id) {
//   try {
//     const flag = await FETCH.fetch_delete(id);
//     if(flag){
//       alert("삭제되었습니다!");
//       EVENT_AUTH.move_mainpage();
//     }
//   } catch (error) {
//     console.log(error);

//   }
// }

///////////////////////////수정////////////////////////////////
//재민 part
//옮김
// export async function update_post(id) { //수정창을 만들어주는 함수
//   const json = await FETCH.fetch_getPostInfo(id);
//   await REND.render_update(json);
//   EVENT.handle_submit_updatePost();
//   EVENT.handle_fileInputTag(); //파일업로드관련 이벤트 부착
//   EVENT.handle_drop(); //파일 드래그엔 드랍 이벤트 부착
//   REND.render_currentpreview(json.post_img_filename); //기존게시글에 이미지 있을때 이미지 미리보기에 해당이미지 그려줌
// }

//파일업로드 가능한 이미지파일인지 확장자구분하는 함수
//재민 part
export function validFileType(file) {
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
  ];
  return fileTypes.includes(file.type);
}

//서버에서 받아온 날짜를 가공해서 반환
//재민 part
export function calc_date(cur_date) {
  const cur_date_list = cur_date.split(' ');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let cur_month;
  month.forEach((e, index) => {
    if (cur_date_list[2] == e) cur_month = index + 1;
  });

  const date = `${cur_date_list[3]}년 ${cur_month}월 ${cur_date_list[1]}일 `;
  return date;
}

/*=============좋아요 추가하기 ============*/
//재민 part
//옮김
// export const add_likes = async (object, id) => {
//   try {
//     let check = false;
//     const object_map = {
//       'post': async function () {
//         check = await FETCH.fetch_postLikes(id);
//       },
//       'comment': async function () {
//         check = await FETCH.fetch_commentLikes(id);
//       }
//     }
//     await object_map[object]();
//     return check;
//   } catch (error) {
//     console.log(error);
//   }
// }

//===========신고 하기 ==========
//재민 part
//옮김
// export const add_report = async (object, id) => {
//   try {
//     let check = false;
//     const object_map = {
//       'post': async function () {
//         check = await FETCH.fetch_postReport(id);
//       },
//       'comment': async function () {
//         check = await FETCH.fetch_commentReport(id);
//       }
//     }
//     await object_map[object]();
//     return check;
//   } catch (error) {
//     console.log(error);
//   }
// }

/*=========댓글조회==========*/
//재민 part
//옮김
// export async function load_comment(post_id) {
//   try {
//     const json = await FETCH.fetch_getComment(post_id, 1);
//     if (json != null) await REND.render_comment(json);
//   } catch (error) {
//     console.log(error);
//   }
// }
/*=============댓글 입력하기============*/
//재민 part
//옮김
// export async function input_comment(post_id) { //post id 불러옴
//   try {
//     const ele = document.querySelector('.comment_value');
//     const userdata = await FETCH.fetch_userinfo();
//     const data = {
//       'content': ele.value,
//       'userid': userdata.id,
//     }
//     await FETCH.fetch_commentInput(post_id, data);
//     await load_comment(post_id);

//     ele.value = '';
//   } catch (error) {
//     console.log(error);
//   }
// }
/*=======댓글 수정버튼 누르고 처리 ====*/
//재민 part
// export async function update_comment(comment_id) { //comment_id 불러옴
//   try {
//     await REND.render_commentUpdate(comment_id);
//     EVENT.handle_commentUpdateSubmit();
//   } catch (error) {
//     console.log(error);
//   }
// }

/*=======댓글 수정 입력 제출  ====*/
//재민 part
// export async function update_commentSubmit(comment_id) { //comment id 불러옴
//   try {
//     const userid = await FETCH.fetch_userinfo();
//     const target = document.querySelector(`#comment_id_${comment_id}`);
//     const text = target.querySelector('textarea').value;
//     const data = {
//       'comment_id': comment_id,
//       'content': text,
//       'userid': userid.id,
//     }
//     await FETCH.fetch_commentUpdate(userid.id, data); //수정된 정보 전송
//     await load_comment(location.hash.split('#')[3]); //댓글 재조회
//   } catch (error) {
//     console.log(error);
//   }
// }

/*=======댓글 삭제 ====*/
//재민 part
// export async function delete_comment(comment_id) {
//   try {
//     const post_id = location.hash.split('#')[3];
//     await FETCH.fetch_commentDelete(post_id, {
//       'comment_id': comment_id
//     });
//     await load_comment(location.hash.split('#')[3]);
//   } catch (error) {
//     console.log(error);
//   }
// }

// ===========파일 데이터 허브 클래스 ============
//재민 part
//옮김
// export const file_dataHub = class {
//   constructor() { //생성자 함수
//     this.data = null; //업로드할 파일 데이터
//     this.maxnum = 5; //업로드 최대개수
//     this.delete_img = null; //삭제할 파일 이름
//   }

//   append_file(files) { //이미지파일 추가
//     if (this.data === null) {
//       if (files.length > 5) {
//         alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`); //이미지 개수 초과 등록시
//         return;
//       }
//       this.data = files;
//     } else {
//       console.log(this.data);
//       if (this.data.length + files.length > this.maxnum) {
//         alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`);
//         return;
//       }
//       this.data = [...this.data, ...files];
//       console.log(this.data);
//       //data에 파일연결 spread syntax
//     }
//     REND.render_preview(this.data);
//   }

//   delete_file(id) { //이미지 파일삭제
//     if (this.data.length == 1) this.data = null;
//     else {
//       let new_data = [];
//       let cnt = 0;
//       for (let i = 0; i < this.data.length; i++) {
//         if (i != id) new_data[cnt++] = this.data[i];
//       }
//       this.data = new_data;
//     }
//     REND.render_preview(this.data);
//   }

//   delete_currentFile(filename) { //삭제할 기존이미지 파일이름
//     if (this.delete_img === null) this.delete_img = [filename];
//     else {
//       this.delete_img = [...this.delete_img, filename];
//       console.log(this.delete_img);
//     }
//   }

//   return_files() { //이미지 파일데이터를 form데이터에 담아서 반환\
//     const form = new FormData();
//     console.log(this.data);
//     console.log(this.delete_img);
//     // if (this.data !== null && this.delete_img !== null) return null;
//     if (this.data !== null) {
//       for (const value of this.data) {
//         form.append('file', value);
//       }
//     }
//     if (this.delete_img !== null) {
//       for (const value of this.delete_img) {
//         form.append('delete_img', value);
//       }
//     }

//     return form;
//   }

//   reset_files() { //데이터 초기화
//     this.data = null;
//     this.delete_img = null;
//   }
// }

//export const INPUT_DATA_FILE = new file_dataHub();
//===========나연 남길거============//

/*=============================사이드바 =========================*/
// 베스트 게시글 불러오기
export async function loading_best_post() {
  try {
    const board_id = location.hash.split('#')[1];
    const data = await FETCH.get_best_post_information(board_id);
    if (data !== null) {
      REND.best_post(data);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function loading_board_information(hashValue) {
  let board_information;

  //현재 전체검색이 아닌경우 보드정보를 불러오고 전체검색인경우 보드정보를 직접만듬
  if (hashValue[1] !== 'total') {
    await FETCH_LIST.get_Board(hashValue[1]).then((result) => {
      board_information = result;
    })
  } else board_information = {
    board_name: '전체',
    id: null //값 바꾸기 
  };
  return board_information;
}
// 보드정보 불러오는 코드 매서드 추출
//==========검색기능 이벤트===========//
export function search_function() {
  EVENT.attach_event_when_search(document.querySelector('.side_search'), 'side');
  EVENT.attach_event_when_search(document.querySelector('.search_bar'), 'total');
};
// 검색결과를 랜더링 해주는 함수
export const loading_search_results_posts = async (hashValue, json) => { //render_searchResult()
  const data = json.returnlist;
  REND.title_and_side_setting(hashValue);

  if (hashValue[1] === 'total') { //전체게시판 검색일경우
    document.querySelectorAll('.post_board').forEach(item => item.style.cssText = 'display : block');
    await REND_LIST.post_list(data, 'total'); //전체검색결과를 그린다는 확인 flag 'total'
  } else {
    REND_LIST.post_list(data); //일반적 검색결과
  }
}
//전체 검색일때랑 사이드 검색일때 메서드 추출 (다른 곳 중복된 곳 있는지 확인해보기)