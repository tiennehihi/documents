// function random() {
//     console.log(Math.random())
// }
// random.call()

// const teacher = {
//     firstName: 'Sơn',
//     lastName: 'Đặng'
// }
// const me = {
//     firstName: 'Vũ',
//     lastName: 'Tiến',
//     showFullName() {
//         console.log(`${this.firstName} ${this.lastName}`)
//     }
// }
// me.showFullName.call(teacher)


// 'use strict'
// this.firstName = 'Vũ'
// this.lastName = 'Tiến'
// function showFullName() {
//     console.log(`${this.firstName} ${this.lastName}`)
// }
// showFullName.call(this)


// function Animal(name, weigth) {
//     this.name = name
//     this.weigth = weigth
// }
// function Chicken(name, weigth, legs) {
//     Animal.call(this, name, weigth)
//     this.legs = legs
// }
// const sonDang = new Chicken('Sơn Đặng', 66, 2)
// console.log(sonDang)


// function logger() {
//     // console.log(...arguments)
//     Array.prototype.forEach.call(arguments, item => {
//         console.log(item)
//     })
//     // gọi method call() ở forEach, forEach là 1 method trong đó đang dùng 'this' để lấy mảng 
//     // dùng call() bind 'this' là arguments thế nên từ khóa 'this' sẽ lấy arguments làm mảng và nó lặp qua

//     const cars = ['BMW', 'Porsche']
//     cars.forEach(car => {
//         console.log(car)
//     })
//     // trong forEach sẽ có this, và nó trỏ ra cars để loop các phần tử trong cars
// }

// logger(1,2,3,4,5)


function logger() {
    // console.log(Array.prototype.slice.call(arguments))
    const arr = Array.prototype.slice.call(arguments)
    console.log(arr)
    arr.forEach(item => console.log(item))

    // const arr = Array.from(arguments)
    // const arr = [...arguments]
}
logger(1,2,3,4,5)