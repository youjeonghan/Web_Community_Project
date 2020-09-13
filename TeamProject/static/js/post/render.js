//보드 게시판 title 랜더링 
function render_board(board){
  const ele = document.querySelector('.post_title');
  ele.firstChild.value = `${board.board_name} - 게시판`;
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
function render_postinfo(json){
  const post = document.querySelector('.post');
  const lists =  document.querySelector('.post__lists');
  const input = document.querySelector('.post__input');
  if(lists!==null)lists.parentNode.removeChild(lists);
  if(input!==null)input.parentNode.removeChild(input);
  const html = '<div class="post_info"> <div class = "post__bigsubject">'+`<h2> ${json.subject}</h2>`+'</div>'+ 
  '<div class = "post__bigarticle">'+'<p>'+json.content+'</p>'+'</div>'
  +
  '<div class = "post__bigothers">'+ '<p>'+json.create_date+'</p>'+
  '<input type="button" id = "deletePost__'+json.id+'" onclick="handle_delete();" value="삭제" />'+
  '<input type="button"  onclick="handle_goMain();" value="목록" />'+
  '<input type="button" id = "modifyPost__'+json.id+'" onclick="handle_modify();" value="수정" />'

  post.innerHTML = html;

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