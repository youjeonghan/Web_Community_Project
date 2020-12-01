// import * as FETCH from "../fetch.js"
// import * as REND_ASIDE from "../aside/render.js"

// /*=============================사이드바 =========================*/
// // 베스트 게시글 불러오기
// export async function loading_best_post() {
//   try {
//     const board_id = location.hash.split('#')[1];
//     const data = await FETCH.get_best_post_information(board_id);
//     if (data != null) {
//       REND_ASIDE.best_post(data);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }