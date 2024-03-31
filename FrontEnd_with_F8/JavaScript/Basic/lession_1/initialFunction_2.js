
var courses = [
    {
        id: 1,
        name: 'JavaScript',
        coin: 500
    },
    {
        id: 2,
        name: 'PHP',
        coin: 400
    },
    {
        id: 3,
        name: 'Java',
        coin: 700
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
        coin: 400
    },
    {
        id: 7,
        name: 'Ruby',
        coin: 0
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


Array.prototype.myForEach = function(cb){
    for(var index in this) {
        // Kiểm tra xem có phải key nằm trong Object không, nếu không phải thì không lặp qua
        if(this.hasOwnProperty(index)){
            cb(this[index], index, this)
        }
    }
}
courses.myForEach(function(course, index, array){
    console.log(index, course);
})



Array.prototype.myFilter = function(cb) {
    var output = [];
    for(var index in this) {
        if(this.hasOwnProperty(index)){
            var result = cb(this[index], index, this)
            if(result) {
                output.push(this[index])
            }
        }
    }
    return output;
}
var price = courses.myFilter(function(course, index, array){
    // console.log(course, index, array);
    return course.coin > 400;
})
console.log(price)



Array.prototype.mySome = function(cb) {
    for(var index in this){
        if(this.hasOwnProperty(index)){
            var result = cb(this[index], index, this)
            if(result){
                return true;
            }
        }
    }
    return false;
}
var isEmpty = courses.mySome(function(course){
    return course.name === 'Ruby';
})
console.log(isEmpty)



// Every cách 1
Array.prototype.myEvery = function(cb) {
    var outputLength = 0;
    for(var index in this){
        if(this.hasOwnProperty(index)){
            if(cb(this[index], index, this)){
                outputLength += 1;
            }
        }
    }
    if (outputLength < this.length) {
        return false;
    } else {
        return true;
    }
}


// Every cách 2
Array.prototype.myEvery = function(cb) {
    output = true;
    for(var index in this) {
        if(this.hasOwnProperty(index)){
            var result = cb(this[index], index, this)
            if(!result) {
                output = false;
                break;
            }
        }
    }
    return output;
}

var checkCoin = courses.myEvery(function(course, index){
    return course.coin >= 0;
})
console.log(checkCoin)