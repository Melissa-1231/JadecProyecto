/**
 * JADEC (Soluciones Químicas) - Lógica Modular Aviso de Privacidad (js/privacidad.js)
 * Manejo de interacciones: Volver Arriba, Modal B2B y Accesibilidad.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // --------------------------------------------------------------------------
    // 1. Botón Flotante "Volver Arriba" (Back to Top)
    // --------------------------------------------------------------------------
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 280) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // --------------------------------------------------------------------------
    // 2. Control de Ventana Modal de Contacto B2B (si está presente en el DOM)
    // --------------------------------------------------------------------------
    const modal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const modalFormContainer = document.getElementById('modalFormContainer');
    const modalSuccessState = document.getElementById('modalSuccessState');
    let lastFocusedElement = null;

    const JadecPrivacyModal = {
      open: function (triggerEl) {
        if (!modal) return;
        lastFocusedElement = triggerEl || document.activeElement;

        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.setAttribute('aria-hidden', 'true');
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

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.removeAttribute('aria-hidden');
        }

        document.removeEventListener('keydown', this.handleKeyDown);

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      },

      resetState: function () {
        if (contactForm) {
          contactForm.reset();
        }
        if (modalFormContainer) {
          modalFormContainer.hidden = false;
        }
        if (modalSuccessState) {
          modalSuccessState.hidden = true;
        }
      },

      handleKeyDown: function (e) {
        if (e.key === 'Escape') {
          JadecPrivacyModal.close();
        }
      }
    };

    // Asignación de eventos de apertura para elementos con [data-open-modal]
    document.querySelectorAll('[data-open-modal]').forEach(function (button) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        JadecPrivacyModal.open(this);
      });
    });

    // Asignación de eventos de cierre para elementos con [data-close-modal]
    document.querySelectorAll('[data-close-modal]').forEach(function (button) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        JadecPrivacyModal.close();
      });
    });

    // Cierre al hacer clic en el fondo oscurecido (overlay)
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          JadecPrivacyModal.close();
        }
      });
    }

    // Envío del formulario de contacto
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (contactForm.checkValidity()) {
          if (modalFormContainer) modalFormContainer.hidden = true;
          if (modalSuccessState) modalSuccessState.hidden = false;
        } else {
          contactForm.reportValidity();
        }
      });
    }
  });
})();
