// ─────────────────────────────────────────────
//  EQUITY GUARD — Website Script
// ─────────────────────────────────────────────

// ── Nav scroll effect ──────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger ──────────────────────────
const hamburger  = document.getElementById('hamburger');
const navMobile  = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const open = navMobile.classList.contains('open');
  hamburger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});

// ── Smooth scroll for anchor links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── FAQ accordion ─────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Open clicked (if it wasn't already open)
    if (!isOpen) item.classList.add('open');
  });
});

// ── Scroll fade-in animations ─────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Add fade-up to major elements
const fadeTargets = [
  '.feature-card',
  '.why-card',
  '.platform-card',
  '.pricing-card',
  '.faq-item',
  '.section-header',
  '.why-text',
  '.hero-stats',
  '.pricing-guarantee',
  '.cta-inner',
];

fadeTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
});

// ── Live trade simulation on mockup DD bar ────────────────
// Simulates an unrealized drawdown fluctuating in real time
const ddFill = document.getElementById('dd-fill');
const ddLabel = document.querySelector('.bar-label-dd');

if (ddFill && ddLabel) {
  // Initial animate-in from 0
  ddFill.style.width = '0%';

  let currentPct = 0;
  const targetPct = 39.8;

  // Animate in on load
  setTimeout(() => {
    ddFill.style.transition = 'width 1.8s ease';
    ddFill.style.width = targetPct + '%';
    currentPct = targetPct;
  }, 800);

  // Then simulate live fluctuation — drawdown moving as market ticks
  setTimeout(() => {
    ddFill.style.transition = 'width 0.8s ease';

    const ddValues = [
      { pct: 39.8, usd: '-398.00' },
      { pct: 42.1, usd: '-421.00' },
      { pct: 38.5, usd: '-385.00' },
      { pct: 44.7, usd: '-447.00' },
      { pct: 41.2, usd: '-412.00' },
      { pct: 36.9, usd: '-369.00' },
      { pct: 45.3, usd: '-453.00' },
      { pct: 39.8, usd: '-398.00' },
    ];

    let idx = 0;
    setInterval(() => {
      const v = ddValues[idx % ddValues.length];
      ddFill.style.width = v.pct + '%';
      // Update color — gets more red as it approaches 100%
      const danger = v.pct / 100;
      if (danger > 0.7) {
        ddFill.style.background = 'linear-gradient(90deg, #FF4D4D, #FF8C00)';
      } else if (danger > 0.45) {
        ddFill.style.background = 'linear-gradient(90deg, #F0B429, #FF8C00)';
      } else {
        ddFill.style.background = 'linear-gradient(90deg, #00C47A, #a8e63d)';
      }
      if (ddLabel) {
        ddLabel.textContent = `Drawdown (Unrealized):  ${v.usd} / -1,000.00  (${v.pct}%)`;
      }
      idx++;
    }, 2000);
  }, 3000);
}

// ── Active nav link highlight ─────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--cyan)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));
