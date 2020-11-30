import * as COMPONENT_REPORT from '/static/js/components/management/report.js';
import * as API_REPORT from '/static/js/api/management/report.js';

const report_management_btn = document.querySelector('.report_management_btn');
report_management_btn.addEventListener('click', () => {
	document.querySelector('.board_management_container').style.display = 'none';
	document.querySelector('.report_management_container').style.display = 'block';
	document.querySelector('.user_management_container').style.display = 'none';
	report_management_container_init();
})

function report_management_container_init() {

	API_REPORT.get_all_report_post();

	const report_select_menu = document.querySelector('#report_select_menu');
	report_select_menu.addEventListener('change', () => {
		const selected_value = report_select_menu.options[report_select_menu.selectedIndex].value;
		if (selected_value === 'post') {
			API_REPORT.get_all_report_post();
		} else {
			API_REPORT.get_all_report_comment();
		}
	})
}

function view_report_list(type, report_list) {

	// 체크 리스트 삭제 버튼 리스너 초기화를 위한 재생성 => 리스너 삭제로 리팩토링
	const report_menus = document.querySelector('#report_menus');
	report_menus.removeChild(report_menus.lastElementChild);
	const report_check_del_btn = document.createElement('button');
	report_check_del_btn.classList.add('report_check_del_btn', 'plus_btn');
	report_check_del_btn.innerText = '체크 리스트 삭제';
	report_menus.append(report_check_del_btn);

	const reports_container = document.querySelector('.reports');
	reports_container.innerHTML = '';

	report_list.forEach(report => reports_container.append(COMPONENT_REPORT.create_report_div(report,type)));

	report_all_check_btn_listener_init();
	checked_report_delete_btn_listener_init(type);

}

function report_all_check_btn_listener_init() {

	const report_all_check_btn = document.querySelector('.report_check_first');
	report_all_check_btn.addEventListener('change', () => {
		const all_checkbox = document.querySelectorAll('#report_check');
		if (report_all_check_btn.checked) all_checkbox.forEach(check => check.checked = true);
		else all_checkbox.forEach(checkbox => checkbox.checked = false);
	})

}

function checked_report_delete_btn_listener_init(type) {

	document.querySelector('.report_check_del_btn').addEventListener('click', () => {
		const all_checkbox = document.querySelectorAll('#report_check');
		const checked_id_list = [];
		all_checkbox.forEach(checkbox => {
			if (checkbox.checked) checked_id_list.push({
				'id': checkbox.value
			});
		});
		// 체크된 신고리스트가 하나라도 있다면 삭제 API 호출
		if (checked_id_list.length) API_REPORT.delete_report(type, checked_id_list);

		const report_check_first = document.querySelector('.report_check_first');
		report_check_first.checked = false;
	});

}

export {
	view_report_list
};