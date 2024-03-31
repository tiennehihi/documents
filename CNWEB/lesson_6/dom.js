let menua = document.querySelector(".menu ul")
menua.style.display = "flex"
let str = `<li><a href="#">Guides</a></li>`
menua.innerHTML += str

// var newE = document.createElement("li")
// newE.textContent = "Guides"
// menua.appendChild(newE)

function changeColor() {
    let warn = document.querySelector('.warning')
    warn.style.backgroundColor = 'yellow'
    warn.style.color = 'red'
}