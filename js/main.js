// Sticky header shadow
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav toggle
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-label', 'Open menu');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ── Contact form ──────────────────────────────────────────────
// SETUP: Go to formspree.io → New Form → enter info@designcollective.biz
// Copy the form ID (e.g. xpzgkdqo) and replace YOUR_FORM_ID below.
const FORMSPREE_ID = 'YOUR_FORM_ID';

const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

function setError(input, errorId, msg) {
  input.classList.add('invalid');
  const el = document.getElementById(errorId);
  if (el) el.textContent = msg;
}
function clearError(input, errorId) {
  input.classList.remove('invalid');
  const el = document.getElementById(errorId);
  if (el) el.textContent = '';
}

form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => clearError(field, 'err-' + field.id));
});

form.addEventListener('submit', e => {
  e.preventDefault();
  success.classList.remove('visible');

  const firstName = document.getElementById('first-name');
  const lastName  = document.getElementById('last-name');
  const email     = document.getElementById('email');
  let valid = true;

  clearError(firstName, 'err-first-name');
  clearError(lastName,  'err-last-name');
  clearError(email,     'err-email');

  if (!firstName.value.trim()) {
    setError(firstName, 'err-first-name', 'First name is required.'); valid = false;
  }
  if (!lastName.value.trim()) {
    setError(lastName, 'err-last-name', 'Last name is required.'); valid = false;
  }
  if (!email.value.trim()) {
    setError(email, 'err-email', 'Email address is required.'); valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, 'err-email', 'Please enter a valid email address.'); valid = false;
  }

  if (!valid) { form.querySelector('.invalid').focus(); return; }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  fetch('https://formspree.io/f/' + FORMSPREE_ID, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form)
  })
  .then(r => {
    if (r.ok) {
      success.classList.add('visible');
      form.reset();
    } else {
      alert('Something went wrong. Please email us directly at info@designcollective.biz');
    }
  })
  .catch(() => {
    alert('Could not send. Please email info@designcollective.biz directly.');
  })
  .finally(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  });
});

// ── Portfolio lightbox ─────────────────────────────────────
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.portfolio-item').forEach(item => {
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  const img = item.querySelector('img');
  item.setAttribute('aria-label', 'View full size: ' + (img.alt || 'Portfolio image'));

  function openLightbox() {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  item.addEventListener('click', openLightbox);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// ── Scroll reveal ──────────────────────────────────────────
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => observer.observe(el));
})();

// Swipe down to close on mobile
let touchStartY = 0;
lightbox.addEventListener('touchstart', e => { touchStartY = e.changedTouches[0].screenY; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  if (Math.abs(e.changedTouches[0].screenY - touchStartY) > 80) closeLightbox();
}, { passive: true });
