import * as MAIN from "./main.js"
//===========보드 메인 포스트 페이지 ==========

//메인화면 페이지로 가는 함수
export function handle_goMain() {
  const board_id = location.hash.split('#')[1]; // hash값 받아옴
  location.href = `#${board_id}#postmain`; //메인 화면으로 페이지 이동
}

//타이틀 클릭 이벤트 발생 함수
export function handle_clickTitle() {
  const ele = document.querySelector('.post_title');
  ele.addEventListener('click', function () {
    if (location.hash.split('#')[1] == 'total') {
      location.href = 'http://127.0.0.1:5000/';
    } else handle_goMain();
  });
}

//===========보드 메인 포스트 인풋창  ==========
// 인풋창 커지게하는 함수
// 재민part
export function handle_Input() {
  const ele = document.querySelector('.input__off');
  ele.addEventListener('click', async function () {
    const token = sessionStorage.getItem('access_token');
    if (token === null) {
      alert('로그인을 먼저 해주세요');
      return null;
    }
    await input_post();
    handle_fileInputTag();
  });
}

//인풋창 작아지게 하는 함수
//재민part
export function handle_inputOff() {
  REND.render_inputOff();
  handle_Input();
}

//인풋창에서 제출 하는함수
//재민 part
export function handle_submitPost() { //인풋창 submit
  const submit = document.getElementById('button_submit');
  //파일 제출 버튼 태그
  submit.addEventListener('click', async function () { // 제출 이벤트 리스너
    const post = await submit_post();
    const image_data = INPUT_DATA_FILE.return_files();
    console.log(image_data !== null);
    if (image_data !== null) await fetch_upload(post.post_id, image_data);
    await location.reload();
  });
}

//파일 추가해주는 함수
//재민 part
export function handle_fileInputTag() {
  const input = document.querySelector('.file_input').querySelector('input');
  console.log(input);
  input.addEventListener('change', function () { //파일 미리보기 이벤트 리스너
    INPUT_DATA_FILE.append_file(input.files);
  });
}

//업로드중에 파일을 삭제하는 함수
//재민part
export function handle_inputFileDelete() {
  const ele = document.querySelectorAll('.previewimageItem_button');
  for (const value of ele) {
    value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
      const index = event.currentTarget.id.split('__')[1];
      INPUT_DATA_FILE.delete_file(index);
    });
  }
}

//게시글수정중에 기존이미지 삭제하는 함수
//재민 part
export function handle_currentFileDelete() {
  const ele = document.querySelectorAll('.currentPreviewImageItem_button');
  for (const value of ele) {
    value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
      const filename = event.currentTarget.id.split('__')[1];
      INPUT_DATA_FILE.delete_currentFile(filename);
      const delete_node = value.parentNode;
      delete_node.parentNode.removeChild(delete_node);

    });
  }
}
//===========보드 Postinfo 페이지 ==========
//post info 창 페이지 이동
//재민part
export function handle_postinfo() {
  const id = event.currentTarget.id.split('__');
  location.href = `#${id[1]}#postinfo#${id[2]}`; //페이지 이동

}
//post info삭제
//재민 part
export function handle_delete() {
  const confirmflag = confirm("삭제하시겠습니까?");
  const post_id = location.hash.split('#')[3];
  if (confirmflag) delete_post(post_id);

}
//post info수정

//재민part
export async function handle_update() {
  const event_id = event.currentTarget.id.split('__');
  // 게시글 번호 받아오기
  update_post(event_id[1]);
}


//===========게시글 로딩 이벤트 ==========
/*
  스크롤이 바닥에 닿으면
  */
//스크롤 플래그가 false,true로 한 이벤트발생에는 하나의 이벤트만 들어갈수있게함
export let SCROLLFLAG = false;
//스크롤 이벤트 함수
export const handle_scrollHeight = async () => {
  const footer_size = document.querySelector('.footer').offsetHeight;
  if (SCROLLFLAG) return; //스크롤 플래그가 true면 바닥
  if ((window.innerHeight + window.scrollY + footer_size) >= document.body.offsetHeight) {
    SCROLLFLAG = true; //이벤트함수에 접근하고 바로 플래그를 닫는다
    console.log("바닥");
    render_loadingImage(); //로딩창 그려주기
    //0.5초뒤에 새로운 게시글들을 불러오고 ,그뒤에 플래그를 다시 연다
    setTimeout(() => {
      console.log('0.5초뒤');
      const ele = document.querySelector('.post_loading');
      ele.parentNode.removeChild(ele);
      const hashValue = location.hash.split('#');
      add_newPosts(hashValue);
    }, 500);
    setTimeout(() => {
      console.log('1초뒤');
      SCROLLFLAG = false;
    }, 1000);

  }
}

//////////////////////////사진 drag&drop 기능/////////////////////////////
//재민 part
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
    INPUT_DATA_FILE.append_file(data.files); //파일 객체에 추가
  });
}

//==========post 좋아요 이벤트===========//
//재민 part
export async function handle_likes() {
  const token = sessionStorage.getItem('access_token');
  if (token === null) {
    alert('로그인을 먼저 해주세요');
    return null;
  }
  const target = event.currentTarget;
  const post_id = target.id.split('_')[2];
  let like_num = target.value.split(' ')[1];
  like_num *= 1; //*= 형변환 int
  const check = await add_likes('post', post_id);
  if (check == true) {
    target.value = `추천 ${like_num+1}`;
  } else if (check == 403) { //자신의 글일때
    alert('본인이 작성한 글은 추천할수 없습니다!');
  } else if (check == 400) { //이미추천한글일때
    alert('이미 추천한 글입니다.');
  }
}
//==========post 신고  이벤트===========//
//재민 part
export function handle_report() {
  // 알고리즘 전환
  // const post_id =location.hash.split('#')[3];
  // const check = await MAIN.add_report('post',post_id);
  // if(check == true){
  //   alert('신고가 접수 되었습니다.')
  // }
  // else if(check == 403){//자신의 글일때
  //   alert('유효하지 않은 토큰입니다. ');
  // }
  // else if(check == 409){//이미추천한글일때
  //   alert('이미 신고한 글입니다.');
  // }
  const report = document.querySelector("#postinfo_report");
  //파일 제출 버튼 태그
  report.addEventListener("click", async function() { // 제출 이벤트 리스너

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
export async function handle_commentInsert() {
  const token = sessionStorage.getItem('access_token');
  if (token === null) {
    alert('로그인을 먼저 해주세요');
    return null;
  }

  const post_id = event.currentTarget.id.split('_')[2];
  await input_comment(post_id);
  const footer = document.querySelector('.footer').offsetTop;
  window.scrollTo({
    top: footer,
    behavior: 'smooth'
  });
}
//재민part
export function handle_commentDelete() {

  const confirmflag = confirm("삭제하시겠습니까?");
  const comment_id = event.currentTarget.id.split('__')[1];
  if (confirmflag) delete_comment(comment_id);
}
//재민part
export function handle_commentUpdate() {
  console.log("수정창");
  const comment_id = event.currentTarget.id.split('__')[1];
  update_comment(comment_id);
}
//재민part
export const handle_commnetUpdateSubmit = () => {
  const comment_id = event.currentTarget.id.split('__')[1];
  update_commentSubmit(comment_id);
}
//==========comment 좋아요 이벤트===========//
//재민 part
export async function handle_Commentlikes() {
  const token = sessionStorage.getItem('access_token');
  if (token === null) {
    alert('로그인을 먼저 해주세요');
    return null;
  }
  const target = event.currentTarget;
  const comment_id = target.id.split('_')[2];
  let like_num = target.value.split(' ')[1];
  like_num *= 1; //*= 형변환 int
  const check = await add_likes('comment', comment_id);
  if (check == true) {
    target.value = `추천 ${like_num+1}`;
  } else if (check == 403) { //자신의 글일때
    alert('본인이 작성한 글은 추천할수 없습니다!');
  } else if (check == 400) { //이미추천한글일때
    alert('이미 추천한 글입니다.');
  }
}
//==========post 신고 이벤트===========//
//재민 part
export async function handle_commentReport() {
  const token = sessionStorage.getItem('access_token');
  if (token === null) {
    alert('로그인을 먼저 해주세요');
    return null;
  }
  const target = event.currentTarget;
  const comment_id = target.id.split('_')[2];

  const check = await MAIN.add_report('comment', comment_id);
  if (check == true) {
    alert('신고가 접수 되었습니다.')
  } else if (check == 403) { //자신의 글일때
    alert('유효하지 않은 토큰입니다. ');
  } else if (check == 409) { //이미추천한글일때
    alert('이미 신고한 글입니다.');
  }
}
//==========top 버튼 ===========//
(function handle_goTop() {
  const ele = document.querySelector('.post_goTop');
  ele.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();
//==========검색기능 이벤트===========//

export function handle_search() {
  console.log('이벤트 부착');
  const side = document.querySelector('.side_search');
  const input_side = side.querySelector('input');
  side.querySelector('input').addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      const data = { //검색한 내용에대한 데이터
        'searchType': side.querySelector('select').value,
        'text': input_side.value,
      }
      const board_id = location.hash.split('#')[1];
      //데이터를 param화 해서 페이지이동
      location.href = `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`; //페이지 이동
    }
  });

  side.querySelector('button').addEventListener('click', function () {
    const data = { //검색한 내용에대한 데이터
      'searchType': side.querySelector('select').value,
      'text': input_side.value,
    }
    const board_id = location.hash.split('#')[1];
    //데이터를 param화 해서 페이지이동
    location.href = `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`; //페이지 이동
  });

  const nav = document.querySelector('.search_bar');
  const input_nav = nav.querySelector('input');
  nav.querySelector('input').addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      const data = { //검색한 내용에대한 데이터
        'searchType': nav.querySelector('select').value,
        'text': `${input_nav.value}`
      }

      const board_id = location.hash.split('#')[1];
      //데이터를 param화 해서 페이지이동
      location.href = `#total#search#search_type=${data.searchType}&input_value=${data.text}&page=`; //페이지 이동
    }

  });
  nav.querySelector('button').addEventListener('click', function () {
    const data = {
      'searchType': nav.querySelector('select').value,
      'text': input_nav.value,
    }
    location.href = `#total#search#search_type=${data.searchType}&input_value=${data.text}&page=`; //페이지 이동
  });
  //검색창 초기화
  input_nav.value = '';
  input_side.value = '';
};