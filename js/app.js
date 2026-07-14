/**
 * PORTFOLITE FLUID NOIR TEMPLATE + GRUNGE TYPOGRAPHY
 * INTERACTIVE BEHAVIORS: SMART STICKY NAVBAR (AUTO-HIDE/REVEAL), BURGER MENU, DARK/LIGHT THEME & JAKARTA CLOCK (UTC+7)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmartNavbar();
  initBurgerMenu();
  initThemeToggle();
  initJakartaClock();
  initCaseStudyModal();
  initPhotoZoomLightbox();
  initPortfoliteEstimator();
  initDispatchForm();
});

/* ==========================================================================
   0. SMART AUTO-HIDE / REVEAL STICKY NAVBAR (SCROLL UP OR DESKTOP TOP HOVER)
   ========================================================================== */
function initSmartNavbar() {
  const navbar = document.querySelector('.template-navbar');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let isHovered = false;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Never hide navbar when mobile drawer is open
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      navbar.classList.remove('navbar-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    // Always show when near top of page
    if (currentScrollY <= 40) {
      navbar.classList.remove('navbar-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    // Scrolling down -> hide navbar (unless user is currently hovering cursor near top)
    if (currentScrollY > lastScrollY && currentScrollY > 70 && !isHovered) {
      navbar.classList.add('navbar-hidden');
    }
    // Scrolling up -> immediately reveal navbar
    else if (currentScrollY < lastScrollY) {
      navbar.classList.remove('navbar-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // Desktop Hover Trigger at Top Edge of Viewport
  window.addEventListener('mousemove', (e) => {
    if (e.clientY <= 38 || navbar.contains(e.target)) {
      isHovered = true;
      navbar.classList.remove('navbar-hidden');
    } else {
      isHovered = false;
    }
  });
}

/* ==========================================================================
   1. BURGER MENU DRAWER WITH SMOOTH SCROLL/SLIDE & CLICK OUTSIDE TO CLOSE
   ========================================================================== */
function initBurgerMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (!burgerBtn || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.add('open');
    burgerBtn.innerHTML = '✕';
    burgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    burgerBtn.innerHTML = '☰';
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close drawer when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !burgerBtn.contains(e.target)
    ) {
      closeDrawer();
    }
  });

  // Close drawer when clicking any navigation link inside
  const links = mobileDrawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. THEME TOGGLE WITH TOAST NOTIFICATION (PRIMARY/DEFAULT: DARK THEME)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-trigger');
  
  // Default to 'dark' theme as the primary theme
  const savedTheme = localStorage.getItem('aa_theme') || 'dark';
  applyTheme(savedTheme, false);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
      localStorage.setItem('aa_theme', newTheme);
    });
  });

  function applyTheme(theme, showNotification = false) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle-text').forEach(el => {
      el.textContent = theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE';
    });

    if (showNotification) {
      if (theme === 'light') {
        showToast('☀ SWITCHED TO LIGHT THEME');
      } else {
        showToast('☾ SWITCHED TO PRIMARY DARK THEME');
      }
    }
  }
}

/* ==========================================================================
   3. LIVE JAKARTA TIMEZONE CLOCK (UTC+7 / WIB)
   ========================================================================== */
function initJakartaClock() {
  const clockElements = document.querySelectorAll('.jakarta-clock-display');
  const heroClockEl = document.getElementById('heroJakartaTime');
  
  function updateClock() {
    const now = new Date();
    const jakartaTime = now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    clockElements.forEach(el => {
      el.textContent = `${jakartaTime} WIB`;
    });
    if (heroClockEl) {
      heroClockEl.textContent = `${jakartaTime} WIB (UTC+7)`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   4. CASE STUDY DOSSIER MODAL
   ========================================================================== */
function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  const openBtn = document.getElementById('openCaseStudyBtn');
  const closeBtn = document.getElementById('closeModalBtn');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4.5. PHOTO ZOOM LIGHTBOX (CLICK ANY PROJECT PHOTO TO INSPECT/ZOOM)
   ========================================================================== */
function initPhotoZoomLightbox() {
  const lightbox = document.getElementById('photoZoomLightbox');
  const zoomedImg = document.getElementById('zoomedPhotoImg');
  const closeBtn = document.getElementById('closePhotoZoomBtn');

  if (!lightbox || !zoomedImg) return;

  function openLightbox(imgSrc, imgAlt) {
    zoomedImg.src = imgSrc;
    zoomedImg.alt = imgAlt || 'Zoomed Photo';
    lightbox.style.display = 'flex';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    zoomedImg.src = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === zoomedImg) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      e.stopPropagation();
      closeLightbox();
    }
  });

  document.querySelectorAll('.clickable-photo').forEach(photo => {
    photo.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(photo.src, photo.alt);
    });
  });
}

/* ==========================================================================
   5. PORTFOLITE PROJECT ESTIMATOR
   ========================================================================== */
function initPortfoliteEstimator() {
  const scopeCards = document.querySelectorAll('.option-card-glass[data-group="scope"]');
  const speedCards = document.querySelectorAll('.option-card-glass[data-group="speed"]');

  const costEl = document.getElementById('estimateCostDisplay');
  const timeEl = document.getElementById('estimateTimelineDisplay');
  const stackEl = document.getElementById('estimateStackDisplay');
  const noteEl = document.getElementById('estimateNoteDisplay');

  let basePrice = 3500;
  let selectedPriceStr = '$3,500 - $6,000';
  let speedMultiplier = 1.0;
  let selectedWeeks = '4 - 6 Weeks Delivery';
  let selectedStack = 'Full Stack Web (Next.js + MySQL + Vanilla JS)';
  let selectedNote = '*Base rate starts at $3,500. Total cost ranges up to $6,000 depending on your custom requirements.';

  function attachSelection(cards, group) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        if (group === 'scope') {
          if (card.hasAttribute('data-price-str') || card.hasAttribute('data-idr-price')) {
            selectedPriceStr = card.getAttribute('data-price-str') || card.getAttribute('data-idr-price');
          } else {
            selectedPriceStr = null;
          }
          basePrice = parseInt(card.getAttribute('data-price') || 3500);
          selectedWeeks = card.getAttribute('data-weeks') || '4 - 6 Weeks Delivery';
          selectedStack = card.getAttribute('data-stack') || 'Next.js + MySQL + Vanilla JS';
          if (card.hasAttribute('data-note')) {
            selectedNote = card.getAttribute('data-note');
          }
        } else if (group === 'speed') {
          speedMultiplier = parseFloat(card.getAttribute('data-mult') || 1.0);
        }

        recalculate();
      });
    });
  }

  attachSelection(scopeCards, 'scope');
  attachSelection(speedCards, 'speed');

  function recalculate() {
    if (noteEl && selectedNote) {
      noteEl.textContent = selectedNote;
    }
    if (selectedPriceStr) {
      if (costEl) {
        costEl.textContent = selectedPriceStr;
        costEl.style.fontSize = selectedPriceStr.length > 20 ? '1.55rem' : selectedPriceStr.length > 12 ? '1.85rem' : '';
        costEl.style.lineHeight = '1.2';
      }
      if (timeEl) {
        timeEl.textContent = speedMultiplier > 1.1 && !selectedPriceStr.startsWith('Rp')
          ? '⚡ Priority Fast-Track: 2 - 3 Weeks' 
          : `⏱ Standard Delivery: ${selectedWeeks}`;
      }
      if (stackEl) {
        stackEl.textContent = selectedStack;
      }
    } else {
      const total = Math.round((basePrice || 3500) * speedMultiplier);
      if (costEl) {
        costEl.textContent = '$' + total.toLocaleString('en-US');
        costEl.style.fontSize = '';
        costEl.style.lineHeight = '';
      }
      if (timeEl) {
        timeEl.textContent = speedMultiplier > 1.1 
          ? '⚡ Priority Fast-Track: 2 - 3 Weeks' 
          : `${selectedWeeks}`;
      }
      if (stackEl) {
        stackEl.textContent = selectedStack;
      }
    }
  }

  const inquireBtn = document.querySelector('.estimator-readout-card a');
  if (inquireBtn) {
    inquireBtn.addEventListener('click', () => {
      const scopeSummary = stackEl ? stackEl.textContent : selectedStack;
      const priceSummary = selectedPriceStr || (costEl ? costEl.textContent : `$${basePrice}`);
      try {
        localStorage.setItem('selectedScopeForInquiry', `${scopeSummary} [Investment: ${priceSummary}]`);
      } catch (e) {}
    });
  }

  recalculate();
}

/* ==========================================================================
   6. CONTACT DISPATCH FORM
   ========================================================================== */
function initDispatchForm() {
  const form = document.getElementById('contactForm');
  const successModal = document.getElementById('formspreeSuccessModal');
  const closeSuccessBtn = document.getElementById('closeFormspreeSuccessBtn');

  if (!form) return;

  const clientBrief = document.getElementById('clientBrief');
  try {
    const savedScope = localStorage.getItem('selectedScopeForInquiry');
    if (savedScope && clientBrief && !clientBrief.value.trim()) {
      clientBrief.value = `INQUIRY FOR SCOPE:\n${savedScope}\n\nPROJECT BRIEF / CONSULTATION NOTES:\n`;
      localStorage.removeItem('selectedScopeForInquiry');
    }
  } catch (e) {}

  function closeSuccessModal() {
    if (successModal) successModal.style.display = 'none';
  }

  if (closeSuccessBtn && successModal) {
    closeSuccessBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSuccessModal();
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeSuccessModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && successModal.style.display === 'flex') {
        e.stopPropagation();
        closeSuccessModal();
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message &rarr;';
    if (submitBtn) {
      submitBtn.innerHTML = 'TRANSMITTING...';
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        if (successModal) {
          successModal.style.display = 'flex';
        } else {
          showToast('MESSAGE SENT SUCCESSFULLY TO ADRIAUFARACHMAN@GMAIL.COM!');
        }
      } else {
        const data = await response.json().catch(() => ({}));
        if (data && data.errors) {
          showToast(`ERROR: ${data.errors.map(err => err.message).join(', ')}`);
        } else {
          showToast('TRANSMISSION ERROR: COULD NOT SEND MESSAGE. PLEASE TRY AGAIN.');
        }
      }
    } catch (error) {
      showToast('NETWORK ERROR: PLEASE CHECK YOUR CONNECTION AND TRY AGAIN.');
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

/* ==========================================================================
   7. GLOBAL TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout = null;

function showToast(msg) {
  const toast = document.getElementById('toastAlert');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  msgEl.textContent = msg;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
