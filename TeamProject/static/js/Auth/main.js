import * as URL from "./config.js"
import {
    get_userinfo_FetchAPI,
} from '../board/fetch.js'

// --------- 접속 시 실행 ------------
before_login();
get_userinfo_FetchAPI();

// --------------- 로그인 하기 전 상태 before_login ----------------
function before_login() {
    nav_bar_before_login();
    main_before_login();
}
// ---------------- 메인의 로그인 버튼 실행 함수 ----------------
function main_login_btn_func() {

    const main_login_btn = document.querySelector(".main_login_btn");
    const main_login_id = document.querySelector("#main_login_id");
    const main_login_pw = document.querySelector("#main_login_pw");

    attach_login_event(main_login_btn, main_login_id, main_login_pw);
}

//nav바 클릭시 
// ---------- 로그인 완료한 상태 afet_login -------------
export function after_login(res) {
    nav_bar_after_login(res);
    main_after_login(res);
}
