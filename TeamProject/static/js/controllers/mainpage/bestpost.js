import * as COMPONENT_BESTPOST from '/static/js/components/mainpage/bestpost.js';
import * as API_MAIN_PAGE from '/static/js/api/mainpage.js';

API_MAIN_PAGE.get_best_post();

function best_post_init(all_best_post) {

	all_best_post.forEach(best_post => document.querySelector('.best_post_container').appendChild(COMPONENT_BESTPOST.create_best_post(best_post)));

	title_length_limit_over_to_dots();
}

function title_length_limit_over_to_dots() {

    const best_post_title_limit = 12;
    const all_best_post_title = document.querySelectorAll('.post_title');
    
	all_best_post_title.forEach(best_post_title => {
		if (best_post_title.innerText.length > best_post_title_limit) best_post_title.innerText = best_post_title.innerText.substr(0, 12) + '...';
	});

}

export {
	best_post_init
}