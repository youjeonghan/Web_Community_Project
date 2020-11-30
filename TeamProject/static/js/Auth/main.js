import * as EVENT_AUTH from "../Auth/event.js"
import * as RENDER_AUTH from "../Auth/render.js"
import * as FETCH from "../board/fetch.js"

// --------- 접속 시 실행 ------------
mainpage_before_login();
FETCH.get_userinfo_FetchAPI();

// --------------- 로그인 하기 전 상태 before_login ----------------
export function mainpage_before_login() {
    RENDER_AUTH.nav_bar_before_login();
    RENDER_AUTH.main_before_login();
}
// ---------------- 메인의 로그인 버튼 실행 함수 ----------------
export function main_login_btn_func() {

    const main_login_btn = document.querySelector(".main_login_btn");
    const main_login_id = document.querySelector("#main_login_id");
    const main_login_pw = document.querySelector("#main_login_pw");

    EVENT_AUTH.attach_login_event(main_login_btn, main_login_id, main_login_pw);
}
// ------------ 네비게이션의 로그인 버튼 실행 함수 ---------------
export function nav_login_btn_func() {

    document.querySelector("#nav_login").addEventListener("click", () => {
        // 로그인 모달을 만들어준다.
        // const login_container = document.querySelector("#login_container");
        document.querySelector("#login_container").innerHTML = RENDER_AUTH.login_modal;

        // 로그인 모달 주요 style 변경
        setTimeout(() => {
            document.querySelector(".login_modal").style.opacity = "1";
            document.querySelector(".login_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".login_exit").addEventListener("click", function () {
            document.querySelector("#login_container").innerHTML = '';
        })

        const nav_login_btn = document.querySelector("#login_btn");
        const nav_login_id = document.querySelector("#nav_login_id");
        const nav_login_pw = document.querySelector("#nav_login_pw");

        EVENT_AUTH.attach_login_event(nav_login_btn, nav_login_id, nav_login_pw);
    })
}

//nav바 클릭시 
// ---------- 로그인 완료한 상태 afet_login -------------
export function mainpage_after_login(res) {
    RENDER_AUTH.nav_bar_after_login(res);
    RENDER_AUTH.main_after_login(res);
}
// 이벤트  부착, 스타일 로딩 부분 분리
export function signup_fetchAPI_call() { // main 옮기기
    var profile = new Array();
    
    profile[0] = document.querySelector("#signup_name");
    profile[1] = document.querySelector("#signup_id");
    profile[2] = document.querySelector("#signup_pw");
    profile[3] = document.querySelector("#signup_pw2");
    profile[4] = document.querySelector("#signup_nickname");
    profile[5] = document.querySelector("#signup_email");
    profile[6] = document.querySelector("#signup_birth");


    if (signup_input_check(profile)) FETCH.signup_FetchAPI(profile);
}
export function signup_input_check(profile) {
    for (var i = 0; i < 7; i++) {
        if (!profile[i].value) {
            EVENT_AUTH.alert_message(profile[i]);
            return false;
        }else if(i===3 && profile[i-1].value !==profile[i].value){
            EVENT_AUTH.alert_message(profile[i],false);
            return false;
        }
    }
    return true;
}