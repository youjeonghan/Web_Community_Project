import * as LINK from "../../config.js"
import * as MAIN from "../main.js"
import * as EVENT from "../event.js"
import * as FETCH from "../fetch.js"
import * as LIST from "../list/index.js"
import * as EVENT_LIST from "../list/event.js"

//게시판 타이틀 랜더링
export function post_title(board_title) { //render_board()
  const ele = document.querySelector('.post_title').querySelector('h1');
  ele.textContent = board_title.board_name;
  document.querySelector('.side_search').style.cssText = 'display : inherit';
}
// 리스트인지 논의 다시 해보기

//게시판 초기화 랜더링
export function init_post() { //render_init()
  const post = document.querySelector(".post");
  post.innerHTML = '';
  const post_input = MAIN.get_htmlObject('div', ['class'], ['post_input']);
  const post_lists = MAIN.get_htmlObject('div', ['class'], ['post_lists']);
  post.appendChild(post_input);
  post.appendChild(post_lists);
}

//post main 랜더링
export async function post_main(posts, totalSearchFlag) { //render_main()
  const ele = document.querySelector('.post_lists');
  let board = null;
  //console.log(totalSearchFlag);
  if (totalSearchFlag == 'total') { //전체 검색결과일경우 보드정보는 n번 호출 
    //각 게시글별 게시판표시를 display:none상태에서 block으로 변경해서 볼 수 있게함
    const board_link = document.querySelectorAll('.post_board');
    board_link.forEach(item => item.style.cssText = 'display : block');
    for (var i = 0; i <= posts.length - 1; i++) {
      const user_data = await FETCH.fetch_getUserdata(posts[i].userid, totalSearchFlag);
      board = await FETCH.fetch_getBoard(posts[i].board_id); //전체 검색결과일 경우
      ele.appendChild(post_totalsearch(posts[i], user_data, board));
    }
  } else { //일반 게시물 조회일경우 board정보는 한번만 호출
    board = await FETCH.fetch_getBoard(posts[0].board_id);
    for (var i = 0; i <= posts.length - 1; i++) {
      const user_data = await FETCH.fetch_getUserdata(posts[i].userid, totalSearchFlag);
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

  EVENT_LIST.handle_goTop();
  return section;
}

//로드된 추가 게시물 렌더링
export function new_post(posts) { //render_newPost() , export 없어도됨
  const ele = document.querySelector('.post_lists');
  for (var i = 0; i <= posts.length - 1; i++) {
    ele.appendChild(post_totalsearch(posts[i]));
  }
}

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
export const search_results = async (title, board, json) => { //render_searchResult()
  const data = json.returnlist;
  const data_num = json.search_num;

  init_post(); //게시판 초기화

  const ele = document.querySelector('.post_input');
  const div = MAIN.get_htmlObject('div', ['class'], ['search_result'], `'${title}' ${ board.board_name} 게시판 검색결과 ${data_num}개`);

  ele.appendChild(div); //검색결과를 input div 부분에 그려줌

  if (board.id == null) { //전체게시판 검색일경우

    document.querySelector('.side_search').style.cssText = 'display : none';
    document.querySelector('.post_title').querySelector('h1').textContent = `메인으로`;
    await post_main(data, 'total'); //1:전체검색결과를 그린다는 확인 flag

    const board_link = document.querySelectorAll('.post_board');
    board_link.forEach(item => item.style.cssText = 'display : block');

  } else {
    post_main(data); //일반적 검색결과
    LIST.loading_post_title([0, board.id]); //보드정보 hashvalue랑 값맞춰줌
  }
}
//전체 검색일때랑 사이드 검색일때 메서드 추출 (다른 곳 중복된 곳 있는지 확인해보기)

//무한스크롤 할때 로딩이미지 그려주는 함수
export async function infinity_scroll_image() { //render_loadingImage()
  //console.log('111');
  const ele = document.querySelector('.post_lists');
  const div = await MAIN.get_htmlObject('div', ['class'], ['post_loading']);
  const img = await MAIN.get_htmlObject('img', ['class', 'src'], ['loading_img', 'http://127.0.0.1:5000/static/img/loading.gif']);
  div.appendChild(img);
  ele.appendChild(div);
}