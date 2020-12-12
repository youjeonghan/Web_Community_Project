import * as FETCH from "./fetch.js";
import * as REND from "./render.js";
import * as REND_LIST from "../list/render.js"
import * as FETCH_LIST from "../list/fetch.js"
import * as EVENT from "./event.js"

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
export async function loading_board_information(hash_value) {
  let board_information;

  //현재 전체검색이 아닌경우 보드정보를 불러오고 전체검색인경우 보드정보를 직접만듬
  if (hash_value[1] !== 'total') {
    await FETCH_LIST.get_Board(hash_value[1]).then((result) => {
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
export const loading_search_results_posts = async (hash_value, json) => { //render_searchResult()
  const data = json.returnlist;
  REND.title_and_side_setting(hash_value);

  if (hash_value[1] === 'total') { //전체게시판 검색일경우
    document.querySelectorAll('.post_board').forEach(item => item.style.cssText = 'display : block');
    await REND_LIST.post_list(data, 'total'); //전체검색결과를 그린다는 확인 flag 'total'
  } else {
    REND_LIST.post_list(data); //일반적 검색결과
  }
}
//tag 생성기 , tag = tag명 A = 속성 ,B = 속성에 들어갈 내용 , C= textNode
export const create_html_object = (tag, attribute, content, text) => {
  const object = document.createElement(`${tag}`);
  for (var i = 0; i <= attribute.length - 1; i++) {
    object.setAttribute(`${attribute[i]}`, `${content[i]}`);
  }
  if (text !== undefined) {
    const textNode = document.createTextNode(`${text}`);
    object.appendChild(textNode);
  }
  return object;
}

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