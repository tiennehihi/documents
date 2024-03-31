// function validateInput() {
//     var inputValue = document.getElementById('form-input').value;
//     var errorMessage = document.getElementById('error-message');

//     if (inputValue.trim() === '') {
//         errorMessage.style.display = 'block';
//     } else {
//         errorMessage.style.display = 'none';
//     }
// }

function redirectToArticle() {
  window.location.href = 'article.html';
}

const articleCards = document.querySelectorAll('.article-card')
// console.log(articleCards);
articleCards.forEach((articleCard) => {
  articleCard.addEventListener('click', redirectToArticle);
});


var backTop = document.getElementById('back-to-top');
var errorMessage = document.getElementById('error-message');

// Khi ấn nút Back To Top
function scrollToTop() {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    })
}



// Xử lý khi ấn nút Submit
function submitForm() {
    var inputValue = document.getElementById('form-input').value;
    var inputElement = document.getElementById('form-input');
    if (inputValue.trim() === '') {
        inputElement.classList.add('invalid-input')
    } else {
        inputElement.classList.remove('invalid-input')
        // Tiếp tục xử lý gửi biểu mẫu nếu có giá trị hợp lệ
        // document.forms[0].submit(); // Uncomment this line to submit the form
    }
}

// Render 
const dataModal = [
    {
        title: 'Visual Regression Testing with PhantomCSS',
        desc: 'visual-regression-testing-with-phantomcss',
        imgUrl: './assets/images/avt.png'
    },
    {
        title: 'Dear CSS-Tricks Reader, Who Are You?',
        desc: 'dear-css-tricks-reader-who-are-you',
        imgUrl: 'https://i.pinimg.com/1200x/eb/58/cc/eb58cc5cfecde2911c1bd9bb8df69ce7.jpg'
    },
    {
        title: 'The Cost of Frameworks Recap',
        desc: 'the-cost-of-frameworks-recap',
        imgUrl: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg'
    },
    {
        title: 'On Keeping Breakpoints DRY',
        desc: 'keeping-breakpoints-dry',
        imgUrl: 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-tuyet-dep-003.jpg'
    },
    {
        title: 'Getting Started with the WordPress Customizer',
        desc: 'getting-started-wordpress-customizer',
        imgUrl: 'https://media.baoquangninh.vn/upload/image/202310/medium/2137171_f1207af841cbfc6683b03f4d1fdab7ce.jpg'
    },
    {
        title: 'How Our CSS Framework Helps Enforce Accessibility',
        desc: 'how-our-css-framework-helps-enforce-accessibility',
        imgUrl: 'https://www.vivosmartphone.vn/uploads/MANGOADS/ch%E1%BB%A5p%20%E1%BA%A3nh/ki%E1%BB%83u%20ch%E1%BB%A5p%20%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20cho%20n%E1%BB%AF/kieu%20chup%20hinh%20dep%20cho%20nu%202.jpg'
    },
    {
        title: 'Creating a Web Type Lockup',
        desc: 'creating-web-type-lockup',
        imgUrl: 'https://halotravel.vn/wp-content/uploads/2020/11/cuc-hoa-mi-3.jpg'
    },
    {
        title: 'A Guide to 2016 Front-End Conferences',
        desc: '2016-front-end-conferences',
        imgUrl: 'https://kenhhomestay.com/wp-content/uploads/2021/12/dia-diem-chup-anh-cuc-hoa-mi-16.jpg'
    },
    {
        title: 'Animate box-shadow with Silky Smooth Performance',
        desc: 'animate-box-shadow-silky-smooth-performance',
        imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJbpxZVzGsFBGx08J2m8CVrPGMJiM1wa2GXA&usqp=CAU'
    }
]

const modalBodyContent = document.getElementById('modal-body__content')

dataModal.forEach(item => {
    const contentItem = document.createElement('div')
    contentItem.classList.add('modal-body__content-item')
    // contentItem.className = 'modal-body__content-item'

    const contentItemText = document.createElement('div')
    contentItemText.classList.add('modal-body__content-item-text')

    const titleLink = document.createElement('a')
    titleLink.href = '#';
    titleLink.classList.add('modal-body__content-item-title')
    titleLink.textContent = item.title;

    const lineBreak = document.createElement('br')

    const descLink = document.createElement('a')
    descLink.href = '#'
    descLink.classList.add('modal-body__content-item-desc')
    descLink.textContent = item.desc

    const image = document.createElement('img')
    image.src = item.imgUrl
    image.alt = ''

    contentItemText.appendChild(titleLink)
    contentItemText.appendChild(lineBreak)
    contentItemText.appendChild(descLink)

    contentItem.appendChild(contentItemText)
    contentItem.appendChild(image)

    modalBodyContent.appendChild(contentItem)

})


function highlightText() {
    var inputText = document.getElementById('modal-search-input').value;
    var contentItems = document.getElementsByClassName('modal-body__content-item');

    for (var i = 0; i < contentItems.length; i++) {
        var contentItemText = contentItems[i].getElementsByClassName('modal-body__content-item-text')[0];
        var titleLink = contentItemText.getElementsByClassName('modal-body__content-item-title')[0];
        var descLink = contentItemText.getElementsByClassName('modal-body__content-item-desc')[0];

        var titleText = titleLink.textContent;
        var descText = descLink.textContent;

        // Reset previous highlighting
        titleLink.innerHTML = titleText;
        descLink.innerHTML = descText;

        // Highlight matching text
        if (titleText.toLowerCase().includes(inputText.toLowerCase())) {
            // console.log(titleText, inputText);
            var highlightedTitle = titleText.replace(new RegExp(inputText, 'gi'), function (match) {
                // console.log(match)
                // console.log(titleText.replace(new RegExp(inputText, 'gi')))
                return '<span class="highlight">' + match + '</span>';
            });
            // console.log(highlightedTitle)
            titleLink.innerHTML = highlightedTitle;
        }

        if (descText.toLowerCase().includes(inputText.toLowerCase())) {
            var highlightedDesc = descText.replace(new RegExp(inputText, 'gi'), function (match) {
                return '<span class="highlight">' + match + '</span>';
            });
            descLink.innerHTML = highlightedDesc;
        }
    }
}




const searchBtn = document.querySelector("#search-btn")
const searchModal = document.querySelector("#search-modal")
const btnClose = document.getElementById("btn-close")
const modalContent = document.querySelector('.modal-content')

searchBtn.addEventListener('click', function() {
  searchModal.style.display = 'block'
})

btnClose.addEventListener('click', function() {
    searchModal.style.display = 'none'
})

searchModal.addEventListener('click', function() {
    searchModal.style.display = 'none'
})

modalContent.addEventListener('click', function (e) {
    e.stopPropagation();
})

const images = [
    "./assets/images/calendar-ios.jpg",
    "./assets/images/examdomain.png",
    "./assets/images/clock-sin-cos-trig.png"
];

const slideshowImage = document.getElementById("slideshow-image");
let currentIndex = 0;

function startSlideshow() {
    setInterval(changeImage, 2000); // Thay đổi hình ảnh sau mỗi 3 giây (3000 milliseconds)
}

function changeImage() {
    currentIndex++;
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    slideshowImage.src = images[currentIndex];
}

startSlideshow();




// Navbar mobile
const navMobile = document.querySelector('.nav-list-mobile')
const iconBar = document.querySelector('.icon-bar')

iconBar.addEventListener('click', function(){
    // navMobile.style.display = (navMobile.style.display === 'none') ? 'block' : 'none';
    navMobile.classList.toggle('open');
})