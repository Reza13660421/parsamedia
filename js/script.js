document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const verifySection = document.getElementById('verifySection');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendLink = document.getElementById('resendLink');
    const timerSpan = document.getElementById('timer');
    const codeInputs = document.querySelectorAll('.code-input');
    
    let verificationCode = '';
    let countdown = 60;
    let timer;

    // مخفی کردن بخش تأیید کد در ابتدا
    verifySection.style.display = 'none';

    // ارسال فرم شماره موبایل
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mobile = document.getElementById('mobile').value.trim();
        
        if (!/^09\d{9}$/.test(mobile)) {
            alert('لطفاً شماره موبایل معتبر وارد کنید (11 رقمی و با 09 شروع شود)');
            return;
        }
        
        // تولید کد تأیید تصادفی 6 رقمی
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // نمایش پیام (در حالت واقعی اینجا کد به موبایل کاربر ارسال می‌شود)
        alert(`کد تأیید به شماره ${mobile} ارسال شد: ${verificationCode}`);
        
        // مخفی کردن فرم ورود و نمایش بخش تأیید کد
        loginForm.style.display = 'none';
        verifySection.style.display = 'block';
        
        // شروع تایمر برای ارسال مجدد کد
        startCountdown();
    });

    // مدیریت ورود کد تأیید
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                if (index > 0) {
                    codeInputs[index - 1].focus();
                }
            }
        });
    });

    // تأیید کد و ورود
    verifyBtn.addEventListener('click', function() {
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
        
        if (enteredCode.length !== 6) {
            alert('لطفاً کد تأیید 6 رقمی را کامل وارد کنید');
            return;
        }
        
        if (enteredCode === verificationCode) {
            // کد صحیح است - انتقال به صفحه index2.html
            window.location.href = 'index2.html';
        } else {
            alert('کد تأیید نادرست است. لطفاً دوباره تلاش کنید.');
        }
    });

    // ارسال مجدد کد
    resendLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (countdown > 0) {
            alert(`لطفاً ${countdown} ثانیه دیگر دوباره تلاش کنید.`);
            return;
        }
        
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        alert(`کد جدید ارسال شد: ${verificationCode}`);
        
        // ریست کردن فیلدهای کد
        codeInputs.forEach(input => input.value = '');
        codeInputs[0].focus();
        
        // ریست تایمر
        countdown = 60;
        startCountdown();
    });

    // تایمر شمارش معکوس
    function startCountdown() {
        clearInterval(timer);
        
        timer = setInterval(function() {
            countdown--;
            timerSpan.textContent = ` (${countdown} ثانیه)`;
            
            if (countdown <= 0) {
                clearInterval(timer);
                timerSpan.textContent = '';
            }
        }, 1000);
    }
});
// اعتبارسنجی شماره موبایل پیشرفته
function validateMobile(mobile) {
    const regex = /^09[0-9]{9}$/;
    if (!regex.test(mobile)) {
        return {
            valid: false,
            message: 'شماره موبایل باید 11 رقمی و با 09 شروع شود'
        };
    }
    return { valid: true };
}

// اعتبارسنجی رمز عبور
function validatePassword(password) {
    if (password.length < 8) {
        return {
            valid: false,
            message: 'رمز عبور باید حداقل 8 کاراکتر داشته باشد'
        };
    }
    // سایر قوانین پیچیده‌تر
    return { valid: true };
}