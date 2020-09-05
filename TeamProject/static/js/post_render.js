//게시판 글 태그 만들기 
function paint_board(board){
  const board_html =   
  '<section class="board__lists__item" id = "board__'+ board.id + '" onclick = "load_bigboard()">'+
  '<h3>'+board.subject+'</h3>'+ '<hr>'+
  '<p>'+board.content+'</p>' +
  '<ul>'+
  '<li>'+board.create_date+'</li>'+
  '</ul>'+'</section>'; 
  return board_html;
}

//입력창 만들기//
function paint_input(){
  const html = '<div class="input__on" id = "drag_drop"><input type="text" placeholder="글 제목을 입력해주세요" class="input__subject">' +
  '<textarea name="article" class="input__article" placeholder="내용을 입력하세요"></textarea>' +
  '<div class = "input__buttons">'+
//file input에 label 붙임 
'<form method="post" enctype="multipart/form-data"><div class = "file_input">'+
'<label for="upload_file">'+
'<img src  = "https://img.icons8.com/small/32/000000/image.png"/></label>'+
'<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div>'+
  //accept 허용파일 , multilple  다수 파일입력가능 
  '<div class = "file_preview"> <img> </div></form>'+
  '<input type="button"  id = "button_submit" value="SUBMIT" />'+
  '<input type="button"  onclick="hide_input();" value="X" /></div>'

  const ele = document.querySelector('.Board__input');
  ele.style.height=400 +'px'; //입력창 크기 변환
  ele.innerHTML = html;
  handle_upload(); //업로드 리스너
  handle_drop();//drag & drop 리스너
}

//입력창 숨기기//
function hide_input(){
  const html ='<div class = "input__off"><textarea placeholder="게시글을 작성해보세요" onclick="paint_input()"></textarea></div>';
  const ele = document.querySelector('.Board__input');
  ele.style.height=40 +'px';
  ele.innerHTML = html;
}

//게시글 상세보기 
function paint_bigboard(json){
  const ele =  document.querySelector('.Board');
  ele.innerHTML = '';
  const html = '<div class="Board__title"><h1>모임이름 - 게시판</h1> </div>'+
  '<div class="input__big"> <div class = "board__bigsubject">'+`<h2> ${json.subject}</h2>`+'</div>'+ //templates literal 적용 
  '<div class = "board__bigarticle">'+'<p>'+json.content+'</p>'+'</div>'
  +
  '<div class = "board__bigothers">'+ '<p>'+json.create_date+'</p>'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_delete();" value="삭제" />'+
  '<input type="button"  onclick="reload_board();" value="목록" />'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_modify();" value="수정" />'


  ele.innerHTML = ''; //초기화 다지우기 
  ele.innerHTML = html;
}


