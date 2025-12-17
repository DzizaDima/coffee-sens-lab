document.addEventListener('DOMContentLoaded', function() {
  const subtitleElement = document.querySelector('[data-subtitle-text]');
  if (!subtitleElement) return;

  const text = subtitleElement.textContent;
  const sensLogoUrl = subtitleElement.getAttribute('data-sens-logo');

  if (!sensLogoUrl || !text) return;

  if (/sens/gi.test(text)) {
    const regex = /sens/gi;
    let lastIndex = 0;
    let newHTML = '';
    let match;

    while ((match = regex.exec(text)) !== null) {
      newHTML += document.createTextNode(text.substring(lastIndex, match.index)).textContent;
      
      const img = document.createElement('img');
      img.src = sensLogoUrl;
      img.alt = 'sens';
      img.className = 'craft-section__sens-logo';
      img.setAttribute('width', '100');
      img.setAttribute('height', '100');
      img.setAttribute('aria-label', 'sens');
      newHTML += img.outerHTML;
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      newHTML += document.createTextNode(text.substring(lastIndex)).textContent;
    }
    
    subtitleElement.innerHTML = newHTML;
  }
});

