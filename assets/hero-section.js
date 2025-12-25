document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".hero-section__slide");
    const cards = document.querySelectorAll(".hero-section__slider-card");
    const sliderTrack = document.querySelector(".hero-section__slider-track");
    let hideTimeout = null;

    const showCard = (productIndex) => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        // Pause animation when showing the card
        if (sliderTrack) {
            sliderTrack.classList.add("paused");
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
            // Resume animation
            if (sliderTrack) {
                sliderTrack.classList.remove("paused");
            }
            hideTimeout = null;
        }, 100);
    };

    slides.forEach((slide) => {
        slide.addEventListener("mouseenter", () => {
            const productIndex = slide.getAttribute("data-product-index");
            showCard(productIndex);
        });
    });

    // Slider - hide cards when mouse leaves
    const slider = document.querySelector(".hero-section__slider");
    if (slider) {
        slider.addEventListener("mouseleave", () => {
            hideAllCards();
        });
    }

    // Cards - mouseenter cancels hiding, mouseleave hides
    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            // Keep animation paused
            if (sliderTrack) {
                sliderTrack.classList.add("paused");
            }
        });
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
