import * as COMPONENT_CATEGORY from '/static/js/components/mainpage/category.js';
import * as API_MAIN_PAGE from '/static/js/api/mainpage/mainpage.js';

API_MAIN_PAGE.get_all_category();

function category_init(all_category_info) {

	const category_container = document.querySelector('.category_container');
	all_category_info.forEach(category => category_container.appendChild(COMPONENT_CATEGORY.create_category(category)));
	category_container.firstChild.classList.add('active');

	// 메인페이지에 들어오면 하단에 보여질 첫번째 카테고리의 게시판들을 먼저 init 해준다.
	const first_category_id = document.querySelector('.active').childNodes[0].getAttribute('category_id');
	API_MAIN_PAGE.get_all_board_in_category(first_category_id);

	all_category_right_and_left_btn_eventlistener_init();
}

function all_category_right_and_left_btn_eventlistener_init() {

	const category_left_btns = document.querySelectorAll('.b_btn_left');
	const category_right_btns = document.querySelectorAll('.b_btn_right');

	category_left_btns.forEach((category_left_btn) => {
		category_left_btn.addEventListener('click', () => {
			change_category_to_show('left');
		})
	});

	category_right_btns.forEach((category_right_btn) => {
		category_right_btn.addEventListener('click', () => {
			change_category_to_show('right');
		})
	});
}

function change_category_to_show(direction) {

	const all_category = document.querySelectorAll('.category');
	const current_category = document.querySelector('.active');
	current_category.classList.remove('active');

	if (direction === 'left') {

		const previous_category = current_category.previousElementSibling;
		if (previous_category) previous_category.classList.add('active');
		else all_category[all_category.length - 1].classList.add('active');

	} else {

		const next_category = current_category.nextElementSibling;
		if (next_category) next_category.classList.add('active');
		else all_category[0].classList.add('active');

	}
	// 최종 변경된 active 카테고리의 아이디를 불러와 api를 호출한다.
	const changed_category_id = document.querySelector('.active').childNodes[0].getAttribute('category_id');
	API_MAIN_PAGE.get_all_board_in_category(changed_category_id);
}

function board_in_category_pagination(board_list) {

	const board_container = document.querySelector('.active .board_container');
	const page_container = document.querySelector('.active .board_page_container');

	let current_page = 1;
	const number_of_boards_show_one_page = 32;

	boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page);
	boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container);

}

function boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page) {
	board_container.innerHTML = '';

	let start = number_of_boards_show_one_page * (current_page - 1);
	let end = start + number_of_boards_show_one_page;
	let paginated_board_list = board_list.slice(start, end);

	paginated_board_list.forEach(board => board_container.appendChild(COMPONENT_CATEGORY.create_board(board)));
}

function boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container) {
	page_container.innerHTML = '';

	const page_count = Math.ceil(board_list.length / number_of_boards_show_one_page);
	for (let page_index = 1; page_index < page_count + 1; page_index++) {
		page_container.appendChild(COMPONENT_CATEGORY.create_page_button(page_index, board_list, current_page, board_container, number_of_boards_show_one_page));
	}
}

export {
	category_init,
	board_in_category_pagination,
	boards_in_category_init
}