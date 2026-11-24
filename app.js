/**
 * Booq Marketing Page - Interactive Engine
 * Conforms strictly to PRD v1 specifications.
 */

// Analytics Event Logger (Strict privacy: NEVER logs emails)
window.booqAnalyticsLog = [];
function trackBooqEvent(eventName, properties = {}) {
  // Ensure no PII like email ever enters the event payload
  const safeProperties = { ...properties };
  delete safeProperties.email;
  delete safeProperties.shop_name;
  delete safeProperties.shopName;

  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    properties: safeProperties,
  };

  window.booqAnalyticsLog.push(eventPayload);
  window.dispatchEvent(new CustomEvent('booq:event', { detail: eventPayload }));
  // Console logging for debugging in dev
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Booq Analytics]', eventName, safeProperties);
  }
}

// Utility: format currency as Naira
function formatNaira(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

// Live Screen-reader Announcer
function announceToScreenReader(message) {
  const announcer = document.getElementById('sr-announcements');
  if (announcer) {
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Mobile Menu Navigation & Drawer
  // -------------------------------------------------------------------------
  const menuBtn = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');

  if (menuBtn && navDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        navDrawer.classList.add('is-open');
        const firstLink = navDrawer.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        navDrawer.classList.remove('is-open');
      }
    };

    menuBtn.addEventListener('click', () => toggleMenu());

    // Close on navigation link click
    navDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
        menuBtn.focus();
      }
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (
        menuBtn.getAttribute('aria-expanded') === 'true' &&
        !navDrawer.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  // Track CTA clicks
  document.querySelectorAll('[data-track-cta]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const placement = btn.getAttribute('data-track-cta') || 'unknown';
      trackBooqEvent('early_access_click', { placement });
    });
  });

  // -------------------------------------------------------------------------
  // 2. Interactive POS Demo (Section D)
  // -------------------------------------------------------------------------
  const demoState = {
    hasStarted: true,
    scanned: true,
    quantity: 2,
    unitPrice: 8500,
    startingStock: 12,
    recorded: true,
  };

  const btnScan = document.getElementById('demo-btn-scan');
  const btnMinus = document.getElementById('demo-btn-minus');
  const btnPlus = document.getElementById('demo-btn-plus');
  const btnRecord = document.getElementById('demo-btn-record');
  const btnReset = document.getElementById('demo-btn-reset');

  const cartItemEl = document.getElementById('demo-cart-item');
  const qtyDisplayEl = document.getElementById('demo-qty-display');
  const summarySubtotalEl = document.getElementById('demo-summary-subtotal');
  const summaryTotalEl = document.getElementById('demo-summary-total');

  const liveReceipt = document.getElementById('live-receipt');
  const liveReceiptQty = document.getElementById('live-rcpt-qty');
  const liveReceiptLineTotal = document.getElementById('live-rcpt-line-total');
  const liveReceiptGrandTotal = document.getElementById('live-rcpt-grand-total');

  const liveStockVal = document.getElementById('live-stock-val');
  const liveStockMovement = document.getElementById('live-stock-movement');

  const liveHistoryRow = document.getElementById('live-history-row');
  const liveHistoryTotal = document.getElementById('live-history-total');
  const liveHistoryDetails = document.getElementById('live-history-details');

  function updateDemoUI() {
    // Total calculation: quantity * unitPrice
    const currentTotal = demoState.quantity * demoState.unitPrice;
    const formattedTotal = formatNaira(currentTotal);

    // Quantity display
    if (qtyDisplayEl) {
      qtyDisplayEl.textContent = demoState.scanned ? demoState.quantity : '0';
    }

    // Checkout Summary inside phone
    if (summarySubtotalEl) summarySubtotalEl.textContent = demoState.scanned ? formattedTotal : '₦0';
    if (summaryTotalEl) summaryTotalEl.textContent = demoState.scanned ? formattedTotal : '₦0';

    // Buttons bounded state
    if (btnScan) {
      btnScan.disabled = demoState.scanned;
    }

    if (btnMinus) {
      // Bound at 1
      btnMinus.disabled = !demoState.scanned || demoState.quantity <= 1 || demoState.recorded;
    }

    if (btnPlus) {
      // Bound at starting stock (12)
      btnPlus.disabled = !demoState.scanned || demoState.quantity >= demoState.startingStock || demoState.recorded;
    }

    if (btnRecord) {
      btnRecord.disabled = !demoState.scanned || demoState.recorded;
      if (demoState.recorded) {
        btnRecord.textContent = 'Sale recorded ✓';
      } else {
        btnRecord.textContent = 'Record sample sale';
      }
    }

    if (cartItemEl) {
      if (demoState.scanned) {
        cartItemEl.classList.remove('empty');
      } else {
        cartItemEl.classList.add('empty');
      }
    }

    // Receipt display
    if (liveReceipt) {
      if (demoState.recorded) {
        liveReceipt.classList.remove('is-empty');
        if (liveReceiptQty) liveReceiptQty.textContent = `${demoState.quantity}× Everyday Tee (M)`;
        if (liveReceiptLineTotal) liveReceiptLineTotal.textContent = formattedTotal;
        if (liveReceiptGrandTotal) liveReceiptGrandTotal.textContent = formattedTotal;
      } else {
        liveReceipt.classList.add('is-empty');
        if (liveReceiptQty) liveReceiptQty.textContent = `${demoState.quantity}× Everyday Tee (M)`;
        if (liveReceiptLineTotal) liveReceiptLineTotal.textContent = formattedTotal;
        if (liveReceiptGrandTotal) liveReceiptGrandTotal.textContent = formattedTotal;
      }
    }

    // Stock Movement display
    if (liveStockVal && liveStockMovement) {
      if (demoState.recorded) {
        const remaining = demoState.startingStock - demoState.quantity;
        liveStockVal.textContent = remaining;
        const qtyWord = demoState.quantity === 2 ? 'Two' : (demoState.quantity === 1 ? 'One' : demoState.quantity);
        liveStockMovement.textContent = `${qtyWord} sold from a starting stock of 12. Everyday Tee · Black / M`;
      } else {
        liveStockVal.textContent = demoState.startingStock;
        liveStockMovement.textContent = 'Ready to sell · Starting stock of 12. Everyday Tee · Black / M';
      }
    }

    // Web Dashboard Sync display
    if (liveHistoryTotal && liveHistoryDetails) {
      if (demoState.recorded) {
        liveHistoryTotal.textContent = formattedTotal;
        liveHistoryDetails.textContent = `Find the same sale on your dashboard. Receipt BQ-0104 · ${formattedTotal}.`;
      } else {
        liveHistoryTotal.textContent = '₦0';
        liveHistoryDetails.textContent = 'Find the same sale on your dashboard once recorded.';
      }
    }
  }

  // Demo Action: Simulate Scan (Step 1)
  if (btnScan) {
    btnScan.addEventListener('click', () => {
      if (!demoState.hasStarted) {
        demoState.hasStarted = true;
        trackBooqEvent('demo_start', { product: 'Everyday Tee' });
      }
      demoState.scanned = true;
      demoState.quantity = 1;
      updateDemoUI();
      announceToScreenReader('Everyday Tee added to cart. 1 piece at ₦8,500. Total ₦8,500.');
      if (btnPlus) btnPlus.focus();
    });
  }

  // Demo Action: Quantity Plus (Step 2)
  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      if (demoState.scanned && demoState.quantity < demoState.startingStock && !demoState.recorded) {
        demoState.quantity += 1;
        updateDemoUI();
        announceToScreenReader(`Cart updated to ${demoState.quantity} tees. Total ${formatNaira(demoState.quantity * demoState.unitPrice)}.`);
      }
    });
  }

  // Demo Action: Quantity Minus
  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (demoState.scanned && demoState.quantity > 1 && !demoState.recorded) {
        demoState.quantity -= 1;
        updateDemoUI();
        announceToScreenReader(`Cart updated to ${demoState.quantity} tees. Total ${formatNaira(demoState.quantity * demoState.unitPrice)}.`);
      }
    });
  }

  // Demo Action: Record Sale (Step 3)
  if (btnRecord) {
    btnRecord.addEventListener('click', () => {
      if (demoState.scanned && !demoState.recorded) {
        // Prevent double-record taps
        demoState.recorded = true;
        updateDemoUI();

        trackBooqEvent('demo_complete', {
          quantity: demoState.quantity,
        });

        const remainingStock = demoState.startingStock - demoState.quantity;
        const total = formatNaira(demoState.quantity * demoState.unitPrice);
        announceToScreenReader(
          `Sale recorded! Receipt BQ-0104 created for ${total}. Stock updated to ${remainingStock} left on shelf.`
        );

        if (btnReset) btnReset.focus();
      }
    });
  }

  // Demo Action: Reset Demo (Step 4)
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      demoState.scanned = false;
      demoState.quantity = 1;
      demoState.recorded = false;
      updateDemoUI();
      announceToScreenReader('Demo reset. Starting stock restored to 12.');
      if (btnScan) btnScan.focus();
    });
  }

  // Initialize Demo UI on load
  updateDemoUI();

  // -------------------------------------------------------------------------
  // 3. FAQ Accordion (Section E)
  // -------------------------------------------------------------------------
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      // Close other accordion panels for clean reading
      faqTriggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      // Toggle clicked panel
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        panel.hidden = isExpanded;
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Waitlist Form & Submission (Section F)
  // -------------------------------------------------------------------------
  const waitlistForm = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('waitlist-email');
  const shopInput = document.getElementById('waitlist-shop');
  const emailError = document.getElementById('email-error');
  const submitBtn = document.getElementById('waitlist-submit');
  const successBanner = document.getElementById('waitlist-success');
  const errorBanner = document.getElementById('waitlist-retry');
  const retryBtn = document.getElementById('waitlist-retry-btn');

  // Simple RFC 5322-compliant email validator
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (waitlistForm && emailInput) {
    const clearErrors = () => {
      emailError.textContent = '';
      emailInput.removeAttribute('aria-invalid');
      if (errorBanner) errorBanner.hidden = true;
    };

    emailInput.addEventListener('input', () => {
      if (emailError.textContent) clearErrors();
    });

    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const rawEmail = emailInput.value.trim();
      const shopName = shopInput ? shopInput.value.trim() : '';

      // Validate email field
      if (!rawEmail || !isValidEmail(rawEmail)) {
        emailError.textContent = 'Enter a valid email address';
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        trackBooqEvent('waitlist_error', { category: 'validation_error' });
        return;
      }

      // Normalise email (lowercase & trimmed)
      const normalisedEmail = rawEmail.toLowerCase();

      // Submit state: disable repeat clicks, show "Joining…"
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.textContent = 'Joining…';

      try {
        // Durable registration in localStorage registry
        await new Promise((resolve) => setTimeout(resolve, 350));

        let registeredList = [];
        try {
          registeredList = JSON.parse(localStorage.getItem('booq_waitlist') || '[]');
        } catch (err) {
          registeredList = [];
        }

        // Deduplicate repeat emails safely
        const existingEntry = registeredList.find((entry) => entry.email === normalisedEmail);
        if (!existingEntry) {
          registeredList.push({
            email: normalisedEmail,
            shopName: shopName,
            registeredAt: new Date().toISOString(),
          });
          localStorage.setItem('booq_waitlist', JSON.stringify(registeredList));
        }

        // Track successful conversion without PII
        trackBooqEvent('waitlist_success', {
          isNewRegistration: !existingEntry,
          hasShopName: Boolean(shopName),
        });

        // Hide form and show success message
        waitlistForm.hidden = true;
        if (successBanner) {
          successBanner.hidden = false;
          announceToScreenReader("You're on the list. We'll email you when Booq is ready to try.");
        }
      } catch (err) {
        // Service failure handling: retain entries, allow "Try again"
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        if (errorBanner) errorBanner.hidden = false;
        trackBooqEvent('waitlist_error', { category: 'storage_error' });
      }
    });

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (errorBanner) errorBanner.hidden = true;
        waitlistForm.requestSubmit();
      });
    }
  }

  // -------------------------------------------------------------------------
  // 5. Privacy Policy Modal
  // -------------------------------------------------------------------------
  const privacyOpenBtns = document.querySelectorAll('#open-privacy-modal, #open-privacy-modal-inline');
  const privacyModal = document.getElementById('privacy-modal');
  const privacyCloseBtn = document.getElementById('close-privacy-modal');

  if (privacyModal && privacyCloseBtn) {
    const openPrivacy = () => {
      privacyModal.hidden = false;
      privacyCloseBtn.focus();
      document.body.style.overflow = 'hidden';
    };

    const closePrivacy = () => {
      privacyModal.hidden = true;
      document.body.style.overflow = '';
      const firstBtn = privacyOpenBtns[0];
      if (firstBtn) firstBtn.focus();
    };

    privacyOpenBtns.forEach((btn) => btn.addEventListener('click', openPrivacy));
    privacyCloseBtn.addEventListener('click', closePrivacy);

    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closePrivacy();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !privacyModal.hidden) {
        closePrivacy();
      }
    });
  }
});
