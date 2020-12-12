import * as COMPONENT_CATEGORY from '/static/js/components/mainpage/category.js';
import {
	boards_in_category_init,
	boards_page_init
} from '/static/js/controllers/management/category.js';
import * as API_MAIN_PAGE from '/static/js/api/mainpage/mainpage.js';

API_MAIN_PAGE.get_all_category();

function category_container_init(all_category_info) {

	const category_container = document.querySelector('.category_container');
	all_category_info.forEach(category => category_container.appendChild(COMPONENT_CATEGORY.create_category(category)));
	category_container.firstChild.classList.add('active');

	show_first_category();

	all_category_right_and_left_btn_eventlistener_init();
}

function show_first_category(){

	const first_category_id = document.querySelector('.active').childNodes[0].getAttribute('category_id');
	API_MAIN_PAGE.get_all_board_in_category(first_category_id);

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
	
	const changed_category_id = document.querySelector('.active').childNodes[0].getAttribute('category_id');
	API_MAIN_PAGE.get_all_board_in_category(changed_category_id);
}

function boards_in_category_pagination(board_list) {

	const board_container = document.querySelector('.active .board_container');
	const page_container = document.querySelector('.active .board_page_container');

	let current_page = 1;
	const number_of_boards_show_one_page = 32;

	boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page);
	boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container);

}

export {
	category_container_init,
	boards_in_category_pagination
}