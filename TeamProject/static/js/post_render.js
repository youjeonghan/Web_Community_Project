//게시판 글 태그 만들기 
const MAIN = "#";
const BIG_BOARD = "#info";

function render_main(posts){
  document.querySelector('.Board').innerHTML = '<div class="Board__title"><h1>모임이름 - 게시판</h1> </div>'+
  '<div class="Board__input">'+'<div class = "input__off"> 게시글을 작성해보세요 </div></div>' +
  '<div class="Board__lists"></div>';
  let text ='';
  for (var i = posts.length-1; i >=0; i--) {
    text += render_post(posts[i]);
  }
  document.querySelector('.Board__lists').innerHTML = text;

}

function render_post(post){
  const post_html =   
  `<section class="board__lists__item" id = "posts__${post.id}" onclick ="handle_postinfo()">`+
  '<h3>'+post.subject+'</h3>'+ '<hr>'+
  '<p>'+post.content+'</p>' +
  '<ul>'+
  '<li>'+post.create_date+'</li>'+
  '</ul>'+'</section>'; 
  return post_html;
}

//입력창 만들기//
function render_input(){
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
  '<input type="button"  onclick="handle_goMain();" value="X" /></div>'

  const ele = document.querySelector('.Board__input');
  ele.style.height=400 +'px'; //입력창 크기 변환
  ele.innerHTML = html;

}


//게시글 상세보기 
function render_postinfo(json){
  const post = document.querySelector('.Board');
  const lists =  document.querySelector('.Board__lists');
  const input = document.querySelector('.Board__input');
  lists.parentNode.removeChild(lists);
  input.parentNode.removeChild(input);
  const html = '<div class="input__big"> <div class = "board__bigsubject">'+`<h2> ${json.subject}</h2>`+'</div>'+ //templates literal 적용 
  '<div class = "board__bigarticle">'+'<p>'+json.content+'</p>'+'</div>'
  +
  '<div class = "board__bigothers">'+ '<p>'+json.create_date+'</p>'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_delete();" value="삭제" />'+
  '<input type="button"  onclick="handle_goMain();" value="목록" />'+
  '<input type="button" id = "bigboard__'+json.id+'" onclick="handle_modify();" value="수정" />'

  post.innerHTML = html;

}


