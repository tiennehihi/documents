// Đối tượng `Validator`
function Validator(options) {
    // console.log(options)

    // Hàm này để gét ra element con khi có nhiều element cha
    function getParent(element, selector) {
        while(element.parentElement) {
            // Kiểm tra xem element cha có matches với selector hay không 
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorMessage)
        var errorMessage;
        // var errorMessage = rule.test(inputElement.value)
        // input người dùng nhập vào được truyền vào hàm test
        // console.log(errorMessage)

        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector]
        // console.log(rule)
        // console.log(rule.selector)

        // Lặp qua từng rule & kiểm tra
        for(var i=0; i < rules.length; i++){
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            // errorMessage = rules[i](inputElement.value)
            if(errorMessage)    break;  // Nếu có lỗi thì dừng việc kiểm tra
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = '';    // Khi người dùng đã nhập thì gán = chuỗi rỗng
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !errorMessage;  // !! để convert sang boolearn
    }

    // Lấy Element của form cần validate
    var formElement = document.querySelector(options.form)
    // console.log(options.rules)



    if(formElement) {
        // console.log(formElement)

        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true; 

            // Lặp qua từng rule và validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            // console.log(formValues)

            if (isFormValid) {
                // console.log('Không có lỗi')

                // Trường hợp submit với js (onSubmit)
                if(typeof options.onSubmit === 'function') {
                    // var enableInputs = formElement.querySelector('[name]:not([disabled])')
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    // console.log(enableInputs)
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        // values[input.name] = input.value;
                        switch(input.type) {
                            case 'radio':
                                if(!input.matches(':checked')){
                                    values[input.name] = [];
                                    return values;
                                }
                                values[input.name] = formElement.querySelector('input[name="'+ input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    values[input.name] = [];
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                } 
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value

                        }
                        return values;
                    }, {});
                    options.onSubmit(formValues)
                } 
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            } 
            else {
                // console.log('Có lỗi')
            }
        }

        // Xử lý lặp qua mỗi rule và xử lý(lắng nghe sự kiện blur, input...)
        options.rules.forEach(function(rule){
            // console.log(rule.selector)

            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                // Lưu lại các rules trong input
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector)
            // console.log(inputElement)

            Array.from(inputElements).forEach(function(inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                // Xử lý trường hợp khi người dùng đang nhập
                // oninput là 1 event, nó sẽ lọt vào mỗi khi người dùng gõ
                inputElement.oninput = function() {
                    // console.log(inputElement.value)
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorMessage)
                    errorElement.innerText = '';    // Khi người dùng đã nhập thì gán = chuỗi rỗng
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })

            
            // get ra class '.form-message' có cha là element đã get được trong inputElement
            // tức là lấy ra class '.form-message' trong element khi blur ra ngoài ('.form-group')
            // var errorElement = inputElement.parentElement.querySelector('.form-message')
            // if(inputElement) {
            //     // value: inputElement.value
            //     // test func: rule.test

            //     // Xử lý trường hợp blur khỏi input
            //     inputElement.onblur = function() {
            //         // console.log('blur ' + rule.selector)
            //         // console.log(inputElement.value)     // Lấy value người dùng nhập
            //         // console.log(rule)

            //         // var errorMessage = rule.test(inputElement.value)
            //         // // input người dùng nhập vào được truyền vào hàm test
            //         // // console.log(errorMessage)

            //         // if(errorMessage) {
            //         //     errorElement.innerText = errorMessage;
            //         //     inputElement.parentElement.classList.add('invalid')
            //         // } else {
            //         //     errorElement.innerText = '';    // Khi người dùng đã nhập thì gán = chuỗi rỗng
            //         //     inputElement.parentElement.classList.remove('invalid')
            //         // }

            //         validate(inputElement, rule);
                    
            //     }

            //     // Xử lý trường hợp khi người dùng đang nhập
            //     // oninput là 1 event, nó sẽ lọt vào mỗi khi gnuowif dùng gõ
            //     inputElement.oninput = function() {
            //         // console.log(inputElement.value)
            //         var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorMessage)
            //         errorElement.innerText = '';    // Khi người dùng đã nhập thì gán = chuỗi rỗng
            //         getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
            //     }
            // }
        })
        // console.log(selectorRules)
    }
}

// Định nghĩa các rules
// Nguyên tắc của các rules:
// 1. Khi không có value => trả ra message lỗi
// 2. Khi có value => trả về undefined
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này'
            // Nếu ko có .trim() thì khi người dùng nhập mỗi dấu cách thì vẫn hợp lệ
        }
    };
}
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập chính xác email';
        }
    };
}
Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Mật khẩu phải tối thiếu ${min} ký tự`;
        }
    };
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}