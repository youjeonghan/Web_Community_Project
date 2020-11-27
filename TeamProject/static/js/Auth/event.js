import {
    signup_FetchAPI,
    get_userinfo_FetchAPI,
    login_FetchAPI
} from '../board/fetch.js'
//===========보드 메인 포스트 페이지 ==========

//메인화면 페이지로 가는 함수
// 내파트?..
export function handle_goMain() {
    const goMainBtn = document.querySelector('.btn_go_main');
    const board_id = location.hash.split('#')[1]; // hash값 받아옴
    goMainBtn.addEventListener("click", function () {
        location.href = `#${board_id}#postmain`; //메인 화면으로 페이지 이동
    })
}

export function attach_login_event(login_btn, login_id, login_pw) {
    // Login 버튼 클릭시 로그인 API 호출
    login_btn.addEventListener("click", function () {
        login_FetchAPI(login_id, login_pw);
    })
    // enter 키 입력 시 로그인 API 호출
    login_pw.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) login_FetchAPI(login_id, login_pw);
    })
}
// 함수명바꾸고 event로 이동 

// 이벤트  부착, 스타일 로딩 부분 분리
export function signup_fetchAPI_call() {
    var profile = new Array();
    profile[0] = document.querySelector("#signup_name");
    profile[1] = document.querySelector("#signup_id");
    profile[2] = document.querySelector("#signup_pw");
    profile[3] = document.querySelector("#signup_pw2");
    profile[4] = document.querySelector("#signup_nickname");
    profile[5] = document.querySelector("#signup_email");
    profile[6] = document.querySelector("#signup_birth");

    var profile_check_result = true;

    for (var i = 0; i < 7; i++) {
        if (i === 3) {
            if (password_input_check(profile[2], profile[3]) === false) {
                profile_check_result = false;
                break;
            }
        }
        if (signup_input_check(profile[i]) === false) {
            profile_check_result = false;
            break;
        }
    }
    if (profile_check_result) signup_FetchAPI(profile);
}
// profile 이라 구체적인 정보 알아보지 못함, 해결방안 생각해보기 , 함수명 변경, fetch로 이동?
function signup_input_check(input) {
    if (input.value === "") {
        input.focus();
        alert_message(input);
        return false;
    }
    return true;
}
function alert_message(input) {
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
function password_input_check(pw, pw2) {
    if (pw.value !== pw2.value) {
        alert("비밀번호 확인란을 확인해주세요.")
        return false;
    }
    return true;
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