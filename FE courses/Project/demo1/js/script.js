const email = document.getElementById('email');
const cmt = document.getElementById('cmt')
const rate = document.getElementById('rate')
const submit = document.getElementById('submitBtn')

function Validate() {
    // Kiểm tra Email
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(regex.test(email) || email.value === "") {
        alert("Vui lòng nhập đúng địa chỉ email !");
        return false;
    }

    // Kiểm tra cmt
    if(cmt.value === "") {
        alert("Bạn phải ghi lời bình luận!");
        return false;
    } 

    // Kiểm tra rate
    if(isNaN(rate.value) || rate.value < 0 || rate.value === "") {
        alert("Đánh giá sai! Vui lòng nhập số nguyên")
        return false;
    }
}

submit.addEventListener('click', function(e) {
    if(!Validate()) {
        e.preventDefault();
    }
})