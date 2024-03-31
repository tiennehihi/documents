const data = [
    {
        title: 'Bạch tuộc nướng',
        imgUrl: '../static/bachtuocnuong.jpg'
    },
    {
        title: 'Cá thu',
        imgUrl: '../static/cathu.jpg'
    },
    {
        title: 'Cua hoàng đế',
        imgUrl: '../static/cuahoangde.jpg'
    },
    {
        title: 'Cua Alaska',
        imgUrl: '../static/cuaalaska.jpg'
    },
    {
        title: 'Hàu nướng phomai',
        imgUrl: '../static/hauphomai.jpg'
    },
    {
        title: 'Mực nang nướng',
        imgUrl: '../static/mucnang.jpg'
    },
    {
        title: 'Ốc móng tay',
        imgUrl: '../static/ocmongtay.jpg'
    },
    {
        title: 'Ốc vòi voi',
        imgUrl: '../static/ocvoivoi.jpg'
    },
    {
        title: 'Tôm hùm Alaska',
        imgUrl: '../static/tomalaska.jpg'
    }, 
    {
        title: 'Bào ngư',
        imgUrl: '../static/baongu.jpg'
    }
]
const html = document.getElementById('root')
for(const item of data) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('image-card')
    const image = document.createElement('img')
    image.src = item.imgUrl
    image.alt = item.title
    image.title = item.title

    const title = document.createElement('h3')
    title.textContent = item.title

    // Thêm tiêu đề và hình ảnh còn lại vào card
    cardDiv.appendChild(image);
    cardDiv.appendChild(title);

    // Thêm card vào danh sách
    html.appendChild(cardDiv);
}