const auth_api_url = "http://127.0.0.1:5000/api";

const login_modal = `
<div class="login_modal_back">
    <div class="login_modal">
        <div class="login_exit">X</div>
        <div class="login_title">
        Login
        </div>
        <div>
            <input type="text" id="login_id" name="id" class="login_input" placeholder="Enter Your ID"
                autocomplete="off">
        </div>
        <div>
            <input type="password" id="login_pw" name="pw" class="login_input" placeholder="Enter Your PW"
                autocomplete="off">
        </div>
        <div><button id="login_btn" class="login_btn">LOGIN</button></div>
    </div>
</div>`;

const signup_modal = `<div class="signup_modal_back">
<div class="signup_modal">
    <div class="signup_exit">X</div>
    <div class="signup_title">
        Sign Up
    </div>
    <div>
        <span class="signup_sub">NAME</span> 
        <input type="text" id="signup_name" name="name" class="signup_input" placeholder="Name"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">ID</span>
        <input type="text" id="signup_id" name="id" class="signup_input" placeholder="ID"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">PW</span>
        <input type="password" id="signup_pw" name="pw" class="signup_input" placeholder="PW"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">Confirm PW</span>
        <input type="password" id="signup_pw2" name="pw" class="signup_input" placeholder="Confirm PW"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">Nickname</span>
        <input type="text" id="signup_nickname" name="nickname" class="signup_input" placeholder="Nickname"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">E-MAIL</span>
        <input type="text" id="signup_email" name="email" class="signup_input" placeholder="E-mail"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">BIRTH</span>
        <input type="text" id="signup_birth" name="birth" class="signup_input" placeholder="0000-00-00"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">Profile Image</span>
        <input type="file" id="signup_image" class="signup_input">
    </div>
    <div><button id="signup_btn" class="signup_btn">SIGN UP</button></div>
</div>
</div>`;

// ---------- 로그인 완료한 상태 afet_login -------------
function after_login(res) {
    const sub_container = document.querySelector(".sub_container");
    while (sub_container.hasChildNodes()) {
        sub_container.removeChild(sub_container.firstChild);
    }
    const user = document.createElement("span");
    user.classList.add("user_info");
    user.innerHTML = `<img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_img"> ` + res['username'];
    sub_container.appendChild(user);

    const line = document.createElement("span");
    line.classList.add("main_line");
    line.innerHTML=" | ";
    sub_container.appendChild(line);

    const logout = document.createElement("span");
    logout.innerHTML = "Logout"
    logout.classList.add("main_logout_btn");
    sub_container.appendChild(logout);

    logout.addEventListener("click", function () {
        sessionStorage.removeItem("access_token");
        before_login();
    })
}

// --------------- 로그인 하기 전 상태 before_login ----------------
function before_login() {
    const sub_container = document.querySelector(".sub_container");
    sub_container.innerHTML = `<span class="main_login">Login</span> |
    <span class="main_signup">Sign up</span>`;

    main_login_btn_func();
    main_signup_btn_func();
}

// --------- 접속 시 실행 ------------
before_login();
get_userinfo_FetchAPI();


// ------------ 메인의 로그인 버튼 실행 함수 ---------------
function main_login_btn_func(){
    const main_login_btn = document.querySelector(".main_login");
    const login_container = document.querySelector("#login_container");
    
    main_login_btn.addEventListener("click", function () {
        // 로그인 모달을 만들어준다.
        login_container.innerHTML = login_modal;

        // 로그인 모달 주요 style 변경
        setTimeout(() => {
            document.querySelector(".login_modal").style.opacity = "1";
            document.querySelector(".login_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".login_exit").addEventListener("click", function () {
            login_container.innerHTML = '';
        })

        // Login 버튼 클릭시 로그인 API 호출
        document.querySelector("#login_btn").addEventListener("click", function () {
            login_FetchAPI();
        })
        // enter 키 입력 시 로그인 API 호출
        document.querySelector("#login_pw").addEventListener("keyup",(e)=>{
            if(e.keyCode === 13) login_FetchAPI();
        })

    })
}

// ---------------- 메인의 회원가입 버튼 실행 함수 -----------------
function main_signup_btn_func() {
    const main_signup_btn = document.querySelector(".main_signup");
    const signup_container = document.querySelector("#signup_container");
    

    main_signup_btn.addEventListener("click", function () {
        // 회원가입 모달을 만들어줌
        signup_container.innerHTML = signup_modal;

        // 회원가입 모달 주요 style 변경
        setTimeout(() => {
            document.querySelector(".signup_modal").style.opacity = "1";
            document.querySelector(".signup_modal").style.transform = "translateY(0%) translateX(0%) rotateX(0deg)";
        }, 50);

        // X 버튼 클릭시 모달 사라짐
        document.querySelector(".signup_exit").addEventListener("click", function () {
            signup_container.innerHTML = '';
        })

        // signup 버튼 클릭시 회원가입 api 호출
        document.querySelector("#signup_btn").addEventListener("click", function () {
            // if(image == "") signup_FetchAPI(image);
            // else{
            //     signup_FetchAPI();
            //     signup_image_FetchAPI();
            // }
            signup_FetchAPI();
        })
        // enter 키 입력 시 로그인 API 호출
        document.querySelector("#signup_birth").addEventListener("keyup",(e)=>{
            if(e.keyCode === 13){
                signup_FetchAPI();
            }
        })
    })
}


// ------------------------ 로그인 fetch api ------------------------------
function login_FetchAPI() {

    const id = document.querySelector("#login_id").value;
    const pw = document.querySelector("#login_pw").value;

    const send_data = {
        'userid': id,
        'password': pw
    };

    const login_url = auth_api_url + "/login";
    fetch(login_url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(send_data)
        })
        .then(res => res.json())
        .then((res) => {
            if (res['result'] == "success") {
                sessionStorage.setItem('access_token', "Bearer " + res['access_token']);
                document.querySelector("#login_container").innerHTML = '';
                get_userinfo_FetchAPI();
            }
            else if(res['result'] == "incorrect Password"){
                alert("비밀번호를 다시 확인해주세요.");
            }
            else if(res['result'] == "not found"){
                alert("아이디를 다시 확인해주세요.");
            }
        })
}

// ------------------------------ 회원가입 Fetch Api ------------------------------------
// function signup_FetchAPI() {

//     const name = document.querySelector("#signup_name").value;
//     const id = document.querySelector("#signup_id").value;
//     const pw = document.querySelector("#signup_pw").value;
//     const pw2 = document.querySelector("#signup_pw2").value;
//     const email = document.querySelector("#signup_email").value;
//     const nick = document.querySelector("#signup_nickname").value;
//     const birth = document.querySelector("#signup_birth").value;

//     const image = document.querySelector('input[type="file"]');
//     if(image.value != "") signup_image_FetchAPI(image.files[0]);

//     const send_data = {
//         'userid': id,
//         'password': pw,
//         'repassword': pw2,
//         'username': name,
//         'nickname': nick,
//         'email': email,
//         'birth': birth
//     };

//     const signup_url = auth_api_url + "/sign_up";
//     fetch(signup_url, {
//             method: "POST",
//             headers: {
//                 'Content-Type': "application/json"
//             },
//             body: JSON.stringify(send_data)
//         })
//         .then(res => res.json())
//         .then((res) => {
//             if (res['status'] == "성공") {
//                 alert("회원가입 완료");
//                 document.querySelector("#signup_container").innerHTML = '';
//             }
//             else if(res['error']=="already exist"){
//                 alert("이미 존재하는 ID 입니다.");
//             }
//             else if(res['error']=="Wrong password"){
//                 alert("패스워드가 일치하지 않습니다.");
//             }
//         })
// }

// function signup_image_FetchAPI(image){

//     const send_data = new FormData();
//     send_data.append('profile_img',image);

//     const signup_url = auth_api_url + "/sign_up_image";
//     fetch(signup_url, {
//             method: "POST",
//             body: send_data
//         })
//         .then(res => res.json())
//         .then((res) => {
//             console.log(res);
//         })
// }
function signup_FetchAPI() {

    const send_data = new FormData();

    const name = document.querySelector("#signup_name").value;
    const id = document.querySelector("#signup_id").value;
    const pw = document.querySelector("#signup_pw").value;
    const pw2 = document.querySelector("#signup_pw2").value;
    const email = document.querySelector("#signup_email").value;
    const nick = document.querySelector("#signup_nickname").value;
    const birth = document.querySelector("#signup_birth").value;
    const image = document.querySelector('input[type="file"]');
    

    send_data.append('userid', id);
    send_data.append('password', pw);
    send_data.append('repassword', pw2);
    send_data.append('username', name);
    send_data.append('nickname', nick);
    send_data.append('email', email);
    send_data.append('birth', birth);
    send_data.append('userid', id);

    if(image.value == "") send_data.append('profile_img', "");
    else send_data.append('profile_img', image.files[0]);

    console.log(send_data);

    const signup_url = auth_api_url + "/sign_up";
    fetch(signup_url, {
            method: "POST",
            body: send_data
        })
        .then(res => res.json())
        .then((res) => {
            console.log(res);
            if (res['status'] == "성공") {
                alert("회원가입 완료");
                document.querySelector("#signup_container").innerHTML = '';
            }
            else if(res['error']=="already exist"){
                alert("이미 존재하는 ID 입니다.");
            }
            else if(res['error']=="Wrong password"){
                alert("패스워드가 일치하지 않습니다.");
            }
        })
}

// -------------------------- 유저 정보 불러오기 fetch api ------------------------
function get_userinfo_FetchAPI() {
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem("access_token") == 0) return;

    const token = sessionStorage.getItem('access_token');

    const user_info_url = auth_api_url + "/user_info";

    fetch(user_info_url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            after_login(res);
        })
}