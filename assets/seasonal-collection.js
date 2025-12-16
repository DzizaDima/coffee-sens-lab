document.addEventListener("DOMContentLoaded", () => {
    new Swiper(".seasonal-collection_swiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            320: {
                slidesPerView: 1.1,
                spaceBetween: 12,
            },
            480: {
                slidesPerView: 1.7,
                spaceBetween: 14,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });
});
