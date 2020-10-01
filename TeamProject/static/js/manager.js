const main_url = "http://127.0.0.1:5000/api";

// ------------------------- 카테고리/게시판 관리 파트 --------------------------

const board_management_btn = document.querySelector(".board_management_btn");
const report_management_btn = document.querySelector(".report_management_btn");
const user_management_btn = document.querySelector(".user_management_btn");

const board_management_container = document.querySelector(".board_management_container");
const report_management_container = document.querySelector(".report_management_container");
const user_management_container = document.querySelector(".user_management_container");

board_management_btn.addEventListener("click", function () {
	board_management_container.style.display = "block";
	report_management_container.style.display = "none";
	user_management_container.style.display = "none";
	board_management_container_init();
})

report_management_btn.addEventListener("click", function () {
	board_management_container.style.display = "none";
	report_management_container.style.display = "block";
	user_management_container.style.display = "none";
	report_management_container_init();
})


user_management_btn.addEventListener("click", function () {
	board_management_container.style.display = "none";
	report_management_container.style.display = "none";
	user_management_container.style.display = "block";
	user_management_container_init();
})

// ################################################################################################
// ############################### 1. 카테고리/게시판 관리 파트 ####################################
// ################################################################################################
function board_management_container_init() {

	const category_select = document.querySelector(".category_menu");
	const category_container = document.querySelector("#category_modal_container");
	const board_container = document.querySelector("#board_modal_container");

	board_container_init();
	category_container_clear();
	get_category_FetchAPI();

	function board_container_init() {
		const board_container = `<span class="sub_title">게시판 - </span>
		<button type="button" class="category_del_btn plus_btn">해당 카테고리 삭제</button>
		<button class="board_plus_btn plus_btn">게시판 추가 (+)</button>
		<div class="board_box">
			<div class="board_menu"></div>
			<div class="board_page" id="pagination"></div>
		</div>`;

		document.querySelector(".board_container").innerHTML = board_container;
	}

	function category_container_clear() {
		// 모든 child 삭제
		while (category_select.hasChildNodes()) {
			category_select.removeChild(category_select.lastChild);
		}
		// 기본 옵션 넣어주고 카테고리 관련 정보 다 초기화
		category_select.innerHTML = `<option selected>Select :)</option>`;
		document.querySelector(".board_menu").innerHTML = '';
		document.querySelector(".board_page").innerHTML = '';
		document.querySelector(".board_container .sub_title").innerText = '게시판 - ';
		document.querySelector(".category_del_btn").disabled = true;
		document.querySelector(".board_plus_btn").disabled = true;
		// modal 창 제거
		category_container.innerHTML = '';
	}

	function board_container_clear() {
		document.querySelector(".board_menu").innerHTML = '';
		document.querySelector(".board_page").innerHTML = '';
		// modal 창 제거
		board_container.innerHTML = '';
	}

	//------------- 카테고리 반환 FetchAPI --------------
	function get_category_FetchAPI() {

		const get_category_url = main_url + "/category_info";
		fetch(get_category_url, {
				method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then(res => res.json())
			.then((res) => {
				category_init(res);
			})
	}

	function category_init(category_list) {
		for (let cg of category_list) {
			const category = document.createElement("option");
			category.innerText = cg.category_name;
			category.value = `${cg.id}`;
			category_select.appendChild(category);
		}

		category_select.addEventListener("change", () => {
			const selected_category_id = category_select.options[category_select.selectedIndex].value;
			document.querySelector(".board_container .sub_title").innerText = category_select.options[category_select.selectedIndex].innerText + " - ";
			document.querySelector(".category_del_btn").disabled = false;
			document.querySelector(".board_plus_btn").disabled = false;
			get_board_FetchAPI(selected_category_id);
		})
	}



	// ------------- 해당 카테고리에 속한 게시판 반환 FetchAPI --------------
	function get_board_FetchAPI(category_id) {

		const get_board_url = main_url + "/board/" + category_id;
		fetch(get_board_url, {
				method: "GET",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then(res => res.json())
			.then((res) => {
				board_in_category_pagination(res);
			})
	}

	function board_in_category_pagination(board_list) {

		const small_container = document.querySelector('.board_menu');
		const page_container = document.querySelector('.board_page');

		let current_page = 1;
		let show_cnt = 30;

		function DisplayList(board_list, container, show_cnt, page) {
			container.innerHTML = "";
			page--;

			let start = show_cnt * page;
			let end = start + show_cnt;
			let paginatedItems = board_list.slice(start, end);

			for (let i = 0; i < paginatedItems.length; i++) {

				const board_div = document.createElement("div");

				let item = paginatedItems[i];

				let board = document.createElement('span');
				board.classList.add('board');
				board.innerText = item.board_name;
				board_div.appendChild(board);

				let board_modify_btn = document.createElement("button");
				board_modify_btn.classList.add("board_modify_btn");
				board_modify_btn.innerText = "수정";
				board_div.appendChild(board_modify_btn);

				let board_del_btn = document.createElement("button");
				board_del_btn.classList.add("board_del_btn");
				board_del_btn.innerText = "X";
				// 게시판 삭제 X 버튼 누를 시 delete API 호출
				board_del_btn.addEventListener("click", () => {
					if (confirm("게시판 삭제 시 해당 게시판의 글도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?") == true) {
						board_del_FetchAPI(item.id, item.category_id);
					} else return;
				})
				board_div.appendChild(board_del_btn);

				container.appendChild(board_div);
			}
		}

		function SetupPagination(board_list, container, show_cnt) {
			container.innerHTML = "";

			let page_count = Math.ceil(board_list.length / show_cnt);
			for (let i = 1; i < page_count + 1; i++) {
				let btn = PaginationButton(i, board_list);
				container.appendChild(btn);
			}
		}

		function PaginationButton(i, board_list) {
			let pages = document.createElement('span');
			pages.classList.add("pages");
			pages.innerText = i;

			if (current_page == i) pages.classList.add('p_active');

			pages.addEventListener('click', function () {
				current_page = i;
				DisplayList(board_list, small_container, show_cnt, current_page);

				let current_btn = document.querySelector('.board_page .p_active');
				current_btn.classList.remove('p_active');

				pages.classList.add('p_active');
			});

			return pages;
		}

		DisplayList(board_list, small_container, show_cnt, current_page);
		SetupPagination(board_list, page_container, show_cnt);

	}

	// #########################################################################
	// ######################### 삭제 관련 리스너, API ##########################
	// #########################################################################

	// 해당 카테고리 삭제 버튼 클릭 리스너
	document.querySelector(".category_del_btn").addEventListener("click", function () {
		const selected_category_id = category_select.options[category_select.selectedIndex].value;

		if (confirm("카테고리 삭제 시 해당 카테고리의 게시판들도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?") == true) {
			category_del_FetchAPI(selected_category_id);
		} else return;

		this.removeEventListener("click", arguments.callee);
	})

	// ---------------- 해당 카테고리 삭제 FetchAPI ---------------
	function category_del_FetchAPI(category_id) {
		const del_category_url = main_url + "/admin/category_set/" + category_id;
		fetch(del_category_url, {
				method: "DELETE",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then((res) => {
				alert("해당 카테고리가 삭제되었습니다.");
				category_container_clear();
				get_category_FetchAPI();
			})
	}

	// ---------------- 게시판 삭제 FetchAPI ---------------
	function board_del_FetchAPI(board_id, category_id) {
		if (sessionStorage.length == 0) return;
    	else if (sessionStorage.length == 1)
		if (sessionStorage.getItem("access_token") == 0) return;

		const token = sessionStorage.getItem('access_token');
		const del_board_url = main_url + "/admin/board_set/" + board_id;
		fetch(del_board_url, {
				method: "DELETE",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then((res) => {
				alert("게시판이 삭제되었습니다.");
				board_container_clear();
				get_board_FetchAPI(category_id);
			})
	}


	// ##################################################################################
	// ########################### 모달 관련 리스너, API ###########################
	// ##################################################################################

	const category_modal = `<div class="category_modal_back manager_modal_back">
	<div class="category_modal manager_modal">
		<div class="category_exit manager_exit">X</div>
		<div>
			<div class="modal_title">카테고리 추가</div>
			<div>
				<span class="modal_sub">이름</span> 
				<input type="text" class="category_insert_name modal_input" placeholder="카테고리 이름">
			</div>
			<button class="category_insert_btn modal_btn">추가</button>
		</div>
	</div>
	</div>`;

	const board_modal = `<div class="board_modal_back manager_modal_back">
	<div class="board_modal manager_modal">
		<div class="board_exit manager_exit">X</div>
		<div>
			<div class="modal_title">게시판 추가</div>
			<div>
				<span class="modal_sub">이름</span> 
        		<input type="text" class="board_insert_name modal_input" placeholder="게시판 이름">
			</div>
			<div>
				<span class="modal_sub">설명</span> 
				<input type="text" class="board_insert_description modal_input" placeholder="게시판 설명">
			</div>
			<div>
        		<span class="signup_sub">게시판 사진</span>
        		<input type="file" class="board_insert_image modal_input">
    		</div>
			<button class="board_insert_btn modal_btn">추가</button>
		</div>
	</div>
	</div>`;

	const category_plus_btn = document.querySelector(".category_plus_btn");
	const board_plus_btn = document.querySelector(".board_plus_btn");

	category_plus_btn.addEventListener("click", () => {

		// 모달을 생성해준다.
		category_container.innerHTML = category_modal;

		// 모달을 보이게 해준다.
		setTimeout(() => {
			document.querySelector(".category_modal").style.opacity = "1";
			document.querySelector(".category_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
		}, 50);

		// X 버튼 클릭시 모달 사라짐
		document.querySelector(".category_exit").addEventListener("click", () => {
			category_container.innerHTML = '';
		})

		document.querySelector(".category_insert_btn").addEventListener("click", () => {
			category_insert_FetchAPI(document.querySelector(".category_insert_name").value);
		})

	})

	board_plus_btn.addEventListener("click", () => {

		// 모달을 생성해준다.
		board_container.innerHTML = board_modal;

		// 모달 주요 style 변경
		setTimeout(() => {
			document.querySelector(".board_modal").style.opacity = "1";
			document.querySelector(".board_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
		}, 50);

		// X 버튼 클릭시 모달 사라짐
		document.querySelector(".board_exit").addEventListener("click", () => {
			board_container.innerHTML = '';
		})

		document.querySelector(".board_insert_btn").addEventListener("click", () => {
			const selected_category_id = category_select.options[category_select.selectedIndex].value;
			board_insert_FetchAPI(selected_category_id);
		})
	})


	// --------------------- 카테고리 추가 FetchAPI -----------------------
	function category_insert_FetchAPI(category_name) {

		if (sessionStorage.length == 0) return;
    	else if (sessionStorage.length == 1)
        if (sessionStorage.getItem("access_token") == 0) return;

		const token = sessionStorage.getItem('access_token');
	
		const insert_category_url = main_url + "/admin/category_add";
		const send_data = {
			'category_name': category_name
		}

		fetch(insert_category_url, {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				},
				body: JSON.stringify(send_data)
			})
			.then(res => res.json())
			.then((res) => {
				console.log(res);
				alert("카테고리[" + category_name + "]가 추가되었습니다.");
				category_container_clear();
				get_category_FetchAPI();
			})
	}

	// -------------------- 해당 카테고리에 게시판 추가 FetchAPI ------------------------
	function board_insert_FetchAPI(category_id) {

		if (sessionStorage.length == 0) return;
    	else if (sessionStorage.length == 1)
		if (sessionStorage.getItem("access_token") == 0) return;

		const token = sessionStorage.getItem('access_token');
		
		const insert_board_url = main_url + "/admin/board_add";

		const board_name = document.querySelector(".board_insert_name").value;
		const board_description = document.querySelector(".board_insert_description").value;
		const send_data = {
			'category_id': category_id,
			'board_name': board_name,
			'description': board_description
		}

		fetch(insert_board_url, {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				},
				body: JSON.stringify(send_data)
			})
			.then(res => res.json())
			.then(res => {
				console.log(res);
				alert("게시판[" + board_name + "]이 추가되었습니다.");
				board_container_clear();
				get_board_FetchAPI(category_id);
			})
	}
}


// #############################################################################################
// ################################# 2. 신고 리스트 관리 파트 ###################################
// #############################################################################################

function report_management_container_init() {

	const blacklist_modal = `<div class="blacklist_modal_back manager_modal_back">
	<div class="blacklist_modal manager_modal">
		<div class="blacklist_exit manager_exit">X</div>
		<div>
			<div class="modal_title">회원 정지</div>
			<select class="blacklist_option">
				<option value="1">3일</option>
				<option value="2">7일</option>
				<option value="3">30일</option>
				<option value="4">영구</option>				
            </select>
			<button class="blacklist_btn">정지</button>
		</div>
	</div>
	</div>`;

	const blacklist_modal_container = document.querySelector("#blacklist_modal_container");
	const report_blacklist_btns = document.querySelectorAll("#report_blacklist_btn");

	// 회원 정지 버튼을 모두 불러와 리스너 추가
	for (let btn of report_blacklist_btns) {

		btn.addEventListener("click", () => {
			// 모달을 생성해준다.
			blacklist_modal_container.innerHTML = blacklist_modal;

			// 모달 주요 style 변경
			setTimeout(() => {
				document.querySelector(".blacklist_modal").style.opacity = "1";
				document.querySelector(".blacklist_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
			}, 50);

			// X 버튼 클릭시 모달 사라짐
			document.querySelector(".manager_exit").addEventListener("click", () => {
				blacklist_modal_container.innerHTML = '';
			})
		})
	}
}



// #############################################################################################
// #################################### 3. 회원 관리 파트 ######################################
// #############################################################################################

function user_management_container_init() {

	const user_modify_modal = `<div class="user_modal_back manager_modal_back">
	<div class="user_modal manager_modal">
		<div class="user_modal_exit manager_exit">X</div>
		<div>
			<div class="modal_title">회원 정보 수정</div>
			<div>
				<span class="modal_sub">닉네임</span> 
				<input type="text" class="user_modal_input modal_input" placeholder="닉네임 입력">
			</div>
			<button class="user_modify_btn modal_btn">수정</button>
		</div>
	</div>
	</div>`;

	const user_modify_modal_container = document.querySelector("#user_modify_modal_container")
	const user_modify_btns = document.querySelectorAll("#user_modify_btn");

	// 회원 정보 수정 버튼을 모두 불러와 리스너 추가
	for (let btn of user_modify_btns) {

		btn.addEventListener("click", () => {

			user_modify_modal_container.innerHTML = user_modify_modal;

			// 모달 주요 style 변경
			setTimeout(() => {
				document.querySelector(".manager_modal").style.opacity = "1";
				document.querySelector(".manager_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
			}, 50);

			// X 버튼 클릭시 모달 사라짐
			document.querySelector(".manager_exit").addEventListener("click", () => {
				user_modify_modal_container.innerHTML = '';
			})
		})

	}
}