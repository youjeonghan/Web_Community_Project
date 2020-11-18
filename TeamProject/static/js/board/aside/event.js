import {search_data,page_when_search} from "../list/event.js"

export function handle_search_side(){
    const side = document.querySelector('.side_search');
    const input_side = side.querySelector('input');
    side.querySelector('input').addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        location.href = page_when_search(search_data(side, input_side));
        console.log(location.href);
      }
    });
    side.querySelector('button').addEventListener('click', function () {
      location.href = page_when_search(search_data(side, input_side));
      console.log(location.href);
    });
    input_side.value = '';
  }