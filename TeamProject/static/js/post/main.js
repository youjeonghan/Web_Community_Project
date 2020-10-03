let POST_PAGE_COUNT = 1;
//보드 게시판 정보 조회
async function load_board(hashValue){
  try{
    const board = await fetch_getBoard(hashValue[1]);
    render_board(board);
    handle_clickTitle();
  }catch(error){
    console.log(error);
  }

}


async function load_post(hashValue){
    //변수를 통해 json형식의 post정보를 posts변수에 저장
    try{
      POST_PAGE_COUNT =1;
      const data = await fetch_getPost(hashValue[1],POST_PAGE_COUNT++);

      const code = data.status;
      //게시판 tag 생성
      if(document.querySelector('.post_input')==null)render_init();
      document.querySelector('.side_search').style.cssText ='display : block';//전체게시판에서 넘어왔을경우

      if(code == 204)render_lastpost();
      else{
        const post = await data.json();
        render_inputOff();
        await render_main(post);//main 그려주기
        handle_Input()// 인풋창 리스너
        if(post.length<20)render_lastpost();
      // window.addEventListener('scroll', handle_scrollHeight);
      // SCROLLFLAG = false
    }
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
      const board = await fetch_getBoard(location.hash.split('#')[1]);
      //객체 간소화해서 수정하기
      let object = {
        //유저아이디랑 보드 네임이필요함
        'userid' : user_data.id,
        'subject' : input_subject.value,
        'content' : input_content.value,
        'board_name' : board.board_name
      }
      input_subject.value = "";
      input_content.value = "";
      const post_id = await fetch_insert(object);
      return post_id;
    } catch(error){
      console.log(error);
    }

  }

///////////////////////////////(post info)/////////////////////////////
async function load_postinfo(hashValue){
  try{
    const json = await fetch_getPostInfo(hashValue[3]);//게시글id
    //user 정보 불러와서 id 값 같이 넘겨줌
    const user = await fetch_userinfo();
    render_postinfo(json,user.id);//post info 그려줌
    load_comment(json.id); //댓글리스트 그려줌
  } catch(error){
    console.log(error);
  }

}


////////////////////////post 삭제////////////////////////


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
 await render_update(json);
 handle_fileInputTag();
 handle_drop();
 render_currentpreview(json.post_img_filename);
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
  const token = sessionStorage.getItem('access_token');
  if(token === null)alert('로그인을 먼저 해주세요');
  else{
    const image_data = INPUT_DATA_FILE.return_files();
      await fetch_update(event_id[1] , data);//텍스트업로드
      if(image_data !==null)await fetch_upload(event_id[1],image_data); // 이미지 업로드
    }

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
  const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
  ]
  let cur_mont;
  month.forEach((e,index)=>{
    if(cur_date_list[2]==e)cur_month =  index+1;
  });

  const date = `${cur_date_list[3]}년 ${cur_month}월 ${cur_date_list[1]}일 `;
  return date;
}




/*=======유저정보 불러오는 함수=========*/
// function get_userdata(){
//   return {
//     'id': 1,
//     'password': 1234,
//     'userid': "유저2",
//     'username': '칭따오',
//     'nickname': '워싱..',
//     'email': 'mrhong@gmail.com',
//     'profile_img': "../static/img/among_icon.jpg"
//   }
// }
/*=============무한스크롤 게시글 불러오기============*/
async function add_newPosts(hashValue){
  try{
    // window.removeEventListener("scroll",handle_scrollHeight);
    if(hashValue[2] == 'postmain'){
      const data = await fetch_getPost(hashValue[1],POST_PAGE_COUNT++);
      const code = data.status;
        if(code == 204)render_lastpost();  //마지막페이지
        else {
          const post = await data.json();
          render_main(post);
          // window.addEventListener('scroll', handle_scrollHeight);
          // SCROLLFLAG = false;
        }


      }
      else if(hashValue[2] == 'search'){
        const data = await fetch_search(`${hashValue[3]}${POST_PAGE_COUNT++}`,hashValue[1]);
        const code = data.status;
        if(code == 204)render_lastpost(); //마지막페이지
        else {
          const post = await data.json();
          // window.addEventListener('scroll', handle_scrollHeight);
          // SCROLLFLAG = false;
          console.log(post);
          await render_main(post.returnlist,1);
          const board_link = document.querySelectorAll('.post_board');
          board_link.forEach(item=>item.style.cssText = 'display : block');
        }

    }

  }catch(error){
    console.log(error);
  }
}


/*=============좋아요 추가하기 ============*/

const add_likes = async (object,id)=>{
  try{
    let check = false;
    const object_map ={
      'post' : async function(){
        check = await fetch_postLikes(id);
      },
      'comment' :async function(){
       check = await fetch_commentLikes(id);
     }
   }
   await object_map[object]();
   return check;
 }catch(error){
  console.log(error);
}
}

//===========신고 하기 ==========
const add_report = async (object,id)=>{
  try{
    let check = false;
    const object_map ={
      'post' : async function(){
        check = await fetch_postReport(id);
      },
      'comment' :async function(){
       check = await fetch_commentReport(id);
     }
   }
   await object_map[object]();
   return check;
 }catch(error){
  console.log(error);
}
}

/*=========댓글 창==========*/
async function load_comment(post_id){
  try{
    const json = await fetch_getComment(post_id,1);
    if(json != null)render_comment(json);
  }catch(error){
    console.log(error);
  }
}
/*=============댓글 입력하기============*/

async function input_comment(id){//post id 불러옴
  try{
    const ele = document.querySelector('.comment_value');
    const userdata = await  fetch_userinfo();
    const data = {
      'content' : ele.value,
      'userid' : userdata.id,
    }
    await fetch_commentInput(id,data);
    await load_comment(id);

    ele.value = '';
  }catch(error){
    console.log(error);
  }
}
/*=======댓글 수정버튼 누르고 처리 ====*/
async function update_comment(id){//comment id 불러옴
  try{
      /*1. 수정 버튼을눌럿을때 텍스트 입력창이나와야ㅏ함
        2. 텍스트입력창이나오면 수정삭제 - > 완료 삭제 로 바뀌어야함
        3. 완료 버튼을 눌렀을때의 이벤트처리를 해야함 */
        render_commentUpdate(id);
      }catch(error){
        console.log(error);
      }
    }
    /*=======댓글 수정 입력 제출  ====*/
async function update_commentSubmit(id){//comment id 불러옴
  try{
    const userid = await  fetch_userinfo();
    const target = document.querySelector(`#comment_id_${id}`);
    const text = target.querySelector('textarea').value;
    const data = {
      'comment_id' : id,
      'content' : text,
      'userid' : userid.id,
    }

    await fetch_commentUpdate(id,data);
      //전체를 다시그리고 해당위치로 스크롤
      await load_comment(location.hash.split('#')[3]);

    }catch(error){
      console.log(error);
    }
  }
  /*=======댓글 삭제 ====*/
  async function delete_comment(id){
    try{
      const post_id = location.hash.split('#')[3];
      await fetch_commentDelete(post_id,{'comment_id' : id});
      await load_comment(location.hash.split('#')[3]);
    }catch(error){
      console.log(error);
    }
  }


/*=============================사이드바 =========================*/
// 베스트 게시글 불러오기
async function load_bestPost(){
  try{
    const board_id = location.hash.split('#')[1];
    const data = await fetch_getBestPost(board_id);
    if(data != null){
      render_bestPost(data);
    }
  }catch(error){
    console.log(error);
  }
}

/*===================검색 화면===================*/
async function load_searchpost(hashValue){
  try{
    console.log(hashValue[3]);
    POST_PAGE_COUNT = 1;
    const data = await fetch_search(`${hashValue[3]}${POST_PAGE_COUNT++}`,hashValue[1]);
    const code = data.status;
    let board;
    if(hashValue[1]!='total')board = await fetch_getBoard(hashValue[1]);
    else board = {board_name : '전체',id : null};
        //파라미터를 url로 넘겨주면 urf-8로 디코딩 ,인코딩 해줘야함
        const title = decodeURI(hashValue[3].split('&')[1].split('=')[1]);
        //랜더링
        if(code == 204)render_lastpost();
        else {
          const json = await data.json();
          await render_searchResult(title,board,json);
          if(json.returnlist.length<20)render_lastpost();
          // window.addEventListener('scroll', handle_scrollHeight);
            // SCROLLFLAG = false;
        }
      }catch(error){
        console.log(error);
      }
    }
//로딩이미지

// ===========파일 데이터 허브 클래스 ============

const file_dataHub = class {
  constructor(){
    this.data = null;
    this.maxnum = 5;
    this.delete_img = null;
  }
  append_file(files){
    if(this.data === null){
      if(files.length>5){
        alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`);
        return;
      }
      this.data = files;
    }
    else{
      if(this.data.length + files.length>this.maxnum){
        alert(`이미지는 최대 ${this.maxnum}개 까지 등록가능합니다`);
        return;
      }
      this.data = [...this.data,...files]; //data에 파일연결 spread syntax
    }
    render_preview(this.data);

  }
  delete_file(id){

    if(this.data.length == 1)this.data = null;
    else{
      let new_data=[];
      let cnt=0;
      for (let i = 0; i < this.data.length; i++) {
        if(i!=id)new_data[cnt++] = this.data[i];
      }
      this.data = new_data;
    }
    render_preview(this.data);
  }
  delete_currentFile(filename){
    if(this.delete_img === null)this.delete_img = [filename];
    else{
      this.delete_img = [...this.delete_img,filename];
    }
    console.log(this.delete_img)
  }
  return_files(){
    if(this.data !== null && this.delete_img !=null)return null;
    const form = new FormData();
    if(this.data !== null){
      for (const value of this.data){
        form.append('file',value);
      }
    }
    if(this.delete_img !=null){
      for (const value of this.delete_img){
        form.append('delete_img',value);
      }
    }

    return form;
  }
  reset_files(){
    this.data = null;
    this.delete_img = null;
  }
}
const INPUT_DATA_FILE = new file_dataHub();
