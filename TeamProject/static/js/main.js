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
    if(bt.innerText.length > 20){
        bt.innerText = bt.innerText.substr(0, 20) + '...';
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

// --------------------- 로그인 Fetch Api-----------------------

const main_login = document.querySelector(".main_login");

main_login.addEventListener("click",function(){
    document.querySelector(".login_modal_back").style.display="block";
})

document.querySelector(".login_exit").addEventListener("click",function(){
    document.querySelector(".login_modal_back").style.display="none";
})


// function login_FetchAPI() {
    
//     let id = document.querySelector("#login_id_input").value;
//     let pw = document.querySelector("#login_pw_input").value;

//     let send_data ={
//         'id' : id,
//         'pw' : pw
//     };

//     fetch('/auth/login', {
//         method : "POST",
//         headers : {
//             'Content-Type': "application/json"
//         },
//         body : JSON.stringify(send_data)
//     })
//     .then(res => res.json())
//     .then((res) => {
//         if(res['STATUS']=="SUCCESS"){        
//             sessionStorage.setItem('access_token', "Bearer "+res['access_token']);
//             window.location.href="/";
//         }
//         else if(res['STATUS'] == "INCORRECT ID"){
//             alert("존재하지 않는 ID입니다.");
//         }
//         else if(res['STATUS'] == "INCORRECT PW"){
//             alert("비밀번호를 확인해주세요.");
//         }
//     })
// }

// ------------------------------ 회원가입 Fetch Api ------------------------------------
// function signup_FetchAPI_v1(){
    
//     let id = document.querySelector("#signup_id").value;
//     let pw = document.querySelector("#signup_pw").value;
//     let pw2 = document.querySelector("#signup_pw2").value;
//     let email = document.querySelector("#signup_email").value;
//     let name = document.querySelector("#signup_name").value;
//     var nick = document.querySelector("#signup_nickname").value;
//     var birth = document.querySelector("#signup_birth").value;
//     var gender = $("input[type=radio][name=gender]:checked").val();
    
//     var file;
//     if (document.querySelector(".modal_image").files.length == 0) file = '';
//     else file = document.querySelector(".modal_image").files[0];
    
//     var send_data = new FormData();
    
//     send_data.append('id', id);
//     send_data.append('pw', pw);
//     send_data.append('pw2', pw2);
//     send_data.append('email', email);
//     send_data.append('name', name);
//     send_data.append('nick', nick);
//     send_data.append('birth', birth);
//     send_data.append('gender', gender);
//     send_data.append('file', file);
    
//     fetch("/auth/sign_up",{
//         method:"POST",
//         headers:{},
//         body : send_data
//     })
//     .then(res => res.json())
//     .then(res => {
//         if(res['STATUS'] == "SUCCESS"){
//             alert("회원가입 완료! 환영합니다. "+ name + "님!");
//         }
//         else if(res['STATUS'] == "ID EXIST"){
//             alert("이미 존재하는 ID입니다.");
//         }
//         else if(res['STATUS'] == "Wrong ID"){
//             alert("사용할 수 없는 ID입니다.");
//         }
//         else if(res['STATUS'] == "BLANK ID"){
//             alert("사용할 수 없는 ID입니다.");
//         }
//         else if(res['STATUS'] == "NICK EXIST"){
//             alert("이미 존재하는 닉네임입니다.");
//         }
//         else if(res['STATUS'] == "Wrong EMAIL or NOT EMAIL FORMAT"){
//             alert("사용할 수 없는 EMAIL입니다.");
//         }
//         else if(res['STATUS'] == "PW MATCH FAIL"){
//             alert("패스워드가 일치하지 않습니다.");
//         }
//         else if(res['STATUS'] == "EMAIL EXIST"){
//             alert("이미 존재하는 EMAIL입니다.");
//         }
//         else if(res['STATUS'] == "Wrong NAME"){
//             alert("사용할 수 없는 NAME입니다.");
//         }
//         else if(res['STATUS'] == "INSERT ID"){
//             alert("ID를 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT PW"){
//             alert("PW를 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT EMAIL"){
//             alert("EMAIL을 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT NAME"){
//             alert("NAME을 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT NICK"){
//             alert("NICKNAME을 입력하세요.");
//         }
//         else if(res['STATUS'] == "INSERT ID"){
//             alert("ID를 입력하세요.");
//         }
//         else if(res['STATUS'] == "LONG ID"){
//             alert("ID를 확인하세요.");
//         }
//         else if(res['STATUS'] == "SHORT ID"){
//             alert("ID를 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG PW"){
//             alert("PW를 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG EMAIL"){
//             alert("EMAIL을 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG NAME"){
//             alert("NAME을 확인하세요.");
//         }
//         else if(res['STATUS'] == "LONG NICK"){
//             alert("NICKNAME을 확인하세요.");
//         }
//         else if(res['STATUS'] == "fail"){
//             alert("알 수 없는 오류가 발생하였습니다. 다시 시도 해주세요.");
//         }
//     })
//     .catch(err => console.log(err))
// }


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