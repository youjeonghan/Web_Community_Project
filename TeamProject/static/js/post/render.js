import * as LINK from "../config.js"
import * as MAIN from "./main.js"
import * as EVENT from "./event.js"
import * as FETCH from "./fetch.js"
//보드 게시판 title 랜더링

//게시판 (보드) 랜더링
export function board(board) { //render_board()
  const ele = document.querySelector('.post_title').querySelector('h1');
  ele.textContent = board.board_name;
  document.querySelector('.side_search').style.cssText = 'display : inherit';
}

//게시판 초기화 랜더링
export function init() { //render_init()
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
  if (totalSearchFlag == 1) { //전체 검색결과일경우 보드정보는 n번 호출
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

//게시판 전체 조회 랜더링
export function post_totalsearch(post, user_data, board) { // render_post(), export 필요없음
  let preview_image_url = URL.PREVIEW_IMG; // 나중에 리팩

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

  const img_profile = MAIN.get_htmlObject('img', ['src', 'class'], [`${LINK.PROFILE_IMG}`+ user_data.profile_img, 'post_profileImg']);
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

  EVENT.handle_goTop();
  return section;
}

//로드된 추가 게시물 렌더링
export function newPost(posts) { //render_newPost() , export 없어도됨
  const ele = document.querySelector('.post_lists');
  for (var i = 0; i <= posts.length - 1; i++) {
    ele.appendChild(post_totalsearch(posts[i]));
  }
}

//입력창 (크게보기) 만들기//
//재민part
export function render_input() {
  const html = '<div class="input__on"><input type="text" class="input__subject" maxlength="25" placeholder="글 제목을 입력해주세요" >' +
    '<div class = "input_wrap"><textarea name="article" class="input__article" maxlength="800" placeholder="내용을 입력하세요"></textarea>' +
    '<div class = "input__file" id = "drag_drop">' +
    //file input에 label 붙임
    '<form method="post"  enctype="multipart/form-data"><div class = "file_preview"></div><div class = "file_input">' +
    '<label for="upload_file">' +
    '<img src="https://img.icons8.com/windows/80/000000/plus-math.png"/></label>' +
    '<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div></form>' +
    //accept 허용파일 , multilple  다수 파일입력가능
    '</div><div class = input_buttons><input type="button"  id = "button_submit" value="SUBMIT" />' +
    '<input type="button"  onclick="handle_inputOff();" value="X" /></div>'

  const ele = document.querySelector('.post_input');
  ele.innerHTML = html;
}
// 로그인 후 게시판의 상단위치에 html변수를 생성해 필요한 html 태그들을 생성해주고
// '게시글 작성' 문구를 클릭했을 시에 렌더시켜준다.

//입력창 작게보기
//재민 part
export function render_inputOff() {
  document.querySelector('.post_input').innerHTML =
    '<div class = "input__off"> <p>게시글을 작성해보세요</p></div>';
}
// 게시글 작성 버튼을 누르지 않았을 시에
// 로그인 후 게시판의 상단위치에 innerHtml을 통해 '게시글 작성' 문구 렌더링을 해주며 해당 문구를 div class명 input__off로 감싼다.

//게시글 상세보기
//재민part
export async function render_postinfo(post, userid) {
  const post_ele = document.querySelector('.post');
  const lists = document.querySelector('.post_lists');
  const input = document.querySelector('.post_input');
  //이미 tag가 존재하면 자기자신 삭제
  if (lists !== null) lists.parentNode.removeChild(lists);
  if (input !== null) input.parentNode.removeChild(input);
  const user_data = await FETCH.fetch_getUserdata(post.userid);
  const html = '<div class="post_info"><div class="info_maintext">' +
    '<div class="info_top">' +
    `<h1>${post.subject}</h1>` +
    '<div class="infoTop_buttons">' +
    '<input type="button" id = "updatePost__' + post.id + '" value="수정" />' +
    '<input type="button" id = "deletePost__' + post.id + '" value="삭제" />' +
    '</div>' +
    '<div class = "infoTop_sub">' +
    `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
    `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${MAIN.calc_date(post.create_date)}</span>` +
    '</div>' +
    '</div>' +
    `<div class="info_article"><p>${post.content}</p><div class="info_img"></div></div>` +
    '<div class="info_buttons">' +
    `<input type="button" id="btn_postinfo_report" value="신고" />` +
    `<input type="button" id="postinfo_likes_${post.id}" value="추천 ${post.like_num}" />` +
    '</div>' +
    '</div>' +
    '<div class="comment">' +
    `<p class = "comment_num">${post.comment_num}개의 댓글 </p>` +
    '<div class="comment_input">' +
    '<textarea placeholder = "댓글을 입력해주세요 " class = "comment_value"></textarea>' +
    `<input type="button" id = "comment_id_${post.id}"value="댓글작성" />` +
    '</div>' +
    '<div class="comment_list"></div>' +
    '<div class="comment_last"><input type="button" class="btn_go_main" value="목록으로" /></div></div>';
  post_ele.innerHTML = html;

  render_postinfoImg(post.post_img_filename);
  //수정 삭제 그릴지 판단 : 현재로그인 한 user.id 와 post.id가 같은지 비교하고 같다면 수정삭제를 할 수있는 버튼을 볼 수 있게함
  if (post.userid != userid) document.querySelector('.infoTop_buttons').style.cssText = ' display: none';

  EVENT.handle_goMain();
  EVENT.handle_update();
  EVENT.handle_delete();
}
// 게시판 클릭 시 해당 게시판 내용을 렌더링하는 부분으로, 인자로 게시글에 대한 정보와 게시글을 조회한 유저의 정보를 받습니다.
// 변수로 게시글 리스트 페이지렌더링 상태에서
// 게시글 작성 부분을 포함한 게시글 리스트를 감싸는 section class post를 post_ele에 저장하고
// 게시글 리스트를 감싸는 div를 lists에 저장, 게시글 작성부분을 감싸는 div를 Input에 저장합니다.
// 만약 게시글의 수정 후 렌더링인 경우 post_info부분을 if문을 통해 제어해줌으로써 렌더링 함수 변경
// fetch.js에 있는 유저정보를 클릭한 게시물에 대한 유저의 정보를 받아올 때 까지 함수의 동작을 멈추도록 async await을 사용
// html 변수에는 fetch를 통해 받아온 데이터와, 인자로 받아온 post, userid 변수를 이용해 렌더링 할 내용에 대해 저장
// html 변수에 담은 내용을 post_ele(section post)에 대입
// 이미지 filename을 넘겨주고 해당 게시글의 이미지 불러오기
// 게시글을 조회한 유저와 게시글 작성자와의 아이디가 일치하지 않는 경우 수정 / 삭제 버튼을 숨겨준다.

//게시글 이미지 렌더링
//재민part
export function render_postinfoImg(imgs) {
  const ele = document.querySelector('.info_img');
  let img;
  for (var i = 0; i <= imgs.length - 1; i++) {
    img = MAIN.get_htmlObject('img', ['src'], [`http://127.0.0.1:5000/static/img/post_img/${imgs[i]}`]);
    ele.appendChild(img);
  }
}
// img렌더링을 담당하는 함수
// 위의 render_postInfo에서 이미지를 넣어주는 div info_img에 넣어줄 이미지를 찾아온다.
// main.js에 있는 get_htmlObject 함수를 통해 img 태그(img), 속성(src), 주소지정(주소값)을 통해
// 이미지 생성 후 리턴받아 info_img div에 추가

/*=============댓글 리스트 아이템 tag 생성 ==========*/
// 재민part
export function render_commentList(comment, user_data, login_currentUserData) {
  let comment_html = `<div class = "comment_item" id="comment_id_${comment.id}"><div class="comment_top">` +
    `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
    `<div class = "comment_info">` +
    `<span class="comment_nickname">${user_data.nickname}</span>` +
    `<div class="comment_buttons1">` +
    `<input type="button" id = "comment_likes_${comment.id}" value="추천 ${comment.like_num}" />` +
    `<input type="button" id = "comment_report_${comment.id}" value="신고" />` +
    '</div>' +
    `<span class="comment_date">${MAIN.calc_date(comment.create_date)}</span>` +
    '</div>';

  if (login_currentUserData.id == comment.userid) { //수정 삭제 그릴지 판단
    comment_html = comment_html + `<div class="comment_buttons2">` +
      `<input type="button" id = "updateComment__${comment.id}" value="수정" />` +
      `<input type="button" id = "deleteComment__${comment.id}" value="삭제" />` +
      `</div>`;
  }

  comment_html = comment_html + '</div>' +
    `<p class="comment_content">${comment.content}</p><hr></div>`;
  return comment_html;
}
// comment(댓글)리스트를 생성해주는 함수
// render_comment로부터 받은 인자들을 활용해 comment 생성
// 댓글 수정/삭제 여부 렌더링을 위해 render_comment로 부터 받아온 사용자의 아이디와 댓글작성한 사용자의 id 일치여부확인
// 댓글의 형태 중 상위부터 렌더링 실시 마지막에 댓글 전체 생성 후 취합하여 return
// 위 함수를 댓글의 갯수만큼 실시

/*=============댓글 리스트 랜더링==========*/
// 재민 part
export async function render_comment(comments) {
  let text = '';
  const login_currentUserData = await FETCH.fetch_userinfo();

  for (let i = comments.length - 1; i >= 0; i--) {
    const user_data = await FETCH.fetch_getUserdata(comments[i].userid);
    text += render_commentList(comments[i], user_data, login_currentUserData);
  }
  
  document.querySelector('.comment_list').innerHTML = text;
  EVENT.handle_Commentlikes();
  EVENT.handle_commentReport();
  if(is_comment_exist(login_currentUserData.id,comments)){
    EVENT.handle_commentUpdate();
    EVENT.handle_commentDelete();
  }
  // 테스트 주석
  document.querySelector('.comment_num').innerText = `${comments.length}개의 댓글`;
}

function is_comment_exist(currentUserId, comments){
  const found = comments.find(comment=>comment.userid===currentUserId);
  return found;
}
// comment 렌더링함수
// user_data변수는 댓글을 단 유저의 아이디를 fetch를 통해 받아온다.
// login 여부를 확인할 수 있는 변수를 추가하여 fetch를 통해 확인
// text 변수에 commentList함수를 통해 commentlist를 받아와 삽입
// comment_list div에 text를 삽입
// comment개수를 표시해주는 곳에 main.js에서 받아온 json 데이터를 받아 comments.length를 통해 갯수만큼 값설정

/*=======댓글 수정창 그려주기=====*/
//재민part
export async function render_commentUpdate(id){
  const ele = document.querySelector(`#comment_id_${id}`);
  const ele_textarea = MAIN.get_htmlObject('textarea', [], [], ele.querySelector('p').innerText);
  ele.replaceChild(ele_textarea, ele.childNodes[1]);
  const button = ele.querySelector(`#updateComment__${id}`).parentNode;
  const new_button = await MAIN.get_htmlObject('input',
    ['type', 'id', 'value'], ['button',`updateCommentSubmit__${id}`, '완료']);
  button.replaceChild(new_button, button.childNodes[0]);
  EVENT.handle_commentUpdateSubmit();
}
// main.js에서 fetch를 통해 id를 매개변수로 받아오고
// ele 변수에 id구분을 통해 수정하기로한 댓글을 선택해 대입
// ele_textarea 변수에 main.js의 get_htmlObject함수를 통해 textarea를 생성하고 p태그를 자식요소로 넣어준다.
// 기존에 있던 댓글을 새로 넣은 댓글로 수정시켜준다.
// button 또한 기존의 수정을 삭제로 바꿔준다.

//*==========게시글 postinfo , 수정창=========*/
//재민part
export async function render_update(post) {
  const user_data = await FETCH.fetch_getUserdata(post.userid);
  const tag = document.querySelector('.info_top');
  tag.innerHTML = '';
  tag.innerHTML = `<input type="text" value="${post.subject}" class="update_subject">` +
    '<div class="infoTop_buttons">' +
    '<input type="button" id = "updateSubmitPost__' + post.id + '" value="완료" />' +
    '<input type="button" id = "deletePost__' + post.id + '" value="삭제" />' +
    '</div>' +
    '<div class = "infoTop_sub">' +
    `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
    `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${MAIN.calc_date(post.create_date)}</span>` +
    '</div>';
  const tag2 = document.querySelector('.info_article');
  tag2.innerHTML = '';
  tag2.innerHTML = `<textarea name="article" class = "update_article">${post.content}</textarea>` +
    '<div class = "input__file" id = "drag_drop">' +
    '<form method="post"  enctype="multipart/form-data"><div class = "file_currentPreview"></div><div class = "file_preview"></div><div class = "file_input">' +
    '<label for="upload_file">' +
    '<img src="https://img.icons8.com/windows/80/000000/plus-math.png"/></label>' +
    '<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div></form></div>';
  //accept 허용파일 , multilple  다수 파일입력가능
}
// 게시글 수정 클릭 시 게시글내용을 렌더링해주는 함수
// 기존의 ( 수정 / 삭제 ) 버튼에서 ( 완료 / 삭제 ) 버튼으로 변경
// 기존 게시글 내용 렌더링

//=============수정후 postinfo 부분 랜더링 =============
//재민part
export const render_updatePostinfo = async (post) => {
  const user_data = await FETCH.fetch_getUserdata(post.userid);
  console.log('render_updatePostinfo in');
  const tag = document.querySelector('.info_top');
  tag.innerHTML = '';
  tag.innerHTML = `<h1>${post.subject}</h1>` +
    '<div class="infoTop_buttons">' +
    '<input type="button" id = "updatePost__' + post.id + '" value="수정" />' +
    '<input type="button" id = "deletePost__' + post.id + '" value="삭제" />' +
    '</div>' +
    '<div class = "infoTop_sub">' +
    `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
    `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${MAIN.calc_date(post.create_date)}</span>` +
    '</div>';
  console.log('tag accept');
  const tag2 = document.querySelector('.info_article');
  tag2.innerHTML = '';
  tag2.innerHTML = `<p>${post.content}</p>`;
  console.log('render_updatePostinfo end');
}
// user_data 변수에 Fetch를 통해 Backend에서 데이터(게시글 작성자 아이디)를 받아온다.
// 게시글에서 수정된 내용에 대해 렌더링을 fetch data인 post를 통해 content내용을 불러온 후에
// 게시글 내용 div의 변수인 tag2를 post.content를 넣어준다.

//파일 업로드 미리보기
//재민part
export function render_preview(curfiles) {
  const preview = document.querySelector('.file_preview'); //파일 미리보기 태그
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild); //이전의 미리보기 삭제
  }
  // preview.innerHTML = '';
  if (curfiles === null) { //선택된 파일없을때
    return;
  } else { //선택파일이 있을 경우
    for (let i = 0; i <= curfiles.length - 1; i++) { //파일 목록 그리기
      if (MAIN.validFileType(curfiles[i])) { //파일 유효성 확인

        const div = MAIN.get_htmlObject('div', ['class'], ['previewimageItem']);
        const input = MAIN.get_htmlObject('input', ['type', 'class', 'id', 'value'], ['button', 'previewimageItem_button', `previewImage__${i}`, 'X']);
        const img = MAIN.get_htmlObject('img', ['src'], [`${URL.createObjectURL(curfiles[i])}`]);
        div.appendChild(input);
        div.appendChild(img);
        preview.appendChild(div); //이미지태그 그리기
      } else alert('이미지파일만 업로드가능합니다');
    }
    EVENT.handle_inputFileDelete();
  }
}
// main.js에서 file_dataHub의 클래스 내 생성자를 통해 생성한 this.data로부터 curfiles인자로
// 데이터를 받아오고 previre 변수에 파일미리보기를 제공하는 태그를 선택한다.
// 기존에 있던 미리보기 사진을 모두 제거하고 선택된 파일이 있을 경우와 없을 경우를 나눠서 판별한다.
// 파일이 있을 경우에 파일의 선택된 길이만큼 for문을 통해 파일을 가져온다.
// 파일의 유효성확인(확장자)를 통해 파일검사를 해주며 파일이 유효한 경우
// 미리보기를 할 수 있도록 div와 input, img태그를 생성하여 넣어준다.
// 이미지 쌓임을 방지하기 위해 작업을 완료하고 받아온 인자에 대해 초기화를 시켜준다.

//게시글에 포함된 기존 이미지파일을 미리보기에 그려주는 함수
//재민part
export const render_currentpreview = async (imgs) => {
  const curpreview = document.querySelector('.file_currentPreview');
  for (let i = 0; i <= imgs.length - 1; i++) { //파일 목록 그리기
    const div = MAIN.get_htmlObject('div', ['class'], ['previewimageItem']);
    const input = MAIN.get_htmlObject('input', ['type', 'class', 'id', 'value'], ['button', 'currentPreviewImageItem_button', `currentImage__${imgs[i]}`, 'X']);
    const img = MAIN.get_htmlObject('img', ['src'], [`${LINK.POST_IMG}`+`${imgs[i]}`]);
    div.appendChild(input);
    div.appendChild(img);
    curpreview.appendChild(div); //이미지태그 그리기
  }
  EVENT.handle_currentFileDelete();
}
// 수정 시에 현재 들어있는 사진에 대한 미리보기 제공
// 게시글 수정버튼을 눌렀을 시에 이미지를 json데이터로 받아오고 위의 함수에서 인자로 json data를 받아온다.
// 이미지가 들어갈 수 있도록 div input img 태그를 생성해주고 append를 통해 미리보기 렌더링
// 이미지 쌓임을 방지하기 위해 받아온 인자에 대해 초기화를 실시한다.

/*============best 게시물 랜더링 ==========*/
export const bestPost = async (data) => { //render_bestPost()
  const ele = document.querySelector('.side_bestContentsList');
  ele.innerHTML = '';
  for (const value of data) {
    const board = await FETCH.fetch_getBoard(value.board_id);
    const user_data = await FETCH.fetch_getUserdata(value.userid);
    const div = bestPostItem(value, user_data, board);
    ele.appendChild(div);
  }
}
//get_htmlObject(tag,A,B,C):tag 생성기 , tag = tag명 A = 속성 ,B = 속성에 들어갈 내용 , C= textNode

//best 게시물 각하나씩 만들어주는 함수
export const bestPostItem = (value, user_data, board) => { //render_bestPostItem() , export 없어도되나? (다른 Js에서는 안쓰임)
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

// 검색결과를 랜더링 해주는 함수
export const searchResult = async (title, board, json) => { //render_searchResult()
  const data = json.returnlist;
  const data_num = json.search_num;

  init();//게시판 초기화

  const ele = document.querySelector('.post_input');
  const div = MAIN.get_htmlObject('div', ['class'], ['search_result'], `'${title}' ${ board.board_name} 게시판 검색결과 ${data_num}개`);

  ele.appendChild(div); //검색결과를 input div 부분에 그려줌

  if (board.id == null) { //전체게시판 검색일경우

    document.querySelector('.side_search').style.cssText = 'display : none';
    document.querySelector('.post_title').querySelector('h1').textContent = `메인으로`;
    await render_main(data, 1); //1:전체검색결과를 그린다는 확인 flag

    const board_link = document.querySelectorAll('.post_board');
    board_link.forEach(item => item.style.cssText = 'display : block');

  } else {
    post_main(data); //일반적 검색결과
    MAIN.load_board([0, board.id]); //보드정보 hashvalue랑 값맞춰줌
  }
}           
//전체 검색일때랑 사이드 검색일때 메서드 추출 (다른 곳 중복된 곳 있는지 확인해보기)

//무한스크롤 할때 로딩이미지 그려주는 함수
export const infinity_scroll = () => { //render_loadingImage()
  console.log('111');
  const ele = document.querySelector('.post_lists');
  const div = get_htmlObject('div', ['class'], ['post_loading']);
  const img = get_htmlObject('img', ['class', 'src'], ['loading_img', 'http://127.0.0.1:5000/static/img/loading.gif']);
  div.appendChild(img);
  ele.appendChild(div);
}
//게시글이 존재하지않을때 그려주는 함수
export const lastPost = () => { //render_lastpost()
  window.removeEventListener('scroll', EVENT.handle_scrollHeight);
  const ele = document.querySelector('.post_lists');
  const div = MAIN.get_htmlObject('div', ['class'], ['last_post']);
  const img = MAIN.get_htmlObject('img', ['src'], ['http://127.0.0.1:5000/static/img/Exclamation.png']);
  const content = MAIN.get_htmlObject('p', ['class'], ['last_content'], '해당 게시물이 없습니다. 새로운 게시물을 작성해보세요!');
  div.appendChild(img);
  div.appendChild(content);
  ele.appendChild(div);
}
