// ----------------------------- components import -----------------------------
import * as COMPONENT_CATEGORY from '/static/js/components/management/category.js';
import * as COMPONENT_REPORT from '/static/js/components/management/report.js';
import * as COMPONENT_USER from '/static/js/components/management/user.js';
// ----------------------------- modal import -----------------------------
import ADD_BOARD_MODAL from '/static/js/components/modal/add_board.js';
import ADD_CATEGORY_MODAL from '/static/js/components/modal/add_category.js';
// -----------------------------  api import ------------------------------
import * as API_BOARD_AND_CATEGORY from '/static/js/api/management/category_and_board.js';
import * as API_REPORT from '/static/js/api/management/report.js';
import * as API_USER from '/static/js/api/management/user.js';
// ----------------------------- function import ---------------------------
import * as MODAL from '/static/js/controllers/modal.js';

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

	report_list.forEach(report => reports_container.append(COMPONENT_REPORT.create_report_div(report,type)));

	report_all_check_btn_listener_init();
	checked_report_delete_btn_listener_init(type);

}

function report_all_check_btn_listener_init() {

	const report_all_check_btn = document.querySelector('.report_check_first');
	report_all_check_btn.addEventListener('change', () => {
		const all_checkbox = document.querySelectorAll('#report_check');
		if (report_all_check_btn.checked) all_checkbox.forEach(check => check.checked = true);
		else all_checkbox.forEach(checkbox => checkbox.checked = false);
	})

}

function checked_report_delete_btn_listener_init(type) {

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

// ##########################################################################################################
// ######################################### 3. 회원 관리 파트 ###############################################
// ##########################################################################################################

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
	category_init,
	board_in_category_pagination,
	category_container_init,
	board_container_init,
	view_report_list,
	insert_user_list,
	search_user_nickname
};