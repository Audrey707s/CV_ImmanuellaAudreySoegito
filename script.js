/* 
   IMMANUELLA AUDREY SOEGITO — Portfolio JS
   script.js
/* 1. SKILL BAR ANIMATION (Intersection Observer)
   Animasi ketika melakukan scroll di tampilan halaman
-------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0';
          bar.style.width = targetWidth + '%';
          observer.unobserve(bar); // animate only once
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* 2. ACTIVE NAV HIGHLIGHT (Intersection Observer)
   Highlight link nav untuk section saat user scroll.
-------------------------------------------------- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* 3. CONTACT FORM FEEDBACK
   Mengirimkan data form ke formspree untuk mendapat feedback (dikirim ke email)
-------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !feedback) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('kontak-nama').value.trim();
    const email = document.getElementById('kontak-email').value.trim();
    const message = document.getElementById('kontak-pesan').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      feedback.textContent = '⚠ Please fill in all fields before sending.';
      feedback.style.color = '#e87070';
      return;
    }

    if (!isValidEmail(email)) {
      feedback.textContent = '⚠ Please enter a valid email address.';
      feedback.style.color = '#e87070';
      return;
    }

    // Disable button while sending
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    feedback.textContent = '';

    try {
      const response = await fetch('https://formspree.io/f/xojrzbvv', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        feedback.textContent = '✓ Message received — thank you, ' + name + '!';
        feedback.style.color = 'var(--accent)';
        form.reset();
      } else {
        const data = await response.json();
        const errMsg = data.errors
          ? data.errors.map(err => err.message).join(', ')
          : 'Something went wrong. Please try again.';
        feedback.textContent = '⚠ ' + errMsg;
        feedback.style.color = '#e87070';
      }
    } catch (err) {
      feedback.textContent = '⚠ Network error — please check your connection.';
      feedback.style.color = '#e87070';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* 4. SMOOTH NAV SCROLL WITH OFFSET
   tinggi navbar tetap sama meskipun pindah ke section lain.
-------------------------------------------------- */
function initSmoothScroll() {
  const navHeight = document.querySelector('nav').offsetHeight;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* 5. NAV SCROLL SHADOW
   ada shadow untuk nav ketika user scroll kebawah (biar mudah dibaca).
-------------------------------------------------- */
function initNavShadow() {
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
}

/* INIT ALL */
document.addEventListener('DOMContentLoaded', () => {
  initSkillBars();
  initActiveNav();
  initContactForm();
  initSmoothScroll();
  initNavShadow();
});