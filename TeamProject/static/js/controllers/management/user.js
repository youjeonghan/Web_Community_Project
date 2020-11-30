import * as COMPONENT_USER from '/static/js/components/management/user.js';
import * as API_USER from '/static/js/api/management/user.js';

const user_management_btn = document.querySelector('.user_management_btn');
user_management_btn.addEventListener('click', () => {
	document.querySelector('.board_management_container').style.display = 'none';
	document.querySelector('.report_management_container').style.display = 'none';
	document.querySelector('.user_management_container').style.display = 'block';
	user_management_container_init();
})

function user_management_container_init() {

	API_USER.get_all_user_info();

	// 검색 버튼 삭제 후 재생성 => 리스너 제거로 리팩토링
	const user_menus = document.querySelector('#user_menus');
	user_menus.removeChild(user_menus.lastElementChild);
	user_menus.append(COMPONENT_USER.create_search_user_nickname_btn());
}

function search_user_nickname() {

	const user_search_input = document.querySelector('.user_search_input');
	if (!user_search_input.value) {
		user_search_input.focus();
		alert('검색할 회원 닉네임을 입력해주세요.');
	} else API_USER.get_search_user(user_search_input);

}

function insert_user_list(all_user_info) {

	const user_list_container = document.querySelector('.users');
	user_list_container.innerHTML = '';

	all_user_info.forEach(user_info => user_list_container.append(COMPONENT_USER.create_user_div(user_info)));

}

export {
	insert_user_list,
	search_user_nickname
};