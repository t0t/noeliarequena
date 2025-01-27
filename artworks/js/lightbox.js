let slideIndex = 1;
let isLightboxOpen = false;
let masonry = null;
let resizeTimeout = null;

function openLightbox() {
  document.getElementById('lightbox').style.display = "block";
  isLightboxOpen = true;
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = "none";
  isLightboxOpen = false;
}

function changeSlide(n) {
  showSlides(slideIndex += n);
}

function toSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  slides[slideIndex-1].style.display = "block";
}

// Inicializar Masonry de manera optimizada
function initMasonry() {
  const grid = document.querySelector('.masonry');
  if (!grid) return;

  const options = {
    itemSelector: '.masonry-item',
    columnWidth: '.masonry-item',
    percentPosition: true,
    gutter: 20,
    transitionDuration: '0.2s'
  };

  // Destruir instancia anterior si existe
  if (masonry) {
    masonry.destroy();
  }

  // Crear nueva instancia
  masonry = new Masonry(grid, options);

  // Recargar layout cuando las imágenes estén cargadas
  imagesLoaded(grid).on('progress', () => {
    masonry.layout();
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Masonry
  initMasonry();

  // Manejar resize con debounce
  window.addEventListener('resize', function() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(initMasonry, 250);
  });

  // Cerrar lightbox al hacer clic fuera
  document.getElementById('lightbox').addEventListener('click', function(event) {
    if (event.target === this) {
      closeLightbox();
    }
  });

  // Navegación por teclado
  document.addEventListener('keydown', function(event) {
    if (!isLightboxOpen) return;
    
    switch(event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        changeSlide(-1);
        break;
      case 'ArrowRight':
        changeSlide(1);
        break;
    }
  });
});
