
function router(){
  const router_map = {
    '' : function(){//main페이지
      load_post()
    },
    'postinfo' : function(){//게시글 크게보기
      load_postinfo()
    },
    'input' : function(){
      input_post();
    }
  }
  const hashValue = location.hash.replace('#','');
  const hash = hashValue.split('_');//hash값 url의 id부분을 구분

  (router_map[hash[0]] || otherwise)();//구분된 hash부분 맵핑  
  
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