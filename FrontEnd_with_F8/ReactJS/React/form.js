// const Form = {
//     // Enhanced Object Literals in ES6
//     // Bất cứ function nào cũng có thể sử dụng được làm component
//     Input() {
//         return <input />
//     },
//     Checkbox() {
//         return <input type="checkbox" />
//     }
// }

// // Làm cách nào để render được Input, Checkbox => Dùng cú pháp JSX <Form.Input />
// // Lưu ý: nếu viết qua Object mà cố tình không tuân theo quy ước cũng không sao (form)
// function App() {

//     const type = 'Input';
//     console.log(Form[type]);

//     const Component = Form[type];

//     return (
//         <div className="wrapper">
//             <Component />
//         </div>
//     )
// }



// 1 component nhận nhiều prop thì cứ prop nào là func thì viết cuối cùng
// function Button({ title, href, onClick }) {
//     // Đặt biến là "let" vì biến này có thể gán lại được, neus không gán lại thì dùng "const"
//     let Component = 'button'
//     const props = {}
//     console.log(props)

//     if(href) {
//         Component = 'a'
//         props.href = href
//     }
//     if(onClick) {
//         props.onClick = onClick
//     }

//     return (
//         // Sử dụng spread
//         <Component {...props}>{title}</Component> 
//     )
// }

// function App() {
//     return (
//         <div className="wrapper">
//             <Button 
//                 title='Click me!'
//                 href='https://fullstack.edu.vn/'
//                 onClick={() => console.log(Math.random())}
//             />
//         </div>
//     )
// }




// Dùng toán tử logic để render dữ liệu
// function App() {

//     let firstAcess = true

//     return (
//         <div className="wrapper">
//             {firstAcess && <h1>Welcome to F8 !</h1>}
//         </div>
//     )
// }

// function App({ title, content }) {
//     return (
//         <div className="wrapper">
//             <h1>{title || content || 'Gia tri mac dinh'}</h1>
//         </div>
//     )
// }
// ReactDOM.render(<App title="Title" content="Content" />, document.getElementById('root'));




// function Button({ title, href, onClick }) {
//     let Component = 'button';
//     const props = {}

//     if(href) {
//         Component = 'a';
//         props.href = href;
//     }
//     if(onClick) {
//         props.onClick = onClick;
//     }

//     return (
//         <Component {...props}>{title}</Component>
//     )
// }

// function App() {
//     return (
//         <div className="wrapper">
//             <Button 
//                 title="Click me !"
//                 // href="https://fullstack.edu.vn/"
//                 onClick={() => console.log(Math.random())}
//             />
//         </div>
//     )
// }




const Form = {
    Input() {
        return <input />
    },
    Checkbox() {
        return <input type="checkbox" />
    }
}

function App() {
    
    const type = 'Input';
    console.log(Form[type]);
    
    const Component = Form[type]

    return (
        <div className="wrapper">
            <Component />
        </div>
    )
}


ReactDOM.render(<App />, document.getElementById('root'));