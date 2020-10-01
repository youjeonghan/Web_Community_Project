function user_info_view(res) {
    const user_info_container = document.querySelector(".user_info_sub_container");
    const user_info = `<div class="user_info_view_container">
    <div class="user_info_sub_title">
        이름
    </div>
    <div class="user_info_name">
        ${res['username']}
    </div>
</div>
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
                <button class="user_info_btn">회원 탈퇴</button>
            </div>`;
    user_info_container.innerHTML = user_info;
    document.querySelector("#user_modify_btn").addEventListener("click",()=>{
        mypage_get_userinfo_FetchAPI("modify");
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
            console.log(res);
            if(func_name == "view") user_info_view(res);
            else if(func_name == "modify") user_info_modify_modal_insert(res);
        })
}

mypage_get_userinfo_FetchAPI("view");



// ---------------------------------- 회원 정보 수정 ---------------------------------------------
function user_info_modify_modal_insert(res){
    const user_info_modify = `<div class="user_info_view_container">
    <div class="user_info_sub_title">
        이름
    </div>
    <input type="text" id="user_info_modify_name" class="user_info_modify_input" autocomplete="off">
</div>
<div class="user_info_view_container">
    <div class="user_info_sub_title">
        아이디
    </div>
    <input type="text" id="user_info_modify_id" class="user_info_modify_input" autocomplete="off">
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
    <input type="file" id="user_info_modify_image" class="user_info_modify_input" autocomplete="off">
    <div class="user_image_container">
        <img src="../static/img/profile_img/${res['profile_img']}" alt="" class="user_info_image">
    </div>
</div>
<div class="user_info_btn_container">
                <button class="user_info_btn user_info_modify_btn">수정</button>
            </div>`;

    const user_info_container = document.querySelector(".user_info_sub_container");
    user_info_container.innerHTML = user_info_modify;
    
    const user_name = document.querySelector("#user_info_modify_name");
    user_name.value = res['username'];
    const user_id = document.querySelector("#user_info_modify_id");
    user_id.value = res['userid'];
    const user_nickname = document.querySelector("#user_info_modify_nickname");
    user_nickname.value = res['nickname'];
    const user_email = document.querySelector("#user_info_modify_email");
    user_email.value = res['email'];
    const user_birth = document.querySelector("#user_info_modify_birth");
    user_birth.value = res['birth'];
    const user_image = document.querySelector("#user_info_modify_image");
    // user_image.value = res['profile_img'];
    user_image.addEventListener('change', update_user_image(user_image.files[0].name));

    const modify_btn = document.querySelector(".user_info_modify_btn");
    modify_btn.addEventListener("click",()=>{
        user_info_modify_FetchAPI();
    });

    
}

function user_info_modify_FetchAPI(){

}

function update_user_image(image_name){
    const user_image_container = document.querySelector(".user_image_container");
    user_image_container.innerHTML = `<img src="../static/img/profile_img/${image_name}" alt="" class="user_info_image">`;
}