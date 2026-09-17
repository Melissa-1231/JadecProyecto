/**
 * JADEC Soluciones Químicas - Botón Volver Arriba (js/scroll.js)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    // Mostrar/ocultar el botón según el scroll vertical
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    // Desplazamiento suave al hacer clic
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
})();
