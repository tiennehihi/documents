const slideshow = document.getElementById('slider');
const title = document.querySelector('.text-heading');
const desc = document.querySelector('.text-description');

const images = ["assets/images/slider/chicago.jpg", "assets/images/slider/la.jpg", "assets/images/slider/ny.jpg"]
const titles = ["Chicago", "Los Angeles", "New York"]
const descs = ["Thank you, Chicago - A night we won't forget.", "We had the best time playing at Venice Beach!", "The atmosphere in New York is lorem ipsum."]

var index = 0;
const interval = 3000;

slideshow.style.backgroundPosition = 'top center'
slideshow.style.backgroundRepeat = 'no-repeat'
slideshow.style.backgroundSize = 'cover'

function changeContent() {
    slideshow.style.backgroundImage = "url("+ images[index] + ")";
    title.innerText = titles[index];
    desc.innerText = descs[index];
    index++;

    if(index === images.length) {
        index = 0;
    }
    // slideshow.style.animation = 'fadeIn 1s ease-in'
}
changeContent();
setInterval(changeContent, interval);   