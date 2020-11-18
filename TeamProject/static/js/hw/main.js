// --------------- api import ----------------
import * as API_MAIN_PAGE from '/static/js/hw/api/main_page.js';

// #################################################################################################
// ####################################### 베스트 게시글 파트 #######################################
// #################################################################################################
API_MAIN_PAGE.get_best_post();

function best_post_init(all_best_post) {

	all_best_post.forEach(best_post => document.querySelector('.best_post_container').appendChild(create_best_post(best_post)));

	title_length_limit_over_to_dots();
}

function create_best_post(best_post){
	const created_best_post = document.createElement('div');
	created_best_post.classList.add('best_post');

	const best_post_info = `<span class='best_post_board_name'>[${best_post.board_name}]</span>
	<span class='post_title'>${best_post.subject}</span><span class='best_post_icons'> 
	<i class='far fa-thumbs-up'></i> ${best_post.like_num} 
	<i class='far fa-comment'></i> ${best_post.comment_num}</span>`;
	created_best_post.innerHTML = best_post_info;
	created_best_post.addEventListener('click', () => {
		location.href = `post#${best_post.board_id}#postinfo#${best_post.id}`; //페이지 이동
	})
	
	return created_best_post;
}

function title_length_limit_over_to_dots() {

	const all_best_post_title = document.querySelectorAll('.post_title');
	// 베스트 게시글의 제목을 모두 불러와서 일정 글자가 넘으면 일정 글자 이후로 ... 으로 바꿔줌
	all_best_post_title.forEach(best_post_title => {
		if (best_post_title.innerText.length > 12) best_post_title.innerText = best_post_title.innerText.substr(0, 12) + '...';
	});

}

// #################################################################################################
// ####################################### 베스트 게시판 파트 #######################################
// #################################################################################################
API_MAIN_PAGE.get_best_board();

function best_board_init(all_best_board) {

	const best_board_slider = document.querySelector('.slider');
	all_best_board.forEach(best_board => best_board_slider.appendChild(create_best_board(best_board)));

	best_board_slider_animation_init(best_board_slider);
}

function create_best_board(best_board){
	const created_best_board = document.createElement('div');
	created_best_board.classList.add('slide');
	// 게시판 이미지가 없다면 디폴트 이미지 넣어줌
	if (!best_board.board_image) {
		created_best_board.innerHTML = `<img src='/static/img/main_img/board_default.png' class='s_img'>
										<div>${best_board.board_name}</div>`;
	} else {
		created_best_board.innerHTML = `<img src='/static/img/board_img/${best_board.board_image}' class='s_img'>
										<div>${best_board.board_name}</div>`;
	}

	created_best_board.addEventListener('mouseenter', () => {
		created_best_board.style.opacity = '1';
	})
	created_best_board.addEventListener('mouseleave', () => {
		created_best_board.style.opacity = '0.7';
	})
	created_best_board.addEventListener('click', () => {
		location.href = `post#${best_board.id}#postmain`;
	})

	return created_best_board;
}

function best_board_slider_animation_init(best_board_slider) {

	const all_slide = document.querySelectorAll('.slide');
	const slider_left_btn = document.querySelector('.s_btn_left');
	const slider_right_btn = document.querySelector('.s_btn_right');
	const view_board_num = 6;
	let index = 0;

	slider_left_btn.addEventListener('click', () => {
		index--;
		if (index < 0) {
			index = all_slide.length - view_board_num;
			slider_bar_move(100 - (100 / view_board_num));
		} else slider_bar_move(index * (100 / 5));

		slider_move(index * -15, best_board_slider);
	})

	slider_right_btn.addEventListener('click', () => {
		index++;
		if (index > all_slide.length - view_board_num) {
			index = 0;
			slider_bar_move(0);
		} else slider_bar_move(index * (100 / 5));

		slider_move(index * -15, best_board_slider);
	})
}

function slider_move(movement, best_board_slider) {
	best_board_slider.style.left = movement + 'vw';
}

function slider_bar_move(movement) {
	let slider_bar = document.querySelector('.bar');
	slider_bar.style.left = movement + '%';
}

// #################################################################################################
// ####################################### 카테고리/게시판 파트 #######################################
// #################################################################################################
API_MAIN_PAGE.get_all_category();

function category_init(all_category) {

	const category_container = document.querySelector('.category_container');
	all_category.forEach(category => category_container.appendChild(create_category(category)));
	category_container.firstChild.classList.add('active');

	// 메인페이지에 들어오면 하단에 보여질 첫번째 카테고리의 게시판들을 먼저 init 해준다.
	const first_category_id = document.querySelector('.active').childNodes[0].getAttribute('category_id');
	API_MAIN_PAGE.get_all_board_in_category(first_category_id);

	all_category_right_and_left_btn_eventlistener_init();
}

function create_category(category){
	
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
	const changed_category_id = current_category.childNodes[0].getAttribute('category_id');
	API_MAIN_PAGE.get_all_board_in_category(changed_category_id);
}

function board_in_category_pagination(board_list) {

	const board_container = document.querySelector('.active .board_container');
	const page_container = document.querySelector('.active .board_page_container');

	// 현재 페이지 설정 초기값 1
	let current_page = 1;
	// 한 페이지에 보여줄 게시판 수
	const number_of_boards_show_one_page = 32;

	boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page);
	boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container);

}

function boards_in_category_init(board_list, board_container, number_of_boards_show_one_page, current_page) {
	board_container.innerHTML = '';

	let start = number_of_boards_show_one_page * (current_page - 1);
	let end = start + number_of_boards_show_one_page;
	let paginated_board_list = board_list.slice(start, end);

	paginated_board_list.forEach(board => board_container.appendChild(create_board(board)));
}

function create_board(board) {
	const created_board = document.createElement('span');
	created_board.classList.add('board');

	if (!board.board_image) {
		created_board.innerHTML = `<img src='/static/img/main_img/board_default.png' class='category_board_image'> ${board.board_name}`;
	} else {
		created_board.innerHTML = `<img src='/static/img/board_img/${board.board_image}' class='category_board_image'> ${board.board_name}`;
	}
	// 해당 게시판을 누를 시 링크 이동 리스너
	created_board.addEventListener('click', () => {
		location.href = `post#${board.id}#postmain`;
	})

	return created_board;
}

function boards_page_init(board_list, page_container, number_of_boards_show_one_page, current_page, board_container) {
	page_container.innerHTML = '';

	const page_count = Math.ceil(board_list.length / number_of_boards_show_one_page);
	for (let page_index = 1; page_index < page_count + 1; page_index++) {
		page_container.appendChild(create_page_button(page_index, board_list, current_page, board_container, number_of_boards_show_one_page));
	}
}

function create_page_button(page_index, board_list, current_page, board_container, number_of_boards_show_one_page) {

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

export {
	best_post_init,
	best_board_init,
	category_init,
	board_in_category_pagination
}