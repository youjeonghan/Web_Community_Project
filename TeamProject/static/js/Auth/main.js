
import * as REND_AUTH from "../Auth/render.js"
import * as FETCH_AUTH from "../Auth/fetch.js"

// --------- 접속 시 실행 ------------
mainpage_before_login();
FETCH_AUTH.get_user_information();

// --------------- 로그인 하기 전 상태 before_login ----------------
export function mainpage_before_login() {
    REND_AUTH.nav_bar_before_login();
    REND_AUTH.main_before_login();
}
// ---------- 로그인 완료한 상태 afet_login -------------
export function mainpage_after_login(res) {
    REND_AUTH.nav_bar_after_login(res);
    REND_AUTH.main_after_login(res);
}