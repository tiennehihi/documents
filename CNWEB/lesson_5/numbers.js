// ### **Task 1**

// Give 4 numbers `a, b,c and d`. Print maximum and minimum value of the given numbers.

// - **Example**:
//     - For `a = 1; b = 2; c = 3; d = 4;` print `"4 1"`;
// - **Input**: `a, b,c and d`
// - **Output**: maximum and minimum value of the given numbers.
// const readline = require('readline-sync');
// for (let i=0; i < 4; i++) {
//     const number = parseFloat(readline.question(`So thu ${i+1}: `))
//     numbers.push(number)
// }
const numbers = [1, 4, 5, 2]
// for (let i=0; i < 4; i++) {
//     const number = parseFloat(prompt(`So thu ${i+1}: `))
//     numbers.push(number)
// }
// const max = Math.max(...numbers)
// const min = Math.min(...numbers)
let max = numbers[0]
let min = numbers[0]
for (const num of numbers) {
    if (num > max) max = num
    else if (num < min) min = num
}
console.log("max: " + max, "\nmin: " + min)










// ### **Task 2**

// Give a number n. Write a JavaScript function to test if a number is a power of 2

// - **Example**:
//     - For `n = 16;` print `true`
//     - For `n= 18;` print `false`
// - **Input**: n
// - **Output**: `true` or `false`. true if number is a power of 2
function isPowerOfTwo(n) {
    if(n <= 0) {
        return false
    }
    while(n > 1){
        if(n % 2 !== 0) return false;
        n = n/2
    }
    return true;
}

console.log(isPowerOfTwo(16))
console.log(isPowerOfTwo(18))