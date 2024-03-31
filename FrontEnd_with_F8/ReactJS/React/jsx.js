const root = document.getElementById('root')



// const reactCourse = 'ReactJS'
// const ulReact = <ul>
//     <li>JavaScript</li>
//     <li>{reactCourse}</li>
// </ul>
// ReactDOM.render(ulReact, root)




// const courses = [
//     {
//         name: 'HTML, CSS'
//     },
//     {
//         name: 'Responsive web design'
//     },
//     {
//         name: 'ReactJS'
//     }
// ]
// const ul = <ul>
//     {courses.map(course => {
//         return <li>{course.name}</li>
//     })}
// </ul>

// ReactDOM.render(ul, root)



// const courses = ['HTML, CSS', 'Responsive web design', 'ReactJS']
// const ul = <ul>
//     {courses.map((course, index) => {
//         return <li key={index}>{course}</li>
//     })}
// </ul>
// ReactDOM.render(ul, root)
// Trong hàm map, khi tạo các thành phần <li>, bạn không cần truy cập vào phần tử của mảng course bằng cách sử dụng chỉ số index. 
// Thay vào đó, bạn có thể truyền giá trị course trực tiếp vào thành phần <li>. 
// Bạn cũng nên thêm thuộc tính key với giá trị index cho mỗi thành phần <li> để giúp React xác định các phần tử trong danh sách một cách chính xác






const app = (
    <div className="post-list">
        <PostItem
            image="https://2sao.vietnamnetjsc.vn/images/2020/08/18/10/27/phuong-ly-2.jpg"
            title="UI thân thiện người dùng"
            desc="Video này chúng ta sẽ tìm hiểu cách tạo ra React components thông qua việc hiểu bản chất đó là sử dụng React.createElement với type là function/class."
            publishAt="Một ngày trước"
            callback = {(random) => {
                console.log(random);
            }}
        />
        <PostItem
            image="https://2sao.vietnamnetjsc.vn/images/2020/08/18/10/27/phuong-ly-2.jpg"
            title="UI thân thiện người dùng"
            desc="Video này chúng ta sẽ tìm hiểu cách tạo ra React components thông qua việc hiểu bản chất đó là sử dụng React.createElement với type là function/class."
            publishAt="Một ngày trước"
        />
        <PostItem
            image="https://2sao.vietnamnetjsc.vn/images/2020/08/18/10/27/phuong-ly-2.jpg"
            title="UI thân thiện người dùng"
            desc="Video này chúng ta sẽ tìm hiểu cách tạo ra React components thông qua việc hiểu bản chất đó là sử dụng React.createElement với type là function/class."
            publishAt="Một ngày trước"
        />
    </div>
)

// // const contain = document.querySelector('.container')
// // const root = ReactDOM.createRoot(contain)
// // root.render(app)

ReactDOM.render(app, document.getElementById('root'))



// Dùng distructuring
function PostItem({
    image,
    title,
    desc,
    publishAt,
    callback = () => {},
}) {

    callback()

    return (
        <div>
            <img src={image} alt={title} style={{ width: "700px", height: "auto" }}/>
            <h1 className="post-title">{title}</h1>
            <p className="post-desc">{desc}</p>
            <p className="post-published">{publishAt}</p>
        </div>
    )
}



// function PostItem(props) {

//     if(typeof props.callback === 'function')
//         props.callback(Math.random() * 100)

//     return (
//         <div>
//             <img src={props.image} alt={props.title} style={{ width: "700px", height: "auto" }}/>
//             <h1 className="post-title">{props.title}</h1>
//             <p className="post-desc">{props.desc}</p>
//             <p className="post-published">{props.publishAt}</p>
//         </div>
//     )
// }









// function PostItem() {
//     return (
//         <>
//             {/* <Form/> */}
//             <Image image="https://2sao.vietnamnetjsc.vn/images/2020/08/18/10/27/phuong-ly-2.jpg"/>
//             <PostTitle title="UI thân thiện người dùng"/>
//             <PostDesc desc="Video này chúng ta sẽ tìm hiểu cách tạo ra React components thông qua việc hiểu bản chất đó là sử dụng React.createElement với type là function/class."/>
//             <PostPublished publishAt="Một ngày trước"/>
//         </>
//     )
// }

// function Form() {
//     return (
//         <>
//             <label htmlFor="email">Email</label>
//             <input type="text" id="email" />
//         </>
//     )
// }

// function Image(props) {
//     return (
//         <img src={props.image} alt="Ảnh CUTE" style={{ width: "700px", height: "auto" }}/>
//     )
// }

// function PostTitle(props) {
//     return (
//         <h1 className="post-title">{props.title}</h1>
//     )
// }

// function PostDesc(props) {
//     return (
//         <p className="post-desc">{props.desc}</p>
//     )
// }

// function PostPublished(props) {
//     return (
//         <p className="post-published">{props.publishAt}</p>
//     )
// }