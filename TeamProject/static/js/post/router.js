
/*===========URL 라우팅 형식=========
게시판 메인화면 : /post#board_name#board_id#postmain#page
게시글 클릭시 : /post/#board_name#board_id#postinfo#post_id
게시판 메인 입력창 : /post/#board_name#board_id#input
===================================*/

  /*===== hashValue[0] : 값없음 ,
   [1] : 게시판 이름
   [2] : 게시판 id
   [3] : 화면구분 id / 페이지번호 or 게시판 클릭 or 게시판 입력창
   [4] : 게시판 클릭시의 게시글 아이디 
   =================*/

   let router_value;//페이지가 만들어질때마다 만들어지는 라우터 전역변수(객체)
  
   class router{//변수에 넣을 클래스 나중에 
    constructor(hashValue){
      this.name = name;
      this.age = age;
      this.power = 100;
    }
  }

  function router(){
    const hashValue = location.hash.split('#');
    const router_map = {
    'postmain' : function(){//게시판별 메인페이지
      load_board(hashValue[1]);
      load_post(hashValue);
    },
    'postinfo' : function(){//게시글 크게보기
      load_postinfo(hashValue);
    },
    'input' : function(){
      input_post(hashValue);//게시글 입력창 on
    }
  }

  (router_map[hashValue[3]] || otherwise)();//구분된 hash부분 맵핑  
  
}

function otherwise() {
 alert("페이지를 찾지못했습니다");
       //404페이지 구현 
     }

window.addEventListener('DOMContentLoaded', router); //처음불러올때 감지
window.addEventListener('hashchange', router);//hash  url이 이동되면 감지
// window.addEventListener('popstate', function () {
//   console.log('popstate', history.state);
//   // document.querySelector('#state').innerHTML = JSON.stringify(history.state);
// });