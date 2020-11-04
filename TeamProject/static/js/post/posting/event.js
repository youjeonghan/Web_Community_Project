//=============== list page에서 게시글 작성까지 ===============//
export function posting_input_btn() {
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

export function posting_input_off_btn() {
    REND.render_inputOff();
    posting_input_btn();
}

export function posting_submit_btn() {
    const submit = document.getElementById('button_submit');
    submit.addEventListener('click', async function () {
        const post = await MAIN.submit_post();
        const image_data = MAIN.INPUT_DATA_FILE.return_files();
        if (image_data !== null) await FETCH.fetch_upload(post.post_id, image_data);
        await location.reload();
    });
}

export function posting_upload_file_btn() {
    const input = document.querySelector('.file_input').querySelector('input');
    input.addEventListener('change', function () { //파일 미리보기 이벤트 리스너
        MAIN.INPUT_DATA_FILE.append_file(input.files);
    });
}

export function posting_upload_file_delete() {
    const ele = document.querySelectorAll('.previewimageItem_button');
    for (const value of ele) {
        value.addEventListener('click', function () { //이미지 업로드시 파일 지우기
            const index = event.currentTarget.id.split('__')[1];
            MAIN.INPUT_DATA_FILE.delete_file(index);
        });
    }
}