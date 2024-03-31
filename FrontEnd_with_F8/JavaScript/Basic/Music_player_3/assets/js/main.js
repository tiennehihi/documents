import { songs } from './song.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// const PLAYER_STORAGE_KEY = 'F8 - PLAYER'

const dashboard = $('.dashboard')
const playlist = $('.playlist')
const playlistBody = $('.playlist_body')
const player = $('.player')
const titleSong = $('.titleSong')
const authorSong = $('.authorSong')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const musicBar = $('.music-bar')
const rating = $('.rating')
const closeList = $('.closeList')
const quantitySong = $('.quantitySong')
const volumeSlider = $('#volumeSlider')
const highVol = $('.highVol')
// console.log(titleSong, authorSong, cdThumb, audio)
// console.log(playBtn)

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isRating: false,


    songs: [
        {
            title: 'Rolling In The Deep',
            author: 'Adele',
            songUrl: './assets/music/rolling-in-the-deep.mp3',
            imgUrl: './assets/images/rolling-in-the-deep.jpg'
        },
        {
            title: 'Lao Tâm Khổ Tứ',
            author: 'Thanh Hưng',
            songUrl: './assets/music/lao-tam-kho-tu.mp3',
            imgUrl: './assets/images/lao-tam-kho-tu.jpg'
        },
        {
            title: 'Ngày Mai Người Ta Lấy Chồng',
            author: 'Thành Đạt',
            songUrl: './assets/music/ngay-mai-nguoi-ta-lay-chong.mp3',
            imgUrl: './assets/images/ngay-mai-nguoi-ta-lay-chong.jpg',
        },
        {
            title: 'À Lôi',
            author: 'Double2T x Masew',
            songUrl: './assets/music/a-loi.mp3',
            imgUrl: './assets/images/a-loi.jpg',
        },
        {
            title: '1 Phút',
            author: 'Andiez',
            songUrl: './assets/music/1_phut.mp3',
            imgUrl: './assets/images/1-phut.jpg',
        },
        {
            title: 'Yếu Đuối',
            author: 'Hoàng Dũng',
            songUrl: './assets/music/yeu-duoi.mp3',
            imgUrl: './assets/images/yeu-duoi.jpg',
        },
        {
            title: 'Chưa bao giờ',
            author: 'Hoàng Dũng x Thu Phương',
            songUrl: './assets/music/chua-bao-gio.mp3',
            imgUrl: './assets/images/chua-bao-gio.jpg',
        },
        {
            title: 'Set Fire To The Rain',
            author: 'Adele',
            songUrl: './assets/music/set-fire-to-the-rain.mp3',
            imgUrl: './assets/images/set-fire-to-the-rain.jpg',
        },
        {
            title: 'Dynasty',
            author: 'MIIA',
            songUrl: './assets/music/Dynasty .mp3',
            imgUrl: './assets/images/dynasty.jpg',
        },
        {
            title: 'See You Again',
            author: 'Charlie Puth',
            songUrl: './assets/music/see-you-again.mp3',
            imgUrl: './assets/images/see-you-again.jpg',
        },
        {
            title: 'comethru',
            author: 'Jeremy Zucker',
            songUrl: './assets/music/comethru.mp3',
            imgUrl: './assets/images/comethru.jpg',
        },
        {
            title: 'Waiting For Love',
            author: 'Avicii',
            songUrl: './assets/music/Waiting-For-Love.mp3',
            imgUrl: './assets/images/waiting-for-love.jpg',
        },
        // {
        //     title: '',
        //     author: '',
        //     songUrl: './assets/music/.mp3',
        //     imgUrl: './assets/images/',
        // }
    ],

    render: function() {
        quantitySong.innerHTML = `<h1>My Music </h1> <p>(${this.songs.length} songs)</p>`
        var htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'itemActive' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.imgUrl}');"></div>
                        <div class="body">
                            <h3 class="title">${song.title}</h3>
                            <p class="author">${song.author}</p>
                        </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlistBody.innerHTML = htmls.join('')
        // console.log(htmls)
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        
        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        // Chữ chạy
        titleSong.addEventListener('animationiteration', () => {
            titleSong.style.animation = 'none'; // Tạm dừng animation
            void titleSong.offsetWidth; // Kích hoạt reflow
            titleSong.style.animation = null; // Khởi động animation lại
            // const textWidth = titleSong.offsetWidth;
            // titleSong.style.animationDuration = (textWidth / 50) + 's'; // Điều chỉnh tốc độ dựa trên độ dài của văn bản
        });
        // console.log(typeof titleSong)
        // const textWidth = titleSong.offsetWidth;
        // const containerWidth = titleSong.parentElement.offsetWidth;
        // const textWidth = titleSong.scrollWidth;
        // console.log(textWidth, containerWidth)
        // if(textWidth > containerWidth) {
        //     titleSong.addEventListener('animationiteration', () => {
        //     titleSong.style.animation = 'none'; // Tạm dừng animation
        //     // void titleSong.offsetWidth; // Kích hoạt reflow
        //     titleSong.style.animation = null; // Khởi động animation lại
        //     titleSong.style.animationDuration = (textWidth / 50) + 's'; // Điều chỉnh tốc độ dựa trên độ dài của văn bản
        //     });
        // }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi nhạc đang phát
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi (input chạy)
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }

        // Khi tua nhạc
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        // Khi lùi bài
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Bật tắt random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý khi hết bài 
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Bật tắt phát lại 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Khi click chọn bài
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.itemActive)')
            const optionNode = e.target.closest('.option')
            // Khi click vào song
            if(songNode || optionNode) {
                if(songNode && !optionNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(optionNode) {
                    alert('Option chưa có gì !!!')
                }
            }
        }

        // Khi click vào trái tim 
        rating.onclick = function(e) {
            _this.isRating = !_this.isRating
            rating.classList.toggle('rated', _this.isRating)
        }

        // Khi click thanh bar
        musicBar.onclick = function(e) {
            playlist.style.animation = 'FadeIn .4s ease-in-out'
            playlist.style.display = 'block';
            dashboard.style.animation = 'FadeOut .4s ease-in-out'
            dashboard.style.display = 'none';
        }

        // Khi close list nhạc
        closeList.onclick = function(e) {
            dashboard.style.animation = 'FadeIn .4s ease-in-out'
            playlist.style.display = 'none';
            playlist.style.animation = 'FadeOut .4s ease-in-out'
            dashboard.style.display = 'block';
        }

        // Diều chỉnh âm lượng
        volumeSlider.addEventListener('input', function() {
            const newVolume = parseFloat(volumeSlider.value) / 100;
            // console.log(newVolume);
            audio.volume = newVolume;
            if(newVolume <= 0) {
                highVol.classList.remove('fa-volume-up')
                highVol.classList.remove('fa-volume-down')
                highVol.classList.add('fa-volume-mute')
            }
            else if(newVolume > 0 && newVolume <= 0.6) {
                highVol.classList.remove('fa-volume-up')
                highVol.classList.remove('fa-volume-mute')
                highVol.classList.add('fa-volume-down')
            }
            else if (newVolume > 0.6) {
                highVol.classList.remove('fa-volume-mute')
                highVol.classList.remove('fa-volume-down')
                highVol.classList.add('fa-volume-up')
            }
        })

        // Khi click vào nút âm lượng 
        highVol.onclick = function(e) {
            const newVolume = parseFloat(volumeSlider.value) / 100;
            // console.log(newVolume);
            // audio.volume = newVolume;
            if(highVol.classList.contains('fa-volume-up') || highVol.classList.contains('fa-volume-down')){
                highVol.classList.remove('fa-volume-up')
                highVol.classList.remove('fa-volume-down')
                highVol.classList.add('fa-volume-mute')
                audio.volume = 0
            }
            else if(highVol.classList.contains('fa-volume-mute')){
                if(newVolume > 0 && newVolume <= 0.6) {
                    highVol.classList.remove('fa-volume-mute')
                    highVol.classList.add('fa-volume-down')
                } else if (newVolume > 0.6) {
                    highVol.classList.remove('fa-volume-mute')
                    highVol.classList.add('fa-volume-up')
                }
                audio.volume = newVolume
            }
        }
    },

    loadCurrentSong: function() {
        titleSong.textContent = this.currentSong.title
        authorSong.textContent = this.currentSong.author
        cdThumb.style.backgroundImage = `url('${this.currentSong.imgUrl}')`
        audio.src = this.currentSong.songUrl;
    },

    // Chuyển bài sau
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // Chuyển bài trước
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // Random
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex    
        this.loadCurrentSong();
    },

    // Chạy chữ
    srollTitle: function() {
        // titleSong.addEventListener('animationiteration', () => {
        //     const textWidth = titleSong.offsetWidth;
        //     titleSong.style.animationDuration = (textWidth / 50) + 's'; // Điều chỉnh tốc độ dựa trên độ dài của văn bản
        //     titleSong.style.animation = 'none'; // Tạm dừng animation
        //     void titleSong.offsetWidth; // Kích hoạt reflow
        //     titleSong.style.animation = null; // Khởi động animation lại
        // });
        // const valueTitle = Object.values(titleSong)
        // console.log(valueTitle.length)
    },

    

    start: function() {
        // Định nghĩa các thuộc tính
        this.defineProperties()

        // Lắng nghe và sử lý các sự kiện (DOM events)
        this.handleEvents();

        // TẢi thông tin bài hát đầu tiên vào UI khi chạy app
        this.loadCurrentSong();

        this.srollTitle();

        // Render ra view
        this.render();
    }
}

app.start()