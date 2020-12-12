import * as FETCH from "./fetch.js";
import * as REND from "./render.js";
import * as REND_LIST from "./list/render.js"
import * as FETCH_LIST from "./list/fetch.js"
import * as EVENT from "./event.js"

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
