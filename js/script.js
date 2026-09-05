(() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = Array.from(document.querySelectorAll('[data-nav]'));
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressCount = document.getElementById('progressCount');
  const progressTotal = document.getElementById('progressTotal');

  progressTotal.textContent = String(slides.length).padStart(2, '0');

  // Decorative section index numbers
  slides.forEach((slide, i) => {
    const el = document.createElement('span');
    el.className = 'slide__index';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = String(i + 1).padStart(2, '0');
    slide.prepend(el);
  });

  // Scroll reveal
  const revealTargets = document.querySelectorAll('.slide__text, .slide__media');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navAnchors.forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Active section tracking
  const setActive = (id) => {
    navAnchors.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        setActive(id);
        const index = slides.findIndex(s => s.id === id);
        if (index > -1) {
          progressCount.textContent = String(index + 1).padStart(2, '0');
        }
      }
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  slides.forEach(s => observer.observe(s));

  // Image galleries
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track = gallery.querySelector('.gallery__track');
    const figures = gallery.querySelectorAll('figure');
    const prev = gallery.querySelector('.gallery__arrow--prev');
    const next = gallery.querySelector('.gallery__arrow--next');
    const currentEl = gallery.querySelector('[data-current]');
    const totalEl = gallery.querySelector('[data-total]');
    let index = 0;

    if (figures.length <= 1) {
      if (prev) prev.style.display = 'none';
      if (next) next.style.display = 'none';
      const countEl = gallery.querySelector('.gallery__count');
      if (countEl) countEl.style.display = 'none';
      return;
    }

    if (totalEl) totalEl.textContent = String(figures.length);

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (currentEl) currentEl.textContent = String(index + 1);
    };

    prev.addEventListener('click', () => {
      index = (index - 1 + figures.length) % figures.length;
      update();
    });
    next.addEventListener('click', () => {
      index = (index + 1) % figures.length;
      update();
    });
  });
})();
