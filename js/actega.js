/* =============================================================================
   TINTAS.JS — Lógica interactiva para la página de Tintas Flexo
   Compatible con múltiples carruseles en la misma página
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Buscamos TODOS los carruseles que haya en la página
  const carousels = document.querySelectorAll('.uv-carousel-wrapper');

  carousels.forEach((wrapper) => {
    const track = wrapper.querySelector('.uv-carousel-track');
    const nextBtn = wrapper.querySelector('.uv-nav-btn.next');
    const prevBtn = wrapper.querySelector('.uv-nav-btn.prev');
    const dotsContainer = wrapper.querySelector('.uv-dots');

    if (!track) return;
    
    const slides = Array.from(track.children);
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
    
    let currentIndex = 0;
    let autoPlayTimer = null;
    
    function updateSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      
      // Mueve la tira (track) de manera individual para este carrusel
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Actualiza los puntos (dots)
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateSlide(currentIndex + 1);
        resetAutoplay();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateSlide(currentIndex - 1);
        resetAutoplay();
      });
    }
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        updateSlide(parseInt(e.target.dataset.index));
        resetAutoplay();
      });
    });
    
    // Autoplay individual. startAutoplay() limpia siempre el temporizador
    // anterior para no dejar intervalos huérfanos acumulándose.
    function startAutoplay() {
      stopAutoplay();
      autoPlayTimer = setInterval(() => {
        updateSlide(currentIndex + 1);
      }, 5000);
    }

    function stopAutoplay() {
      if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
    }

    // No animar en una pestaña en segundo plano.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });
    
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }
    
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    
    startAutoplay();
  });
});