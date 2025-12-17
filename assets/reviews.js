(function() {
  'use strict';

  function initVideoUnmute() {
    const unmuteButtons = document.querySelectorAll('.reviews_card__play-button');
    
    unmuteButtons.forEach((button) => {
      const videoContainer = button.closest('.reviews_card.--with-video');
      if (!videoContainer) return;
      
      const video = videoContainer.querySelector('video');
      if (!video) return;

      // Добавляем aria-label для видео
      const authorName = videoContainer.querySelector('.reviews_card__author-info strong')?.textContent || 'Review';
      if (!video.getAttribute('aria-label')) {
        video.setAttribute('aria-label', authorName + ' - video review');
      }

      // Инициализация состояния
      updateButtonState(button, video.muted);

      // Обработчик клика
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (video.muted) {
          video.muted = false;
          video.play().catch(function(error) {
            console.warn('Video play failed:', error);
          });
        } else {
          video.muted = true;
        }
        
        updateButtonState(button, video.muted);
      });

      // Синхронизация состояния при изменении muted
      video.addEventListener('volumechange', function() {
        updateButtonState(button, video.muted);
      });
    });
  }

  function updateButtonState(button, isMuted) {
    if (isMuted) {
      button.setAttribute('aria-label', 'Unmute video');
      button.classList.remove('--unmuted');
      button.classList.add('--muted');
    } else {
      button.setAttribute('aria-label', 'Mute video');
      button.classList.remove('--muted');
      button.classList.add('--unmuted');
    }
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoUnmute);
  } else {
    initVideoUnmute();
  }

  // Инициализация для динамически добавленного контента
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', initVideoUnmute);
  }
})();

