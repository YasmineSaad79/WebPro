document.addEventListener('keydown', (event) => {
    const slides = document.querySelectorAll('.slide');
    let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    if (event.key === 'ArrowRight') {
        // انتقل إلى الشريحة التالية
        slides[activeIndex].classList.remove('active');
        activeIndex = (activeIndex + 1) % slides.length;
        slides[activeIndex].classList.add('active');
    } else if (event.key === 'ArrowLeft') {
        // انتقل إلى الشريحة السابقة
        slides[activeIndex].classList.remove('active');
        activeIndex = (activeIndex - 1 + slides.length) % slides.length;
        slides[activeIndex].classList.add('active');
    }
});

var swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true, // السوايبر يعمل فقط إذا كان ضمن الرؤية


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
