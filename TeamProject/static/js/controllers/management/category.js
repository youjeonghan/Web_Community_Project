// ----------------------------- components import -----------------------------
import * as MANAGEMENT_COMPONENT_CATEGORY from '/static/js/components/management/category.js';
import * as MAIN_COMPONENT_CATEGORY from '/static/js/components/mainpage/category.js';
// ----------------------------- modal import -----------------------------
import ADD_BOARD_MODAL from '/static/js/components/modal/add_board.js';
import ADD_CATEGORY_MODAL from '/static/js/components/modal/add_category.js';
// -----------------------------  api import ------------------------------
import * as API_BOARD_AND_CATEGORY from '/static/js/api/management/category_and_board.js';
// ----------------------------- function import ---------------------------
import * as MODAL from '/static/js/controllers/modal.js';

const board_management_btn = document.querySelector('.board_management_btn');
if (board_management_btn) {
	board_management_btn.addEventListener('click', () => {
		document.querySelector('.board_management_container').style.display = 'block';
		document.querySelector('.report_management_container').style.display = 'none';
		document.querySelector('.user_management_container').style.display = 'none';
		board_management_container_init();
	})
}

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

	category_list.forEach(category => category_select_menu.appendChild(MANAGEMENT_COMPONENT_CATEGORY.create_category_option(category)));

	category_select_menu.addEventListener('change', () => {
		const selected_category_id = category_select_menu.options[category_select_menu.selectedIndex].value;
		document.querySelector('.board_container .sub_title').innerText = category_select_menu.options[category_select_menu.selectedIndex].innerText + ' - ';
		document.querySelector('.category_del_btn').disabled = false;
		document.querySelector('.board_plus_btn').disabled = false;
		API_BOARD_AND_CATEGORY.get_all_board_in_category(selected_category_id);
	})
}

function boards_in_category_pagination(board_list, category_id) {

	const board_container = document.querySelector('.board_menu');
	const page_container = document.querySelector('.board_page');

	let current_page = 1;
	const number_of_boards_show_one_page = 28;

	boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page, category_id);
	boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container, category_id);

}

function boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page, category_id = false) {

	board_container.innerHTML = '';

	const start = number_of_boards_show_one_page * (current_page - 1);
	const end = start + number_of_boards_show_one_page;
	const paginated_board_list = board_list.slice(start, end);

	if(category_id)	paginated_board_list.forEach((board) => board_container.appendChild(MANAGEMENT_COMPONENT_CATEGORY.create_board_div(board, category_id)));
	else paginated_board_list.forEach((board) => board_container.appendChild(MAIN_COMPONENT_CATEGORY.create_board(board, category_id)));

}

function boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container, category_id) {
	
	page_container.innerHTML = "";

	const page_count = Math.ceil(board_list.length / number_of_boards_show_one_page);
	for (let page_index = 1; page_index < page_count + 1; page_index++) {
		page_container.appendChild(MANAGEMENT_COMPONENT_CATEGORY.create_page_button(page_index, board_list, current_page, board_container, number_of_boards_show_one_page, category_id));
	}
}

function category_container_init() {
	const category_select = document.querySelector('.category_menu');
	category_select.innerHTML = `<option selected>Select :)</option>`;
	document.querySelector('.board_container').innerHTML = MANAGEMENT_COMPONENT_CATEGORY.create_board_container();
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

export {
	category_init,
	boards_in_category_pagination,
	boards_in_category_init,
	boards_page_init,
	category_container_init,
	board_container_init
};