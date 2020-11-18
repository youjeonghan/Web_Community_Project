import * as LINK from "../../config.js"
import * as MAIN from "../main.js"
import * as EVENT from "../event.js"
import * as FETCH from "../fetch.js"


/*============best 게시물 랜더링 ==========*/
export const best_post = async (data) => { //render_bestPost()
  const ele = document.querySelector('.side_bestContentsList');
  ele.innerHTML = '';
  for (const value of data) {
    const board = await FETCH.fetch_getBoard(value.board_id);
    const user_data = await FETCH.fetch_getUserdata(value.userid);
    const div = best_post_item(value, user_data, board);
    ele.appendChild(div);
  }
}
//get_htmlObject(tag,A,B,C):tag 생성기 , tag = tag명 A = 속성 ,B = 속성에 들어갈 내용 , C= textNode

//best 게시물 각하나씩 만들어주는 함수
export const best_post_item = (value, user_data, board) => { //render_bestPostItem() , export 없어도되나? (다른 Js에서는 안쓰임)
  const div = MAIN.get_htmlObject('div', ['class', 'id', 'onclick'], ['side_bestContentsItem', `side_bestid__${board.id}__${value.id}`, 'handle_postinfo();']);
  const span = MAIN.get_htmlObject('span', [], []);
  const fire = MAIN.get_htmlObject('i', ['class'], ['fas fa-fire']);

  span.appendChild(fire);

  const img = MAIN.get_htmlObject('img', ['src'], ['http://127.0.0.1:5000/static/img/profile_img/' + user_data.profile_img]);
  const p = MAIN.get_htmlObject('p', [], [], value.subject);

  const span_like = MAIN.get_htmlObject('span', ['class'], ['best_like']);
  const icon_like = MAIN.get_htmlObject('i', ['class'], ["far fa-thumbs-up"]);
  const add_likeText = document.createTextNode(`${value.like_num}`);

  span_like.appendChild(icon_like);
  span_like.appendChild(add_likeText);

  const span_comment = MAIN.get_htmlObject('span', ['class'], ["best_comment"]);
  const icon_comment = MAIN.get_htmlObject('i', ['class'], ["far fa-comment"]);
  const add_CommentText = document.createTextNode(`${value.comment_num}`);

  span_comment.appendChild(icon_comment);
  span_comment.appendChild(add_CommentText);

  div.appendChild(span);
  div.appendChild(p);
  div.appendChild(img);
  div.appendChild(span_like);
  div.appendChild(span_comment);

  return div;
}
//url 임포트 받아오는 방법 알아보고 리팩