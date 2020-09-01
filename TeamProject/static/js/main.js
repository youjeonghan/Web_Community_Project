// --------------------------- slider animation --------------------------- //
// 베스트 룸 아이콘 슬라이더

let left_btn = document.querySelector(".s_btn_left");
let right_btn = document.querySelector(".s_btn_right");
let slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slide");
let bar = document.querySelector(".bar");
var index = 0;


// 왼쪽 버튼 누르면 slider 자체가 왼쪽으로 이동하는 형식
left_btn.addEventListener("click", function () { 

    index--;
    if(index<0){
        index=slides.length-4;
        bar.style.left = 100-(100/7) + '%';
    }
    
    const move = index*-24.7;
    slider.style.left= move + "vw";

    const bar_move = index*(100/7);
    bar.style.left= bar_move + '%';

})

right_btn.addEventListener("click", function () {

    index++;
    if(index>slides.length-4){
        index=0;
        bar.style.left = "0";
    }

    const move = index*-24.7;
    slider.style.left= move + "vw";

    const bar_move = index*(100/7);
    bar.style.left= bar_move + '%';

})

// ----------------- 베스트 게시글 -----------------

const board_title = document.querySelectorAll(".board_title");

// 베스트 게시글의 제목을 모두 불러와서 각각 18글자가 넘으면 18글자 이후로 ... 으로 바꿔줌
for(bt of board_title){
    if(bt.innerText.length > 18){
        bt.innerText = bt.innerText.substr(0, 18) + '...';
    }
}


// -------------------- 대분류 -------------------

const left_btn2 = document.querySelector(".b_btn_left");
const right_btn2 = document.querySelector(".b_btn_right");
const rooms = document.querySelectorAll(".big_room");

left_btn2.addEventListener("click", function () {

    const current = document.querySelector(".active");
    if(current){
        current.classList.remove("active");
        if(current.previousElementSibling){
            current.previousElementSibling.classList.add("active");
        }
        else{
            rooms[rooms.length-1].classList.add("active");
        }
    }
    
	if(document.querySelector(".active").childNodes.length<=5) rooms_pagination();
	big_room_pagination();
	rooms_grid_change();

})

right_btn2.addEventListener("click", function () { 
    
    const current = document.querySelector(".active");
    if(current){
        current.classList.remove("active");
        if(current.nextElementSibling){
            current.nextElementSibling.classList.add("active");
        }
        else{
            document.querySelector(".big_room").classList.add("active");
        }
    }

     
    if(document.querySelector(".active").childNodes.length<=5) rooms_pagination();
	big_room_pagination();
	rooms_grid_change();

})



// ----------------------- 소분류(small_room) 페이지 네이션 -----------------------

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

function big_room_pagination(){

	const small_container = document.querySelector('.active .small_room_container');
	const page_container = document.querySelector('.active .small_room_page');
	
	let current_page = 1;
	let show_cnt = 50;
	
	function DisplayList (items, container, rows_per_page, page) {
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
	}
	
	function SetupPagination (items, container, rows_per_page) {
		container.innerHTML = "";
	
		let page_count = Math.ceil(items.length / rows_per_page);
		for (let i = 1; i < page_count + 1; i++) {
			let btn = PaginationButton(i, items);
			container.appendChild(btn);
		}
	}
	
	function PaginationButton (i, items) {
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
    console.log(rooms_cnt);
    if (rooms_cnt > 40) {
        document.querySelector(".active .small_room_container").style.gridTemplateColumns = "repeat(auto-fill, minmax(18%, auto))";
    } else if (rooms_cnt > 30) {
        document.querySelector(".active .small_room_container").style.gridTemplateColumns = "repeat(auto-fill, minmax(23%, auto))";
    } else if (rooms_cnt > 20) {
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


// ------------------------- 유저 정보 불러오기 Api -------------------------
// function get_userinfo_FetchAPI() {
//     if (sessionStorage.length == 0) return;
//     else if (sessionStorage.length == 1)
//         if (sessionStorage.getItem("access_token") == 0) return;

//     const token = sessionStorage.getItem('access_token');

//     fetch('/auth/get_userinfo', {
//             method: "GET",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': token,
//             }
//         })
//         .then(res => res.json())
//         .then((res) => {
//             if (res['result'] == "success") {
//                 let user_name = res['user_name'];
//                 let user_photo = res['user_photo'];
//                 document.querySelector(".before_login").style.display = "none";
//                 document.querySelector(".success_login").style.display = "block";
//                 document.querySelector("#user_image").src = "../static/files/" + user_photo;
//                 document.querySelector("#user_info").innerHTML = user_name + "님";
//             }
//         })
// }