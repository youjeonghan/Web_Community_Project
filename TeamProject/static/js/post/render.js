//보드 게시판 title 랜더링 
function render_board(board){
  const ele = document.querySelector('.post_title');
  ele.innerHTML = '';
  const tag = document.createElement('h1');
  const content =document.createTextNode(`${board.board_name} - 게시판`);
  tag.appendChild(content);
  ele.appendChild(tag);
}

//post main 랜더링
function render_main(posts){
  document.querySelector('.post').innerHTML = 
  '<div class="post__input">'+'<div class = "input__off"> <p>게시글을 작성해보세요</p> </div></div>' +
  '<div class="post__lists"></div>';
  let text ='';
  for (var i = posts.length-1; i >=0; i--) {
    text += render_post(posts[i]);
  }
  document.querySelector('.post__lists').innerHTML = text;

}
// 게시글들 랜더링 
function render_post(post){
  const post_html =   
  `<section class="post__lists__item" id = "posts__${post.id}" onclick ="handle_postinfo()">`+
  '<h4>'+post.subject+'</h4>'+ '<hr>'+
  '<p>'+post.content+'</p>' +
  '<ul>'+
  `<li>${calc_date(post.create_date)}</li>`+
  `<li>${post.userid}</li>`+ //댓글
  `<li>${post.comment_num}</li>`+ //댓글
  `<li>${post.like_num}</li>`+ //좋아요
  '</ul>'+'</section>'; 
  return post_html;
}

//입력창 만들기//
function render_input(){
  const html = '<div class="input__on" id = "drag_drop"><input type="text" class="input__subject" maxlength="25" placeholder="글 제목을 입력해주세요" >' +
  '<textarea name="article" class="input__article" maxlength="800" placeholder="내용을 입력하세요"></textarea>' +
  '<div class = "input__buttons">'+
//file input에 label 붙임 
'<form method="post" enctype="multipart/form-data"><div class = "file_input">'+
'<label for="upload_file">'+
'<img src  = "https://img.icons8.com/small/32/000000/image.png"/></label>'+
'<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div>'+
  //accept 허용파일 , multilple  다수 파일입력가능 
  '<div class = "file_preview"> <img> </div></form>'+
  '<input type="button"  id = "button_submit" value="SUBMIT" />'+
  '<input type="button"  onclick="handle_goMain();" value="X" /></div>'

  const ele = document.querySelector('.post__input');

  if(ele!==null) {
    ele.style.height=400 +'px'; //입력창 크기 변환
    ele.innerHTML = html;
    // handle_keydown();
  }
  else{//새로고침했을때 애러
    handle_goMain();
  }

}


//게시글 상세보기 
function render_postinfo(post){
  const post_ele = document.querySelector('.post');
  const lists =  document.querySelector('.post__lists');
  const input = document.querySelector('.post__input');
  if(lists!==null)lists.parentNode.removeChild(lists);
  if(input!==null)input.parentNode.removeChild(input);
  const user_data = get_userdata(post.userid);
  // const html = '<div class="post_info"> <div class = "post__bigsubject">'+`<h2> ${post.subject}</h2>`+'</div>'+ 
  // '<div class = "post__bigarticle">'+'<p>'+post.content+'</p>'+'</div>'
  // +
  // '<div class = "post__bigothers">'+ '<p>'+post.create_date+'</p>'+
  // '<input type="button" id = "deletePost__'+post.id+'" onclick="handle_delete();" value="삭제" />'+
  // '<input type="button"  onclick="handle_goMain();" value="목록" />'+
  // '<input type="button" id = "modifyPost__'+post.id+'" onclick="handle_modify();" value="수정" />'
  
  const html = '<div class="post_info"><div class="info_maintext">'+
      '<div class="info_top">'+
        `<h1>${post.subject}</h1>` +
        '<div class="infoTop_buttons">'+
          '<input type="button" id = "modifyPost__'+post.id+'" onclick="handle_modify();" value="수정" />'+
          '<input type="button" id = "deletePost__'+post.id+'" onclick="handle_delete();" value="삭제" />'+
        '</div>' +
        '<div class = "infoTop_sub">'+
          `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${calc_date(post.create_date)}</span>`+
        '</div>'+
      '</div>' +
      `<div class="info_article"><p>${post.content}</p></div>` +
      `<div class="info_writer"><img class = "infoWriter_img"src="${user_data.image_url}"><span class = "infoWriter_nickname">${user_data.nickname}</span> <span class =  "infoWriter_email">${user_data.email}</span> </div>` +
        '<div class="info_buttons">'+
        '<input type="button"  onclick="handle_goMain();" value="신고" />'+
        `<input type="button"  onclick="handle_goMain();" value="추천 ${post.like_num}"" />`+
        '<input type="button"  onclick="handle_goMain();" value="쪽지" />'+
        '<input type="button"  onclick="handle_goMain();" value="목록으로" />'+
    '</div>' +
    '</div>' +
    '<div class="comment">' +
      `<p class = "comment_num">${post.comment_num}개의 댓글 </p>`+
      '<div class="comment_input">'+
        '<textarea placeholder = "댓글을 입력해주세요 "></textarea>'+
        '<input type="button"  onclick="handle_goMain();" value="댓글작성" />'+
      '</div>' +
      '<div class="comment_list"></div>' +
    '</div></div>';
  post_ele.innerHTML = html;

}
/*=============댓글 리스트 아이템 tag 생성 ==========*/
function render_commentList(comment){
  const user_data = get_userdata(comment.userid);
  const comment_html ='<div class = "comment_item"><div class="comment_top">'+
    `<img src="${user_data.image_url}">`+
    `<div class = "comment_info">`+
      `<span class="comment_nickname">${user_data.nickname}</span>`+
      `<div class="comment_buttons1">`+
        `<input type="button"  onclick="handle_goMain();" value="추천 ${comment.like_num}" />`+
        `<input type="button"  onclick="handle_goMain();" value="신고" />`+
      '</div>'+
      `<span class="comment_date">${calc_date(comment.create_date)}</span>`+
    '</div>'+
    `<div class="comment_buttons2">`+
      `<input type="button" id = "modifyPost__${comment.id}" onclick="handle_modify();" value="수정" />`+
      `<input type="button" id = "deletePost__${comment.id}" onclick="handle_delete();" value="삭제" />`+
    `</div>`+    
    '</div>'+
  `<p class="comment_content">${comment.content}</p><hr></div>`;   
  return comment_html;

}
/*=============댓글 리스트 랜더링==========*/
function render_comment(comments){
  let text ='';
  for (var i = comments.length-1; i >=0; i--) {
    text += render_commentList(comments[i]);
  }
  document.querySelector('.comment_list').innerHTML = text;

}

//게시글 상세보기 , 수정창 
function render_modify(json){
  const tag = document.querySelector('.input__big');
  tag.innerHTML = '';
  tag.innerHTML = '<input type="text" value="'+json.subject+'" class="input__bigsubject">'+
  '<textarea name="article" class="input__bigarticle">'+json.content+'"</textarea>'+
  '<div class = "input__bigothers">'+ '<p>'+json.create_date+'</p>'+
  '<input type="button" id = "deletePost__'+json.id+'" onclick="handle_delete();" value="삭제" />'+
  '<input type="button"  onclick="handle_goMain();" value="목록" />'+
  '<input type="button" id = "modifyPost__'+json.id+'" onclick="submit_modifyPost();" value="완료" /></div>';
}


function render_preview(curfiles , preview){//파일 업로드 미리보기

  const MAX_FILE = 5;
  if(curfiles.length > MAX_FILE){
    alert(`이미지는 최대 ${MAX_FILE}개 까지 등록가능합니다`);
    return;
  }
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild); //이전의 미리보기 삭제

  }
  if(curfiles.length ===0){ //선택된 파일없을때
    alert('선택된 파일이없습니다.');
  }
  else{ //선택파일이 있을 경우 
    for(const file of curfiles){ //파일 목록 그리기 
      if(validFileType(file)){ //파일 유효성 확인 
        const image = document.createElement('img'); //미리보기 이미지 
        image.src = URL.createObjectURL(file);
        preview.appendChild(image); //이미지태그 그리기 

      }
      else alert('이미지파일만 업로드가능합니다');
    }
  }

}