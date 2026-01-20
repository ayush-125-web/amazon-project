// Carousel functionality for rotating posters
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".indicator");
  
  // Check if carousel elements exist
  if (slides.length === 0) {
    console.error("Carousel slides not found");
    return;
  }
  
  let currentSlide = 0;
  let carouselInterval = null;
  let isTransitioning = false;

  function showSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Remove active class from all slides and indicators
    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    // Add active class to current slide and indicator
    slides[index].classList.add("active");
    indicators[index].classList.add("active");
    currentSlide = index;

    // Reset transition flag after transition completes
    setTimeout(() => {
      isTransitioning = false;
    }, 850); // Match CSS transition duration (0.8s + small buffer)
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startCarousel() {
    // Clear any existing interval first
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
    // Start carousel - first slide shows for 5 seconds, then transitions
    carouselInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  // Initialize carousel - ensure first slide is active
  // Make sure all slides are hidden except the first one
  slides.forEach((slide, index) => {
    if (index === 0) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });
  
  // Set active indicator
  indicators.forEach((indicator, index) => {
    if (index === 0) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
  
  currentSlide = 0;
  
  // Add click handlers to indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      if (index === currentSlide) return; // Don't do anything if clicking current slide
      stopCarousel();
      showSlide(index);
      // Restart carousel after showing the selected slide
      setTimeout(() => {
        startCarousel();
      }, 900); // Wait for transition to complete
    });
  });

  // Pause on hover
  const carousel = document.querySelector(".poster-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      stopCarousel();
    });
    carousel.addEventListener("mouseleave", () => {
      startCarousel();
    });
  }

  // Start carousel after ensuring everything is set up
  // Use requestAnimationFrame to ensure DOM is fully ready
  requestAnimationFrame(() => {
    setTimeout(() => {
      startCarousel();
    }, 500);
  });

  // Backup: Also start on window load in case images delay initialization
  window.addEventListener("load", () => {
    if (!carouselInterval) {
      startCarousel();
    }
  });
});
