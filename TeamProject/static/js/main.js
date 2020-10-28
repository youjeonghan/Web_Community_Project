const main_url = "http://127.0.0.1:5000/api";

//------------------ 베스트 게시글 FetchAPI ------------------
function get_bestpost_FetchAPI() {

	const get_bestpost_url = main_url + "/bestpost";
	fetch(get_bestpost_url, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
		.then(res => res.json())
		.then((res) => {
			console.log(res);
			best_post_init(res);
		})
}

get_bestpost_FetchAPI();

// ----------------- 베스트 게시글 -----------------
function best_post_init(res) {
	
	for(let pl of res){
		// div element 생성하고 클래스 추가해준다.
		const post = document.createElement("div");
		post.classList.add("best_post");
		
		// post에 들어갈 내용인 in_post이다. 받아온 post_list에서 게시판 이름과 글 제목을 ${}를 통해 삽입해준다.
		const in_post = `<span class="best_post_board_name">[${pl.board_name}]</span>
		<span class="post_title">${pl.subject}</span>
		<span class="best_post_icons"> <i class="far fa-thumbs-up"></i> ${pl.like_num} 
		<i class="far fa-comment"></i> ${pl.comment_num}</span>`
		post.innerHTML = in_post;

		post.addEventListener("click",function(){
			location.href=`post#${pl.board_id}#postinfo#${pl.id}`; //페이지 이동
		})
		// best_board div에 삽입해준다.
		document.querySelector(".best_post_container").appendChild(post);
	}
	
	const post_title = document.querySelectorAll(".post_title");
	// 베스트 게시글의 제목을 모두 불러와서 일정 글자가 넘으면 일정 글자 이후로 ... 으로 바꿔줌
	for (let pt of post_title) {
		if (pt.innerText.length > 12) {
			pt.innerText = pt.innerText.substr(0, 12) + '...';
		}
	}
}

//------------------ 베스트 게시판 FetchAPI ------------------
function get_bestboard_FetchAPI() {

	const get_bestboard_url = main_url + "/bestboard";
	fetch(get_bestboard_url, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
		.then(res => res.json())
		.then((res) => {
			console.log(res);
			best_board_init(res);
		})
}
get_bestboard_FetchAPI();

// ------------------ 베스트 게시판 ----------------------
function best_board_init(res) {
	
	const slider = document.querySelector(".slider");

	for (let bb of res) {
		// slide라는 div element 생성
		const slide = document.createElement("div");
		slide.classList.add("slide");

		// 이미지가 없다면 디폴트 이미지 넣어줌
		if(bb.board_image == null){
			slide.innerHTML = `<img src="../static/img/main_img/board_default.png" class="s_img">
			<div>${bb.board_name}</div>`;
		}
		// 이미지 있으면 그대로 게시판 이미지, 이름 넣어줌
		else{
			slide.innerHTML = `<img src="../static/img/board_img/${bb.board_image}" class="s_img">
			<div>${bb.board_name}</div>`;	
		}

		// 마우스 hovering
		slide.addEventListener("mouseenter",function(){
			slide.style.opacity = "1";
		})
		slide.addEventListener("mouseleave",function(){
			slide.style.opacity = "0.7";
		})
		slide.addEventListener("click",()=>{
			location.href=`post#${bb.id}#postmain`
		})
		slider.appendChild(slide);
	}


	// ------------------------ slider animation ------------------------- //
	// 베스트 게시판 아이콘 슬라이더
	let left_btn = document.querySelector(".s_btn_left");
	let right_btn = document.querySelector(".s_btn_right");
	let slides = document.querySelectorAll(".slide");
	let bar = document.querySelector(".bar");
	var index = 0;

	// 좌우 버튼 누르면 긴 slider 자체가 좌우로 이동하는 방식
	left_btn.addEventListener("click", function () {
		index--;
		if (index < 0) {
			index = slides.length - 6;
			bar.style.left = 100 - (100 / 6) + '%';
		}
		const move = index * -15;
		slider.style.left = move + "vw";
		const bar_move = index * (100 / 5);
		bar.style.left = bar_move + '%';
	})

	right_btn.addEventListener("click", function () {
		index++;
		if (index > slides.length - 6) {
			index = 0;
			bar.style.left = "0";
		}
		const move = index * -15;
		slider.style.left = move + "vw";
		const bar_move = index * (100 / 5);
		bar.style.left = bar_move + '%';
	})

}


// --------------------------------------------- 카테고리 ------------------------------------------ //
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

get_category_FetchAPI();

// ------- 카테고리 init --------
function category_init(res) {

	// --------------- 카테고리 컨테이너 생성 -------------
	let first=0;
	for(let cg of res){
		const category = document.createElement("div");
		category.classList.add("category");
		// 첫번째 카테고리는 바로 보여야되기 때문에 active 클래스를 넣어준다.
		if(first==0){
			category.classList.add("active");
			first++;
		}
	
		category.innerHTML = `<div class="category_name" category_id="${cg.id}">${cg.category_name}</div>
		<div class="board_container"></div>
		<div class="board_page_container" id="pagination"></div><div class="b_btn_left b_btn">
		<img src="../static/img/main_img/arrow-left.png" alt="" class="b_btn_img">
		</div>
		<div class="b_btn_right b_btn">
			<img src="../static/img/main_img/arrow-right.png" alt="" class="b_btn_img">
		</div>`

		document.querySelector(".category_container").appendChild(category);
	}
	
	// 메인페이지에 들어오면 하단에 보여질 첫번째 카테고리의 게시판들을 먼저 init 해준다.
	const first_category_id = document.querySelector(".active").childNodes[0].getAttribute("category_id");
	get_board_FetchAPI(first_category_id);

	// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 카테고리 컨테이너 생성 완료
	

	// ---------- 왼쪽, 오른쪽 버튼 이벤트리스너 init 부분 ----------
	const category_left_btns = document.querySelectorAll(".b_btn_left");
	const category_right_btns = document.querySelectorAll(".b_btn_right");
	const categorys = document.querySelectorAll(".category");

	for(let category_left_btn of category_left_btns){
		category_left_btn.addEventListener("click", function () {
			// 현재 active된 카테고리를 불러온다.
			const current = document.querySelector(".active");
			if (current) {
				current.classList.remove("active");
				if (current.previousElementSibling) {
					current.previousElementSibling.classList.add("active");
				} else {
					categorys[categorys.length - 1].classList.add("active");
				}
			}
			// 바뀐 카테고리의 아이디를 가져와서 해당 카테고리의 게시판들을 받아 init 해준다.
			const changed_category_id = document.querySelector(".active").childNodes[0].getAttribute("category_id");
			get_board_FetchAPI(changed_category_id);
		})
	}
	
	for (let category_right_btn of category_right_btns) {
		category_right_btn.addEventListener("click", function () {

			// 현재 active된 카테고리를 불러온다.
			const current = document.querySelector(".active");
			if (current) {
				current.classList.remove("active");
				if (current.nextElementSibling) {
					current.nextElementSibling.classList.add("active");
				} else {
					document.querySelector(".category").classList.add("active");
				}
			}

			// 바뀐 카테고리의 아이디를 가져와서 해당 카테고리의 게시판들을 받아 init 해준다.
			const changed_category_id = document.querySelector(".active").childNodes[0].getAttribute("category_id");
			get_board_FetchAPI(changed_category_id);
		})
	}
}



// ------------------------------------- 게시판 ---------------------------------------------

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

	fetch(get_board_FetchAPI,{
		method: "POST",
		headers: {
			'Accept' : 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then(res => res.json())
	.then(res=>{
		board_in_category_pagination(res);
	})
}

// ------------- 한 카테고리에 들어가는 모든 게시판들을 paging 하여 보여주는 함수 ----------------
function board_in_category_pagination(board_list) {

	const board_container = document.querySelector('.active .board_container');
	const page_container = document.querySelector('.active .board_page_container');

	// 현재 페이지 설정 초기값 1
	let current_page = 1;
	// 한 페이지에 보여줄 게시판 수
	let show_cnt = 32;

	function DisplayList(board_list, container, show_cnt, page) {
		container.innerHTML = "";
		page--;

		let start = show_cnt * page;
		let end = start + show_cnt;
		let paginatedboard_list = board_list.slice(start, end);

		for (let i = 0; i < paginatedboard_list.length; i++) {
			let item = paginatedboard_list[i];

			let item_element = document.createElement('span');
			item_element.classList.add('board');

			if(item.board_image == "" || item.board_image == null){
				item_element.innerHTML = `<img src="../static/img/main_img/board_default.png" class="category_board_image"> ${item.board_name}`;
			}
			else{
				item_element.innerHTML = `<img src="../static/img/board_img/${item.board_image}" class="category_board_image"> ${item.board_name}`;
			}

			// 해당 게시판을 누를 시 링크 이동 리스너
			item_element.addEventListener("click",function(){
				location.href=`post#${item.id}#postmain`;
			})

			container.appendChild(item_element);
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
			DisplayList(board_list, board_container, show_cnt, current_page);

			let current_btn = document.querySelector('.board_page_container .p_active');
			current_btn.classList.remove('p_active');

			pages.classList.add('p_active');
		});

		return pages;
	}

	DisplayList(board_list, board_container, show_cnt, current_page);
	SetupPagination(board_list, page_container, show_cnt);

}
