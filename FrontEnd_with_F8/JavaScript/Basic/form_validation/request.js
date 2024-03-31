// Mong muốn khi xử dụng thư viện này 
Validator({
    form: '#form-1',
    errorMessage: '.form-message',
    formGroupSelector: '.form-group',
    rules: [
        Validator.isRequired('#fullname', 'Vui lòng nhập tên đầy đủ'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.isRequired('#password'),
        Validator.minLength('#password', 6),
        Validator.isRequired('#password_confirmation'),
        Validator.isRequired('#province'),
        Validator.isRequired('#avatar'),
        Validator.isRequired('input[name="gender"]'),
        Validator.isConfirmed('#password_confirmation', function() {
            return document.querySelector('#form-1 #password').value;
        }, 'Mật khẩu nhập lại không chính xác')
    ],
    onSubmit: function(data){
        // Call API
        console.log(data)
    }
});