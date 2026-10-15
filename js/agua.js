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

    // 3. Inicialización del Carrusel Interactivo de Productos (Barnices Mate - 3 Slides Protagónicos)
    const carruselMate = document.querySelector('.carrusel-contenedor') || document.getElementById('carouselMatteAgua');
    
    if (carruselMate) {
      const track = carruselMate.querySelector('.carrusel-track') || carruselMate.querySelector('.carousel-matte-track');
      const btnAnt = carruselMate.querySelector('.btn-prev') || carruselMate.querySelector('.carousel-btn-prev');
      const btnSig = carruselMate.querySelector('.btn-next') || carruselMate.querySelector('.carousel-btn-next');
      const puntos = carruselMate.querySelectorAll('.carrusel-dot, .carousel-dot');
      const slides = carruselMate.querySelectorAll('.carrusel-slide, .carousel-matte-slide');
      const pildoras = document.querySelectorAll('.card-info-matte .card-product-item');

      let indiceMate = 0;
      const totalSlides = slides.length > 0 ? slides.length : 3;

      const actualizarCarruselMate = () => {
        if (track) {
          track.style.transform = `translateX(-${indiceMate * 100}%)`;
        }

        // Actualizar clase .activo en los puntos de paginación
        puntos.forEach((punto, i) => {
          const esActivo = i === indiceMate;
          punto.classList.toggle('activo', esActivo);
          punto.classList.toggle('active', esActivo);
          punto.setAttribute('aria-selected', String(esActivo));
        });

        // Actualizar estado activo en los slides
        slides.forEach((slide, i) => {
          const esActivo = i === indiceMate;
          slide.classList.toggle('activo', esActivo);
          slide.classList.toggle('active', esActivo);
        });

        // Sincronizar píldoras interactivas de la columna izquierda
        pildoras.forEach((pildora, i) => {
          const esActivo = i === indiceMate;
          pildora.classList.toggle('activo', esActivo);
          pildora.classList.toggle('active', esActivo);
          pildora.setAttribute('aria-selected', String(esActivo));
        });
      };

      // Evento 'click' en el botón Siguiente (Avanzar con loop circular)
      if (btnSig) {
        btnSig.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          indiceMate = (indiceMate + 1) % totalSlides;
          actualizarCarruselMate();
        });
      }

      // Evento 'click' en el botón Anterior (Retroceder con loop circular)
      if (btnAnt) {
        btnAnt.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          indiceMate = (indiceMate - 1 + totalSlides) % totalSlides;
          actualizarCarruselMate();
        });
      }

      // Evento 'click' en los puntos de paginación
      puntos.forEach((punto, i) => {
        punto.addEventListener('click', (e) => {
          e.preventDefault();
          indiceMate = i;
          actualizarCarruselMate();
        });
      });

      // Sincronización al pasar el puntero (hover), clic y teclado en las etiquetas de la lista izquierda
      let hoverMateTimer = null;
      pildoras.forEach((pildora, i) => {
        // Al pasar el cursor por cada etiqueta, activa suavemente el slide correspondiente
        pildora.addEventListener('mouseenter', () => {
          clearTimeout(hoverMateTimer);
          hoverMateTimer = setTimeout(() => {
            indiceMate = i;
            actualizarCarruselMate();
          }, 60);
        });

        pildora.addEventListener('mouseleave', () => {
          clearTimeout(hoverMateTimer);
        });

        pildora.addEventListener('click', (e) => {
          e.preventDefault();
          clearTimeout(hoverMateTimer);
          indiceMate = i;
          actualizarCarruselMate();
        });

        pildora.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clearTimeout(hoverMateTimer);
            indiceMate = i;
            actualizarCarruselMate();
          }
        });
      });

      // Efecto interactivo y dinámico de seguimiento suave del cursor sobre las imágenes
      const stages = carruselMate.querySelectorAll('.carousel-slide-stage');
      stages.forEach(stage => {
        const img = stage.querySelector('img');
        if (!img) return;

        stage.addEventListener('mousemove', (e) => {
          const rect = stage.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (y / (rect.height / 2)) * -5;
          const rotateY = (x / (rect.width / 2)) * 5;
          img.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.05)`;
        });

        stage.addEventListener('mouseleave', () => {
          img.style.transform = '';
        });
      });

      // Soporte táctil adicional (Swipe para móviles y tablets)
      let touchStartX = 0;
      let touchEndX = 0;

      if (track) {
        track.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const diffX = touchStartX - touchEndX;
          if (diffX > 40) {
            indiceMate = (indiceMate + 1) % totalSlides;
            actualizarCarruselMate();
          } else if (diffX < -40) {
            indiceMate = (indiceMate - 1 + totalSlides) % totalSlides;
            actualizarCarruselMate();
          }
        }, { passive: true });
      }

      // Sincronizar estado inicial
      actualizarCarruselMate();
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
          if (e.target.closest('a, button')) return;
          activateItem();
        });

        // Accesibilidad por teclado (Enter / Space)
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a, button')) return;
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

    // 7. Control de Ventana Modal de Cotización (#modalCotizacion)
    const btnCotizacionEspeciales = document.getElementById('btnCotizacionEspeciales');
    const modalCotizacion = document.getElementById('modalCotizacion');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const formCotizacion = document.getElementById('formCotizacion');
    const modalProcesoInput = document.getElementById('modalProceso');

    if (modalCotizacion) {
      let lastFocusedElement = null;

      const openModal = (productContext = '') => {
        lastFocusedElement = document.activeElement;

        // Si se provee contexto específico de un producto (ej. STARKOTE AQ-5011-2), pre-cargar en el textarea
        if (modalProcesoInput) {
          if (productContext) {
            modalProcesoInput.value = `Interés en cotización de: ${productContext}.\nRequiero propuesta de precio, formatos disponibles y ficha técnica.`;
          } else if (!modalProcesoInput.value.trim()) {
            modalProcesoInput.value = 'Requiero cotización para la línea de Barnices Especiales Base Agua.';
          }
        }

        modalCotizacion.setAttribute('aria-hidden', 'false');
        modalCotizacion.classList.add('show-modal');
        document.body.style.overflow = 'hidden';

        // Auto-enfoque accesible al primer campo del formulario
        const primerCampo = modalCotizacion.querySelector('input:not([type="hidden"]), select, textarea');
        if (primerCampo) {
          setTimeout(() => primerCampo.focus(), 80);
        }
      };

      const closeModal = () => {
        modalCotizacion.setAttribute('aria-hidden', 'true');
        modalCotizacion.classList.remove('show-modal');
        document.body.style.overflow = '';

        // Restaurar foco al elemento previo
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        } else if (btnCotizacionEspeciales) {
          btnCotizacionEspeciales.focus();
        }
      };

      // Apertura del modal desde el botón de la cabecera
      if (btnCotizacionEspeciales) {
        btnCotizacionEspeciales.addEventListener('click', (e) => {
          e.preventDefault();
          openModal('Barnices Especiales Base Agua');
        });
      }

      // Apertura del modal desde las tarjetas del acordeón / carrusel (ej. STARKOTE AQ-5011-2)
      const accordionCtaButtons = document.querySelectorAll('.btn-accordion-cta');
      accordionCtaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const productContext = btn.getAttribute('data-product-context') || 'STARKOTE AQ-5011-2 (Barniz Termosellable)';
          openModal(productContext);
        });
      });

      // Cierre mediante botón 'X'
      if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal();
        });
      }

      // Cierre mediante botón 'CANCELAR'
      if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal();
        });
      }

      // Cierre al hacer clic en el backdrop / overlay fuera de la tarjeta
      modalCotizacion.addEventListener('click', (e) => {
        if (e.target === modalCotizacion) {
          closeModal();
        }
      });

      // Cierre accesible con tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalCotizacion.classList.contains('show-modal')) {
          closeModal();
        }
      });

      // Envío del formulario con validación nativa
      if (formCotizacion) {
        formCotizacion.addEventListener('submit', (e) => {
          e.preventDefault();
          if (formCotizacion.checkValidity()) {
            const submitBtn = formCotizacion.querySelector('.btn-modal-submit');
            if (submitBtn) {
              const originalText = submitBtn.innerHTML;
              submitBtn.disabled = true;
              submitBtn.textContent = 'Enviando...';
              setTimeout(() => {
                alert('¡Gracias! Su solicitud de cotización ha sido recibida. Un asesor técnico de JADEC se pondrá en contacto.');
                formCotizacion.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                closeModal();
              }, 700);
            }
          } else {
            formCotizacion.reportValidity();
          }
        });
      }
    }

    // 8. Navegación Dinámica ScrollSpy (IntersectionObserver)
    if (navLinksMenu) {
      const navLinks = navLinksMenu.querySelectorAll('a[href^="#"]');
      const targetSectionIds = [
        'barnices-brillantes-agua',
        'barnices-matte-agua',
        'barnices-especiales-agua'
      ];

      const observedSections = [];
      targetSectionIds.forEach(id => {
        const sectionEl = document.getElementById(id);
        if (sectionEl) {
          observedSections.push({ id, el: sectionEl });
        }
      });

      const setActiveNavLink = (activeId) => {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (!href) return;
          const target = href.replace(/^#/, '');

          if (activeId && target === activeId) {
            link.classList.add('activo');
          } else {
            link.classList.remove('activo');
          }
        });
      };

      if (observedSections.length > 0 && 'IntersectionObserver' in window) {
        const visibleSectionRatios = new Map();

        const scrollSpyObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              visibleSectionRatios.set(entry.target.id, entry.intersectionRatio);
            } else {
              visibleSectionRatios.delete(entry.target.id);
            }
          });

          // Si el usuario está al tope de la página (Hero), limpiar estado activo
          if (window.scrollY < 180) {
            setActiveNavLink(null);
            return;
          }

          // Si el usuario alcanza el final de la página (Footer), activar la última sección
          const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
          if (isAtBottom) {
            const lastSec = observedSections[observedSections.length - 1];
            if (lastSec) {
              setActiveNavLink(lastSec.id);
              return;
            }
          }

          // Determinar la sección predominante en el viewport
          if (visibleSectionRatios.size > 0) {
            let maxRatio = -1;
            let currentActiveId = null;

            observedSections.forEach(({ id }) => {
              if (visibleSectionRatios.has(id)) {
                const ratio = visibleSectionRatios.get(id);
                if (ratio > maxRatio) {
                  maxRatio = ratio;
                  currentActiveId = id;
                }
              }
            });

            if (currentActiveId) {
              setActiveNavLink(currentActiveId);
            }
          }
        }, {
          root: null,
          rootMargin: '-20% 0px -50% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1.0]
        });

        observedSections.forEach(({ el }) => scrollSpyObserver.observe(el));

        // Respaldo de eventos pasivos para tope y fondo de página
        window.addEventListener('scroll', () => {
          if (window.scrollY < 180) {
            setActiveNavLink(null);
          } else if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
            const lastSec = observedSections[observedSections.length - 1];
            if (lastSec) {
              setActiveNavLink(lastSec.id);
            }
          }
        }, { passive: true });
      }
    }
  });
})();
