document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".hero-section__slider", {
        direction: "vertical",
        loop: true,
        slidesPerView: 2.7,
        speed: 1000,
        autoplay: {
            delay: 2000,
            pauseOnMouseEnter: true,
        },
    });

    // Обработка hover для показа карточек продуктов
    const slides = document.querySelectorAll('.hero-section__slide');
    const cards = document.querySelectorAll('.hero-section__slider-card');
    let hideTimeout = null;

    const showCard = (productIndex) => {
        // Отменяем таймер скрытия, если он был установлен
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        // Скрываем все карточки
        cards.forEach(card => {
            card.classList.remove('active');
        });
        // Показываем соответствующую карточку
        const targetCard = document.querySelector(`.hero-section__slider-card[data-product-index="${productIndex}"]`);
        if (targetCard) {
            targetCard.classList.add('active');
        }
    };

    const hideAllCards = () => {
        // Используем небольшую задержку, чтобы можно было перейти на карточку
        hideTimeout = setTimeout(() => {
            cards.forEach(card => {
                card.classList.remove('active');
            });
            hideTimeout = null;
        }, 100);
    };

    // При наведении на слайд - показываем карточку
    slides.forEach((slide) => {
        slide.addEventListener('mouseenter', () => {
            const productIndex = slide.getAttribute('data-product-index');
            showCard(productIndex);
        });
    });

    // При наведении на карточку - показываем её (если курсор перешёл на карточку)
    cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            const productIndex = card.getAttribute('data-product-index');
            showCard(productIndex);
        });
    });

    // При уходе курсора со слайда - скрываем карточки с задержкой
    const slider = document.querySelector('.hero-section__slider');
    if (slider) {
        slider.addEventListener('mouseleave', () => {
            hideAllCards();
        });
    }

    // При уходе курсора с карточки - скрываем её
    cards.forEach((card) => {
        card.addEventListener('mouseleave', () => {
            hideAllCards();
        });
    });

    // Таймер обратного отсчета
    const countdownElement = document.querySelector('.hero-section__timer-countdown');
    if (countdownElement) {
        const endDateStr = countdownElement.getAttribute('data-end-date');
        if (endDateStr) {
            const formatTime = (value) => {
                return String(value).padStart(2, '0');
            };

            const updateCountdown = () => {
                const endDate = new Date(endDateStr.replace(' ', 'T'));
                const now = new Date();
                const difference = endDate - now;

                if (difference <= 0) {
                    // Таймер истек
                    const hoursEl = countdownElement.querySelector('.timer-hours');
                    const minutesEl = countdownElement.querySelector('.timer-minutes');
                    const secondsEl = countdownElement.querySelector('.timer-seconds');
                    if (hoursEl) hoursEl.textContent = '00';
                    if (minutesEl) minutesEl.textContent = '00';
                    if (secondsEl) secondsEl.textContent = '00';
                    return;
                }

                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                const hoursEl = countdownElement.querySelector('.timer-hours');
                const minutesEl = countdownElement.querySelector('.timer-minutes');
                const secondsEl = countdownElement.querySelector('.timer-seconds');

                if (hoursEl) hoursEl.textContent = formatTime(hours);
                if (minutesEl) minutesEl.textContent = formatTime(minutes);
                if (secondsEl) secondsEl.textContent = formatTime(seconds);
            };

            // Обновляем таймер каждую секунду
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }
});
