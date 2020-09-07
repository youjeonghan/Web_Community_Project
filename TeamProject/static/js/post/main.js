const post_url = 'http://127.0.0.1:5000/api/post';
const file_upload_url = 'http://127.0.0.1:5000/api/postupload';

// 게시글 조회, 비동기함수 async는 await가 완료될때 까지 대기후 실행
async function load_post(){
    //board_url변수를 통해 json형식의 board정보를 boards변수에 저장
    try{
      const posts = await fetch_getJson(post_url);
      //게시판 tag 생성
      render_main(posts);//main 그려주기
      handle_Input()// 인풋창 리스너 
    } catch(error){
      console.log(error);
    } 
  }


////////// 입력창 크게//////////////
function input_post(){
  render_input();
  handle_submitPost(); //업로드 submit 리스너
  handle_drop();//drag & drop 리스너

}

//////////입력창 submit///////
async function submit_post(){
  try{
    const data = function(){//object객체에 입력정보 저장
      const input_subject = document.querySelector('.input__subject');
      const input_content = document.querySelector('.input__article');
      //객체 간소화해서 수정하기 
      let object = {
        subject : input_subject.value,
        content : input_content.value
      };
      input_subject.value = "";
      input_content.value = "";
      return object;  
    };
    await fetch_insert(data());
    handle_goMain();
  } catch(error){
    console.log(error);
  }

}

///////////////////////////////보드 확대/////////////////////////////
async function load_postinfo(){
  try{
    const id = location.hash.split('_');
    const json = await fetch_getJson(post_url +'/'+id[1]);
    render_postinfo(json);//post info 그려줌
  } catch(error){
    console.log(error);
  }

}


////////////////////////보드 삭제////////////////////////


async function delete_post(id){
  try{
    const json = await fetch_delete(post_url +'/'+id);
    handle_goMain();
  } catch(error){
    console.log(error);

  }
}


///////////////////////////수정////////////////////////////////


async function modify_post(id){//수정창을 만들어주는 함수 
   const json = await fetch_getJson(post_url + '/' + id);
   render_modify(json);
}

async function submit_modifyPost(){//수정창 제출 함수
  const event_id = event.currentTarget.id.split('__');
  const input__bigsubject = document.querySelector('.input__bigsubject');
  const input__bigarticle = document.querySelector('.input__bigarticle');
  let data = {
    subject : input__bigsubject.value,
    content : input__bigarticle.value,
    id : event_id[1]
  };
  await fetch_modify(event_id[1] , data);
  load_postinfo(data.id);
}

/////////////////파일업로드//////////////////
////////////이하 정리안됨///////////

function validFileType(file) {
  const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon"
  ];
  return fileTypes.includes(file.type);
}

function fetch_upload(id,files){//파일받아와서 
  const url = file_upload_url + '/' + id;
  const data = new FormData();
  data.append('file',files); //data에 파일연결 
  console.log(data);
  return fetch(url,{
    method: 'POST',
    body: data
  }).then(function(response) {
    if(response.ok){
      return alert("파일업로드 완료!");
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
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
    paint_preview(data.files,preview);
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

