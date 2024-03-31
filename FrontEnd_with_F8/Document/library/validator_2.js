function Validator(formSelector) {
    var _this = this;
    var formRules = {};

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            } else {
                element = element.parentElement;
            }
        }
    }

    /** Quy ước tạo rules
     * - Nếu có lỗi thì return errorMessage
     * - Nếu không có lỗi thì return undefined
     */
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Mật khẩu phải tối thiểu ${min} kí tự`
            }
        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Mật khẩu tối đa ${max} kí tự`
            }
        }
    }
    
    // Lấy ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector)

    // Chỉ xử lý khi có element trong DOM
    if(formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        // console.log(inputs)
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules) {
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');
                
                if(isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0]
                }

                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if(Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // Lắng nghe sựu kiện để Validate (blur, change, ...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // Hàm thực hiện Validate
        function handleValidate(event) {
            // console.log(formRules[event.target.name])
            var rules = formRules[event.target.name];

            var errorMessage;

            for(var rule of rules){
                errorMessage = rule(event.target.value)
                if(errorMessage)    break;
            }
            
            // Nếu có lỗi thì hiển thị message lỗi
            if(errorMessage) {
                var formGroup = getParent(event.target, '.form-group')

                // if(!formGroup)  return;

                if(formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }

        // hàm clear message lỗi
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group')

            // Kiểm tra xem có class 'invalid' không
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
    }

    // _this.onSubmit();
    // Xử lý hành vi submit form
    formElement.onsubmit = function(event) {
        event.preventDefault();

        // console.log(_this)

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;

        for(var input of inputs) {
            if(!handleValidate({ target: input })) {
                isValid = false;
            }
        }

        // Khi không có lỗi thì submit form
        if(isValid) {
            if(typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                var formValues = Array.from(enableInputs).reduce(function(values, input){
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
                
                // Gọi lại hàm onSbmit và trả về kèm giá trị của form
                _this.onSubmit(formValues);
            } else {
                formElement.submit();
            }
        }
    }
    
    // console.log(formRules)
}