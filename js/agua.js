/**
 * JADEC (Soluciones Químicas) - Lógica de Interacción: Barnices Base Agua (js/agua.js)
 * Arquitectura modular: desplazamiento suave, accesibilidad de navegación y control de menú móvil.
 */

(() => {
  'use strict';

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

    // 2. Control del Smart Header (Ocultar al bajar / Mostrar al subir) y Menú Desplegable
    const header = document.querySelector('.nav-bar-custom');
    const btnMenuMovil = document.getElementById('btnMenuMovil');
    const navLinksMenu = document.getElementById('navLinksMenu');
    let lastScrollTop = 0;

    // Lógica del Smart Header
    if (header) {
      const headerHeight = header.offsetHeight || 70;

      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Si el menú desplegable está abierto, pausamos el Smart Header para no ocultar el menú mientras el usuario navega
        if (navLinksMenu && navLinksMenu.classList.contains('activo')) {
          lastScrollTop = currentScroll;
          return;
        }

        // Prevenir comportamiento errático en rebote superior (iOS bounce)
        if (currentScroll < 0) return;

        if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
          // Scrolling hacia abajo: ocultar header
          header.classList.add('nav-oculto');
        } else if (currentScroll < lastScrollTop) {
          // Scrolling hacia arriba: mostrar header
          header.classList.remove('nav-oculto');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      }, { passive: true });
    }

    // Lógica del Menú Desplegable (Tablet / Móvil)
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

    // 3. Inicialización del Carrusel Interactivo de Productos (Barnices Matte - 2 Slides)
    const carousel = document.getElementById('carouselMatteAgua');
    if (carousel) {
      const track = carousel.querySelector('.carousel-matte-track');
      const slides = carousel.querySelectorAll('.carousel-matte-slide');
      const prevBtn = carousel.querySelector('.carousel-btn-prev');
      const nextBtn = carousel.querySelector('.carousel-btn-next');
      const dots = carousel.querySelectorAll('.carousel-dot');
      let currentIndex = 0;
      const totalSlides = slides.length;

      if (track && totalSlides > 0) {
        const updateCarousel = (index) => {
          if (index < 0) {
            currentIndex = totalSlides - 1;
          } else if (index >= totalSlides) {
            currentIndex = 0;
          } else {
            currentIndex = index;
          }

          // Desplazamiento del track con animación fluida
          track.style.transform = `translateX(-${currentIndex * 100}%)`;

          // Actualizar estado activo en slides
          slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
          });

          // Actualizar estado de los dots
          dots.forEach((dot, idx) => {
            const isActive = idx === currentIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', String(isActive));
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
    }

    // 4. Interacción en Tarjetas de Sección 1: Barnices Brillantes (Preparado para Modales)
    const tarjetasBrillantes = document.querySelectorAll('.tarjeta-brillante-poster');
    tarjetasBrillantes.forEach(tarjeta => {
      const tituloElemento = tarjeta.querySelector('.tarjeta-poster-title');
      const tituloProducto = tituloElemento ? tituloElemento.textContent.trim() : 'Barniz Brillante';

      tarjeta.addEventListener('click', () => {
        console.log('Abriendo ficha técnica de:', tituloProducto);
      });

      // Accesibilidad por teclado (Enter / Space)
      tarjeta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tarjeta.click();
        }
      });
    });

    // 5. Interacción del Acordeón Horizontal Interactivo (Barnices Especiales)
    const accordionItems = document.querySelectorAll('.accordion-especiales .accordion-item');
    if (accordionItems.length > 0) {
      accordionItems.forEach(item => {
        const activateItem = () => {
          if (item.classList.contains('activo')) return;

          accordionItems.forEach(otherItem => {
            otherItem.classList.remove('activo');
            otherItem.setAttribute('aria-selected', 'false');
          });

          item.classList.add('activo');
          item.setAttribute('aria-selected', 'true');
        };

        // Activación por clic
        item.addEventListener('click', (e) => {
          // Si el clic proviene del botón CTA de solicitar información o un enlace interno, permitir su flujo
          if (e.target.closest('a')) return;
          activateItem();
        });

        // Accesibilidad por teclado (Enter / Space)
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a')) return;
            e.preventDefault();
            activateItem();
          }
        });
      });
    }

    // 6. Botón Flotante "Volver al Inicio" (Back to Top)
    const btnVolverArriba = document.getElementById('btnVolverArriba');
    if (btnVolverArriba) {
      window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition > 400) {
          btnVolverArriba.classList.add('mostrar');
        } else {
          btnVolverArriba.classList.remove('mostrar');
        }
      }, { passive: true });

      btnVolverArriba.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  });
})();
