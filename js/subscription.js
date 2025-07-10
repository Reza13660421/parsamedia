document.addEventListener('DOMContentLoaded', function () {
    // متغیرهای全局
    let selectedPlan = null;
    let discountApplied = false;
    let discountValue = 0;
    let discountCode = '';

    // قیمت‌های پایه
    const prices = {
        monthly: 98000,
        quarterly: 249000,
        annual: 798000
    };

    // مدت زمان اشتراک
    const durations = {
        monthly: '۱ ماه',
        quarterly: '۳ ماه',
        annual: '۱۲ ماه'
    };

    // نام طرح‌ها
    const planNames = {
        monthly: 'اشتراک ماهانه',
        quarterly: 'اشتراک سه ماهه',
        annual: 'اشتراک یکساله'
    };

    // رویدادهای دکمه‌های انتخاب طرح
    document.querySelectorAll('.plan-select-btn').forEach(button => {
        button.addEventListener('click', function () {
            selectedPlan = this.getAttribute('data-plan');
            updatePaymentSummary();

            // نمایش بخش پرداخت با انیمیشن
            const paymentSection = document.getElementById('paymentSection');
            paymentSection.style.display = 'block';
            paymentSection.style.animation = 'fadeIn 0.5s ease-out';

            // اسکرول به بخش پرداخت
            paymentSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // رویداد اعمال تخفیف
    document.getElementById('applyDiscount').addEventListener('click', function () {
        const code = document.getElementById('discountCode').value.trim();

        if (!code) {
            showAlert('لطفاً کد تخفیف را وارد کنید', 'error');
            return;
        }

        // بررسی کد تخفیف
        if (code === 'VIP30' && !discountApplied) {
            discountApplied = true;
            discountValue = 0.30; // 30% تخفیف
            discountCode = code;
            showAlert('کد تخفیف با موفقیت اعمال شد! ۳۰٪ تخفیف برای اولین اشتراک شما اعمال گردید.', 'success');
            updatePaymentSummary();
        } else if (discountApplied) {
            showAlert('شما قبلاً از کد تخفیف استفاده کرده‌اید.', 'warning');
        } else {
            showAlert('کد تخفیف معتبر نیست یا منقضی شده است.', 'error');
        }
    });

    // رویداد انتخاب روش پرداخت
    document.querySelectorAll('.method').forEach(method => {
        method.addEventListener('click', function () {
            document.querySelectorAll('.method').forEach(m => {
                m.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // رویداد پرداخت
    document.getElementById('proceedToPayment').addEventListener('click', function () {
        if (!selectedPlan) {
            showAlert('لطفاً یک طرح اشتراک انتخاب کنید', 'error');
            return;
        }

        const selectedMethod = document.querySelector('.method.active').getAttribute('data-method');
        const finalPrice = calculateFinalPrice();

        // نمایش پیام پرداخت (در حالت واقعی به درگاه پرداخت هدایت می‌شود)
        showAlert(`در حال انتقال به درگاه پرداخت ${selectedMethod} برای ${planNames[selectedPlan]} با مبلغ ${finalPrice.toLocaleString('fa-IR')} تومان`, 'info');

        // در حالت واقعی:
        // window.location.href = `payment_gateway.php?plan=${selectedPlan}&amount=${finalPrice}&discount=${discountCode}`;
    });

    // رویدادهای سوالات متداول
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const item = this.parentElement;
            item.classList.toggle('active');

            // بستن دیگر سوالات
            document.querySelectorAll('.faq-item').forEach(faq => {
                if (faq !== item) {
                    faq.classList.remove('active');
                }
            });
        });
    });

    // تابع نمایش پیام
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.classList.add('show');
        }, 10);

        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }, 3000);
    }

    // تابع به‌روزرسانی خلاصه پرداخت
    function updatePaymentSummary() {
        const basePrice = prices[selectedPlan];
        const discountAmount = discountApplied ? Math.floor(basePrice * discountValue) : 0;
        const finalPrice = basePrice - discountAmount;

        document.getElementById('selectedPlanText').textContent = planNames[selectedPlan];
        document.getElementById('selectedDuration').textContent = durations[selectedPlan];
        document.getElementById('totalAmount').textContent = basePrice.toLocaleString('fa-IR') + ' تومان';
        document.getElementById('discountAmount').textContent = discountAmount.toLocaleString('fa-IR') + ' تومان';
        document.getElementById('finalAmount').textContent = finalPrice.toLocaleString('fa-IR') + ' تومان';
    }

    // تابع محاسبه قیمت نهایی
    function calculateFinalPrice() {
        if (!selectedPlan) return 0;

        const basePrice = prices[selectedPlan];
        const discountAmount = discountApplied ? Math.floor(basePrice * discountValue) : 0;
        return basePrice - discountAmount;
    }

    // نمایش تبلیغ تخفیف برای کاربران جدید
    if (!localStorage.getItem('parsamedia_user')) {
        setTimeout(() => {
            const welcomeDiscount = confirm('کاربر جدید عزیز! برای شما کد تخفیف ۳۰٪ در نظر گرفته شده است. آیا مایلید از آن استفاده کنید؟');
            if (welcomeDiscount) {
                document.getElementById('discountCode').value = 'VIP30';
                document.getElementById('applyDiscount').click();
            }
            localStorage.setItem('parsamedia_user', 'true');
        }, 3000);
    }
});
// تشخیص دستگاه موبایل
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    // تغییرات خاص برای موبایل
    document.querySelectorAll('.plan-card').forEach(card => {
        card.style.marginBottom = '20px';
    });
}