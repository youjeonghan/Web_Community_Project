const main_url = "http://127.0.0.1:5000/api";

function user_info_view(res) {
    const user_info_container = document.querySelector(".user_info_sub_container");
    const user_info = `
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        아이디
    </div>
    <div class="user_info_name">
        ${res['userid']}
    </div>
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        이름
    </div>
    <div class="user_info_name">
        ${res['username']}
    </div>
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        닉네임
    </div>
    <div class="user_info_name">
        ${res['nickname']}
    </div>
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        이메일
    </div>
    <div class="user_info_name">
        ${res['email']}
    </div>
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        생년월일
    </div>
    <div class="user_info_name">
        ${res['birth']}
    </div>
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        프로필 사진
    </div>
    <div class="user_info_name">
        <img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_info_image">
    </div>
</div>
<div class="user_info_btn_container">
                <button class="user_info_btn" id="user_modify_btn">정보 수정</button>
                <button class="user_info_btn" id="user_del_btn">회원 탈퇴</button>
            </div>`;
    user_info_container.innerHTML = user_info;
    
    document.querySelector("#user_modify_btn").addEventListener("click", () => {
        mypage_get_userinfo_FetchAPI("modify");
    })
    document.querySelector("#user_del_btn").addEventListener("click", ()=>{
        if (confirm("회원 탈퇴 시 회원님의 글, 댓글도 모두 삭제됩니다.\n정말로 탈퇴하시겠습니까?") == true) {
            user_delete_FetchAPI(res["id"]);
        } else return;
    })

}

// -------------------------- 유저 정보 불러오기 fetch api ------------------------
function mypage_get_userinfo_FetchAPI(func_name) {
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
            if (func_name == "view") user_info_view(res);
            else if (func_name == "modify") user_info_modify_modal_insert(res);
        })
}

mypage_get_userinfo_FetchAPI("view");



// ---------------------------------- 회원 정보 수정 ---------------------------------------------
function user_info_modify_modal_insert(res) {
    const user_info_modify = `
    <div class="user_info_view_container">
    <div class="user_info_sub_title">
        아이디
    </div>
    <div class="user_info_name">
        ${res['userid']}
    </div>
    </div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        이름
    </div>
    <input type="text" id="user_info_modify_name" class="user_info_modify_input" autocomplete="off">
</div>

<div class="user_info_view_container">
    <div class="user_info_sub_title">
        닉네임
    </div>
    <input type="text" id="user_info_modify_nickname" class="user_info_modify_input" autocomplete="off">
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        이메일
    </div>
    <input type="text" id="user_info_modify_email" class="user_info_modify_input" autocomplete="off">
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        생년월일
    </div>
    <input type="text" id="user_info_modify_birth" class="user_info_modify_input" autocomplete="off" placeholder="YYYY-MM-DD">
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        프로필 사진
    </div>
    <input type="file" id="user_info_modify_image" class="user_info_modify_input" autocomplete="off" onchange="update_user_image(this.files[0].name)" accept="image/*">
    <div class="user_image_container">
        <img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_info_image">
    </div>
</div>
<div class="user_info_btn_container">
                <button class="user_info_btn user_info_modify_btn">수정하기</button>
            </div>`;

    const user_info_container = document.querySelector(".user_info_sub_container");
    user_info_container.innerHTML = user_info_modify;

    const user_name = document.querySelector("#user_info_modify_name");
    user_name.value = res['username'];
    const user_nickname = document.querySelector("#user_info_modify_nickname");
    user_nickname.value = res['nickname'];
    const user_email = document.querySelector("#user_info_modify_email");
    user_email.value = res['email'];
    const user_birth = document.querySelector("#user_info_modify_birth");
    user_birth.value = res['birth'];

    const modify_btn = document.querySelector(".user_info_modify_btn");
    modify_btn.addEventListener("click", () => {
        user_info_modify_FetchAPI(res['id']);
    });

}

function update_user_image(image_name) {
    const user_image_container = document.querySelector(".user_image_container");
    user_image_container.innerHTML = `<img src="../static/img/profile_img/${image_name}" alt="" class="user_info_image">`;
}

function user_info_modify_FetchAPI(id) {
    // 로그인 토근 여부 확인
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem("access_token") == 0) return;
    const token = sessionStorage.getItem('access_token');

    const send_data = new FormData();

    const user_name = document.querySelector("#user_info_modify_name").value;
    const user_id = document.querySelector("#user_info_modify_id").value;
    const user_nickname = document.querySelector("#user_info_modify_nickname");
    const user_email = document.querySelector("#user_info_modify_email").value;
    const user_birth = document.querySelector("#user_info_modify_birth").value;
    const user_image = document.querySelector("#user_info_modify_image");

    send_data.append('username', user_name);
    send_data.append('userid', user_id);
    send_data.append('nickname', user_nickname.value);
    send_data.append('email', user_email);
    send_data.append('birth', user_birth);
    if (user_image.value == "") send_data.append('profile_img', "");
    else send_data.append('profile_img', user_image.files[0]);

    const user_modify_url = main_url + "/users/" + id;
    fetch(user_modify_url, {
            method: "PUT",
            body: send_data,
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then((res) => {
            console.log(res);
            if (res['result'] == "success") {
                alert("회원 정보 수정 완료");
                document.querySelector("#signup_container").innerHTML = '';
                mypage_get_userinfo_FetchAPI("view");
                get_userinfo_FetchAPI();
            } else if (res['error'] == "already exist") {
                alert("이미 존재하는 ID 입니다.");
            }
            else if(res['error'] == "이미 있는 닉네임입니다."){
                alert("이미 존재하는 닉네임입니다.");
                user_nickname.focus();
            }
        })

}


// -------------- 회원 탈퇴 Fetch API ---------------

function user_delete_FetchAPI(id){
    if (sessionStorage.length == 0) return;
    else if (sessionStorage.length == 1)
        if (sessionStorage.getItem("access_token") == 0) return;
    const token = sessionStorage.getItem('access_token');

    const user_delete_url = main_url + "/users/" + id;
    fetch(user_delete_url, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((res) => {
            console.log(res.json());
            console.log(res);
            alert("회원 탈퇴 완료");
            sessionStorage.removeItem("access_token");
            location.href = '/';
        });

}