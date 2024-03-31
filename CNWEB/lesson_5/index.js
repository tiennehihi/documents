// a là biến toàn cục global scope
// var a = 10

// if (1==1) {
//     var a = 20
// }
// console.log(a)



// b là biến block scope
// let b = 10
// if (1==1){
//     console.log(b)
// }



// Function
// 1. Function declaration
// Hoisting
// function capitalize() {

// }

// 2. Function Expression
// const capitalize = function() {

// }

// const split = function(capitalize) {

// }

// 3. Arrow function
// functional programming
// const capitalize = () => {
//     // this đại diện cho đối tượng gọi hàm này
//     // this không dùng được cho arrow func
// }




// STRING
// Có 4 cách tạo string trong js
const str = `Hi all students`
const str2 = new String("Hi all students")

// property
console.log(str.length)

// method
// console.log(str.toUpperCase())
console.log(str.charAt(0))
console.log(str.indexOf("s"))
console.log(str.indexOf("students"))