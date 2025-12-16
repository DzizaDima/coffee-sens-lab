document.addEventListener('DOMContentLoaded', function() {
  const hasHover = window.matchMedia('(hover: hover)').matches;
  
  const flavors = document.querySelectorAll('.choose-flavor__flavor');
  const collections = document.querySelectorAll('.choose-flavor__collections');

  if (!flavors.length || !collections.length) return;

  function showCollection(flavor, collection) {
    collections.forEach(col => {
      col.style.display = 'none';
      col.style.opacity = '0';
      col.setAttribute('aria-hidden', 'true');
      const relatedFlavor = document.querySelector(`[data-flavor-index="${col.getAttribute('data-collection-index')}"]`);
      if (relatedFlavor) {
        relatedFlavor.setAttribute('aria-expanded', 'false');
      }
    });

    collection.style.display = 'block';
    collection.setAttribute('aria-hidden', 'false');
    flavor.setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      collection.style.opacity = '1';
    }, 10);
  }

  function hideCollection(collection, flavor) {
    collection.style.opacity = '0';
    collection.setAttribute('aria-hidden', 'true');
    if (flavor) {
      flavor.setAttribute('aria-expanded', 'false');
    }
    setTimeout(() => {
      if (collection.style.opacity === '0') {
        collection.style.display = 'none';
      }
    }, 300);
  }

  collections.forEach(collection => {
    collection.style.display = 'none';
    collection.style.opacity = '0';
    collection.setAttribute('aria-hidden', 'true');
  });

  flavors.forEach(flavor => {
    const flavorIndex = flavor.getAttribute('data-flavor-index');
    const correspondingCollection = document.querySelector(
      `.choose-flavor__collections[data-collection-index="${flavorIndex}"]`
    );

    if (!correspondingCollection) return;

    flavor.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = flavor.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          hideCollection(correspondingCollection, flavor);
        } else {
          showCollection(flavor, correspondingCollection);
        }
      }
    });

    if (hasHover) {
      flavor.addEventListener('mouseenter', function() {
        showCollection(flavor, correspondingCollection);
      });

      flavor.addEventListener('mouseleave', function() {
        hideCollection(correspondingCollection, flavor);
      });

      correspondingCollection.addEventListener('mouseenter', function() {
        correspondingCollection.style.opacity = '1';
        correspondingCollection.style.display = 'block';
        correspondingCollection.setAttribute('aria-hidden', 'false');
        flavor.setAttribute('aria-expanded', 'true');
      });

      correspondingCollection.addEventListener('mouseleave', function() {
        hideCollection(correspondingCollection, flavor);
      });
    }
  });
});

