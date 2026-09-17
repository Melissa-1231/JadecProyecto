/**
 * ==========================================================================
 * JADEC (Soluciones Químicas) - JavaScript Consolidado de Adhesivos
 * Archivo: js/adhesivos.js
 * Contenido: Lógica de Ventana Modal de Cotización + Mega-Menú de Subnavegación
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. LÓGICA DE VENTANA MODAL DE COTIZACIÓN (Accesibilidad, Foco y Validación)
       ========================================================================== */
    const modal = document.getElementById('contactModal');
    const mainContent = document.getElementById('main-content');
    const contactForm = document.getElementById('contactForm');
    const modalFormContainer = document.getElementById('modalFormContainer');
    const modalSuccessState = document.getElementById('modalSuccessState');

    let lastFocusedElement = null;
    const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const JadecModal = {
      open: function (triggerEl) {
        if (!modal) return;
        lastFocusedElement = triggerEl || document.activeElement;

        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        if (mainContent) {
          mainContent.setAttribute('aria-hidden', 'true');
          mainContent.setAttribute('inert', '');
        }

        this.resetState();

        const firstInput = modal.querySelector('#fieldName') || modal.querySelector('.modal-close');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }

        document.addEventListener('keydown', this.handleKeyDown);
      },

      close: function () {
        if (!modal) return;
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('is-active');
        document.body.style.overflow = '';

        if (mainContent) {
          mainContent.removeAttribute('aria-hidden');
          mainContent.removeAttribute('inert');
        }

        document.removeEventListener('keydown', this.handleKeyDown);

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      },

      resetState: function () {
        if (contactForm) {
          contactForm.reset();
          const groups = contactForm.querySelectorAll('.modal-form-group, .form-checkbox-group');
          groups.forEach((g) => g.classList.remove('has-error'));
        }
        if (modalFormContainer) modalFormContainer.hidden = false;
        if (modalSuccessState) modalSuccessState.hidden = true;
      },

      handleKeyDown: function (e) {
        if (modal.getAttribute('aria-hidden') === 'true') return;

        if (e.key === 'Escape' || e.keyCode === 27) {
          e.preventDefault();
          JadecModal.close();
          return;
        }

        if (e.key === 'Tab' || e.keyCode === 9) {
          const focusables = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
            (el) => el.offsetParent !== null
          );

          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      }
    };

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    function handleFormSubmit(e) {
      e.preventDefault();

      const nameInput = document.getElementById('fieldName');
      const companyInput = document.getElementById('fieldCompany');
      const emailInput = document.getElementById('fieldEmail');
      const volumeSelect = document.getElementById('fieldVolume');
      const privacyCheckbox = document.getElementById('fieldPrivacy');

      let isValid = true;

      function checkField(input, condition) {
        if (!input) return;
        const group = input.closest('.modal-form-group') || input.closest('.form-checkbox-group');
        if (!condition) {
          if (group) group.classList.add('has-error');
          isValid = false;
        } else {
          if (group) group.classList.remove('has-error');
        }
      }

      if (nameInput) checkField(nameInput, nameInput.value.trim().length > 0);
      if (companyInput) checkField(companyInput, companyInput.value.trim().length > 0);
      if (emailInput) checkField(emailInput, emailInput.value.trim().length > 0 && validateEmail(emailInput.value));
      if (volumeSelect) checkField(volumeSelect, volumeSelect.value.trim().length > 0);
      if (privacyCheckbox) checkField(privacyCheckbox, privacyCheckbox.checked);

      if (isValid) {
        if (modalFormContainer) modalFormContainer.hidden = true;
        if (modalSuccessState) {
          modalSuccessState.hidden = false;
          const successButton = modalSuccessState.querySelector('button');
          if (successButton) successButton.focus();
        }
      }
    }

    // Triggers del Modal
    document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        JadecModal.open(this);
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach((trigger) => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        JadecModal.close();
      });
    });

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          JadecModal.close();
        }
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);

      contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((input) => {
        input.addEventListener('input', function () {
          const group = this.closest('.modal-form-group');
          if (group && group.classList.contains('has-error')) {
            group.classList.remove('has-error');
          }
        });
      });
    }

    // Exponer JadecModal globalmente
    window.JadecModal = JadecModal;


    /* ==========================================================================
       2. LÓGICA DE SUBNAVEGACIÓN Y MEGA-MENÚ (.cenefa-adhesivos)
       ========================================================================== */
    const cenefaNav = document.querySelector('.cenefa-adhesivos, .cenefa-subnav');
    if (!cenefaNav) return;

    const menuItems = cenefaNav.querySelectorAll('.cenefa-nav-item.has-megamenu, .cenefa-item.has-megamenu');
    let activeItem = null;
    let hoverTimeout = null;

    function openMenu(item) {
      if (activeItem && activeItem !== item) {
        closeMenu(activeItem);
      }

      clearTimeout(hoverTimeout);
      item.classList.add('is-open');
      const toggle = item.querySelector('.cenefa-toggle, .cenefa-btn');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-active');
      }
      activeItem = item;
    }

    function closeMenu(item) {
      if (!item) return;
      item.classList.remove('is-open');
      const toggle = item.querySelector('.cenefa-toggle, .cenefa-btn');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
      }
      if (activeItem === item) {
        activeItem = null;
      }
    }

    function closeAllMenus() {
      menuItems.forEach((item) => closeMenu(item));
      activeItem = null;
    }

    menuItems.forEach((item) => {
      const toggle = item.querySelector('.cenefa-toggle, .cenefa-btn');
      const panel = item.querySelector('.megamenu-panel');

      if (!toggle) return;

      // Click / Touch
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('is-open');
        if (isOpen) {
          closeMenu(item);
        } else {
          openMenu(item);
        }
      });

      // Hover en Desktop (>= 1024px) con retardo suave
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) {
          clearTimeout(hoverTimeout);
          openMenu(item);
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
          hoverTimeout = setTimeout(() => {
            closeMenu(item);
          }, 180);
        }
      });

      if (panel) {
        panel.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetLink = e.target.closest('a') || e.target.closest('[data-open-modal]');
          if (targetLink) {
            closeAllMenus();
          }
        });
      }
    });

    // Cierre al hacer click fuera de la barra
    document.addEventListener('click', (e) => {
      if (!cenefaNav.contains(e.target)) {
        closeAllMenus();
      }
    });

    // Cierre con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeItem && (!modal || modal.getAttribute('aria-hidden') === 'true')) {
        const currentToggle = activeItem.querySelector('.cenefa-toggle, .cenefa-btn');
        closeAllMenus();
        if (currentToggle) {
          currentToggle.focus();
        }
      }
    });


    /* ==========================================================================
       3. LÓGICA DE PESTAÑAS (TABS FILTER: INDUSTRIAS / TECNOLOGÍAS)
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn[data-tab-target]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-tab-target');
        const targetPane = document.getElementById(targetId);

        if (!targetPane) return;

        // Desactivar todos los botones y paneles
        tabButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach((p) => p.classList.remove('is-active'));

        // Activar el botón seleccionado y su panel correspondiente
        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
        targetPane.classList.add('is-active');
      });
    });

    /* ==========================================================================
       4. BOTÓN FLOTANTE "VOLVER ARRIBA" (BACK TO TOP)
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
      let isScrolling = false;

      window.addEventListener('scroll', () => {
        if (!isScrolling) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 400) {
              backToTopBtn.classList.add('is-visible');
            } else {
              backToTopBtn.classList.remove('is-visible');
            }
            isScrolling = false;
          });
          isScrolling = true;
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

  });
})();