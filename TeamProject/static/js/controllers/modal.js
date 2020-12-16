export function create_modal(MODAL) {

  const modal_container = document.querySelector('#modal_container');
  modal_container.innerHTML = MODAL;

  show_modal(modal_container);

  const exit_btn = document.querySelector('.manager_exit');
  exit_btn.addEventListener('click', () => {
    modal_container.innerHTML = '';
  })

  return modal_container;
}

function show_modal(container) {
  const modal = container.firstElementChild.firstElementChild;
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.style.transform = 'translateY(0%) translateX(0%) rotateX(0deg)';
  }, 50);
}
