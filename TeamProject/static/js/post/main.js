let POST_PAGE_COUNT = 2;
//보드 게시판 정보 조회 
async function load_board(hashValue){
  try{
    const board = await fetch_getBoard(hashValue[1]);
    render_board(board);
  }catch(error){
    console.log(error);
  }

}

// 게시글 조회, 비동기함수 async는 await가 완료될때 까지 대기후 실행
async function load_post(hashValue){
    //변수를 통해 json형식의 post정보를 posts변수에 저장
    try{
      const posts = await fetch_getPost(hashValue[1],1);
      //게시판 tag 생성
      if(document.querySelector('.post_input')==null)render_init();
      render_inputOff();
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
// /*========오류구문 함수======== */
// function check_error(error){
//   const error_map = {
//     '422' : function(){ //애러 종류 
//       alert("로그인을 먼저 해주세요 ");
//     }
//   }
//   const error_otherwise =()=>alert("HTTP-ERROR: " + response.status);
//   (error_map[error]||error_otherwise)();
//   handle_goMain();
// }
//////////입력창 submit///////
async function submit_post(){
  try{
      const input_subject = document.querySelector('.input__subject');
      const input_content = document.querySelector('.input__article');
      const user_data = await fetch_userinfo();   // 유저 정보 불러오기
      // if(typeof(user_data)=="number"){
      //   check_error(user_data);
      // }
      const board = await fetch_getBoard(location.hash.split('#')[1]);//임시 예시 
      //객체 간소화해서 수정하기
      let object = {
        //유저아이디랑 보드 네임이필요함
        'userid' : user_data.userid,
        'subject' : input_subject.value,
        'content' : input_content.value,
        'board_name' : board.board_name
      }
      input_subject.value = "";
      input_content.value = "";
      await fetch_insert(object);
      location.reload();
  } catch(error){
    console.log(error);
  }

}

///////////////////////////////(post info)/////////////////////////////
async function load_postinfo(hashValue){
  try{
    const json = await fetch_getPostInfo(hashValue[3]);//게시글id
    render_postinfo(json);//post info 그려줌
    load_comment(json.id); //댓글리스트 그려줌
  } catch(error){
    console.log(error);
  }

}

/*=========댓글 창==========*/

async function load_comment(post_id){
  try{
    const json = await fetch_getComment(post_id);
    render_comment(json);
  }catch(error){
    console.log(error);
  }
}
////////////////////////보드 삭제////////////////////////


async function delete_post(id){
  try{
    const json = await fetch_delete(id);
    handle_goMain();
  } catch(error){
    console.log(error);

  }
}


///////////////////////////수정////////////////////////////////


async function update_post(id){//수정창을 만들어주는 함수 
 const json = await fetch_getPostInfo(id);
 render_update(json);
}

async function submit_updatePost(){//수정창 제출 함수
  const event_id = event.currentTarget.id.split('__');
  const update_subject = document.querySelector('.update_subject');
  const update_article = document.querySelector('.update_article');
  let data = {
    'subject' : update_subject.value,
    'content' : update_article.value,
    'id' : event_id[1]
  };
  await fetch_update(event_id[1] , data);
  const hashValue = location.hash.split('#');
  load_postinfo(hashValue);
}

/////////////////파일업로드//////////////////


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







//날짜 string 반환 
function calc_date(cur_date){
  const cur_date_list = cur_date.split(' ');
  const date = cur_date_list[1] +' '+ cur_date_list[2] +' '+ cur_date_list[3]; 
  return date;
}




/*=======유저정보 불러오는 함수=========*/
function get_userdata(){
  return {
    'id': 1,
    'password': 1234,
    'userid': 1,
    'username': '칭따오',
    'nickname': '워싱..',
    'email': 'mrhong@gmail.com',
    'image_url': "../static/img/among_icon.jpg"
  }
}

async function add_newPosts(hashValue){
  try{
    const data = await fetch_getNewPost(hashValue[1],POST_PAGE_COUNT++);
    if(data == null)return; //마지막페이지
    render_newPost(data);
    handle_scrollLoading();
  }catch(error){
    console.log(error);
  }
}

const add_likes = (object,id,num)=>{
  try{
    const object_map ={
      'post' : async function(){
        await fetch_postLikes(id);
      },
      'comment' :async function(){
       await fetch_commentLikes(id);
      }
    }
    object_map[object]();
    return true;
  }catch(error){
    console.log(error);
    return false;
  }

}

async function input_comment(id,value){
  try{
      const userid = await  fetch_userinfo();
      const data = {
        'content' : value,
        'userid' : userid.userid
      }
      await fetch_commentInput(id,data);

  }catch(error){
    console.log(error);
  }
}