import modal from "./modify_board";

const modal = `<div class='board_modal_back manager_modal_back'>
	<div class='board_modal manager_modal'>
		<div class='board_exit manager_exit'>X</div>
		<div>
			<div class='modal_title'>게시판 추가</div>
			<div class='modal_sub_container'>
				<span class='modal_sub'>이름</span> 
        		<input type='text' class='board_insert_name modal_input' placeholder='게시판 이름' maxlength='12'>
			</div>
			<div class='modal_sub_container'>
				<span class='modal_sub'>설명</span> 
				<input type='text' class='board_insert_description modal_input' placeholder='게시판 설명'>
			</div>
			<div class='modal_sub_container'>
        		<span class='modal_sub'>사진</span>
        		<input type='file' class='board_insert_image modal_input' accept='image/*'>
    		</div>
			<button class='board_insert_btn modal_btn'>추가</button>
		</div>
	</div>
    </div>`;
    
export default modal;