// تابع به‌روزرسانی تایمر اشتراک
function updateSubscriptionTimer() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 12);

    const now = new Date();
    const diff = expiryDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    document.getElementById('subscriptionTimer').innerHTML =
        `<i class="fas fa-clock"></i> ${days} روز و ${hours} ساعت باقیمانده`;
}

// تنظیم موقعیت دکمه بازگشت بر اساس ارتفاع نوار اشتراک
function setupBackButtonPosition() {
    const subscriptionBar = document.querySelector('.subscription-bar');
    const backButton = document.querySelector('.back-to-accounts');

    if (subscriptionBar && backButton) {
        const barHeight = subscriptionBar.offsetHeight;
        backButton.style.top = `${barHeight + 15}px`;
    }
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
    // راه‌اندازی تایمر اشتراک
    updateSubscriptionTimer();
    setInterval(updateSubscriptionTimer, 3600000);

    // تنظیم موقعیت دکمه بازگشت
    setupBackButtonPosition();

    // تنظیم مجدد موقعیت هنگام تغییر سایز پنجره
    window.addEventListener('resize', setupBackButtonPosition);
});

// اسکریپت برای افکت hover روی کارت‌ها
document.querySelectorAll('.platform-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
        this.style.zIndex = '1';
    });
});