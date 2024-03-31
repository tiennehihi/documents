// function createCounter() {
//     let counter = 0;
//     function increate() {
//         return ++counter
//     }
//     return increate
// }
// const counter1 = createCounter()

// console.log(counter1())
// console.log(counter1())
// console.log(counter1())



// function createLogger(namespace) {

//     function logger(message) {
//         console.log(`[${namespace}] ${message}`)
//     }
//     return logger
// }

// // ============== APP ==============

// // register.js
// const infoLogger = createLogger('Info')
// infoLogger('Bắt đầu gửi mail')
// infoLogger('Gửi mail lỗi lần 1, thử gửi lại...')
// infoLogger('Gửi mail thành công cho user xxx')

// // Forgot pasword
// const errorLogger = createLogger('Error')
// errorLogger('Email không tồn tại trong DB')
// errorLogger('Gửi mail lỗi lần 1, thử gửi lại...')
// errorLogger('Gửi mail thành công cho user xxx')



// function createStorage(key) {
//     const store = JSON.parse(localStorage.getItem(key)) ?? {}

//     const save = () => {
//         localStorage.setItem(key, JSON.stringify(store))
//     }

//     const storage = {
//         get(key) {
//             return store[key]
//         },
//         set(key, value) {
//             store[key] = value
//             save()
//         },
//         remove(key) {
//             delete store[key]
//             save()
//         }
//     }
//     return storage
// }
// // profile.js
// const profileSetting = createStorage('profile_setting')

// console.log(profileSetting.get('fullName'))

// profileSetting.set('fullName', 'Vu Tien')
// profileSetting.set('age', 20)
// profileSetting.set('address', 'Ninh Binh')


// const profileSetting2 = createStorage('profile_setting_2')

// console.log(profileSetting2.get('fullName'))

// profileSetting2.set('fullName', 'Son Dang')
// profileSetting2.set('age', 20)
// profileSetting2.set('address', 'Ha Noi')



// function createApp() {
//     const cars = [];
//     return {
//         add(car) {
//             cars.push(car)
//         },
//         show() {
//             console.log(cars)
//         }
//     }
// }
// const app = createApp()

// app.show()
// app.add('BMW')
// app.show()
// app.add('Mercerdes')
// app.add('Porsche')
// app.add('Ferari')
// app.show()


function a(x) {
    x++;
    return function () {
        console.log(++x);
    };
}

a(1)();
a(1)();
a(1)();

let x = a(1);
x();
x();
x();
