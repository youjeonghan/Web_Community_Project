// ------------------------- 카테고리 -----------------------

function category_init() {

	const category_menu = document.querySelector(".category_menu");
	const category_options = category_menu.children;

	for (option of category_options) {
		option.class
	}

}





const list_board = [
	"Item 1",
	"Item 2",
	"Item 3",
	"Item 4",
	"Item 5",
	"Item 6",
	"Item 7",
	"Item 8",
	"Item 9",
	"Item 10",
	"Item 11",
	"Item 12",
	"Item 13",
	"Item 14",
	"Item 15",
	"Item 16",
	"Item 17",
	"Item 18",
	"Item 19",
	"Item 20",
	"Item 21",
	"Item 22",
	"Item 1",
	"Item 2",
	"Item 3",
	"Item 4",
	"Item 5",
	"Item 6",
	"Item 7",
	"Item 8",
	"Item 9",
	"Item 10",
	"Item 11",
	"Item 12",
	"Item 13",
	"Item 14",
	"Item 15",
	"Item 16",
	"Item 17",
	"Item 18",
	"Item 19",
	"Item 20",
	"Item 21"
];

function big_room_pagination() {

	const small_container = document.querySelector('.board_menu');
	const page_container = document.querySelector('.board_page');

	let current_page = 1;
	let show_cnt = 30;

	function DisplayList(items, container, rows_per_page, page) {
		container.innerHTML = "";
		page--;

		let start = rows_per_page * page;
		let end = start + rows_per_page;
		let paginatedItems = items.slice(start, end);

		for (let i = 0; i < paginatedItems.length; i++) {

			const board_div = document.createElement("div");

			let item = paginatedItems[i];

			let item_element = document.createElement('span');
			item_element.classList.add('board');
			item_element.innerText = item;

			let item_btn = document.createElement("button");
			item_btn.classList.add("board_del_btn");
			item_btn.innerText = "X";

			board_div.appendChild(item_element);
			board_div.appendChild(item_btn);
			
			container.appendChild(board_div);
		}
	}

	function SetupPagination(items, container, rows_per_page) {
		container.innerHTML = "";

		let page_count = Math.ceil(items.length / rows_per_page);
		for (let i = 1; i < page_count + 1; i++) {
			let btn = PaginationButton(i, items);
			container.appendChild(btn);
		}
	}

	function PaginationButton(i, items) {
		let pages = document.createElement('span');
		pages.classList.add("pages");
		pages.innerText = i;

		if (current_page == i) pages.classList.add('p_active');

		pages.addEventListener('click', function () {
			current_page = i;
			DisplayList(items, small_container, show_cnt, current_page);

			let current_btn = document.querySelector('.board_page .p_active');
			current_btn.classList.remove('p_active');

			pages.classList.add('p_active');
		});

		return pages;
	}

	DisplayList(list_board, small_container, show_cnt, current_page);
	SetupPagination(list_board, page_container, show_cnt);

}
big_room_pagination();

// 소분류(board)의 갯수에 따른 grid css 변경
function rooms_grid_change() {

	const rooms_cnt = document.querySelectorAll(".active .board").length;
	if (rooms_cnt > 40) {
		document.querySelector(".active .board_menu").style.gridTemplateColumns = "repeat(auto-fill, minmax(18%, auto))";
	} else if (rooms_cnt > 30) {
		document.querySelector(".active .board_menu").style.gridTemplateColumns = "repeat(auto-fill, minmax(23%, auto))";
	} else if (rooms_cnt > 20) {
		document.querySelector(".active .board_menu").style.gridTemplateColumns = "repeat(auto-fill, minmax(31%, auto))";
	}

}
rooms_grid_change();