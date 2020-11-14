import {search_data} from "../list/event.js"

export function handle_search_side(){
    const side = document.querySelector('.side_search');
    const input_side = side.querySelector('input');
    side.querySelector('input').addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        location.href = page_when_side_search(search_data(side,input_side));
        console.log(location.href);
      }
    });
    side.querySelector('button').addEventListener('click', function () {
    //   const data = { //검색한 내용에대한 데이터
    //     'searchType': side.querySelector('select').value,
    //     'text': input_side.value,
    //   }
    //   const board_id = location.hash.split('#')[1];
    //   //데이터를 param화 해서 페이지이동
    //   location.href = `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`; //페이지 이동
      location.href = page_when_side_search(search_data(side,input_side));
      console.log(location.href);
    });
    input_side.value = '';
  }

  export function page_when_side_search (data) {
    const board_id = location.hash.split('#')[1];
    return `#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=`;
  }
  // 페이지이동함수 합칠 수 있는 방법 알아보기