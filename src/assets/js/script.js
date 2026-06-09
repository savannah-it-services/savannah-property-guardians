/**
 * Savannah Property Guardians
 * Main JavaScript - All interactive functionality
 */

// Silence the same Chromium DevTools reporter error from client-side code too
try {
  Object.defineProperty(window, '__chromium_devtools_metrics_reporter', {
    configurable: true,
    enumerable: true,
    get: function() { return function() {}; },
    set: function() {}
  });
} catch (e) {}

// ============================================
// Mobile Navigation
// ============================================
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (!menuBtn || !mobileMenu) return;

  // Move the overlay to body so it escapes the header's stacking context (z-50)
  // and can properly grey out the entire page content below the top nav bar.
  if (mobileMenuOverlay && mobileMenuOverlay.parentElement !== document.body) {
    document.body.appendChild(mobileMenuOverlay);
  }

  // Collect submenu details once for both animation and coordinated closing
  const subDetails = mobileMenu.querySelectorAll('details');

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;

    if (isOpen) {
      mobileMenu.classList.add('open');
      if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
      menuIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      // Collapse any open submenus so the mobile menu is fresh the next time it opens
      subDetails.forEach((d) => {
        if (d.open) d.removeAttribute('open');
      });
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking the overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  }

  // Close menu when clicking a nav link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleMenu();
    }
  });

  // Smooth grow / close animation for mobile hamburger submenus (the <details> items)
  // Matches the main mobile menu's max-height + cubic-bezier "grow" behavior.
  subDetails.forEach((detail) => {
    const content = detail.querySelector('.sub-links');
    if (!content) return;

    // Prepare animated container (CSS also sets base max-height:0 + transition)
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    // Set initial collapsed/expanded state based on native details state
    const applyHeight = () => {
      content.style.maxHeight = detail.open ? content.scrollHeight + 'px' : '0px';
    };
    applyHeight();

    detail.addEventListener('toggle', () => {
      if (detail.open) {
        // Grow: animate from current (0) to the natural content height
        content.style.maxHeight = '0px';
        // Force the browser to acknowledge the start value, then expand
        void content.offsetHeight;
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        // Close: animate from current height down to zero
        const current = content.scrollHeight;
        content.style.maxHeight = current + 'px';
        void content.offsetHeight;
        content.style.maxHeight = '0px';
      }
    });
  });
}

// ============================================
// Active Navigation Highlight
// ============================================
function getPageNameFromPath(pathname) {
  // Normalize path (handle Windows backslashes too)
  const normalized = pathname.replace(/\\/g, '/');

  // Get the last meaningful segment (ignore trailing slash)
  const segments = normalized.split('/').filter(Boolean);
  let lastSegment = segments.pop() || 'index';

  // Remove query string and hash
  lastSegment = lastSegment.split('?')[0].split('#')[0];

  // Remove file extension if present (.html, .htm, etc.)
  const nameWithoutExt = lastSegment.replace(/\.[^/.]+$/, '');

  // Treat empty or 'index' as the homepage
  if (!nameWithoutExt || nameWithoutExt === 'index') {
    return 'index';
  }

  return nameWithoutExt.toLowerCase();
}

function getActiveNavKey(pathname) {
  const normalized = pathname.replace(/\\/g, '/').toLowerCase();
  const cleanPath = normalized.split('?')[0].split('#')[0].replace(/\/$/, '');

  // Map sub-service paths and main pages to their parent nav key
  if (cleanPath.includes('/handyman-services') || cleanPath.endsWith('/handyman')) {
    return 'handyman';
  }
  if (cleanPath.includes('/warehouse-services') || cleanPath.endsWith('/warehouse')) {
    return 'warehouse';
  }
  if (cleanPath.includes('/property-maintenance-services') || cleanPath.endsWith('/property-maintenance')) {
    return 'property-maintenance';
  }
  if (cleanPath.includes('/plumbing-services') || cleanPath.endsWith('/plumbing')) {
    return 'plumbing';
  }

  // Fallback: last path segment (for about, contact, home, etc.)
  const segments = cleanPath.split('/').filter(Boolean);
  let lastSegment = segments.pop() || 'index';
  lastSegment = lastSegment.replace(/\.[^/.]+$/, '');
  if (!lastSegment || lastSegment === 'index') return 'index';
  return lastSegment;
}

function setActiveNavLink() {
  const currentNavKey = getActiveNavKey(window.location.pathname);

  // Clear previous active states (useful if script runs multiple times)
  document.querySelectorAll('.nav-link[aria-current="page"]').forEach((el) => {
    el.removeAttribute('aria-current');
  });

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external, tel, mailto, or pure hash links
    if (
      href.startsWith('http') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href === '#'
    ) {
      return;
    }

    // Handle links that point to a specific section (e.g. /index.html#about)
    if (href.includes('#')) {
      const [linkPath, linkHash] = href.split('#');
      const linkPage = getPageNameFromPath(linkPath);
      const currentHash = window.location.hash;

      // Only activate if we're on the matching page AND the hash in the URL exactly matches
      if (linkPage === getPageNameFromPath(window.location.pathname) && currentHash === '#' + linkHash) {
        link.classList.add('active');
      }
      return;
    }

    // Normal page-to-page comparison (supports parent nav for sub-services)
    const linkNavKey = getActiveNavKey(href);

    if (linkNavKey === currentNavKey) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Mobile menu styling (gold + bold)
  const mobileLinks = document.querySelectorAll('#mobile-menu .nav-link');
  mobileLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      href.startsWith('http') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href === '#'
    ) {
      return;
    }

    if (href.includes('#')) {
      const [linkPath, linkHash] = href.split('#');
      const linkPage = getPageNameFromPath(linkPath);
      const currentHash = window.location.hash;

      if (linkPage === getPageNameFromPath(window.location.pathname) && currentHash === '#' + linkHash) {
        link.classList.add('text-spg-gold', 'font-semibold');
      }
      return;
    }

    const linkNavKey = getActiveNavKey(href);

    if (linkNavKey === currentNavKey) {
      link.classList.add('text-spg-gold', 'font-semibold');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ============================================
// Quote Request Modal
// ============================================
// ============================================
// Quote Form (global on every page, no modal)
// ============================================
function initQuoteForm() {
  document.querySelectorAll('#quote-form').forEach((formEl) => {
    const container = formEl.parentElement;
    const successMsgEl = container ? container.querySelector('#quote-success') : null;

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic client-side validation
      const requiredFields = formEl.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');

          field.addEventListener(
            'input',
            function onInput() {
              field.classList.remove('error');
              field.removeEventListener('input', onInput);
            },
            { once: true }
          );
        }
      });

      if (!isValid) {
        return;
      }

      const submitBtn = formEl.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
          Submitting...
        `;
      }

      // Submit to HubSpot via Forms API (replaces simulation)
      submitToHubSpot(formEl)
        .then((success) => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }

          if (success) {
            // Show success state
            formEl.classList.add('hidden');
            if (successMsgEl) {
              successMsgEl.classList.remove('hidden');
            }
            // (no modal close; just leave success visible)
          } else {
            // Error - user can try again or contact directly
            alert('Sorry, there was a problem submitting your request. Please try again or email us directly at ' + (window.location.hostname.includes('localhost') ? 'info@savannahpropertyguardians.com' : ''));
          }
        })
        .catch(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          alert('Sorry, there was a problem submitting your request. Please try again or email us directly.');
        });
    });
  });
}

function initQuoteButtons() {
  document.querySelectorAll('[data-open-quote]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contact-form');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Submits the quote form data to HubSpot using the Forms API v3.
 * Uses data attributes on the form for portal ID and form GUID (configured in site.json).
 */
async function submitToHubSpot(form) {
  const portalId = form.dataset.hubspotPortalId;
  const formGuid = form.dataset.hubspotFormGuid;

  // If no HubSpot IDs configured yet, fall back to simulation (for development)
  if (!portalId || !formGuid) {
    console.warn('[HubSpot] No portalId or formGuid found on form. Using simulation mode.');
    await new Promise((r) => setTimeout(r, 800));
    return true; // pretend success
  }

  // Collect values
  // Note: The form now uses separate First Name / Last Name fields (no more full name splitting logic).
  const getVal = (sel) => (form.querySelector(sel)?.value || '').trim();

  const firstname = getVal('#firstname');
  const lastname = getVal('#lastname');
  const email = getVal('#email');
  const phone = getVal('#phone');
  const company = getVal('#company');
  const service = getVal('#service');
  const details = getVal('#details');

  // Build HubSpot fields array (use internal property names)
  const fields = [
    { name: 'email', value: email },
    { name: 'firstname', value: firstname },
    { name: 'lastname', value: lastname },
    { name: 'phone', value: phone },
    { name: 'company', value: company },
    { name: 'service_needed', value: service },
    { name: 'project_details', value: details },
    // Optional: add a source
    { name: 'lead_source', value: 'Website Quote Request' }
  ].filter((f) => f.value); // drop empty if desired

  // Context for better attribution (page, etc.)
  const hutkMatch = document.cookie.match(/hubspotutk=([^;]+)/);
  const context = {
    pageUri: window.location.href,
    pageName: document.title
  };
  if (hutkMatch) {
    context.hutk = hutkMatch[1];
  }

  const payload = {
    fields,
    context
    // Add legalConsentOptions here if you add a consent checkbox to the form
  };

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      // Success - HubSpot received it (contact created/updated)
      return true;
    } else {
      console.error('[HubSpot] Submission failed', await res.text());
      return false;
    }
  } catch (err) {
    console.error('[HubSpot] Network error submitting form', err);
    return false;
  }
}

// ============================================
// FAQ Accordion (legacy .faq-item structure)
// ============================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = answer.classList.contains('open');

      // Close all others (accordion behavior)
      faqItems.forEach((otherItem) => {
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherQuestion = otherItem.querySelector('.faq-question');

        if (otherAnswer) otherAnswer.classList.remove('open');
        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        answer.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      } else {
        answer.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard accessibility
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-expanded', 'false');

    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        const offset = 80; // Account for fixed navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ============================================
// Animated Counter for Stats
// ============================================
function animateCounter(element, target, duration = 1600) {
  const start = 0;
  const startTime = performance.now();
  const suffix = element.dataset.suffix || '';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);

    element.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

function initStatsCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stats.forEach((stat) => {
            const target = parseInt(stat.dataset.target, 10);
            if (!isNaN(target)) {
              animateCounter(stat, target);
            }
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.6 }
  );

  const statsSection = stats[0].closest('section');
  if (statsSection) {
    observer.observe(statsSection);
  } else {
    // Fallback: trigger immediately if no section wrapper
    stats.forEach((stat) => {
      const target = parseInt(stat.dataset.target, 10);
      if (!isNaN(target)) animateCounter(stat, target);
    });
  }
}

// ============================================
// Simple Testimonial Slider (optional enhancement)
// ============================================
function initTestimonialSlider() {
  const slider = document.getElementById('testimonial-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  if (slides.length <= 1) return;

  let current = 0;

  // Create controls
  const controls = document.createElement('div');
  controls.className = 'flex justify-center gap-3 mt-8';

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-spg-gold w-8' : 'bg-spg-sand-dark'}`;
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    controls.appendChild(dot);
  });

  slider.appendChild(controls);

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });

    // Update dots
    controls.querySelectorAll('button').forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-spg-gold', 'w-8');
        dot.classList.remove('bg-spg-sand-dark');
      } else {
        dot.classList.remove('bg-spg-gold', 'w-8');
        dot.classList.add('bg-spg-sand-dark');
      }
    });

    current = index;
  }

  // Initialize
  slides.forEach((slide, i) => {
    slide.style.display = i === 0 ? 'block' : 'none';
  });

  // Auto rotate every 6s
  setInterval(() => {
    current = (current + 1) % slides.length;
    goToSlide(current);
  }, 6200);
}

// ============================================
// Service Page Specific: Tabbed content (if used)
// ============================================
function initServiceTabs() {
  const tabContainer = document.getElementById('service-tabs');
  if (!tabContainer) return;

  const tabs = tabContainer.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('[data-tab-panel]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update active tab styles
      tabs.forEach((t) => {
        t.classList.remove('bg-spg-green', 'text-white');
        t.classList.add('bg-white', 'text-spg-text');
      });
      tab.classList.add('bg-spg-green', 'text-white');
      tab.classList.remove('bg-white', 'text-spg-text');

      // Show correct panel
      panels.forEach((panel) => {
        if (panel.dataset.tabPanel === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}

// ============================================
// Utility: Copy phone / email to clipboard
// ============================================
function initCopyToClipboard() {
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.style.cursor = 'pointer';

    el.addEventListener('click', () => {
      const text = el.dataset.copy || el.textContent.trim();

      navigator.clipboard
        .writeText(text)
        .then(() => {
          const originalText = el.textContent;
          el.textContent = 'Copied!';

          setTimeout(() => {
            el.textContent = originalText;
          }, 1600);
        })
        .catch(() => {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        });
    });
  });
}

// ============================================
// Initialize Everything
// ============================================
function initializeSite() {
  initMobileNav();
  setActiveNavLink();
  initQuoteForm();
  initQuoteButtons();
  initFAQ();
  initSmoothScroll();
  initStatsCounters();
  initTestimonialSlider();
  initServiceTabs();
  initCopyToClipboard();

  // Easter egg: Konami code on logo triggers fun animation (optional)
  const logo = document.querySelector('.logo-svg, .nav-logo');
  if (logo) {
    let keys = [];
    const konami = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];

    document.addEventListener('keydown', (e) => {
      keys.push(e.key);
      keys = keys.slice(-10);

      if (keys.join(',') === konami.join(',')) {
        logo.style.transitionDuration = '600ms';
        logo.style.transform = 'rotate(360deg) scale(1.4)';

        setTimeout(() => {
          logo.style.transform = '';
          setTimeout(() => (logo.style.transitionDuration = ''), 300);
        }, 650);

        keys = [];
      }
    });
  }

  // Mark JS ready (useful for debugging)
  document.documentElement.classList.add('js-loaded');

  // Console branding (development only)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(
      '%c[Savannah Property Guardians] Static site initialized successfully.',
      'color:#C9A227; font-size: 9px'
    );
  }
}

// Boot the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSite);
} else {
  initializeSite();
}
