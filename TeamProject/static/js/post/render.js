//보드 게시판 title 랜더링

const IMAGE_POST_URL = `http://127.0.0.1:5000/static/img/post_img/`;
const IMAGE_USER_URL = `http://127.0.0.1:5000/static/img/profile_img/`;

function render_board(board){
  // const ele = document.querySelector('.post_title');
  // ele.innerHTML = '';
  // const tag = document.createElement('h1');
  // const content =document.createTextNode(`${board.board_name}`);
  // tag.appendChild(content);
  // ele.appendChild(tag);
  const ele = document.querySelector('.post_title').querySelector('h1');
  ele.textContent = board.board_name;

}
function render_init(){
  const post = document.querySelector(".post");
  post.innerHTML = '';
  const post_input = get_htmlObject('div',['class'],['post_input']);
  const post_lists = get_htmlObject('div',['class'],['post_lists']);
  post.appendChild(post_input);
  post.appendChild(post_lists);
}
//post main 랜더링
async function render_main(posts,totalSearchFlag){
  const ele = document.querySelector('.post_lists');
  let board = null;
  if(totalSearchFlag == 1){ //전체 검색결과일경우 보드정보는 n번 호출
    for (var i = 0; i <=posts.length-1; i++) {
      const user_data = await fetch_getUserdata(posts[i].userid,totalSearchFlag);
      board = await fetch_getBoard(posts[i].board_id);//전체 검색결과일 경우
      ele.appendChild(render_post(posts[i],user_data,board));
    }
  }
  else {//일반 게시물 조회일경우 board정보는 한번만 호출
    board = await fetch_getBoard(posts[0].board_id);
    for (var i = 0; i <=posts.length-1; i++) {
      const user_data = await fetch_getUserdata(posts[i].userid,totalSearchFlag);
      ele.appendChild(render_post(posts[i],user_data,board));
    }
  }
}
// 게시글들 랜더링
// function render_post(post){
//   const post_html =
//   `<section class=post_lists__item" id = "posts__${post.id}" onclick ="handle_postinfo()">`+
//   '<h4>'+post.subject+'</h4>'+ '<hr>'+
//   '<p>'+post.content+'</p>' +
//   '<ul>'+
//   `<li>${calc_date(post.create_date)}</li>`+
//   `<li>${post.userid}</li>`+ //댓글
//   `<li>${post.comment_num}</li>`+ //댓글
//   `<li>${post.like_num}</li>`+ //좋아요
//   '</ul>'+'</section>';
//   return post_html;
// }

function render_post(post,user_data,board){




  if(post.preview_image==null){//이미지가 없는 게시물일 경우 디폴트이미지
   post.preview_image ='board_16.jpg';//여기에 게시판 디폴트 이미지 board_image
  }


  const section = get_htmlObject('section',['class','id'],["post__lists__item",`posts__${board.id}__${post.id}`]);
  section.addEventListener('click',handle_postinfo);


  const preview_img =get_htmlObject('img',['src','class'],[`http://127.0.0.1:5000/static/img/post_img/${post.preview_image}`,"post_preview"]);

  const div_component = get_htmlObject('div',['class'],['post_component']);

  const div_componentTop = get_htmlObject('div',['class'],['post_componentTop']);
  const span_subject = get_htmlObject('span',['class'],['post_subject'],`${post.subject}`);
  const span_board = get_htmlObject('span',['class','id'],['post_board',`post_board__${board.id}`],`${board.board_name}`);//검색결과일경우 게시판정보 랜더링
  div_componentTop.appendChild(span_subject);
  div_componentTop.appendChild(span_board);

  const div_content = get_htmlObject('div',['class'],['post_content'],`${post.content}`);

  const div_others = get_htmlObject('div',['class'],['post_others']);

  const img_profile = get_htmlObject('img',['src','class'],['http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img,'post_profileImg']);
  const span_nickname = get_htmlObject('span',['class'],['post_nickname'],`${user_data.nickname}`);
  const span_date = get_htmlObject('span',['class'],['post_date'],calc_date(post.create_date));

  const span_like = get_htmlObject('span',['class'],['post_like']);
  const icon_like = get_htmlObject('i',['class'],["far fa-thumbs-up"]);
  const add_likeText = document.createTextNode(post.like_num);
  span_like.appendChild(icon_like);
  span_like.appendChild(add_likeText);

  const span_comment = get_htmlObject('span',['class'],["post_comment"]);
  const icon_comment = get_htmlObject('i',['class'],["far fa-comment"]);
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

  return section;


}

//로드된 추가 게시물 렌더링
function render_newPost(posts){
  const ele = document.querySelector('.post_lists');
  for (var i = 0; i <=posts.length-1; i++) {
    ele.appendChild(render_post(posts[i]));
  }
}

//입력창 만들기//
function render_input(){
  const html = '<div class="input__on"><input type="text" class="input__subject" maxlength="25" placeholder="글 제목을 입력해주세요" >' +
  '<div class = "input_wrap"><textarea name="article" class="input__article" maxlength="800" placeholder="내용을 입력하세요"></textarea>' +
  '<div class = "input__file" id = "drag_drop">'+
//file input에 label 붙임
'<form method="post"  enctype="multipart/form-data"><div class = "file_preview"></div><div class = "file_input">'+
'<label for="upload_file">'+
'<img src="https://img.icons8.com/windows/80/000000/plus-math.png"/></label>'+
'<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div></form>'+
  //accept 허용파일 , multilple  다수 파일입력가능
  '</div><div class = input_buttons><input type="button"  id = "button_submit" value="SUBMIT" />'+
  '<input type="button"  onclick="handle_inputOff();" value="X" /></div>'

  const ele = document.querySelector('.post_input');
  // ele.style.height=400 +'px'; //입력창 크기 변환
  ele.innerHTML = html;
  // if(ele!==null) {
  //   ele.style.height=400 +'px'; //입력창 크기 변환
  //   ele.innerHTML = html;
  //   // handle_keydown();
  // }
  // else{//새로고침했을때 애러
  //   handle_goMain();
  // }

}
function render_inputOff(){
  document.querySelector('.post_input').innerHTML =
  '<div class = "input__off"> <p>게시글을 작성해보세요</p></div>';
}

//게시글 상세보기
async function render_postinfo(post,userid){
  const post_ele = document.querySelector('.post');
  const lists =  document.querySelector('post_lists');
  const input = document.querySelector('.post_input');
  if(document.querySelector('post_info')){
    render_updatePostinfo(post);//postinfo수정창 -> postinfo 재조회 상황일경우
    return;
  }
  if(lists!==null)lists.parentNode.removeChild(lists);
  if(input!==null)input.parentNode.removeChild(input);

  const user_data = await fetch_getUserdata(post.userid);


  const html = '<div class="post_info"><div class="info_maintext">'+
  '<div class="info_top">'+
  `<h1>${post.subject}</h1>` +
  '<div class="infoTop_buttons">'+
  '<input type="button" id = "updatePost__'+post.id+'" onclick="handle_update();" value="수정" />'+
  '<input type="button" id = "deletePost__'+post.id+'" onclick="handle_delete();" value="삭제" />'+
  '</div>' +
  '<div class = "infoTop_sub">'+
  `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">`+
  `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${calc_date(post.create_date)}</span>`+
  '</div>'+
  '</div>' +
  `<div class="info_article"><p>${post.content}</p><div class="info_img"></div></div>` +
  `<hr><div class="info_writer"><img class = "infoWriter_img"src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}"><span class = "infoWriter_nickname">${user_data.nickname}</span></div>` +
  '<div class="info_buttons">'+
  `<input type="button"  onclick="handle_report();" value="신고" />`+
  `<input type="button"  onclick="handle_likes();" id = "postinfo_likes_${post.id}"value="추천 ${post.like_num}" />`+
  '<input type="button"  onclick="handle_mail();" value="쪽지" />'+
  '</div>' +
  '</div>' +
  '<div class="comment">' +
  `<p class = "comment_num">${post.comment_num}개의 댓글 </p>`+
  '<div class="comment_input">'+
  '<textarea placeholder = "댓글을 입력해주세요 " class = "comment_value"></textarea>'+
  `<input type="button"  onclick="handle_commentInsert();" id = "comment_id_${post.id}"value="댓글작성" />`+
  '</div>' +
  '<div class="comment_list"></div>' +
  '<div class="comment_last"><input type="button"  onclick="handle_goMain();" value="목록으로" /></div></div>';
  post_ele.innerHTML = html;
  render_postinfoImg(post.post_img_filename);

  console.log(post.id,userid);

  if(post.userid != userid){ //수정 삭제 그릴지 판단
    document.querySelector('.infoTop_buttons').style.cssText = ' display: none';
  }

}
//게시글 이미지 렌더링
function render_postinfoImg(imgs){
  const ele = document.querySelector('.info_img');
  let img;
  for (var i = 0; i <= imgs.length - 1; i++) {
    img = get_htmlObject('img',['src'],[`http://127.0.0.1:5000/static/img/post_img/${imgs[i]}`]);
    ele.appendChild(img);
  }

}

/*=============댓글 리스트 아이템 tag 생성 ==========*/
function render_commentList(comment,user_data,login_currentUserData){

  let comment_html =`<div class = "comment_item" id="comment_id_${comment.id}"><div class="comment_top">`+
  `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">`+
  `<div class = "comment_info">`+
  `<span class="comment_nickname">${user_data.nickname}</span>`+
  `<div class="comment_buttons1">`+
  `<input type="button"  id = "comment_likes_${comment.id}" onclick="handle_Commentlikes();" value="추천 ${comment.like_num}" />`+
  `<input type="button"  id = "comment_report_${comment.id}" onclick="handle_Commentreport();" value="신고" />`+
  '</div>'+
  `<span class="comment_date">${calc_date(comment.create_date)}</span>`+
  '</div>';

  if(login_currentUserData.id == comment.userid){//수정 삭제 그릴지 판단
    comment_html =  comment_html + `<div class="comment_buttons2">`+
    `<input type="button" id = "updateComment__${comment.id}" onclick="handle_commentUpdate();" value="수정" />`+
    `<input type="button" id = "deleteComment__${comment.id}" onclick="handle_commentDelete();" value="삭제" />`+
    `</div>`;
  }
  comment_html = comment_html +'</div>'+
  `<p class="comment_content">${comment.content}</p><hr></div>`;

  return comment_html;

}
/*=============댓글 리스트 랜더링==========*/
async function render_comment(comments){
  let text ='';
  for (var i = comments.length-1; i >=0; i--) {
    const user_data = await fetch_getUserdata(comments[i].userid);
    const login_currentUserData = await fetch_userinfo();
    text += render_commentList(comments[i],user_data,login_currentUserData);
  }

  document.querySelector('.comment_list').innerHTML = text;
  document.querySelector('.comment_num').innerText = `${comments.length}개의 댓글`;


}
/*=======댓글 수정창 그려주기=====*/
const render_commentUpdate = (id)=>{
  const ele = document.querySelector(`#comment_id_${id}`);
  const ele_textarea = get_htmlObject('textarea',[],[],ele.querySelector('p').innerText);
  ele.replaceChild(ele_textarea,ele.childNodes[1]);
  const button = ele.querySelector(`#updateComment__${id}`).parentNode;
  const new_button = get_htmlObject('input',
    ['type','id','onclick','value'],['button',`updateComment__${id}`,'handle_commnetUpdateSubmit();','완료']);
  button.replaceChild(new_button,button.childNodes[0]);
}

//*==========게시글 postinfo , 수정창=========*/
async function render_update(post){
  const user_data = await fetch_getUserdata(post.userid);
  const tag = document.querySelector('.info_top');
  tag.innerHTML = '';
  tag.innerHTML = `<input type="text" value="${post.subject}" class="update_subject">` +
  '<div class="infoTop_buttons">'+
  '<input type="button" id = "updateSubmitPost__'+post.id+'" onclick="submit_updatePost();" value="완료" />'+
  '<input type="button" id = "deletePost__'+post.id+'" onclick="handle_delete();" value="삭제" />'+
  '</div>' +
  '<div class = "infoTop_sub">'+
  `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">`+
  `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${calc_date(post.create_date)}</span>`+
  '</div>';
  const tag2 = document.querySelector('.info_article');
  tag2.innerHTML = '';
  tag2.innerHTML = `<textarea name="article" class = "update_article">${post.content}</textarea>`+
 '<div class = "input__file" id = "drag_drop">'+
'<form method="post"  enctype="multipart/form-data"><div class = "file_currentPreview"></div><div class = "file_preview"></div><div class = "file_input">'+
'<label for="upload_file">'+
'<img src="https://img.icons8.com/windows/80/000000/plus-math.png"/></label>'+
'<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div></form></div>';
  //accept 허용파일 , multilple  다수 파일입력가능

}

//=============수정후 postinfo 부분 랜더링 =============
const render_updatePostinfo= async (post)=>{
  const user_data = await fetch_getUserdata(post.userid);
  const tag = document.querySelector('.info_top');
  tag.innerHTML = '';
  tag.innerHTML =`<h1>${post.subject}</h1>` +
  '<div class="infoTop_buttons">'+
  '<input type="button" id = "updatePost__'+post.id+'" onclick="handle_update();" value="수정" />'+
  '<input type="button" id = "deletePost__'+post.id+'" onclick="handle_delete();" value="삭제" />'+
  '</div>' +
  '<div class = "infoTop_sub">'+
  `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">`+
  `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${calc_date(post.create_date)}</span>`+
  '</div>';
  const tag2 = document.querySelector('.info_article');
  tag2.innerHTML = '';
  tag2.innerHTML = `<p>${post.content}</p>`;
}

////////////////////////////////////////////

function render_preview(curfiles){//파일 업로드 미리보기

  const preview = document.querySelector('.file_preview'); //파일 미리보기 태그
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild); //이전의 미리보기 삭제

  }
  // preview.innerHTML = '';
  if(curfiles ===null){ //선택된 파일없을때
    console.log('선택파일없음');
    return;
  }

    else{ //선택파일이 있을 경우
    for (let i = 0; i <= curfiles.length-1; i++){ //파일 목록 그리기
      if(validFileType(curfiles[i])){ //파일 유효성 확인

        const div = get_htmlObject('div',['class'],['previewimageItem']);
        const input = get_htmlObject('input',['type','class','id','value'],['button','previewimageItem_button',`previewImage__${i}`,'X']);
        const img = get_htmlObject('img',['src'],[`${URL.createObjectURL(curfiles[i])}`]);
        div.appendChild(input);
        div.appendChild(img);
        preview.appendChild(div); //이미지태그 그리기

      }
      else alert('이미지파일만 업로드가능합니다');
    }
     handle_inputFileDelete();
  }

}

const render_currentpreview = async (imgs)=>{
  const curpreview = document.querySelector('.file_currentPreview');
    for (let i = 0; i <= imgs.length-1; i++){ //파일 목록 그리기
        const div = get_htmlObject('div',['class'],['previewimageItem']);
        const input = get_htmlObject('input',['type','class','id','value'],['button','currentPreviewImageItem_button',`currentImage__${imgs[i]}`,'X']);
        const img = get_htmlObject('img',['src'],[`http://127.0.0.1:5000/static/img/post_img/${imgs[i]}`]);
        div.appendChild(input);
        div.appendChild(img);
        curpreview.appendChild(div); //이미지태그 그리기

    }
     handle_currentFileDelete();
}
/*============best 게시물 랜더링 ==========*/
const render_bestPost = async (data)=>{
  const ele = document.querySelector('.side_bestContentsList');
  ele.innerHTML = '';
  for (const value of data) {
    const board = await fetch_getBoard(value.board_id);
    const user_data = await fetch_getUserdata(value.userid);
    const div = render_bestPostItem(value,user_data,board);
    ele.appendChild(div);
  }
}
const render_bestPostItem = (value,user_data,board)=>{
  const div = get_htmlObject('div',['class' , 'id','onclick'],['side_bestContentsItem',`side_bestid__${board.id}__${value.id}`,'handle_postinfo();']);
  const span = get_htmlObject('span',[],[]);
  const fire = get_htmlObject('i',['class'],['fas fa-fire-alt']);
  span.appendChild(fire);
  const img = get_htmlObject('img',['src'],['http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img]);
  const p = get_htmlObject('p',[],[],value.subject);

  const span_like = get_htmlObject('span',['class'],['best_like']);
  const icon_like = get_htmlObject('i',['class'],["far fa-thumbs-up"]);
  const add_likeText = document.createTextNode(`${value.like_num}`);
  span_like.appendChild(icon_like);
  span_like.appendChild(add_likeText);
  const span_comment = get_htmlObject('span',['class'],["best_comment"]);
  const icon_comment = get_htmlObject('i',['class'],["far fa-comment"]);
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

const render_searchResult = async(title,board,data)=>{
  render_init();
  const ele = document.querySelector('.post_input');
  const div = get_htmlObject('div',['class'],['search_result']
  ,`'${title}' ${ board.board_name} 게시판 검색결과 ${data.length}개`);
  ele.appendChild(div); //검색결과를 input div 부분에 그려줌

  if(board.id==null){//전체게시판 검색일경우
    document.querySelector('.side_search').style.cssText ='display : none';
    document.querySelector('.post_title').querySelector('h1').textContent = `메인으로`;
    await render_main(data,1);//전체검색결과를 그린다는 확인 flag

    const board_link = document.querySelectorAll('.post_board');
    // for(const value of board_link)value.style.cssText = 'display : block';
    board_link.forEach(item=>item.style.cssText = 'display : block');

  }

  render_main(data); //일반적 검색결과
}