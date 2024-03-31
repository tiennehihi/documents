const root = document.getElementById('root')


const courses = [{
        "id": 15,
        "title": "HTML CSS Pro",
        "slug": "htmlcss",
        "description": "Từ cơ bản tới chuyên sâu, thực hành 8 dự án, hàng trăm bài tập, trang hỏi đáp riêng, cấp chứng chỉ sau khóa học và mua một lần học mãi mãi.",
        "image": "courses/15/62f13d2424a47.png",
        "icon": "courses/15/62385d6c63dfa.png",
        "video_type": "upload",
        "video": null,
        "old_price": 2500000,
        "price": 1299000,
        "pre_order_price": 699000,
        "students_count": 3837,
        "is_pro": true,
        "is_coming_soon": false,
        "is_selling": true,
        "published_at": "2022-08-18T17:00:00.000000Z",
        "is_registered": false,
        "user_progress": 0,
        "last_completed_at": null,
        "image_url": "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
        "icon_url": "https://files.fullstack.edu.vn/f8-prod/courses/15/62385d6c63dfa.png",
        "video_url": "",
        "landing_page_url": "/landing/htmlcss",
        "is_pre_order": false,
        "is_published": true
    },
    {
        "id": 27,
        "title": "Ngôn ngữ tiền xử lý Sass",
        "slug": "sass",
        "description": "Đây là một khóa học nhỏ được tách ra từ 2 chương học trong khóa HTML CSS Pro. Kiến thức về Sass trong khóa này bạn có thể áp dụng ngay vào các dự án của bạn.",
        "image": "courses/27/64e184ee5d7a2.png",
        "icon": "courses/27/64e0daf212fad.png",
        "video_type": "upload",
        "video": "courses/27/oeT5zTmdk8KlHwU2meMJpnR7uihkX6OvYxnkjiB9.mp4",
        "old_price": 400000,
        "price": 299000,
        "pre_order_price": 0,
        "students_count": 0,
        "is_pro": true,
        "is_coming_soon": false,
        "is_selling": true,
        "published_at": "2023-08-19T15:06:00.000000Z",
        "is_registered": false,
        "user_progress": 0,
        "last_completed_at": null,
        "image_url": "https://files.fullstack.edu.vn/f8-prod/courses/27/64e184ee5d7a2.png",
        "icon_url": "https://files.fullstack.edu.vn/f8-prod/courses/27/64e0daf212fad.png",
        "video_url": "https://videos.fullstack.edu.vn/f8-prod/courses/27/oeT5zTmdk8KlHwU2meMJpnR7uihkX6OvYxnkjiB9.mp4",
        "landing_page_url": "/landing/sass",
        "is_pre_order": false,
        "is_published": true
    },
    {
        "id": 19,
        "title": "JavaScript Pro",
        "slug": "javascript",
        "description": "Khóa học JavaScript Pro",
        "image": "courses/19/62f13cb607b4b.png",
        "icon": "courses/19/62f13cb685c81.png",
        "video_type": "upload",
        "video": null,
        "old_price": 0,
        "price": 0,
        "pre_order_price": 0,
        "students_count": 0,
        "is_pro": true,
        "is_coming_soon": true,
        "is_selling": false,
        "published_at": "2024-02-29T17:00:00.000000Z",
        "is_registered": false,
        "user_progress": 0,
        "last_completed_at": null,
        "image_url": "https://files.fullstack.edu.vn/f8-prod/courses/19/62f13cb607b4b.png",
        "icon_url": "https://files.fullstack.edu.vn/f8-prod/courses/19/62f13cb685c81.png",
        "video_url": "",
        "landing_page_url": "/landing/javascript",
        "is_pre_order": false,
        "is_published": false
    },
    {
        "id": 20,
        "title": "NextJS Pro",
        "slug": "reactjs-pro",
        "description": "Khóa học NextJS Pro",
        "image": "courses/20/648020fc16597.png",
        "icon": "courses/20/648020fcc8000.png",
        "video_type": "upload",
        "video": null,
        "old_price": 0,
        "price": 0,
        "pre_order_price": 0,
        "students_count": 0,
        "is_pro": true,
        "is_coming_soon": true,
        "is_selling": false,
        "published_at": "2024-05-31T17:00:00.000000Z",
        "is_registered": false,
        "user_progress": 0,
        "last_completed_at": null,
        "image_url": "https://files.fullstack.edu.vn/f8-prod/courses/20/648020fc16597.png",
        "icon_url": "https://files.fullstack.edu.vn/f8-prod/courses/20/648020fcc8000.png",
        "video_url": "",
        "landing_page_url": "/landing/reactjs-pro",
        "is_pre_order": false,
        "is_published": false
    }
]


/** Cách 1: truyền props, với cách này chúng ta cần truy cập vào value và tới đúng trường giá trị cần lấy */
// function CourseItem(props) {
//     console.log(props);
//     return (
//         <div className="courses">
//             <h2 className="title">{props.value.title}</h2>
//             <p className="desc">{props.value.description}</p>
//             <img src={props.value.image_url} alt={props.value.title} className="image" />
//         </div>
//     )
// }

// const CourseItem = props => (
//     <div className="courses">
//         <h2 className="title">{props.value.title}</h2>
//         <p className="desc">{props.value.description}</p>
//         <img src={props.value.image_url} alt={props.value.title} className="image" />
//     </div>
// )

// const app = (
//     <React.Fragment>
//         {courses.map((value, index) => (
//             <CourseItem key={index} value={value} />
//         ))}
//     </React.Fragment>
// )


/** Cách 2 */
// function CourseItem({ title, description, image, studentCount }) {
//     return (
//         <div className="courses">
//             <h2 className="title">{title}</h2>
//             <p className="desc">{description}</p>
//             <p>{studentCount}</p>
//             <img src={image} alt={title} className="image" />
//         </div>
//     )
// }
// const app = (
//     <React.Fragment>
//         {courses.map((course) => (
//             <CourseItem 
//                 key={course.id}
//                 title={course.title}
//                 description={course.description}
//                 studentCount={course.students_count}
//                 image={course.image_url}
//             />
//         ))}
//     </React.Fragment>
// )


/** Cách 3: Các tình huống khi nhiều props, sử dụng distructuring, với cách này chúng ta cần nhìn đúng dữ liệu để truyền */
// function CourseItem({ course }) {
//     const { title, description, image_url, student_count } = course;
//     return (
//         <div className="courses">
//              <h2 className="title">{title}</h2>
//              <p className="desc">{description}</p>
//              <p>{student_count}</p>
//              <img src={image_url} alt={title} className="image" />
//          </div>
//     )
// }
// const app = (
//     <>
//         {courses.map((course, index) => (
//             <CourseItem key={index} course={course} />
//         ))}
//     </>
// )


/** Cách 3.1 */
const CourseItem = ({ course }) => {
    const handleClick = () => {
        alert(course.title);
        // alert(`Course ${course.title}`);
    }

    return (
        <div className="courses">
            <h2 className="title" onClick={handleClick}>{course.title}</h2>
            <p className="desc">{course.description}</p>
            <p>{courses.students_count}</p>
            <img src={course.image_url} alt={course.title} />
        </div>
    )
}
const app = (
    <>
        {courses.map((item) => (
            <CourseItem key={item.id} course={item} />
        ))}
    </>
)



/** Cách 4 */
// function CourseItem(props) {
//     return (
//         <div className="courses">
//              <h2 className="title">{props.title}</h2>
//              <p className="desc">{props.description}</p>
//              <p>{props.studentCount}</p>
//              <img src={props.image} alt={props.title} className="image" />
//          </div>
//     )
// }
// const app = (
//     <>
//         {courses.map((course) => (
//             <CourseItem 
//                 key={course.id} 
//                 title={course.title}
//                 description={course.description}
//                 studentCount={course.students_count}
//                 image={course.image_url}
//             />
//         ))}
//     </>
// )






ReactDOM.render(app, document.getElementById('root'))

