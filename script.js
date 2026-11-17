// ==========================================================================
// TAPICERÍA JARED - SCRIPT PRINCIPAL (script.js)
// Funcionalidad interactiva, menú responsive, modales y validación de formularios
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. NAVEGACIÓN Y MENÚ MÓVIL
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Cerrar menú móvil al hacer clic en un enlace de navegación
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Resaltar sección activa al desplazarse por la página
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. GESTIÓN DE MODALES DE AUTENTICACIÓN (LOGIN Y REGISTRO)
     -------------------------------------------------------------------------- */
  const modalLogin = document.getElementById('modal-login');
  const modalRegister = document.getElementById('modal-register');

  const btnOpenLogin = document.getElementById('btn-open-login');
  const btnOpenRegister = document.getElementById('btn-open-register');

  const closeLogin = document.getElementById('close-login');
  const closeRegister = document.getElementById('close-register');
  const overlayLogin = document.getElementById('overlay-login');
  const overlayRegister = document.getElementById('overlay-register');

  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Previene scroll de fondo
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Limpiar mensajes y alertas de formulario al cerrar
      const alert = modal.querySelector('.form-alert');
      if (alert) {
        alert.className = 'form-alert';
        alert.textContent = '';
      }
    }
  }

  if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => openModal(modalLogin));
  if (btnOpenRegister) btnOpenRegister.addEventListener('click', () => openModal(modalRegister));

  if (closeLogin) closeLogin.addEventListener('click', () => closeModal(modalLogin));
  if (closeRegister) closeRegister.addEventListener('click', () => closeModal(modalRegister));

  if (overlayLogin) overlayLogin.addEventListener('click', () => closeModal(modalLogin));
  if (overlayRegister) overlayRegister.addEventListener('click', () => closeModal(modalRegister));

  // Cambiar entre modales
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modalLogin);
      openModal(modalRegister);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modalRegister);
      openModal(modalLogin);
    });
  }

  // Cerrar modales con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(modalLogin);
      closeModal(modalRegister);
    }
  });

  /* --------------------------------------------------------------------------
     3. FILTRO DE GALERÍA
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. FUNCIONES DE AYUDA Y VALIDACIÓN
     -------------------------------------------------------------------------- */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showAlert(alertContainer, message, type) {
    if (alertContainer) {
      alertContainer.textContent = message;
      alertContainer.className = `form-alert ${type}`;
    }
  }

  // Restricción de entrada telefónica: solo dígitos numéricos (máximo 10)
  const phoneInputs = document.querySelectorAll('#reg-phone, #contact-phone');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  });

  /* --------------------------------------------------------------------------
     5. VALIDACIÓN DEL FORMULARIO DE REGISTRO
     -------------------------------------------------------------------------- */
  const registerForm = document.getElementById('register-form');
  const registerAlert = document.getElementById('register-alert');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;

      if (!name) {
        showAlert(registerAlert, 'Por favor, ingresa tu nombre completo.', 'error');
        return;
      }

      if (phone.length !== 10) {
        showAlert(registerAlert, 'El teléfono debe contener exactamente 10 dígitos numéricos.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showAlert(registerAlert, 'Por favor, ingresa un correo electrónico válido.', 'error');
        return;
      }

      if (password.length < 8) {
        showAlert(registerAlert, 'La contraseña debe tener al menos 8 caracteres.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showAlert(registerAlert, 'Las contraseñas no coinciden.', 'error');
        return;
      }

      showAlert(registerAlert, '¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.', 'success');
      registerForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     6. VALIDACIÓN DEL FORMULARIO DE INICIO DE SESIÓN
     -------------------------------------------------------------------------- */
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        showAlert(loginAlert, 'Por favor, completa todos los campos.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showAlert(loginAlert, 'Ingresa un correo electrónico con formato válido.', 'error');
        return;
      }

      showAlert(loginAlert, 'Inicio de sesión exitoso. Bienvenido a Tapicería Jared.', 'success');
      loginForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     7. VALIDACIÓN DEL FORMULARIO DE CONTACTO
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const contactAlert = document.getElementById('contact-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !phone || !message) {
        showAlert(contactAlert, 'Por favor, llena todos los campos obligatorios del formulario.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showAlert(contactAlert, 'Por favor, proporciona un correo electrónico válido.', 'error');
        return;
      }

      if (phone.length !== 10) {
        showAlert(contactAlert, 'El teléfono debe ser de 10 dígitos numéricos.', 'error');
        return;
      }

      showAlert(contactAlert, '¡Gracias por tu mensaje! Nos pondremos en contacto contigo a la brevedad.', 'success');
      contactForm.reset();
    });
  }

});