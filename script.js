 /* ============================================================
       INTERACTIVITY — Progressive, Accessible Enhancements
       ============================================================ */

    // Utility: simple qs helpers
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    // ---------- Theme Toggle (persisted) ----------
    const themeToggle = $('#themeToggle');
    const userPref = localStorage.getItem('theme');
    if (userPref === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    if (userPref === 'light') document.documentElement.removeAttribute('data-theme');

    const applyPressedState = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle?.setAttribute('aria-pressed', String(dark));
      themeToggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    applyPressedState();

    themeToggle?.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      applyPressedState();
    });

    // ---------- Mobile Menu Toggle ----------
    const menuBtn = $('.menu-toggle');
    const nav = $('#primary-navigation');
    menuBtn?.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      menuBtn.setAttribute('aria-expanded', String(!open));
    });

    // Close menu on escape for a11y
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });

    // Close menu when clicking a link (mobile UX)
    nav?.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) {
        nav.setAttribute('data-open', 'false');
        menuBtn?.setAttribute('aria-expanded', 'false');
      }
    });

    // ---------- Project Filtering ----------
    const grid = $('#projectGrid');
    const filterButtons = $$('.filter');

    function setActive(btn) {
      filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    }

    function filterProjects(category) {
      const cards = $$('.card', grid);
      cards.forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        card.style.display = match ? 'grid' : 'none';
      });
    }

    filterButtons.forEach(btn => btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      setActive(btn);
      filterProjects(cat);
    }));

    // ---------- Back-to-Top visibility ----------
    const toTop = $('#toTop');
    const showOn = 480;
    const onScroll = () => {
      if (window.scrollY > showOn) toTop.setAttribute('data-show', 'true');
      else toTop.removeAttribute('data-show');
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Contact Form Validation (client-side) ----------
    const form = $('#contactForm');
    const nameEl = $('#name');
    const emailEl = $('#email');
    const messageEl = $('#message');
    const consentEl = $('#consent');
    const statusEl = $('#formStatus');

    const errors = {
      name: $('#nameError'),
      email: $('#emailError'),
      message: $('#messageError')
    };

    function setError(el, msg) {
      el.setAttribute('aria-invalid', 'true');
      const id = el.getAttribute('id');
      errors[id]?.removeAttribute('hidden');
      errors[id].textContent = msg;
    }

    function clearError(el) {
      el.setAttribute('aria-invalid', 'false');
      const id = el.getAttribute('id');
      errors[id]?.setAttribute('hidden', '');
      errors[id].textContent = '';
    }

    function validateEmail(value) {
      // Simple RFC5322-ish test for demonstration
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      // Name
      if (!nameEl.value.trim()) { setError(nameEl, 'Please enter your name.'); ok = false; } else { clearError(nameEl); }

      // Email
      if (!emailEl.value.trim()) { setError(emailEl, 'Please enter your email.'); ok = false; }
      else if (!validateEmail(emailEl.value.trim())) { setError(emailEl, 'Please enter a valid email address.'); ok = false; }
      else { clearError(emailEl); }

      // Message
      if (!messageEl.value.trim() || messageEl.value.trim().length < 20) {
        setError(messageEl, 'Please provide a message of at least 20 characters.'); ok = false;
      } else { clearError(messageEl); }

      // Consent
      if (!consentEl.checked) { ok = false; alert('Please consent to be contacted.'); }

      if (!ok) {
        statusEl.textContent = 'Please fix the highlighted fields.';
        return;
      }

      // Simulate async submit – replace with real fetch() to your backend or Formspree.
      statusEl.textContent = 'Sending…';
      setTimeout(() => {
        statusEl.classList.add('success');
        statusEl.textContent = 'Thanks! Your message has been sent.';
        form.reset();
        // Move focus to status for screen readers
        statusEl.focus?.();
      }, 600);
    });

    // ---------- Misc ----------
    $('#year').textContent = new Date().getFullYear();