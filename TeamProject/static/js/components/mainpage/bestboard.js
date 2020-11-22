export function create_best_board(best_board){
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