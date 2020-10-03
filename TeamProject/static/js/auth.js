const auth_api_url = "http://127.0.0.1:5000/api";

const login_modal = `
<div class="login_modal_back">
    <div class="login_modal">
        <div class="login_exit">X</div>
        <div class="login_title">
        로그인
        </div>
        <div>
            <input type="text" id="login_id" name="id" class="login_input" placeholder="아이디 입력"
                autocomplete="off">
        </div>
        <div>
            <input type="password" id="login_pw" name="pw" class="login_input" placeholder="비밀번호 입력"
                autocomplete="off">
        </div>
        <div><button id="login_btn" class="login_btn">LOGIN</button></div>
    </div>
</div>`;

const signup_modal = `<div class="signup_modal_back">
<div class="signup_modal">
    <div class="signup_exit">X</div>
    <div class="signup_title">
        회원 가입
    </div>
    <div>
        <span class="signup_sub">이름</span> 
        <input type="text" id="signup_name" name="name" class="signup_input" placeholder="이름"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">아이디</span>
        <input type="text" id="signup_id" name="id" class="signup_input" placeholder="아이디"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">비밀번호</span>
        <input type="password" id="signup_pw" name="pw" class="signup_input" placeholder="비밀번호"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">비밀번호 확인</span>
        <input type="password" id="signup_pw2" name="pw" class="signup_input" placeholder="비밀번호 확인"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">닉네임</span>
        <input type="text" id="signup_nickname" name="nickname" class="signup_input" placeholder="닉네임"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">이메일</span>
        <input type="text" id="signup_email" name="email" class="signup_input" placeholder="이메일"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">생년월일</span>
        <input type="text" id="signup_birth" name="birth" class="signup_input" placeholder="YYYY-MM-DD"
            autocomplete="off">
    </div>
    <div>
        <span class="signup_sub">프로필 사진</span>
        <input type="file" id="signup_image" class="signup_input">
    </div>
    <div><button id="signup_btn" class="signup_btn">SIGN UP</button></div>
</div>
</div>`;

// ---------- 로그인 완료한 상태 afet_login -------------
function after_login(res) {
    const auth_container = document.querySelector(".nav_auth");

    while (auth_container.hasChildNodes()) {
        auth_container.removeChild(auth_container.firstChild);
    }

    const user = document.createElement("span");
    user.classList.add("nav_user_info");
    user.innerHTML = `<img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_img"> ` + res['nickname'];
    auth_container.appendChild(user);

    const logout = document.createElement("span");
    logout.innerHTML = "로그아웃"
    logout.classList.add("nav_logout");
    logout.addEventListener("click", function () {
        sessionStorage.removeItem("access_token");
        before_login();
        location.href = '/';
    })
    auth_container.appendChild(logout);

    // 만약 로그인한 유저의 닉네임이 GM이면 관리자 이므로, 마이페이지 대신 관리자페이지를 넣어준다.
    if(res['nickname']=="GM"){
        const manager_page = document.createElement("span");
        manager_page.innerHTML = "관리자페이지";
        manager_page.classList.add("nav_manager_page");
        manager_page.addEventListener("click",()=>{location.href='manager';})
        auth_container.appendChild(manager_page);
    }
    else{
        const mypage = document.createElement("span");
        mypage.innerHTML = "마이페이지";
        mypage.classList.add("nav_mypage");
        mypage.addEventListener("click",()=>{location.href='mypage';})
        auth_container.appendChild(mypage);
    }
    

    const main_auth_container = document.querySelector(".sub_container");
    main_auth_container.innerHTML = `<div class="main_auth_div"><span class="main_user_info">
    <img src="../static/img/profile_img/${res['profile_img']}" class="main_user_image"> ${res['nickname']} 님 환영합니다. </span></div>`;
}

// --------------- 로그인 하기 전 상태 before_login ----------------
function before_login() {
    const auth_container = document.querySelector(".nav_auth");
    auth_container.innerHTML = `<span id="nav_login" class="nav_login">로그인</span>
    <span id="nav_signup" class="nav_signup">회원가입</span>`;

    const main_auth_container = document.querySelector(".sub_container");
    main_auth_container.innerHTML = `<div>
    <input type="text" id="main_login_id" name="id" class="main_login_input" placeholder="아이디 입력"
        autocomplete="off">
    </div>
    <div>
    <input type="password" id="main_login_pw" name="pw" class="main_login_input" placeholder="비밀번호 입력"
        autocomplete="off">
    </div>
    <button id="main_login_btn" class="main_login_btn">로그인</button>`;

    nav_login_btn_func();
    nav_signup_btn_func();
}

// --------- 접속 시 실행 ------------
before_login();
get_userinfo_FetchAPI();


// ------------ 네비게이션의 로그인 버튼 실행 함수 ---------------
function nav_login_btn_func(){
    const nav_login_btn = document.querySelector("#nav_login");
    const login_container = document.querySelector("#login_container");
    
    nav_login_btn.addEventListener("click", function () {
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

// ---------------- 네비게이션의 회원가입 버튼 실행 함수 -----------------
function nav_signup_btn_func() {
    const nav_signup_btn = document.querySelector("#nav_signup");
    const signup_container = document.querySelector("#signup_container");
    

    nav_signup_btn.addEventListener("click", function () {
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


// --------------------- 회원가입 Fetch API ------------------
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

    const signup_url = auth_api_url + "/sign_up";
    fetch(signup_url, {
            method: "POST",
            body: send_data
        })
        .then(res => res.json())
        .then((res) => {
            if (res['msg'] == "success") {
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