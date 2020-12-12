import {
    boards_in_category_init
} from '/static/js/controllers/management/category.js';

export function create_category(category){
	
	const created_category = document.createElement('div');
	created_category.classList.add('category');

	created_category.innerHTML = `<div class='category_name' category_id='${category.id}'>${category.category_name}</div>
								<div class='board_container'></div>
								<div class='board_page_container' id='pagination'></div><div class='b_btn_left b_btn'>
								<img src='/static/img/main_img/arrow-left.png' alt='' class='b_btn_img'>
								</div>
								<div class='b_btn_right b_btn'>
									<img src='/static/img/main_img/arrow-right.png' alt='' class='b_btn_img'>
								</div>`;
	
	return created_category;
}

export function create_board(board) {
	const created_board = document.createElement('span');
	created_board.classList.add('board');

	if (!board.board_image) {
		created_board.innerHTML = `<img src='/static/img/main_img/board_default.png' class='category_board_image'> ${board.board_name}`;
	} else {
		created_board.innerHTML = `<img src='/static/img/board_img/${board.board_image}' class='category_board_image'> ${board.board_name}`;
	}
	
	created_board.addEventListener('click', () => {
		location.href = `post#${board.id}#postmain`;
	})

	return created_board;
}

export function create_page_button(page_index, board_list, current_page, board_container, number_of_boards_show_one_page) {

	const created_page_btn = document.createElement('span');
	created_page_btn.classList.add('pages');
	created_page_btn.innerText = page_index;

	if (current_page === page_index) created_page_btn.classList.add('p_active');

	created_page_btn.addEventListener('click', () => {
		current_page = page_index;
		boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page);
		let current_page_btn = document.querySelector('.board_page_container .p_active');
		current_page_btn.classList.remove('p_active');
		created_page_btn.classList.add('p_active');
	});

	return created_page_btn;
}