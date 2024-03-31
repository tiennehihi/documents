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

// UI component
const CousreItem = ({ course, onClick }) => {
    return (
        <div className="courseItem">
            <h2 className="title" onClick={() => onClick(course)}>{course.title}</h2>
            <img src={course.image_url} alt="" />
            <p>{course.description}</p>
            <p>{course.students_count}</p>
        </div>
    )
}

// Container
function App() {
    
    const handleClick = (course) => {
        alert(course.title);
    }

    return (
        <>
            {courses.map(course => (
                <CousreItem key={course.id} course={course} onClick={handleClick} />
            ))}
        </>
    )
}




// function App() {
//     return (
//         <div className="wrapper">
//             <button 
//                 onClick={(e) => console.log(e.target)}
//             >
//                 Click me !
//             </button>
//         </div>
//     )
// }

ReactDOM.render(<App />, document.getElementById('root'));