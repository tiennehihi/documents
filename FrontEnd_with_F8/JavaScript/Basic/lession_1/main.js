// var a = '1';
// var b = 2;

// var c = typeof a;
// var d = typeof b;
// var e = typeof d;

// console.log(c, d, e)

// function showDialog() {
//     alert('Hi xin chào các bạn!')
// }
// showDialog();

// function showMessage(message) {
//     console.log(message);
// }

// showMessage("Hi anh em F8!");

// var a = 6;
// var output = ++a;
// console.log(output);

// function writeLog() {
//     var myString = '';
//     for (var param of arguments) {
//         myString += `${param} - `
//     }
//     console.log(myString)
// }
// writeLog('Log 1', 'Log 2', 'Log 3');

// function writeLog(message) {
//     console.log(message);
// }
// writeLog(['Test message', 'Test message 1', 'Test message 2']);



/*
Chuỗi trong Javasript
    c1: var fullName = 'Vu Duc Tien';
    c2: var fullName = new String('Vu Duc Tien');

    search: backslash in javascript
 */
// var fullName = 'Vu Duc Tien';
// var firstName = 'Vu';
// var lastName = 'Tien';
// console.log(fullName.length);
// console.log('Toi la: ' + firstName + ' ' + lastName);
// console.log(`Toi la: ${firstName} ${lastName}`);


// Keywword: Javascript string method

// var myString = '    Học JS tai F8!    ';
// var myString = 'Học JS tai JS JS F8!';

// 1. length (độ dài chuỗi)
// console.log(myString.length);

// 2. find index (tìm kiếm)
// console.log(myString.indexOf('JS'));
// console.log(myString.indexOf('JS', 5));
// console.log(myString.lastIndexOf('JS'));
// console.log(myString.search('JS'));

// 3. cut String (cắt chuỗi)
// console.log(myString.slice(4, 6));
// console.log(myString.slice(4));
// console.log(myString.slice(0));
// console.log(myString.slice(-3));

// 4. replace (thay thế)
// console.log(myString.replace('JS', 'Javascript'));
// console.log(myString.replace(/JS/g, 'Javascript'));

// 5. convert to upper case (chuyển tất cả thành chữ hoa)
// console.log(myString.toLocaleUpperCase());

// 6. convert to lower case (chuyển tất cả thành chữ thường)
// console.log(myString.toLocaleLowerCase());

// 7. trim (bỏ khoảng trắng thừa ở đầu và cuối)
// console.log(myString.trim());

// 8. split (tạo chuỗi thành mảng qua những điểm chung)
// var languages = 'Javascript, PHP, Ruby';
// console.log(languages.split(', '));
// console.log(languages.split(''));

// 9. get a character by index (lấy ký tự)
// var myString2 = 'Vu Duc Tien';
// console.log(myString2.charAt(0));  (ko tồn tại trả về rỗng)
// console.log(myString2[0]);  (ko tồn tại trả về undefined)



// var coursesStr = 'HTML & CSS, JavaScript, ReactJS';

// function strToArray(str) {
//     var array= str.split(',');
//     return array;
// }

// // Expected results
// console.log(strToArray(coursesStr)) 

// // Output: ['HTML & CSS', 'JavaScript', 'ReactJS']



/* 
        Làm việc với Number
    NaN : không phải là số, mà là 1 số không hợp lệ
    Để ktra NaN : isNaN('');
    Key : Javascript number methods 

*/

// 1. To String (đổi Number thành String)
// var age = 18;
// var PI = 3.14;
// var number = 3000.37492374;

// var myString = age.toString();

// console.log(typeof myString);


// 2. To Fixed (làm tròn số thập phân)
// console.log(number.toFixed());
// console.log(number.toFixed(2));



/*
function isNumber(value) {
    if(!isNaN(value) && typeof value === 'number') {
        return true;
    } else {
        return false;
    }
}
// Expected results:
console.log(isNumber(999)); // true
console.log(isNumber('abc')); // false
console.log(isNumber('100')); // false
*/



/* 
        Mảng trong Javascript - Array
    
*/

// var language = 'Javascript';
// var language2 = 'PHP';
// var language3 = 'Ruby';

// var languages = [
//     'Javascript',
//     'PHP',
//     'Ruby',
//     null,
//     undefined,
//     function (){},
//     {},
// ];

// var languages = new Array (
//     'Javascript',
//     'PHP',
//     'Ruby',
//     null,
//     undefined,
//     function (){},
//     {},
// );
// console.log(Array.isArray(languages)); 
// // kiểm tra xem có phải Array hay không

// console.log(languages.length);
// console.log(languages[0]);




/* 
        Làm việc với mảng
    key: javascript array methods
*/

// var languages = [
//     'Javascript',
//     'PHP',
//     'Ruby'
// ];

// 1. toString()
// Chuyển mảng thành chuỗi
// console.log(languages.toString());

// 2. Join
// Nối mảng
// console.log(languages.join(', '));

// 3. Pop
// xóa element cuối mảng và trả về phần tử đã xóa
// console.log(languages.pop()); 
// console.log(languages.pop()); 
// console.log(languages.pop()); 

// 4. Push  
// Thêm phần tử vào cuối mảng
// console.log(languages.push('Dart', 'Java')); 
// console.log(languages);

// 5. shift
// Xóa phần tử ở đầu mảng
// console.log(languages.shift());

// 6. unShift
// Thêm phần tử mới vào mảng 
// console.log(languages.unshift('Dart', 'C++'));
// console.log(languages)

// 7. Splicing
// xóa phần tử từ vị trí đặt con trỏ (vị trí, số phần tử cần xóa, chèn 1 element vào vị trí nào đó nếu số phần tử cần xóa = 0)
// languages.spilice(1, 1, 'Dart') => thay phần tử ở vị trí thứ 1 = 'Dart'
// languages.splice(1, 1);
// console.log(languages);

// 8. Concat
// Nối 2 mảng
// var languages = [
//     'Javascript',
//     'PHP',
//     'Ruby'
// ];

// var languages2 = [
//     'Java',
//     'Swift',
//     'Go'
// ];
// console.log(languages.concat(languages2));
// console.log(languages2.concat(languages));

// 9. Slicing
// Cắt lấy 1 vài element của mảng
// var languages = [
//     'Javascript',
//     'PHP',
//     'Ruby'
// ];
// console.log(languages.slice(1, 2))
// console.log(languages.slice(0))
// console.log(languages.slice(-2, -1))


/*
function joinWithCharacter(array, charactor) {
    return array.join(charactor);
}


// Ví dụ khi sử dụng
var cars = ['Honda', 'Mazda', 'Mercedes'];

var result = joinWithCharacter(cars, ' - ');

console.log(result); // Expected: "Honda - Mazda - Mercedes"
*/



/*
    OBJECT
*/
// Khi key là function thì gọi là phương thức

// var emailKey = 'email';

// var myInfo = {
//     name: 'Vu Duc Tien',
//     // 'full-name': 'Vu Tien',
//     age: 18,
//     address: 'Ninh Binh, VN',
//     [emailKey]: 'thanhxuananhvaem.2k3@hotmail.com',
//     getName: function() {
//         return this.name;
//         // this trong đây là myInfo
//     }
// };
// // myInfo.gmail = 'vuductientienti@gmail.com';
// // myInfo['my-email'] = 'vu_duc_tien@outlook.com.vn'

// console.log(myInfo);
// console.log(myInfo.getName());

// console.log(myInfo.name);
// console.log(myInfo['full-name']);

// delete myInfo.gmail;
// delete myInfo.name;
// console.log(myInfo);



/*
    Object Constructor

    Prototype là gì?
    Sử dụng khi nào

    nếu coi constructor là 1 bản thiết kế nhà, thì prototype là các dụng cụ
*/

// Constructor
// function User(firstName, lastName, avatar) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.avatar = avatar;

//     this.getName = function() {
//         return `${this.firstName} ${this.lastName}`
//     }
// }

// User.prototype.className = 'F8';  // thêm thuộc tính
// User.prototype.getClassName = function() {  // thêm phương thức
//     return this.className;
// }
// // prototype có thể thêm vào đối tượng được tạo ra


// var User = function (firstName, lastName, avatar) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.avatar = avatar;

//     this.getName = function() {
//         return `${this.firstName} ${this.lastName}`
//     }
// }

// Object
// var author = new User('Sơn', 'Đặng', 'Avatar');
// var user = new User('Tiến', 'Vũ', 'Avatar');

// author.title = 'Chia sẻ dạo tại F8';
// user.comment = 'Tien ne hihi'

// console.log(user.className);
// console.log(author.className);
// console.log(user.getClassName());
// console.log(author.constructor);


/*
// Làm bài tại đây 
function Student(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
}
Student.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`
}


// Ví dụ khi sử dụng
var student = new Student('Long', 'Bui');

console.log(student.firstName);  // 'Long'
console.log(student.lastName);  // 'Bui'
console.log(student.getFullName());  // 'Long Bui'
*/



/**
 *      Đối tượng Date
 *  key: javascrip date object mozilla
 */

// var date = Date(); // là 1 chuỗi
// var date = new Date(); // là 1 đối tượng
// var year = date.getFullYear();
// var month = date.getMonth() + 1;
// var day = date.getDate();


// console.log(`${year}/${month}/${day}`)
// console.log(date);



/*
        Math object
    - Math.PI
    - Math.round()
    - Math.abs()
    - Math.ceil()
    - Math.floor()
    - Math.random()
    - Math.min()
    - Math.max()
*/

// console.log(Math.PI)
// console.log(Math.round(2.49)) // làm tròn
// console.log(Math.abs(-5))  // lấy trị tuyệt đối
// console.log(Math.ceil(2.49))   // làm tròn trên
// console.log(Math.floor(2.9))   // làm tròn dưới
// console.log(Math.random())  // trả về số thập phân nhỏ hơn 1
// console.log(Math.floor(Math.random() * 10))   // lấy 1 số ngẫu nhiên từ 0-9
// console.log(Math.min(-100, 1, 7, 3, 9, -20, -111))
// console.log(Math.max(-100, 1, 7, 3, 9, -20, -111))



// var random = Math.floor(Math.random() * 100)

// if(random < 5) {
//     console.log('Cường hóa thành công!')
// } 


// var bonus = [
//     '10 coin',
//     '20 coin',
//     '30 coin',
//     '40 coin',
//     '50 coin',
// ];

// console.log(bonus[random]);



// Câu lệnh rẽ nhánh If - else

// Vòng lặp

// for (var i=0; i <= 1000; i++){
//     console.log(i,': Hello World');
// }
// var getRandNumbers = function (min, max, length) {
//     var arr = [length];
//     for(var i=0; i < length; i++) {
//         arr.push(Math.random() * (max - min) + min);
//         // arr[i] = random;
//         console.log(arr)
//     }
//     return arr;
// }
// getRandNumbers(1, 15, 9);



// Vòng Lặp For - in
// để lấy ra các "key" trong object

// var myInfo = {
//     name: 'Vu Tien',
//     age: 20,
//     address: 'Ninh Binh, VN'
// }
// for (var key in myInfo){
//     // console.log(key)
//     console.log(myInfo[key])
// }

// var languages = [
//     'javascript',
//     'php',
//     'ruby'
// ]
// for(var key in languages) {
//     // console.log(key)
//     console.log(languages[key])
// }

// var subject = 'Javascript';
// for (var key in subject) {
//     // console.log(key);
//     console.log(subject[key]);
// }

// function run(object) {
//     var arr = [];
//     for(var key in object){
//         arr.push(`Thuộc tính ${key} có giá trị ${object[key]}`)
//     }
//     return arr;
// }

// // Expected results:
// console.log(run({ name: 'Nguyen Van A', age: 16 }));
// // Output:
// // [
// //     "Thuộc tính name có giá trị Nguyen Van A",
// //     "Thuộc tính age có giá trị 16"
// // ]


// For - of
// Sử dụng trong trường hợp muốn lấy ra phần tử của 1 mảng hoặc lấy ra phần tử của 1 chuỗi
// Không dùng trực tiếp được với Object

// var languages = [
//     'javascript',
//     'php',
//     'ruby'
// ]

// var language = 'javascript';

// for(var value of language) {
//     console.log(value);
// }

// var myInfo = {
//     name: 'Vũ Tiến',
//     age: 18
// }
// // console.log(Object.keys(myInfo));
// // console.log(Object.values(myInfo));
// for(var value of Object.values(myInfo)) {
//     // console.log(myInfo[value]);
//     console.log(value);
// }




// While loop
// var myArr = [
//     'Javascipt',
//     'Php',
//     'Ruby'
// ]
// var i=0;
// var myArrLength = myArr.length;
// while (i <= myArrLength){
//     console.log(myArr[i]);
//     i++;
// }




// Do - While
// Chạy luôn không ktra điều kiện, bắt đầu ktra điều kiện từ lần lặp thứ 2

// var i = 0;
// var isSuccess = false;


// do {
//     i++;
    
//     console.log('Nạp thẻ lần', i);

//     // Thành công
//     if (false) {
//         isSuccess = true;
//     }


// } while (!isSuccess && i < 3)




// // Break và Continute trong vòng lặp
// for(var i=0; i < 10; i++){
//     if (i%2 !== 0) {
//         continue;  // là số lẻ thì bỏ qua, chạy tiếp
//     }

//     console.log(i);
//     // if (i >= 5) {
//     //     break;   // i >= 5 thì dừng và thoát khỏi vòng lặp
//     // }
// }




// Vòng lặp lồng nhau - Nested Loop
// var myArray = [
//     [1, 2],
//     [3, 4],
//     [5, 6]
// ];

// for (var i = 0; i < myArray.length; i++) {
//     for (var j = 0; j < myArray[i].length; j++){
//         console.log(myArray[i][j]);
//     }
// }




// var array = ['a', 'b', 'c', 'a', 'b', 'c'];

// console.log([...(new Set(array))]);

// console.log(array)





// Đệ quy
// 1. Xác định điểm dừng
// 2. Logic handle +=> Tạo ra điểm dừng


// function deQuy(num) {
//     if(num < 0){
//         // Dừng
//     }
//     deQuy();
// }
// deQuy();

// function countDown(num) {
//     if(num > 0){
//         console.log(num);
//         return countDown(num - 1);
//     }
//     return num;
// }
// countDown(10);






// function loop(start, end, cb) {
//     if (start < end) {
//         cb(start);
//         return loop(start + 1, end, cb);
//     }
// }


// var array = ['Javascipt', 'PHP', 'Ruby'];

// loop(0, array.length, function(index) {
//     console.log(array[index]);
// });







// function giaiThua(num) {
//     if (num >= 1){
//         return num*giaiThua(num-1);
//     }
//     return 1; // khi đệ quy chạy tới num = 0 thì vi phạm sẽ không chạy nữa và trả về 1 chính là vị trí cuối cùng của giai thừa
// }
// console.log(giaiThua(3))

// function giaiThua(num) {
//     if (num <= 0){
//         return 1;  // khi đệ quy chạy tới num = 0 thì vi phạm sẽ không chạy nữa và trả về 1 chính là vị trí cuối cùng của giai thừa
//     }
//     return num*giaiThua(num-1); 
// }
// console.log(giaiThua(6))






/**
 *      Array Methods
 * forEach()
 * every()
 * some()
 * find()
 * filter()
 * map()
 * reduce()
 */

// var courses = [
//     {
//         id: 1,
//         name: 'JavaScript',
//         coin: 300
//     },
//     {
//         id: 2,
//         name: 'PHP',
//         coin: 0
//     },
//     {
//         id: 3,
//         name: 'Java',
//         coin: 0
//     },
//     {
//         id: 4,
//         name: 'Ruby',
//         coin: 500
//     },
//     {
//         id: 5,
//         name: 'Ruby',
//         coin: 500
//     },
//     {
//         id: 6,
//         name: 'ReactJS',
//         coin: 100
//     },
//     {
//         id: 7,
//         name: 'Ruby',
//         coin: 150
//     }
// ];

// courses.forEach(function(course, index) {
//     console.log(index, course);
// });

// var isFree = courses.every(function(course, index) {
//     return course.coin === 0;
// });
// console.log(isFree)

// var isFree = courses.some(function(course, index) {
//     return course.coin === 0;
// });
// console.log(isFree)
// // Output => true

// var course = courses.find(function(course, index) {
//     return course.name === 'Ruby';
// });
// console.log(course)

// var listCourses = courses.filter(function(course, index) {
//     return course.name === 'Ruby';
// });
// console.log(listCourses)

// map() chỉnh sửa thay đổi 1 element trong aray
// function coursesHandler(course, index, originArray) {
//     console.log(course);
//     return {
//         id: course.id,
//         name: `Khóa học: ${course.name}`,
//         coin: course.coin,
//         coinText: `Giá: ${course.coin}`,
//         index: index,
//         originArray: originArray,  // originArray là array gốc
//     };
//     // return course.name;
//     return `<h2>${course.name}</h2>`;
// }
// var newCourses = courses.map(coursesHandler);
// console.log(newCourses)
// console.log(newCourses.join(''))

// reduce()
// var totalCoin = courses.reduce(function(accumulator, currentValue){
//     return accumulator + currentValue.coin;
// }, 0)
// console.log(totalCoin)


// var i=0;
// function coinHandler(accumulator, currentValue, currentIndex, originArray){  
//     // (giá trị khởi tạo, giá trị hiện tại, chỉ mục, chính là tên object(courses))
//     i++;

//     var total = accumulator + currentValue.coin;
//     // console.log(i)
//     console.table({
//         'Lượt chạy' : i,
//         'Biến lưu trữ' : accumulator,
//         'Giá khóa học' : currentValue.coin,
//         'Tích trữ được' : total
//     })
//     // console.log(currentValue)
//     return total;

//     // return accumulator + currentValue.coin;
// }
// var totalCoin = courses.reduce(coinHandler, 0)  // 0 là giá trị khởi tạo, tùy thuộc vào nhu cầu
// console.log(totalCoin)


// // Biến lưu trữ
// var totalCoin = 0;
// // Lặp qua các phần tử
// for(var course of courses) {
//     // Thực hiện việc lưu trữ
//     totalCoin += course.coin;
// }
// console.log(totalCoin)




// var totalCoin = courses.reduce(function(total, course){
//     return total + course.coin;
// }, 0)
// console.log(totalCoin)




// var sports = [
//     {
//         name: 'Bơi lội',
//         gold: 11
//     },
//     {
//         name: 'Boxing',
//         gold: 3
//     },
//     {
//         name: 'Đạp xe',
//         gold: 4
//     },
//     {
//         name: 'Đấu kiếm',
//         gold: 5
//     },
// ]


// function getTotalGold(array) {
//     return array.reduce(function(sum, sport){
//         return sum + sport.gold
//     }, 0)
// }

// console.log(getTotalGold(sports))






// const sports = [
//     {
//         name: 'Bóng rổ',
//         like: 6
//     },
//     {
//         name: 'Bơi lội',
//         like: 5
//     },
//     {
//         name: 'Bóng đá',
//         like: 10
//     },
// ]

// // var favour = sports.filter(function(yt){
// //     return yt.like > 5;
// // })
// // console.log(favour)

// function getMostFavoriteSport(array) {
//     return array.filter(function(favor){
//         if(favor.like > 5) {
//             return favor.name;
//         }
//     })
// }

// // Kỳ vọng
// console.log(getMostFavoriteSport(sports)) 
// // Output: [{ name: 'Bóng rổ, like: 6 }, { name: 'Bóng đá, like: 10 }]




// var watchList = [
//     {
//       "Title": "Inception",
//       "Year": "2010",
//       "Rated": "PG-13",
//       "Released": "16 Jul 2010",
//       "Runtime": "148 min",
//       "Genre": "Action, Adventure, Crime",
//       "Director": "Christopher Nolan",
//       "Writer": "Christopher Nolan",
//       "Actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
//       "Plot": "A thief, who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.",
//       "Language": "English, Japanese, French",
//       "Country": "USA, UK",
//       "imdbRating": "8.8",
//       "imdbVotes": "1,446,708",
//       "imdbID": "tt1375666",
//       "Type": "movie",
//     },
//     {
//       "Title": "Interstellar",
//       "Year": "2014",
//       "Rated": "PG-13",
//       "Released": "07 Nov 2014",
//       "Runtime": "169 min",
//       "Genre": "Adventure, Drama, Sci-Fi",
//       "Director": "Christopher Nolan",
//       "Writer": "Jonathan Nolan, Christopher Nolan",
//       "Actors": "Ellen Burstyn, Matthew McConaughey, Mackenzie Foy, John Lithgow",
//       "Plot": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
//       "Language": "English",
//       "Country": "USA, UK",
//       "imdbRating": "8.6",
//       "imdbVotes": "910,366",
//       "imdbID": "tt0816692",
//       "Type": "movie",
//     },
//     {
//       "Title": "The Dark Knight",
//       "Year": "2008",
//       "Rated": "PG-13",
//       "Released": "18 Jul 2008",
//       "Runtime": "152 min",
//       "Genre": "Action, Adventure, Crime",
//       "Director": "Christopher Nolan",
//       "Writer": "Jonathan Nolan (screenplay), Christopher Nolan (screenplay), Christopher Nolan (story), David S. Goyer (story), Bob Kane (characters)",
//       "Actors": "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
//       "Plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.",
//       "Language": "English, Mandarin",
//       "Country": "USA, UK",
//       "imdbRating": "9.0",
//       "imdbVotes": "1,652,832",
//       "imdbID": "tt0468569",
//       "Type": "movie",
//     },
//     {
//       "Title": "Batman Begins",
//       "Year": "2005",
//       "Rated": "PG-13",
//       "Released": "15 Jun 2005",
//       "Runtime": "140 min",
//       "Genre": "Action, Adventure",
//       "Director": "Christopher Nolan",
//       "Writer": "Bob Kane (characters), David S. Goyer (story), Christopher Nolan (screenplay), David S. Goyer (screenplay)",
//       "Actors": "Christian Bale, Michael Caine, Liam Neeson, Katie Holmes",
//       "Plot": "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from the corruption that Scarecrow and the League of Shadows have cast upon it.",
//       "Language": "English, Urdu, Mandarin",
//       "Country": "USA, UK",
//       "imdbRating": "8.3",
//       "imdbVotes": "972,584",
//       "imdbID": "tt0372784",
//       "Type": "movie",
//     },
//     {
//       "Title": "Avatar",
//       "Year": "2009",
//       "Rated": "PG-13",
//       "Released": "18 Dec 2009",
//       "Runtime": "162 min",
//       "Genre": "Action, Adventure, Fantasy",
//       "Director": "James Cameron",
//       "Writer": "James Cameron",
//       "Actors": "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang",
//       "Plot": "A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
//       "Language": "English, Spanish",
//       "Country": "USA, UK",
//       "imdbRating": "7.9",
//       "imdbVotes": "876,575",
//       "imdbID": "tt0499549",
//       "Type": "movie",
//     }
//   ];
  
// function calculateRating(watchList) {
//     var newList = watchList.filter(function(item) {
//         return item.Director === 'Christopher Nolan'
//     });
//     var sum = newList.reduce(function(sumIMBD, item) {
//         return sumIMBD + +item.imdbRating;
//     }, 0)

//     return sum / newList.length;
// }


// // Expected results
// console.log(calculateRating(watchList)); // Output: 8.675



// CÁCH 2
// function calculateRating(watchList) {
//     var findFilms = watchList.filter(function (list) {
//         return list.Director === "Christopher Nolan"
//     })

//     var caculatorFilm = findFilms.reduce(function (total, currentValue) {
//         return total + parseFloat(currentValue.imdbRating)
//     }, 0)

//     var mediumIMDB = caculatorFilm / findFilms.length

//     return mediumIMDB
// }
  


// TỰ TẠO HÀM REDUCE()

// const numbers = [1, 5, 9, 2, 8, 10];

// Array.prototype.reduce2 = function (callback, result) {
//     let i=0;
//     if (arguments.length < 2) {
//         i = 1;
//         result = this[0];
//     }
//     for(; i < this.length; i++){
//         result = callback(result, this[i], i, this)
//     }
//     return result;
// }

// const result = numbers.reduce2((total, number) => {
//     return total + number;
// }, 10)

// console.log(result)


// function arrToObj(arr) {
//     return arr.reduce((newObject, itemArray) => {
//         newObject[itemArray[0]] = itemArray[1];
//         return newObject;
//     }, {})
// }

// // function arrToObj(arr) {
// //     return arr.reduce((state, [key, value], i, array) => {
// //         state[key] = value;
// //         return state;
// //     }, {})
// // }

// // Expected results:
// var arr = [
//     ['name', 'Sơn Đặng'],
//     ['age', 18],
// ];
// console.log(arrToObj(arr)); // { name: 'Sơn Đặng', age: 18 }





// includes method (sử dụng được với string và array)
// var title = 'Responesive web design';
// console.log(title.includes('web', 1))



// Callback là hàm(function) được truyền qua đối số khi gọi hàm khác
// 1. Là hàm
// 2. Truyền qua đối số
// 3. Được gọi lại (trong hàm nhận đối số)

// function myFunction(param) {
//     if (typeof param === 'function') {
//         param('Học lập trình cùng TLU');
//     }
// }
// function myCallback(value) {
//     console.log('Value: ', value)
// }

// myFunction(myCallback)


// Array.prototype.map2 = function(callback) {
//     var arrayLength = this.length;
//     var output = [];
//     for(var i=0; i < arrayLength; ++i){
//         var result = callback(this[i], i);
//         output.push(result);
//     }
//     return output;
// }

// var courses = [
//     'Javascript',
//     'Ruby',
//     'Html'
// ]

// courses.map2(function(course, index){
//     console.log(index, course)
// });


// var htmls = courses.map2(function(course) {
//     return `<h2>${course}</h2>`
// })
// console.log(htmls.join(''))


// var htmls = courses.map(function(course) {
//     return `<h2>${course}</h2>`
// })
// console.log(htmls.join(''))