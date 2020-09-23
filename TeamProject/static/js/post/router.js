
/*===========URL 라우팅 형식=========
게시판 메인화면 : /post#board_id#postmain
게시글 클릭시 : /post#board_id#postinfo#post_id
===================================*/

  /*====================================
  hashValue[0] : 값없음 ,
   [1] : 게시판 id
   [2] : 화면구분
   [3] : 게시판 클릭시의 게시글 아이디
   =======================================*/
  function router(){
    const hashValue = location.hash.split('#');
    const router_map = {
      'postmain' : async function(){//게시판별 메인페이지
        await load_board(hashValue);
        await load_post(hashValue);
        await load_bestPost();
        await handle_scrollLoading(hashValue);
      },
      'postinfo' : async function(){//게시글 크게보기
        await load_board(hashValue);
        await load_postinfo(hashValue);
        await load_bestPost();
      },

    }
    // setTimeout((router_map[hashValue[2]] || otherwise)(),0);//구분된 hash부분 맵핑
    router_map[hashValue[2]]() || otherwise();//구분된 hash부분 맵핑
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
