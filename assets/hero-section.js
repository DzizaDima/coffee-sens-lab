document.addEventListener("DOMContentLoaded", () => {
    new Swiper(".hero-section__slider", {
        direction: "vertical",
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 20,

        speed: 6000,

        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        freeMode: {
            enabled: true,
            momentum: false,
        },

        allowTouchMove: false,
    });

    const slides = document.querySelectorAll(".hero-section__slide");
    const cards = document.querySelectorAll(".hero-section__slider-card");
    let hideTimeout = null;

    const showCard = (productIndex) => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        cards.forEach((card) => {
            card.classList.remove("active");
        });
        const targetCard = document.querySelector(
            `.hero-section__slider-card[data-product-index="${productIndex}"]`
        );
        if (targetCard) {
            targetCard.classList.add("active");
        }
    };

    const hideAllCards = () => {
        hideTimeout = setTimeout(() => {
            cards.forEach((card) => {
                card.classList.remove("active");
            });
            hideTimeout = null;
        }, 100);
    };

    slides.forEach((slide) => {
        slide.addEventListener("mouseenter", () => {
            const productIndex = slide.getAttribute("data-product-index");
            showCard(productIndex);
        });
    });

    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            const productIndex = card.getAttribute("data-product-index");
            showCard(productIndex);
        });
    });

    const slider = document.querySelector(".hero-section__slider");
    if (slider) {
        slider.addEventListener("mouseleave", () => {
            hideAllCards();
        });
    }

    cards.forEach((card) => {
        card.addEventListener("mouseleave", () => {
            hideAllCards();
        });
    });

    const countdownElement = document.querySelector(
        ".hero-section__timer-countdown"
    );
    if (countdownElement) {
        const endDateStr = countdownElement.getAttribute("data-end-date");
        if (endDateStr) {
            const formatTime = (value) => {
                return String(value).padStart(2, "0");
            };

            const updateCountdown = () => {
                const endDate = new Date(endDateStr.replace(" ", "T"));
                const now = new Date();
                const difference = endDate - now;

                if (difference <= 0) {
                    const hoursEl =
                        countdownElement.querySelector(".timer-hours");
                    const minutesEl =
                        countdownElement.querySelector(".timer-minutes");
                    const secondsEl =
                        countdownElement.querySelector(".timer-seconds");
                    if (hoursEl) hoursEl.textContent = "00";
                    if (minutesEl) minutesEl.textContent = "00";
                    if (secondsEl) secondsEl.textContent = "00";
                    return;
                }

                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                const hoursEl = countdownElement.querySelector(".timer-hours");
                const minutesEl =
                    countdownElement.querySelector(".timer-minutes");
                const secondsEl =
                    countdownElement.querySelector(".timer-seconds");

                if (hoursEl) hoursEl.textContent = formatTime(hours);
                if (minutesEl) minutesEl.textContent = formatTime(minutes);
                if (secondsEl) secondsEl.textContent = formatTime(seconds);
            };

            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }
});
