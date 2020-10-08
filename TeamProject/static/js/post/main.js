// POST_PAGE_COUNT는 무한스크롤시 증가하는 페이지 넘버 , post 로드시에 초기화된다.
let POST_PAGE_COUNT = 1;
/*
  BOARD = 게시판
  POST = 게시글, 특히 전체조회, 포스트는 20개단위로 페이징 되고 , 맨아래로 내렸을때 다음페이지를 로드함
  POST_INFO = 게시글 크게보기 (post 전체보기에서 눌렀을때)
  render_ : 랜더링 함수 , render.js에 있음
  fetch_ : fetch api를 이용한 서버에서 데이터 받아오는 함수, fetch.js에 있음
  handle_ : 이벤트 리스너 부착함수 , event.js에 있음

  location.href로 링크 이동을하면 hash change이벤트가 발생하여 router.js의 router함수가 실행됨
  */
/*tag 생성기 , tage = tag명 A = 속성 ,B = 속성정보 , C= textNode*/
const get_htmlObject = (tag,A,B,C)=>{
  const object = document.createElement(`${tag}`);
  for (var i = 0; i <= A.length - 1; i++) {
    object.setAttribute(`${A[i]}`,`${B[i]}`);
  }
  if(C != undefined){
    const textNode = document.createTextNode(`${C}`);
    object.appendChild(textNode);
  }
  return object;
}

//post_title div에 해당하는 board(게시판)정보 조회 및  가공
async function load_board(hashValue){
  try{
    const board = await fetch_getBoard(hashValue[1]);//보드 정보 서버에서 받아옴
    render_board(board); //보드 정보 랜더링
    handle_clickTitle(); //클릭이벤트 부착
  }catch(error){
    console.log(error);
  }

}

//=========전체 post 조회하는 함수============
async function load_post(hashValue){

  try{
      POST_PAGE_COUNT =1;//페이지 넘버 초기화
      const data = await fetch_getPost(hashValue[1],POST_PAGE_COUNT++);//data는 fetch의 response객체를 반환
      const code = data.status;//데이터의 반환코드부분
      //post_info에서 다시 POST전체조회로 넘어오게될때 존재해야될 기본페이지 랜더링 요소 초기화
      if(document.querySelector('.post_input')==null)render_init();
       //전체게시판에서 넘어왔을경우 side_search가 가려져있는 것을 다시보이게함
       document.querySelector('.side_search').style.cssText ='display : block';
      render_inputOff();//인풋창 랜더링
      handle_Input()// 인풋창 이벤트 부착

      if(code == 204)render_lastpost();//마지막 post인경우 지막페이지 확인표시 랜더링
      else{
          const post = await data.json(); //데이터의 담긴 결과값을 json형식으로 변환
          document.querySelector('.post_lists').innerHTML = '';//포스트 전체 조회부분 초기화
          await render_main(post);//post들 랜더링
         //랜더링한 포스트의 개수가 20개이하일경우 마지막페이지 확인표시 랜더링
         if(post.length<20)render_lastpost();
       }
     } catch(error){
      console.log(error);
    }
  }


//============입력창 클릭시 크게만들어주는 함수===================
function input_post(){
  render_input();//입력창 랜더링
  handle_submitPost(); //업로드 submit 이벤트리스너
  handle_drop();//drag & drop 이벤트 리스너

}

//////////입력창 submit버튼을 눌렀을때 작동하는 함수 ///////
async function submit_post(){
  try{
    const input_subject = document.querySelector('.input__subject');
    const input_content = document.querySelector('.input__article');
    const user_data = await fetch_userinfo();   // 현재 로그인한 유저 정보 불러오기
    const board = await fetch_getBoard(location.hash.split('#')[1]);//현재 보드 정보 불러옴

    //위 변수들로 받아온 정보들을 하나의 object로 묶어서 복사함
    let object = {
      'userid' : user_data.id,
      'subject' : input_subject.value,
      'content' : input_content.value,
      'board_name' : board.board_name
    }
      /*묶은정보를 서버로보내고 만들어진 post정보를 반환
      (post의 id는 서버에서 만들어지면서 매겨지기때문에 다시받아봐야 알수있음)*/
      const post_id = await fetch_insert(object);
      return post_id;
    } catch(error){
      console.log(error);
    }

  }

///////////////////////////////post info/////////////////////////////
//게시글 개별 크게보기 함수
async function load_postinfo(hashValue){
  try{
    const json = await fetch_getPostInfo(hashValue[3]);//게시글id로 게시글하나 조회
    const user = await fetch_userinfo();//user id로 유저정보 조회
    render_postinfo(json,user.id);//post info 그려줌
    load_comment(json.id); //댓글리스트 불러옴
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
 handle_fileInputTag();//파일업로드관련 이벤트 부착
 handle_drop();//파일 드래그엔 드랍 이벤트 부착
 render_currentpreview(json.post_img_filename);//기존게시글에 이미지 있을때 이미지 미리보기에 해당이미지 그려줌
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
    const image_data = INPUT_DATA_FILE.return_files();//저장한 이미지 데이터 반환
      await fetch_update(event_id[1] , data);//텍스트업로드
      if(image_data !==null)await fetch_upload(event_id[1],image_data); // 이미지 업로드
    }

    const hashValue = location.hash.split('#');
    load_postinfo(hashValue);//해당 게시글 재조회
  }

//파일업로드 가능한 이미지파일인지 확장자구분하는 함수
function validFileType(file) {
  const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  ];
  return fileTypes.includes(file.type);
}

//서버에서 받아온 날짜를 가공해서 반환
function calc_date(cur_date){
  const cur_date_list = cur_date.split(' ');
  const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let cur_mont;
  month.forEach((e,index)=>{
    if(cur_date_list[2]==e)cur_month =  index+1;
  });

  const date = `${cur_date_list[3]}년 ${cur_month}월 ${cur_date_list[1]}일 `;
  return date;
}

/*=============무한스크롤 게시글 불러오기============
최상단에 선언된  POST_PAGE_COUNT으로 해당 페이지를 불러온다.
hashvalue에 따라서 페이지가 구분되므로 postmain 페이지일때 무한스크롤과
search일때로 나누어짐
*/
async function add_newPosts(hashValue){
  try{
    if(hashValue[2] == 'postmain'){
      const data = await fetch_getPost(hashValue[1],POST_PAGE_COUNT++);//페이지로드, 반환값은 response객체
      const code = data.status;
        if(code == 204)render_lastpost();  //마지막페이지일 경우 서버에서 204반환,내용에 데이터없음
        else {
          const post = await data.json();
          render_main(post);//받아온 데이터로 게시글 랜더링
        }


      }
      else if(hashValue[2] == 'search'){
        const data = await fetch_search(`${hashValue[3]}${POST_PAGE_COUNT++}`,hashValue[1]);
        const code = data.status;
        if(code == 204)render_lastpost(); //마지막페이지
        else {
          const post = await data.json();
          console.log(post);
          //전체 게시판에서의 검색일경우 함수 두번째인자에 1을 넘겨서 구분
          if(hashValue[1] == 'total') await render_main(post.returnlist,1);
          else render_main(post.returnlist);
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

/*=========댓글조회==========*/
async function load_comment(post_id){
  try{
    const json = await fetch_getComment(post_id,1);
    if(json != null)render_comment(json);
  }catch(error){
    console.log(error);
  }
}
/*=============댓글 입력하기============*/

async function input_comment(post_id){//post id 불러옴
  try{
    const ele = document.querySelector('.comment_value');
    const userdata = await  fetch_userinfo();
    const data = {
      'content' : ele.value,
      'userid' : userdata.id,
    }
    await fetch_commentInput(post_id,data);
    await load_comment(post_id);

    ele.value = '';
  }catch(error){
    console.log(error);
  }
}
/*=======댓글 수정버튼 누르고 처리 ====*/
async function update_comment(comment_id){//comment_id 불러옴
  try{
      render_commentUpdate(comment_id);
      }catch(error){
        console.log(error);
      }
    }
    /*=======댓글 수정 입력 제출  ====*/
async function update_commentSubmit(comment_id){//comment id 불러옴
  try{
    const userid = await  fetch_userinfo();
    const target = document.querySelector(`#comment_id_${comment_id}`);
    const text = target.querySelector('textarea').value;
    const data = {
      'comment_id' : comment_id,
      'content' : text,
      'userid' : userid.id,
    }
    await fetch_commentUpdate(id,data);//수정된 정보 전송
    await load_comment(location.hash.split('#')[3]);//댓글 재조회
    }catch(error){
      console.log(error);
    }
  }
  /*=======댓글 삭제 ====*/
  async function delete_comment(comment_id){
    try{
      const post_id = location.hash.split('#')[3];
      await fetch_commentDelete(post_id,{'comment_id' : comment_id});
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
    POST_PAGE_COUNT = 1;//페이지 카운트 초기화
    const data = await fetch_search(`${hashValue[3]}${POST_PAGE_COUNT++}`,hashValue[1]);//검색정보 전송
    const code = data.status;
    let board;
    //현재 전체검색이 아닌경우 보드정보를 불러오고 전체검색인경우 보드정보를 직접만듬
    if(hashValue[1]!='total')board = await fetch_getBoard(hashValue[1]);
    else board = {board_name : '전체',id : null};

    //파라미터를 url로 넘겨주면 urf-8로 디코딩 ,인코딩 해줘야함
    const title = decodeURI(hashValue[3].split('&')[1].split('=')[1]);

    //랜더링
    if(code == 204){//불러온 페이지가 없을경우 (검색결과가 없을경우 )
      render_init();
      const ele = document.querySelector('.post_input');
      const div = get_htmlObject('div',['class'],['search_result']
        ,`'${title}' ${ board.board_name} 게시판 검색결과가 없습니다.`);
      ele.appendChild(div);
      if(board.id==null){//전체게시판 검색일경우
        document.querySelector('.side_search').style.cssText ='display : none';
        document.querySelector('.post_title').querySelector('h1').textContent = `메인으로`;
      }
      render_lastpost();
    }
    else {
      const json = await data.json();
      await render_searchResult(title,board,json);
    }
    }catch(error){
      console.log(error);
    }
    }



// ===========파일 데이터 허브 클래스 ============

const file_dataHub = class {
  constructor(){
    this.data = null;//업로드할 파일 데이터
    this.maxnum = 5;//업로드 최대개수
    this.delete_img = null; //삭제할 파일 이름
  }
  append_file(files){//이미지파일 추가
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
  delete_file(id){//이미지 파일삭제

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
  delete_currentFile(filename){//삭제할 기존이미지 파일이름
    if(this.delete_img === null)this.delete_img = [filename];
    else{
      this.delete_img = [...this.delete_img,filename];
    }
    console.log(this.delete_img)
  }
  return_files(){//이미지 파일데이터를 form데이터에 담아서 반환
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
  reset_files(){//데이터 초기화
    this.data = null;
    this.delete_img = null;
  }
}
const INPUT_DATA_FILE = new file_dataHub();
