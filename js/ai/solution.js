// const bannerSection = document.querySelector("#banner-section");
// // const subBannerSection = document.querySelector("#sub-banner-section");
// if (bannerSection) {
//     const header = document.querySelector("#main-header");
//     const observer = new IntersectionObserver(
//         (entries) => {
//             entries.forEach((entry) => {
//                 if (entry.isIntersecting) {
//                     header.classList.add("dark-header");
//                 } else {
//                     header.classList.remove("dark-header");
//                 }
//             });
//         },
//         {
//             threshold: 0.1,
//         }
//     );

//     observer.observe(bannerSection);
// }

function checkHeader({ isDark = false, target = '' } = {}) {
    if (!target) return;
    const header = document.querySelector('#main-header');
    const contentSection = document.querySelector(target);
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting || isDark) {
                    header.classList.add('dark-header');
                } else {
                    header.classList.remove('dark-header');
                }
            });
        },
        {
            threshold: 0.1,
        },
    );

    observer.observe(contentSection);
}

const cardListHorizontal = document.querySelector('.card-list-horizontal.swiper-container');
function initMobileSwiper() {
    if (window.innerWidth < 768) {
        if (!window.mobileSwiper) {
            window.mobileSwiper = new Swiper('.card-list-horizontal.swiper-container', {
                slidesPerView: 'auto',
                spaceBetween: 16,
                // centeredSlides: true,
                speed: 500,
                effect: 'slide',
                slidesOffsetAfter: 20,
            });
        }
    } else {
        if (window.mobileSwiper) {
            window.mobileSwiper.destroy();
            window.mobileSwiper = null;
        }
    }
}
if (cardListHorizontal) {
    window.addEventListener('resize', initMobileSwiper);
    window.addEventListener('DOMContentLoaded', initMobileSwiper);
}
