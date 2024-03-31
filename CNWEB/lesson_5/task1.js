// const str = "this is Test"
// const str1 = "hello a"
// console.log(str.charAt(0).toUpperCase().concat(str.substr(1)))
// console.log(str1.charAt(0).toUpperCase().concat(str1.substr(1)))

const capitalizeCharFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1)

console.log(capitalizeCharFirst("this is Test"))
console.log(capitalizeCharFirst("hello a"))