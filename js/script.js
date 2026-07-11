document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     ANO NO FOOTER
  ========================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================
     MENU MOBILE
  ========================================= */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================
     NAVBAR: FADE / OCULTAR AO ROLAR
  ========================================= */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('progressBar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll <= 60) {
      navbar.classList.remove('nav-fade', 'nav-hidden');
    } else if (currentScroll > lastScrollY) {
      // rolando para baixo -> esmaece / esconde
      navbar.classList.add('nav-fade');
    } else {
      // rolando para cima -> reaparece
      navbar.classList.remove('nav-fade');
    }

    lastScrollY = currentScroll;

    // barra de progresso de leitura
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    // botão voltar ao topo
    backToTop.classList.toggle('visible', currentScroll > 500);

    // nav link ativo conforme seção visível
    updateActiveLink();

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });

  /* =========================================
     LINK ATIVO NO MENU
  ========================================= */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = sections[0]?.id;
    const offset = window.innerHeight * 0.4;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top - offset <= 0) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* =========================================
     ANIMAÇÕES DE SCROLL (SURGE / DESAPARECE)
  ========================================= */
  const revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--d', delay);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        // some novamente ao sair da viewport, para reaparecer depois
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* =========================================
     CONTADORES ANIMADOS (STATS)
  ========================================= */
  const statNumbers = document.querySelectorAll('.stat-number');
  const countedFlags = new WeakMap();

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting && !countedFlags.get(el)) {
        countedFlags.set(el, true);
        animateCount(el);
      } else if (!entry.isIntersecting) {
        countedFlags.set(el, false);
        el.textContent = '0';
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1 && countedFlags.get(el)) {
        requestAnimationFrame(tick);
      } else if (progress >= 1) {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  /* =========================================
     VOLTAR AO TOPO
  ========================================= */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================
     TOAST
  ========================================= */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* =========================================
     VALIDAÇÃO DE E-MAIL
  ========================================= */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* =========================================
     FORM: NEWSLETTER
  ========================================= */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMessage = document.getElementById('newsletterMessage');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();

    if (!isValidEmail(email)) {
      newsletterMessage.textContent = 'Por favor, informe um e-mail válido.';
      newsletterMessage.className = 'form-message error';
      return;
    }

    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    newsletterMessage.textContent = 'Enviando...';
    newsletterMessage.className = 'form-message';

    setTimeout(() => {
      newsletterMessage.textContent = 'Inscrição realizada com sucesso! 🎉';
      newsletterMessage.className = 'form-message success';
      showToast('Obrigada por assinar a newsletter!');
      newsletterForm.reset();
      submitBtn.disabled = false;
    }, 900);
  });

  /* =========================================
     FORM: CONTATO
  ========================================= */
  const contactForm = document.getElementById('contactForm');
  const contactMessage = document.getElementById('contactMessage');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const text = document.getElementById('contactText').value.trim();

    if (!name || !isValidEmail(email) || !text) {
      contactMessage.textContent = 'Preencha nome, e-mail válido e mensagem.';
      contactMessage.className = 'form-message error';
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    contactMessage.textContent = 'Enviando mensagem...';
    contactMessage.className = 'form-message';

    setTimeout(() => {
      contactMessage.textContent = 'Mensagem enviada com sucesso! Retornarei em breve.';
      contactMessage.className = 'form-message success';
      showToast('Mensagem enviada com sucesso!');
      contactForm.reset();
      submitBtn.disabled = false;
    }, 900);
  });

  /* Estado inicial */
  handleScroll();
});
