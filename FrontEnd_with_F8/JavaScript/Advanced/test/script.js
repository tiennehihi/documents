// Tagged template literals

// function highlight(...rest) {
//     console.log(rest)
// }

// const brand = 'F8'
// const course = 'JavaScript'

// highlight`Học lập trình ${course} tại ${brand} !`

function highlight([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => [...acc, `<strong>${cur}</strong>`, strings.shift()], 
        [first]
    ).join('')
}

const brand = 'F8'
const course = 'JavaScript'

const html = highlight`Học lập trình ${course} tại ${brand} !`
console.log(html)

const output = document.querySelector('#output')
output.innerHTML = html