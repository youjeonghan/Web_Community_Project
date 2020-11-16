// ----------------------------- components import -----------------------------
import * as COMPONENT_CATEGORY from '/static/js/hw/components/management/category.js';
import * as COMPONENT_REPORT from '/static/js/hw/components/management/report.js';
import * as COMPONENT_USER from '/static/js/hw/components/management/user.js';
// ----------------------------- modal import -----------------------------
import ADD_BOARD_MODAL from '/static/js/hw/components/modal/add_board.js';
import ADD_CATEGORY_MODAL from '/static/js/hw/components/modal/add_category.js';
import ADD_USER_BLACKLIST_MODAL from '/static/js/hw/components/modal/add_user_blacklist.js';
import MODIFY_USER_NICKNAME_MODAL from '/static/js/hw/components/modal/modify_user.js';
// -----------------------------  api import ------------------------------
import * as API_BOARD_AND_CATEGORY from '/static/js/hw/api/management/category_and_board.js';
import * as API_REPORT from '/static/js/hw/api/management/report.js';
import * as API_USER from '/static/js/hw/api/management/user.js';
// ----------------------------- function import ---------------------------
import * as MODAL from '/static/js/hw/controllers/modal.js';

const board_management_container = document.querySelector('.board_management_container');
const board_management_btn = document.querySelector('.board_management_btn');
board_management_btn.addEventListener('click', () => {
	board_management_container.style.display = 'block';
	report_management_container.style.display = 'none';
	user_management_container.style.display = 'none';
	board_management_container_init();
})

const report_management_container = document.querySelector('.report_management_container');
const report_management_btn = document.querySelector('.report_management_btn');
report_management_btn.addEventListener('click', () => {
	board_management_container.style.display = 'none';
	report_management_container.style.display = 'block';
	user_management_container.style.display = 'none';
	report_management_container_init();
})

const user_management_container = document.querySelector('.user_management_container');
const user_management_btn = document.querySelector('.user_management_btn');
user_management_btn.addEventListener('click', () => {
	board_management_container.style.display = 'none';
	report_management_container.style.display = 'none';
	user_management_container.style.display = 'block';
	user_management_container_init();
})

// ################################################################################################
// ############################### 1. 카테고리/게시판 관리 파트 ####################################
// ################################################################################################
function board_management_container_init() {

	category_container_init();
	API_BOARD_AND_CATEGORY.get_all_category();

}

function board_btns_listener_init(){
	
	const add_category_btn = document.querySelector('.category_plus_btn');
	add_category_btn.addEventListener('click', () => {

		MODAL.create_modal(ADD_CATEGORY_MODAL);

		document.querySelector('.category_insert_btn').addEventListener('click', () => {
			API_BOARD_AND_CATEGORY.add_category(document.querySelector('.category_insert_name').value);
		})
	})

	const category_select = document.querySelector('.category_menu');

	const delete_current_category_btn = document.querySelector('.category_del_btn');
	delete_current_category_btn.addEventListener('click', () => {

		const selected_category_id = category_select.options[category_select.selectedIndex].value;
		if (confirm('카테고리 삭제 시 해당 카테고리의 게시판들도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
			API_BOARD_AND_CATEGORY.delete_category(selected_category_id);
		} else return;
	})

	const add_board_btn = document.querySelector('.board_plus_btn');
	add_board_btn.addEventListener('click', () => {

		MODAL.create_modal(ADD_BOARD_MODAL);

		document.querySelector('.board_insert_btn').addEventListener('click', () => {
			const selected_category_id = category_select.options[category_select.selectedIndex].value;
			API_BOARD_AND_CATEGORY.add_board(selected_category_id);
		})
	})
}

function category_init(category_list) {

	const category_select_menu = document.querySelector('.category_menu');

	category_list.forEach(category => category_select_menu.appendChild(COMPONENT_CATEGORY.create_category_option(category)));

	category_select_menu.addEventListener('change', () => {
		const selected_category_id = category_select_menu.options[category_select_menu.selectedIndex].value;
		document.querySelector('.board_container .sub_title').innerText = category_select_menu.options[category_select_menu.selectedIndex].innerText + ' - ';
		document.querySelector('.category_del_btn').disabled = false;
		document.querySelector('.board_plus_btn').disabled = false;
		API_BOARD_AND_CATEGORY.get_all_board_in_category(selected_category_id);
	})
}

function board_in_category_pagination(board_list, category_id) {

	const board_container = document.querySelector('.board_menu');
	const page_container = document.querySelector('.board_page');

	let current_page = 1;
	const number_of_boards_show_one_page = 28;

	boards_in_category_init(board_list, board_container, category_id, number_of_boards_show_one_page, current_page);
	boards_page_init(board_list, page_container, category_id, number_of_boards_show_one_page, current_page, board_container);

}

function boards_in_category_init(board_list, board_container, category_id, number_of_boards_show_one_page, current_page) {

	board_container.innerHTML = '';

	const start = number_of_boards_show_one_page * (current_page - 1);
	const end = start + number_of_boards_show_one_page;
	const paginated_board_list = board_list.slice(start, end);

	paginated_board_list.forEach((board) => board_container.appendChild(COMPONENT_CATEGORY.create_board_init(board, category_id)));

}

function boards_page_init(board_list, page_container, category_id, number_of_boards_show_one_page, current_page, board_container) {
	page_container.innerHTML = "";

	const page_count = Math.ceil(board_list.length / number_of_boards_show_one_page);
	for (let page_index = 1; page_index < page_count + 1; page_index++) {
		const created_btn = create_page_button(page_index, board_list, category_id, current_page, board_container, number_of_boards_show_one_page);
		page_container.appendChild(created_btn);
	}
}

function create_page_button(page_index, board_list, category_id, current_page, board_container, number_of_boards_show_one_page) {

	let created_page_btn = document.createElement('span');
	created_page_btn.classList.add("pages");
	created_page_btn.innerText = page_index;

	if (current_page === page_index) created_page_btn.classList.add('p_active');

	created_page_btn.addEventListener('click', () => {
		current_page = page_index;
		boards_in_category_init(board_list, board_container, category_id, number_of_boards_show_one_page, current_page);
		let current_page_btn = document.querySelector('.board_page .p_active');
		current_page_btn.classList.remove('p_active');

		created_page_btn.classList.add('p_active');
	});

	return created_page_btn;
}

function category_container_init() {
	const category_select = document.querySelector('.category_menu');
	category_select.innerHTML = `<option selected>Select :)</option>`;
	document.querySelector('.board_container').innerHTML = COMPONENT_CATEGORY.create_board_container();
	board_btns_listener_init();
	document.querySelector('.category_del_btn').disabled = true;
	document.querySelector('.board_plus_btn').disabled = true;
	document.querySelector('#modal_container').innerHTML = '';
}

function board_container_init() {
	document.querySelector('.board_menu').innerHTML = '';
	document.querySelector('.board_page').innerHTML = '';
	document.querySelector('#modal_container').innerHTML = '';
}

// ##########################################################################################################
// ######################################### 2. 신고 리스트 관리 파트 ########################################
// ##########################################################################################################

function report_management_container_init() {

	API_REPORT.get_all_report_post();

	const report_select_menu = document.querySelector('#report_select_menu');
	report_select_menu.addEventListener('change', () => {
		const selected_value = report_select_menu.options[report_select_menu.selectedIndex].value;
		if (selected_value === 'post') {
			API_REPORT.get_all_report_post();
		} else {
			API_REPORT.get_all_report_comment();
		}
	})
}

function view_report_list(type, report_list) {

	// 체크 리스트 삭제 버튼 리스너 초기화를 위한 재생성 => 리스너 삭제로 리팩토링
	const report_menus = document.querySelector('#report_menus');
	report_menus.removeChild(report_menus.lastElementChild);
	const report_check_del_btn = document.createElement('button');
	report_check_del_btn.classList.add('report_check_del_btn', 'plus_btn');
	report_check_del_btn.innerText = '체크 리스트 삭제';
	report_menus.append(report_check_del_btn);

	const reports_container = document.querySelector('.reports');
	reports_container.innerHTML = '';

	report_list.forEach(report => report_list_init(report, type, reports_container));

	report_all_check_btn_listener_init();

	checked_report_delete_btn_listener_init();

}

function report_all_check_btn_listener_init() {

	const report_all_check_btn = document.querySelector('.report_check_first');
	report_all_check_btn.addEventListener('change', () => {
		const all_checkbox = document.querySelectorAll('#report_check');
		if (report_all_check_btn.checked) all_checkbox.forEach(check => check.checked = true);
		else all_checkbox.forEach(checkbox => checkbox.checked = false);
	})

}

function checked_report_delete_btn_listener_init() {

	document.querySelector('.report_check_del_btn').addEventListener('click', () => {
		const all_checkbox = document.querySelectorAll('#report_check');
		const checked_id_list = [];
		all_checkbox.forEach(checkbox => {
			if (checkbox.checked) checked_id_list.push({
				'id': checkbox.value
			});
		});
		// 체크된 신고리스트가 하나라도 있다면 삭제 API 호출
		if (checked_id_list.length) API_REPORT.delete_report(type, checked_id_list);

		const report_check_first = document.querySelector('.report_check_first');
		report_check_first.checked = false;
	});

}

function report_list_init(report, type, reports_container) {
	
	const created_report_div = document.createElement('div');
	created_report_div.classList.add('report');
	
	created_report_div.innerHTML = create_report_info(report, type);

	// 리포트 버튼들의 클래스를 배열로 묶어 선언해놓는다. 중복사용 될 예정이므로 선언
	const report_btn_classes = ['report_btn', 'r_item'];

	// 생성한 버튼 3개를 div에 넣어준다.
	created_report_div.append(create_report_blacklist_btn(report, type, report_btn_classes));
	created_report_div.append(create_report_delete_btn(report, type, report_btn_classes));
	created_report_div.append(create_report_cancel_btn(report, type, report_btn_classes));

	// 완성된 div를 reports 컨테이너에 넣어준다.
	reports_container.append(created_report_div);
}

function create_report_info(report, type){
	
	let created_report_info;

	if (type === 'post') {
		created_report_info = `<input type='checkbox' class='r_item' id='report_check' value='${report.id}'>
		<span class='r_item'>${report.report_num}</span>
		<span class='r_item'>${report.nickname}</span>
		<span class='r_item report_title'>${report.subject}</span>
		<span class='r_item'>${report.create_date}</span>`
	} else {
		created_report_info = `<input type='checkbox' class='r_item' id='report_check' value='${report.id}'>
		<span class='r_item'>${report.report_num}</span>
		<span class='r_item'>${report.nickname}</span>
		<span class='r_item report_title'>${report.content}</span>
		<span class='r_item'>${report.create_date}</span>`
	}

	return created_report_info;
}

function create_report_blacklist_btn(report, type, report_btn_classes) {
	// 해당 신고 작성 회원 정지 버튼 생성
	const created_report_blacklist_btn = document.createElement('button');
	created_report_blacklist_btn.classList.add(...report_btn_classes);
	created_report_blacklist_btn.id = 'report_blacklist_btn';
	created_report_blacklist_btn.innerText = '회원 정지';
	created_report_blacklist_btn.addEventListener('click', () => {

		MODAL.create_modal(ADD_USER_BLACKLIST_MODAL);

		// 모달에서 정지 버튼 클릭 시 해당 회원 정지 FetchAPI 호출
		document.querySelector('.blacklist_btn').addEventListener('click', () => {
			const blacklist_date_select = document.querySelector('.blacklist_option');
			const punishment_date = blacklist_date_select.options[blacklist_date_select.selectedIndex].value;
			API_REPORT.add_user_blacklist(report.userid, punishment_date, type, report.id);
		});
	})

	return created_report_blacklist_btn;
}

function create_report_delete_btn(report, type, report_btn_classes) {

	const created_report_del_btn = document.createElement('button');
	created_report_del_btn.classList.add(...report_btn_classes);
	created_report_del_btn.id = 'report_del_btn';
	if (type == 'post') {
		created_report_del_btn.innerText = '게시글 삭제';
		created_report_del_btn.addEventListener('click', () => {
			if (confirm('해당 게시글 삭제 시 댓글도 함께 삭제됩니다.\n정말로 삭제하시겠습니까?')) {
				API_REPORT.delete_report(type, [{
					'id': report.id
				}]);
			} else return;
		});
	} else {
		created_report_del_btn.innerText = '댓글 삭제';
		created_report_del_btn.addEventListener('click', () => {
			if (confirm('해당 댓글 삭제 시 "삭제된 댓글입니다." 문구로 대체됩니다.\n정말로 삭제하시겠습니까?')) {
				API_REPORT.delete_report(type, [{
					'id': report.id
				}]);
			} else return;
		});
	}

	return created_report_del_btn;
}

function create_report_cancel_btn(report, type, report_btn_classes) {

	const created_report_calcel_btn = document.createElement('button');
	created_report_calcel_btn.classList.add(...report_btn_classes);
	created_report_calcel_btn.id = 'report_cancel_btn';
	created_report_calcel_btn.innerHTML = `<i class='fas fa-check'></i>`;
	created_report_calcel_btn.addEventListener('click', () => {
		if (confirm('신고 처리 시 해당 신고글이 신고리스트에서 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
			// 해당 신고 게시글or댓글의 타입과 아이디를 넘긴다.
			API_REPORT.delete_report_in_reportlist(type, report.id);
		} else return;
	});

	return created_report_calcel_btn;
}

// ##########################################################################################################
// ######################################### 3. 회원 관리 파트 ###############################################
// ##########################################################################################################

function user_management_container_init() {

	API_USER.get_all_user_info();

	// 검색 버튼 삭제 후 재생성 => 리스너 제거로 리팩토링
	const user_menus = document.querySelector('#user_menus');
	user_menus.removeChild(user_menus.lastElementChild);
	user_menus.append(create_search_user_nickname_btn());
}

function create_search_user_nickname_btn(){

	const created_search_user_nickname_btn = document.createElement('button');
	created_search_user_nickname_btn.classList.add('user_search_btn', 'plus_btn');
	created_search_user_nickname_btn.innerText = '검색';
	created_search_user_nickname_btn.addEventListener('click', () => {
		search_user_nickname();
	})
	document.querySelector('.user_search_input').addEventListener('keyup', (e) => {
		const enter_key_num = 13;
		if (e.keyCode === enter_key_num) {
			search_user_nickname();
		}
	})

	return created_search_user_nickname_btn;
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

	all_user_info.forEach(user_info => {

		const created_user_div = document.createElement('div');
		created_user_div.classList.add('user');

		created_user_div.innerHTML = create_user_info(user_info);

		const user_btn_classes = ['report_btn', 'r_item'];
		created_user_div.appendChild(create_modify_user_btn(user_info, user_btn_classes));		
		created_user_div.appendChild(create_delete_user_btn(user_info, user_btn_classes));

		user_list_container.append(created_user_div);

	});

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

export {
	category_init,
	board_in_category_pagination,
	category_container_init,
	board_container_init,
	view_report_list,
	insert_user_list
};