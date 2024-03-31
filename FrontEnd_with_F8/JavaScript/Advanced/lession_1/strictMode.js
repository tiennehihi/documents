'use strict';
const student = {}

Object.defineProperty(student, 'fullName', {
    value: 'Vu Duc Tien',
    writable: true,
    // Mặc định writable se là false nhưng chúng ta có thể thay đổi thành true
    // Khi false thì ko thể thay đổi giá trị fullName và sẽ báo lỗi
})

student.fullName = 'Nguyen Van B'
console.log(student)


function sum(a, a) {
    return a + a
}
console.log(sum(6, 9))  // output: 18
// Khi khai báo biến trùng tên thì biến sau sẽ ghi đè
// Trong trường hợp này nếu sử dụng 'use strict' thì sẽ báo lỗi