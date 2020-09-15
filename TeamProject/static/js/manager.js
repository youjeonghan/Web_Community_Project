// ------------------------- 카테고리/게시판 관리 파트 --------------------------

const board_management_btn = document.querySelector(".board_management_btn");
const report_management_btn = document.querySelector(".report_management_btn");
const user_management_btn = document.querySelector(".user_management_btn");

const board_management_container = document.querySelector(".board_management_container");
const report_management_container = document.querySelector(".report_management_container");
const user_management_container = document.querySelector(".user_management_container");

board_management_btn.addEventListener("click",function(){
	board_management_container.style.display="block";
	report_management_container.style.display="none";
	user_management_container.style.display="none";
	board_management_container_init();
})

report_management_btn.addEventListener("click",function(){
	board_management_container.style.display="none";
	report_management_container.style.display="block";
	user_management_container.style.display="none";
	// report_management_container_init();
})


user_management_btn.addEventListener("click",function(){
	board_management_container.style.display="none";
	report_management_container.style.display="none";
	user_management_container.style.display="block";
	// user_management_container_init();
})


function board_management_container_init() {

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

	const category_modal = `<div class="category_modal_back">
	<div class="category_modal">
		<div class="category_exit">X</div>
		<div>
			<span>카테고리 추가</span>
			<input type="text" class="category_name" placeholder="카테고리 이름">
			<button class="category_btn">추가</button>
		</div>
	</div>
	</div>`;

	const board_modal = `<div class="board_modal_back">
	<div class="board_modal">
		<div class="board_exit">X</div>
		<div>
			<span>게시판 추가</span>
			<input type="text" class="board_name" placeholder="게시판 이름">
			<input type="text" class="board_description" placeholder="게시판 설명">
			<button class="board_btn">추가</button>
		</div>
	</div>
	</div>`;

	const category_container = document.querySelector("#category_modal_container");
	const board_container = document.querySelector("#board_modal_container");

	const category_plus_btn = document.querySelector(".category_plus_btn");
	const board_plus_btn = document.querySelector(".board_plus_btn");

	category_plus_btn.addEventListener("click", ()=>{
		
		// 모달을 생성해준다.
		category_container.innerHTML = category_modal;

		// 모달을 보이게 해준다.
        setTimeout(() => {
            document.querySelector(".category_modal").style.opacity = "1";
            document.querySelector(".category_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".category_exit").addEventListener("click", ()=> {
            category_container.innerHTML = '';
        })

	})

	board_plus_btn.addEventListener("click", ()=>{

		// 모달을 생성해준다.
		board_container.innerHTML = board_modal;
		
		// 로그인 모달 주요 style 변경
        setTimeout(() => {
            document.querySelector(".board_modal").style.opacity = "1";
            document.querySelector(".board_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".board_exit").addEventListener("click", ()=> {
            category_container.innerHTML = '';
        })
	})
}

