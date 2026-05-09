/* =============================================
   ARUL M �?" Portfolio JavaScript
   Features: Loader, Canvas BG, Typewriter,
   Navbar, Scroll Reveal, Counter, Back-to-Top,
   Certificate Modal, Contact Form, Hamburger
   ============================================= */

'use strict';

/* ===========================
   1. LOADING SCREEN
=========================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Init all features once loaded
      initParticleCanvas();
      // initTypewriter(); // Disabled - using static text now
      initScrollReveal();
      initCounters();
      initBackToTop();
      initSkillHover();
      initProjectTilt();
      initHeroPhoto(); initPhotoModal();
      initCertModal();
      initContactForm();
    }
  }, 2200);
});

/* ===========================
   2. PARTICLE / CONSTELLATION CANVAS
=========================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const PARTICLE_COUNT = Math.min(80, Math.floor(W * H / 14000));
  const CONNECT_DIST = 140;
  const MOUSE_REPEL = 100;

  const mouse = { x: null, y: null };

  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.5 + 0.2
  }));

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw & move particles
    particles.forEach(p => {
      // Mouse repel
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_REPEL) {
          const force = (MOUSE_REPEL - d) / MOUSE_REPEL * 0.015;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      }

      // Speed limit
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.2) { p.vx *= 0.97; p.vy *= 0.97; }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(0, 210, 255, ${p.alpha})`);
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 210, 255, ${p.alpha * 2})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ===========================
   3. TYPEWRITER ANIMATION
=========================== */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'AI/ML Enthusiast',
    'Data Science Intern',
    'NLP Developer',
    'Computer Vision Engineer',
    'CSE Student @ KPR'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        pauseTimer = setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        pauseTimer = setTimeout(type, 400);
        return;
      }
    }

    const speed = isDeleting ? 50 : 90;
    setTimeout(type, speed);
  }

  type();
}

/* ===========================
   4. NAVBAR �?" Scroll & Hamburger & Active
=========================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ===========================
   5. SCROLL PROGRESS BAR
=========================== */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrolled / total) * 100}%`;
  });
})();

/* ===========================
   6. SCROLL REVEAL ANIMATIONS
=========================== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered delay based on sibling index
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.children).filter(c => c.classList.contains('reveal'))
            : [];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ===========================
   7. STAT COUNTERS
=========================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = String(target).includes('.');
        const duration = 1600;
        const steps = 60;
        const stepVal = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current += stepVal;
          if (step >= steps) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current) + (step < steps ? '' : '+');
        }, duration / steps);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ===========================
   8. BACK TO TOP BUTTON
=========================== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===========================
   9. PHOTO MODAL
=========================== */
(function initPhotoModal() {
  const modal = document.getElementById('photo-modal');
  const modalTitle = document.getElementById('photo-modal-title');
  const modalImg = document.getElementById('photo-modal-img');
  const closeBtn = document.getElementById('photo-modal-close');
  const closeBtn2 = document.getElementById('photo-modal-close-2');

  if (!modal) return;

  // Photo click handler
  document.querySelectorAll('.clickable-photo').forEach(photo => {
    photo.addEventListener('click', () => {
      modalTitle.textContent = 'Profile Photo';
      modalImg.src = photo.src;
      modalImg.alt = photo.alt;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  closeBtn2.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ===========================
   10. CERTIFICATE MODAL
=========================== */
(function initCertModal() {
  const modal = document.getElementById('cert-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalViewBtn = document.getElementById('modal-view-btn');
  const closeBtn = document.getElementById('modal-close');
  const closeBtn2 = document.getElementById('modal-close-2');

  if (!modal) return;

  document.querySelectorAll('.view-cert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const certName = btn.dataset.certName;
      const certFile = btn.dataset.certFile;
      modalTitle.textContent = certName;
      modalBody.textContent = `Click "Open Certificate" to view your certificate. Make sure to certificate file is placed in correct location.`;

      modalViewBtn.href = certFile || '#';

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  closeBtn2.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ===========================
   11. CONTACT FORM
=========================== */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Read fields by name attribute (required by EmailJS)
    const nameVal    = form.querySelector('[name="name"]').value.trim();
    const emailVal   = form.querySelector('[name="email"]').value.trim();
    const titleVal   = form.querySelector('[name="title"]').value.trim();
    const messageVal = form.querySelector('[name="message"]').value.trim();

    if (!nameVal || !emailVal || !titleVal || !messageVal) return;

    // Show spinner, disable button
    const submitBtn  = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled  = true;

    // ============================================================
    // PASTE YOUR EmailJS SERVICE ID  → replace "YOUR_SERVICE_ID"
    // PASTE YOUR EmailJS TEMPLATE ID → replace "YOUR_TEMPLATE_ID"
    // ============================================================
    emailjs.sendForm("service_drk4esc", "template_ub1rws8", form)
      .then(function() {
        // ✅ Success
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled  = false;
        form.reset();
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      })
      .catch(function(error) {
        // ❌ Failure
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled  = false;
        console.error('EmailJS error:', error);
        alert('Sorry, something went wrong. Please try again or email me directly at arulsriram2006@gmail.com');
      });
  });
})();

/* ===========================
   11. SKILL TAGS �?" Hover tilt effect
=========================== */
(function initSkillHover() {
  document.querySelectorAll('.skill-category').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * 4;
      const rotY = ((x - cx) / cx) * -4;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ===========================
   12. PROJECT CARDS �?" Tilt effect
=========================== */
(function initProjectTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * 6;
      const rotY = ((x - cx) / cx) * -6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ===========================
   13. SMOOTH ANCHOR SCROLLING
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});