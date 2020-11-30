import * as LINK from "../../config.js"
import * as MAIN from "../main.js"
import * as EVENT from "../event.js"
import * as FETCH from "../fetch.js"
import * as LIST from "../list/index.js"
import * as EVENT_LIST from "../list/event.js"

export async function post_title(hashValue) { //render_board() //전체검색  시 사이드일떄
  try {
    if (hashValue[1] == 'total') {
      document.querySelector('.post_title').querySelector('h1').textContent = `메인으로`;
      document.querySelector('.side_search').style.cssText = 'display : none';
    } else {
      const board = await FETCH.fetch_getBoard(hashValue[1]);
      document.querySelector('.post_title').querySelector('h1').textContent = board.board_name;
      document.querySelector('.side_search').style.cssText = 'display : inherit';
    }
    EVENT_LIST.attach_event_when_title_click();
  } catch (error) {
    console.log(error);
  }
}
// 리스트인지 논의 다시 해보기
//게시판 초기화 랜더링
export function init_post() { //render_init()
  const post = document.querySelector(".post");
  const post_input = MAIN.get_htmlObject('div', ['class'], ['post_input']);
  const post_lists = MAIN.get_htmlObject('div', ['class'], ['post_lists']);

  post.innerHTML = '';
  post.appendChild(post_input);
  post.appendChild(post_lists);
}

//post main 랜더링
export async function post_main(posts, search_type) { //render_main()
  const ele = document.querySelector('.post_lists');
  let board = null;
  //console.log(totalSearchFlag);
  if (search_type == 'total') { //전체 검색결과일경우 보드정보는 n번 호출 
    //각 게시글별 게시판표시를 display:none상태에서 block으로 변경해서 볼 수 있게함
    const board_link = document.querySelectorAll('.post_board');
    board_link.forEach(item => item.style.cssText = 'display : block');
    for (var i = 0; i <= posts.length - 1; i++) {
      const user_data = await FETCH.fetch_getUserdata(posts[i].userid, search_type);
      board = await FETCH.fetch_getBoard(posts[i].board_id); //전체 검색결과일 경우
      ele.appendChild(post_totalsearch(posts[i], user_data, board));
    }
  } else { //일반 게시물 조회일경우 board정보는 한번만 호출
    board = await FETCH.fetch_getBoard(posts[0].board_id);
    for (var i = 0; i <= posts.length - 1; i++) {
      const user_data = await FETCH.fetch_getUserdata(posts[i].userid, search_type);
      ele.appendChild(post_totalsearch(posts[i], user_data, board));
    }
  }
}
// 전체검색임을 구분해주는 totalSearchFalg가 기존에는 숫자로 1이면 전체조회라는 식으로 구분하였음 -> 이를 'total'일경우로 바꿔 직관적으로 보여줌

//게시판 전체 조회 랜더링
export function post_totalsearch(post, user_data, board) { // render_post(), export 필요없음
  let preview_image_url = LINK.PREVIEW_IMG; // 나중에 리팩

  if (post.preview_image == null) { //이미지가 없는 게시물일 경우 게시판 디폴트이미지를 사용
    preview_image_url = preview_image_url + 'board_img/' + board.board_image; //여기에 게시판 디폴트 이미지 board_image
  } else preview_image_url = preview_image_url + 'post_img/' + post.preview_image;

  const section = MAIN.get_htmlObject('section', ['class', 'id'], ["post__lists__item", `posts__${board.id}__${post.id}`]);
  section.addEventListener('click', EVENT.handle_postinfo);

  const preview_img = MAIN.get_htmlObject('img', ['src', 'class'], [preview_image_url, "post_preview"]);

  const div_component = MAIN.get_htmlObject('div', ['class'], ['post_component']);

  const div_componentTop = MAIN.get_htmlObject('div', ['class'], ['post_componentTop']);
  const span_subject = MAIN.get_htmlObject('span', ['class'], ['post_subject'], `${post.subject}`);
  const span_board = MAIN.get_htmlObject('span', ['class', 'id'], ['post_board', `post_board__${board.id}`], `${board.board_name}`); //검색결과일경우 게시판정보 랜더링
  div_componentTop.appendChild(span_subject);
  div_componentTop.appendChild(span_board);

  const div_content = MAIN.get_htmlObject('div', ['class'], ['post_content'], `${post.content}`);

  const div_others = MAIN.get_htmlObject('div', ['class'], ['post_others']);

  const img_profile = MAIN.get_htmlObject('img', ['src', 'class'], [`${LINK.PROFILE_IMG}` + user_data.profile_img, 'post_profileImg']);
  const span_nickname = MAIN.get_htmlObject('span', ['class'], ['post_nickname'], `${user_data.nickname}`);
  const span_date = MAIN.get_htmlObject('span', ['class'], ['post_date'], MAIN.calc_date(post.create_date));

  const span_like = MAIN.get_htmlObject('span', ['class'], ['post_like']);
  const icon_like = MAIN.get_htmlObject('i', ['class'], ["far fa-thumbs-up"]);
  const add_likeText = document.createTextNode(post.like_num);
  span_like.appendChild(icon_like);
  span_like.appendChild(add_likeText);

  const span_comment = MAIN.get_htmlObject('span', ['class'], ["post_comment"]);
  const icon_comment = MAIN.get_htmlObject('i', ['class'], ["far fa-comment"]);
  const add_CommentText = document.createTextNode(post.comment_num);
  span_comment.appendChild(icon_comment);
  span_comment.appendChild(add_CommentText);

  div_others.appendChild(img_profile);
  div_others.appendChild(span_nickname);
  div_others.appendChild(span_date);
  div_others.appendChild(span_like);
  div_others.appendChild(span_comment);

  div_component.appendChild(div_componentTop);
  div_component.appendChild(div_content);
  div_component.appendChild(div_others);

  section.appendChild(preview_img);
  section.appendChild(div_component);

  EVENT_LIST.attach_event_when_Topbtn_click();
  return section;
}

//로드된 추가 게시물 렌더링
export function new_post(posts) { //render_newPost() , export 없어도됨
  for (var i = 0; i <= posts.length - 1; i++) {
    document.querySelector('.post_lists').appendChild(post_totalsearch(posts[i]));
  }
}
//불필요한 매개변수 정리

//게시글이 존재하지않을때 그려주는 함수
export const no_Post = () => { //render_lastpost()
  window.removeEventListener('scroll', EVENT_LIST.handle_scrollHeight);
  const ele = document.querySelector('.post_lists');
  const div = MAIN.get_htmlObject('div', ['class'], ['last_post']);
  const img = MAIN.get_htmlObject('img', ['src'], ['http://127.0.0.1:5000/static/img/Exclamation.png']);
  const content = MAIN.get_htmlObject('p', ['class'], ['last_content'], '해당 게시물이 없습니다. 새로운 게시물을 작성해보세요!');
  div.appendChild(img);
  div.appendChild(content);
  ele.appendChild(div);
}

// 검색결과를 랜더링 해주는 함수
export const search_results_loading_post = async (hashValue, json) => { //render_searchResult()
  const data = json.returnlist;

  post_title(hashValue);
  if (hashValue[1] === 'total') { //전체게시판 검색일경우
    await post_main(data, 'total'); //1:전체검색결과를 그린다는 확인 flag
    document.querySelectorAll('.post_board').forEach(item => item.style.cssText = 'display : block');
  } else {
    post_main(data); //일반적 검색결과
  }
}
//전체 검색일때랑 사이드 검색일때 메서드 추출 (다른 곳 중복된 곳 있는지 확인해보기)

export async function search_result(hashValue,data) { //list 아닌거 render.js로
  init_post();
  const code = data.status;
  const input_data = decodeURI(hashValue[3].split('&')[1].split('=')[1]);

  let board;
  await LIST.loading_board_information(hashValue).then((result) => {
    board = result;
  })
  let div;
  if (code == 204) {
    if (hashValue[1] === 'total') post_title(hashValue);
    div = MAIN.get_htmlObject('div', ['class'], ['search_result'], `'${input_data}' ${ board.board_name} 게시판 검색결과가 없습니다.`);
    no_Post();
  } else {
    const json = await data.json();
    const data_num = json.search_num;
    div = MAIN.get_htmlObject('div', ['class'], ['search_result'], `'${input_data}' ${ board.board_name} 게시판 검색결과 ${data_num}개`);
    await search_results_loading_post(hashValue, json);
  }
  document.querySelector('.post_input').appendChild(div);
}
//무한스크롤 할때 로딩이미지 그려주는 함수
export async function infinity_scroll_image() { //render_loadingImage()
  //console.log('111');
  const div = await MAIN.get_htmlObject('div', ['class'], ['post_loading']);
  const img = await MAIN.get_htmlObject('img', ['class', 'src'], ['loading_img', 'http://127.0.0.1:5000/static/img/loading.gif']);
  div.appendChild(img);
  document.querySelector('.post_lists').appendChild(div);
}
// 불필요한 매개변수 제거