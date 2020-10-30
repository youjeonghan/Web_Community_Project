import * as URL from '/static/js/config.js'
import modify_board_modal from '/static/js/hw/components/modal/modify_board.js';

// ------------------------- 카테고리/게시판 관리 파트 --------------------------
const board_management_btn = document.querySelector('.board_management_btn');
const report_management_btn = document.querySelector('.report_management_btn');
const user_management_btn = document.querySelector('.user_management_btn');

const board_management_container = document.querySelector('.board_management_container');
const report_management_container = document.querySelector('.report_management_container');
const user_management_container = document.querySelector('.user_management_container');

board_management_btn.addEventListener('click', function () {
	board_management_container.style.display = 'block';
	report_management_container.style.display = 'none';
	user_management_container.style.display = 'none';
	board_management_container_init();
})

report_management_btn.addEventListener('click', function () {
	board_management_container.style.display = 'none';
	report_management_container.style.display = 'block';
	user_management_container.style.display = 'none';
	report_management_container_init();
})


user_management_btn.addEventListener('click', function () {
	board_management_container.style.display = 'none';
	report_management_container.style.display = 'none';
	user_management_container.style.display = 'block';
	user_management_container_init();
})


// ################################################################################################
// ############################### 1. 카테고리/게시판 관리 파트 ####################################
// ################################################################################################
function board_management_container_init() {

	const category_select = document.querySelector('.category_menu');
	const category_container = document.querySelector('#category_modal_container');
	const board_container = document.querySelector('#board_modal_container');

	board_container_init();
	category_container_clear();
	get_category_FetchAPI();

	function board_container_init() {
		const board_container = `<span class='sub_title'>게시판 - </span>
		<button type='button' class='category_del_btn plus_btn'>해당 카테고리 삭제</button>
		<button class='board_plus_btn plus_btn'>게시판 추가 (+)</button>
		<div class='board_box'>
			<div class='board_menu'></div>
			<div class='board_page' id='pagination'></div>
		</div>`;

		document.querySelector('.board_container').innerHTML = board_container;
	}

	function category_container_clear() {
		// 모든 child 삭제
		while (category_select.hasChildNodes()) {
			category_select.removeChild(category_select.lastChild);
		}
		// 기본 옵션 넣어주고 카테고리 관련 정보 다 초기화
		category_select.innerHTML = `<option selected>Select :)</option>`;
		document.querySelector('.board_menu').innerHTML = '';
		document.querySelector('.board_page').innerHTML = '';
		document.querySelector('.board_container .sub_title').innerText = '게시판 - ';
		document.querySelector('.category_del_btn').disabled = true;
		document.querySelector('.board_plus_btn').disabled = true;
		// modal 창 제거
		category_container.innerHTML = '';
	}

	function board_container_clear() {
		document.querySelector('.board_menu').innerHTML = '';
		document.querySelector('.board_page').innerHTML = '';
		// modal 창 제거
		board_container.innerHTML = '';
	}

	//------------- 카테고리 반환 FetchAPI --------------
	function get_category_FetchAPI() {

		const get_category_url = URL.CATEGORY_INFO;
		fetch(get_category_url, {
				method: 'GET',
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
		// 불러온 카테고리를 셀렉트란에 넣어준다.
		for (let cg of category_list) {
			const category = document.createElement('option');
			category.innerText = cg.category_name;
			category.value = `${cg.id}`;
			category_select.appendChild(category);
		}

		// 셀렉트한 카테고리가 변할 때의 리스너 추가 (해당 카테고리의 게시판 불러온다.)
		category_select.addEventListener('change', () => {
			const selected_category_id = category_select.options[category_select.selectedIndex].value;
			document.querySelector('.board_container .sub_title').innerText = category_select.options[category_select.selectedIndex].innerText + ' - ';
			document.querySelector('.category_del_btn').disabled = false;
			document.querySelector('.board_plus_btn').disabled = false;
			get_board_FetchAPI(selected_category_id);
		})
	}


	// ------------- 해당 카테고리에 속한 게시판 반환 FetchAPI --------------
	function get_board_FetchAPI(category_id) {

		const get_board_url = URL.BOARDS_IN_CATEGORY + category_id;
		fetch(get_board_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}
			})
			.then(res => res.json())
			.then((res) => {
				board_in_category_pagination(res, category_id);
			})
	}

	function board_in_category_pagination(board_list, category_id) {

		const small_container = document.querySelector('.board_menu');
		const page_container = document.querySelector('.board_page');

		let current_page = 1;
		let show_cnt = 28;

		function DisplayList(board_list, container, show_cnt, page) {
			container.innerHTML = '';
			page--;

			let start = show_cnt * page;
			let end = start + show_cnt;
			let paginatedItems = board_list.slice(start, end);

			for (let i = 0; i < paginatedItems.length; i++) {

				const board_div = document.createElement('div');
				board_div.classList.add('board');

				let item = paginatedItems[i];

				let board = document.createElement('span');
				board.classList.add('board');
				if (item.board_image == '' || item.board_image == null)
					board.innerHTML = `<img src='../static/img/main_img/board_default.png' class='board_image'> ${item.board_name}`;
				else
					board.innerHTML = `<img src='../static/img/board_img/${item.board_image}' class='board_image'> ${item.board_name}`;
				board_div.appendChild(board);

				let board_modify_btn = document.createElement('button');
				board_modify_btn.classList.add('board_modify_btn', 'board_btn');
				board_modify_btn.innerText = '수정';
				board_modify_btn.addEventListener('click', () => {
					// 모달을 생성해준다.
					const board_modify_modal_container = document.querySelector('#board_modify_modal_container');
					board_modify_modal_container.innerHTML = modify_board_modal;
					document.querySelector('.board_modify_modal_name').innerText = item.board_name;
					// 모달을 보이게 해준다.
					setTimeout(() => {
						document.querySelector('.board_modify_modal').style.opacity = '1';
						document.querySelector('.board_modify_modal').style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
					}, 50);
					// X 버튼 클릭시 모달 사라짐
					document.querySelector('.board_modify_modal_exit').addEventListener('click', () => {
						board_modify_modal_container.innerHTML = '';
					})
					// 게시판 사진 수정 버튼 리스너
					document.querySelector('.board_modify_modal_btn').addEventListener('click', () => {
						board_image_modify_FetchAPI(item.id, category_id);
					})
				})
				board_div.appendChild(board_modify_btn);

				let board_del_btn = document.createElement('button');
				board_del_btn.classList.add('board_del_btn', 'board_btn');
				board_del_btn.innerText = 'X';
				// 게시판 삭제 X 버튼 누를 시 delete API 호출
				board_del_btn.addEventListener('click', () => {
					if (confirm('게시판 삭제 시 해당 게시판의 글도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
						board_del_FetchAPI(item.id, item.category_id);
					} else return;
				})
				board_div.appendChild(board_del_btn);

				container.appendChild(board_div);
			}
		}

		function SetupPagination(board_list, container, show_cnt) {
			container.innerHTML = '';

			let page_count = Math.ceil(board_list.length / show_cnt);
			for (let i = 1; i < page_count + 1; i++) {
				let btn = PaginationButton(i, board_list);
				container.appendChild(btn);
			}
		}

		function PaginationButton(i, board_list) {
			let pages = document.createElement('span');
			pages.classList.add('pages');
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


	// --------------------------- 게시판 이미지 수정 Fetch API ---------------------------
	function board_image_modify_FetchAPI(id, category_id) {
		// 로그인 토근 여부 확인
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const send_data = new FormData();

		const board_image = document.querySelector('.board_modify_image');
		if (board_image.value == '') send_data.append('profile_img', '');
		else send_data.append('board_image', board_image.files[0]);

		const board_modify_url = URL.MODIFY_BOARD_IMAGE + id;
		fetch(board_modify_url, {
				method: 'POST',
				body: send_data,
				headers: {
					'Accept': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				if (res['result'] == 'modify_success') {
					alert('게시판 사진 수정 완료');
					get_board_FetchAPI(category_id);
					document.querySelector('#board_modify_modal_container').innerHTML = '';
				}
			})

	}



	// #########################################################################
	// ######################### 삭제 관련 리스너, API ##########################
	// #########################################################################

	// 해당 카테고리 삭제 버튼 클릭 리스너
	document.querySelector('.category_del_btn').addEventListener('click', function () {
		const selected_category_id = category_select.options[category_select.selectedIndex].value;

		if (confirm('카테고리 삭제 시 해당 카테고리의 게시판들도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
			category_del_FetchAPI(selected_category_id);
		} else return;

		this.removeEventListener('click', arguments.callee);
	})

	// ---------------- 해당 카테고리 삭제 FetchAPI ---------------
	function category_del_FetchAPI(category_id) {
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;

		const token = sessionStorage.getItem('access_token');
		const del_category_url = DELETE_CATEGORY + category_id;
		fetch(del_category_url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then((res) => {
				alert('해당 카테고리가 삭제되었습니다.');
				category_container_clear();
				get_category_FetchAPI();
			})
	}

	// ---------------- 게시판 삭제 FetchAPI ---------------
	function board_del_FetchAPI(board_id, category_id) {
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;

		const token = sessionStorage.getItem('access_token');
		const del_board_url = URL.DELETE_BOARD + board_id;
		fetch(del_board_url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then((res) => {
				alert('게시판이 삭제되었습니다.');
				board_container_clear();
				get_board_FetchAPI(category_id);
			})
	}


	// ##################################################################################
	// ########################### 모달 관련 리스너, API ###########################
	// ##################################################################################

	const category_modal = `<div class='category_modal_back manager_modal_back'>
	<div class='category_modal manager_modal'>
		<div class='category_exit manager_exit'>X</div>
		<div>
			<div class='modal_title'>카테고리 추가</div>
			<div class='modal_sub_container'>
				<span class='modal_sub'>이름</span> 
				<input type='text' class='category_insert_name modal_input' placeholder='카테고리 이름' maxlength='12'>
			</div>
			<button class='category_insert_btn modal_btn'>추가</button>
		</div>
	</div>
	</div>`;

	const board_modal = `<div class='board_modal_back manager_modal_back'>
	<div class='board_modal manager_modal'>
		<div class='board_exit manager_exit'>X</div>
		<div>
			<div class='modal_title'>게시판 추가</div>
			<div class='modal_sub_container'>
				<span class='modal_sub'>이름</span> 
        		<input type='text' class='board_insert_name modal_input' placeholder='게시판 이름' maxlength='12'>
			</div>
			<div class='modal_sub_container'>
				<span class='modal_sub'>설명</span> 
				<input type='text' class='board_insert_description modal_input' placeholder='게시판 설명'>
			</div>
			<div class='modal_sub_container'>
        		<span class='modal_sub'>사진</span>
        		<input type='file' class='board_insert_image modal_input' accept='image/*'>
    		</div>
			<button class='board_insert_btn modal_btn'>추가</button>
		</div>
	</div>
	</div>`;

	const category_plus_btn = document.querySelector('.category_plus_btn');
	const board_plus_btn = document.querySelector('.board_plus_btn');

	category_plus_btn.addEventListener('click', () => {

		// 모달을 생성해준다.
		category_container.innerHTML = category_modal;

		// 모달을 보이게 해준다.
		setTimeout(() => {
			document.querySelector('.category_modal').style.opacity = '1';
			document.querySelector('.category_modal').style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
		}, 50);

		// X 버튼 클릭시 모달 사라짐
		document.querySelector('.category_exit').addEventListener('click', () => {
			category_container.innerHTML = '';
		})

		document.querySelector('.category_insert_btn').addEventListener('click', () => {
			category_insert_FetchAPI(document.querySelector('.category_insert_name').value);
		})

	})

	board_plus_btn.addEventListener('click', () => {

		// 모달을 생성해준다.
		board_container.innerHTML = board_modal;

		// 모달 주요 style 변경
		setTimeout(() => {
			document.querySelector('.board_modal').style.opacity = '1';
			document.querySelector('.board_modal').style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
		}, 50);

		// X 버튼 클릭시 모달 사라짐
		document.querySelector('.board_exit').addEventListener('click', () => {
			board_container.innerHTML = '';
		})

		document.querySelector('.board_insert_btn').addEventListener('click', () => {
			const selected_category_id = category_select.options[category_select.selectedIndex].value;
			board_insert_FetchAPI(selected_category_id);
		})
	})


	// --------------------- 카테고리 추가 FetchAPI -----------------------
	function category_insert_FetchAPI(category_name) {

		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;

		const token = sessionStorage.getItem('access_token');

		
		const send_data = {
			'category_name': category_name
		}

		const insert_category_url = URL.ADD_CATEGORY;
		fetch(insert_category_url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				},
				body: JSON.stringify(send_data)
			})
			.then(res => res.json())
			.then((res) => {
				if (res['error'] == '이미 있는 카테고리입니다.') {
					alert('이미 존재하는 카테고리입니다.');
				} else {
					alert('카테고리[' + category_name + ']가 추가되었습니다.');
					category_container_clear();
					get_category_FetchAPI();
				}
			})
	}

	// -------------------- 해당 카테고리에 게시판 추가 FetchAPI ------------------------
	function board_insert_FetchAPI(category_id) {

		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;

		const token = sessionStorage.getItem('access_token');

		let send_data = new FormData();

		const board_name = document.querySelector('.board_insert_name').value;
		const board_description = document.querySelector('.board_insert_description').value;
		const board_image = document.querySelector('.board_insert_image');

		send_data.append('board_name', board_name);
		send_data.append('category_id', category_id);
		send_data.append('description', board_description);

		if (board_image.value == '') send_data.append('board_image', '');
		else send_data.append('board_image', board_image.files[0]);

		const insert_board_url = URL.ADD_BOARD;
		fetch(insert_board_url, {
				method: 'POST',
				body: send_data,
				headers: {
					'Accept': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				if (res['result'] == 'success') {
					alert('게시판[' + board_name + ']이 추가되었습니다.');
					board_container_clear();
					get_board_FetchAPI(category_id);
				}
			})
	}
}


// #############################################################################################################
// ########################################### 2. 신고 리스트 관리 파트 ##########################################
// #############################################################################################################

function report_management_container_init() {

	get_report_posts_FetchAPI();

	const report_select_menu = document.querySelector('#report_select_menu');
	report_select_menu.addEventListener('change', () => {
		const selected_value = report_select_menu.options[report_select_menu.selectedIndex].value;
		if (selected_value == 'post') {
			get_report_posts_FetchAPI();
		} else {
			get_report_comments_FetchAPI();
		}
	})

	function get_report_posts_FetchAPI() {

		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const get_report_post_url = URL.GET_POST_REPORTS;
		fetch(get_report_post_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				view_report_list('post', res);
			})

	}

	function get_report_comments_FetchAPI() {

		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const get_report_comment_url = URL.GET_COMMENT_REPORTS;
		fetch(get_report_comment_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				view_report_list('comment', res);
			})
	}

	function view_report_list(type, report_list) {

		// 체크 리스트 삭제 버튼 리스너 초기화를 위한 재생성
		const report_menus = document.querySelector('#report_menus');
		report_menus.removeChild(report_menus.lastElementChild);
		const report_check_del_btn = document.createElement('button');
		report_check_del_btn.classList.add('report_check_del_btn', 'plus_btn');
		report_check_del_btn.innerText = '체크 리스트 삭제';
		report_menus.append(report_check_del_btn);

		// 리포트 컨테이너 초기화
		const reports_container = document.querySelector('.reports');
		reports_container.innerHTML = '';

		// 신고 목록에 신고리스트 삽입
		for (let report of report_list) {
			const report_div = document.createElement('div');
			report_div.classList.add('report');

			// 함수 인자로 넘어온 타입에 따라 게시글or댓글 정보를 넣어준다.
			if (type == 'post') {
				const report_info = `<input type='checkbox' class='r_item' id='report_check' value='${report.id}'>
				<span class='r_item'>${report.report_num}</span>
				<span class='r_item'>${report.nickname}</span>
				<span class='r_item report_title'>${report.subject}</span>
				<span class='r_item'>${report.create_date}</span>
				`
				report_div.innerHTML = report_info;
			} else {
				const report_info = `<input type='checkbox' class='r_item' id='report_check' value='${report.id}'>
				<span class='r_item'>${report.report_num}</span>
				<span class='r_item'>${report.nickname}</span>
				<span class='r_item report_title'>${report.content}</span>
				<span class='r_item'>${report.create_date}</span>
				`
				report_div.innerHTML = report_info;
			}

			// 리포트 버튼들의 클래스를 배열로 묶어 선언해놓는다. 중복사용 될 예정이므로 선언
			const report_btn_classes = ['report_btn', 'r_item'];

			// 해당 신고 작성 회원 정지 버튼 생성
			const report_blacklist_btn = document.createElement('button');
			report_blacklist_btn.classList.add(...report_btn_classes);
			report_blacklist_btn.id = 'report_blacklist_btn';
			report_blacklist_btn.innerText = '회원 정지';
			report_blacklist_btn.addEventListener('click', () => {
				const blacklist_modal = `<div class='blacklist_modal_back manager_modal_back'>
										<div class='blacklist_modal manager_modal'>
											<div class='blacklist_exit manager_exit'>X</div>
											<div>
												<div class='modal_title'>회원 정지</div>
												<select class='blacklist_option'>
													<option value='3'>3일</option>
													<option value='7'>7일</option>
													<option value='30'>30일</option>
													<option value='100'>영구</option>				
												</select>
												<button class='blacklist_btn'>정지</button>
											</div>
										</div>
										</div>`;
				// 모달을 생성해준다.
				const blacklist_modal_container = document.querySelector('#blacklist_modal_container');
				blacklist_modal_container.innerHTML = blacklist_modal;
				// 모달의 주요 style 변경
				setTimeout(() => {
					document.querySelector('.blacklist_modal').style.opacity = '1';
					document.querySelector('.blacklist_modal').style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
				}, 50);
				// X 버튼 클릭시 모달 사라짐
				document.querySelector('.manager_exit').addEventListener('click', () => {
					blacklist_modal_container.innerHTML = '';
				});
				// 모달에서 정지 버튼 클릭 시 해당 회원 정지 FetchAPI 호출
				document.querySelector('.blacklist_btn').addEventListener('click', () => {
					const blacklist_date_select = document.querySelector('.blacklist_option');
					const punishment_date = blacklist_date_select.options[blacklist_date_select.selectedIndex].value;
					report_user_blacklist_FetchAPI(report.userid, punishment_date, type, report.id);
				});

			})

			// 해당 신고 게시글or댓글 삭제 버튼 생성
			const report_del_btn = document.createElement('button');
			report_del_btn.classList.add(...report_btn_classes);
			report_del_btn.id = 'report_del_btn';
			if (type == 'post') {
				report_del_btn.innerText = '게시글 삭제';
				report_del_btn.addEventListener('click', () => {
					if (confirm('해당 게시글 삭제 시 댓글도 함께 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
						// 해당 신고 게시글 타입과 아이디를 넘긴다.
						report_del_FetchAPI(type, [{
							'id': report.id
						}]);
					} else return;
				});
			} else {
				report_del_btn.innerText = '댓글 삭제';
				report_del_btn.addEventListener('click', () => {
					if (confirm('해당 댓글 삭제 시 "삭제된 댓글입니다." 문구로 대체됩니다.\n정말로 삭제하시겠습니까?') == true) {
						// 해당 신고 게시글or댓글의 타입과 아이디를 넘긴다.
						report_del_FetchAPI(type, [{
							'id': report.id
						}]);
					} else return;
				});
			}

			// 해당 신고 취소(처리 완료) 버튼 생성
			const report_calcel_btn = document.createElement('button');
			report_calcel_btn.classList.add(...report_btn_classes);
			report_calcel_btn.id = 'report_cancel_btn';
			report_calcel_btn.innerHTML = `<i class='fas fa-check'></i>`;
			report_calcel_btn.addEventListener('click', () => {
				if (confirm('신고 처리 시 해당 신고글이 신고리스트에서 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
					// 해당 신고 게시글or댓글의 타입과 아이디를 넘긴다.
					report_list_delete_FetchAPI(type, report.id);
				} else return;
			});

			// 위에 생성한 버튼 3개를 div에 넣어준다.
			report_div.append(report_blacklist_btn);
			report_div.append(report_del_btn);
			report_div.append(report_calcel_btn);

			// 완성된 div를 reports 컨테이너에 넣어준다.
			reports_container.append(report_div);
		}

		// --------------------- 전체 체크 버튼 누를 시 체크박스 전체 선택 리스너 --------------------
		const report_check_first = document.querySelector('.report_check_first');
		report_check_first.addEventListener('change', () => {
			const all_checkbox = document.querySelectorAll('#report_check');
			for (let check of all_checkbox) check.checked = true;
		})

		// ------------- 상단의 체크 리스트 삭제 버튼 리스너 --------------
		document.querySelector('.report_check_del_btn').addEventListener('click', () => {
			const all_checkbox = document.querySelectorAll('#report_check');
			const checked_id_list = [];
			for (let check of all_checkbox) {
				if (check.checked) checked_id_list.push({
					'id': check.value
				});
			}
			// 체크된 리스트가 하나라도 있다면 삭제 API 호출
			if (checked_id_list.length != 0) report_del_FetchAPI(type, checked_id_list);

			const report_check_first = document.querySelector('.report_check_first');
			report_check_first.checked = false;
		});


	}

	function report_user_blacklist_FetchAPI(user_id, punishment_date, type, id) {

		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		let send_data;
		if (type == 'post') {
			send_data = {
				'user_id': user_id,
				'punishment_date': punishment_date,
				'post_id': id,
				'comment_id': ''
			}
		} else {
			send_data = {
				'user_id': user_id,
				'punishment_date': punishment_date,
				'post_id': '',
				'comment_id': id
			}
		}

		const report_blacklist_url = URL.ADD_USER_BLACKLIST;
		fetch(report_blacklist_url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify(send_data)
			})
			.then(res => res.json())
			.then((res) => {
				alert('해당 회원이 블랙리스트에 추가되었습니다.');
				document.querySelector('#blacklist_modal_container').innerHTML = '';
				if (type == 'post') get_report_posts_FetchAPI();
				else get_report_comments_FetchAPI();
			})
	}

	// 해당 신고 게시글or댓글을 삭제하는 API
	function report_del_FetchAPI(type, id) {
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const send_data = id;

		let report_del_url;
		if (type == 'post') report_del_url = URL.DELETE_POST_REPORT;
		else report_del_url = URL.DELETE_COMMENT_REPORT;

		fetch(report_del_url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				},
				body: JSON.stringify(send_data)
			})
			.then(res => {
				if (type == 'post') {
					alert('해당 게시글이 삭제되었습니다.');
					get_report_posts_FetchAPI();
				} else {
					alert('해당 댓글이 삭제되었습니다.');
					get_report_comments_FetchAPI();
				}
			})
	}

	// 해당 신고를 신고 리스트에서만 삭제하는 신고 처리 API
	function report_list_delete_FetchAPI(type, id) {
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const send_data = [{
			'id': id
		}]

		let report_list_delete_url;
		if (type == 'post') report_list_delete_url = URL.DELETE_POST_REPORTLIST;
		else report_list_delete_url = URL.DELETE_COMMENT_REPORTLIST;

		fetch(report_list_delete_url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				},
				body: JSON.stringify(send_data)
			})
			.then(res => {
				if (type == 'post') {
					alert('해당 게시글 신고가 처리되었습니다.');
					get_report_posts_FetchAPI();
				} else {
					alert('해당 댓글 신고가 처리되었습니다.');
					get_report_comments_FetchAPI();
				}
			})
	}

}



// ############################################################################################################
// ########################################### 3. 회원 관리 파트 ################################################
// #############################################################################################################

function user_management_container_init() {

	get_all_user_FetchAPI();

	function get_all_user_FetchAPI() {
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;

		const token = sessionStorage.getItem('access_token');

		const get_all_user_url = URL.GET_ALL_USER_INFO;

		fetch(get_all_user_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				insert_user_list(res);
			})
	}

	// 검색 버튼 재생성
	const user_menus = document.querySelector('#user_menus');
	user_menus.removeChild(user_menus.lastElementChild);
	const user_search_btn = document.createElement('button');
	user_search_btn.classList.add('user_search_btn', 'plus_btn');
	user_search_btn.innerText = '검색';
	user_search_btn.addEventListener('click', () => {
		const user_search_input = document.querySelector('.user_search_input');
		if (user_search_input.value == '') {
			user_search_input.focus();
			alert('검색할 회원 닉네임을 입력해주세요.')
		} else user_search_FetchAPI(user_search_input);
	})
	// enter 키 입력 시 검색 api 호출
	document.querySelector('.user_search_input').addEventListener('keyup', (e) => {
		if (e.keyCode === 13) {
			const user_search_input = document.querySelector('.user_search_input');
			if (user_search_input.value == '') {
				user_search_input.focus();
				alert('검색할 회원 닉네임을 입력해주세요.')
			} else user_search_FetchAPI(user_search_input);
		}
	})
	user_menus.append(user_search_btn);

	function user_search_FetchAPI(user_search_input) {
		// 로그인 토근 여부 확인
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const user_search_url = GET_SEARCH_USER + user_search_input.value;
		fetch(user_search_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				insert_user_list(res);
			})
	}

	function insert_user_list(res) {

		const user_list_container = document.querySelector('.users');
		user_list_container.innerHTML = '';

		for (let user of res) {

			const user_modify_modal = `<div class='user_modal_back manager_modal_back'>
			<div class='user_modal manager_modal'>
			<div class='user_modal_exit manager_exit'>X</div>
			<div>
			<div class='modal_title'>회원 정보 수정</div>
			<div class='modal_sub_container'>
				<span class='modal_sub'>닉네임</span> 
				<input type='text' class='user_modal_input modal_input' placeholder='닉네임 입력'>
			</div>
			<button class='user_modify_btn modal_btn'>수정</button>
			</div>
			</div>
			</div>`;

			const user_div = document.createElement('div');
			user_div.classList.add('user');

			const user_info = `<span class='r_item'>${user.username}</span>
			<span class='r_item'>${user.userid}</span>
			<span class='r_item'>${user.nickname}</span>  
			<span class='r_item'>${user.email}</span>
			<span class='r_item'>${user.birth}</span>`

			user_div.innerHTML = user_info;

			let user_modify_btn = document.createElement('button');
			user_modify_btn.classList.add('r_item');
			user_modify_btn.classList.add('report_btn');
			user_modify_btn.id = 'user_modify_btn';
			user_modify_btn.innerText = '정보 수정';
			user_modify_btn.addEventListener('click', () => {
				// 모달을 생성해준다.
				const user_modify_modal_container = document.querySelector('#user_modify_modal_container');
				user_modify_modal_container.innerHTML = user_modify_modal;
				// 모달 주요 style 변경
				setTimeout(() => {
					document.querySelector('.manager_modal').style.opacity = '1';
					document.querySelector('.manager_modal').style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
				}, 50);
				// X 버튼 클릭시 모달 사라짐
				document.querySelector('.manager_exit').addEventListener('click', () => {
					user_modify_modal_container.innerHTML = '';
				})
				document.querySelector('.user_modify_btn').addEventListener('click', () => {
					user_info_modify_FetchAPI(user.id);
				})
			})
			user_div.appendChild(user_modify_btn);

			let user_del_btn = document.createElement('button');
			user_del_btn.classList.add('r_item');
			user_del_btn.classList.add('report_btn');
			user_del_btn.innerText = '회원 삭제';
			user_del_btn.addEventListener('click', () => {
				if (confirm('회원 삭제 시 해당 회원의 글, 댓글도 모두 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
					user_del_FetchAPI(user.id);
				} else return;
			})
			user_div.appendChild(user_del_btn);

			// 완성된 user_div를 user_list_container에 넣어준다.
			user_list_container.append(user_div);
		}
	}

	function user_info_modify_FetchAPI(user_id) {

		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;
		const token = sessionStorage.getItem('access_token');

		const send_data = new FormData();

		const user_nickname = document.querySelector('.user_modal_input');
		send_data.append('nickname', user_nickname.value);

		const user_modify_url = URL.MODIFY_USER_NICKNAME + user_id;
		fetch(user_modify_url, {
				method: 'DELETE',
				body: send_data,
				headers: {
					'Accept': 'application/json',
					'Authorization': token
				}
			})
			.then(res => res.json())
			.then((res) => {
				if (res['result'] == 'success') {
					alert('회원 정보 수정 완료');
					// 수정 모달 창을 없애고, 모든 유저 정보를 다시 불러온다(유사 새로고침을 위함).
					document.querySelector('#user_modify_modal_container').innerHTML = '';
					get_all_user_FetchAPI();
				} else if (res['error'] == '이미 있는 닉네임입니다.') {
					alert('이미 존재하는 닉네임입니다.');
					user_nickname.focus();
				}
			})
	}

	function user_del_FetchAPI(user_id) {
		if (sessionStorage.length == 0) return;
		else if (sessionStorage.length == 1)
			if (sessionStorage.getItem('access_token') == 0) return;

		const token = sessionStorage.getItem('access_token');
		const user_del_url = URL.DELETE_USER + user_id;
		fetch(user_del_url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(res => {
				if (Response.ok) {
					alert('회원이 삭제되었습니다.');
					get_all_user_FetchAPI();
				} else {
					console.log(res.status + ' error');
				}
			})
	}
}