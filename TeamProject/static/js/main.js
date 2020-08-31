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

// ------------- 베스트 게시글 ---------------

const board_title = document.querySelectorAll(".board_title");

for(bt of board_title){
    if(bt.innerText.length > 18){
        bt.innerText = bt.innerText.substr(0, 18) + '...';
    }
}


// ------------------- 대분류 -------------------

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

})



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