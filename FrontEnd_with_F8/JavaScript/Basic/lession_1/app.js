// // 1. Event listenner (lắng nghe các sựu kiện xảy ra trong DOM) 
// // Xử lý nhiều việc khi 1 event xảy ra
// // Lắng nghe / hủy bỏ lắng nghe

// var btn = document.getElementById('btn');

// btn.onclick = (e) => {
//     // việc 1
//     console.log('Việc 1')

//     // việc 2
//     console.log('Việc 2')

//     // việc 3
//     alert('Việc 3')
// }

// setTimeout(function() {
//     btn.onclick = () => {}
// }, 3000)




// btn.addEventListener('click', () =>{
//     console.log('Event 1')
// })
// btn.addEventListener('click', () =>{
//     console.log('Event 2')
// })
// btn.addEventListener('click', () =>{
//     console.log('Event 3')
// })

// function viec1() {  // mỗi function là 1 listener
//     console.log('Việc 1')
// }
// function viec2() {  // mỗi function là 1 listener
//     console.log('Việc 2')
// }

// btn.addEventListener('click', viec1)
// btn.addEventListener('click', viec2)

// setTimeout(function () {
//     btn.removeEventListener('click', viec1)     // hủy bỏ sự kiện của 1 listener nào đó
// }, 3000)





/*=================== JSON ====================*/
/**
 * Là 1 định dạng dữ liệu (chuỗi), KHÔNG phải là kiểu dữ liệu
 * Viết tắt của: JavaScript Object Nation
 * JSON: number, boolearn, null, array, object
 * Mã hóa (encode) / Giải mã (decode)
 * Stringify (convert sang bộ mã khác) : từ Javascript types => JSON
 * Parse (trả về kiểu dữ liệu ban đầu) : từ JSON => Javascipt types
 */

// var json = '["Javascript", "PHP"]'
// var json = '{"name":"Vu Duc Tien", "age":18}'

// var a = '1';
// console.log(JSON.parse(json))

// console.log(JSON.stringify(1))




/*=================== PROMISE ====================*/
/**
 * - sync: đồng bộ
 * - async : bất đồng bộ
 * - pain : nỗi đau
 * - lý thuyết, cách hoạt động
 * - thực hành, ví dụ
 */
// sync (đồng bộ) : viết trước chạy trước (chạy theo luồng)
// async (bất đồng bộ) : setTimeout(), setInterval(), fetch, XMLHttpRequest, file reading (đọc file), request animation frame

// Callback

// pain (nỗi đau) gồm:
    // Callback hell : khi sử dụng callback; callback lồng callback; khi callback ngoài chạy xong thì callback trong mới được thực thi
    // setTimeout(function(){
    //     console.log(1) // viec 1
    //     setTimeout(function(){
    //         console.log(2) // viec 2
    //         setTimeout(function(){
    //             console.log(3) // viec 3
    //             setTimeout(function(){
    //                 console.log(4) // viec 4
    //                 setTimeout(function(){
    //                     console.log(5) // viec 5
    //                 }, 1000)
    //             }, 1000)
    //         }, 1000)
    //     }, 1000)
    // }, 1000)

    // Pyramid of doom : khi viết code tổng quan



// Thực hành, ví dụ
    // B1: new Promise
    // B2: Executor
    // Viết xong logic phải có thành công hoặc thất bại nếu không có thì sẽ gây ra treo (Memory leak: rò rỉ bộ nhớ)

// 1. pennding: trạng thái chờ thành công hay thất bại
// 2. Fulfilled: thành công
// 3. Rejected

// var promise = new Promise(
//     // executor : function được thực thi khi gọi tới Promise
//     function(resolve, reject){  // thành công, thất bại
//         // logic => do chúng ta tự viết

//         // Thành công : reslove();
//         resolve();  

//         // Thất bại : reject();
//         // reject('Có Lỗi!')
//     }
// );

// promise
//     // Khi reslove() được gọi thì then() sẽ được gọi
//     .then(function(){
//         console.log()
//     })
//     // Khi reject() được gọi thì catch() sẽ được gọi
//     // catch : bẫy bắt lỗi
//     .catch(function(errr){
//         console.log()
//     })
//     // 1 trong reslove() hoặc reject() được gọi thì finally() đầu được gọi
//     .finally(function(){
//         console.log('Done!')
//     })


// function sleep(ms) {
//     return new Promise(function(resolve) {
//         setTimeout(resolve, ms)
//     })
// }
// sleep(1000)
//     .then(function() {
//         console.log(1);
//         return sleep(1000)
//     })
//     .then(function() {
//         console.log(2);
//         return new Promise(function(resolve, reject){
//             reject('Co loi!')
//         })
//     })
//     .then(function() {
//         console.log(3);
//         return sleep(1000)
//     })
//     .then(function() {
//         console.log(4);
//         return sleep(1000)
//     })
//     .catch(function(err) {
//         console.log(err)
//     })



// 1. Promise.resolve
// 2. Promise.reject
// 3. Promise.all (chạy song song)

// Thư viện: output luôn luôn là Promise

// var promise = new Promise(function(resolve, reject) {
//     // resolve('Successes!')
//     reject('Lỗi!')
// })

// var promise = Promise.reject('Error!')

// promise 
//     .then(function(result){
//         console.log(result)
//     })
//     .catch(function(err){
//         console.log(err)
//     })

// var promise1 = new Promise(function(resolve) {
//     setTimeout(function(){
//         resolve([1]);
//     }, 2000)
// })

// var promise2 = new Promise(function(resolve) {
//     setTimeout(function(){
//         resolve([2, 3]);
//     }, 5000)
// })

// var promise3 = Promise.reject('Có lỗi!')
// // Chỉ cần 1 thằng sai đẫn đến tất cả sai

// Promise.all([promise1, promise2, promise3])
//     .then(function(result){
//         // console.log(result)
//         var result1 = result[0];
//         var result2 = result[1];

//         console.log(result1.concat(result2, result3))  // Nối mảng
//     })
//     .catch(function(err){
//         console.log(err)
//     })


// PROMISE EXAMPLE
// var users = [
//     {
//         id: 1,
//         name: 'Vu Tien'
//     },
//     {
//         id: 2,
//         name: 'Son Dang'
//     },
//     {
//         id: 3,
//         name: 'Nguyen Van'
//     }
// ]

// var comments = [
//     {
//         id: 1,
//         user_id: 1,
//         content: 'Làm người yêu anh nha!'
//     },
//     {
//         id: 2,
//         user_id: 2,
//         content: '!Ok'
//     },
//     {
//         id: 3,
//         user_id: 1,
//         content: 'Veloz, dẹp mẹ đi'
//     },
//     {
//         id: 4,
//         user_id: 3,
//         content: 'Thôi lào'
//     }
// ]

// // 1. Lấy comment
// // 2. Từ comment lấy ra user_id
// // 3. Từ user_id lấy ra user tương ứng

// function getComments(){
//     return new Promise (function(resolve){
//         setTimeout(function(){
//             resolve(comments)
//         }, 1000)
//     })
// }

// getComments()
//     .then(function(comments){
//         // console.log(comments)
//         var userIds = comments.map(function(comment){
//             return comment.user_id      // lấy ra mảng user_id và lưu vào mảng userIds
//         })
//         // console.log(userIds)
//         return getUsersByIds(userIds)
//             .then(function(users){
//                 // console.log(users)
//                 // lấy ra cả 2 mảng users và comments
//                 return {
//                     nguoiDungs: users,
//                     binhLuans: comments,
//                 }
//             })

//     })
//     // nhận được dữ liệu khi return promise ở trên
//     .then(function(data){
//         // console.log(data)
//         var commentBlock = document.getElementById('comment-block')
//         var html = ''
//         data.binhLuans.forEach(function(comment){
//             var user = data.nguoiDungs.find(function(user){
//                 return user.id === comment.user_id
//             })
//             html += `<li>${user.name}: ${comment.content}</li>`
//         })
//         commentBlock.innerHTML = html;
//     })


// // hàm này để chọc vào mảng users để lấy ra id trùng với mảng userIds
// function getUsersByIds(userIds){
//     return new Promise(function(resolve){
//         // từ list user_id nhận được sẽ chọc vào biến mô phỏng của db là mảng users để lọc ra các id tương ứng
//         var result = users.filter(function(user){
//             // lọc ra những user nằm trong list userIds
//             return userIds.includes(user.id)
//         })
//         resolve(result);
//     })
// }





// // Fake API
// function getComments() {
//     return new Promise(function(resolve){   // mặc định trường hợp này đúng, lấy comment ra sau 1s
//         setTimeout(function(){
//             resolve(comments);
//         }, 1000)
//     })
// }

// // getUserByIds() trả về một Promise với kết quả là một mảng các user có id nằm trong mảng userIds.
// function getUserByIds(userIds){ // truyền tham số userId
//     return new Promise(function(resolve){   // trả về 1 Promise
//         var result = users.filter(function(user){    
//             return userIds.includes(user.id);   // tạo biến result là một mảng được lọc từ mảng 'users' với điều kiện là 'user.id' nằm trong 'userIds'.
//         });
//         setTimeout(function(){  
//             resolve(result);
//         }, 1000)
//     })
// }


// getComments()
//     .then(function(comments){
//         var userIds = comments.map(function(comment){
//             return comment.user_id
//         });
//         // console.log(userIds)
//         return getUserByIds(userIds)
//             .then(function(users){
//                 return {
//                     users: users,
//                     comments: comments,
//                 };
//             })
//     })
//     .then(function(data){
//         // console.log(data)
//         var commentBlock = document.getElementById('comment-block')
//         var html = '';
//         data.comments.forEach(function(comment){
//             var user = data.users.find(function(user){
//                 return user.id === comment.user_id;
//             });
//             html += `<li>${user.name}: ${comment.content}</li>`;
//         });
//         commentBlock.innerHTML = html;
//     })




/*=================== FETCH ====================*/
// var postAPI = 'https://jsonplaceholder.typicode.com/posts'

// // stream
// // fetch() sử dụng Promise, nó là hàm dựng sẵn khi gọi đến fetch() sẽ nhận được 1 Promise return lại, nên dùng .then
// fetch(postAPI)
//     .then(function(response){
//         // response là 1 phản hồi, chính nó là 1 Promise
//         // cũng là 1 đối tượng và có phương thức là json()
//         // response.json() sẽ trả lại 1 Promise
//         return response.json();
//         // khi return response.json() sẽ trả về 1 JSON.parse() (parse json trả về (JSON => Javascript types))
//     })
//     // khi trong .then() mà trả về 1 Promise thì lại .then() ở bên dưới để lấy kết quả trả về của .then() bên trên
//     .then(function(posts){
//         // console.log(posts)

//         // Cách 1
//         // var html = '';
//         // var postBlock = document.getElementById('post-block')
//         // posts.forEach(function(post){
//         //     html += `<li>
//         //         <h2>${post.title}</h2>
//         //         <p>${post.body}</p>
//         //     </li>`;
//         // })
//         // // console.log(html)
//         // postBlock.innerHTML = html;


//         // Cách 2
//         var htmls = posts.map(function(post){
//             return `<li>
//                 <h2>${post.title}</h2>
//                 <p>${post.body}</p>
//             </li>`;
//         })
//         var html = htmls.join('')
//         document.getElementById('post-block').innerHTML = html;
//     })
//     .catch(function(err){
//         console.log(err)
//     })





/*=================== JSON SERVER ====================*/
// Fake API hay còn gọi là Mock API
// CRUD:
    // - Create: tạo mới -> POSt
    // - Read: lấy dữ liệu -> GET
    // - Update: chỉnh sửa -> PUT / PATCH
    // - Delete: xóa -> DELETE
// Postman


// var courseApi = 'http://localhost:3000/course'

// fetch(courseApi)
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(courses){
//         console.log(courses);
//     })



// var listCoursesBlock = document.querySelector('#list-courses')
// var courseApi = 'http://localhost:3000/course';

// function start() {
//     // getCourses(function(courses){
//     //     // console.log(courses);
//     //     renderCourses(courses);
//     // })

//     getCourses(renderCourses);
//     handleCreateForm();
//     // handleDeleteCourse();
// }

// start();

// // Functions
// function getCourses(callback) {
//     fetch(courseApi)
//         .then(function(response){
//             return response.json();
//         })
//         .then(callback)
// }

// function createCourses(data, callback){
//     var options = {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: JSON.stringify(data)
//     };
//     fetch(courseApi, options)
//         .then(function(response){
//             return response.json();
//         })
//         .then(callback);
// }

// function handleDeleteCourse(id){
//     var options = {
//         method: 'DELETE',
//         headers: {
//             "Content-Type": "application/json",
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//         },
//     };
//     fetch(courseApi + '/' + id, options)
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(){
//             // getCourses(renderCourses);
//             var courseItem = document.querySelector('.course-item' + id)
//             if(courseItem){
//                 courseItem.remove();
//             }
//         });
// }

// function renderCourses(courses) {
//     var listCoursesBlock = document.getElementById('list-courses')
//     var htmls = courses.map(function(course){
//         return `<li class="course-item-${course.id}">
//             <h4>${course.name}</h4>
//             <p>${course.description}</p>
//             <button onclick="handleDeleteCourse(${course.id})">Xóa</button>
//         </li>`
//         // console.log(course.name)
//         // console.log(course.desciption)
//     })
//     listCoursesBlock.innerHTML = htmls.join('')
// }

// function handleCreateForm(){
//     var createBtn = document.querySelector('#create')
//     createBtn.onclick = function(){
//         var name = document.querySelector('input[name="name"]').value
//         var description = document.querySelector('input[name="description"]').value
//         // console.log(name)
//         // console.log(description)
//         var formData = {
//             name: name,
//             description: description
//         };
//         createCourses(formData, function(){
//             getCourses(renderCourses);
//         })
//     }
// }





/*=================== ECMAScipt 6+ ====================*/
// 1. let, const
    // Var / Let, Const: Scope, Hosting
    // Đều dùng để gán biến cho giá trị đầu thì không khác gì
    // Khác nhau phạm vị truy cập
        // Var: truy cập được ngoài scope của nó
        // Let, Const chỉ truy cập được trong scope của nó
        // Chỉ var được "hosting" tức là đưa giá trị lên đầu
            // var a; a = 10;
            
    // Const / Var, Let: Assignment
        // Const không cho pháp 'assingment' (gán) lại biến, "var, let" có thể gán lại được

// Code block: if else, loop, {}, ...
// Code thuần dùng: var
// Babel: const, let
// - khi định nghĩa và không gán lại biến đó: const
// - khi cần gán lại giá trị cho biến: let
    // let isSuccess = false;
    // if(...){
    //     isSuccess = true;
    // }




// 2. Template Literal
// const courseName = 'Javascript';
// const courseName2 = 'PHP';
// const desciption = `Course Name: ${courseName}${courseName2}`;
// // const desciption = 'Course Name: ' + courseName;
// console.log(desciption);




// 3. Multi-line string
// const lines = 'Line 1\n' + 'Line 2\n' + 'Line 3\n' +'Line 4\n';
// const lines = `Line 1
// Line 2
// Line 3
// Line 4
// Line 5`
// console.log(lines)




// 4. Arrow function
// const logger = (log) => {
//     console.log(log)
// }
// logger('123...')

// const sum = (a, b) => a + b;
// console.log(sum(2, 4))

// const sum2 = (a, b) => ({a: a, b: b})
// console.log(sum2(3, 5))

// const logger2 = log2 => console.log(log2)
// logger2('Hello World')

// const course = {
//     name: 'Javascript cơ bản',
//     getName: () => {
//         return this.name; 
//     }
// }
// console.log(course.getName())

// const Course = function(name, price){
//     this.name = name;
//     this.price = price;
// }
// const jsCourse = new Course('Javascript', 1000)
// console.log(jsCourse)




// 5. Classes
// function Course(name, price){
//     this.name = name;
//     this.price = price;
//     this.getName = function() {
//         return this.name;
//     }
// }

// class Course{
//     constructor(name, price) {
//         this.name = name;
//         this.price = price;
//     }
//     getName() {
//         return this.name;
//     }
//     getPrice() {
//         return this.price;
//     }
//     run(){
//         isSuccess = false;
//         if(isSuccess) {
//             isSuccess = true;
//         }
//     }
// }
// const phpCourse = new Course('PHP', 1000)
// const jsCourse = new Course('Javascript', 1200)
// console.log(phpCourse);
// console.log(jsCourse);




// 6. Default parameter values
// function logger(log = 'Gia tri mac dinh!'){
//     console.log(log)
// }
// logger();

// function logger2(log, type = 'log'){
//     console[type](log)
// }
// logger2('Message...', 'log');




// 7. Destructuring 
// var array = ['Javascript', 'PHP', 'Ruby'];
// // var a = array[0]
// // var b = array[1]
// // var c = array[2]
// // var [a, b, c] = array;   
// // console.log(a, b, c)
// var [a, , c] = array;
// console.log(a, c)




// 8. Rest parameter
// var array = ['Javascript', 'PHP', 'Ruby'];
// var [a, ...rest] = array
// console.log(a)
// console.log(rest)

// var course = {
//     name: 'Javascript',
//     price: 1000,
//     image: 'image-address',
//     children: {
//         name: 'ReactJS',
//     }
// }
// var {name, price} = course
// console.log(name, price)
// var {name, ...rest} = course
// console.log(name)
// console.log(rest)
// var {name: parentName, children: {name: childrenName}} = course;
// console.log(parentName)
// console.log(childrenName)

// function logger({name, price, ...params}) {
//     console.log(name)
//     console.log(price)
//     console.log(params)
// }
// logger({
//     name: 'Javascript',
//     price: 1000,
//     description: 'Description content'
// })

// function logger([a, b, ...rest]){
//     console.log(a)
//     console.log(b)
//     console.log(rest)
// }
// logger([3, 4, 1, 6, 8, 0])




// 9. Spread
// var array1 = ['Javascript', 'PHP', 'Ruby']
// var array2 = ['ReactJs', 'Dart']
// var array3 = [...array2, ...array1]
// console.log(array3)

// var obj1 = {
//     name: 'Javascript'
// }
// var obj2 = {
//     price: 1000
// }
// var obj3 = {
//     ...obj1,
//     ...obj2,
// }
// console.log(obj3)

// var defaultConfig = {
//     api: 'https://domain-trang-khoa-hoc',
//     apiVersion: 'v1',
//     other: 'other'
// }
// var exrciseConfig = {
//     ...defaultConfig,
//     api: 'https://domain-trang-bai-tap'
// }
// console.log(exrciseConfig)

// var array = ['Javascript', 'PHP', 'Ruby']
// function logger(a, b, c){
//     console.log(a)
//     console.log(b)
//     console.log(c)
// }
// logger(...array)




// 10. Enhanced object literals
    // 1. Định nghĩa key value cho object 
    // 2. Định nghĩa các phương thức cho object
    // 3. Định nghĩa key cho object dưới dạng biến
// var name = 'Javascript';
// var price = 1000;
// var course = {
//     name,
//     price,
//     getName() {
//         return name;
//     }
// }
// console.log(course)

// var fieldName = 'name';
// var fieldPrice = 'price';
// var course = {
//     [fieldName]: 'Javascript', 
//     [fieldPrice]: 1000,
// }
// console.log(course)




// 11. Tagged template literal
// function highlight([first, ...strings], ...values) {
//     // console.log('first: ', first)
//     // console.log('strings: ', strings)
//     // console.log('values: ',values)
//     return values.reduce((acc, curr) => [...acc, `<span>${curr}</span>`, strings.shift()], [first]).join('')
// }
// var brand = 'F8'
// var course = 'Javascript'
// const html = highlight`Học lập trình ${course} tại ${brand}!`
// console.log(html)




// 12. Modules: Import / Export
// // import logger from './logger/logger.js'
// // import logger from './logger/index.js'
// import * as constants from './constants.js'
// // console.log(constants)
// // import { TYPE_LOG, TYPE_WARN, TYPE_ERROR } from './constants.js'
// // logger('Test message...', TYPE_ERROR)
// import {logger2} from './logger/index.js'
// logger2('Test message...', constants.TYPE_ERROR)




// 13. opitional chaining (?.)
// Source: https://github.com/mdn/content/blob/main/files/en-us/web/javascript/reference/operators/optional_chaining/index.md
// sử dung Opitional chaining khi không chắc chắn key đó có tồn tại hay không
/*js-nolint
obj.val?.prop
obj.var?.[expr]
obj.arr?.[index]
obj.func?.(args)
*/

// const obj = {
//     name: 'Alice',
//     cat: {
//       name: 'Dinah',
//       cat2: {
//         name: 'Dinah2',
//         cat3: {
//             name: 'Dinah3'
//         }
//       }
//     }
//   };

// // // Cách thông thường
// // if(obj.cat && obj.cat.cat2 && obj.cat.cat2.cat3) {
// //     console.log(obj.cat.cat2.cat3.name)
// // }

// // Sử dụng Opitional chaining
// if(obj?.cat?.cat2?.cat3) {
//     console.log(obj.cat.cat2.cat3.name)
// }


const obj = {
    // getName(value) {
    //     console.log(value)
    // }
}
obj.getName?.(123)