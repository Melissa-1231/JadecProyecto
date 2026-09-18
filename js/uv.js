/**
 * JADEC (Soluciones Químicas) / DAKA - Lógica de Interacción: Barnices UV (js/uv.js)
 * Manejo de navegación suave, accesibilidad y carrusel interactivo de la Línea Matte.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Desplazamiento suave para enlaces de anclaje internos
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 2. Soporte de accesibilidad por teclado y animación de aparición (Scroll Reveal)
  const interactiveCards = document.querySelectorAll('.tarjeta-interactiva, .tarjeta-uv, .tarjeta-catalogo');
  interactiveCards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Animación suave de aparición al hacer scroll (Intersection Observer)
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    interactiveCards.forEach(card => {
      card.classList.add('reveal-on-scroll');
      cardObserver.observe(card);
    });
  }

  // 3. Inicialización del Carrusel Interactivo de Productos (Línea Matte)
  const carousel = document.getElementById('carouselMatte');
  if (carousel) {
    const track = carousel.querySelector('.carousel-matte-track');
    const slides = carousel.querySelectorAll('.carousel-matte-slide');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    const totalSlides = slides.length;

    const updateCarousel = (index) => {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      // Desplazamiento del track con transición suave
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Actualizar clases activas en slides
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
      });

      // Actualizar dots de paginación
      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
      });
    });

    // Soporte para gestos táctiles (Swipe en móviles y tablets)
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      if (startX - endX > 45) {
        updateCarousel(currentIndex + 1); // Swipe izquierda -> siguiente
      } else if (endX - startX > 45) {
        updateCarousel(currentIndex - 1); // Swipe derecha -> anterior
      }
    }, { passive: true });
  }

  // 4. Control del Menú Hamburguesa Móvil
  const btnMenuMovil = document.getElementById('btnMenuMovil');
  const navLinksMenu = document.getElementById('navLinksMenu');

  if (btnMenuMovil && navLinksMenu) {
    const toggleMenu = () => {
      const isExpanded = btnMenuMovil.getAttribute('aria-expanded') === 'true';
      btnMenuMovil.setAttribute('aria-expanded', String(!isExpanded));
      btnMenuMovil.classList.toggle('activo');
      navLinksMenu.classList.toggle('activo');
    };

    btnMenuMovil.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar menú al hacer clic en cualquier enlace interno
    const navLinksItems = navLinksMenu.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksMenu.classList.contains('activo')) {
          toggleMenu();
        }
      });
    });

    // Cerrar el menú al hacer clic fuera del header
    document.addEventListener('click', (e) => {
      if (navLinksMenu.classList.contains('activo') && !e.target.closest('.nav-bar-custom')) {
        toggleMenu();
      }
    });

    // Cerrar el menú con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksMenu.classList.contains('activo')) {
        toggleMenu();
        btnMenuMovil.focus();
      }
    });
  }
});