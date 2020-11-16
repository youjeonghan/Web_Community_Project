export function create_modal(MODAL){
    
    const modal_container = document.querySelector('#modal_container');
    modal_container.innerHTML = MODAL;

    const modal  = modal_container.firstElementChild.firstElementChild;
	setTimeout(() => {
		modal.style.opacity = '1';
		modal.style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
    }, 50);
    
    const exit_btn = document.querySelector('.manager_exit');
    exit_btn.addEventListener('click', () => {
		modal_container.innerHTML = '';
    })

    return modal_container;
}

export function show(container) {
    const modal  = container.firstElementChild.firstElementChild;
	setTimeout(() => {
		modal.style.opacity = '1';
		modal.style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
	}, 50);
}

export function exit_listener_init(container, exit_btn) {
	exit_btn.addEventListener('click', () => {
		container.innerHTML = '';
    })
}