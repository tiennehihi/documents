const arr = [null, 0, false, true, 'abc', '', undefined, 123];

const filteredArr = arr.filter(x => x && x !== true || x === 0);

console.log(filteredArr);