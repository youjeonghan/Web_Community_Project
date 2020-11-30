// import * as URL from "./config.js"
// import * as EVENT_AUTH from "./Auth/event.js"
// import {
//     signup_FetchAPI,
//     get_userinfo_FetchAPI,
//     login_FetchAPI
// } from './board/fetch.js'

// // --------- 접속 시 실행 ------------
// mainpage_before_login();
// get_userinfo_FetchAPI();

// // -------- 로그인 창 모달 ------------
// const login_modal = `
// <div class="login_modal_back">
//     <div class="login_modal">
//         <div class="login_exit">X</div>
//         <div class="login_title">
//         로그인
//         </div>
//         <div>
//             <input type="text" id="nav_login_id" name="id" class="login_input" placeholder="아이디 입력"
//                 autocomplete="off">
//         </div>
//         <div>
//             <input type="password" id="nav_login_pw" name="pw" class="login_input" placeholder="비밀번호 입력"
//                 autocomplete="off">
//         </div>
//         <div><button id="login_btn" class="login_btn">LOGIN</button></div>
//     </div>
// </div>`;

// // -------- 회원가입 창 모달 ------------
// const signup_modal = `<div class="signup_modal_back">
// <div class="signup_modal">
//     <div class="signup_exit">X</div>
//     <div class="signup_title">
//         회원 가입
//     </div>

//     <div>
//         <span class="signup_sub">* 이름</span>
//         <input type="text" id="signup_name" name="name" class="signup_input" placeholder="이름"
//             autocomplete="off" required maxlength="20">
//     </div>
//     <div>
//         <span class="signup_sub">* 아이디</span>
//         <input type="text" id="signup_id" name="id" class="signup_input" placeholder="아이디"
//             autocomplete="off" required maxlength="20">
//     </div>
//     <div>
//         <span class="signup_sub">* 비밀번호 (6~12)</span>
//         <input type="password" id="signup_pw" name="pw" class="signup_input" placeholder="6 ~ 12자 / 특수문자 포함"
//             autocomplete="off" required maxlength="12">
//     </div>
//     <div>
//         <span class="signup_sub">* 비밀번호 확인</span>
//         <input type="password" id="signup_pw2" name="pw" class="signup_input" placeholder="비밀번호 확인"
//             autocomplete="off" required maxlength="12">
//     </div>
//     <div>
//         <span class="signup_sub">* 닉네임 (~12)</span>
//         <input type="text" id="signup_nickname" name="nickname" class="signup_input" placeholder="닉네임"
//             autocomplete="off" required maxlength="12">
//     </div>
//     <div>
//         <span class="signup_sub">* 이메일</span>
//         <input type="email" id="signup_email" name="email" class="signup_input" placeholder="aaa@aaa.aaa"
//             autocomplete="off" required maxlength="30">
//     </div>
//     <div>
//         <span class="signup_sub">* 생년월일</span>
//         <input type="date" id="signup_birth" name="birth" class="signup_input" placeholder="YYYY-MM-DD"
//         autocomplete="off" required min="1900-01-01" required>
//     </div>
//     <div>
//         <span class="signup_sub">프로필 사진</span>
//         <input type="file" id="signup_image" class="signup_input" accept="image/*">
//     </div>
//     <div><button id="signup_btn" class="signup_btn">SIGN UP</button></div>

// </div>
// </div>`;

// // --------------- 로그인 하기 전 상태 before_login ----------------
// function mainpage_before_login() { // Auth > main
//     nav_bar_before_login();
//     main_before_login();
// }

// function nav_bar_before_login() { //Auth > render?
//     const auth_container = document.querySelector(".nav_auth");
//     auth_container.innerHTML = `<span id="nav_login" class="nav_login">로그인</span>
//     <span id="nav_signup" class="nav_signup">회원가입</span>`;
//     nav_login_btn_func();
//     nav_signup_btn_func();
// }

// function main_before_login() { // Auth > render ?
//     if ((window.location.href == URL.MAIN_API) || (window.location.href == URL.MAIN_SUBTITLE)) {
//         const main_auth_container = document.querySelector(".sub_container");
//         main_auth_container.innerHTML = `<div>
//         <input type="text" id="main_login_id" name="id" class="main_login_input" placeholder="아이디 입력"
//         autocomplete="off">
//         </div>
//         <div>
//         <input type="password" id="main_login_pw" name="pw" class="main_login_input" placeholder="비밀번호 입력"
//         autocomplete="off">
//         </div>
//         <button id="main_login_btn" class="main_login_btn">로그인</button>`;
//         main_login_btn_func(); // 메인로그인함수 호출
//     }
// }
// // ---------------- 메인의 로그인 버튼 실행 함수 ----------------
// function main_login_btn_func() { // main?

//     const main_login_btn = document.querySelector(".main_login_btn");
//     const main_login_id = document.querySelector("#main_login_id");
//     const main_login_pw = document.querySelector("#main_login_pw");

//     EVENT_AUTH.attach_login_event(main_login_btn, main_login_id, main_login_pw);
// } // 없애고 이벤트함수로?

// // ------------ 네비게이션의 로그인 버튼 실행 함수 ---------------
// function nav_login_btn_func() { // main?

//     document.querySelector("#nav_login").addEventListener("click", () => {
//         // 로그인 모달을 만들어준다.
//         document.querySelector("#login_container").innerHTML = login_modal;

//         // 로그인 모달 주요 style 변경
//         setTimeout(() => {
//             document.querySelector(".login_modal").style.opacity = "1";
//             document.querySelector(".login_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
//         }, 50);

//         // X 버튼 클릭시 모달 사라짐
//         document.querySelector(".login_exit").addEventListener("click", function () {
//             document.querySelector("#login_container").innerHTML = '';
//         })

//         const nav_login_btn = document.querySelector("#login_btn");
//         const nav_login_id = document.querySelector("#nav_login_id");
//         const nav_login_pw = document.querySelector("#nav_login_pw");

//         EVENT_AUTH.attach_login_event(nav_login_btn, nav_login_id, nav_login_pw);
//     })
// }
// // 리팩할거 고민해보기

// //nav바 클릭시 
// // ---------- 로그인 완료한 상태 afet_login -------------
// export function mainpage_after_login(res) { // main
//     nav_bar_after_login(res);
//     main_after_login(res);
// }

// function nav_bar_after_login(res) {
//     const auth_container = document.querySelector(".nav_auth");

//     while (auth_container.hasChildNodes()) {
//         auth_container.removeChild(auth_container.firstChild);
//     }
//     auth_container.appendChild(user_profile(res));
//     auth_container.appendChild(logout_btn_func());

//     // 만약 로그인한 유저의 닉네임이 GM이면 관리자 이므로, 마이페이지 대신 관리자페이지를 넣어준다.
//     if (res['nickname'] === "GM") {
//         auth_container.appendChild(manager_page_btn());
//     } else {
//         auth_container.appendChild(mypage_btn());
//     }
// }

// function main_after_login(res) { // 함수명 변경
//     if ((window.location.href == URL.MAIN_API) || (window.location.href == URL.MAIN_SUBTITLE)) {
//         const main_auth_container = document.querySelector(".sub_container");
//         main_auth_container.innerHTML = `<div class="main_auth_div"><span class="main_user_info">
//         <img src="../static/img/profile_img/${res['profile_img']}" class="main_user_image"> ${res['nickname']} 님 환영합니다. </span></div>`;
//     }
// }

// function user_profile(res) {
//     const user = document.createElement("span");
//     user.classList.add("nav_user_info");
//     user.innerHTML = `<img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_img"> ` + res['nickname'];
//     return user;
// }

// function logout_btn_func() {
//     const logout = document.createElement("span");
//     logout.innerHTML = "로그아웃"
//     logout.classList.add("nav_logout");
//     logout.addEventListener("click", function () {
//         sessionStorage.removeItem("access_token");
//         mainpage_before_login();
//         location.href = "/";
//     })
//     return logout;
// }

// function manager_page_btn() {
//     const manager_page = document.createElement("span");
//     manager_page.innerHTML = "관리자페이지";
//     manager_page.classList.add("nav_manager_page");
//     manager_page.addEventListener("click", () => {
//         location.href = 'manager';
//     })
//     return manager_page;
// }

// function mypage_btn() {
//     const mypage = document.createElement("span");
//     mypage.innerHTML = "마이페이지";
//     mypage.classList.add("nav_mypage");
//     mypage.addEventListener("click", () => {
//         location.href = 'mypage';
//     })
//     return mypage;
// }
// //nav바 버튼 생성 메서드 추출, 중복제거 방법 생각해보기.... 모두 Auth > render

// // ---------------- 네비게이션의 회원가입 버튼 실행 함수 -----------------
// function nav_signup_btn_func() { //render
    
//     document.querySelector("#nav_signup").addEventListener("click", function () {
//         // 회원가입 모달을 만들어줌
//         // const signup_container = document.querySelector("#signup_container");
//         // signup_container.innerHTML = signup_modal;

//         document.querySelector("#signup_container").innerHTML = signup_modal;

//         // 회원가입 모달 주요 style 변경
//         setTimeout(() => {
//             document.querySelector(".signup_modal").style.opacity = "1";
//             document.querySelector(".signup_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
//         }, 50);

//         attach_signup_event(); //인자말고 객체화 가능한가 찾아보기
//     })
// } // 부착으로 login 시 이벤트부착이랑 중복제거 해야함
// export function attach_signup_event() { //event
//     // X 버튼 클릭시 모달 사라짐
//     document.querySelector(".signup_exit").addEventListener("click", function () {
//         document.querySelector("#signup_container").innerHTML = '';
//     })

//     // signup 버튼 클릭시 회원가입 api 호출
//     document.querySelector("#signup_btn").addEventListener("click", function () {
//         signup_fetchAPI_call();
//     })
//     // enter 키 입력 시 로그인 API 호출
//     document.querySelector("#signup_birth").addEventListener("keyup", (e) => {
//         if (e.keyCode === 13) {
//             if (signup_input_check()) signup_FetchAPI();
//         }
//     })
// }
// // 로그인, 회원가입 클래스화 가능한지 리팩고민

// // 이벤트  부착, 스타일 로딩 부분 분리
// function signup_fetchAPI_call() { //main , 함수명 바꾸기
//     var profile = new Array();

//     profile[0] = document.querySelector("#signup_name");
//     profile[1] = document.querySelector("#signup_id");
//     profile[2] = document.querySelector("#signup_pw");
//     profile[3] = document.querySelector("#signup_pw2");
//     profile[4] = document.querySelector("#signup_nickname");
//     profile[5] = document.querySelector("#signup_email");
//     profile[6] = document.querySelector("#signup_birth");

//     if (signup_input_check(profile)) signup_FetchAPI(profile);
// }

// function signup_input_check(profile) { //main
//     for (var i = 0; i < 7; i++) {
//         if (!profile[i].value) {
//             alert_message(profile[i]);
//             return false;
//         } else if (i === 3 && profile[i - 1].value !== profile[i].value) {
//             alert_message(profile[i], false);
//             return false;
//         }
//     }
//     return true;
// }

// function alert_message(input, pw_check) { //event

//     input.focus();
//     if (input.id === "signup_name") {
//         alert("이름을 입력해주세요.");
//         return;
//     } else if (input.id === "signup_id") {
//         alert("아이디를 입력해주세요.");
//         return;
//     } else if (input.id === "signup_pw") {
//         alert("비밀번호를 입력해주세요.");
//         return;
//     } else if (input.id === "signup_pw2") {
//         if (pw_check == false) {
//             alert("비밀번호 확인란을 확인해주세요.")
//             return;
//         }
//         alert("비밀번호 확인란을 입력해주세요.");
//         return;
//     } else if (input.id === "signup_nickname") {
//         alert("닉네임을 입력해주세요.");
//         return;
//     } else if (input.id === "signup_email") {
//         alert("이메일을 입력해주세요.");
//         return;
//     } else if (input.id === "signup_birth") {
//         alert("생년월일을 입력해주세요.");
//         return;
//     }
// }
// // // ---------------------- Signup 입력값 판별 함수 -------------------
// // function signup_input_check(name, id, pw, pw2, email, nick, birth) {

// //     if (name.value == "") {
// //         alert("이름을 입력해주세요.");
// //         name.focus();
// //         return false;
// //     } else if (id.value == "") {
// //         alert("아이디를 입력해주세요.");
// //         id.focus();
// //         return false;
// //     } else if (pw.value == "") {
// //         alert("비밀번호를 입력해주세요.");
// //         pw.focus();
// //         return false;
// //     } else if (pw2.value == "") {
// //         alert("비밀번호 확인란을 입력해주세요.");
// //         pw2.focus();
// //         return false;
// //     } else if (pw.value != pw2.value) {
// //         alert("비밀번호 확인란을 확인해주세요.")
// //         pw2.focus();
// //         return false;
// //     } else if (nick.value == "") {
// //         alert("닉네임을 입력해주세요.");
// //         nick.focus();
// //         return false;
// //     } else if (email.value == "") {
// //         alert("이메일을 입력해주세요.");
// //         email.focus();
// //         return false;
// //     } else if (birth.value == "") {
// //         alert("생년월일을 입력해주세요.");
// //         birth.focus();
// //         return false;
// //     }
// //     // 조건 다 통과하면 true 반환
// //     return true;
// // }
// // 뭐가 더 나은지 생각 