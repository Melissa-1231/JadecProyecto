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

  // 4. Control del Menú Lateral Deslizable (Off-Canvas Side Drawer)
  const btnMenuMovil = document.getElementById('btnMenuMovil');
  const navDrawerMenu = document.getElementById('navDrawerMenu');
  const navDrawerOverlay = document.getElementById('navDrawerOverlay');
  const btnDrawerClose = document.getElementById('btnDrawerClose');

  if (btnMenuMovil && navDrawerMenu) {
    const openDrawer = () => {
      navDrawerMenu.classList.add('is-active');
      btnMenuMovil.classList.add('is-active');
      btnMenuMovil.setAttribute('aria-expanded', 'true');
      btnMenuMovil.setAttribute('aria-label', 'Cerrar menú de navegación');
      if (navDrawerOverlay) navDrawerOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden'; // Evitar scroll de fondo mientras el drawer está abierto
    };

    const closeDrawer = () => {
      navDrawerMenu.classList.remove('is-active');
      btnMenuMovil.classList.remove('is-active');
      btnMenuMovil.setAttribute('aria-expanded', 'false');
      btnMenuMovil.setAttribute('aria-label', 'Abrir menú de navegación');
      if (navDrawerOverlay) navDrawerOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    const toggleDrawer = () => {
      if (navDrawerMenu.classList.contains('is-active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    // Alternar drawer al presionar el botón hamburguesa
    btnMenuMovil.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    // Botón de cerrar interno en el drawer
    if (btnDrawerClose) {
      btnDrawerClose.addEventListener('click', () => {
        closeDrawer();
      });
    }

    // Cerrar al hacer clic en el overlay exterior
    if (navDrawerOverlay) {
      navDrawerOverlay.addEventListener('click', () => {
        closeDrawer();
      });
    }

    // Auto-cierre al hacer clic en cualquier enlace del drawer
    const drawerLinks = navDrawerMenu.querySelectorAll('.nav-drawer-link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawerMenu.classList.contains('is-active')) {
        closeDrawer();
        btnMenuMovil.focus();
      }
    });

    // Si la pantalla se redimensiona a escritorio (> 860px), cerrar drawer automáticamente
    const mediaQueryDesktop = window.matchMedia('(min-width: 861px)');
    mediaQueryDesktop.addEventListener('change', (e) => {
      if (e.matches && navDrawerMenu.classList.contains('is-active')) {
        closeDrawer();
      }
    });
  }

  // 5. Botón Flotante Volver Arriba (Scroll to Top)
  const btnVolverArriba = document.getElementById('btn-volver-arriba');
  if (btnVolverArriba) {
    // Escuchar el evento scroll para mostrar/ocultar el botón
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btnVolverArriba.classList.add('mostrar');
      } else {
        btnVolverArriba.classList.remove('mostrar');
      }
    }, { passive: true });

    // Desplazamiento fluido al inicio al hacer clic
    btnVolverArriba.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Inicialización del Carrusel Interactivo: Barnices Especiales (11 Productos)
  const carouselEspeciales = document.getElementById('carouselEspeciales');
  if (carouselEspeciales) {
    const track = carouselEspeciales.querySelector('.carousel-especiales-track');
    const slides = carouselEspeciales.querySelectorAll('.slide-especial');
    const prevBtn = carouselEspeciales.querySelector('.carousel-btn-especial-prev');
    const nextBtn = carouselEspeciales.querySelector('.carousel-btn-especial-next');
    const dots = carouselEspeciales.querySelectorAll('.carousel-dot-especial');
    const totalSlides = slides.length;
    let currentIndex = 0;

    const getItemsPerView = () => {
      if (window.innerWidth > 1024) return 3;
      if (window.innerWidth > 640) return 2;
      return 1;
    };

    const getGap = () => {
      if (window.innerWidth > 1024) return 24;
      if (window.innerWidth > 640) return 20;
      return 16;
    };

    const updateCarousel = (index) => {
      const itemsPerView = getItemsPerView();
      const maxIndex = Math.max(0, totalSlides - itemsPerView);

      if (index < 0) {
        currentIndex = maxIndex;
      } else if (index > maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      if (slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = getGap();
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
      }

      // Actualizar estado activo en slides visibles
      slides.forEach((slide, idx) => {
        const isVisible = idx >= currentIndex && idx < currentIndex + itemsPerView;
        slide.classList.toggle('active', isVisible);
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
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalSlides - itemsPerView);
        updateCarousel(Math.min(idx, maxIndex));
      });
    });

    // Soporte para navegación por teclado (Flechas izquierda / derecha)
    carouselEspeciales.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateCarousel(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateCarousel(currentIndex + 1);
      }
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
        updateCarousel(currentIndex + 1); // Swipe hacia la izquierda -> siguiente
      } else if (endX - startX > 45) {
        updateCarousel(currentIndex - 1); // Swipe hacia la derecha -> anterior
      }
    }, { passive: true });

    // Recalcular posición al redimensionar ventana con debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCarousel(currentIndex);
      }, 100);
    });

    // Inicialización al cargar la página
    updateCarousel(0);
  }

  // 7. Navegación Dinámica ScrollSpy (IntersectionObserver)
  const navLinksDesktop = document.querySelectorAll('.nav-links .nav-link, .nav-links a');
  const navLinksDrawer = document.querySelectorAll('.nav-drawer-links .nav-drawer-link');
  const allNavLinks = [...navLinksDesktop, ...navLinksDrawer];

  if (allNavLinks.length > 0) {
    // Definir secciones clave en orden de aparición en el DOM
    const targetSectionIds = [
      'barnices-tecnologias',
      'barnices-brillantes',
      'barnices-base-uv',
      'barnices-especiales'
    ];

    const observedSections = [];

    targetSectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        observedSections.push({ id, el });
      }
    });

    const setActiveNav = (activeId) => {
      allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const target = href.replace(/^#/, '');

        // Soporta coincidencia exacta o alias
        const isMatch = (target === activeId) ||
          (activeId === 'barnices-tecnologias' && target === 'barnices-base-agua');

        if (activeId && isMatch) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    if (observedSections.length > 0 && 'IntersectionObserver' in window) {
      const visibleRatios = new Map();

      const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleRatios.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleRatios.delete(entry.target.id);
          }
        });

        // 1. Si el scroll está en el Hero superior, limpiar selección
        if (window.scrollY < 180) {
          setActiveNav(null);
          return;
        }

        // 2. Si el usuario llega al final de la página (Footer), activar la última sección
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
        if (isAtBottom) {
          const lastSec = observedSections[observedSections.length - 1];
          if (lastSec) {
            setActiveNav(lastSec.id);
            return;
          }
        }

        // 3. Determinar la sección predominante en el área activa de lectura
        if (visibleRatios.size > 0) {
          let maxRatio = -1;
          let bestSectionId = null;

          observedSections.forEach(({ id }) => {
            if (visibleRatios.has(id)) {
              const ratio = visibleRatios.get(id);
              if (ratio > maxRatio) {
                maxRatio = ratio;
                bestSectionId = id;
              }
            }
          });

          if (bestSectionId) {
            setActiveNav(bestSectionId);
          }
        }
      }, {
        root: null,
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
      });

      observedSections.forEach(({ el }) => scrollSpyObserver.observe(el));

      // Respaldo de eventos pasivos para tope y fondo de la página
      window.addEventListener('scroll', () => {
        if (window.scrollY < 180) {
          setActiveNav(null);
        } else if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
          const lastSec = observedSections[observedSections.length - 1];
          if (lastSec) {
            setActiveNav(lastSec.id);
          }
        }
      }, { passive: true });
    }
  }
});