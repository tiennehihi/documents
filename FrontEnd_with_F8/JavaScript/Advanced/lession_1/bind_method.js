// this.firstName = 'Minh'
// this.lastName = 'Thu'
// const teacher = {
//     firstName: 'Minh',
//     lastName: 'Thảo',
//     getFullName(data1, data2) {
//         console.log(data1, data2)
//         return `${this.firstName} ${this.lastName}`
//     }
// }

// Case 1
// console.log(teacher.getFullName())  // Minh Thảo
// Khi chúng ta gọi 1 phương thức thông qua 1 đối tượng thì từ khóa 'this' sẽ trỏ về đúng đối tượng mà chúng ta gọi phương thức đó

// Case 2
// const getTeacherName = teacher.getFullName
// chưa có toán tử gọi hàm nên lúc này nó chưa gọi hàm mà nó chỉ truy cập vào bên trong hàm
// và nó gán function 'getFullName' sang 1 hàm hoặc 1 biến khác
// trong Javascript thì function bản chất nó là 1 object (là dạng tham chiếu) 
// khi gán 1 giá trị tham chiếu cho 1 biến khác thì nó chỉ sao chép vùng nhớ sáng biến kia
// console.log(getTeacherName === teacher.getFullName)
// console.log(getTeacherName())   // Minh Thu
// method chính là function 
// khi gọi hàm không thông qua 1 đối tượng (không có dấu . ở trước) thì 'this' trỏ ra đối tượng global và chọc ra phạm vi window nên ra 'Minh Thu'

// Case 3
// const getTeacherName1 = teacher.getFullName.bind(teacher)
// console.log(getTeacherName1())  // Minh Thảo


// const teacher = {
//     firstName: 'Minh',
//     lastName: 'Thảo',
//     getFullName(data1, data2) {
//         return `${this.firstName} ${this.lastName}`
//     }
// }

// const student = {
//     firstName: 'Vũ',
//     lastName: 'Tiến',
// }

// // const getTeacherName2 = teacher.getFullName.bind(student)
// // console.log(getTeacherName2())  // Vũ Tiến

// const getTeacherName3 = teacher.getFullName.bind(student)
// console.log(getTeacherName3('Tiến', 'DZ'))  // Tiến DZ  ,   Vũ Tiến





// // ============== Thực hành với DOM ==========
// const teacher = {
//     firstName: 'Minh',
//     lastName: 'Thảo',
//     getFullName() {
//         console.log(`${this.firstName} ${this.lastName}`)
//     }
// }
// // teacher.getFullName()
// const button = document.querySelector('button')

// // button.onclick = function () {
// //     teacher.getFullName()
// // }

// button.onclick = teacher.getFullName.bind(teacher)
// // Bản chất teacher.getFullName nó là 1 function nên gán thẳng nó = button.onclick nhưng console.log lại ra undefined 
// // vì khi chúng ta click thì 'this' ở trong onclick nó lại trỏ về 'button' nên không ra cái gi
// // Để lấy được giá trị muốn lấy ta phải dùng hàm bind() và ràng buộc obj 'teacher'




// // ============== Thực hành với DOM 2 ==========
// const $ = document.querySelector
// const $$ = document.querySelectorAll

// console.log(document.querySelector('#heading').innerText)
// // <h1 id="heading">Hello bind() method</h1>
// // Trong method 'selector' đang sử dụng từ khóa 'this', nó sẽ trỏ về object gọi querySelector là 'document' truyền đối số nên sẽ chạy 1 cách đúng đắn

// console.log($('#heading'))
// // Khi chưa có bind() thì lỗi, chúng ta gán cho nó $ thì nó trỏ về object gọi querySelector là 'document' nhưng nó là window
// // Nó bị mất Context, Context sẽ trỏ ra đối tượng global, Context 'this' bên trong sẽ trỏ về window 




// ============== Thực hành với DOM 3 ==========
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const app = (() => {
    const cars = ['BMW']
    const root = $('#root')
    const input = $('#input')
    const submit = $('#submit')

    return {
        add(car) {
            cars.push(car)
        },
        delete(index) {
            cars.splice(index, 1) 
        },
        render() {
            const html = cars.map((car, index) => `
                <li>
                    ${car}
                    <span class="delete" data-index="${index}">&times</span>
                </li>
            `).join('')

            root.innerHTML = html
        },
        handleDelete(e) {
            // console.log(e.target)
            const deleteBtn = e.target.closest('.delete')
            // closest là 1 phương thức của DOM element giúp kiểm tra chính el đó hoặc cha của nó có class đó hay không
            // console.log(deleteBtn);
            if(deleteBtn) {
                const index = deleteBtn.dataset.index
                // console.log(index)
                this.delete(index)
                this.render()
            }
        },
        init() {
            // // Nếu không dùng arrow function thì phải gán this cho 1 biến khác
            // const _this = this
            // submit.onclick = function () {
            //     const car = input.value
            //     _this.add(car)
            //     _this.render()
            // }

            // Vì arrow function không có this nên khi dùng từ khóa this nó sẽ trỏ ra bên ngoài
            submit.onclick = () => {
                const car = input.value
                this.add(car)
                this.render()

                input.value = null      // Khi add xong thì xóa giá trị trong input
                input.focus()       // Tự focus vào input

                
                // const car = input.value.trim()
                // if(car) {
                //     this.add(car)
                //     this.render()

                //     input.value = null      // Khi add xong thì xóa giá trị trong input
                //     input.focus()       // Tự focus vào input
                // } else {
                //     console.log('Lỗi...')
                // }
            }

            root.onclick = this.handleDelete.bind(this)

            // Handle DOM event
            this.render()
        }
    }
})();

app.init()