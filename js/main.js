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

// ── Contact form validation + submission ──────────────────────
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');

function setError(input, errorId, msg) {
  input.classList.add('invalid');
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = msg;
}
function clearError(input, errorId) {
  input.classList.remove('invalid');
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = '';
}

// Clear errors on input
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => {
    const errId = 'err-' + field.id;
    clearError(field, errId);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  success.classList.remove('visible');

  let valid = true;

  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const email = document.getElementById('email');

  clearError(firstName, 'err-first-name');
  clearError(lastName, 'err-last-name');
  clearError(email, 'err-email');

  if (!firstName.value.trim()) {
    setError(firstName, 'err-first-name', 'First name is required.');
    valid = false;
  }
  if (!lastName.value.trim()) {
    setError(lastName, 'err-last-name', 'Last name is required.');
    valid = false;
  }
  if (!email.value.trim()) {
    setError(email, 'err-email', 'Email address is required.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, 'err-email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!valid) {
    form.querySelector('.invalid').focus();
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // ── Replace this block with your Formspree/EmailJS fetch call ──
  // Example Formspree:
  // fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Accept': 'application/json' },
  //   body: new FormData(form)
  // }).then(r => {
  //   if (r.ok) { success.classList.add('visible'); form.reset(); }
  //   else { btn.textContent = 'Send Message'; }
  //   btn.disabled = false;
  // });

  // Demo placeholder (remove when wired to real endpoint):
  setTimeout(() => {
    success.classList.add('visible');
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 900);
});
