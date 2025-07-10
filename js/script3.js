document.addEventListener('DOMContentLoaded', function() {
    // ایجاد ذرات نورانی
    const lightEffects = document.getElementById('lightEffects');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('light-particle');
        particle.style.width = `${Math.random() * 200 + 100}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100 + 100}%`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        lightEffects.appendChild(particle);
    }
    
    // ایجاد ویژوالایزر
    const visualizer = document.getElementById('visualizer');
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.classList.add('visualizer-bar');
        bar.style.setProperty('--i', i);
        bar.style.height = `${Math.random() * 30 + 10}%`;
        visualizer.appendChild(bar);
    }
    
    // اسلایدر آلبوم‌ها
    const swiper = new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        freeMode: true,
        loop: true,
    });
    
    // متغیرهای پخش کننده
    let isPlaying = false;
    let currentSong = null;
    let progressInterval;
    let currentLyricIndex = 0;
    let vocalEnabled = true;
    
    // عناصر پخش کننده
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');
    const vocalBtn = document.getElementById('vocalBtn');
    const lyricsBtn = document.getElementById('lyricsBtn');
    const karaokeBtn = document.getElementById('karaokeBtn');
    const saveBtn = document.getElementById('saveBtn');
    const lyricsSection = document.getElementById('lyricsSection');
    const lyricsContent = document.getElementById('lyricsContent');
    const karaokeMode = document.getElementById('karaokeMode');
    const karaokeLyrics = document.getElementById('karaokeLyrics');
    const closeLyrics = document.getElementById('closeLyrics');
    const closeKaraoke = document.getElementById('closeKaraoke');
    const albumArt = document.getElementById('albumArt');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const songAlbum = document.getElementById('songAlbum');
    const lyricsSongTitle = document.getElementById('lyricsSongTitle');
    
    // دکمه پخش/توقف
    playBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            startPlayback();
        } else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            clearInterval(progressInterval);
        }
    });
    
    // شروع پخش آهنگ
    function startPlayback() {
        let progress = 0;
        durationEl.textContent = '3:45';
        currentLyricIndex = 0;
        
        // به‌روزرسانی پیشرفت آهنگ
        progressInterval = setInterval(function() {
            progress += 0.5;
            progressBar.style.width = progress + '%';
            
            // محاسبه زمان جاری
            const currentSeconds = Math.floor((progress / 100) * 225);
            const minutes = Math.floor(currentSeconds / 60);
            const seconds = currentSeconds % 60;
            currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            
            // به‌روزرسانی متن آهنگ
            updateLyrics(progress);
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
                isPlaying = false;
                progressBar.style.width = '0%';
                currentTimeEl.textContent = '0:00';
            }
        }, 1000);
    }
    
    // کنترل حجم صدا
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        if (volume == 0) {
            volumeIcon.classList.remove('fa-volume-up');
            volumeIcon.classList.add('fa-volume-mute');
        } else {
            volumeIcon.classList.remove('fa-volume-mute');
            volumeIcon.classList.add('fa-volume-up');
        }
    });
    
    // قطع صدای خواننده
    vocalBtn.addEventListener('click', function() {
        vocalEnabled = !vocalEnabled;
        if (vocalEnabled) {
            this.innerHTML = '<i class="fas fa-user-slash"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-user"></i>';
        }
    });
    
    // نمایش متن آهنگ
    lyricsBtn.addEventListener('click', function() {
        lyricsSection.style.display = 'block';
    });
    
    // بستن متن آهنگ
    closeLyrics.addEventListener('click', function() {
        lyricsSection.style.display = 'none';
    });
    
    // نمایش حالت کراوکه
    karaokeBtn.addEventListener('click', function() {
        karaokeMode.style.display = 'flex';
    });
    
    // بستن حالت کراوکه
    closeKaraoke.addEventListener('click', function() {
        karaokeMode.style.display = 'none';
    });
    
    // ذخیره شعر
    saveBtn.addEventListener('click', function() {
        alert('متن آهنگ با موفقیت ذخیره شد!');
    });
    
    // کلیک روی کارت‌های موسیقی
    const musicCards = document.querySelectorAll('.music-card');
    musicCards.forEach(card => {
        card.addEventListener('click', function() {
            const song = this.getAttribute('data-song');
            const artist = this.getAttribute('data-artist');
            const album = this.getAttribute('data-album');
            const cover = this.getAttribute('data-cover');
            const lyrics = this.getAttribute('data-lyrics');
            
            if (song) {
                // تغییر اطلاعات آهنگ
                songTitle.textContent = song;
                songArtist.textContent = artist;
                songAlbum.textContent = `آلبوم: ${album}`;
                albumArt.src = cover;
                lyricsSongTitle.textContent = song;
                
                // تنظیم متن آهنگ
                const lyricsLines = lyrics.split('...');
                lyricsContent.innerHTML = '';
                karaokeLyrics.innerHTML = '';
                
                lyricsLines.forEach(line => {
                    if (line.trim()) {
                        const lyricLine = document.createElement('div');
                        lyricLine.classList.add('lyrics-line');
                        lyricLine.textContent = line.trim() + '...';
                        lyricsContent.appendChild(lyricLine);
                        
                        const karaokeLine = document.createElement('div');
                        karaokeLine.classList.add('karaoke-line');
                        karaokeLine.textContent = line.trim() + '...';
                        karaokeLyrics.appendChild(karaokeLine);
                    }
                });
                
                // شروع پخش آهنگ جدید
                if (isPlaying) {
                    clearInterval(progressInterval);
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                    isPlaying = false;
                }
                
                playBtn.click();
            }
        });
    });
    
    // به‌روزرسانی متن آهنگ بر اساس پیشرفت
    function updateLyrics(progress) {
        const lyricsLines = document.querySelectorAll('.lyrics-line');
        const karaokeLines = document.querySelectorAll('.karaoke-line');
        
        // محاسبه خط فعلی بر اساس پیشرفت آهنگ
        const newIndex = Math.floor((progress / 100) * lyricsLines.length);
        
        if (newIndex !== currentLyricIndex && newIndex < lyricsLines.length) {
            // غیرفعال کردن خط قبلی
            if (currentLyricIndex >= 0 && currentLyricIndex < lyricsLines.length) {
                lyricsLines[currentLyricIndex].classList.remove('active');
                karaokeLines[currentLyricIndex].classList.remove('active');
            }
            
            // فعال کردن خط جدید
            lyricsLines[newIndex].classList.add('active');
            karaokeLines[newIndex].classList.add('active');
            
            // اسکرول به خط فعال
            lyricsLines[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            karaokeLines[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            currentLyricIndex = newIndex;
        }
    }
    
    // کلیک روی نوار پیشرفت
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.addEventListener('click', function(e) {
        if (isPlaying) {
            const rect = this.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            progressBar.style.width = `${pos * 100}%`;
            
            // محاسبه زمان جدید
            const newTime = Math.floor(pos * 225);
            const minutes = Math.floor(newTime / 60);
            const seconds = newTime % 60;
            currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            
            // به‌روزرسانی متن آهنگ
            currentLyricIndex = Math.floor(pos * lyricsContent.children.length);
            updateLyrics(pos * 100);
        }
    });
});
// ذخیره وضعیت پخش در localStorage
function savePlayerState() {
    const state = {
        currentSong: currentSong,
        isPlaying: isPlaying,
        volume: volumeSlider.value,
        progress: progressBar.style.width,
        currentTime: currentTimeEl.textContent
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
}

// بازیابی وضعیت پخش
function loadPlayerState() {
    const state = JSON.parse(localStorage.getItem('musicPlayerState'));
    if (state) {
        currentSong = state.currentSong;
        isPlaying = state.isPlaying;
        volumeSlider.value = state.volume;
        progressBar.style.width = state.progress;
        currentTimeEl.textContent = state.currentTime;
        
        if (isPlaying) {
            startPlayback();
        }
    }
}

// فراخوانی هنگام لود صفحه
document.addEventListener('DOMContentLoaded', loadPlayerState);