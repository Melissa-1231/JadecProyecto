/**
 * JADEC (Soluciones Químicas) - Catálogo ACTEGA (js/actega.js)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Manejo de desplazamiento suave para enlaces internos
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
  });
})();
