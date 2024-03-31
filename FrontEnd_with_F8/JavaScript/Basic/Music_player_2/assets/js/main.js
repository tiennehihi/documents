const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8 - PLAYER'

const playlist = $('.playlist')
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const thumb = $('.thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0, 
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: 'Có anh ở đây rồi',
            singer: 'Ness remix',
            path: './assets/music/coanhodayroi.mp3',
            image: './assets/img/coanhodayroi.jpg',
        },
        {
            name: 'Khóc cùng em',
            singer: 'Thai Hoang remix',
            path: './assets/music/khoccungemTH.mp3',
            image: './assets/img/khoccungem.jpg',
        },
        {
            name: 'Making my way',
            singer: 'Ness remix',
            path: './assets/music/makingmywayNess.mp3',
            image: './assets/img/makingmyway.jpg',
        },
        {
            name: 'Mật ngọt',
            singer: 'Nam Con remix',
            path: './assets/music/matngotNamcon.mp3',
            image: './assets/img/matngot.jpg',
        },
        {
            name: 'Bà Tôi',
            singer: 'Thai Hoang remix',
            path: './assets/music/baToiTH.mp3',
            image: './assets/img/batoi.jpg',
        },
        {
            name: 'Ngày mai em đi mất',
            singer: 'VuMinhQuan remix',
            path: './assets/music/ngaymaiemdimatVuminhquan.mp3',
            image: './assets/img/ngaymaiemdimat.jpg',
        },
        {
            name: 'Người khóc cùng anh',
            singer: 'Thai Hoang remix',
            path: './assets/music/nguoikhoccunganhTH.mp3',
            image: './assets/img/nguoikhoccunganh.jpg',
        },
        {
            name: 'Những lời dối gian',
            singer: 'Thai Hoang remix',
            path: './assets/music/nhungloidoigianTH.mp3',
            image: './assets/img/nhungloidoigian.jpg',
        },
        {
            name: 'Nothin\'s On Me',
            singer: 'Silver Smoke Remix',
            path: './assets/music/nothinonmesilversmoke.mp3',
            image: './assets/img/nothinonme.jpg',
        },
        {
            name: 'Tòng phu',
            singer: 'Thai Hoang remix',
            path: './assets/music/ongphuTH.mp3',
            image: './assets/img/tongphu.jpg',
        },
        {
            name: 'Sống xa anh chẳng dễ dàng',
            singer: 'Thai Hoang remix',
            path: './assets/music/songxaanhftlancuoiTH.mp3',
            image: './assets/img/songxaanh.jpg',
        },
        {
            name: 'Waiting for you',
            singer: 'Thai Hoang remix',
            path: './assets/music/waitingforuTH.mp3',
            image: './assets/img/waitingforyou.jpg',
        },
        {
            name: 'Xem như em chẳng may',
            singer: 'Thai Hoang remix',
            path: './assets/music/xemnhuemchangmayTH.mp3',
            image: './assets/img/xemnhuemchangmay.jpg',
        },
        {
            name: 'Thằng hầu',
            singer: 'Thai Hoang remix',
            path: './assets/music/thanghauTH.mp3',
            image: './assets/img/thanghau.jpg',
        },
        {
            name: 'Cố nhân tình',
            singer: 'Thai Hoang remix',
            path: './assets/music/conhantinhTH.mp3',
            image: './assets/img/conhantinh.jpg',
        },
    ], 

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    updateSong: function(){

    },

    // Render ra view
    render: function(){
        // dùng map() chọc vào songs để lấy ra những bài hát
        var htmls = [`<div class="up-next">Playlist (${this.songs.length} songs)</div>`]
        htmls.push(...this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
            // console.log(htmls)
        }))


        // render: function(){
        //     // dùng map() chọc vào songs để lấy ra những bài hát
        //     var htmls = this.songs.map((song, index) => {
        //         return `
        //             <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        //                 <div class="thumb" style="background-image: url('${song.image}');"></div>
        //                 <div class="body">
        //                     <h3 class="title">${song.name}</h3>
        //                     <p class="author">${song.singer}</p>
        //                 </div>
        //                 <div class="option">
        //                     <i class="fas fa-ellipsis-h"></i>
        //                 </div>
        //             </div>
        //         `;
        //     })
        playlist.innerHTML = htmls.join('')
        console.log(htmls.join(''))
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function(){
        const _this = this  // lưu biến this ngoài handleEvents vào _this
        const cdWidth = cd.offsetWidth

        // thumbAnimate = thumb.animate([
        //     { transform: 'rotate(360deg)' }
        // ], {
        //     duration: 10000,      // Thời gian quay
        //     iterations: Infinity,  // quay bao nhiêu lần (vô hạn)
        // })
        // thumbAnimate.pause()

        // Xử lý CD quay / dừng
        // cdThumbAnimate = cdThumb.animate([
        //     { transform: 'rotate(360deg)' }
        // ], {
        //     duration: 10000,      // Thời gian quay
        //     iterations: Infinity,  // quay bao nhiêu lần (vô hạn)
        // })
        // cdThumbAnimate.pause()

        // cuộn, xử lý khi cuộn lên thì ẩn đĩa nhạc
        // document.onscroll = function(){
        //     // console.log(window.scrollY)
        //     // console.log(document.documentElement.scrollTop)
        //     const scrollTop = window.scrollY || document.documentElement.scrollTop;
        //     const newCdWidth = cdWidth - scrollTop;
        //     // console.log(newCdWidth)
        //     cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;    // Nếu newCdWidth>0 thì + px, nếu âm thì set = 0
        //     cd.style.opacity = newCdWidth / cdWidth;
        // }

        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }

        cdThumb.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            // thumbAnimate.play();
            // cdThumbAnimate.play();
        }

        // console.log(cdThumbAnimate)

        // Khi song dừng lại
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            // thumbAnimate.pause();
            // cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua nhạc
        progress.oninput = function(e) {
            // console.log(audio.duration / 100 * e.target.value)
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi lùi bài
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong(); 
        }

        // Xử lý bật / tắt random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (!_this.isRandom){
                _this.nextSong();
            } else {
                _this.playRandomSong();
            }
            audio.play();
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click()
            }
        }

        // Xử lý bật / tắt phát lại
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            // Xử lý khi click vào song
            if(songNode || optionNode){
                // console.log(e.target)
                // Xử lý khi click vào song
                if(songNode && !optionNode){
                    // console.log(songNode.getAttribute('data-index'))
                    // console.log(songNode.dataset.index)     // Đã đặt data-index thì dùng dataset
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    _this.scrollToActiveSong();
                    audio.play()
                }
                // Xử lý khi click vào song option
                if(optionNode){
                    console.log(e.target)
                }
            }
        }
    },
    
    
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },

    

    // Tải bài hát hiện tại
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        

        document.title = `${this.currentSong.name} - ${this.currentSong.singer}`
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    // Chuyển bài
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    // Lùi bài
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    // Random
    playRandomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        // console.log(newIndex);
        this.currentIndex = newIndex;

        this.loadCurrentSong();
    },

    // Phát lại bài
    // playRepeatSong: function(){
    //     if(this.isRepeat) {
    //         audio.play()
    //     } else {
    //         this.nextSong();
    //     }
    //     this.loadCurrentSong();
    // },


    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe và sử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render Playlist
        this.render();

        // Hiển thị trạng thái ban đầu của btn repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }

}

app.start()