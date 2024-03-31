const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const tabs = $$('.tab-item')
const panes = $$('.tab-pane')
// console.log(tabs, panes)

const tabActive = $('.tab-item.active')

const line = $('.tabs .line')
// console.log(line)
line.style.left = tabActive.offsetLeft + 'px'
line.style.width = tabActive.offsetWidth + 'px'

tabs.forEach((tab, index) => {
    const pane = panes[index]

    tab.onclick = function(){
        // Mỗi lần click vào tab sẽ lấy ra được pane tương ứng với content
        // console.log(pane)

        // console.log(this)
        
        // gỡ class active trước khi add vào 
        // tìm thằng có class active và gỡ bỏ nó đi
        $('.tab-item.active').classList.remove('active')
        $('.tab-pane.active').classList.remove('active')

        line.style.left = this.offsetLeft + 'px'
        line.style.width = this.offsetWidth + 'px'

        // thêm class active
        this.classList.add('active')
        pane.classList.add('active')
    }
})
