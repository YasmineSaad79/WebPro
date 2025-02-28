// باقي الكود الخاص بالـ searchForm و الـ loginForm
searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
}

let loginForm = document.querySelector('.login-form-container');
document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () => {
    loginForm.classList.remove('active');
}

let signupFormPage = document.querySelector('#signup-form');

// عند الضغط على رابط "Create one" (إنشاء حساب)
document.querySelector('#create-account-link').onclick = () => {
    loginFormPage.style.display = 'none';
    signupFormPage.style.display = 'block';
}

// عند الضغط على رابط "Back to Sign In" (العودة لتسجيل الدخول)
document.querySelector('#back-to-login-link').onclick = () => {
    signupFormPage.style.display = 'none';
    loginFormPage.style.display = 'block';
}

// التعامل مع إرسال بيانات التسجيل باستخدام AJAX
document.querySelector('#signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // منع النموذج من إعادة التحميل بشكل تقليدي

    let formData = new FormData(this); // جمع بيانات النموذج

    let xhr = new XMLHttpRequest(); // إنشاء كائن XMLHttpRequest
    xhr.open('POST', '../myphp/signup.php', true); // إرسال البيانات إلى ملف PHP بدون تحميل الصفحة

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // عند النجاح، إخفاء نموذج التسجيل وعرض رسالة النجاح
            signupFormPage.style.display = 'none';
            alert('Sign Up Successful! You can now log in.');

            // إظهار نموذج تسجيل الدخول
            loginFormPage.style.display = 'block';
        }
    };

    xhr.send(formData); // إرسال البيانات إلى PHP
});

// التعامل مع إرسال بيانات تسجيل الدخول باستخدام AJAX
document.querySelector('#login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let formData = new FormData(this);

    let xhr = new XMLHttpRequest(); // إنشاء كائن XMLHttpRequest
    xhr.open('POST', '../myphp/login.php', true); // إرسال البيانات إلى ملف PHP بدون تحميل الصفحة

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = xhr.responseText.trim();

            if (response.startsWith('success')) {
                let firstName = response.split(':')[1]; // استخراج الاسم الأول من الرد
                alert(`Welcome, ${firstName}!`); // عرض رسالة الترحيب بالاسم الأول
                window.location.href = '../myhtml/index.html'; // الانتقال إلى الصفحة الرئيسية
            } else {
                alert('Invalid login details. Please try again.'); // رسالة خطأ
            }
        }
    };

    xhr.send(formData); // إرسال البيانات إلى PHP
});
const resetPasswordForm = document.querySelector('#reset-password-form');
const otpForm = document.querySelector('#otp-form');
const backToLoginLink = document.querySelector('#back-to-login-link2');
const resendCodeLink = document.querySelector('#resend-code-link');
const loginFormPage = document.querySelector('#login-form');
const changePasswordForm = document.querySelector('#change-password-form');

// العودة إلى تسجيل الدخول
backToLoginLink.onclick = function () {
    resetPasswordForm.style.display = 'none';
    otpForm.style.display = 'none';
    document.querySelector('#login-form').style.display = 'block';
};

// عند الضغط على "Forget Password"
document.querySelector('#forget-password-link').onclick = function () {
    loginFormPage.style.display = 'none';
    resetPasswordForm.style.display = 'block';
};

// إرسال نموذج استعادة كلمة المرور
resetPasswordForm.onsubmit = function (event) {
    event.preventDefault();

    const email = resetPasswordForm.querySelector('[name="reset-email"]').value;  // الحصول على البريد الإلكتروني

    fetch('../myphp/send_otp.php', {  // التأكد من أن URL صحيح
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => response.text())  // استخدام text بدلًا من json لتفقد محتوى الرد
        .then(data => {
            console.log('Server response:', data);  // طباعة محتوى الاستجابة من الخادم
            try {
                const jsonData = JSON.parse(data);  // محاولة تحويل البيانات إلى JSON
                if (jsonData.status === 'success') {
                    alert(jsonData.message);
                    resetPasswordForm.style.display = 'none';
                    otpForm.style.display = 'block';
                } else {
                    alert(jsonData.message);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Something went wrong. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
};

// إرسال نموذج إدخال الرمز (إدخال OTP للتحقق)
otpForm.onsubmit = function (event) {
    event.preventDefault();

    const email = resetPasswordForm.querySelector('[name="reset-email"]').value;  // الحصول على البريد الإلكتروني من الفورم الأول
    const otpCode = otpForm.querySelector('[name="otp-code"]').value; // الحصول على رمز OTP من الفورم الثاني

    fetch('../myphp/verify_otp.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, otp_code: otpCode })  // إرسال البريد الإلكتروني مع رمز OTP
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);  // رسالة نجاح

                // إخفاء فورم OTP
                otpForm.style.display = 'none';

                // إظهار فورم تغيير كلمة السر
                changePasswordForm.style.display = 'block';

                // إضافة البريد الإلكتروني إلى الفورم المخفي لتغيير كلمة السر
                const emailInput = changePasswordForm.querySelector('[name="email"]');
                emailInput.value = email;

                // تأكد من أن الفورم يظهر فوق باقي الفورمات
                changePasswordForm.style.position = 'relative'; // إضافة position
                changePasswordForm.style.zIndex = '999'; // إضافة z-index

            } else {
                alert(data.message);  // رسالة خطأ
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
};


changePasswordForm.onsubmit = function (event) {
    event.preventDefault();  // منع الإرسال التقليدي للفورم

    const newPassword = changePasswordForm.querySelector('[name="new_password"]').value;  // كلمة السر الجديدة
    const confirmPassword = changePasswordForm.querySelector('[name="confirm_new_password"]').value;  // تأكيد كلمة السر
    const email = changePasswordForm.querySelector('[name="email"]').value;  // البريد الإلكتروني

    // تحقق من تطابق كلمة السر مع تأكيد كلمة السر
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // إرسال البيانات إلى ملف PHP باستخدام fetch (AJAX)
    fetch('../myphp/process_change_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            new_password: newPassword
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);  // رسالة النجاح
                changePasswordForm.style.display = 'none';  // إخفاء فورم تغيير كلمة السر
                // إظهار فورم تسجيل الدخول
                document.getElementById('login-form').style.display = 'block';  // تأكد من أن الفورم لوجن موجود في الصفحة
            } else {
                alert(data.message);  // رسالة الخطأ
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
};

let logoutBtn = document.getElementById('logout-btn');

logoutBtn.onclick = function(event) {
    alert('You have been logged out.');
    window.location.href = 'index.html';
};
const cartButtons = document.querySelectorAll('.add-to-cart');

cartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const bookId = this.getAttribute('data-book-id');

        fetch('../myphp/check_login.php')
            .then(response => response.json())
            .then(data => {
                if (data.logged_in) {
                    fetch('../myphp/add_to_cart.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'book_id=' + bookId
                    })
                        .then(response => response.text())
                        .then(data => {
                            alert(data);
                        })
                        .catch(error => console.error('Error:', error));
                } else {
                    alert("You must be logged in to add to the cart.");
                    window.location.href = "../myhtml/index.html";
                }
            })
            .catch(error => console.error('Error:', error));
    });
});



let privacyPolicyLink = document.querySelector('#privacy-policy-link');
let acceptBtn = document.getElementById('accept-policy-btn');
let privacyPolicyContainer = document.querySelector('.privacy-policy-container');
let closePrivacyPolicyBtn = document.getElementById('close-privacy-policy-btn');

// فتح النافذة عند النقر على الرابط
privacyPolicyLink.onclick = function() {
    privacyPolicyContainer.classList.add('active');
}

// إغلاق النافذة عند النقر على زر الإغلاق
closePrivacyPolicyBtn.onclick = function() {
    privacyPolicyContainer.classList.remove('active');
}
acceptBtn.onclick = function() {
    event.preventDefault();
    alert("Thank you for accepting the privacy policy.");
    privacyPolicyContainer.style.display = 'none';
}


var blogsSwiper = new Swiper(".blogs-slider", {
    spaceBetween:20,
    grabCursor:true,
    loop:true,

    centeredSlides:true,
    autoplay:{
        delay:9500,
        disableOnInteraction:false,
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },

        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },


    },
});


let paymentLink = document.querySelector('#payment-method-link');
let acceptPaymentBtn = document.getElementById('accept-payment-method-btn');
let paymentContainer = document.querySelector('.payment-method-container');
let closePaymentBtn = document.getElementById('close-payment-method-btn');

// عند النقر على الرابط لفتح واجهة الدفع
paymentLink.onclick = function() {
    paymentContainer.classList.add('active');
}

// عند النقر على زر الإغلاق، نغلق واجهة الدفع
closePaymentBtn.onclick = function() {
    paymentContainer.classList.remove('active');
}

// عند النقر على زر "قبول"، نتحقق أولاً من اختيار طريقة الدفع
acceptPaymentBtn.onclick = function(event) {
    event.preventDefault(); // منع الإرسال الافتراضي للنموذج

    // التحقق من أن المستخدم قد اختار واحدة من طرق الدفع
    let selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');

    // إذا لم يتم اختيار طريقة الدفع
    if (!selectedPaymentMethod) {
        alert("Please choose a payment method.");
        return; // لا تفعل أي شيء إذا لم يتم اختيار طريقة
    }

    // إذا تم اختيار طريقة دفع صحيحة
    alert("Thank you for accepting the payment method: " + selectedPaymentMethod.value);
    paymentContainer.style.display = 'none'; // إخفاء واجهة الدفع بعد القبول
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}
document.querySelector('#remember-me').addEventListener('change', function () {
    if (this.checked) {
        document.cookie = "rememberMe=true; path=/; max-age=31536000"; // تخزين الكوكيز لمدة عام
    } else {
        document.cookie = "rememberMe=; path=/; max-age=0"; // حذف الكوكيز
    }
});

if (getCookie('rememberMe') === 'true') {
    document.querySelector('#remember-me').checked = true;
}
document.getElementById('submit-btn').addEventListener('click', function() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
});

// const welcomeMessage = document.querySelector('#welcome-message');
// // عند الضغط على زر "Sign In" (إرسال النموذج)
// loginForm.onsubmit = function(event) {
//     event.preventDefault(); // لمنع إرسال النموذج الفعلي
//
//     let email = loginForm.querySelector('[name="email"]').value;
//     let password = loginForm.querySelector('[name="password"]').value;
//
//     if (email && password.length >= 8) {
//
//         loginForm.style.display = 'none';
//         alert(" Welcome to our store! ");
//     }
// }
//
// let loginFormPage = document.querySelector('#login-form');
// let signupFormPage = document.querySelector('#signup-form');
//
// // عند الضغط على رابط "Create one" (إنشاء حساب)
// document.querySelector('#create-account-link').onclick = () => {
//     // إخفاء نموذج تسجيل الدخول
//     loginFormPage.style.display = 'none';
//     // عرض نموذج التسجيل
//     signupFormPage.style.display = 'block';
// }
//
// // عند الضغط على رابط "Back to Sign In" (العودة لتسجيل الدخول)
// document.querySelector('#back-to-login-link').onclick = () => {
//     // إخفاء نموذج التسجيل
//     signupFormPage.style.display = 'none';
//     // عرض نموذج تسجيل الدخول
//     loginFormPage.style.display = 'block';
// }
//
//
//
// signupFormPage.onsubmit = function(event) {
//     event.preventDefault(); // لمنع إرسال النموذج الفعلي
//
//     let firstName = signupFormPage.querySelector('[name="first-name"]').value;
//     let lastName = signupFormPage.querySelector('[name="last-name"]').value;
//     let email = signupFormPage.querySelector('[name="email"]').value;
//     let password = signupFormPage.querySelector('[name="password"]').value;
//
//     if (firstName && lastName && email && password.length >= 8) {
//         alert("Account successfully created!");
//         signupFormPage.style.display = 'none';  // إخفاء نموذج التسجيل
//         loginFormPage.style.display = 'block';  // عرض نموذج تسجيل الدخول
//     } else {
//         alert("Please fill out all fields correctly.");
//     }
// }
//
//
//
//
//
//
//
//
// document.querySelector('#forget-password-link').onclick = function() {
//     document.querySelector('#login-form').style.display = 'none'; // إخفاء نموذج تسجيل الدخول
//     document.querySelector('#reset-password-form').style.display = 'block'; // عرض نموذج استعادة كلمة المرور
// };
//
// document.querySelector('#back-to-login-link2').onclick = function() {
//     document.querySelector('#reset-password-form').style.display = 'none'; // إخفاء نموذج استعادة كلمة المرور
//     document.querySelector('#login-form').style.display = 'block'; // عرض نموذج تسجيل الدخول
// };
// const resetPasswordForm = document.querySelector('#reset-password-form');
// const otpForm = document.querySelector('#otp-form');
// const backToLoginLink = document.querySelector('#back-to-login-link2');
// const resendCodeLink = document.querySelector('#resend-code-link');
//
// document.querySelector('#back-to-login-link2').onclick = () => {
//     // إخفاء نموذج التسجيل
//     resetPasswordForm.style.display = 'none';
//     // عرض نموذج تسجيل الدخول
//     loginFormPage.style.display = 'block';
// }
// // إظهار نموذج إرسال الرمز
// document.querySelector('#forget-password-link').onclick = function () {
//     document.querySelector('#login-form').style.display = 'none';
//     resetPasswordForm.style.display = 'block';
//     signupFormPage.style.display = 'none';
// };
//
// // العودة إلى تسجيل الدخول
// backToLoginLink.onclick = function () {
//     resetPasswordForm.style.display = 'none';
//     otpForm.style.display = 'none';
//      signupFormPage.style.display = 'none';
//     document.querySelector('#login-form').style.display = 'block';
// };
//
// // عند إرسال نموذج استعادة كلمة المرور
// resetPasswordForm.onsubmit = function (event) {
//     event.preventDefault();
//     // هنا يمكنك إضافة كود لإرسال الرمز إلى البريد الإلكتروني
//     alert("Reset code has been sent to your email!");
//     resetPasswordForm.style.display = 'none';
//     otpForm.style.display = 'block';
// };
//
// // عند إرسال نموذج إدخال الرمز
// otpForm.onsubmit = function (event) {
//     event.preventDefault();
//     const enteredCode = otpForm.querySelector('[name="otp-code"]').value;
//
//     // تحقق من صحة الرمز
//     if (enteredCode === "123456") { // افترض أن 123456 هو الرمز الصحيح للاختبار
//         alert("Code verified successfully!");
//         otpForm.style.display = 'none';
//         loginFormPage.style.display = 'block';
//     } else {
//         alert("Invalid code! Please try again.");
//     }
// };
//
// // إعادة إرسال الرمز
// resendCodeLink.onclick = function (event) {
//     event.preventDefault();
//     alert("A new reset code has been sent to your email!");
// };
//
//
//
//
// document.addEventListener("DOMContentLoaded", function () {
//     // استهداف العناصر
//     let accountInfoLink = document.querySelector('#account-info-link'); // الرابط
//     let accountInfoForm = document.querySelector('.account-info-container'); // النموذج
//     let closeAccountInfoBtn = document.getElementById('close-account-info-btn'); // زر الإغلاق
//     let changePasswordBtn = document.getElementById('pass-btn'); // زر تغيير كلمة السر
//     let form = accountInfoForm.querySelector('form'); // استهداف النموذج داخل الحاوية
//
//     // عند النقر على رابط "Account Info"، نعرض النموذج
//     accountInfoLink.onclick = function() {
//         accountInfoForm.classList.add('active'); // إضافة الفئة active لعرض النموذج
//     }
//
//     // عند النقر على زر الإغلاق (×)، نغلق النموذج
//     closeAccountInfoBtn.onclick = function() {
//         accountInfoForm.classList.remove('active'); // إزالة الفئة active لإخفاء النموذج
//     }
//
//     // معالجة حدث النقر على زر تغيير كلمة المرور
//     changePasswordBtn.onclick = function(event) {
//         // منع الإرسال الافتراضي للنموذج
//         event.preventDefault();
//
//         // الحصول على القيم المدخلة
//         let oldPassword = form.querySelector('input[name="old_password"]').value.trim();
//         let newPassword = form.querySelector('input[name="new_password"]').value.trim();
//         let confirmNewPassword = form.querySelector('input[name="confirm_new_password"]').value.trim();
//
//
//         // التحقق من أن الحقول ليست فارغة
//         if (!oldPassword || !newPassword || !confirmNewPassword) {
//             alert("All fields are required. Please fill them out.");
//             return;
//         }
//
//         // التحقق من أن كلمة المرور الجديدة وتأكيدها متطابقان
//         if (newPassword !== confirmNewPassword) {
//             alert("The new password and confirm password do not match.");
//             return;
//         }
//         if (newPassword.length < 8) {
//             alert("Password must be at least 8 characters long.");
//             return;
//         }
//         // إذا كان التحقق ناجحًا
//         alert("Password changed successfully!");
//
//         // إعادة تعيين الحقول (اختياري)
//         form.reset();
//         accountInfoForm.classList.remove('active'); // إغلاق النموذج بعد النجاح
//     }
// });
//
//
// // منطق تسجيل الخروج
// let logoutBtn = document.getElementById('logout-btn');
//
// logoutBtn.onclick = function(event) {
//     alert('You have been logged out.');
//     window.location.href = 'index.html';
// };
//
//
//
//
// let privacyPolicyLink = document.querySelector('#privacy-policy-link');
// let acceptBtn = document.getElementById('accept-policy-btn');
// let privacyPolicyContainer = document.querySelector('.privacy-policy-container');
// let closePrivacyPolicyBtn = document.getElementById('close-privacy-policy-btn');
//
// // فتح النافذة عند النقر على الرابط
// privacyPolicyLink.onclick = function() {
//     privacyPolicyContainer.classList.add('active');
// }
//
// // إغلاق النافذة عند النقر على زر الإغلاق
// closePrivacyPolicyBtn.onclick = function() {
//     privacyPolicyContainer.classList.remove('active');
// }
// acceptBtn.onclick = function() {
//     event.preventDefault();
//     alert("Thank you for accepting the privacy policy.");
//     privacyPolicyContainer.style.display = 'none';
// }
// let paymentLink = document.querySelector('#payment-method-link');
// let acceptPaymentBtn = document.getElementById('accept-payment-method-btn');
// let paymentContainer = document.querySelector('.payment-method-container');
// let closePaymentBtn = document.getElementById('close-payment-method-btn');
//
// // عند النقر على الرابط لفتح واجهة الدفع
// paymentLink.onclick = function() {
//     paymentContainer.classList.add('active');
// }
//
// // عند النقر على زر الإغلاق، نغلق واجهة الدفع
// closePaymentBtn.onclick = function() {
//     paymentContainer.classList.remove('active');
// }
//
// // عند النقر على زر "قبول"، نتحقق أولاً من اختيار طريقة الدفع
// acceptPaymentBtn.onclick = function(event) {
//     event.preventDefault(); // منع الإرسال الافتراضي للنموذج
//
//     // التحقق من أن المستخدم قد اختار واحدة من طرق الدفع
//     let selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
//
//     // إذا لم يتم اختيار طريقة الدفع
//     if (!selectedPaymentMethod) {
//         alert("Please choose a payment method.");
//         return; // لا تفعل أي شيء إذا لم يتم اختيار طريقة
//     }
//
//     // إذا تم اختيار طريقة دفع صحيحة
//     alert("Thank you for accepting the payment method: " + selectedPaymentMethod.value);
//     paymentContainer.style.display = 'none'; // إخفاء واجهة الدفع بعد القبول
// }
//
// let favoritesLink = document.querySelector('#favorites-link');
// let clearFavoritesBtn = document.getElementById('clear-favorites-btn');
// let favoritesContainer = document.querySelector('.favorites-container');
// let closeFavoritesBtn = document.getElementById('close-favorites-btn');
//
// // فتح النافذة عند النقر على الرابط
// favoritesLink.onclick = function() {
//     favoritesContainer.classList.add('active');
// }
//
// // إغلاق النافذة عند النقر على زر الإغلاق
// closeFavoritesBtn.onclick = function() {
//     favoritesContainer.classList.remove('active');
// }
//
// // تنظيف القائمة عند النقر على زر "Clear All Favorites"
// clearFavoritesBtn.onclick = function(event) {
//     event.preventDefault();
//     alert("Your favorites have been cleared.");
//     // لا حاجة لإخفاء النافذة هنا باستخدام display: 'none' لأنه يتم إغلاقها باستخدام الكلاس
//     favoritesContainer.classList.remove('active');
// }
//
//
// document.querySelector('#close-login-btn').onclick = () => {
//     loginForm.classList.remove('active');
// }
// window.onscroll =()=>{
//     searchForm.classList.remove('active');
//  if(window.scrollY >80){
//      document.querySelector('.header .header-2').classList.add('active');
//  }else{
//      document.querySelector('.header .header-2').classList.remove('active');
//  }
// }
//
//
// document.querySelectorAll('.navbar a').forEach(link => {
//     link.onclick = (event) => {
//         if (link.getAttribute('href') === 'index.html') {
//             event.preventDefault();
//         } else {
//             loader();
//         }
//     };
// });
//
// var bookSwiper = new Swiper(".book-slider", {
//    loop:true,
// centeredSlides:true,
//     autoplay:{
//        delay:9000,
//         disableOnInteraction:false,
//     },
//     breakpoints: {
//         0: {
//             slidesPerView: 1,
//         },
//         768: {
//             slidesPerView: 2,
//         },
//         1024: {
//             slidesPerView: 3,
//         },
//     },
// });
// var blogsSwiper = new Swiper(".blogs-slider", {
//     spaceBetween:20,
//     grabCursor:true,
//     loop:true,
//
//     centeredSlides:true,
//     autoplay:{
//         delay:9500,
//         disableOnInteraction:false,
//     },
//
//     breakpoints: {
//         0: {
//             slidesPerView: 1,
//         },
//
//         768: {
//             slidesPerView: 2,
//         },
//         1024: {
//             slidesPerView: 3,
//         },
//
//
//     },
// });
// document.querySelector('#remember-me').addEventListener('change', function () {
//     if (this.checked) {
//         document.cookie = "rememberMe=true; path=/; max-age=31536000"; // تخزين الكوكيز لمدة عام
//     } else {
//         document.cookie = "rememberMe=; path=/; max-age=0"; // حذف الكوكيز
//     }
// });
//
// // عند تحميل الصفحة:
// function getCookie(name) {
//     const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//     return match ? match[2] : null;
// }
//
// if (getCookie('rememberMe') === 'true') {
//     document.querySelector('#remember-me').checked = true;
// }
// document.getElementById('submit-btn').addEventListener('click', function() {
//     confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 }
//     });
// });
