
function handle_postinfo(){
  const event_id = event.currentTarget.id.split('__');
  console.log(event_id[1]);
  location.href=`#postinfo_${event_id[1]}`; //페이지 이동
}

function handle_goMain(){
	location.href='#'; //페이지 이동
}

function handle_delete(){
 const confirmflag = confirm("삭제하시겠습니까?");
 if(confirmflag){
  const event_id = event.currentTarget.id.split('__');
  delete_board(event_id[1]);
}
}

function handle_modify(){
  const event_id = event.currentTarget.id.split('__');
  paint_modify(event_id[1]);
}

function handle_bigInput(){
	const ele = document.querySelector('.input__off');
	ele.addEventListener('click',function(){
		location.href='#input'; //페이지 이동
	}){
}