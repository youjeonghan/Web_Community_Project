import * as LINK from "../../config.js"
import * as MAIN from "../common/main.js"
import * as EVENT from "../event.js"
import * as FETCH from "../fetch.js"
import * as EVENT_LIST from "./event.js"
import * as FETCH_LIST from "./fetch.js"
import * as EVENT_POST from "../post/event.js"

//게시판 초기화 랜더링
export function init_post() { //render_init()
  const post = document.querySelector(".post");
  const post_input = MAIN.create_html_object('div', ['class'], ['post_input']);
  const post_lists = MAIN.create_html_object('div', ['class'], ['post_lists']);

  post.innerHTML = '';
  post.appendChild(post_input);
  post.appendChild(post_lists);
}

//post main 랜더링
export async function post_list(posts, search_type) { //render_main()
  let board = null;

  if (search_type == 'total') { //전체 검색결과일경우 보드정보는 n번 호출 
    //각 게시글별 게시판표시를 display:none상태에서 block으로 변경해서 볼 수 있게함
    document.querySelectorAll('.post_board').forEach(item => item.style.cssText = 'display : block');
    for (var i = 0; i <= posts.length - 1; i++) {
      board = await FETCH_LIST.get_Board(posts[i].board_id); //전체 검색결과일 경우
    }
  } else { //일반 게시물 조회일경우 board정보는 한번만 호출
    board = await FETCH_LIST.get_Board(posts[0].board_id);
  }
  for (var i = 0; i <= posts.length - 1; i++) {
    const user_data = await FETCH.fetch_getUserdata(posts[i].userid, search_type);
    document.querySelector('.post_lists').appendChild(creat_posting_board(posts[i], user_data, board));
  }
}
// 전체검색임을 구분해주는 totalSearchFalg가 기존에는 숫자로 1이면 전체조회라는 식으로 구분하였음 -> 이를 'total'일경우로 바꿔 직관적으로 보여줌
// 중복제거 리팩토링 , 불필요한 매개변수 제거

//게시글 보드 생성
export function creat_posting_board(post, user_data, board) { // render_post(), export 필요없음
  let preview_image_url = LINK.PREVIEW_IMG;

  //이미지 
  if (post.preview_image == null) { //이미지가 없는 게시물일 경우 게시판 디폴트이미지를 사용
    preview_image_url = preview_image_url + 'board_img/' + board.board_image; //여기에 게시판 디폴트 이미지 board_image
  } else preview_image_url = preview_image_url + 'post_img/' + post.preview_image;

  const preview_img = MAIN.create_html_object('img', ['src', 'class'], [preview_image_url, "post_preview"]);
  //섹션
  const section = MAIN.create_html_object('section', ['class', 'id'], ["post__lists__item", `posts__${board.id}__${post.id}`]);
  section.addEventListener('click', EVENT_POST.click_post());

  //component
  const component = MAIN.create_html_object('div', ['class'], ['post_component']);
  const componentTop = MAIN.create_html_object('div', ['class'], ['post_componentTop']);
  const subject = MAIN.create_html_object('span', ['class'], ['post_subject'], `${post.subject}`);
  const board_information = MAIN.create_html_object('span', ['class', 'id'], ['post_board', `post_board__${board.id}`], `${board.board_name}`); //검색결과일경우 게시판정보 랜더링
  componentTop.appendChild(subject);
  componentTop.appendChild(board_information);

  const content = MAIN.create_html_object('div', ['class'], ['post_content'], `${post.content}`);
  const content_information = MAIN.create_html_object('div', ['class'], ['post_others']);

  const profile_img = MAIN.create_html_object('img', ['src', 'class'], [`${LINK.PROFILE_IMG}` + user_data.profile_img, 'post_profileImg']);
  const user_nickname = MAIN.create_html_object('span', ['class'], ['post_nickname'], `${user_data.nickname}`);
  const posted_date = MAIN.create_html_object('span', ['class'], ['post_date'], MAIN.calc_date(post.create_date));

  const likes_number = MAIN.create_html_object('span', ['class'], ['post_like']);
  const likes_icon = MAIN.create_html_object('i', ['class'], ["far fa-thumbs-up"]);
  // const add_likeText = document.createTextNode(post.like_num);
  likes_number.appendChild(likes_icon);
  likes_number.appendChild(document.createTextNode(post.like_num));

  const comment = MAIN.create_html_object('span', ['class'], ["post_comment"]);
  const icon_comment = MAIN.create_html_object('i', ['class'], ["far fa-comment"]);
  const add_CommentText = document.createTextNode(post.comment_num);
  comment.appendChild(icon_comment);
  comment.appendChild(add_CommentText);

  content_information.appendChild(profile_img);
  content_information.appendChild(user_nickname);
  content_information.appendChild(posted_date);
  content_information.appendChild(likes_number);
  content_information.appendChild(comment);

  component.appendChild(componentTop);
  component.appendChild(content);
  component.appendChild(content_information);

  section.appendChild(preview_img);
  section.appendChild(component);

  EVENT_LIST.attach_event_when_Topbtn_click();
  return section;
}
// 변수명 변경

//로드된 추가 게시물 렌더링
export function new_post(posts) { //render_newPost() , export 없어도됨
  for (var i = 0; i <= posts.length - 1; i++) {
    document.querySelector('.post_lists').appendChild(creat_posting_board(posts[i]));
  }
}
//불필요한 매개변수 정리

//게시글이 존재하지않을때 그려주는 함수
export const no_Post = () => { //render_lastpost()
  window.removeEventListener('scroll', EVENT_LIST.handle_scrollHeight);
  const ele = document.querySelector('.post_lists');
  const div = MAIN.create_html_object('div', ['class'], ['last_post']);
  const img = MAIN.create_html_object('img', ['src'], ['http://127.0.0.1:5000/static/img/Exclamation.png']);
  const content = MAIN.create_html_object('p', ['class'], ['last_content'], '해당 게시물이 없습니다. 새로운 게시물을 작성해보세요!');
  div.appendChild(img);
  div.appendChild(content);
  ele.appendChild(div);
}

//무한스크롤 할때 로딩이미지 그려주는 함수
export async function infinity_scroll_image() { //render_loadingImage()
  //console.log('111');
  const div = await MAIN.create_html_object('div', ['class'], ['post_loading']);
  const img = await MAIN.create_html_object('img', ['class', 'src'], ['loading_img', 'http://127.0.0.1:5000/static/img/loading.gif']);
  div.appendChild(img);
  document.querySelector('.post_lists').appendChild(div);
}
// 불필요한 매개변수 제거