export function create_best_post(best_post){
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