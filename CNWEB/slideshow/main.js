const slideshow = document.getElementById("slider")
const backBtn = document.getElementById("back")
const stopBtn = document.getElementById("stop")
const playBtn = document.getElementById("play")
const nextBtn = document.getElementById("next")

const interval = 1000
var intervalID
var index = 0
const images = ['https://cdn-i.vtcnews.vn/resize/th/upload/2024/01/09/quynh2-09242173.png', 'https://kenh14cdn.com/thumb_w/660/2019/1/16/hoatran-7237-15476569125121111606547.jpg', 'https://vcdn-ngoisao.vnecdn.net/2021/01/05/casipuongly-1609845404-6326-1609845638_m_900x540.jpg']
function changeImage() {
    slideshow.style.backgroundImage = "url("+ images[index] + ")";
    index++;

    if(index === images.length) {
        index = 0;
    }

}
function play() {
    intervalID = setInterval(changeImage, interval);
}
function stop(){
    clearInterval(intervalID)
}
function next() {
    slideshow.style.backgroundImage = "url("+ images[index] + ")";
    index++;
    index %= images.length;
}
function back() {
    slideshow.style.backgroundImage = "url("+ images[index] + ")";
    if(index === 0) {
        index = images.length;
    }
    index--;
}

// Bài 2
// Khai bao DOM
const searchBtn = document.querySelector("#search-btn")
const searchModal = document.querySelector("#search-modal")
const btnClose = document.getElementById("btn-close")
const modalBody = document.getElementById("modal-body")

// Du lieu
const articles = [
  "Content & Display Patterns with Expressive CSS",
  "More code review tools (on GitHub)",
  "Resolution Independent Pixel Illustrations",
  "What's the deal with declaring font properties on @font-face?"
]



// Sự kiện
searchBtn.addEventListener('click', function() {
  searchModal.classList.add("d-block")
})

btnClose.addEventListener('click', function() {
    searchModal.classList.remove("d-block")
})



// Method
// Render
// function render() {
//     let str = ""
//     for(let article of articles) {
//         str += `<p>${article}</p>`
//     }
//     modalBody.innerHTML = str
// }

// function start() {
//     render();

// }
// start()