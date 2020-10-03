
//===========보드 메인 포스트 페이지 ==========
function handle_goMain(){
  const board_id = location.hash.split('#')[1];
	location.href=`#${board_id}#postmain`; //페이지 이동
  // history.pushState(null, 'Go main', '/rooms/#');
  // router();

}
function handle_clickTitle(){
  const ele = document.querySelector('.post_title');
  ele.addEventListener('click',function(){
    if(location.hash.split('#')[1] == 'total'){
      location.href = 'http://127.0.0.1:5000/';
    }
    else handle_goMain();
  });
}

//===========보드 메인 포스트 인풋창  ==========
function handle_Input(){//인풋창

  const ele = document.querySelector('.input__off');
  ele.addEventListener('click',async function(){
  const token = sessionStorage.getItem('access_token');
  if(token === null){
    alert('로그인을 먼저 해주세요');
    return null;
  }
    await input_post();
    handle_fileInputTag();
  });
}

function handle_inputOff(){
  render_inputOff();
  handle_Input();
}

function handle_submitPost(){//인풋창 submit

  // const input = document.querySelector('.input_file');//파일 인풋 테그
  // const preview = document.querySelector('.file_preview'); //파일 미리보기 태그
  const submit = document.getElementById('button_submit'); //파일 제출 버튼 태그

  submit.addEventListener('click',async function(){ // 제출 이벤트 리스너
   // const data = submit_post();

  const post = await submit_post();
  const image_data = INPUT_DATA_FILE.return_files();
  console.log(image_data !== null);
  if(image_data !== null)await fetch_upload(post.post_id,image_data);
  await location.reload();
 });
  // input.addEventListener('change' , function(){//파일 미리보기 이벤트 리스너
  //   const curfiles = input.files; //현재 선택된 파일
  //   render_preview(curfiles, preview);
  // });
}
function handle_fileInputTag(){

    const input = document.querySelector('.file_input').querySelector('input');
    console.log(input);
    input.addEventListener('change' , function(){//파일 미리보기 이벤트 리스너
      INPUT_DATA_FILE.append_file(input.files);
  });
}
function handle_inputFileDelete(){
  const ele = document.querySelectorAll('.previewimageItem_button');
  for(const value of ele){
    value.addEventListener('click',function(){//이미지 업로드시 파일 지우기
      const index = event.currentTarget.id.split('__')[1];
      INPUT_DATA_FILE.delete_file(index);
    });
  }
}
function handle_currentFileDelete(){
  const ele = document.querySelectorAll('.currentPreviewImageItem_button');
  for(const value of ele){
    value.addEventListener('click',function(){//이미지 업로드시 파일 지우기
      const filename = event.currentTarget.id.split('__')[1];
      INPUT_DATA_FILE.delete_currentFile(filename);
      const delete_node = value.parentNode;
      delete_node.parentNode.removeChild(delete_node);

    });
  }
}
//===========보드 Postinfo 페이지 ==========
function handle_postinfo(){//post info 창 페이지 이동
  // const board_id = location.hash.split('#')[1];
  const id = event.currentTarget.id.split('__');
  location.href=`#${id[1]}#postinfo#${id[2]}`; //페이지 이동
  // history.pushState(event_id[1], 'Go postinfo_', '/rooms/#postinfo');
  // router();
}

function handle_delete(){//post info삭제
 const confirmflag = confirm("삭제하시겠습니까?");
 const post_id = location.hash.split('#')[3];
 if(confirmflag) delete_post(post_id);

}

async function handle_update(){// post info수정
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
    drop_zone.style.cssText = "border: border: 3px dashed lightgray;";

  });

  drop_zone.addEventListener('dragover',function(event) {
    event.preventDefault(); // 이 부분이 없으면 ondrop 이벤트가 발생하지 않습니다.
    drop_zone.style.cssText = "border: 3px dashed gray;";
  });

  drop_zone.addEventListener('drop', function(event) {
    event.preventDefault(); // 이 부분이 없으면 파일을 브라우저 실행해버립니다.
    const data = event.dataTransfer;
    const MAX_FILE = 5;
    drop_zone.style.cssText = "border: 3px dashed lightgray;";
    INPUT_DATA_FILE.append_file(data.files); //파일 객체에 추가
});
}
//==========신고 이벤트===========//

function handle_report(){
  const token = sessionStorage.getItem('access_token');
  if(token === null){
    alert('로그인을 먼저 해주세요');
    return null;
  }
  submit_report();
}

function handle_likes(){
  const token = sessionStorage.getItem('access_token');
  if(token === null){
    alert('로그인을 먼저 해주세요');
    return null;
  }
  const target =  event.currentTarget;
  const post_id =target.id.split('_')[2];
  let like_num = target.value.split(' ')[1];
  like_num *= 1;//*= 형변환 int
  const check = add_likes('post',post_id,like_num);
  if(check == true){
    target.value = `추천 ${like_num+1}`;
    target.style.cssText = "background-color : var(--point)";
    target.style.cssText = "color : var(--component)";
  }

}

function handle_mail(){

}
async function handle_commentInsert(){
  const token = sessionStorage.getItem('access_token');
  if(token === null){
    alert('로그인을 먼저 해주세요');
    return null;
  }

  const post_id = event.currentTarget.id.split('_')[2];
  await input_comment(post_id);
  const footer = document.querySelector('.footer').offsetTop;
  window.scrollTo({top : footer, behavior : 'smooth'});
  // setTimeout(()=>{
  //   const footer = document.querySelector('.footer').offsetTop;
  //   window.scrollTo({top : footer, behavior : 'smooth'});
  //   document.querySelector('.comment_list').lastChild.style.cssText = 'border : 1px solid'
  // },500);
}
function handle_commentDelete(){

  const confirmflag = confirm("삭제하시겠습니까?");
  const comment_id = event.currentTarget.id.split('__')[1];
  if(confirmflag)delete_comment(comment_id);
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
    const token = sessionStorage.getItem('access_token');
  if(token === null){
    alert('로그인을 먼저 해주세요');
    return null;
  }
  const target =  event.currentTarget;
  const comment_id =target.id.split('_')[2];
  let like_num = target.value.split(' ')[1];
  like_num *= 1;//*= 형변환 int
  const check = add_likes('comment',comment_id,like_num);
  if(check == true){
    target.value = `추천 ${like_num+1}`;
    target.style.cssText = "background-color : var(--point)";
    target.style.cssText = "color : var(--component)";
  }
}
function handle_Commentreport(){
  const token = sessionStorage.getItem('access_token');
  if(token === null){
    alert('로그인을 먼저 해주세요');
    return null;
  }
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
    const input = ele.querySelector('input')
    const data = {//검색한 내용에대한 데이터
      'searchType' : ele.querySelector('select').value,
      'text' :   input.value,
      'pageNumber' : 1
    }
    input.value = '';//검색창 초기화
    const board_id = location.hash.split('#')[1];
    //데이터를 param화 해서 페이지이동
    location.href=`#${board_id}#search#search_type=${data.searchType}&input_value=${data.text}&page=${data.pageNumber}`; //페이지 이동
  });

  const ele2 = document.querySelector('.search_bar');
  ele2.querySelector('button').addEventListener('click',function(){
    const input = ele2.querySelector('input')
    const data = {
      'searchType' : ele2.querySelector('select').value,
      'text' :   input.value,
      'pageNumber' : 1
    }
    input.value = '';//검색창 초기화
    location.href=`#total#search#search_type=${data.searchType}&input_value=${data.text}&page=${data.pageNumber}`; //페이지 이동
  });

})();

// function handle_GoBoardLink(board_link){

//     board_link.addEventListener('click',function(){
//       const id = event.currentTarget.id.split('__')[1];
//       location.href=`#${id}#postmain`;
//     });
// }