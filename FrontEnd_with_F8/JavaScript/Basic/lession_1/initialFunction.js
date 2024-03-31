var courses = [
    {
        id: 1,
        name: 'JavaScript',
        coin: 0
    },
    {
        id: 2,
        name: 'PHP',
        coin: 0
    },
    {
        id: 3,
        name: 'Java',
        coin: 0
    },
    {
        id: 4,
        name: 'Ruby',
        coin: 0
    },
    {
        id: 5,
        name: 'Ruby',
        coin: 0
    },
    {
        id: 6,
        name: 'ReactJS',
        coin: 0
    },
    {
        id: 7,
        name: 'Ruby',
        coin: 1
    }
];


/**
 *      Array Methods
 * forEach()    : Duyệt qua từng phần tử của mảng
 * every()      : Duyệt qua...=> tất cả phần tử phải thoả mãn điều kiện => true/false
 * some()       : Duyệt qua...=> 1(vài) phần tử thoả mãn điều kiện => true/false
 * find()       : Duyệt qua...=> Tìm các phần tử thoả điều kiện => Chỉ 1 phần tử đầu tiên thoả mãn điều kiện
 * filter()     : Duyệt qua...=> Tìm các phần tử thoả điều kiện => Tất cả phần tử thoả mãn điều kiện
 * map()        : Duyệt qua...=> Thay đổi các phần tử/giá trị trong mảng => Mảng mới 
 * reduce()     : Duyệt qua...=> Thay đổi các phần tử/giá trị trong mảng => Mảng mới
 */


/*--------------forEach()---------------*/
// Duyệt qua từng phần tử của mảng
Array.prototype.forEach2 = function(callback) {
    var arrayLength = this.length;
    for(var i=0; i < arrayLength; i++) {
        var result = callback(this[i], i);
    }
    return result;
}
courses.forEach2(function(course){
    console.log(course);
})


/*--------------Every()---------------*/
// Duyệt qua...=> tất cả phần tử phải thoả mãn điều kiện => true/false
Array.prototype.every2 = function(callback) {
    var arrayLength = this.length;
    var outputLength = 0;
    for (var i=0; i < arrayLength; i++) {
        var result = callback(this[i], i);
        // Nếu trường hợp đúng => tăng biến đếm
        if(result){
            outputLength++;
        }
    }
    // So sánh biến đếm với độ dài mảng
    if (outputLength < arrayLength) {
        return false;
    } else {
        return true;
    }
}
var isEmpty = courses.every2(function(course){
    return course.coin === 0;
});
console.log(isEmpty)



/*--------------Some()---------------*/
// Duyệt qua...=> 1(vài) phần tử thoả mãn điều kiện => true/false
Array.prototype.some2 = function(callback){
    var arrayLength = this.length;
    for(var i=0; i < arrayLength; i++) {
        var result = callback(this[i], i);
        // Nếu 1 trường hợp đúng => return true
        if(result) {
            return true;
        }
    }
    return false;
    
}
var isFree = courses.some(function(course){
    return course.coin === 0;
})
console.log(isFree)



/*--------------Find()---------------*/
// Duyệt qua...=> Tìm các phần tử thoả điều kiện => Chỉ 1 phần tử đầu tiên thoả mãn điều kiện
Array.prototype.find2 = function(callback) {
    var arrayLength = this.length;
    for(var i=0; i < arrayLength; i++) {
        var result = callback(this[i], i)
        // Nếu đúng thì trả về phần tử đó
        if(result){
            return this[i];
        }
    }
}
var course = courses.find2(function(course, index) {
    return course.name === 'Ruby';
});
console.log(course)



/*--------------Filter()---------------*/
// Duyệt qua...=> Tìm các phần tử thoả điều kiện => Tất cả phần tử thoả mãn điều kiện
Array.prototype.filter2 = function(callback) {
    var output = [];
    var arrayLength = this.length;
    for(var i=0; i < arrayLength; i++) {
        var result = callback(this[i], i)
        // Nếu đúng thì thêm phần tử đó vào output
        if(result){
            output.push(this[i]);
        }
    }
    return output;
}
var course = courses.filter2(function(course, index) {
    return course.name === 'Ruby';
});
console.log(course)



/*--------------Map()---------------*/
// Duyệt qua...=> Thay đổi các phần tử/giá trị trong mảng => Mảng mới 
Array.prototype.map2 = function(cb) {
    var output = [], arrayLength = this.length;
    for (let  i = 0; i < arrayLength; i++) {
        var result = cb(this[i], i);
        output.push(result);
    }
    return output;
}
function courseHandler(course) {
    var money = course.coin;
    if(course.coin === 0) {
        money = 'Miễn phí';
    } else {
        money = money + `$`;
    }
    return {
        id: course.id,
        name: `Khóa học: ${course.name}`,
        coin: course.coin,
        textCoin: `Thành tiền: ${money}`
    }
}
var newCourses = courses.map2(courseHandler);
console.log(newCourses);
// console.log(courses.map2(function(course){
//     return courseHandler(course);
// }))




/*--------------Reduce()---------------*/
// Duyệt qua...=> Thay đổi các phần tử/giá trị trong mảng => Mảng mới
Array.prototype.reduce2 = function (callback, result) {
    let i = 0;
    // Trường hợp không truyền initialValue
    if (arguments.length < 2) { 
      i = 1; // Gán currentValue là phần tử thứ 2 của mảng
      result = this[0]; // Biến tích trữ = phần tử đầu tiên của mảng
    }

    // Khi không truyền initialValue => Sẽ lặp từ phần tử thứ 2
    // Trường hợp khi truyền initialValue
    for (; i < this.length; i++) {
      result = callback(result, this[i], i, this) // result = total: biến tích trữ, this[i]: currentValue, index, Array gốc
    }
    return result;
}

// myReduce function
function getTotalCoin(courses) {
var totalCoin = courses.reduce2(function (total, price) {
    return total + price.coin;
}, 0);
return totalCoin;
}

console.log('totalCoin:', getTotalCoin(courses)); 