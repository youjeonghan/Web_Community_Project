//post-fetch.js, render.js 추출
export const API_URL = 'http://127.0.0.1:5000/api';

export const POST= 'http://127.0.0.1:5000/api/post';
export const FILE_UPLOAD= 'http://127.0.0.1:5000/api/postupload';
export const USER_INFO= 'http://127.0.0.1:5000/api/user_info';
export const BOARD= 'http://127.0.0.1:5000/api/board_info';
export const COMMENT = 'http://127.0.0.1:5000/api/comment/';
export const POSTLIKES = 'http://127.0.0.1:5000/api/postlike/';
export const COMMENTLIKES = 'http://127.0.0.1:5000/api/commentlike/';
export const BEST_POST = 'http://127.0.0.1:5000/api/bestpost';
export const USER_SPECIFIC = 'http://127.0.0.1:5000/api/user_specific_info/';
export const SEARCH = 'http://127.0.0.1:5000/api/search';
export const REPORT = 'http://127.0.0.1:5000/api/report_post/';
export const REPORT_COMMENT = 'http://127.0.0.1:5000/api/report_comment/';
export const CHECK_AUTH = 'http://127.0.0.1:5000/api//who_are_you';

export const PREVIEW_IMG = 'http://127.0.0.1:5000/static/img/';
export const POST_IMG = 'http://127.0.0.1:5000/static/img/post_img/';
export const PROFILE_IMG = 'http://127.0.0.1:5000/static/img/profile_img/';
// export const ICONS_PLUS_MATH = 'https://img.icons8.com/windows/80/000000/plus-math.png';

export const AUTH_API = "http://127.0.0.1:5000/api";
export const MAIN_API = "http://127.0.0.1:5000/";
export const MAIN_SUBTITLE = "http://127.0.0.1:5000/#sub_title";

export const GET_BEST_BOARD = API_URL + '/bestboard';
export const GET_ALL_CATEGORY = API_URL + '/category_info';
export const GET_ALL_BOARD_IN_CATEGORY = API_URL + '/board/';
export const MODIFY_OR_DELETE_USER_INFO = API_URL + '/users/';

export const MODIFY_BOARD_IMAGE = API_URL + '/admin/board_img_modify/';
export const ADD_CATEGORY = API_URL + '/admin/category_add';
export const ADD_BOARD = API_URL + '/admin/board_add';

export const GET_POST_REPORTS = API_URL + '/admin/post_report';
export const GET_COMMENT_REPORTS = API_URL + '/admin/comment_report';
export const ADD_USER_POST_BLACKLIST =  API_URL + '/admin/post-blacklist';
export const ADD_USER_COMMENT_BLACKLIST =  API_URL + '/admin/comment-blacklist';
export const DELETE_POST_REPORT = API_URL + '/admin/post_report_delete';
export const DELETE_COMMENT_REPORT = API_URL + '/admin/comment_report_delete';
export const DELETE_POST_REPORTLIST = API_URL + '/admin/post_report_list_delete';
export const DELETE_COMMENT_REPORTLIST = API_URL + '/admin/comment_report_list_delete'
export const GET_ALL_USER_INFO = API_URL + '/admin/users_all_info';
export const DELETE_CATEGORY = API_URL + '/admin/category_set/';
export const DELETE_BOARD = API_URL + '/admin/board_set/';

export const GET_SEARCH_USER = API_URL + '/admin/nickname_search/';
export const MODIFY_USER_NICKNAME = API_URL + '/admin/user_nickname_modify/';
export const DELETE_USER = API_URL + '/admin/user_delete/';

export const LODING_IMG = 'http://127.0.0.1:5000/static/img/loading.gif';
// PREVIEW_IMG + 'loading.gif';
export const LAST_IMG = 'http://127.0.0.1:5000/static/img/Exclamation.png';
// PREVIEW_IMG + 'Exclamation.png';
