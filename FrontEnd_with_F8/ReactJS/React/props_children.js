// function Button({ title, primary }) {
//     console.log(primary);
//     return (
//         <button>{title}</button>
//     )
// }
// function App() {
//     const title = "Click me !";
//     return (
//         <Button primary={false} title={title} />
//     )
// }



// function Input({ label, ...inputProps }) {
//     return (
//         <div>
//             <label htmlFor="">{label}</label>
//             <input {...inputProps} />
//         </div>
//     )
// }
// function App() {
//     return (
//         <Input label="Full name" placeholder="Enter name" type="text" onFocus={() => console.log(Math.random())} />
//     )
// }



// function Button({ children }) {
//     return (
//         <button>{children}</button>
//     )
// }
// function App() {
//     return (
//         <Button>Click me !</Button>
//     )
// }



// function List({ data, children }) {
//     console.log(children);
//     return (
//         <ul>
//             {data.map((item) => children(item))}
//         </ul>
//     )
// }

// function App() {
//     const cars = ['BMW', 'Honda', 'Mazda']
//     return (
//         <List data={cars}>
//             {(item) => <li key={item}>{item}</li>}
//         </List>
//     )
// }


const List = ({ data, children }) => {
    return (
        <ul>
            {data.map((item, index) => children(item, index))}
        </ul>
    )
}
function App() {
    const cars = ['BMW', 'Honda', 'Mazda'];
    return (
        <List data={cars}>
            {(item, index) => <li key={index}>{item}</li>}
        </List>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));