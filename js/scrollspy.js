/**
 * JADEC Soluciones Químicas - ScrollSpy Navigation (js/scrollspy.js)
 * Seguimiento dinámico de lectura con IntersectionObserver y resaltado corporativo.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los enlaces de anclaje de la navegación principal
    const navLinks = Array.from(document.querySelectorAll('.site-nav .nav-link[href^="#"]'));
    if (!navLinks.length) return;

    // Mapear IDs de sección a sus elementos DOM y enlaces de navegación
    const sectionMap = new Map();
    const sections = [];

    navLinks.forEach(link => {
      const targetId = link.getAttribute('href').replace(/^#/, '');
      const section = document.getElementById(targetId);
      if (section && !sectionMap.has(targetId)) {
        sectionMap.set(targetId, { section, link });
        sections.push(section);
      }
    });

    if (!sections.length) return;

    // Función pura para activar el enlace correspondiente
    const setActiveLink = (targetId) => {
      navLinks.forEach(link => link.classList.remove('active'));
      if (targetId && sectionMap.has(targetId)) {
        sectionMap.get(targetId).link.classList.add('active');
      }
    };

    // Configuración optimizada de IntersectionObserver
    const observerOptions = {
      root: null,
      // Margen superior e inferior para centrar la zona de lectura activa
      rootMargin: '-25% 0px -60% 0px',
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
    };

    // Registro de secciones actualmente en intersección
    const activeIntersections = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeIntersections.set(entry.target.id, entry.intersectionRatio);
        } else {
          activeIntersections.delete(entry.target.id);
        }
      });

      // Si el usuario está al inicio de la página (Hero), no iluminar secciones
      if (window.scrollY < 180) {
        setActiveLink(null);
        return;
      }

      // Si se llegó al final de la página (Footer/Contacto), activar la última sección
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
      if (isAtBottom) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          setActiveLink(lastSection.id);
          return;
        }
      }

      // Determinar la sección con mayor presencia o primera visible
      if (activeIntersections.size > 0) {
        let bestId = null;
        let maxRatio = -1;

        for (const section of sections) {
          if (activeIntersections.has(section.id)) {
            const ratio = activeIntersections.get(section.id);
            if (ratio > maxRatio) {
              maxRatio = ratio;
              bestId = section.id;
            }
          }
        }

        if (bestId) {
          setActiveLink(bestId);
        }
      }
    }, observerOptions);

    // Observar cada sección vinculada
    sections.forEach(sec => observer.observe(sec));

    // Evento pasivo para limpiar estado en scroll hacia el tope o garantizar activación al fondo
    window.addEventListener('scroll', () => {
      if (window.scrollY < 180) {
        setActiveLink(null);
      } else if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          setActiveLink(lastSection.id);
        }
      }
    }, { passive: true });
  });
})();
