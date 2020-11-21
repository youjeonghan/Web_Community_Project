
import * as API_USER from '/static/js/hw/api/management/user.js';
import * as MODAL from '/static/js/hw/controllers/modal.js';
import MODIFY_USER_NICKNAME_MODAL from '/static/js/hw/components/modal/modify_user.js';

export function create_user_div(user_info){
	const created_user_div = document.createElement('div');
	created_user_div.classList.add('user');

	created_user_div.innerHTML = create_user_info(user_info);

	const user_btn_classes = ['report_btn', 'r_item'];
	created_user_div.appendChild(create_modify_user_btn(user_info, user_btn_classes));		
	created_user_div.appendChild(create_delete_user_btn(user_info, user_btn_classes));

	return created_user_div;
}

function create_user_info(user_info){

	const created_user_info = `<span class='r_item'>${user_info.username}</span>
	<span class='r_item'>${user_info.userid}</span>
	<span class='r_item'>${user_info.nickname}</span>  
	<span class='r_item'>${user_info.email}</span>
	<span class='r_item'>${user_info.birth}</span>`;
	
	return created_user_info;
}

function create_modify_user_btn(user_info, user_btn_classes){
	
	const created_user_modify_btn = document.createElement('button');
	created_user_modify_btn.classList.add(...user_btn_classes);
	created_user_modify_btn.id = 'user_modify_btn';
	created_user_modify_btn.innerText = '정보 수정';
	created_user_modify_btn.addEventListener('click', () => {

		MODAL.create_modal(MODIFY_USER_NICKNAME_MODAL);

		document.querySelector('.user_modify_btn').addEventListener('click', () => {
			API_USER.modify_user_nickname(user_info.id);
		})
	})

	return created_user_modify_btn;
}

function create_delete_user_btn(user_info, user_btn_classes){

	const created_user_del_btn = document.createElement('button');
	created_user_del_btn.classList.add(...user_btn_classes);
	created_user_del_btn.innerText = '회원 삭제';
	created_user_del_btn.addEventListener('click', () => {
		if (confirm('회원 삭제 시 해당 회원의 글, 댓글도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
			API_USER.delete_user(user_info.id);
		} else return;
	})

	return created_user_del_btn;
}