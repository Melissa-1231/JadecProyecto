/**
 * JADEC (Soluciones Químicas) - Catálogo ACTEGA (js/actega.js)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Manejo de desplazamiento suave para enlaces internos
    const smoothLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    smoothLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // 2. Control del Menú Móvil (Hamburguesa)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.site-nav');

    if (navToggle && navMenu) {
      // Toggle abrir/cerrar al presionar el botón de 3 barras
      navToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('is-active');
        navToggle.classList.toggle('is-active');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.setAttribute('aria-label', isOpen ? 'Cerrar Menú de Navegación' : 'Abrir Menú de Navegación');
      });

      // Regla de UX: Cerrar menú automáticamente al presionar cualquier enlace
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('is-active');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Abrir Menú de Navegación');
        });
      });

      // Cerrar menú al hacer clic fuera del header o del nav
      document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          if (navMenu.classList.contains('is-active')) {
            navMenu.classList.remove('is-active');
            navToggle.classList.remove('is-active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir Menú de Navegación');
          }
        }
      });

      // Cerrar con tecla Escape para accesibilidad
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
          navMenu.classList.remove('is-active');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Abrir Menú de Navegación');
          navToggle.focus();
        }
      });

      // Cerrar menú si la pantalla se redimensiona a escritorio (> 992px)
      window.addEventListener('resize', function () {
        if (window.innerWidth > 992 && navMenu.classList.contains('is-active')) {
          navMenu.classList.remove('is-active');
          navToggle.classList.remove('is-active');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Abrir Menú de Navegación');
        }
      }, { passive: true });
    }
  });
})();
