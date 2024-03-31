const modal = document.querySelector('.js-modal');
const modalContainer = document.querySelector('.js-modal-container');
const modalClose = document.querySelector('.js-modal-close');
const buyBtns = document.querySelectorAll('.js-buy-ticket');
const payBtn = document.querySelector('#buy-ticket');

// Hiển thị phần mua vé
function showBuyTickets() {
    modal.classList.add('open')
}

// Đóng modal
function hideBuyTickets() {
    modal.classList.remove('open')
}

// Tạo ra 1 biến buyBtn để lưu 3 cái nút buy
for (const buyBtn of buyBtns) {
    buyBtn.addEventListener('click', showBuyTickets);
}

modalClose.addEventListener('click', hideBuyTickets);
modal.addEventListener('click', hideBuyTickets);
modalContainer.addEventListener('click', function (e) {
    e.stopPropagation();
})
payBtn.addEventListener('click', hideBuyTickets);