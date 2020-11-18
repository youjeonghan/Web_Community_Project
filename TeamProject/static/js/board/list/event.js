import * as FETCH from "../fetch.js";
import * as REND from "../render.js";
import * as EVENT from "../event.js";
import * as REND_LIST from "../list/render.js";
import * as REND_ASIDE from "../aside/render.js";
import * as MAIN from "../main.js"
import * as LIST from "../list/index.js"

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

// 전체검색 시 
export function handle_search_nav() {
  const nav = document.querySelector('.search_bar');
  const input_nav = nav.querySelector('input');
  nav.querySelector('input').addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      location.href = page_when_search(search_data(nav, input_nav),'total');
      console.log(location.href);
    }

  });
  nav.querySelector('button').addEventListener('click', function () {
    location.href = page_when_search(search_data(nav, input_nav),'total');
    console.log(location.href);
  });
  //검색창 초기화
  input_nav.value = '';
}
//이름 바꾸기, 공통부분 함수 호출(페이지 이동, 검색내용데이터부분(완료)

export function search_data(search_type, input_type) {
  const data = { //검색한 내용에대한 데이터
    'searchType': search_type.querySelector('select').value,
    'text': `${input_type.value}`
  }
  console.log(data);
  return data;
}
// 검색 내용에 대한 데이터 함수 추출

export function page_when_search(data,flag) {
  if (flag == 'total') return `#total#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
  else {
    const board_id = location.hash.split('#')[1];
    return `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
  }
}
//검색 시 페이지 이동 함수 추출