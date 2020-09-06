//post 조회  
async function fetch_getJson(url){
  const response = await fetch(url);
  if(response.ok){
      return response.json();
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  return response.json();
}



//////////post 입력//////
async function fetch_insert(data){
  const response = await fetch(post_url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });
  if(response.ok){
      return; //response.json();
    }
    else if(response.status === 400){
      alert("제목을 입력해주세요");
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
}

//post 삭제//
function fetch_delete(url){
  console.log(url);
  return fetch(url,{
    method: 'DELETE',
  }).then(function(response) {
    if(response.ok){
      return alert("삭제되었습니다!");
    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  });

}

// async function fetch_delete(url){

//   return fetch(url,{
//     method: 'DELETE',
//   }).then(function(response) {
//     if(response.ok){
//       return alert("삭제되었습니다!");
//     }
//     else{
//       alert("HTTP-ERROR: " + response.status);
//     }
//   });

// }

function fetch_modify(id , data){
  const url = post_url + '/' + id;
  return fetch(url,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then(function(response) {
    if(response.ok){
      return load_postinfo(id);

    }
    else{
      alert("HTTP-ERROR: " + response.status);
    }
  });

}