// const teacher = {
//     firstName: 'Minh',
//     lastName: 'Thu',
// }
// function greet(greeting, message) {
//     return `${greeting} ${this.firstName} ${this.lastName}. ${message}`
// }
// let result = greet.apply(teacher, ['Em chào cô', 'Cô dạy môn gì thế ạ? (Đã xem cô livestream 1 tiếng)'])
// console.log(result)

// // So sánh với call method
// result = greet.call(teacher, 'Em chào cô', 'Cô dạy môn gì thế ạ? (Đã xem cô livestream 1 tiếng)')
// console.log(result)



// const teacher = {
//     firsName: 'Minh',
//     lastName: 'Thảo',
//     isOnline: false,
//     goOnline() {
//         this.isOnline = true;
//         console.log(`${this.firsName} ${this.lastName} is Online`)
//     },
//     goOffline() {
//         this.isOffline = false;
//         console.log(`${this.firsName} ${this.lastName} is Offline`)
//     }
// }

// const me = {
//     firsName: 'Vũ',
//     lastName: 'Tiến',
//     isOnline: false,
// }

// console.log('teacher: ', teacher.isOnline)
// teacher.goOnline()
// console.log('teacher: ', teacher.isOnline)
// console.log('--------------------')
// console.log('me: ', me.isOnline)
// teacher.goOnline.apply(me)
// console.log('me: ', me.isOnline)



function Animal(name, weight) {
    this.name = name
    this.weight = weight
}
// function Parrot(name, weight) {
//     Animal.apply(this, [name, weight])
//     this.speak = function () {
//         console.log('Nhà có khách!')
//     }
// }
function Parrot() {
    Animal.apply(this, arguments)
    this.speak = function () {
        console.log('Nhà có khách!')
    }
}
const conVet = new Parrot('Vẹt', 300)
console.log(conVet)
// conVet.speak()


function fn() {
    // bind
    fn.bind()

    // call
    fn.call()

    // apply
    fn.apply()
}


function fn() {
    console.log(fn.bind === Function.prototype.bind)
    console.log(fn.call === Function.prototype.call)
    console.log(fn.apply === Function.prototype.apply)
}
fn();