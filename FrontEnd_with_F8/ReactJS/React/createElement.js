
// console.log(React.version)

// Cách 1: DOM

// const h1DOM = document.createElement('h1')
// h1DOM.title = 'Hello'
// h1DOM.className = 'heading'
// h1DOM.innerText = 'Hello Guys !'
// document.body.appendChild(h1DOM)


// Element lông element
const ulDOM = document.createElement('ul')
ulDOM.id = 'ulID'
ulDOM.style = 'color: red; font-size: 30px'

const li1 = document.createElement('li')
li1.innerText = 'JavaScript'
li1.id = 'li1-id'

const li2 = document.createElement('li')
li2.innerText = 'ReactJS'

ulDOM.appendChild(li1)
ulDOM.appendChild(li2)
// document.body.appendChild(ulDOM)




// Cách 2: React.createElement(type, prop, chidlren, n)
// Đối số đầu tiên là title, đối số thứ 2 là attribute, từ đối số thứ 3 là children
// children cũng là 1 prop

// const h1React = React.createElement('h1', {
//     title: 'Hello',
//     className: 'heading'
// }, 'Helle Guys !!')

// console.dir(h1DOM);
// console.log(h1React)


const ulReact = React.createElement(
                'ul',
                {
                    id: 'ulID', // nếu không có thì để là null hoặc {}
                    style: 'color: red; font-size: 30px'
                },
                React.createElement('li', {
                    id: 'li1-id',
                    style: 'color: red; font-size: 30px'
                }, 'JavaScript'),
                React.createElement('li', null, 'ReactJS')
            )
// console.log(ulReact);



const divReact = React.createElement(
    'div', 
    {
        class: 'post-item'
    },
    React.createElement('h2', { title: 'Học React tại F8' }, 'Học ReactJS'),
    React.createElement('p', null, 'Học React từ cơ bản đến nâng cao')
)
// console.log(divReact);
