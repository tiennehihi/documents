// HTML DOM là viết tắt của Document Object Model

// Gồm 3 thành phần:
/**
 * 1. Element : là thẻ tag trong file html
 * 2. Attribute : là các thuộc tính trong các thẻ tag
 * 3. Text : là phần tử của DOM
 */

// 1. HTML DOM
// Là quy chuẩn mô tả mô hình của các thành phần trong tài liệu HTML được đưa ra bởi W3C.

// 2. DOM API
// Là bộ API nằm trong Web API có mặt trên những môi trường hỗ trợ duyệt web - như trên trình duyệt. 
// DOM API cung cấp các đối tượng và phương thức hỗ trợ truy xuất, chỉnh sửa các đối tượng / thành phần trong DOM.



// 1. Element : là thẻ tag trong file html
// ID, Class, Tag, CSS selector, html collection


// 2. Attribute : là các thuộc tính trong các thẻ tag
// 3. Text : là phần tử của DOM


// var headingNode = document.getElementById('heading')        // ID
// var headingNodes = document.getElementsByClassName('heading')       // Class
// var headingNodes = document.getElementsByTagName('h1')      // Tag
// var headingNode = document.querySelector('.heading-2')        // CSS selector
// var headingNodes = document.querySelectorAll('html .box .heading-2')        // CSS selector => Lấy tất cả các phần tử
// var headingNode = document.querySelector('html .box .heading-2')        // CSS selector
// var headingNode = document.querySelector('.box .heading-2:first-child')        // CSS selector => lấy ra thằng con đầu tiên
// var headingNode = document.querySelector('.box .heading-2:nth-child(2')        // CSS selector => lấy ra thằng con thứ 2
// console.log(headingNode)
// console.log({
//     element: headingNodes
// })


// console.log({
//     element: document.forms['form-1']
// })
// console.log(document.anchors)


// var listItemNodes = document.querySelectorAll('.box-1 li')   
// select tất cả các thẻ li thuộc box-1
// console.log(listItemNodes)


// var boxNode = document.querySelector('.box-1');
// // Công việc 1: sử dụng tới boxNode (trường hợp chỉ cần dùng tới .box-1)
// // ....
// console.log({
//     element: boxNode
// })

// // Công việc 2: sử dụng tới các li là con của `.box-1`
// console.log(boxNode.querySelectorAll('li'));
// console.log(boxNode.getElementsByTagName('li'));
// console.log(boxNode.querySelector('p'));




// 1. getElementById
// 2. getElementsByClassName
// 3. getElementsByTagName
// 4. querySelector
// 5. querySelectorAll
// 6. HTML collection
// 7. document.write

// chỉ 1 và 4 mới selec được trực tiếp Element

// var headings = document.querySelectorAll('.heading')
// for(var i=0; i < headings.length; i++) {
//     console.log(headings[i])
// }

// console.log(document.forms['form-1'])


// DOM Attributes

// seter 
// var headingElement = document.querySelector('h1')
// headingElement.title = 'heading'
// headingElement.id = 'id_heading'
// headingElement.className = 'class_heading'

// var aElement = document.querySelector('a')
// aElement.href = 'tienne.info'

// console.log(aElement)


// headingElement.setAttribute('class', 'heading')



// Get value of Attributes
// console.log(headingElement.getAttribute('class'))
// headingElement.title = 'title-test'
// console.log(headingElement.getAttribute('title'))




// innerText, textContent (lấy text)
// textContent lấy ra nội dung thực trong DOM (nguyên bản textNode vd: khoảng trắng, xuống dòng)
// innerText trả lại giống như những gì nhìn thấy trên trình duyệt
// cả 2 thẻ đều không lấy ra thẻ tag, nhưng textContent lấy ra tất cả những nội dung trong thẻ tag

// var headingElement = document.querySelector('.heading')

// headingElement.innerText = 'New heading'  // Thay đổi text

// console.log(headingElement.innerText)
// console.log(headingElement.textContent)




// innerHTML

// innerHTML giúp chúng ta thêm được elementNode, textNode, attributeNode...
// Ghi đè vào các thẻ html có trong class
// var boxElement = document.querySelector('.box')
// boxElement.innerHTML = '<h1 title="heading">New heading</h1>'
// console.log(boxElement.innerHTML)

// console.log(document.querySelector('h1').innerText)


// outerHTML 
// ghi đè lên chính thẻ chứa class
// console.log(boxElement.outerHTML)   // (lấy từ chính vi trí querySelector)

// console.log([boxElement])




/** DOM CSS */
// var boxElement = document.querySelector('.box')
// boxElement.style.width = '100px'
// boxElement.style.height = '200px'
// boxElement.style.backgroundColor = 'green'

// Object.assign(boxElement.style, {
//     width: '200px',
//     height: '200px',
//     backgroundColor: 'green'
// })
// console.log(boxElement.style.backgroundColor)





// classList property

/**
 * add      => thêm class
 * contains     => kiểm tra xem class có tồn tại hay không
 * remove       => xóa class
 * toggle       => khi thực thi code sẽ kiểm tra xem có class đó hay không, nếu có thì gỡ class đó và nếu không có thì thêm vào
 */
// var boxElement = document.querySelector('.box')
// console.log(boxElement.classList)
// console.log(boxElement.classList[0])
// console.log(boxElement.classList.length)
// console.log(boxElement.classList.value)

// boxElement.classList.add('red')

// console.log(boxElement.classList.contains('red'))

// setInterval(() => {
//     for(var i=0; i < 3; i++){
//         boxElement.classList.toggle('red');
//         boxElement.classList.toggle('green');
//     }
// }, 1000)




// DOM EVENTS
// 1. Attrtbute events
// 2. Assign event using the element node

// var h1Element = document.querySelector('h1')
// console.log(h1Element)

// h1Element.onclick = function() {
//     console.log(Math.random() * 100)
// }

// 1. input / select
// 2. Key up / down

// var inputValue;
// var inputElement = document.querySelector('input[type="text"]')
// // onchange : khi value bị thay đổi lấy ra giá trị của nó, onchange sẽ hoạt động khi bỏ focus ra ngoài
// // oninput : khi value bị thay đổi tới đâu thì lấy giá trị ra tới đó
// inputElement.oninput = function(e) {
//     inputValue = e.target.value
// }

// var inputElement = document.querySelector('input[type="checkbox"]')
// inputElement.onchange = function(e) {
//     console.log(e.target.checked)
// }

// var inputElement = document.querySelector('select')
// inputElement.onchange = function(e) {
//     console.log(e.target.value)
// }


// keydown khi nhấc lên mới thực hiện nên bị chậm 1 bước, keyup khi nhấc lên là thực hiện luôn
// var inputElement = document.querySelector('input[type="text"]')
// inputElement.onkeydown = function(e) {  // onkeyup, onkeypress
//     switch(e.which) {
//         case 27:
//             console.log('EXIT')
//             break;
//         case 13:
//             console.log('SEND CHAT');
//             break;
//     }
// }


// 1. preventDefault (ngăn chặn hành vi mặc định)
// 2. stopPropagation (loại bỏ sự kiện nổi bọt)
// document.anchors (trả về thẻ có name), links (lấy tất cả các thẻ a)

// var aElements = document.links

// for (var i=0; i < aElements.length; i++){
//     aElements[i].onclick = function(e) {
//         // nếu chuỗi bắt đầu bằng 'https://f8.edu.vn' thì cho chuyển trang
//         // nếu chuỗi không bắt đầu bằng 'https://f8.edu.vn' thì bỏ đi hành vi mặc định của thẻ a
//         if(!e.target.href.startsWith('https://f8.edu.vn')) {
//             e.preventDefault();
//         }
//     }
// }


// var ulElement = document.querySelector('ul');
// // ngăn chặn hành vi khi chúng ta onmousedown vào thẻ ul, nếu không có thì khi click vào ul sẽ bị mất
// ulElement.onmousedown = function(e) {
//     e.preventDefault();
// }
// ulElement.onclick = (e) => {
//     console.log(e.target)
// }


// document.querySelector('div').onclick = (e) => {
//    console.log('DIV')
// }

// document.querySelector('button').onclick = (e) => {
//     e.stopPropagation(); // ngăn chặn nổi bọt thẻ cha thẻ ông
//     console.log('Click me!')
// }




