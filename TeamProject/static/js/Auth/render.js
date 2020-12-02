import * as LINK from "../config.js"
import * as EVENT_AUTH from "./event.js"
import * as AUTH from "./main.js"
import * as FETCH_AUTH from "./fetch.js"

// -------- 로그인 창 모달 ------------
export const login_modal = `
<div class="login_modal_back">
    <div class="login_modal">
        <div class="login_exit">X</div>
        <div class="login_title">
        로그인
        </div>
        <div>
            <input type="text" id="nav_login_id" name="id" class="login_input" placeholder="아이디 입력"
                autocomplete="off">
        </div>
        <div>
            <input type="password" id="nav_login_pw" name="pw" class="login_input" placeholder="비밀번호 입력"
                autocomplete="off">
        </div>
        <div><button id="login_btn" class="login_btn">LOGIN</button></div>
    </div>
</div>`;

// -------- 회원가입 창 모달 ------------
export const signup_modal = `<div class="signup_modal_back">
<div class="signup_modal">
    <div class="signup_exit">X</div>
    <div class="signup_title">
        회원 가입
    </div>

    <div>
        <span class="signup_sub">* 이름</span>
        <input type="text" id="signup_name" name="name" class="signup_input" placeholder="이름"
            autocomplete="off" required maxlength="20">
    </div>
    <div>
        <span class="signup_sub">* 아이디</span>
        <input type="text" id="signup_id" name="id" class="signup_input" placeholder="아이디"
            autocomplete="off" required maxlength="20">
    </div>
    <div>
        <span class="signup_sub">* 비밀번호 (6~12)</span>
        <input type="password" id="signup_pw" name="pw" class="signup_input" placeholder="6 ~ 12자 / 특수문자 포함"
            autocomplete="off" required maxlength="12">
    </div>
    <div>
        <span class="signup_sub">* 비밀번호 확인</span>
        <input type="password" id="signup_pw2" name="pw" class="signup_input" placeholder="비밀번호 확인"
            autocomplete="off" required maxlength="12">
    </div>
    <div>
        <span class="signup_sub">* 닉네임 (~12)</span>
        <input type="text" id="signup_nickname" name="nickname" class="signup_input" placeholder="닉네임"
            autocomplete="off" required maxlength="12">
    </div>
    <div>
        <span class="signup_sub">* 이메일</span>
        <input type="email" id="signup_email" name="email" class="signup_input" placeholder="aaa@aaa.aaa"
            autocomplete="off" required maxlength="30">
    </div>
    <div>
        <span class="signup_sub">* 생년월일</span>
        <input type="date" id="signup_birth" name="birth" class="signup_input" placeholder="YYYY-MM-DD"
        autocomplete="off" required min="1900-01-01" required>
    </div>
    <div>
        <span class="signup_sub">프로필 사진</span>
        <input type="file" id="signup_image" class="signup_input" accept="image/*">
    </div>
    <div><button id="signup_btn" class="signup_btn">SIGN UP</button></div>

</div>
</div>`;
//--------------- 로그인하기 전 메인 , nav 바 -------------------
export function main_before_login() {
    if ((window.location.href == LINK.MAIN_API) || (window.location.href == LINK.MAIN_SUBTITLE)) {
        document.querySelector(".sub_container").innerHTML = `<div>
        <input type="text" id="main_login_id" name="id" class="main_login_input" placeholder="아이디 입력"
        autocomplete="off">
        </div>
        <div>
        <input type="password" id="main_login_pw" name="pw" class="main_login_input" placeholder="비밀번호 입력"
        autocomplete="off">
        </div>
        <button id="main_login_btn" class="main_login_btn">로그인</button>`;
        FETCH_AUTH.main_login_btn_func(); // 메인로그인함수 호출
    }
}
export function nav_bar_before_login() {

    document.querySelector(".nav_auth").innerHTML = `<span id="nav_login" class="nav_login">로그인</span>
    <span id="nav_signup" class="nav_signup">회원가입</span>`;
    EVENT_AUTH.attach_nav_login_btn_event();
    EVENT_AUTH.attach_nav_signup_btn_event();
}

//--------------- 로그인전 로그인, 회원가입 버튼 클릭 시 모달 생성------------------
export function creat_signup_modal_when_nav_signup_btn_click() {
    document.querySelector("#signup_container").innerHTML = signup_modal;
    // 회원가입 모달 주요 style 변경
    setTimeout(() => {
        document.querySelector(".signup_modal").style.opacity = "1";
        document.querySelector(".signup_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
    }, 50);
}
export function creat_login_modal_when_nav_login_btn_click() {
    // 로그인 모달을 만들어준다.
    document.querySelector("#login_container").innerHTML = login_modal;
    // 로그인 모달 주요 style 변경
    setTimeout(() => {
        document.querySelector(".login_modal").style.opacity = "1";
        document.querySelector(".login_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
    }, 50);
}

//------------- 로그인 후 메인, nav바 , nav바 버튼 생성-----------------
export function main_after_login(res) {
    if ((window.location.href == LINK.MAIN_API) || (window.location.href == LINK.MAIN_SUBTITLE)) {

        document.querySelector(".sub_container").innerHTML = `<div class="main_auth_div"><span class="main_user_info">
        <img src="../static/img/profile_img/${res['profile_img']}" class="main_user_image"> ${res['nickname']} 님 환영합니다. </span></div>`;
    }
}
export function nav_bar_after_login(res) {
    const auth_container = document.querySelector(".nav_auth");

    while (auth_container.hasChildNodes()) {
        auth_container.removeChild(auth_container.firstChild);
    }
    auth_container.appendChild(user_profile(res));
    auth_container.appendChild(logout_btn_func());

    // 만약 로그인한 유저의 닉네임이 GM이면 관리자 이므로, 마이페이지 대신 관리자페이지를 넣어준다.
    if (res['nickname'] === "GM") {
        auth_container.appendChild(manager_page_btn_func());
    } else {
        auth_container.appendChild(mypage_btn_func());
    }
}
export function user_profile(res) {
    const user = document.createElement("span");
    user.classList.add("nav_user_info");
    user.innerHTML = `<img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_img"> ` + res['nickname'];
    return user;
}
export function logout_btn_func() {
    const logout = document.createElement("span");
    logout.innerHTML = "로그아웃"
    logout.classList.add("nav_logout");
    EVENT_AUTH.attach_logout_btn_event(logout);
    return logout;
}
export function manager_page_btn_func() {
    const manager_page = document.createElement("span");
    manager_page.innerHTML = "관리자페이지";
    manager_page.classList.add("nav_manager_page");
    EVENT_AUTH.attach_manager_page_btn_event(manager_page);
    return manager_page;
}
export function mypage_btn_func() {
    const mypage = document.createElement("span");
    mypage.innerHTML = "마이페이지";
    mypage.classList.add("nav_mypage");
    EVENT_AUTH.attach_mypage_btn_event(mypage);
    return mypage;
}
//버튼생성이랑 이벤트생성 분리