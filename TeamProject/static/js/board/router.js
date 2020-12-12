import * as MAIN from "./common/main.js"
import * as EVENT from "./common/event.js"
import * as LIST from "./list/index.js"
import * as EVENT_LIST from "./list/event.js"
import * as POST_INDEX from "./post/index.js"
import * as RENDER from "./common/render.js"
/*===========URL 라우팅 형식=========
게시판 메인화면 : /post#board_id#postmain
게시글 클릭시 : /post#board_id#postinfo#post_id
검색 클릭 : /post#board_id#search#data...
===================================*/

/*====================================
hash_value[0] : 값없음 ,
 [1] : 게시판 id
 [2] : 화면구분
 [3] : 게시판 클릭시의 게시글 아이디 or 검색데이터
 =======================================*/
async function router() {
  try {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }); //맨위로
    const hash_value = location.hash.split('#');
    const router_map = {
      postmain: function () { //게시판별 메인페이지
        RENDER.title_and_side_setting(hash_value);
        LIST.loading_post(hash_value);
        MAIN.loading_best_post();
        MAIN.search_function();
        window.addEventListener('scroll', EVENT_LIST.handle_scrollHeight);
        return 'postmain';
      },
      postinfo: function () { //게시글 크게보기
        window.removeEventListener('scroll', EVENT_LIST.handle_scrollHeight);
        RENDER.title_and_side_setting(hash_value);
        POST_INDEX.load_post(hash_value);
        MAIN.loading_best_post();
        MAIN.search_function();
        return 'postinfo';
      },
      search: function () {
        LIST.loading_search_result(hash_value); //전체게시판검색이면 board_id가 total\
        MAIN.loading_best_post();
        EVENT.attach_event_when_title_click();
        MAIN.search_function();
        window.addEventListener('scroll', EVENT_LIST.handle_scrollHeight);
        return 'search';
      }

    }
    router_map[hash_value[2]]() //구분된 hash부분 맵핑
  } catch (error) {
    console.log(error);
    alert("페이지를 찾지못했습니다");
    //404 페이지 구현
  }
}

window.addEventListener('DOMContentLoaded', router); //처음불러올때 감지
window.addEventListener('hashchange', router); //hash  url이 이동되면 감지