/**
 * JADEC (Soluciones Químicas) - Lógica Modular del Modal & Navegación (js/modal.js)
 */

(function () {
  'use strict';

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
        groups.forEach(g => g.classList.remove('has-error'));
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
          el => el.offsetParent !== null
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

  function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]{7,20}$/;
    return re.test(String(phone).trim());
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

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        JadecModal.open(this);
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        JadecModal.close();
      });
    });

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          JadecModal.close();
        }
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);

      contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('input', function () {
          const group = this.closest('.modal-form-group');
          if (group && group.classList.contains('has-error')) {
            group.classList.remove('has-error');
          }
        });
      });

      const privacyCb = document.getElementById('fieldPrivacy');
      if (privacyCb) {
        privacyCb.addEventListener('change', function () {
          const group = this.closest('.form-checkbox-group');
          if (group && this.checked) {
            group.classList.remove('has-error');
          }
        });
      }
    }
  });

  window.JadecModal = JadecModal;

})();


/**
 * Control del Botón Flotante "Volver Arriba" (js/scroll.js)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Función para alternar la visibilidad según el desplazamiento vertical
    const toggleBackToTop = function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    };

    // Escuchar el evento scroll con rendimiento pasivo
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // Ejecutar desplazamiento suave hacia arriba al hacer clic
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
})();
