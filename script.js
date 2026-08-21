/* =========================================================
   SAFE STORAGE HELPERS — wrap localStorage/sessionStorage so a
   blocked/opaque origin (e.g. this file opened directly via
   file:// instead of through a server) can't throw and crash
   this entire script before anything on the page can run.
========================================================= */
function safeGet(storeName, key) {
  try { return window[storeName].getItem(key); } catch (e) { return null; }
}
function safeSet(storeName, key, value) {
  try { window[storeName].setItem(key, value); return true; } catch (e) { return false; }
}

/* =========================================================
   CUSTOM CURSOR — small filled dot (tracks exactly) + a ring
   that trails with easing, growing on hover over clickable
   elements. Desktop/mouse only — untouched on touch devices.
========================================================= */
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('custom-cursor-active');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    if (!visible) {
      dot.classList.add('visible');
      ring.classList.add('visible');
      visible = true;
    }
  });
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
    visible = false;
  });
  document.addEventListener('mousedown', () => ring.classList.add('pressed'));
  document.addEventListener('mouseup', () => ring.classList.remove('pressed'));

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverSelector = 'a, button, input, textarea, select, .lanyard-card, .project-card, .skill-group-card, .pill, [role="button"]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector) && !e.relatedTarget?.closest?.(hoverSelector)) ring.classList.remove('hover');
  });
}

/* =========================================================
   PAGE LOADER — shown briefly on load, and on internal navigation
========================================================= */
const pageLoader = document.getElementById('pageLoader');

function hidePageLoader() {
  if (!pageLoader) return;
  setTimeout(() => pageLoader.classList.add('hidden'), 350);
}

if (document.readyState === 'complete') {
  hidePageLoader();
} else {
  window.addEventListener('load', hidePageLoader);
}

/* Intercept same-site .html link clicks so navigation shows the loader */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href$=".html"]');
  if (!link) return;
  if (link.target === '_blank' || e.metaKey || e.ctrlKey) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http')) return;
  e.preventDefault();
  if (pageLoader) pageLoader.classList.remove('hidden');
  setTimeout(() => { window.location.href = href; }, 380);
});

/* =========================================================
   THEME TOGGLE (dark / light)
========================================================= */
const themeToggle = document.getElementById('themeToggle');
const toggleThumb = document.getElementById('toggleThumb');
const body = document.body;

function applyTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light-mode');
    toggleThumb.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    body.classList.remove('light-mode');
    toggleThumb.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

const savedTheme = safeGet('localStorage', 'portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isLight = body.classList.contains('light-mode');
  const newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
  safeSet('localStorage', 'portfolio-theme', newTheme);
});

/* =========================================================
   "Continue the story" link on Home → opens Story Mode
========================================================= */
const continueStoryLink = document.getElementById('continueStoryLink');
if (continueStoryLink) {
  continueStoryLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.openStoryMode) window.openStoryMode();
  });
}

/* =========================================================
   MOBILE NAV
========================================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

/* =========================================================
   HERO ROLE TYPING EFFECT (index page only)
========================================================= */
const roleEl = document.getElementById('roleTyped');
if (roleEl) {
  const roles = [
    'WordPress Developer',
    'Web Developer',
    'BSCS Student',
    'Lead Generation Specialist',
    'Coding Instructor'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];
    charIndex += isDeleting ? -1 : 1;
    roleEl.textContent = currentRole.substring(0, charIndex);

    let speed = isDeleting ? 40 : 85;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = 1300;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 400;
    }
    setTimeout(typeLoop, speed);
  }
  typeLoop();
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealTargets = document.querySelectorAll(
  '.eyebrow, .section-title, .about-text, .about-stats, .about-image, ' +
  '.skill-cat-card, .project-card, .timeline-item, .edu-item, .contact-form, ' +
  '.credentials-block, .skills-image-strip'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));

/* =========================================================
   SPLIT-TEXT REVEAL (vanilla equivalent of React Bits SplitText)
========================================================= */
document.querySelectorAll('.split-text').forEach(el => {
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'split-char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.transitionDelay = (i * 22) + 'ms';
    el.appendChild(span);
  });
});

const splitObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('split-visible');
      splitObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.split-text').forEach(el => splitObserver.observe(el));

/* =========================================================
   SPOTLIGHT CARD (vanilla equivalent of React Bits SpotlightCard)
========================================================= */
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--sx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--sy', (e.clientY - rect.top) + 'px');
  });
});

/* =========================================================
   MAGNETIC BUTTON (vanilla equivalent of React Bits Magnet)
========================================================= */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

/* =========================================================
   ANIMATED STAT COUNTERS
========================================================= */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  let current = 0;
  const duration = 1100;
  const stepTime = Math.max(Math.floor(duration / target), 16);

  const timer = setInterval(() => {
    current++;
    el.textContent = current + suffix;
    if (current >= target) {
      clearInterval(timer);
      el.textContent = target + suffix;
    }
  }, stepTime);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

/* =========================================================
   CONTACT FORM (front-end only demo — sends via mailto fallback)
========================================================= */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // save into the admin panel's Messages inbox (this browser's storage —
    // see the note in admin.html about static-site storage limits)
    try {
      const MSG_KEY = 'gt_messages';
      const list = JSON.parse(localStorage.getItem(MSG_KEY) || '[]');
      list.unshift({
        id: 'msg_' + Date.now(),
        name, email, message,
        date: new Date().toISOString(),
        read: false
      });
      localStorage.setItem(MSG_KEY, JSON.stringify(list));
    } catch (err) { /* storage unavailable — mailto fallback below still works */ }

    const subject = encodeURIComponent('Portfolio inquiry from ' + name);
    const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = `mailto:gulshantahzeeba.kir@gmail.com?subject=${subject}&body=${body}`;
    formNote.textContent = 'Opening your email client to send this to Gulshan — if nothing opens, email her directly at gulshantahzeeba.kir@gmail.com';
    contactForm.reset();
  });
}

/* =========================================================
   CHATBOT WIDGET
========================================================= */
const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

if (chatFab) {
  chatFab.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) chatInput.focus();
  });

  chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', sender);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getBotReply(message) {
    const text = message.toLowerCase();

    if (text.includes('skill')) {
      return 'Gulshan works with HTML5, CSS3, JavaScript, WordPress & WooCommerce (Elementor), MySQL, Git, and basic C++/Java. She also does lead generation and content writing. See the Skills page for the full breakdown.';
    }
    if (text.includes('project')) {
      return 'She has 10+ WordPress/WooCommerce sites, several HTML/CSS/JS builds, and lead-gen/content projects — check the Projects page for live links.';
    }
    if (text.includes('contact') || text.includes('hire') || text.includes('email')) {
      return 'You can reach Gulshan at gulshantahzeeba.kir@gmail.com or +92 346 4355105 — or use the form on the Contact page.';
    }
    if (text.includes('wordpress')) {
      return 'Yes — she has built and customized 10+ WordPress/WooCommerce sites using Elementor, including e-commerce stores and blogs.';
    }
    if (text.includes('education') || text.includes('degree') || text.includes('university') || text.includes('bscs')) {
      return "She's pursuing a BS in Computer Science at The Islamia University of Bahawalpur (2024–2028 expected). See the Education page for her full academic timeline.";
    }
    if (text.includes('experience') || text.includes('work') || text.includes('job')) {
      return 'She freelances as a WordPress developer, generated 30,000+ leads at Cyntik, taught coding at Leadvora, and has worked with Vartex Soft. Full timeline on the Experience page.';
    }
    if (text.includes('location') || text.includes('where') || text.includes('based')) {
      return "She's based in Bahawalpur, Pakistan.";
    }
    if (text.includes('lead') || text.includes('leadgen')) {
      return "She's generated 30,000+ leads through targeted outreach and web scraping — see her lead-gen projects on the Projects page.";
    }
    if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('salam')) {
      return 'Hey! Ask me about skills, projects, education, experience, or how to get in touch with Gulshan.';
    }
    if (text.includes('thank')) {
      return "You're welcome! Anything else you'd like to know?";
    }

    return "Good question — try the About, Skills, or Experience page for that. Or reach out directly through the Contact page!";
  }

  function handleSend() {
    const value = chatInput.value.trim();
    if (!value) return;
    addMessage(value, 'user');
    chatInput.value = '';
    setTimeout(() => addMessage(getBotReply(value), 'bot'), 500);
  }

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}


/* =========================================================
   STORY MODE
========================================================= */
const storySlides = [
  {
    img: 'assets/Hero.png',
    eyebrow: 'chapter 01',
    title: 'Assalam-o-Alaikum, I\'m Gulshan',
    text: 'A WordPress & Web Developer based in Bahawalpur, Pakistan, currently pursuing a BS in Computer Science. Here\'s my story in a minute.'
  },
  {
    img: 'assets/About.png',
    eyebrow: 'chapter 02',
    title: 'A little about me',
    text: 'I build responsive, SEO-optimized WooCommerce sites, and combine that with digital marketing knowledge so the sites I build actually convert visitors.'
  },
  {
    img: 'assets/Education.png',
    eyebrow: 'chapter 03',
    title: 'Currently studying',
    text: 'BS Computer Science at The Islamia University of Bahawalpur (2024–2028) — building a real CS foundation alongside client work.'
  },
  {
    img: 'assets/Skills.png',
    eyebrow: 'chapter 04',
    title: 'What I work with',
    text: 'HTML5, CSS3, JavaScript, WordPress & WooCommerce with Elementor, MySQL, Git — plus lead generation and content writing on the side.'
  },
  {
    img: 'assets/Webdev.png',
    eyebrow: 'chapter 05',
    title: 'Web Development',
    text: 'From booking platforms to business sites — I\'ve shipped booking systems, e-commerce flows, and full landing pages in plain HTML, CSS and JS.'
  },
  {
    img: 'assets/Wordpress.png',
    eyebrow: 'chapter 06',
    title: 'WordPress Development',
    text: '10+ WordPress/WooCommerce sites built and customized with Elementor — themes, plugins, and full client handoffs.'
  },
  {
    img: 'assets/Leadgen.png',
    eyebrow: 'chapter 07',
    title: 'Lead Generation',
    text: 'At Cyntik, I generated roughly 30,000 leads through targeted outreach — sourcing, verifying, and organizing prospect data that converts.'
  },
  {
    img: 'assets/Content.png',
    eyebrow: 'chapter 08',
    title: 'Content Writing',
    text: 'Researched, SEO-friendly articles and copy — writing that\'s built to actually hold a reader\'s attention.'
  },
  {
    img: 'assets/Workexp.png',
    eyebrow: 'chapter 09',
    title: 'Work & Teaching',
    text: 'Freelance WordPress work, a lead-gen role at Cyntik, coding instruction at Leadvora, and time at Vartex Soft as both developer and instructor.'
  },
  {
    img: 'assets/Contact.png',
    eyebrow: 'chapter 10',
    title: "Let's talk",
    text: 'Got a project, a role, or just a question? My inbox is always open — gulshantahzeeba.kir@gmail.com'
  },
  {
    img: 'assets/Niqab.png',
    eyebrow: 'the end',
    title: 'Thanks for stopping by',
    text: 'That\'s my story so far. Tap below to explore the full portfolio.',
    cta: 'Enter Portfolio'
  }
];

const storyOverlay = document.getElementById('storyOverlay');
const storyStage = document.getElementById('storyStage');
const storyProgress = document.getElementById('storyProgress');
const storyModeBtn = document.getElementById('storyModeBtn');
const storyClose = document.getElementById('storyClose');
const storyPrev = document.getElementById('storyPrev');
const storyNext = document.getElementById('storyNext');

let currentSlide = 0;
let slideTimer = null;
let slideStart = 0;
const SLIDE_DURATION = 5000;

if (storyOverlay) {
  storySlides.forEach(() => {
    const bar = document.createElement('div');
    bar.classList.add('story-progress-bar');
    bar.innerHTML = '<div class="story-progress-fill"></div>';
    storyProgress.appendChild(bar);
  });
  const progressBars = storyProgress.querySelectorAll('.story-progress-bar');

  storySlides.forEach((slide, i) => {
    const el = document.createElement('div');
    el.classList.add('story-slide');
    if (i === 0) el.classList.add('active');
    const ctaHtml = slide.cta
      ? `<button class="story-slide-cta" id="storyEnterPortfolio">${slide.cta} <i class="fa-solid fa-arrow-right"></i></button>`
      : '';
    el.innerHTML = `
      <div class="story-slide-media"><img src="${slide.img}" alt="${slide.title}"></div>
      <div class="story-slide-scrim">
        <p class="story-chapter-badge"><span class="num">${i + 1}</span> ${slide.eyebrow}</p>
        <h2 class="story-slide-title">${slide.title}</h2>
        <p class="story-slide-text">${slide.text}</p>
        ${ctaHtml}
      </div>
    `;
    storyStage.appendChild(el);
  });
  const slideEls = storyStage.querySelectorAll('.story-slide');
  const storyCounter = document.getElementById('storyCounter');

  function renderProgress() {
    progressBars.forEach((bar, i) => {
      const fill = bar.querySelector('.story-progress-fill');
      bar.classList.remove('done');
      if (i < currentSlide) {
        bar.classList.add('done');
        fill.style.transition = 'none';
        fill.style.width = '100%';
      } else {
        fill.style.transition = 'none';
        fill.style.width = '0%';
      }
    });
  }

  function goToSlide(index) {
    clearTimeout(slideTimer);
    if (index < 0) index = 0;
    if (index >= storySlides.length) {
      closeStory();
      return;
    }
    currentSlide = index;
    slideEls.forEach((el, i) => el.classList.toggle('active', i === currentSlide));
    renderProgress();
    if (storyCounter) storyCounter.textContent = `${currentSlide + 1} / ${storySlides.length}`;
    startSlideTimer();
  }

  function startSlideTimer() {
    clearTimeout(slideTimer);
    slideStart = Date.now();
    const fill = progressBars[currentSlide].querySelector('.story-progress-fill');
    requestAnimationFrame(() => {
      fill.style.transition = `width ${SLIDE_DURATION}ms linear`;
      fill.style.width = '100%';
    });
    slideTimer = setTimeout(() => goToSlide(currentSlide + 1), SLIDE_DURATION);
  }

  function pauseSlideTimer() {
    clearTimeout(slideTimer);
    const fill = progressBars[currentSlide].querySelector('.story-progress-fill');
    const computed = getComputedStyle(fill).width;
    fill.style.transition = 'none';
    fill.style.width = computed;
  }

  function openStory() {
    storyOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToSlide(0);
  }

  function closeStory() {
    clearTimeout(slideTimer);
    storyOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.openStoryMode = openStory;
  storyModeBtn.addEventListener('click', openStory);
  storyClose.addEventListener('click', closeStory);
  storyPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  storyNext.addEventListener('click', () => goToSlide(currentSlide + 1));

  storyStage.addEventListener('click', (e) => {
    if (e.target.id === 'storyEnterPortfolio') {
      closeStory();
      return;
    }
    const rect = storyStage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    goToSlide(x < rect.width / 2 ? currentSlide - 1 : currentSlide + 1);
  });

  ['mousedown', 'touchstart'].forEach(evt => storyStage.addEventListener(evt, pauseSlideTimer));
  ['mouseup', 'touchend'].forEach(evt =>
    storyStage.addEventListener(evt, () => {
      const remaining = SLIDE_DURATION - ((Date.now() - slideStart) % SLIDE_DURATION);
      slideTimer = setTimeout(() => goToSlide(currentSlide + 1), remaining);
    })
  );

  document.addEventListener('keydown', (e) => {
    if (!storyOverlay.classList.contains('active')) return;
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'Escape') closeStory();
  });

  // NOTE: Story Mode used to auto-open once per session on page load here.
  // Removed per client feedback — Portfolio Mode (the normal site) should
  // always be what visitors land on first; Story Mode only opens when they
  // explicitly click the "Story" button or the "continue the story" link.
}

/* =========================================================
   LANYARD — draggable, spring-back swinging ID card
========================================================= */
function initLanyards() {
  const wraps = document.querySelectorAll('.lanyard-wrap');
  wraps.forEach(wrap => {
    const card = wrap.querySelector('.lanyard-card');
    const strap = wrap.querySelector('.lanyard-strap');
    const clip = wrap.querySelector('.lanyard-clip');
    if (!card) return;

    let dragging = false;
    let startX = 0, startY = 0;
    let rotX = 0, rotY = 0;
    let velX = 0, velY = 0;
    let targetRotX = 0, targetRotY = 0;

    wrap.classList.add('idle-swing');

    function pointerDown(e) {
      dragging = true;
      wrap.classList.remove('idle-swing');
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      card.style.transition = 'none';
      if (strap) strap.style.transition = 'none';
      if (clip) clip.style.transition = 'none';
    }

    function pointerMove(e) {
      if (!dragging) return;
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      targetRotY = Math.max(-28, Math.min(28, dx * 0.35));
      targetRotX = Math.max(-16, Math.min(16, -dy * 0.2));
    }

    function pointerUp() {
      if (!dragging) return;
      dragging = false;
      card.style.transition = '';
      if (strap) strap.style.transition = '';
      if (clip) clip.style.transition = '';
      targetRotX = 0;
      targetRotY = 0;
      setTimeout(() => wrap.classList.add('idle-swing'), 600);
    }

    card.addEventListener('mousedown', pointerDown);
    card.addEventListener('touchstart', pointerDown, { passive: true });
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('touchmove', pointerMove, { passive: true });
    window.addEventListener('mouseup', pointerUp);
    window.addEventListener('touchend', pointerUp);

    function animate() {
      rotX += (targetRotX - rotX) * 0.12;
      rotY += (targetRotY - rotY) * 0.12;
      if (dragging || Math.abs(rotX) > 0.05 || Math.abs(rotY) > 0.05) {
        card.style.transform = `rotateX(${rotX * 0.4}deg) rotateY(${rotY * 0.4}deg) rotate(${rotY * 0.5}deg)`;
        if (strap) strap.style.transform = `rotate(${rotY * 0.5}deg)`;
        if (clip) clip.style.transform = `rotate(${rotY * 0.5}deg)`;
      }
      requestAnimationFrame(animate);
    }
    animate();
  });
}

/* =========================================================
   COLOR BENDS — animated flowing gradient canvas (hero bg)
========================================================= */
function initColorBends() {
  const canvas = document.querySelector('.color-bends-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let w, h, mx = 0.5, my = 0.5;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
  });

  const isLight = () => document.body.classList.contains('light-mode');

  const blobs = [
    { baseX: 0.3, baseY: 0.35, r: 0.5, speed: 0.4, color: '3,148,100' },
    { baseX: 0.7, baseY: 0.55, r: 0.42, speed: 0.55, color: '16,185,129' },
    { baseX: 0.5, baseY: 0.75, r: 0.38, speed: 0.32, color: '110,231,183' }
  ];

  let t = 0;
  function draw() {
    t += 0.006;
    ctx.clearRect(0, 0, w, h);
    if (isLight()) {
      // no gradient blobs at all in light mode — just keep the
      // canvas cleared so nothing is drawn on the light background
      requestAnimationFrame(draw);
      return;
    }
    ctx.globalCompositeOperation = 'lighter';
    blobs.forEach((b, i) => {
      const x = (b.baseX + Math.sin(t * b.speed + i) * 0.08 + (mx - 0.5) * 0.06) * w;
      const y = (b.baseY + Math.cos(t * b.speed * 0.8 + i) * 0.08 + (my - 0.5) * 0.06) * h;
      const r = b.r * Math.min(w, h);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${b.color},0.4)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  }
  draw();
}

/* =========================================================
   DOCK — proximity magnify effect for about-stats
========================================================= */
function initDock() {
  const dock = document.querySelector('.about-stats');
  if (!dock) return;
  const items = dock.querySelectorAll('.stat-card');
  items.forEach(item => item.classList.add('dock-item'));

  dock.addEventListener('mousemove', (e) => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - cx);
      const maxDist = 220;
      const proximity = Math.max(0, 1 - dist / maxDist);
      const scale = 1 + proximity * 0.14;
      const lift = proximity * -8;
      item.style.transform = `translateY(${lift}px) scale(${scale})`;
    });
  });

  dock.addEventListener('mouseleave', () => {
    items.forEach(item => { item.style.transform = ''; });
  });
}

/* =========================================================
   DEPTH CAROUSEL — skills category cards
========================================================= */
function initDepthCarousel() {
  const track = document.querySelector('.depth-carousel');
  if (!track) return;
  const cards = track.querySelectorAll('.skill-cat-card');

  function updateFocus() {
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = null, closestDist = Infinity;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < closestDist) { closestDist = dist; closest = card; }
    });
    cards.forEach(c => c.classList.toggle('in-focus', c === closest));
  }

  track.addEventListener('scroll', () => {
    requestAnimationFrame(updateFocus);
  }, { passive: true });

  window.addEventListener('resize', updateFocus);
  updateFocus();
}

/* =========================================================
   CHROMA GRID — cursor-tracked glow on project cards
========================================================= */
function initChromaGrid() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.classList.add('chroma-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--chroma-x', `${x}%`);
      card.style.setProperty('--chroma-y', `${y}%`);
    });
  });
}

/* =========================================================
   The custom pointer-ring cursor (dot + trailing ring) lives in
   initCustomCursor() near the top of this file. The old heavy
   WebGL splash-cursor effect was removed per client feedback
   (didn't look good) and replaced with that simple ring + dot.
========================================================= */

/* =========================================================
   ALL PROJECTS — unified, fully editable/deletable dataset.
   Seeded once from window.GT_DEFAULT_PROJECTS (projects-data.js)
   into localStorage under "gt_projects" on first run; from then
   on EVERYTHING (the original 21 as well as anything added later
   from the Admin Panel) lives in that one array, so every card —
   old or new — can be edited or deleted from Admin.
========================================================= */
const CATEGORY_META = {
  web:      { gridId: 'grid-web',      label: 'Web Development', avatar: 'assets/Webdev.png' },
  wordpress:{ gridId: 'grid-wordpress',label: 'WordPress',       avatar: 'assets/Wordpress.png' },
  leadgen:  { gridId: 'grid-leadgen',  label: 'Lead Generation', avatar: 'assets/Leadgen.png' },
  content:  { gridId: 'grid-content',  label: 'Content Writing', avatar: 'assets/Content.png' }
};

function getAllProjects() {
  let list = null;
  try { list = JSON.parse(localStorage.getItem('gt_projects')); } catch (e) { list = null; }
  if (!list) {
    list = (window.GT_DEFAULT_PROJECTS || []).map(p => Object.assign({}, p));
    try { localStorage.setItem('gt_projects', JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }
  return list;
}

function buildProjectCardHTML(p, index) {
  const tagsHTML = (p.tags || []).map(t => `<span class="pill pill-sm">${escapeHTML(t)}</span>`).join('');
  const thumbHTML = p.image
    ? `<div class="project-thumb"><div class="project-thumb-bar"><span></span><span></span><span></span></div><div class="project-thumb-shot"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)} screenshot"></div></div>`
    : `<div class="project-thumb no-img"><div class="project-thumb-bar"><span></span><span></span><span></span></div><div class="project-thumb-shot"><span>${escapeHTML(p.noImgLabel || (p.title || '??').slice(0, 2).toUpperCase())}</span></div></div>`;

  const links = [];
  if (p.liveUrl) links.push(`<a href="${escapeHTML(p.liveUrl)}" class="link-arrow" target="_blank" rel="noopener">Live Project <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`);
  if (p.githubUrl) links.push(`<a href="${escapeHTML(p.githubUrl)}" class="link-arrow" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>`);
  const linkHTML = links.length
    ? links.join('')
    : `<span class="link-arrow" style="color:#10B981;"><i class="fa-solid fa-swatchbook"></i> No Live Link</span>`;

  return `<article class="project-card spotlight-card" data-project-id="${p.id}">
      ${thumbHTML}
      <div class="project-info">
        <span class="link-arrow" style="opacity:.6;">${String(index).padStart(2, '0')}</span>
        <h4>${escapeHTML(p.title)}</h4>
        <p>${escapeHTML(p.description || '')}</p>
        <div class="project-tags">${tagsHTML}</div>
        <div class="project-links">${linkHTML}</div>
      </div>
    </article>`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function renderAllProjects() {
  const anchor = document.getElementById('customCategoryAnchor');
  if (!anchor) return; // not on projects.html

  const projects = getAllProjects();
  if (!projects.length) return;

  // group by category
  const byCategory = {};
  projects.forEach(p => {
    const key = p.category === 'custom' ? ('custom:' + (p.customCategoryName || 'Other')) : p.category;
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(p);
  });

  let runningIndex = 1;
  Object.keys(byCategory).forEach(key => {
    const items = byCategory[key];
    if (key.indexOf('custom:') === 0) {
      // build a brand-new category section (heading + grid only — the
      // page has a single shared lanyard now, not one per category)
      const label = key.slice(7);
      const section = document.createElement('div');
      section.innerHTML = `
        <div class="project-category-heading" data-lanyard-avatar="assets/Hero.png" data-lanyard-caption="${escapeHTML(label)}">
          <h3>${escapeHTML(label)}</h3>
          <span>Custom category</span>
        </div>
        <div class="projects-grid" id="grid-custom-${label.replace(/[^a-z0-9]/gi, '-')}"></div>`;
      anchor.parentNode.insertBefore(section, anchor);
      const grid = section.querySelector('.projects-grid');
      items.forEach((p) => { grid.insertAdjacentHTML('beforeend', buildProjectCardHTML(p, runningIndex++)); });
      initProjectsLanyardSync(); // re-scan: a new heading with an avatar just got added
    } else {
      const meta = CATEGORY_META[key];
      if (!meta) return;
      const grid = document.getElementById(meta.gridId);
      if (!grid) return;
      items.forEach((p) => { grid.insertAdjacentHTML('beforeend', buildProjectCardHTML(p, runningIndex++)); });
    }
  });
}

/* =========================================================
   PROJECTS PAGE — single shared lanyard whose avatar image and
   caption change to match whichever category heading is
   currently in view, instead of one lanyard per category.
========================================================= */
function initProjectsLanyardSync() {
  const lanyardImg = document.getElementById('projectsLanyardImg');
  const lanyardCaption = document.getElementById('projectsLanyardCaption');
  const headings = document.querySelectorAll('.project-category-heading[data-lanyard-avatar]');
  if (!lanyardImg || !headings.length) return;

  if (initProjectsLanyardSync._observer) initProjectsLanyardSync._observer.disconnect();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const avatar = entry.target.getAttribute('data-lanyard-avatar');
      const caption = entry.target.getAttribute('data-lanyard-caption');
      if (avatar && lanyardImg.getAttribute('src') !== avatar) {
        lanyardImg.setAttribute('src', avatar);
      }
      if (caption && lanyardCaption) lanyardCaption.textContent = caption;
    });
  }, { root: null, rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
  initProjectsLanyardSync._observer = observer;
}

/* =========================================================
   EDUCATION PAGE — single sticky lanyard spanning BOTH the
   academic timeline and the certificates/awards section below
   it. The lanyard's image stays fixed (Education.png); only its
   caption switches between "BS Computer Science" and "Awards &
   Certificates" depending on which section is in view.
========================================================= */
function initEducationLanyardSync() {
  const lanyardCaption = document.getElementById('eduLanyardCaption');
  const zones = document.querySelectorAll('.edu-page-main [data-lanyard-caption]');
  if (!lanyardCaption || !zones.length) return;

  if (initEducationLanyardSync._observer) initEducationLanyardSync._observer.disconnect();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const caption = entry.target.getAttribute('data-lanyard-caption');
      if (caption) lanyardCaption.textContent = caption;
    });
  }, { root: null, rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  zones.forEach(z => observer.observe(z));
  initEducationLanyardSync._observer = observer;
}

/* =========================================================
   CERTIFICATE LIST + GRID — renders the default certifications
   & awards (from education-data.js) in two parts:
   1) A compact icon + text list (#certSimpleList) for every
      entry, in the order given, so awards and certs read like
      a quick-scan resume list.
   2) Below that, a visual card grid (#certGrid) but ONLY for
      entries that have an actual certificate image, showing
      the scan itself large and legible.
========================================================= */
function renderDefaultCertGrid() {
  const simpleList = document.getElementById('certSimpleList');
  const grid = document.getElementById('certGrid');
  if ((!simpleList && !grid) || !window.GT_DEFAULT_CERTS) return;

  window.GT_DEFAULT_CERTS.forEach(cert => {
    if (simpleList) {
      simpleList.insertAdjacentHTML('beforeend', `
        <div class="cert-item">
          <i class="fa-solid ${escapeHTML(cert.icon || 'fa-award')} cert-icon icon"></i>
          <div>
            <h4>${escapeHTML(cert.title)}</h4>
            <p>${escapeHTML(cert.subtitle)}</p>
          </div>
        </div>`);
    }

    if (cert.image && grid) {
      grid.insertAdjacentHTML('beforeend', `
        <div class="cert-card" data-cert-id="${cert.id}">
          <div class="cert-card-media"><img src="${cert.image}" alt="${escapeHTML(cert.title)} certificate"></div>
          <div class="cert-card-body">
            <h4>${escapeHTML(cert.title)}</h4>
            <p>${escapeHTML(cert.subtitle)}</p>
          </div>
        </div>`);
    }
  });
}

/* =========================================================
   CUSTOM EDUCATION — timeline entries and certificates added
   from the Admin Panel, stored in localStorage, rendered into
   education.html alongside the existing entries.
========================================================= */
function renderCustomEducation() {
  const timeline = document.querySelector('.edu-timeline');
  const certList = document.querySelector('.cert-list');
  if (!timeline && !certList) return; // not on education.html

  if (timeline) {
    let entries = [];
    try { entries = JSON.parse(localStorage.getItem('gt_custom_education') || '[]'); }
    catch (e) { entries = []; }
    entries.forEach(item => {
      timeline.insertAdjacentHTML('beforeend', `
        <div class="edu-item" data-custom-id="${item.id}">
          <div class="edu-dot"></div>
          <p class="edu-date">${escapeHTML(item.date)}</p>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.institution)}</p>
        </div>`);
    });
  }

  if (certList) {
    let certs = [];
    try { certs = JSON.parse(localStorage.getItem('gt_custom_certs') || '[]'); }
    catch (e) { certs = []; }
    const simpleList = document.getElementById('certSimpleList');
    const certGrid = document.getElementById('certGrid');
    certs.forEach(cert => {
      // Every added certificate gets a quick-scan row in the simple list...
      if (simpleList) {
        simpleList.insertAdjacentHTML('beforeend', `
          <div class="cert-item" data-custom-id="${cert.id}">
            <i class="fa-solid ${escapeHTML(cert.icon || 'fa-award')} cert-icon icon"></i>
            <div>
              <h4>${escapeHTML(cert.title)}</h4>
              <p>${escapeHTML(cert.subtitle)}</p>
            </div>
          </div>`);
      }

      // ...and if an image was attached, it also gets a full-size card in the
      // certificate grid so it's shown big and legible, not a tiny icon.
      if (cert.image && certGrid) {
        certGrid.insertAdjacentHTML('beforeend', `
          <div class="cert-card" data-custom-id="${cert.id}">
            <div class="cert-card-media"><img src="${cert.image}" alt="${escapeHTML(cert.title)} certificate"></div>
            <div class="cert-card-body">
              <h4>${escapeHTML(cert.title)}</h4>
              <p>${escapeHTML(cert.subtitle)}</p>
            </div>
          </div>`);
      }
    });
  }
}

/* =========================================================
   SKILL CARDS — added from the Admin Panel, stored under
   "gt_custom_skill_cards", rendered as extra cards alongside
   the original hardcoded skill-group cards (icon + title +
   description + tags), matching the same visual style.
========================================================= */
function renderSkillCards() {
  const grid = document.getElementById('skillGroups');
  if (!grid) return; // not on skills.html
  let cards = [];
  try { cards = JSON.parse(localStorage.getItem('gt_custom_skill_cards') || '[]'); }
  catch (e) { cards = []; }
  cards.forEach(card => {
    const tagsHTML = (card.tags || []).map(t => `<span class="pill pill-sm">${escapeHTML(t)}</span>`).join('');
    grid.insertAdjacentHTML('beforeend', `
      <div class="skill-group-card spotlight-card" data-custom-id="${card.id}">
        <div class="skill-group-icon"><i class="${escapeHTML(card.icon || 'fa-solid fa-layer-group')}"></i></div>
        <h3>${escapeHTML(card.title)}</h3>
        <p>${escapeHTML(card.description || '')}</p>
        <div class="skill-group-tags">${tagsHTML}</div>
      </div>`);
  });
}

/* =========================================================
   TOOLBELT — the original 13 pills stay hardcoded in
   skills.html exactly as written. Any skill card added from the
   Admin Panel (see renderSkillCards() above) has its tags synced
   by Admin into a deduplicated "gt_custom_skills" list (so a tag
   shared by two cards only shows once); this appends those pills
   here, then duplicates the full set once so the marquee's CSS
   animation (which scrolls exactly -50%) keeps looping seamlessly.
========================================================= */
function renderSkills() {
  const track = document.getElementById('toolbeltTrack');
  if (!track) return; // not on skills.html

  let extraSkills = [];
  try { extraSkills = JSON.parse(localStorage.getItem('gt_custom_skills') || '[]'); }
  catch (e) { extraSkills = []; }
  extraSkills.forEach(skill => {
    track.insertAdjacentHTML('beforeend', `<span class="pill">${escapeHTML(skill.name)}</span>`);
  });
  // duplicate the full set (original + admin-added) once for the seamless loop
  const html = track.innerHTML;
  track.innerHTML = html + html;
}

/* NOTE: projects.html now has ONE shared lanyard for the whole page
   (not one per category). Its avatar image and caption swap to match
   whichever category heading is currently in view — see
   initProjectsLanyardSync() above. */

/* =========================================================
   INIT ALL REACT-BITS-INSPIRED COMPONENTS
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Portfolio Mode (the normal multi-page site) is always what loads
  // first — Story Mode only opens when the "Story" button (or the
  // "continue the story" link on Home) is clicked. This just makes
  // sure the overlay starts fully closed on every load, in case a
  // browser restored old state from cache/back-forward navigation.
  const storyOverlayEl = document.getElementById('storyOverlay');
  if (storyOverlayEl) {
    storyOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  initLanyards();
  initColorBends();
  initDock();
  initDepthCarousel();
  initChromaGrid();
  initCustomCursor();
  renderAllProjects();
  renderDefaultCertGrid();
  renderCustomEducation();
  renderSkillCards();
  renderSkills();
  initProjectsLanyardSync();
  initEducationLanyardSync();
});
