/**
 * Booq Pulse One — Hardware Shop Engine
 * Handles 360 interactive gallery, live thermal print simulation,
 * dynamic pricing telemetry, modal checkout, and order persistence.
 */

(function () {
  'use strict';

  // State
  const BASE_PRICE = 60000;
  const ROLL_BUNDLE_PRICE = 5000;
  let currentQty = 1;

  // DOM Elements
  const mainProductImg = document.getElementById('main-product-img');
  const currentAngleLabel = document.getElementById('current-angle-label');
  const thumbBtns = document.querySelectorAll('.thumb-btn');

  const livePrintOverlay = document.getElementById('live-print-overlay');
  const btnTriggerPrint = document.getElementById('btn-trigger-print');
  const btnPrintText = document.getElementById('btn-print-text');
  const btnDemoReceipt = document.getElementById('btn-demo-receipt');

  const btnQtyMinus = document.getElementById('btn-qty-minus');
  const btnQtyPlus = document.getElementById('btn-qty-plus');
  const qtyCount = document.getElementById('qty-count');
  const totalCalcDisplay = document.getElementById('total-calc-display');
  const btnCtaPrice = document.getElementById('btn-cta-price');

  const checkoutModal = document.getElementById('checkout-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnOpenCheckout = document.getElementById('btn-open-checkout');
  const btnQuickOrder = document.getElementById('btn-quick-order');
  const btnBannerOrder = document.getElementById('btn-banner-order');

  const modalSummaryQty = document.getElementById('modal-summary-qty');
  const modalSummaryTotal = document.getElementById('modal-summary-total');
  const modalSubmitPrice = document.getElementById('modal-submit-price');
  const addRollsCheckbox = document.getElementById('add-rolls');

  const printerOrderForm = document.getElementById('printer-order-form');
  const orderSuccessScreen = document.getElementById('order-success-screen');
  const confirmedOrderId = document.getElementById('confirmed-order-id');
  const btnFinishOrder = document.getElementById('btn-finish-order');

  // Format Naira
  function formatNaira(amount) {
    return '₦' + amount.toLocaleString('en-NG');
  }

  // Calculate & Update Pricing
  function updatePricing() {
    const hasExtraRolls = addRollsCheckbox ? addRollsCheckbox.checked : false;
    const baseTotal = currentQty * BASE_PRICE;
    const grandTotal = baseTotal + (hasExtraRolls ? ROLL_BUNDLE_PRICE : 0);

    const formattedBase = formatNaira(baseTotal);
    const formattedGrand = formatNaira(grandTotal);

    if (qtyCount) qtyCount.textContent = currentQty;
    if (totalCalcDisplay) totalCalcDisplay.textContent = formattedBase;
    if (btnCtaPrice) btnCtaPrice.textContent = formattedBase;

    if (modalSummaryQty) modalSummaryQty.textContent = currentQty;
    if (modalSummaryTotal) modalSummaryTotal.textContent = formattedGrand;
    if (modalSubmitPrice) modalSubmitPrice.textContent = formattedGrand;
  }

  // Audio chirp synthesizer for futuristic tactile feedback
  function playFuturisticChirp() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio autoplay policy or unavailable
    }
  }

  // Gallery Switching
  if (thumbBtns.length > 0 && mainProductImg) {
    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetSrc = btn.getAttribute('data-src');
        const targetLabel = btn.getAttribute('data-label');

        thumbBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        mainProductImg.style.opacity = '0.4';
        setTimeout(function () {
          mainProductImg.src = targetSrc;
          mainProductImg.style.opacity = '1';
        }, 120);

        if (currentAngleLabel && targetLabel) {
          currentAngleLabel.textContent = targetLabel;
        }

        playFuturisticChirp();
      });
    });
  }

  // Live Print Simulation Toggle
  function toggleLivePrint() {
    if (!livePrintOverlay) return;
    const isHidden = livePrintOverlay.hasAttribute('hidden');

    if (isHidden) {
      livePrintOverlay.removeAttribute('hidden');
      if (btnPrintText) btnPrintText.textContent = 'Hide Live Print';
      playFuturisticChirp();
    } else {
      livePrintOverlay.setAttribute('hidden', '');
      if (btnPrintText) btnPrintText.textContent = 'Trigger Live Print Test';
    }
  }

  if (btnTriggerPrint) {
    btnTriggerPrint.addEventListener('click', toggleLivePrint);
  }

  if (btnDemoReceipt) {
    btnDemoReceipt.addEventListener('click', function () {
      if (livePrintOverlay && livePrintOverlay.hasAttribute('hidden')) {
        toggleLivePrint();
      }
      const stage = document.getElementById('gallery-stage');
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Quantity Steppers
  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', function () {
      if (currentQty > 1) {
        currentQty--;
        updatePricing();
        playFuturisticChirp();
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', function () {
      if (currentQty < 20) {
        currentQty++;
        updatePricing();
        playFuturisticChirp();
      }
    });
  }

  if (addRollsCheckbox) {
    addRollsCheckbox.addEventListener('change', function () {
      updatePricing();
    });
  }

  // Modal Open / Close
  function openModal() {
    if (!checkoutModal) return;
    updatePricing();
    checkoutModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    const nameInput = document.getElementById('order-name');
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 100);
    playFuturisticChirp();
  }

  function closeModal() {
    if (!checkoutModal) return;
    checkoutModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (btnOpenCheckout) btnOpenCheckout.addEventListener('click', openModal);
  if (btnQuickOrder) btnQuickOrder.addEventListener('click', openModal);
  if (btnBannerOrder) btnBannerOrder.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  if (checkoutModal) {
    checkoutModal.addEventListener('click', function (e) {
      if (e.target === checkoutModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && checkoutModal && !checkoutModal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  // Order Submission
  if (printerOrderForm) {
    printerOrderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = (document.getElementById('order-name') || {}).value || '';
      const phone = (document.getElementById('order-phone') || {}).value || '';
      const shop = (document.getElementById('order-shop') || {}).value || '';
      const state = (document.getElementById('order-state') || {}).value || 'Lagos';
      const address = (document.getElementById('order-address') || {}).value || '';
      const addRolls = addRollsCheckbox ? addRollsCheckbox.checked : false;
      const paymentMethod = (printerOrderForm.elements['payment_method'] || {}).value || 'pod';

      if (!name.trim() || !phone.trim() || !shop.trim() || !address.trim()) {
        alert('Please fill in all required fields (Name, Phone, Shop Name, and Delivery Address).');
        return;
      }

      // Generate Order ID
      const randomRef = Math.floor(1000 + Math.random() * 9000);
      const orderId = 'BQ-PRNT-' + randomRef;

      // Save order
      const orderPayload = {
        orderId: orderId,
        product: 'Booq Pulse One (by Nile)',
        qty: currentQty,
        addExtraRolls: addRolls,
        totalAmount: (currentQty * BASE_PRICE) + (addRolls ? ROLL_BUNDLE_PRICE : 0),
        name: name.trim(),
        phone: phone.trim(),
        shop: shop.trim(),
        state: state,
        address: address.trim(),
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString()
      };

      try {
        const stored = JSON.parse(localStorage.getItem('booq_printer_orders') || '[]');
        stored.push(orderPayload);
        localStorage.setItem('booq_printer_orders', JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage unavailable for order caching', err);
      }

      // Show confirmation screen
      if (confirmedOrderId) confirmedOrderId.textContent = orderId;
      printerOrderForm.setAttribute('hidden', '');
      if (orderSuccessScreen) orderSuccessScreen.removeAttribute('hidden');

      playFuturisticChirp();
    });
  }

  if (btnFinishOrder) {
    btnFinishOrder.addEventListener('click', function () {
      closeModal();
      setTimeout(function () {
        if (printerOrderForm) {
          printerOrderForm.reset();
          printerOrderForm.removeAttribute('hidden');
        }
        if (orderSuccessScreen) {
          orderSuccessScreen.setAttribute('hidden', '');
        }
      }, 400);
    });
  }

  // Initialize display
  updatePricing();

})();
