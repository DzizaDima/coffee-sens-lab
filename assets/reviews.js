(function() {
  'use strict';

  function initVideoUnmute() {
    const unmuteButtons = document.querySelectorAll('.reviews_card__play-button');
    
    unmuteButtons.forEach((button) => {
      const videoContainer = button.closest('.reviews_card.--with-video');
      if (!videoContainer) return;
      
      const video = videoContainer.querySelector('video');
      if (!video) return;

      const authorName = videoContainer.querySelector('.reviews_card__author-info strong')?.textContent || 'Review';
      if (!video.getAttribute('aria-label')) {
        video.setAttribute('aria-label', authorName + ' - video review');
      }

      updateButtonState(button, video.muted);

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoUnmute);
  } else {
    initVideoUnmute();
  }

  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', initVideoUnmute);
  }
})();

