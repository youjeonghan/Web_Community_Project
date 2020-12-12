import * as EVENT from "./event.js"
import * as MAIN from "../common/main.js"
import * as EVENT_AUTH from "../../Auth/event.js";
import * as USR_FETCH from "../user/fetch.js"
import * as LINK from "../../config.js";

export function input_post_window() {
    const post_window = '<div class="input__on"><input type="text" class="input__subject" maxlength="25" placeholder="글 제목을 입력해주세요" >' +
      '<div class = "input_wrap"><textarea name="article" class="input__article" maxlength="800" placeholder="내용을 입력하세요"></textarea>' +
      '<div class = "input__file" id = "drag_drop">' +
    
      '<form method="post"  enctype="multipart/form-data"><div class = "file_preview"></div><div class = "file_input">' +
      '<label for="upload_file">' +
      '<img src="https://img.icons8.com/windows/80/000000/plus-math.png"/></label>' +
      '<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div></form>' +
    
      '</div><div class = input_buttons><input type="button"  id = "button_submit" value="SUBMIT" />' +
      '<input type="button" value="X" /></div>'
  
    const post_input = document.querySelector('.post_input');
    post_input.innerHTML = post_window;
  }

  export function input_post_div() {
    document.querySelector('.post_input').innerHTML =
      '<div class = "input_off"> <p>게시글을 작성해보세요</p></div>';
  }

  export async function post(post, userid) {
    const post_div = document.querySelector('.post');
    const post_lists = document.querySelector('.post_lists');
    const post_input = document.querySelector('.post_input');
    if (document.querySelector('.post_info')) {
      post_after_update(post);
      return;
    }
  
    if (post_lists !== null) lists.parentNode.removeChild(post_lists);
    if (post_input !== null) input.parentNode.removeChild(post_input);
    const user_data = await USR_FETCH.get_user_data(post.userid);
    const html = '<div class="post_info"><div class="info_maintext">' +
      '<div class="info_top">' +
      `<h1>${post.subject}</h1>` +
      '<div class="infoTop_buttons">' +
      '<input type="button" id = "updatePost__' + post.id + '" value="수정" />' +
      '<input type="button" id = "deletePost__' + post.id + '" value="삭제" />' +
      '</div>' +
      '<div class = "infoTop_sub">' +
      `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
      `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${MAIN.calc_date(post.create_date)}</span>` +
      '</div>' +
      '</div>' +
      `<div class="info_article"><p>${post.content}</p><div class="info_img"></div></div>` +
      '<div class="info_buttons">' +
      `<input type="button" id="btn_postinfo_report" value="신고" />` +
      `<input type="button" id="postinfo_likes_${post.id}" value="추천 ${post.like_num}" />` +
      '</div>' +
      '</div>' +
      '<div class="comment">' +
      `<p class = "comment_num">${post.comment_num}개의 댓글 </p>` +
      '<div class="comment_input">' +
      '<textarea placeholder = "댓글을 입력해주세요 " class = "comment_value"></textarea>' +
      `<input type="button" id = "comment_id_${post.id}"value="댓글작성" />` +
      '</div>' +
      '<div class="comment_list"></div>' +
      '<div class="comment_last"><input type="button" class="btn_go_main" value="목록으로" /></div></div>';
    post_div.innerHTML = html;
    await post_img(post.post_img_filename);
  
    if (post.userid !== userid) document.querySelector('.infoTop_buttons').style.cssText = ' display: none';

    EVENT_AUTH.move_mainpage();
    EVENT.update_post();
    EVENT.delete_post();
  }

  export function post_img(imgs) {
    const ele = document.querySelector('.info_img');
    let img;
    for (var i = 0; i <= imgs.length - 1; i++) {
      img = MAIN.create_html_object('img', ['src'], [`http://127.0.0.1:5000/static/img/post_img/${imgs[i]}`]);
      ele.appendChild(img);
    }
  }

export async function post_update(post) {
    const user_data = await USR_FETCH.get_user_data(post.userid);
    const info_top = document.querySelector('.info_top');
    const info_article = document.querySelector('.info_article');

    info_top.innerHTML = '';
    info_top.innerHTML = `<input type="text" value="${post.subject}" class="update_subject">` +
      '<div class="infoTop_buttons">' +
      '<input type="button" id = "updateSubmitPost__' + post.id + '" value="완료" />' +
      '<input type="button" id = "deletePost__' + post.id + '"value="삭제" />' +
      '</div>' +
      '<div class = "infoTop_sub">' +
      `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
      `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${MAIN.calc_date(post.create_date)}</span>` +
      '</div>';

    info_article.innerHTML = '';
    info_article.innerHTML = `<textarea name="article" class = "update_article">${post.content}</textarea>` +
      '<div class = "input__file" id = "drag_drop">' +
      '<form method="post"  enctype="multipart/form-data"><div class = "file_currentPreview"></div><div class = "file_preview"></div><div class = "file_input">' +
      '<label for="upload_file">' +
      '<img src="https://img.icons8.com/windows/80/000000/plus-math.png"/></label>' +
      '<input type="file" class = "input_file" id="upload_file" accept=".png, .jpg, .jpeg, .gif" multiple /></div></form></div>';
   
  }

  export const post_after_update = async (post) => {
    const user_data = await USR_FETCH.get_user_data(post.userid);
    const info_top = document.querySelector('.info_top');
    const info_article = document.querySelector('.info_article');
    info_top.innerHTML = '';
    info_top.innerHTML = `<h1>${post.subject}</h1>` +
      '<div class="infoTop_buttons">' +
      '<input type="button" id = "updatePost__' + post.id + '" value="수정" />' +
      '<input type="button" id = "deletePost__' + post.id + '" value="삭제" />' +
      '</div>' +
      '<div class = "infoTop_sub">' +
      `<img src="${'http://127.0.0.1:5000/static/img/profile_img/'+user_data.profile_img}">` +
      `<span class ="infoSub_nickname">${user_data.nickname}</span><span class ="infoSub_date">${MAIN.calc_date(post.create_date)}</span>` +
      '</div>';
    
    info_article.innerHTML = '';
    info_article.innerHTML = `<p>${post.content}</p>`;
  }

  export function upload_img_preview(curfiles) {
    const img_preview = document.querySelector('.file_preview'); 
    while (img_preview.firstChild) {
      img_preview.removeChild(img_preview.firstChild); 
    }
    
    if (curfiles === null) {
      return;
    } else { 
      for (let i = 0; i <= curfiles.length - 1; i++) { 
        if (MAIN.validFileType(curfiles[i])) { 
  
          const div = MAIN.create_html_object('div', ['class'], ['previewimageItem']);
          const input = MAIN.create_html_object('input', ['type', 'class', 'id', 'value'], ['button', 'previewimageItem_button', `previewImage__${i}`, 'X']);
          const img = MAIN.create_html_object('img', ['src'], [`${URL.createObjectURL(curfiles[i])}`]);
          div.appendChild(input);
          div.appendChild(img);
          img_preview.appendChild(div); 
        } else alert('이미지파일만 업로드가능합니다');
      }
      EVENT.delete_upload_file_in_post_input();
    }
  }

  export const current_img_preview = async (imgs) => {
    const current_preview = document.querySelector('.file_currentPreview');
    for (let i = 0; i <= imgs.length - 1; i++) {
      const div = MAIN.create_html_object('div', ['class'], ['previewimageItem']);
      const input = MAIN.create_html_object('input', ['type', 'class', 'id', 'value'], ['button', 'currentPreviewImageItem_button', `currentImage__${imgs[i]}`, 'X']);
      const img = MAIN.create_html_object('img', ['src'], [`${LINK.POST_IMG}`+`${imgs[i]}`]);
      div.appendChild(input);
      div.appendChild(img);
      current_preview.appendChild(div);
    }
    EVENT.delete_file_when_update_post();
  }