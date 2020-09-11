// ----------------- 베스트 게시글 -----------------
function best_post_init(){

	const post_list = [
		{
			post_id : "1",
			board_name : "메이플스토리",
			subject : "떴나?"
		},
		{
			post_id : "2",
			board_name : "어몽어스",
			subject : "임포 레전드판"
		},
		{
			post_id : "3",
			board_name : "메이플스토리",
			subject : "떴나?"
		},
		{
			post_id : "4",
			board_name : "리그오브레전드",
			subject : "SKT 롤드컵 선발전 결국 탈락 ㅋㅋ"
		},
		{
			post_id : "5",
			board_name : "어몽어스",
			subject : "우좜마 만났다"
		},
		{
			post_id : "6",
			board_name : "메이플스토리",
			subject : "떴나?"
		},
		{
			post_id : "7",
			board_name : "메이플스토리",
			subject : "떴나?"
		},
		{
			post_id : "8",
			board_name : "어몽어스",
			subject : "할사람 TLQK 들어와라"
		},
		{
			post_id : "9",
			board_name : "리그오브레전드",
			subject : "진짜 SK 뭐하냐;"
		},
		{
			post_id : "10",
			board_name : "코딩",
			subject : "아 ㅋㅋ 코딩하기 딱 좋은 날씨네"
		},
		{
			post_id : "11",
			board_name : "코딩",
			subject : "구글 입사 썰 푼다"
		},
		{
			post_id : "12",
			board_name : "메이플스토리",
			subject : "추석 이벤트 정보"
		},
		{
			post_id : "13",
			board_name : "메이플스토리",
			subject : "떴나?"
		},
		{
			post_id : "14",
			board_name : "메이플스토리",
			subject : "떴다 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ"
		},
		{
			post_id : "15",
			board_name : "메이플스토리",
			subject : "원기로이드 나왔다 ㅋㅋ"
		},
		{
			post_id : "16",
			board_name : "메이플스토리",
			subject : "떴나?"
		}
	]
	
	for(pl of post_list){
		// div element 생성하고 board 클래스 추가해준다.
		const post = document.createElement("div");
		post.classList.add("best_post");
		
		// post에 들어갈 내용인 in_post이다. 받아온 post_list에서 게시판 이름과 글 제목을 ${}를 통해 삽입해준다.
		const in_post = `<span class="best_post_board_name">[${pl.board_name}]</span><span class="board_title">${pl.subject}</span>`
		post.innerHTML = in_post;

		// best_board div에 삽입해준다.
		document.querySelector(".best_post_container").appendChild(post);
	}

	
	const post_title = document.querySelectorAll(".post_title");
	
	// 베스트 게시글의 제목을 모두 불러와서 각각 18글자가 넘으면 18글자 이후로 ... 으로 바꿔줌
	for (pt of post_title) {
		if (pt.innerText.length > 18) {
			pt.innerText = pt.innerText.substr(0, 18) + '...';
		}
	}

}

best_post_init();



// ------------------ 베스트 카테고리 ----------------------
function best_category_init() {

	//  베스트 카테고리 불러와서 init
	const slide_list = [
		"메이플스토리",
		"어몽어스",
		"리그오브레전드",
		"로스트 아크",
		"오투잼",
		"던전앤파이터",
		"배틀그라운드",
		"스트리트파이터",
		"카트라이더",
		"카트라이더 러쉬플러스"
	]

	// 백그라운드 랜덤 컬러 리스트
	const background_color_list = [
		"#786fa6",
		"#cf6a87",
		"#f3a683",		
		"#778beb",
		"#ea8685",
		"#596275",
		"#84817a"
	]
	
	const slider = document.querySelector(".slider");

	for (sl of slide_list) {
		// slide라는 div element 생성
		const slide = document.createElement("div");
		slide.classList.add("slide");
		// slide 안에 들어갈 내용을 innerHTML 하여 삽입
		const in_slide = `<img src="../static/img/among_icon.jpg" alt="" class="s_img">
		<div>${sl}</div>`;
		slide.innerHTML = in_slide;

		// 마우스 hovering
		slide.addEventListener("mouseenter",function(){
			const len = background_color_list.length;
			slider.style.background = background_color_list[Math.floor((len) * Math.random())];
			slide.style.opacity = "1";
			slide.style.color = "black"
		})
		slide.addEventListener("mouseleave",function(){
			slider.style.background = "#303030";
			slide.style.opacity = "0.6";
			slide.style.color = "var(--color_ivory)"
		})

		slider.appendChild(slide);
	}


	// ------------------------ slider animation ------------------------- //
	// 베스트 카테고리 아이콘 슬라이더
	let left_btn = document.querySelector(".s_btn_left");
	let right_btn = document.querySelector(".s_btn_right");
	let slides = document.querySelectorAll(".slide");
	let bar = document.querySelector(".bar");
	var index = 0;

	// 좌우 버튼 누르면 긴 slider 자체가 좌우로 이동하는 방식
	left_btn.addEventListener("click", function () {

		index--;
		if (index < 0) {
			index = slides.length - 4;
			bar.style.left = 100 - (100 / 7) + '%';
		}

		const move = index * -24.7;
		slider.style.left = move + "vw";

		const bar_move = index * (100 / 7);
		bar.style.left = bar_move + '%';

	})

	right_btn.addEventListener("click", function () {

		index++;
		if (index > slides.length - 4) {
			index = 0;
			bar.style.left = "0";
		}

		const move = index * -24.7;
		slider.style.left = move + "vw";

		const bar_move = index * (100 / 7);
		bar.style.left = bar_move + '%';

	})

}

best_category_init();


// ----------------------- 대분류 ------------------------
const left_btn2 = document.querySelector(".b_btn_left");
const right_btn2 = document.querySelector(".b_btn_right");
const rooms = document.querySelectorAll(".big_room");

left_btn2.addEventListener("click", function () {

	const current = document.querySelector(".active");
	if (current) {
		current.classList.remove("active");
		if (current.previousElementSibling) {
			current.previousElementSibling.classList.add("active");
		} else {
			rooms[rooms.length - 1].classList.add("active");
		}
	}

	if (document.querySelector(".active").childNodes.length <= 5) rooms_pagination();
	big_room_pagination();
	rooms_grid_change();
})

right_btn2.addEventListener("click", function () {

	const current = document.querySelector(".active");
	if (current) {
		current.classList.remove("active");
		if (current.nextElementSibling) {
			current.nextElementSibling.classList.add("active");
		} else {
			document.querySelector(".big_room").classList.add("active");
		}
	}

	if (document.querySelector(".active").childNodes.length <= 5) rooms_pagination();
	big_room_pagination();
	rooms_grid_change();
})



// ----------------------- 소분류(카테고리) -----------------------
const list_rooms = [
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
	"Item 10"
];

function big_room_pagination() {

	const small_container = document.querySelector('.active .small_room_container');
	const page_container = document.querySelector('.active .small_room_page');

	let current_page = 1;
	let show_cnt = 48;

	function DisplayList(items, container, rows_per_page, page) {
		container.innerHTML = "";
		page--;

		let start = rows_per_page * page;
		let end = start + rows_per_page;
		let paginatedItems = items.slice(start, end);

		for (let i = 0; i < paginatedItems.length; i++) {
			let item = paginatedItems[i];

			let item_element = document.createElement('span');
			item_element.classList.add('small_room');
			item_element.innerText = item;

			container.appendChild(item_element);
		}

		// 좌우 버튼들의 위치를 (세로)중앙에 놓기 위해 active상태인 div의 높이값을 적용시킨다.
		setTimeout(() => {
			const b_btns = document.querySelectorAll(".b_btn");
			for(btn of b_btns) btn.style.height = document.querySelector(".active").scrollHeight;
		}, 50);
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

			let current_btn = document.querySelector('.small_room_page .p_active');
			current_btn.classList.remove('p_active');

			pages.classList.add('p_active');

			// const b_btns = document.querySelectorAll(".b_btn");
			// for(btn of b_btns) btn.style.height = document.querySelector(".active").clientHeight;
		});

		return pages;
	}

	DisplayList(list_rooms, small_container, show_cnt, current_page);
	SetupPagination(list_rooms, page_container, show_cnt);
	
}
big_room_pagination();

// 소분류(small_room)의 갯수에 따른 grid css 변경
function rooms_grid_change() {

	const rooms_cnt = document.querySelectorAll(".active .small_room").length;
	if (rooms_cnt >= 40) {
		document.querySelector(".active .small_room_container").style.gridTemplateColumns = "repeat(auto-fill, minmax(18%, auto))";
	} else if (rooms_cnt >= 30) {
		document.querySelector(".active .small_room_container").style.gridTemplateColumns = "repeat(auto-fill, minmax(23%, auto))";
	} else if (rooms_cnt >= 20) {
		document.querySelector(".active .small_room_container").style.gridTemplateColumns = "repeat(auto-fill, minmax(31%, auto))";
	}

}
rooms_grid_change();


// // 소분류(small_room)의 갯수에 따른 페이지네이션 
// function rooms_pagination(){

//     const rooms_cnt = document.querySelectorAll(".active .small_room").length;
//     const rooms_page = rooms_cnt / 50;
//     const page = document.createElement("div");
//     page.setAttribute("class","small_room_page");

//     for(let i=0; i<rooms_page; i++){
//         const pages = document.createElement("span");
//         pages.setAttribute("class","pages");
//         pages.innerText = i+1;
//         page.appendChild(pages);
//     }

//     document.querySelector(".active").appendChild(page);

// }
// rooms_pagination();
