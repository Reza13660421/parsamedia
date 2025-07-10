document.addEventListener('DOMContentLoaded', function () {
    // لیست کامل کانال‌های سراسری و استانی با لوگوهای رسمی
    const allChannels = {
        سراسری: [
            { id: 'irinn', name: 'شبکه خبر', logo: 'https://www.irib.ir/logo/irinn.png', category: 'خبری' },
            { id: 'channel1', name: 'شبکه یک', logo: 'https://www.irib.ir/logo/channel1.png', category: 'عمومی' },
            { id: 'channel2', name: 'شبکه دو', logo: 'https://www.irib.ir/logo/channel2.png', category: 'عمومی' },
            { id: 'channel3', name: 'شبکه سه', logo: 'https://www.irib.ir/logo/channel3.png', category: 'ورزشی' },
            { id: 'channel4', name: 'شبکه چهار', logo: 'https://www.irib.ir/logo/channel4.png', category: 'علمی' },
            { id: 'channel5', name: 'شبکه پنج', logo: 'https://www.irib.ir/logo/channel5.png', category: 'خبری' },
            { id: 'varzesh', name: 'شبکه ورزش', logo: 'https://www.irib.ir/logo/varzesh.png', category: 'ورزشی' },
            { id: 'namava', name: 'نمایش', logo: 'https://www.irib.ir/logo/namava.png', category: 'فیلم' },
            { id: 'mostanad', name: 'مستند', logo: 'https://www.irib.ir/logo/mostanad.png', category: 'مستند' },
            { id: 'quran', name: 'قرآن', logo: 'https://www.irib.ir/logo/quran.png', category: 'مذهبی' },
            { id: 'amouzesh', name: 'آموزش', logo: 'https://www.irib.ir/logo/amouzesh.png', category: 'آموزشی' },
            { id: 'koodak', name: 'کودک', logo: 'https://www.irib.ir/logo/koodak.png', category: 'کودک' }
        ],
        استانی: [
            { id: 'tehran', name: 'شبکه تهران', logo: 'https://www.irib.ir/logo/tehran.png' },
            { id: 'isfahan', name: 'شبکه اصفهان', logo: 'https://www.irib.ir/logo/isfahan.png' },
            { id: 'fars', name: 'شبکه فارس', logo: 'https://www.irib.ir/logo/fars.png' },
            { id: 'khorasan', name: 'شبکه خراسان', logo: 'https://www.irib.ir/logo/khorasan.png' },
            { id: 'khozestan', name: 'شبکه خوزستان', logo: 'https://www.irib.ir/logo/khozestan.png' },
            { id: 'azarbaijan', name: 'شبکه آذربایجان', logo: 'https://www.irib.ir/logo/azarbaijan.png' },
            { id: 'kerman', name: 'شبکه کرمان', logo: 'https://www.irib.ir/logo/kerman.png' },
            { id: 'hamedan', name: 'شبکه همدان', logo: 'https://www.irib.ir/logo/hamedan.png' },
            { id: 'gilan', name: 'شبکه گیلان', logo: 'https://www.irib.ir/logo/gilan.png' },
            { id: 'mazandaran', name: 'شبکه مازندران', logo: 'https://www.irib.ir/logo/mazandaran.png' },
            { id: 'kordestan', name: 'شبکه کردستان', logo: 'https://www.irib.ir/logo/kordestan.png' },
            { id: 'lorestan', name: 'شبکه لرستان', logo: 'https://www.irib.ir/logo/lorestan.png' }
        ]
    };

    // پر کردن کانال‌های سراسری
    const nationalChannelsContainer = document.getElementById('nationalChannels');
    allChannels.سراسری.forEach(channel => {
        const channelCard = createChannelCard(channel);
        nationalChannelsContainer.appendChild(channelCard);
    });

    // پر کردن کانال‌های استانی
    const provincialChannelsContainer = document.getElementById('provincialChannels');
    allChannels.استانی.forEach(channel => {
        const channelCard = createChannelCard(channel);
        provincialChannelsContainer.appendChild(channelCard);
    });

    // تابع ایجاد کارت کانال
    function createChannelCard(channel) {
        const channelCard = document.createElement('div');
        channelCard.className = 'channel-card';
        channelCard.setAttribute('data-channel', channel.id);
        channelCard.setAttribute('data-logo', channel.logo);
        channelCard.setAttribute('data-title', channel.name);

        channelCard.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}" class="channel-poster" onerror="this.src='https://via.placeholder.com/180x100?text=${channel.name}'">
                <div class="channel-overlay">
                    <h3 class="channel-title">${channel.name}</h3>
                </div>
            `;

        channelCard.addEventListener('click', function () {
            changeChannel(channel.id, channel.logo, channel.name);
        });

        return channelCard;
    }

    // پر کردن منوی انتخاب کانال برای ضبط
    const channelSelect = document.getElementById('recordingChannel');
    Object.values(allChannels).flat().forEach(channel => {
        const option = document.createElement('option');
        option.value = channel.id;
        option.textContent = channel.name;
        channelSelect.appendChild(option);
    });

    // مدیریت ضبط برنامه
    const scheduleBtn = document.getElementById('scheduleRecording');
    scheduleBtn.addEventListener('click', function () {
        const channelId = channelSelect.value;
        const startTime = document.getElementById('recordingStart').value;
        const endTime = document.getElementById('recordingEnd').value;

        if (!channelId || !startTime || !endTime) {
            showToast('لطفاً تمام فیلدها را پر کنید');
            return;
        }

        const channel = Object.values(allChannels).flat().find(c => c.id === channelId);
        addScheduledRecording(channel, startTime, endTime);
    });

    function addScheduledRecording(channel, start, end) {
        const recordingsList = document.getElementById('scheduledRecordings');
        const recordingItem = document.createElement('div');
        recordingItem.className = 'recording-item animate__animated animate__fadeIn';

        recordingItem.innerHTML = `
                <div>
                    <h4>${channel.name}</h4>
                    <p>از ${formatTime(start)} تا ${formatTime(end)}</p>
                </div>
                <button class="delete-recording">
                    <i class="fas fa-trash"></i>
                </button>
            `;

        recordingsList.appendChild(recordingItem);

        // مدیریت حذف ضبط
        recordingItem.querySelector('.delete-recording').addEventListener('click', function () {
            recordingItem.classList.add('animate__animated', 'animate__fadeOut');
            setTimeout(() => {
                recordingItem.remove();
                showToast('ضبط برنامه حذف شد');
            }, 500);
        });

        showToast('برنامه برای ضبط زمان‌بندی شد');
    }

    function formatTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleString('fa-IR');
    }

    // مدیریت تب‌های دسته‌بندی
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelector('.category-tab.active').classList.remove('active');
            this.classList.add('active');

            // فیلتر کردن کانال‌ها بر اساس دسته‌بندی
            const category = this.textContent.trim();
            filterChannels(category);
        });
    });

    // تابع فیلتر کردن کانال‌ها
    function filterChannels(category) {
        const allChannelCards = document.querySelectorAll('.channel-card');

        allChannelCards.forEach(card => {
            const channelId = card.getAttribute('data-channel');
            const channel = Object.values(allChannels).flat().find(c => c.id === channelId);

            if (category === 'همه شبکه‌ها' ||
                (category === 'سراسری' && allChannels.سراسری.some(c => c.id === channelId)) ||
                (category === 'استانی' && allChannels.استانی.some(c => c.id === channelId)) ||
                (channel.category && channel.category.includes(category))) {
                card.style.display = 'block';
                card.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                card.style.display = 'none';
            }
        });
    }

    // مدیریت کلیک روی کانال‌ها
    function changeChannel(channelId, logo, title) {
        const tvScreen = document.getElementById('tvScreen');
        const channelInfo = tvScreen.querySelector('.channel-info');

        // تغییر لوگو و عنوان برنامه
        channelInfo.querySelector('.channel-logo').src = logo;
        channelInfo.querySelector('.channel-name').textContent = title;
        channelInfo.querySelector('.program-title').textContent = 'در حال پخش...';

        // نمایش اعلان تغییر کانال
        showChannelChangeNotification(channelId, logo);

        // شبیه‌سازی پخش
        simulateLiveProgram();
    }

    // نمایش اعلان تغییر کانال
    function showChannelChangeNotification(channelId, logo) {
        const notification = document.createElement('div');
        notification.className = 'channel-notification';
        notification.innerHTML = `
                <div class="notification-content">
                    <img src="${logo}" alt="کانال" class="notification-logo" onerror="this.src='https://via.placeholder.com/30?text=LOGO'">
                    <span class="notification-text">در حال تغییر کانال...</span>
                </div>
            `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // شبیه‌سازی پخش زنده
    function simulateLiveProgram() {
        // شبیه‌سازی تغییر برنامه‌ها
        setInterval(() => {
            const programs = [
                "اخبار ۲۰:۰۰",
                "سریال پایتخت",
                "مسابقه استعدادیابی",
                "فیلم سینمایی",
                "مسابقه فوتبال",
                "مستند حیات وحش",
                "برنامه گفتگو محور",
                "مجله ورزشی",
                "اخبار اقتصادی",
                "برنامه کودک"
            ];

            const randomProgram = programs[Math.floor(Math.random() * programs.length)];
            document.querySelector('.program-title').textContent = randomProgram;
        }, 10000);
    }

    // مدیریت کنترل‌های پخش
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const shareBtn = document.getElementById('shareBtn');
    const recordBtn = document.getElementById('recordBtn');

    let isMuted = false;
    let isRecording = false;

    volumeBtn.addEventListener('click', function () {
        isMuted = !isMuted;
        if (isMuted) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeSlider.value = 0;
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeSlider.value = 80;
        }
    });

    volumeSlider.addEventListener('input', function () {
        if (this.value > 0) {
            isMuted = false;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            isMuted = true;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });

    fullscreenBtn.addEventListener('click', function () {
        const tvScreen = document.getElementById('tvScreen');

        if (!document.fullscreenElement) {
            tvScreen.requestFullscreen().catch(err => {
                alert(`خطا در ورود به حالت تمام صفحه: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });

    favoriteBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-heart"></i>';
            showToast('به لیست علاقه‌مندی‌ها اضافه شد');
        } else {
            this.innerHTML = '<i class="far fa-heart"></i>';
            showToast('از لیست علاقه‌مندی‌ها حذف شد');
        }
    });

    shareBtn.addEventListener('click', function () {
        showToast('امکان اشتراک‌گذاری این کانال از طریق شبکه‌های اجتماعی');
    });

    recordBtn.addEventListener('click', function () {
        isRecording = !isRecording;
        if (isRecording) {
            this.innerHTML = '<i class="fas fa-stop"></i> توقف ضبط';
            this.style.color = '#ff0000';
            showToast('ضبط برنامه شروع شد');

            // شبیه‌سازی ضبط و ذخیره
            setTimeout(() => {
                addRecordingToLibrary('ضبط زنده - ' + document.querySelector('.channel-name').textContent);
            }, 3000);
        } else {
            this.innerHTML = '<i class="fas fa-circle"></i> ضبط';
            this.style.color = 'white';
            showToast('ضبط برنامه متوقف شد');
        }
    });

    // تابع اضافه کردن ضبط به آرشیو
    function addRecordingToLibrary(title) {
        const recordingsList = document.getElementById('recordingsList');
        const recordingFile = document.createElement('div');
        recordingFile.className = 'recording-file animate__animated animate__fadeIn';

        const now = new Date();
        const duration = Math.floor(Math.random() * 120) + 30;
        const size = (Math.random() * 2 + 0.5).toFixed(1);

        recordingFile.innerHTML = `
                <img src="https://via.placeholder.com/120x70" alt="پیش‌نمایش" class="recording-thumbnail">
                <div class="recording-details">
                    <h4>${title}</h4>
                    <p>تاریخ ضبط: ${now.toLocaleDateString('fa-IR')} - مدت: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}:۰۰</p>
                    <p>حجم: ${size} گیگابایت</p>
                </div>
                <div class="recording-actions">
                    <button class="action-btn"><i class="fas fa-play"></i> پخش</button>
                    <button class="action-btn"><i class="fas fa-download"></i> دانلود</button>
                    <button class="action-btn delete-file"><i class="fas fa-trash"></i> حذف</button>
                </div>
            `;

        recordingsList.prepend(recordingFile);

        // مدیریت حذف فایل
        recordingFile.querySelector('.delete-file').addEventListener('click', function () {
            recordingFile.classList.add('animate__animated', 'animate__fadeOut');
            setTimeout(() => {
                recordingFile.remove();
                showToast('فایل ضبط شده حذف شد');
            }, 500);
        });

        showToast('برنامه با موفقیت ضبط و ذخیره شد');
    }

    // تابع نمایش اعلان
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'channel-notification';
        toast.innerHTML = `
                <div class="notification-content">
                    <span class="notification-text">${message}</span>
                </div>
            `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // شروع اولیه
    simulateLiveProgram();
    filterChannels('همه شبکه‌ها');
});
// تابع اضافه کردن ضبط به آرشیو (نسخه بهبود یافته)
function addRecordingToLibrary(title) {
    const recordingsList = document.getElementById('recordingsList');
    const recordingFile = document.createElement('div');
    recordingFile.className = 'recording-file animate__animated animate__fadeIn';

    const now = new Date();
    const duration = Math.floor(Math.random() * 120) + 30;
    const size = (Math.random() * 2 + 0.5).toFixed(1);
    const quality = ['HD', 'FHD', '4K'][Math.floor(Math.random() * 3)];
    const channelName = document.querySelector('.channel-name').textContent;

    recordingFile.innerHTML = `
        <img src="https://via.placeholder.com/120x70.png?text=${channelName}" 
             alt="پیش‌نمایش" 
             class="recording-thumbnail"
             onerror="this.src='https://via.placeholder.com/120x70?text=پیش‌نمایش'">
        <div class="recording-details">
            <h4>${title}</h4>
            <p>کانال: ${channelName}</p>
            <div class="recording-meta">
                <span><i class="far fa-calendar-alt"></i> ${now.toLocaleDateString('fa-IR')}</span>
                <span><i class="far fa-clock"></i> ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}:۰۰</span>
                <span><i class="fas fa-database"></i> ${size} گیگابایت</span>
                <span><i class="fas fa-tv"></i> ${quality}</span>
            </div>
        </div>
        <div class="recording-actions">
            <button class="action-btn play-btn"><i class="fas fa-play"></i> پخش</button>
            <button class="action-btn download-btn"><i class="fas fa-download"></i> دانلود</button>
            <button class="action-btn delete delete-file"><i class="fas fa-trash"></i> حذف</button>
        </div>
    `;

    recordingsList.prepend(recordingFile);

    // مدیریت عملیات روی فایل‌های ضبط شده
    recordingFile.querySelector('.play-btn').addEventListener('click', function () {
        showToast('در حال آماده‌سازی پخش...');
    });

    recordingFile.querySelector('.download-btn').addEventListener('click', function () {
        showToast('در حال آماده‌سازی دانلود...');
    });

    recordingFile.querySelector('.delete-file').addEventListener('click', function () {
        recordingFile.classList.add('animate__animated', 'animate__fadeOut');
        setTimeout(() => {
            recordingFile.remove();
            showToast('فایل ضبط شده حذف شد');
        }, 500);
    });

    showToast('برنامه با موفقیت ضبط و ذخیره شد');
}

// بهبود نمایش لوگوها در کل صفحه
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function () {
            const altText = this.alt || 'لوگو';
            this.src = `https://via.placeholder.com/100?text=${encodeURIComponent(altText)}`;
        };
    });
}

// فراخوانی تابع هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function () {
    handleImageErrors();
    // ... کدهای قبلی ...
});