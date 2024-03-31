var courses = [
    'Javascript',
    'Ruby',
    'Html/CSS',
    'Dart',
    'PHP'
]
// courses.length = 10;

// for (var course in courses) {
//     console.log(course)
// }

// var courses = new Array(10);
// console.log(courses);
// courses.push('Javascript', 'Ruby', 'Html/CSS', 'Dart', 'PHP')
// console.log(courses);

Array.prototype.forEach2 = function(cb) {
    for(var index in this){
        if (this.hasOwnProperty(index)){
            cb(this[index], index, this)
        }
    }
}

console.log(courses.forEach2(function(course, index, array){
    console.log(course, index, array)
}))



