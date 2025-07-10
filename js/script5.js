// ایجاد ذرات متحرک
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // اندازه تصادفی بین 2 تا 8 پیکسل
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // موقعیت تصادفی
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // تاخیر تصادفی در انیمیشن
        particle.style.animationDelay = `${Math.random() * 15}s`;

        container.appendChild(particle);
    }
}

// مقداردهی اولیه سوایپر
function initSwiper() {
    new Swiper('.swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
    });
}

// متغیرهای صدا و انیمیشن
const staticSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-radio-static-1091.mp3');
const tuningSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-radio-tuning-284.mp3');
const tuningOverlay = document.getElementById('tuningOverlay');
const currentFrequency = document.getElementById('currentFrequency');

// فرکانس‌های ایستگاه‌های رادیویی
const stationFrequencies = {
    'رادیو ایران': '93.5',
    'رادیو فرهنگ': '106.7',
    'رادیو جوان': '103.5',
    'رادیو ورزش': '107.5',
    'رادیو قرآن': '89.5',
    'رادیو تهران': '94.0',
    'رادیو پیام': '90.5',
    'رادیو نمایش': '101.5',
    'رادیو سلامت': '102.0',
    'رادیو گفتگو': '103.0',
    'رادیو اقتصاد': '98.5',
    'رادیو البرز': '91.0'
};

// تابع تغییر ایستگاه با افکت
function changeStationWithEffect(stationName) {
    // نمایش انیمیشن
    tuningOverlay.classList.add('active');

    // پخش صداهای افکت
    staticSound.currentTime = 0;
    staticSound.play();
    tuningSound.currentTime = 0;
    tuningSound.play();

    // به روزرسانی فرکانس نمایشی
    const targetFrequency = stationFrequencies[stationName] || '---';
    animateFrequencyChange(targetFrequency);

    // بعد از 1.5 ثانیه انیمیشن را مخفی می‌کنیم
    setTimeout(() => {
        tuningOverlay.classList.remove('active');
        staticSound.pause();
        tuningSound.pause();

        // تغییر واقعی ایستگاه
        const stationCards = document.querySelectorAll('.station-card');
        stationCards.forEach(c => c.classList.remove('active'));
        document.querySelector('.station-name').textContent = stationName;

        // پیدا کردن کارت ایستگاه فعلی و فعال کردن آن
        const currentCard = Array.from(stationCards).find(card => {
            return card.querySelector('.station-title').textContent === stationName;
        });

        if (currentCard) {
            currentCard.classList.add('active');
            const imgSrc = currentCard.querySelector('.station-image').src;
            document.querySelector('.station-logo').src = imgSrc;
        }
    }, 1500);
}

// انیمیشن تغییر فرکانس
function animateFrequencyChange(targetFrequency) {
    let current = 0;
    const steps = 10;
    const stepTime = 100;
    const startFrequency = parseFloat(currentFrequency.textContent) || 80;
    const endFrequency = parseFloat(targetFrequency);

    for (let i = 0; i <= steps; i++) {
        setTimeout(() => {
            const progress = i / steps;
            const freq = startFrequency + (endFrequency - startFrequency) * progress;
            currentFrequency.textContent = freq.toFixed(1);
        }, i * stepTime);
    }
}

// کنترل‌های پخش کننده
function setupPlayerControls() {
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    let isPlaying = true;

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    });

    // کنترل حجم صدا
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');

    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        volumeIcon.className = volume == 0 ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });

    // انتخاب ایستگاه رادیویی
    const stationCards = document.querySelectorAll('.station-card');
    stationCards.forEach(card => {
        card.addEventListener('click', () => {
            const stationName = card.querySelector('.station-title').textContent;
            changeStationWithEffect(stationName);
        });
    });

    // دکمه‌های قبلی و بعدی
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        const currentCard = document.querySelector('.station-card.active');
        if (currentCard) {
            const prevCard = currentCard.previousElementSibling ||
                currentCard.parentElement.lastElementChild;
            if (prevCard) {
                const stationName = prevCard.querySelector('.station-title').textContent;
                changeStationWithEffect(stationName);
            }
        }
    });

    nextBtn.addEventListener('click', () => {
        const currentCard = document.querySelector('.station-card.active');
        if (currentCard) {
            const nextCard = currentCard.nextElementSibling ||
                currentCard.parentElement.firstElementChild;
            if (nextCard) {
                const stationName = nextCard.querySelector('.station-title').textContent;
                changeStationWithEffect(stationName);
            }
        }
    });
}

// اجرای توابع هنگام لود صفحه
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initSwiper();
    setupPlayerControls();
});
// مدیریت کلیک روی تب‌های دسته‌بندی
function setupCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // حذف کلاس active از همه تب‌ها
            categoryTabs.forEach(t => t.classList.remove('active'));

            // افزودن کلاس active به تب انتخاب شده
            tab.classList.add('active');

            // اینجا می‌توانید کدهای مرتبط با فیلتر ایستگاه‌ها بر اساس دسته‌بندی را اضافه کنید
            const category = tab.textContent.trim();
            console.log(`دسته‌بندی انتخاب شده: ${category}`);
        });
    });
}

// فراخوانی تابع در رویداد لود صفحه
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initSwiper();
    setupPlayerControls();
    setupCategoryTabs(); // اضافه کردن این خط
});
