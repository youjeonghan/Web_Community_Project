import * as FETCH from "../board/fetch.js"
import * as AUTH from "../Auth/main.js"
//===========보드 메인 포스트 페이지 ==========

//메인화면 페이지로 가는 함수
// 내파트?..
export function move_mainpage() { //handle_goMain
    document.querySelector('.btn_go_main').addEventListener("click", function () {
        const board_id = location.hash.split('#')[1]; // hash값 받아옴
        location.href = `#${board_id}#postmain`; //메인 화면으로 페이지 이동
    })
}

export function attach_login_event(login_btn, login_id, login_pw) {
    // Login 버튼 클릭시 로그인 API 호출
    login_btn.addEventListener("click", function () {
        FETCH.login_FetchAPI(login_id, login_pw);
    })
    // enter 키 입력 시 로그인 API 호출
    login_pw.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) FETCH.login_FetchAPI(login_id, login_pw);
    })
}
export function attach_signup_event() { //event
    // X 버튼 클릭시 모달 사라짐
    document.querySelector(".signup_exit").addEventListener("click", function () {
        document.querySelector("#signup_container").innerHTML = '';
    })

    // signup 버튼 클릭시 회원가입 api 호출
    document.querySelector("#signup_btn").addEventListener("click", function () {
        AUTH.signup_fetchAPI_call();
    })
    // enter 키 입력 시 로그인 API 호출
    document.querySelector("#signup_birth").addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            if (AUTH.signup_input_check()) FETCH.signup_FetchAPI();
        }
    })
}
export function alert_message(input, pw_check) { //event

    input.focus();
    if (input.id === "signup_name") {
        alert("이름을 입력해주세요.");
        return;
    } else if (input.id === "signup_id") {
        alert("아이디를 입력해주세요.");
        return;
    } else if (input.id === "signup_pw") {
        alert("비밀번호를 입력해주세요.");
        return;
    } else if (input.id === "signup_pw2") {
        if (pw_check == false) {
            alert("비밀번호 확인란을 확인해주세요.")
            return;
        }
        alert("비밀번호 확인란을 입력해주세요.");
        return;
    } else if (input.id === "signup_nickname") {
        alert("닉네임을 입력해주세요.");
        return;
    } else if (input.id === "signup_email") {
        alert("이메일을 입력해주세요.");
        return;
    } else if (input.id === "signup_birth") {
        alert("생년월일을 입력해주세요.");
        return;
    }
}
// // ---------------------- Signup 입력값 판별 함수 -------------------
// function signup_input_check(name, id, pw, pw2, email, nick, birth) {

//     if (name.value == "") {
//         alert("이름을 입력해주세요.");
//         name.focus();
//         return false;
//     } else if (id.value == "") {
//         alert("아이디를 입력해주세요.");
//         id.focus();
//         return false;
//     } else if (pw.value == "") {
//         alert("비밀번호를 입력해주세요.");
//         pw.focus();
//         return false;
//     } else if (pw2.value == "") {
//         alert("비밀번호 확인란을 입력해주세요.");
//         pw2.focus();
//         return false;
//     } else if (pw.value != pw2.value) {
//         alert("비밀번호 확인란을 확인해주세요.")
//         pw2.focus();
//         return false;
//     } else if (nick.value == "") {
//         alert("닉네임을 입력해주세요.");
//         nick.focus();
//         return false;
//     } else if (email.value == "") {
//         alert("이메일을 입력해주세요.");
//         email.focus();
//         return false;
//     } else if (birth.value == "") {
//         alert("생년월일을 입력해주세요.");
//         birth.focus();
//         return false;
//     }
//     // 조건 다 통과하면 true 반환
//     return true;
// }
// 뭐가 더 나은지 생각 