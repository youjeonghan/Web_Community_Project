import * as FETCH_AUTH from "./fetch.js"
import * as REND_AUTH from "./render.js"
import * as AUTH from "./main.js"
//===========보드 메인 포스트 페이지 ==========

//메인화면 페이지로 가는 함수

export function move_mainpage() { //handle_goMain
    document.querySelector('.btn_go_main').addEventListener("click", function () {
        const board_id = location.hash.split('#')[1]; // hash값 받아옴
        location.href = `#${board_id}#postmain`; //메인 화면으로 페이지 이동
    })
}

export function attach_login_event(login_btn, login_id, login_pw) {
    // Login 버튼 클릭시 로그인 API 호출
    login_btn.addEventListener("click", function () {
        FETCH_AUTH.send_data_enterd_at_login(login_id, login_pw);
    })
    // enter 키 입력 시 로그인 API 호출
    login_pw.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) FETCH_AUTH.send_data_enterd_at_login(login_id, login_pw);
    })
}
export function attach_signup_event() { //event
    // signup 버튼 클릭시 회원가입 api 호출
    document.querySelector("#signup_btn").addEventListener("click", function () {
        FETCH_AUTH.get_membership_information();
    })
    // enter 키 입력 시 회원가입 API 호출
    document.querySelector("#signup_birth").addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            FETCH_AUTH.get_membership_information();
        }
    })
    // X 버튼 클릭시 모달 사라짐
    document.querySelector(".signup_exit").addEventListener("click", function () {
        document.querySelector("#signup_container").innerHTML = '';
    })
}
// ---------------- 네비게이션의 로그인, 회원가입 버튼 실행 함수 -----------------
export function attach_nav_login_btn_event() {

    document.querySelector("#nav_login").addEventListener("click", () => {
        REND_AUTH.creat_login_modal_when_nav_login_btn_click();
        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".login_exit").addEventListener("click", function () {
            document.querySelector("#login_container").innerHTML = '';
        })

        const nav_login_btn = document.querySelector("#login_btn");
        const nav_login_id = document.querySelector("#nav_login_id");
        const nav_login_pw = document.querySelector("#nav_login_pw");

        attach_login_event(nav_login_btn, nav_login_id, nav_login_pw);
    })
}
export function attach_nav_signup_btn_event() {
    document.querySelector("#nav_signup").addEventListener("click", function () {
        REND_AUTH.creat_signup_modal_when_nav_signup_btn_click();
        attach_signup_event();
    })
}
export function attach_logout_btn_event(logout){
    logout.addEventListener("click", function () {
        sessionStorage.removeItem("access_token");
        AUTH.mainpage_before_login();
        location.href = "/";
    })
}
export function attach_manager_page_btn_event(manager_page){
    manager_page.addEventListener("click", () => {
        location.href = 'manager';
    })
}
export function attach_mypage_btn_event(mypage){
    mypage.addEventListener("click", () => {
        location.href = 'mypage';
    })
}