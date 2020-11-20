import * as API_BOARD_AND_CATEGORY from '/static/js/api/management/category_and_board.js';
import * as MODAL from '/static/js/controllers/modal.js';
import MODIFY_BOARD_MODAL from '/static/js/components/modal/modify_board.js';

export function create_category_option(category){
	
	const created_category = document.createElement('option');
	created_category.innerText = category.category_name;
	created_category.value = category.id;

	return created_category;
}

export function create_board_container() {
	const board_container = `<span class='sub_title'>게시판 - </span>
	<button type='button' class='category_del_btn plus_btn' style='disabled : true;'>해당 카테고리 삭제</button>
	<button class='board_plus_btn plus_btn'>게시판 추가 (+)</button>
	<div class='board_box'>
		<div class='board_menu'></div>
		<div class='board_page' id='pagination'></div>
	</div>`;

	return board_container;
}

export function create_board_init(board, category_id) {
	
	const created_board_div = document.createElement('div');
	created_board_div.classList.add('board');

	created_board_div.appendChild(create_board_info(board));
	created_board_div.appendChild(create_modify_board_image_btn(board, category_id));
	created_board_div.appendChild(create_delete_board_btn(board));

	return created_board_div;
}

function create_board_info(board){
	const created_board_info = document.createElement('span');
	created_board_info.classList.add('board_info');

	if (!board.board_image) created_board_info.innerHTML = `<img src='/static/img/main_img/board_default.png' class='board_image'> ${board.board_name}`;
	else created_board_info.innerHTML = `<img src='/static/img/board_img/${board.board_image}' class='board_image'> ${board.board_name}`;

	return created_board_info;
}

function create_modify_board_image_btn(board, category_id){

	const created_modify_board_btn = document.createElement('button');
	created_modify_board_btn.classList.add('board_modify_btn', 'board_btn');
	created_modify_board_btn.innerText = '수정';
	created_modify_board_btn.addEventListener('click', () => {

        MODAL.create_modal(MODIFY_BOARD_MODAL);
		document.querySelector('.board_modify_modal_name').innerText = board.board_name;

		document.querySelector('.board_modify_modal_btn').addEventListener('click', () => {
			API_BOARD_AND_CATEGORY.modify_board_image(board.id, category_id);
		})
	})

	return created_modify_board_btn;
}

function create_delete_board_btn(board){
	
	const created_delete_board_btn = document.createElement('button');
	created_delete_board_btn.classList.add('board_del_btn', 'board_btn');
	created_delete_board_btn.innerText = 'X';
	created_delete_board_btn.addEventListener('click', () => {
		if (confirm('게시판 삭제 시 해당 게시판의 글도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
			API_BOARD_AND_CATEGORY.delete_board(board.id, board.category_id);
		} else return;
	})

	return created_delete_board_btn;
}