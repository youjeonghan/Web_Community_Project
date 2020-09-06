
function router(){
  let id;//post id
  const router_map = {
    '' : function(){//main페이지
      load_post()
    },
    'postinfo' : function(){//게시글 크게보기
      load_postinfo(id)
    },
    'input' : function(){
      input_post();
    }
  }
  const hashValue = location.hash.replace('#', '');
  const hash = hashValue.split('_');//hash값 url의 id부분을 구분
  id = hash[1];//구분된 id부분 저장
  (router_map[hash[0]] || otherwise)();//구분된 hash부분 맵핑  
  
}

function otherwise() {
       alert("페이지를 찾지못했습니다");
       //404페이지 구현 
}

window.addEventListener('DOMContentLoaded', router); //처음불러올때 감지
window.addEventListener('hashchange', router);//hash  url이 이동되면 감지