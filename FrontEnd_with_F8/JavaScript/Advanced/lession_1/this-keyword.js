// const iPhone7 = {
//     // Thuộc tính - Property
//     name: 'iPhone 7',
//     color: 'Pink',
//     weight: 300,

//     // Phương thức - Method
//     takePhoto(){
//         console.log(this)
//     },
//     objChild: {
//         methodChild() {
//             name: 'Child Object',
//             console.log(this)
//         }
//     }
// }
// console.log(iPhone7.takePhoto());
// // Khi dùng 'this' thì nó chính là iPhone 7 hay nói các khác khi iPhone7 . tới takePhoto() thì 'this' trong đấy chính là iphone7
// iPhone7.objChild.methodChild()
// // Khi này this chính là objChild vì nó nằm ngay trước Method 'this'


// Hàm tạo
function Car(name, color, weigth) {
    this.name = name;
    this.color = color;
    this.weigth = weigth;
    this.run = function() {
        console.log('Running...', this)
    }
    // Khi 1 thuộc tính là 1 hàm và thuộc 1 đối tượng thì sẽ gọi là phương thức
}
Car.prototype.run1 = function() {{
    // console.log(this)
    // Context

    // function test() {
    //     console.log(this)
    //     // this nằm trong hàm chính là window
    // }
    // test()
    
    const test1 = () => {
        console.log(this)
    }
    test1()
}}
// Lưu ý: arrown function không có this nên nó sẽ lấy this ở bên ngoài ngay gần nó tức là lấy context

const mercerdes450 = new Car('Mercerdes s450', 'Black', 1200)
console.log(mercerdes450.run1())


// const button = document.querySelector('button')
// // console.log(button)
// button.onclick = function() {
//     console.log(this)
//     console.dir(this.innerText)
// }