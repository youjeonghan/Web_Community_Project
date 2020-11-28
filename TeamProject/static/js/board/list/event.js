import * as REND_LIST from "../list/render.js";
import * as LIST from "../list/index.js"
import * as EVENT from "../../board/event.js"
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

//==========top 버튼 ===========//
export function attach_event_when_Topbtn_click() { //handle_goTop()

  document.querySelector('.post_goTop').addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

//===========게시글 로딩 이벤트 ==========
/*
  스크롤이 바닥에 닿으면
  */
//스크롤 플래그가 false,true로 한 이벤트발생에는 하나의 이벤트만 들어갈수있게함
export let SCROLLFLAG = false;
//스크롤 이벤트 함수
export const handle_scrollHeight = async () => { //handle_scrollHeight() , 함수명변경
  const footer_size = document.querySelector('.footer').offsetHeight;
  if (SCROLLFLAG) return; //스크롤 플래그가 true면 바닥
  if ((window.innerHeight + window.scrollY + footer_size) >= document.body.offsetHeight) {
    SCROLLFLAG = true; //이벤트함수에 접근하고 바로 플래그를 닫는다
    console.log("바닥");
    REND_LIST.infinity_scroll_image(); //로딩창 그려주기
    //0.5초뒤에 새로운 게시글들을 불러오고 ,그뒤에 플래그를 다시 연다
    setTimeout(() => {
      console.log('0.5초뒤');
      const ele = document.querySelector('.post_loading');
      ele.parentNode.removeChild(ele);
      const hashValue = location.hash.split('#');
      LIST.loading_new_post(hashValue);
    }, 500);
    setTimeout(() => {
      console.log('1초뒤');
      SCROLLFLAG = false;
    }, 1000);

  }
}
