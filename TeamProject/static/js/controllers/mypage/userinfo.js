import * as COMPONENT_USERINFO from '/static/js/components/mypage/userinfo.js';
import * as API_MY_PAGE from '/static/js/api/mypage.js';

API_MY_PAGE.get_user_info('view');

function user_info_view(user_info) {

    const user_info_container = document.querySelector('.user_info_sub_container');
    user_info_container.innerHTML = COMPONENT_USERINFO.view_user_info(user_info);

    view_btns_eventlistener_init(user_info);

    nav_bar_user_info_init(user_info);

}

function view_btns_eventlistener_init(user_info) {

    const modify_user_info_btn = document.querySelector('#user_modify_btn');
    modify_user_info_btn.addEventListener('click', () => {
        API_MY_PAGE.get_user_info('modify');
    })

    const delete_user_btn = document.querySelector('#user_del_btn');
    delete_user_btn.addEventListener('click', () => {
        if (confirm('회원 탈퇴 시 회원님의 글, 댓글도 모두 삭제됩니다.\n정말로 탈퇴하시겠습니까?') == true) {
            API_MY_PAGE.delete_user(user_info['id']);
        } else return;
    })

}

function modify_user_info_init(user_info) {

    const user_info_container = document.querySelector('.user_info_sub_container');
    user_info_container.innerHTML = COMPONENT_USERINFO.modify_user_info(user_info);

    const modify_btn = document.querySelector('.user_info_modify_btn');
    modify_btn.addEventListener('click', () => {
        API_MY_PAGE.modify_user_info(user_info.id);
    });

}

function nav_bar_user_info_init(user_info){

    setTimeout(() => {
        document.querySelector(".nav_user_info").innerHTML = `<img src="/static/img/profile_img/${user_info.profile_img}" alt="" class="user_img"> ${user_info.nickname}`;
    }, 100);
    
}

export {
    user_info_view,
    modify_user_info_init
};