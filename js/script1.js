document.addEventListener('DOMContentLoaded', function() {
    // شناسه دستگاه فعلی
    const deviceId = generateDeviceId();
    const accountsList = document.getElementById('accountsList');
    const currentSessionDiv = document.getElementById('currentSession');
    const addAccountBtn = document.getElementById('addAccountBtn');
    const addAccountForm = document.getElementById('addAccountForm');
    const accountNameInput = document.getElementById('accountName');
    const enablePassword = document.getElementById('enablePassword');
    const passwordFields = document.getElementById('passwordFields');
    const uploadBtn = document.getElementById('uploadBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const confirmAddBtn = document.getElementById('confirmAddBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const maxAccountsMessage = document.getElementById('maxAccountsMessage');
    const accountCount = document.getElementById('accountCount');
    
    let accounts = JSON.parse(localStorage.getItem('parsaMediaAccounts')) || [];
    let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
    let avatarFile = null;
    let verificationCodes = JSON.parse(localStorage.getItem('verificationCodes')) || {};

    // تولید شناسه منحصربفرد برای دستگاه
    function generateDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device-' + Math.random().toString(36).substr(2, 6);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // تابع هش کردن رمز عبور با SHA-256
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // تولید کد تأیید 6 رقمی با زمان انقضا
    function generateVerificationCode() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 60000; // 1 دقیقه
        return { code, expiresAt };
    }

    // نمایش اکانت‌های موجود
    function renderAccounts() {
        accountsList.innerHTML = '';
        
        if (accounts.length === 0) {
            accountsList.innerHTML = '<p style="text-align: center; color: #e0d6c2; font-size: 0.7rem;">هنوز اکانتی اضافه نکرده‌اید</p>';
            currentSessionDiv.style.display = 'none';
            updateAccountCount();
            return;
        }

        // نمایش اکانت فعلی
        if (currentAccount) {
            const account = accounts.find(acc => acc.id === currentAccount.id);
            if (account) {
                currentSessionDiv.style.display = 'block';
                currentSessionDiv.innerHTML = `
                    <strong>اکانت فعلی:</strong> ${account.name}
                    <div class="device-info">
                        <i class="fas fa-laptop"></i> دستگاه: ${deviceId}
                    </div>
                    <button class="account-btn logout-btn" id="logoutBtn" style="margin-top: 5px; padding: 2px 5px; font-size: 0.6rem;">
                        <i class="fas fa-sign-out-alt"></i> خروج از اکانت
                    </button>
                `;

                // اضافه کردن رویداد برای دکمه خروج
                document.getElementById('logoutBtn').addEventListener('click', function() {
                    // آزاد کردن اکانت
                    const accountIndex = accounts.findIndex(acc => acc.id === currentAccount.id);
                    if (accountIndex !== -1) {
                        accounts[accountIndex].activeDevice = null;
                        localStorage.setItem('parsaMediaAccounts', JSON.stringify(accounts));
                    }
                    
                    localStorage.removeItem('currentAccount');
                    currentAccount = null;
                    renderAccounts();
                });
            }
        } else {
            currentSessionDiv.style.display = 'none';
        }
        
        // نمایش لیست اکانت‌ها
        accounts.forEach(account => {
            const isCurrent = currentAccount && account.id === currentAccount.id;
            const isLocked = account.activeDevice && account.activeDevice !== deviceId;
            
            const accountCard = document.createElement('div');
            accountCard.className = `account-card ${isCurrent ? 'active' : ''} ${isLocked ? 'locked' : ''}`;
            
            // نمایش آواتار یا حرف اول نام
            let avatarHtml = '';
            if (account.avatar) {
                avatarHtml = `<img src="${account.avatar}" class="account-avatar" alt="آواتار">`;
            } else {
                const firstLetter = account.name.charAt(0);
                avatarHtml = `<div class="default-avatar">${firstLetter}</div>`;
            }
            
            // وضعیت اکانت
            let statusHtml = '';
            if (isCurrent) {
                statusHtml = `<span class="account-status status-active"><i class="fas fa-check-circle"></i> فعال در این دستگاه</span>`;
            } else if (isLocked) {
                statusHtml = `
                    <span class="account-status status-locked">
                        <i class="fas fa-lock"></i> قفل شده
                        <div class="device-info locked-device">
                            فعال در دستگاه: ${account.activeDevice}
                        </div>
                    </span>
                `;
            } else {
                statusHtml = `<span class="account-status status-inactive"><i class="fas fa-unlock"></i> غیرفعال</span>`;
            }
            
            // اطلاعات اضافی اکانت
            let metaHtml = '';
            if (account.password) {
                metaHtml = `
                    <div class="account-meta">
                        <span><i class="fas fa-lock"></i> دارای رمز عبور</span>
                        ${!isCurrent && !isLocked ? '<span><i class="fas fa-key"></i> قابل بازیابی</span>' : ''}
                    </div>
                `;
            }
            
            accountCard.innerHTML = `
                ${avatarHtml}
                <div class="account-info">
                    <div class="account-name">${account.name}</div>
                    ${statusHtml}
                    ${metaHtml}
                </div>
                <div class="account-actions">
                    ${!isCurrent && !isLocked ? `
                        <button class="account-btn login-btn" data-id="${account.id}" style="padding: 2px 4px; font-size: 0.55rem;">
                            <i class="fas fa-sign-in-alt"></i> ورود
                        </button>
                    ` : ''}
                    ${isLocked ? `
                        <button class="account-btn unlock-btn" data-id="${account.id}" style="padding: 2px 4px; font-size: 0.55rem;">
                            <i class="fas fa-unlock"></i> آزادسازی
                        </button>
                    ` : ''}
                    ${account.password && !isCurrent && !isLocked ? `
                        <button class="account-btn recover-btn" data-id="${account.id}" style="padding: 2px 4px; font-size: 0.55rem;">
                            <i class="fas fa-key"></i> بازیابی
                        </button>
                    ` : ''}
                    <button class="account-btn delete-btn" data-id="${account.id}" style="padding: 2px 4px; font-size: 0.55rem;">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            
            accountsList.appendChild(accountCard);
        });
        
        // مدیریت نمایش دکمه افزودن اکانت جدید
        if (accounts.length >= 3) {
            addAccountBtn.style.display = 'none';
            maxAccountsMessage.style.display = 'block';
        } else {
            addAccountBtn.style.display = 'block';
            maxAccountsMessage.style.display = 'none';
        }
        
        updateAccountCount();
    }
    
    // فعال/غیرفعال کردن فیلدهای رمز عبور
    enablePassword.addEventListener('change', function() {
        if (this.checked) {
            passwordFields.classList.add('active');
            document.getElementById('accountPassword').required = true;
            document.getElementById('accountConfirmPassword').required = true;
            document.getElementById('accountMobile').required = true;
        } else {
            passwordFields.classList.remove('active');
            document.getElementById('accountPassword').required = false;
            document.getElementById('accountConfirmPassword').required = false;
            document.getElementById('accountMobile').required = false;
        }
    });
    
    // آپلود عکس پروفایل
    uploadBtn.addEventListener('click', function() {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1 * 1024 * 1024) {
                alert('حجم فایل باید کمتر از ۱ مگابایت باشد');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.innerHTML = `<img src="${event.target.result}" class="avatar-preview" alt="پیش‌نمایش آواتار">`;
                avatarFile = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // نمایش فرم اضافه کردن اکانت
    addAccountBtn.addEventListener('click', function() {
        addAccountForm.style.display = 'block';
        addAccountBtn.style.display = 'none';
        maxAccountsMessage.style.display = 'none';
        accountNameInput.focus();
        avatarPreview.innerHTML = '';
        avatarFile = null;
        enablePassword.checked = false;
        passwordFields.classList.remove('active');
        document.getElementById('accountPassword').value = '';
        document.getElementById('accountConfirmPassword').value = '';
        document.getElementById('accountMobile').value = '';
    });
    
    // انصراف از اضافه کردن اکانت
    cancelAddBtn.addEventListener('click', function() {
        addAccountForm.style.display = 'none';
        if (accounts.length < 3) {
            addAccountBtn.style.display = 'block';
        }
        if (accounts.length >= 3) {
            maxAccountsMessage.style.display = 'block';
        }
        accountNameInput.value = '';
        avatarPreview.innerHTML = '';
        avatarFile = null;
        enablePassword.checked = false;
        passwordFields.classList.remove('active');
        document.getElementById('accountPassword').value = '';
        document.getElementById('accountConfirmPassword').value = '';
        document.getElementById('accountMobile').value = '';
    });
    
    // تایید و اضافه کردن اکانت جدید
    confirmAddBtn.addEventListener('click', async function() {
        const name = document.getElementById('accountName').value.trim();
        const enablePass = enablePassword.checked;
        const password = enablePass ? document.getElementById('accountPassword').value.trim() : null;
        const confirmPassword = enablePass ? document.getElementById('accountConfirmPassword').value.trim() : null;
        const mobile = enablePass ? document.getElementById('accountMobile').value.trim() : null;
        
        if (!name) {
            alert('لطفاً نامی برای اکانت انتخاب کنید');
            return;
        }
        
        // بررسی تکراری نبودن نام اکانت
        if (accounts.some(acc => acc.name === name)) {
            alert('این نام اکانت قبلاً استفاده شده است. لطفاً نام دیگری انتخاب کنید.');
            return;
        }
        
        // اعتبارسنجی رمز عبور اگر فعال باشد
        let hashedPassword = null;
        if (enablePass) {
            if (!password) {
                alert('لطفاً رمز عبور را وارد کنید');
                return;
            }
            
            if (password.length < 6) {
                alert('رمز عبور باید حداقل 6 کاراکتر باشد');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('رمز عبور و تکرار آن مطابقت ندارند');
                return;
            }
            
            if (!/^09\d{9}$/.test(mobile)) {
                alert('شماره موبایل باید 11 رقمی و با 09 شروع شود');
                return;
            }
            
            // هش کردن رمز عبور
            hashedPassword = await hashPassword(password);
        }
        
        const newAccount = {
            id: Date.now().toString(),
            name,
            avatar: avatarFile || null,
            password: hashedPassword,
            mobile: enablePass ? mobile : null,
            activeDevice: deviceId, // دستگاه فعلی را به عنوان دستگاه فعال تنظیم می‌کنیم
            createdAt: new Date().toISOString()
        };
        
        accounts.push(newAccount);
        localStorage.setItem('parsaMediaAccounts', JSON.stringify(accounts));
        
        // تنظیم اکانت فعلی
        currentAccount = {
            id: newAccount.id,
            device: deviceId,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
        
        // هدایت به صفحه index3.html پس از ایجاد اکانت
        window.location.href = 'index3.html';
    });
    
    // مدیریت کلیک روی دکمه‌های اکانت‌ها
    accountsList.addEventListener('click', async function(e) {
        const btn = e.target.closest('.account-btn');
        if (!btn) return;
        
        const accountId = btn.getAttribute('data-id');
        const account = accounts.find(acc => acc.id === accountId);
        
        if (btn.classList.contains('login-btn')) {
            // ورود به اکانت
            if (account.password) {
                const enteredPassword = prompt('لطفاً رمز عبور این اکانت را وارد کنید:');
                if (!enteredPassword) return;
                
                // هش کردن رمز وارد شده و مقایسه با رمز ذخیره شده
                const enteredHash = await hashPassword(enteredPassword);
                if (enteredHash !== account.password) {
                    alert('رمز عبور اشتباه است');
                    return;
                }
            }
            
            // ثبت دستگاه فعال
            account.activeDevice = deviceId;
            localStorage.setItem('parsaMediaAccounts', JSON.stringify(accounts));
            
            currentAccount = {
                id: account.id,
                device: deviceId,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
            
            // هدایت به صفحه index3.html پس از ورود موفق
            window.location.href = 'index3.html';
        } 
        else if (btn.classList.contains('unlock-btn')) {
            // آزادسازی اکانت قفل شده
            if (account.password) {
                // تولید کد تأیید
                const verificationCode = generateVerificationCode();
                verificationCodes[account.id] = verificationCode;
                localStorage.setItem('verificationCodes', JSON.stringify(verificationCodes));
                
                // درخواست کد تأیید
                const enteredCode = prompt(`کد تأیید به شماره ${account.mobile} ارسال شد. لطفاً کد را وارد کنید (کد تا 1 دقیقه معتبر است):`);
                
                // بررسی کد تأیید
                const storedCode = verificationCodes[account.id];
                if (!storedCode || storedCode.code !== enteredCode) {
                    alert('کد تأیید نامعتبر است');
                    return;
                }
                
                if (Date.now() > storedCode.expiresAt) {
                    alert('کد تأیید منقضی شده است');
                    delete verificationCodes[account.id];
                    localStorage.setItem('verificationCodes', JSON.stringify(verificationCodes));
                    return;
                }
            }
            
            // آزادسازی اکانت
            account.activeDevice = null;
            localStorage.setItem('parsaMediaAccounts', JSON.stringify(accounts));
            
            // حذف کد تأیید استفاده شده
            delete verificationCodes[account.id];
            localStorage.setItem('verificationCodes', JSON.stringify(verificationCodes));
            
            renderAccounts();
            alert(`اکانت "${account.name}" با موفقیت آزاد شد!`);
        }
        else if (btn.classList.contains('recover-btn')) {
            // بازیابی رمز عبور اکانت
            if (!account.password) {
                alert('این اکانت رمز عبور ندارد');
                return;
            }
            
            // تولید کد تأیید
            const verificationCode = generateVerificationCode();
            verificationCodes[account.id] = verificationCode;
            localStorage.setItem('verificationCodes', JSON.stringify(verificationCodes));
            
            // درخواست کد تأیید
            const enteredCode = prompt(`کد تأیید به شماره ${account.mobile} ارسال شد. لطفاً کد را وارد کنید (کد تا 1 دقیقه معتبر است):`);
            
            // بررسی کد تأیید
            const storedCode = verificationCodes[account.id];
            if (!storedCode || storedCode.code !== enteredCode) {
                alert('کد تأیید نامعتبر است');
                return;
            }
            
            if (Date.now() > storedCode.expiresAt) {
                alert('کد تأیید منقضی شده است');
                delete verificationCodes[account.id];
                localStorage.setItem('verificationCodes', JSON.stringify(verificationCodes));
                return;
            }
            
            // درخواست رمز عبور جدید
            const newPassword = prompt('لطفاً رمز عبور جدید را وارد کنید (حداقل 6 کاراکتر):');
            if (!newPassword || newPassword.length < 6) {
                alert('رمز عبور باید حداقل 6 کاراکتر باشد');
                return;
            }
            
            // هش کردن رمز جدید و ذخیره آن
            const newHashedPassword = await hashPassword(newPassword);
            account.password = newHashedPassword;
            localStorage.setItem('parsaMediaAccounts', JSON.stringify(accounts));
            
            // حذف کد تأیید استفاده شده
            delete verificationCodes[account.id];
            localStorage.setItem('verificationCodes', JSON.stringify(verificationCodes));
            
            renderAccounts();
            alert('رمز عبور با موفقیت تغییر یافت!');
        }
        else if (btn.classList.contains('delete-btn')) {
            // حذف اکانت
            if (confirm(`آیا مطمئن هستید که می‌خواهید اکانت "${account.name}" را حذف کنید؟`)) {
                // اگر اکانت فعلی در حال حذف است، از آن خارج شو
                if (currentAccount && currentAccount.id === account.id) {
                    localStorage.removeItem('currentAccount');
                    currentAccount = null;
                }
                
                accounts = accounts.filter(acc => acc.id !== account.id);
                localStorage.setItem('parsaMediaAccounts', JSON.stringify(accounts));
                renderAccounts();
            }
        }
    });
    
    // به‌روزرسانی تعداد اکانت‌ها
    function updateAccountCount() {
        accountCount.textContent = `${accounts.length} اکانت از ۳ اکانت ممکن`;
    }
    
    // مقداردهی اولیه
    renderAccounts();
});
// متغیرهای全局 برای سیستم تأیید شماره موبایل
let verificationData = {
    code: '',
    mobile: '',
    isVerified: false,
    expiryTime: 0,
    timerInterval: null
};

// رویداد کلیک برای دکمه ارسال کد تأیید
document.getElementById('sendVerificationBtn').addEventListener('click', sendVerificationCode);

// رویداد کلیک برای دکمه تأیید کد
document.getElementById('verifyBtn').addEventListener('click', verifyCode);

// رویداد تغییر در فیلد رمز عبور برای بررسی نیاز به تأیید شماره
document.getElementById('enablePassword').addEventListener('change', function() {
    if (!this.checked) {
        resetVerification();
    }
});

// تابع ارسال کد تأیید
function sendVerificationCode() {
    const mobileNumber = document.getElementById('accountMobile').value.trim();
    const sendBtn = document.getElementById('sendVerificationBtn');
    
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
    
    // غیرفعال کردن دکمه ارسال برای جلوگیری از ارسال مکرر
    sendBtn.disabled = true;
    
    // تولید کد تأیید 4 رقمی تصادفی
    verificationData.code = Math.floor(1000 + Math.random() * 9000).toString();
    verificationData.mobile = mobileNumber;
    verificationData.expiryTime = Date.now() + 300000; // 5 دقیقه اعتبار
    
    // در اینجا باید کد را به سرویس پیامک ارسال کنید
    // این یک پیام شبیه‌سازی شده است
    console.log(`کد تأیید برای شماره ${mobileNumber}: ${verificationData.code}`);
    alert(`کد تأیید به شماره ${mobileNumber} ارسال شد. (در محیط واقعی پیامک ارسال می‌شود)`);
    
    // نمایش بخش وارد کردن کد تأیید
    document.getElementById('verificationCodeContainer').style.display = 'flex';
    
    // شروع تایمر شمارش معکوس
    startCountdownTimer();
    
    // در محیط واقعی، این بخش را با کد ارسال پیامک واقعی جایگزین کنید
    /*
    sendSMS(mobileNumber, verificationData.code)
        .then(() => {
            document.getElementById('verificationCodeContainer').style.display = 'flex';
            startCountdownTimer();
        })
        .catch(error => {
            alert('خطا در ارسال پیامک: ' + error.message);
            sendBtn.disabled = false;
        });
    */
}

// تابع تأیید کد
function verifyCode() {
    const enteredCode = document.getElementById('verificationCode').value.trim();
    const verifyBtn = document.getElementById('verifyBtn');
    
    verifyBtn.disabled = true;
    
    // بررسی انقضای کد
    if (Date.now() > verificationData.expiryTime) {
        alert('کد تأیید منقضی شده است. لطفاً کد جدیدی دریافت کنید.');
        resetVerification();
        return;
    }
    
    // بررسی تطابق کد
    if (enteredCode === verificationData.code) {
        verificationData.isVerified = true;
        alert('شماره موبایل با موفقیت تأیید شد.');
        document.getElementById('verificationCodeContainer').style.display = 'none';
        clearInterval(verificationData.timerInterval);
    } else {
        alert('کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.');
        verifyBtn.disabled = false;
    }
}

// تایمر شمارش معکوس
function startCountdownTimer() {
    const sendBtn = document.getElementById('sendVerificationBtn');
    const timerElement = document.createElement('div');
    timerElement.className = 'countdown-timer';
    sendBtn.parentNode.insertBefore(timerElement, sendBtn.nextSibling);
    
    let remainingTime = Math.floor((verificationData.expiryTime - Date.now()) / 1000);
    
    verificationData.timerInterval = setInterval(() => {
        remainingTime--;
        
        if (remainingTime <= 0) {
            clearInterval(verificationData.timerInterval);
            timerElement.remove();
            sendBtn.disabled = false;
            return;
        }
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerElement.textContent = `زمان باقیمانده: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// بازنشانی وضعیت تأیید
function resetVerification() {
    verificationData = {
        code: '',
        mobile: '',
        isVerified: false,
        expiryTime: 0,
        timerInterval: null
    };
    document.getElementById('verificationCodeContainer').style.display = 'none';
    document.getElementById('verificationCode').value = '';
    document.getElementById('sendVerificationBtn').disabled = false;
    clearInterval(verificationData.timerInterval);
    const timerElement = document.querySelector('.countdown-timer');
    if (timerElement) timerElement.remove();
}

// تغییر در تابع تأیید ایجاد اکانت برای بررسی تأیید شماره موبایل
document.getElementById('confirmAddBtn').addEventListener('click', function() {
    const mobileNumber = document.getElementById('accountMobile').value.trim();
    const enablePassword = document.getElementById('enablePassword').checked;
    
    if (enablePassword && mobileNumber && !verificationData.isVerified) {
        alert('لطفاً شماره موبایل خود را تأیید کنید.');
        return;
    }
    
    // بقیه کدهای ایجاد اکانت...
    // ...
});

// تابع شبیه‌سازی ارسال پیامک (برای استفاده در محیط واقعی)

async function sendSMS(mobileNumber, code) {
    const response = await fetch('https://api.sms-service.ir/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
            receptor: mobileNumber,
            message: `کد تأیید پارسا مدیا: ${code}`
        })
    });
    
    if (!response.ok) {
        throw new Error('خطا در ارسال پیامک');
    }
    
    return response.json();
}
