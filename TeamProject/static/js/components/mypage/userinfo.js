export function view_user_info(user_info){
    const view_user_info = `
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            아이디
        </div>
        <div class='user_info_name'>
            ${user_info['userid']}
        </div>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            이름
        </div>
        <div class='user_info_name'>
            ${user_info['username']}
        </div>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            닉네임
        </div>
        <div class='user_info_name'>
            ${user_info['nickname']}
        </div>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            이메일
        </div>
        <div class='user_info_name'>
            ${user_info['email']}
        </div>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            생년월일
        </div>
        <div class='user_info_name'>
            ${user_info['birth']}
        </div>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            프로필 사진
        </div>
        <div class='user_info_name'>
            <img src='/static/img/profile_img/${user_info['profile_img']}' alt='' class='user_info_image'>
        </div>
    </div>
    <div class='user_info_btn_container'>
            <button class='user_info_btn' id='user_modify_btn'>정보 수정</button>
            <button class='user_info_btn' id='user_del_btn'>회원 탈퇴</button>
    </div>`;

    return view_user_info;
}

export function modify_user_info(user_info){
    const modify_user_info = `
    <div class='user_info_view_container'>
    <div class='user_info_sub_title'>
        아이디
    </div>
    <div class='user_info_name'>
        ${user_info.userid}
    </div>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            이름
        </div>
        <input type='text' id='user_info_modify_name' class='user_info_modify_input' autocomplete='off'
        value='${user_info.username}'>
    </div>

    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            닉네임
        </div>
        <input type='text' id='user_info_modify_nickname' class='user_info_modify_input' autocomplete='off'
        value='${user_info.nickname}' maxlength='10' placeholder='닉네임 (~10자)'>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            이메일
        </div>
        <input type='text' id='user_info_modify_email' class='user_info_modify_input' autocomplete='off'
        value='${user_info.email}' placeholder='이메일 (rrr@rrr.rrr)'>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            생년월일
        </div>
        <input type='text' id='user_info_modify_birth' class='user_info_modify_input' autocomplete='off'
        placeholder='YYYY-MM-DD' value='${user_info.birth}'>
    </div>
    <div class='user_info_view_container'>
        <div class='user_info_sub_title'>
            프로필 사진
        </div>
        <input type='file' id='user_info_modify_image' class='user_info_modify_input' autocomplete='off' accept='image/*'>
        <span class='user_info_image_sub'>변경하지 않을 시 기존 이미지 유지</span>
    </div>
    <div class='user_info_btn_container'>
                <button class='user_info_btn user_info_modify_btn'>수정하기</button>
    </div>`;

    return modify_user_info;
}