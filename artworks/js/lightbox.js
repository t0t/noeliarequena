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
