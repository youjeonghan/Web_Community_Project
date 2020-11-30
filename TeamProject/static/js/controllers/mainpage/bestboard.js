import * as COMPONENT_BESTBOARD from '/static/js/components/mainpage/bestboard.js';
import * as API_MAIN_PAGE from '/static/js/api/mainpage.js';

API_MAIN_PAGE.get_best_board();

function best_board_init(all_best_board) {

	const best_board_slider = document.querySelector('.slider');
	all_best_board.forEach(best_board => best_board_slider.appendChild(COMPONENT_BESTBOARD.create_best_board(best_board)));

	best_board_slider_animation_init(best_board_slider);
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

export {
	best_board_init
}