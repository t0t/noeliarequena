let slideIndex = 1;
let isLightboxOpen = false;

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

// Close lightbox when clicking outside of the image
document.addEventListener('click', function(event) {
  const lightbox = document.getElementById('lightbox');
  const modalContent = document.querySelector('.modal-content');
  
  if (isLightboxOpen && event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
  if (!isLightboxOpen) return;
  
  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (event.key === 'ArrowRight') {
    changeSlide(1);
  }
});

// Initialize Masonry
document.addEventListener('DOMContentLoaded', function() {
  var grid = document.querySelector('.masonry');
  
  function initMasonry() {
    var width = window.innerWidth;
    return new Masonry(grid, {
      itemSelector: '.masonry-item',
      columnWidth: width > 1200 ? 200 : width > 992 ? 180 : width > 768 ? 160 : 140,
      gutter: 0,
      fitWidth: true,
      horizontalOrder: true
    });
  }

  // Initialize Masonry after all images are loaded
  imagesLoaded(grid, function() {
    var masonry = initMasonry();
    
    // Reinicializar Masonry cuando cambie el tamaño de la ventana
    window.addEventListener('resize', function() {
      masonry.destroy();
      masonry = initMasonry();
    });
  });
});
