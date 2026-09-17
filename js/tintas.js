/**
 * JADEC (Soluciones Químicas) - Módulo JS para Tintas (js/tintas.js)
 * Manejo de interacciones de catálogo y enlace contextual con el modal B2B.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Manejo de enlaces de anclaje suave dentro de la página
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

  // 2. Personalización contextual de solicitud al hacer clic en las tarjetas del catálogo
  const catalogCards = document.querySelectorAll('.catalog-card');
  const processInput = document.getElementById('fieldProcess');

  catalogCards.forEach(card => {
    // Función para transferir el título de la ficha al formulario
    const setContextualSubject = () => {
      const titleElement = card.querySelector('.catalog-card__title');
      if (titleElement && processInput) {
        const productTitle = titleElement.textContent.trim();
        processInput.value = `Interés en: ${productTitle}. Requiero información técnica y cotización.`;
      }
    };

    // Al hacer clic en cualquier parte de la tarjeta
    card.addEventListener('click', setContextualSubject);

    // Soporte de accesibilidad por teclado (Enter o Espacio)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setContextualSubject();
        if (window.JadecModal && typeof window.JadecModal.open === 'function') {
          window.JadecModal.open(card);
        }
      }
    });
  });

  // 3. Controlador del Carrusel de Tintas Base Agua (5 Diapositivas)
  const initWaterInksCarousel = () => {
    const carouselEl = document.getElementById('waterInksCarousel');
    const track = document.getElementById('waterInksTrack');
    const prevBtn = document.getElementById('waterInksPrev');
    const nextBtn = document.getElementById('waterInksNext');
    const dotsContainer = document.getElementById('waterInksDots');

    if (!carouselEl || !track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const dots = Array.from(dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : []);
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 5000; // 5 segundos

    // Función principal para cambiar de diapositiva
    const goToSlide = (index) => {
      // Cálculo circular para navegación infinita
      currentIndex = (index + totalSlides) % totalSlides;

      // Desplazamiento del riel
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Actualizar estado de las diapositivas
      slides.forEach((slide, idx) => {
        const isActive = idx === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', !isActive);
      });

      // Actualizar indicadores / dots
      dots.forEach((dot, idx) => {
        const isActive = idx === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        dot.tabIndex = isActive ? 0 : -1;
      });
    };

    // Navegación: Diapositiva siguiente y anterior
    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        restartAutoplay();
      });
    }

    // Navegación mediante clic en los indicadores (Dots)
    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        const targetDot = e.target.closest('.carousel-dot');
        if (targetDot) {
          e.preventDefault();
          const slideIndex = parseInt(targetDot.getAttribute('data-slide-to'), 10);
          if (!isNaN(slideIndex)) {
            goToSlide(slideIndex);
            restartAutoplay();
          }
        }
      });
    }

    // Navegación por teclado (Flechas Izquierda / Derecha)
    carouselEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        restartAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        restartAutoplay();
      }
    });

    // Soporte para gestos táctiles (Touch Swipe en móviles)
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 45;

    carouselEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseAutoplay();
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
      const diffX = touchEndX - touchStartX;
      if (diffX < -SWIPE_THRESHOLD) {
        nextSlide();
      } else if (diffX > SWIPE_THRESHOLD) {
        prevSlide();
      }
    };

    // Autoplay con pausa en hover o foco
    const startAutoplay = () => {
      if (!autoplayInterval) {
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
      }
    };

    const pauseAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    const restartAutoplay = () => {
      pauseAutoplay();
      startAutoplay();
    };

    carouselEl.addEventListener('mouseenter', pauseAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);
    carouselEl.addEventListener('focusin', pauseAutoplay);
    carouselEl.addEventListener('focusout', startAutoplay);

    // Iniciar estado inicial y autoplay
    goToSlide(0);
    startAutoplay();
  };

  initWaterInksCarousel();

  // 4. Enlace contextual del botón CTA de Tintas Base Agua con el modal
  const waterInksCta = document.querySelector('.water-inks-cta');
  if (waterInksCta && processInput) {
    waterInksCta.addEventListener('click', () => {
      const context = waterInksCta.getAttribute('data-product-context') || 'Tintas Base Agua';
      processInput.value = `Interés en: ${context}. Requiero asesoría técnica y cotización por volumen.`;
    });
  }

  // 5. Controlador de Acordeón Expandible de Tintas Pantone (Flex-Grow)
  const initPantoneAccordion = () => {
    const accordion = document.getElementById('pantoneAccordion');
    if (!accordion) return;

    const panels = Array.from(accordion.querySelectorAll('.pantone-panel'));
    if (panels.length === 0) return;

    const setActivePanel = (selectedPanel) => {
      panels.forEach(panel => {
        const isActive = panel === selectedPanel;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });
    };

    panels.forEach(panel => {
      // Manejo de clic para expandir el panel
      panel.addEventListener('click', (e) => {
        // Si el clic fue en el botón CTA interno, dejar que maneje el modal
        if (e.target.closest('.btn-panel-cta')) return;
        setActivePanel(panel);
      });

      // Manejo de accesibilidad por teclado (Enter o Espacio)
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!e.target.closest('.btn-panel-cta')) {
            e.preventDefault();
            setActivePanel(panel);
          }
        }
      });

      // Efecto interactivo al pasar el cursor en resoluciones de escritorio
      panel.addEventListener('mouseenter', () => {
        if (window.innerWidth > 880) {
          setActivePanel(panel);
        }
      });
    });

    // Enlace contextual de los botones CTA de cada panel con el formulario modal
    const panelCtaButtons = accordion.querySelectorAll('.btn-panel-cta');
    panelCtaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const context = btn.getAttribute('data-product-context') || 'Tintas Pantone';
        if (processInput) {
          processInput.value = `Interés en: ${context}. Requiero formulación, asesoría y cotización.`;
        }
      });
    });
  };

  initPantoneAccordion();

  // 6. Controlador de Índice Vertical & Visor / Acordeón Móvil de Aditivos
  const initAdditivesSection = () => {
    const listContainer = document.getElementById('additivesList');
    const displayContainer = document.getElementById('additivesDisplay');
    if (!listContainer || !displayContainer) return;

    const tabs = Array.from(listContainer.querySelectorAll('.additive-tab'));
    const panels = Array.from(displayContainer.querySelectorAll('.additive-panel'));
    if (tabs.length === 0 || panels.length === 0) return;

    // Sincroniza la estructura según sea resolución de escritorio (split-screen) o móvil (acordeón vertical)
    const syncLayout = () => {
      const isMobile = window.innerWidth <= 900;
      const activeTab = listContainer.querySelector('.additive-tab.is-active') || tabs[0];
      const targetId = activeTab.getAttribute('data-target');
      const activePanel = document.getElementById(targetId);

      if (isMobile) {
        // En móvil: el panel activo se sitúa directamente debajo de su pestaña (acordeón vertical)
        if (activePanel && activeTab.nextElementSibling !== activePanel) {
          activeTab.after(activePanel);
        }
      } else {
        // En escritorio: todos los paneles deben residir dentro de .additives-display
        panels.forEach(panel => {
          if (panel.parentElement !== displayContainer) {
            displayContainer.appendChild(panel);
          }
        });
      }
    };

    const activateAdditive = (selectedTab) => {
      const targetId = selectedTab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      const isMobile = window.innerWidth <= 900;

      tabs.forEach(tab => {
        const isActive = tab === selectedTab;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const isMatch = panel.id === targetId;
        panel.classList.toggle('is-active', isMatch);
      });

      if (isMobile) {
        selectedTab.after(targetPanel);
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        activateAdditive(tab);
      });

      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateAdditive(tab);
        }
      });
    });

    // Manejo de botones CTA de los paneles para el formulario modal B2B
    const ctaButtons = document.querySelectorAll('.additive-panel__cta');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const context = btn.getAttribute('data-product-context') || 'Aditivos de Proceso';
        if (processInput) {
          processInput.value = `Interés en: ${context}. Requiero asesoría técnica y cotización.`;
        }
      });
    });

    // Escuchar cambios de tamaño de pantalla con debounce simple
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncLayout, 150);
    });

    // Inicializar sincronización
    syncLayout();
  };

  initAdditivesSection();
});



