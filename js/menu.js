/**
 * JADEC Soluciones Químicas - Control de Navegación & Smart Sticky Header (js/menu.js)
 * Maneja el menú móvil responsivo con botón hamburguesa animado a "X",
 * acordeón táctil para submenús y el comportamiento Smart Scroll
 * (ocultar la cenefa al bajar para no tapar contenido y mostrarla al subir).
 */

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header.site, .site-header');
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.querySelector('.site-nav');
    let lastScroll = 0;
    const scrollThreshold = 80;
    const scrollDelta = 5;

    // 1. Control del Menú Desplegable Móvil / Tablet
    if (navToggle && siteNav) {
      const toggleMenu = () => {
        const isActive = navToggle.classList.toggle('is-active');
        siteNav.classList.toggle('is-active', isActive);
        navToggle.setAttribute('aria-expanded', String(isActive));
        
        // Prevenir scroll en el fondo si el menú está abierto en pantallas pequeñas
        if (isActive && window.innerWidth <= 768) {
          document.body.classList.add('nav-open-locked');
        } else {
          document.body.classList.remove('nav-open-locked');
        }
      };

      const closeMenu = () => {
        navToggle.classList.remove('is-active');
        siteNav.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open-locked');

        // Cerrar también submenús abiertos al colapsar
        const openDropdowns = siteNav.querySelectorAll('.has-dropdown.is-dropdown-open');
        openDropdowns.forEach((dd) => {
          dd.classList.remove('is-dropdown-open');
          const toggleBtn = dd.querySelector('.dropdown-toggle');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        });
      };

      // Alternar estado al hacer clic en el botón de hamburguesa (3 líneas -> X)
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      // Manejo táctil e interactivo de submenús (ej. Productos) en móvil/tablet
      const dropdownToggles = siteNav.querySelectorAll('.has-dropdown > .dropdown-toggle');
      dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            e.stopPropagation();
            const parentDropdown = toggle.closest('.has-dropdown');
            if (parentDropdown) {
              const isOpen = parentDropdown.classList.toggle('is-dropdown-open');
              toggle.setAttribute('aria-expanded', String(isOpen));
            }
          }
        });
      });

      // Cierre automático al hacer clic en enlaces de navegación finales
      const navLinks = siteNav.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (siteNav.classList.contains('is-active')) {
            closeMenu();
          }
        });
      });

      // Cerrar al hacer clic fuera del header
      document.addEventListener('click', (e) => {
        if (siteNav.classList.contains('is-active') && header && !header.contains(e.target)) {
          closeMenu();
        }
      });

      // Cerrar con la tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && siteNav.classList.contains('is-active')) {
          closeMenu();
          navToggle.focus();
        }
      });

      // Cerrar menú si la pantalla se redimensiona a escritorio
      window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && siteNav.classList.contains('is-active')) {
          closeMenu();
        }
      }, { passive: true });
    }

    // 2. Comportamiento Smart Scroll (Ocultar al bajar / Mostrar al subir)
    if (header) {
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Si el menú móvil está abierto, pausamos el Smart Scroll para no interrumpir al usuario
        if (siteNav && siteNav.classList.contains('is-active')) {
          lastScroll = currentScroll;
          return;
        }

        // Evitar comportamientos erráticos en el rebote superior (iOS bounce)
        if (currentScroll < 0) return;

        // Si se encuentra en la parte superior, asegurarse de mostrar la cenefa
        if (currentScroll <= scrollThreshold) {
          header.classList.remove('header-hidden');
          lastScroll = currentScroll;
          return;
        }

        // Si el desplazamiento hacia abajo supera el umbral de delta, ocultar la cenefa
        if (currentScroll > lastScroll + scrollDelta) {
          header.classList.add('header-hidden');
        } 
        // Si el desplazamiento es hacia arriba, mostrar la cenefa
        else if (currentScroll < lastScroll - scrollDelta) {
          header.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
      }, { passive: true });
    }
  });
})();
