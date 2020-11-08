//=============== list page에서 게시글 작성까지 ===============//
export function expand_posting_input() {
    const ele = document.querySelector('.input__off');
    ele.addEventListener('click', async function () {
        const token = sessionStorage.getItem('access_token');
        if (token === null) {
            alert('로그인을 먼저 해주세요');
            return null;
        }
        await MAIN.input_post();
        handle_fileInputTag();
    });
}

export function cancel_posting_input() {
    REND.render_inputOff();
    posting_input_btn();
}

export function submit_posting_input() {
    const submit = document.getElementById('button_submit');
    submit.addEventListener('click', async function () {
        const post = await MAIN.submit_post();
        const image_data = MAIN.INPUT_DATA_FILE.return_files();
        if (image_data !== null) await FETCH.fetch_upload(post.post_id, image_data);
        await location.reload();
    });
}

export function add_upload_file_in_posting_input() {
    const input = document.querySelector('.file_input').querySelector('input');
    input.addEventListener('change', function () { //파일 미리보기 이벤트 리스너
        MAIN.INPUT_DATA_FILE.append_file(input.files);
    });
}

export function delete_upload_file_in_posting_input() {
    const ele = document.querySelectorAll('.previewimageItem_button');
    for (const value of ele) {
        value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
            const index = event.currentTarget.id.split('__')[1];
            MAIN.INPUT_DATA_FILE.delete_file(index);
        });
    }
}

export function delete_file_when_update_posting() {
    const ele = document.querySelectorAll('.currentPreviewImageItem_button');
    for (const value of ele) {
        value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
            const filename = event.currentTarget.id.split('__')[1];
            MAIN.INPUT_DATA_FILE.delete_currentFile(filename);
            const delete_node = value.parentNode;
            delete_node.parentNode.removeChild(delete_node);
        });
    }
}

export function click_posting() {
    const id = event.currentTarget.id.split('__');
    location.href = `#${id[1]}#postinfo#${id[2]}`; //페이지 이동
}

export function delete_posting() {
    const delete_update_btn = document.querySelector('[id^="deletePost__"]');
    delete_update_btn.addEventListener('click', function () {
      const confirmflag = confirm("삭제하시겠습니까?");
      const posting_id = delete_update_btn.id.split('__')[1];
      if (confirmflag) MAIN.delete_post(posting_id);
    })
  }

  export function update_posting() {
    const postUpdateBtn = document.querySelector('[id^="updatePost__"]');
    postUpdateBtn.addEventListener('click', function () {
      const target = postUpdateBtn.id.split('__');
      // console.log(target);
      MAIN.update_post(target[1]);
    })
  }

  export function submit_update_posting() { //수정창 제출 함수
    const submit_update_posting_btn = document.querySelector('[id^="updateSubmitPost__"]');
    // console.log(submit_update_posting_btn);
  
    submit_update_posting_btn.addEventListener('click', async function () {
      const target = submit_update_posting_btn.id.split('__')[1];
      const update_subject = document.querySelector('.update_subject');
      const update_article = document.querySelector('.update_article');
      const token = sessionStorage.getItem('access_token');
      if (token === null) alert('로그인을 먼저 해주세요');
      else {
        const image_data = MAIN.INPUT_DATA_FILE.return_files(); //저장한 이미지 데이터 반환
        // console.log(image_data);
        let data = {
          'subject': update_subject.value,
          'content': update_article.value,
          'id': target
        };
        await FETCH.fetch_update(target, data); //텍스트업로드
        if (image_data !== null) await FETCH.fetch_upload(target, image_data); // 이미지 업로드
      }
      const hashValue = location.hash.split('#');
      MAIN.load_postinfo(hashValue); //해당 게시글 재조회
    })
  }

  export function add_img_drag_drop() { //drag&drop

    const drop_zone = document.getElementById('drag_drop'); //드레그&드롭 드롭존 태그
  
    drop_zone.addEventListener('dragenter', function (event) { //드래그 드롭존위에서 점선표시
      drop_zone.style.cssText = "border: 3px dashed gray;";
    });
  
    drop_zone.addEventListener('dragleave', function (event) { //드래그 드롭존 밖에서  점선제거
      drop_zone.style.cssText = "border: border: 3px dashed lightgray;";
  
    });
    drop_zone.addEventListener('dragover', function (event) {
      event.preventDefault(); // 이 부분이 없으면 ondrop 이벤트가 발생하지 않습니다.
      drop_zone.style.cssText = "border: 3px dashed gray;";
    });
  
    drop_zone.addEventListener('drop', function (event) {
      event.preventDefault(); // 이 부분이 없으면 파일을 브라우저 실행해버립니다.
      const data = event.dataTransfer;
      drop_zone.style.cssText = "border: 3px dashed lightgray;";
      INPUT_DATA_FILE.append_file(data.files); //파일 객체에 추가
    });
  }

  export async function add_posting_likes() {
    const posting_likes_btn = document.querySelector('[id^="postinfo_likes_"]');
    // [id^="deletePost__"]
    //파일 제출 버튼 태그
    posting_likes_btn.addEventListener("click", async function () { // 제출 이벤트 리스너
      const token = sessionStorage.getItem('access_token');
      if (token === null) {
        alert('로그인을 먼저 해주세요');
        return null;
      }
      const post_id = posting_likes_btn.id.split('_')[2];
      let like_num = posting_likes_btn.value.split(' ')[1];
      like_num *= 1; //*= 형변환 int
      const check = await MAIN.add_likes('post', post_id);
      if (check == true) {
        posting_likes_btn.value = `추천 ${like_num+1}`;
      } else if (check == 403) { //자신의 글일때
        alert('본인이 작성한 글은 추천할수 없습니다!');
      } else if (check == 400) { //이미추천한글일때
        alert('이미 추천한 글입니다.');
      }
    });
  }

  export function add_posting_report() {
    const report = document.querySelector("#btn_postinfo_report");
    //파일 제출 버튼 태그
    report.addEventListener("click", async function () { // 제출 이벤트 리스너
  
      const token = sessionStorage.getItem('access_token');
      if (token === null) {
        alert('로그인을 먼저 해주세요');
        return null;
      }
  
      const post_id = location.hash.split('#')[3];
      const check = await MAIN.add_report('post', post_id);
  
      if (check == true) {
        alert('신고가 접수 되었습니다.')
      } else if (check == 403) { //자신의 글일때
        alert('유효하지 않은 토큰입니다. ');
      } else if (check == 409) { //이미추천한글일때
        alert('이미 신고한 글입니다.');
      }
    });
  }

  //========댓글========//
  export function submit_comment() {
    const commentBtn = document.querySelector('[id^="comment_id_"]');
    //파일 제출 버튼 태그
    commentBtn.addEventListener("click", async function () { // 제출 이벤트 리스너
      const token = sessionStorage.getItem('access_token');
      if (token === null) {
        alert('로그인을 먼저 해주세요');
        return null;
      }
      const post_id = event.currentTarget.id.split('_')[2];
      await MAIN.input_comment(post_id);
      const footer = document.querySelector('.footer').offsetTop;
      window.scrollTo({
        top: footer,
        behavior: 'smooth'
      });
    });
  }

  export function delete_comment() {
    const comment_del_btn = document.querySelectorAll('[id^="deleteComment__"]');
    for (let i = 0; i < comment_del_btn.length; i++) {
      comment_del_btn[i].addEventListener('click', function () {
        const confirmflag = confirm("삭제하시겠습니까?");
        const comment_id = comment_del_btn[i].id.split('__')[1];
        if (confirmflag) MAIN.delete_comment(comment_id);
      })
    }
  }

  export function update_comment() {
    const comment_update_btn = document.querySelectorAll('[id^="updateComment__"]');
    for (let i = 0; i < comment_update_btn.length; i++) {
      comment_update_btn[i].addEventListener('click', function () {
        const comment_id = comment_update_btn[i].id.split('__')[1];
        console.log(comment_id);
        MAIN.update_comment(comment_id);
      });
    }
  }

  export const submit_update_comment = () => {
    const comment_update_submit_btn = document.querySelector('[id^="updateCommentSubmit__"]');
    console.log(comment_update_submit_btn);
    comment_update_submit_btn.addEventListener('click', async function () {
      const comment_id = comment_update_submit_btn.id.split('__')[1];
      MAIN.update_commentSubmit(comment_id);
    });
  }

  export function add_comment_likes() {
    const commentLikeBtn = document.querySelectorAll('[id^="comment_likes_"]');
    for (let i = 0; i < commentLikeBtn.length; i++) {
      commentLikeBtn[i].addEventListener('click', async function () {
        const token = sessionStorage.getItem('access_token');
        if (token === null) {
          alert('로그인을 먼저 해주세요');
          return null;
        }
        const comment_id = commentLikeBtn[i].id.split('_')[2];
        let like_num = commentLikeBtn[i].value.split(' ')[1];
        like_num *= 1; //*= 형변환 int
        const check = await MAIN.add_likes('comment', comment_id);
        if (check == true) {
          commentLikeBtn[i].value = `추천 ${like_num+1}`;
        } else if (check == 403) { //자신의 글일때
          alert('본인이 작성한 글은 추천할수 없습니다!');
        } else if (check == 400) { //이미추천한글일때
          alert('이미 추천한 글입니다.');
        }
      });
    }
  }

  export function add_comment_report() {
    const commentReportBtn = document.querySelectorAll('[id^="comment_report_"]');
    for (let i = 0; i < commentReportBtn.length; i++) {
      commentReportBtn[i].addEventListener('click', async function () {
        const token = sessionStorage.getItem('access_token');
        if (token === null) {
          alert('로그인을 먼저 해주세요');
          return null;
        }
        const comment_id = commentReportBtn[i].id.split('_')[2];
        const check = await MAIN.add_report('comment', comment_id);
        if (check == true) {
          alert('신고가 접수 되었습니다.')
        } else if (check == 403) { //자신의 글일때
          alert('유효하지 않은 토큰입니다. ');
        } else if (check == 409) { //이미추천한글일때
          alert('이미 신고한 글입니다.');
        }
      });
    }
  }