import * as API_REPORT from '/static/js/api/management/report.js';
import * as MODAL from '/static/js/controllers/modal.js';
import ADD_USER_BLACKLIST_MODAL from '/static/js/components/modal/add_user_blacklist.js';

export function create_report_div(report, type){
	const created_report_div = document.createElement('div');
	created_report_div.classList.add('report');
	
	created_report_div.innerHTML = create_report_info(report, type);

	// 리포트 버튼들의 클래스를 배열로 묶어 선언해놓는다. 중복사용 될 예정이므로 선언
	const report_btn_classes = ['report_btn', 'r_item'];

	// 생성한 버튼 3개를 div에 넣어준다.
	created_report_div.append(create_report_blacklist_btn(report, type, report_btn_classes));
	created_report_div.append(create_report_delete_btn(report, type, report_btn_classes));
	created_report_div.append(create_report_cancel_btn(report, type, report_btn_classes));

	return created_report_div;
}

function create_report_info(report, type){
	
	let created_report_info;

	if (type === 'post') {
		created_report_info = `<input type='checkbox' class='r_item' id='report_check' value='${report.id}'>
		<span class='r_item'>${report.report_num}</span>
		<span class='r_item'>${report.nickname}</span>
		<span class='r_item report_title'>${report.subject}</span>
		<span class='r_item'>${report.create_date}</span>`
	} else {
		created_report_info = `<input type='checkbox' class='r_item' id='report_check' value='${report.id}'>
		<span class='r_item'>${report.report_num}</span>
		<span class='r_item'>${report.nickname}</span>
		<span class='r_item report_title'>${report.content}</span>
		<span class='r_item'>${report.create_date}</span>`
	}

	return created_report_info;
}

function create_report_blacklist_btn(report, type, report_btn_classes) {
	// 해당 신고 작성 회원 정지 버튼 생성
	const created_report_blacklist_btn = document.createElement('button');
	created_report_blacklist_btn.classList.add(...report_btn_classes);
	created_report_blacklist_btn.id = 'report_blacklist_btn';
	created_report_blacklist_btn.innerText = '회원 정지';
	created_report_blacklist_btn.addEventListener('click', () => {

		MODAL.create_modal(ADD_USER_BLACKLIST_MODAL);

		// 모달에서 정지 버튼 클릭 시 해당 회원 정지 FetchAPI 호출
		document.querySelector('.blacklist_btn').addEventListener('click', () => {
			const blacklist_date_select = document.querySelector('.blacklist_option');
			const punishment_date = blacklist_date_select.options[blacklist_date_select.selectedIndex].value;
			API_REPORT.add_user_blacklist(report.userid, punishment_date, type, report.id);
		});
	})

	return created_report_blacklist_btn;
}

function create_report_delete_btn(report, type, report_btn_classes) {

	const created_report_del_btn = document.createElement('button');
	created_report_del_btn.classList.add(...report_btn_classes);
	created_report_del_btn.id = 'report_del_btn';
	if (type == 'post') {
		created_report_del_btn.innerText = '게시글 삭제';
		created_report_del_btn.addEventListener('click', () => {
			if (confirm('해당 게시글 삭제 시 댓글도 함께 삭제됩니다.\n정말로 삭제하시겠습니까?')) {
				API_REPORT.delete_report(type, [{
					'id': report.id
				}]);
			} else return;
		});
	} else {
		created_report_del_btn.innerText = '댓글 삭제';
		created_report_del_btn.addEventListener('click', () => {
			if (confirm('해당 댓글 삭제 시 "삭제된 댓글입니다." 문구로 대체됩니다.\n정말로 삭제하시겠습니까?')) {
				API_REPORT.delete_report(type, [{
					'id': report.id
				}]);
			} else return;
		});
	}

	return created_report_del_btn;
}

function create_report_cancel_btn(report, type, report_btn_classes) {

	const created_report_calcel_btn = document.createElement('button');
	created_report_calcel_btn.classList.add(...report_btn_classes);
	created_report_calcel_btn.id = 'report_cancel_btn';
	created_report_calcel_btn.innerHTML = `<i class='fas fa-check'></i>`;
	created_report_calcel_btn.addEventListener('click', () => {
		if (confirm('신고 처리 시 해당 신고글이 신고리스트에서 삭제됩니다.\n정말로 삭제하시겠습니까?') == true) {
			// 해당 신고 게시글or댓글의 타입과 아이디를 넘긴다.
			API_REPORT.delete_report_in_reportlist(type, report.id);
		} else return;
	});

	return created_report_calcel_btn;
}