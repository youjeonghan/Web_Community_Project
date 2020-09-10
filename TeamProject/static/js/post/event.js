
function handle_postinfo(){//post info 창 페이지 이동
  const event_id = event.currentTarget.id.split('__');
  location.href=`#postinfo_${event_id[1]}`; //페이지 이동
  // history.pushState(event_id[1], 'Go postinfo_', '/rooms/#postinfo');
  // router();
}

function handle_goMain(){
	location.href='#'; //페이지 이동
  // history.pushState(null, 'Go main', '/rooms/#');
  // router();

}

function handle_delete(){//post info삭제 
 const confirmflag = confirm("삭제하시겠습니까?");
 if(confirmflag){
  const event_id = event.currentTarget.id.split('__');
  delete_post(event_id[1]);
}
}

function handle_modify(){// post info수정 
  const event_id = event.currentTarget.id.split('__');
  modify_post(event_id[1]);
}

function handle_Input(){//인풋창
	const ele = document.querySelector('.input__off');
	ele.addEventListener('click',function(){
		location.href='#input'; //페이지 이동
    // history.pushState(null, 'Go input', '/rooms/#input');
    // router();

	});
}

function handle_submitPost(){//인풋창 submit

  const input = document.querySelector('.input_file');//파일 인풋 테그
  const preview = document.querySelector('.file_preview'); //파일 미리보기 태그
  const submit = document.getElementById('button_submit'); //파일 제출 버튼 태그  

  submit.addEventListener('click',submit_post); //버튼 json 제출 이벤트 리스너
 //  submit.addEventListener('click',function(){ // 파일 제출 이벤트 리스너 
 //   fetch_upload(input.files);
 // });
 //  input.addEventListener('change' , function(){//파일 미리보기 이벤트 리스너 
 //    const curfiles = input.files; //현재 선택된 파일
 //    paint_preview(curfiles, preview);
 //  });
}