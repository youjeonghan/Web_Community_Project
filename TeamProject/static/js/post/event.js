
//===========보드 메인 포스트 페이지 ==========
function handle_goMain(){
  const board_id = location.hash.split('#')[1];
	location.href=`#${board_id}#postmain#1`; //페이지 이동
  // history.pushState(null, 'Go main', '/rooms/#');
  // router();

}
function handle_clickTitle(){
  const ele = document.querySelector('.post_title');
  ele.addEventListener('click',handle_goMain);
}

//===========보드 메인 포스트 인풋창  ==========
function handle_Input(){//인풋창
  const ele = document.querySelector('.input__off');
  ele.addEventListener('click',function(){
    input_post();
  });
}

function handle_inputOff(){
  render_inputOff();
  handle_Input();
}

function handle_submitPost(){//인풋창 submit

  const input = document.querySelector('.input_file');//파일 인풋 테그
  const preview = document.querySelector('.file_preview'); //파일 미리보기 태그
  const submit = document.getElementById('button_submit'); //파일 제출 버튼 태그

  submit.addEventListener('click',async function(){ // 제출 이벤트 리스너
   // const data = submit_post();
   const post = await submit_post();
   console.log(post.post_id);
   await fetch_upload(post.post_id,input.files);
   await location.reload();
 });
  input.addEventListener('change' , function(){//파일 미리보기 이벤트 리스너
    const curfiles = input.files; //현재 선택된 파일
    render_preview(curfiles, preview);
  });
}


//===========보드 Postinfo 페이지 ==========
function handle_postinfo(){//post info 창 페이지 이동
  const board_id = location.hash.split('#')[1];
  const event_id = event.currentTarget.id.split('__');
  location.href=`#${board_id}#postinfo#${event_id[1]}`; //페이지 이동
  // history.pushState(event_id[1], 'Go postinfo_', '/rooms/#postinfo');
  // router();
}

function handle_delete(){//post info삭제
 const confirmflag = confirm("삭제하시겠습니까?");
 const post_id = location.hash.split('#')[3];
 if(confirmflag) delete_post(post_id);
}

function handle_update(){// post info수정
  const event_id = event.currentTarget.id.split('__');
  update_post(event_id[1]);
}


//===========게시글 로딩 이벤트 ==========
function handle_scrollLoading(hashValue){
  window.addEventListener('scroll', () => {
  let scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
  let windowHeight = window.innerHeight; // 스크린 창
  let fullHeight = document.body.scrollHeight; //  margin 값은 포함 x
  if(scrollLocation + windowHeight >= fullHeight){
   add_newPosts(hashValue);
 }
  this.removeEventListener("scroll",arguments.callee); //이벤트 제거
});
}

//////////////////////////drag&drop/////////////////////////////
function handle_drop(){//drag&drop

  const drop_zone = document.getElementById('drag_drop'); //드레그&드롭 드롭존 태그

  drop_zone.addEventListener('dragenter',function(event) { //드래그 드롭존위에서 점선표시
    // const text = document.createElement('div');
    // text.value = '첨부할 이미지를 끌어놓으세요';
    // drop_zone.appendChild(text);
    drop_zone.style.cssText = "border: 3px dashed gray;";
  });

  drop_zone.addEventListener('dragleave',function(event) {//드래그 드롭존 밖에서  점선제거
    drop_zone.style.cssText = "border: 0px;";

  });

  drop_zone.addEventListener('dragover',function(event) {
    event.preventDefault(); // 이 부분이 없으면 ondrop 이벤트가 발생하지 않습니다.
  });

  drop_zone.addEventListener('drop', function(event) {
    event.preventDefault(); // 이 부분이 없으면 파일을 브라우저 실행해버립니다.
    var data = event.dataTransfer;
    const MAX_FILE = 5;
    const preview = document.querySelector('.file_preview'); //파일 미리보기 태그
    render_preview(data.files,preview);
    drop_zone.style.cssText = "border: 0px;";
    fetch_upload(data.files);
    // if(data.items.length > MAX_FILE){
    //   alert(`이미지는 최대 ${MAX_FILE}개 까지 등록가능합니다`);
    //   return;
    // }
    // if (data.items) { // DataTransferItemList 객체 사용
    //   for (var i = 0; i < data.items.length; i++) { // DataTransferItem 객체 사용
    //     if (data.items[i].kind == "file") { //kind는 file인지 string인지 알려준다
    //       var file = data.items[i].getAsFile();
    //       alert(file.name);
    //     }
    //   }
    // } else { // File API 사용
    //   for (var i = 0; i < data.files.length; i++) {
    //     alert(data.files[i].name);
    //   }
    // }
  });

}

//==========신고 이벤트===========//

function handle_report(){

}

function handle_likes(){
  const target =  event.currentTarget;
  const post_id =target.id.split('_')[2];
  let like_num = target.value.split(' ')[1];
  like_num *= 1;//*= 형변환 int
  const check = add_likes('post',post_id,like_num);
  if(check == true){
    target.value = `추천 ${like_num+1}`;
    target.style.cssText = "background-color : lightblue";
  }
  else{
    alert("이미추천한 게시글입니다~");
    //오류처리할것
  }

}

function handle_mail(){

}
function handle_commentInsert(){
  const post_id = event.currentTarget.id.split('_')[2];
  input_comment(post_id);
}
function handle_commentDelete(){
  const comment_id = event.currentTarget.id.split('__')[1];
  delete_comment(comment_id);
}
function handle_commentUpdate(){
  console.log("수정창");
  const comment_id = event.currentTarget.id.split('__')[1];
  update_comment(comment_id);
}
const handle_commnetUpdateSubmit = ()=>{
  const comment_id = event.currentTarget.id.split('__')[1];
  update_commentSubmit(comment_id);
}
function handle_Commentlikes(){
  const target =  event.currentTarget;
  const post_id =target.id.split('_')[2];
  let like_num = target.value.split(' ')[1];
  like_num *= 1;//*= 형변환 int
  const check = add_likes('post',post_id,like_num);
  if(check == true){
    target.value = `추천 ${like_num+1}`;
    target.style.cssText = "background-color : lightblue";
  }
  else{
    alert("이미추천한 게시글입니다~");
    //오류처리할것
  }
}
function handle_Commentreport(){
  console.log('신고');
}

(function handle_goTop(){
  const ele = document.querySelector('.post_goTop');
  ele.addEventListener('click',function(){
    window.scrollTo({top : 0, behavior : 'smooth'});
  });
})();

(function handle_search (){

  const ele = document.querySelector('.side_search');
  ele.querySelector('button').addEventListener('click',function(){
    const data = {
      'searchType' : ele.querySelector('select').value,
      'text' :   ele.querySelector('input').value,
      'pageNumber' : 1
    }
    location.href=`#total#search#search_type=${data.searchType}&input_value=${data.text}&page=${data.pageNumber}`; //페이지 이동
  });

  const ele2 = document.querySelector('.search_bar');
  ele2.querySelector('button').addEventListener('click',function(){
    const data = {
      'searchType' : ele2.querySelector('select').value,
      'text' :   ele2.querySelector('input').value,
      'pageNumber' : 1
    }
    location.href=`#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=${data.pageNumber}`; //페이지 이동
  });

})();