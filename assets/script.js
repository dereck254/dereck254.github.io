
document.addEventListener('DOMContentLoaded', () => {
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  const t = document.querySelector('.menu-toggle');
  const n = document.querySelector('.site-nav');

  if (t && n) {
    t.addEventListener('click', () => {
      const o = n.classList.toggle('open');
      t.setAttribute('aria-expanded', String(o));
      t.textContent = o ? '×' : '☰';
    });
  }

  const f = document.querySelector('#contact-form');

  if (f) {
    f.addEventListener('submit', () => {
      const button = f.querySelector('button[type="submit"]');

      if (button) {
        button.disabled = true;
        button.textContent = 'Sending...';
      }
    });
  }
});




/* Dereck Ongaro page transition loader */
document.addEventListener("DOMContentLoaded", () => {
  // Prevent duplicate loaders
  if (document.querySelector(".page-loader")) return;

  const loader = document.createElement("div");
  loader.className = "page-loader is-hidden";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-live", "polite");

  loader.innerHTML = `
    <div class="loader-spinner" aria-hidden="true"></div>
    <div class="loader-title">Dereck says…</div>
    <div class="loader-message">Loading... Please wait!</div>
  `;

  document.body.appendChild(loader);

  // Hide the loader when a page is restored from browser history
  window.addEventListener("pageshow", () => {
    loader.classList.add("is-hidden");
  });

  // Hide the loader when leaving a page, including Back/Forward navigation
  window.addEventListener("pagehide", () => {
    loader.classList.add("is-hidden");
  });

  // Handle normal internal link clicks
  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", event => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      // Ignore external links
      if (url.origin !== window.location.origin) return;

      // Ignore links to the current page
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) return;

      event.preventDefault();
      loader.classList.remove("is-hidden");

      window.setTimeout(() => {
        window.location.assign(url.href);
      }, 800);
    });
  });
});



/* =========================================
   BUY ME A SODA PAGE
   USD to KES conversion and payment modal
========================================= */

(function () {
  'use strict';

  const modal = document.getElementById('payment-modal');

  // This script is shared with other pages.
  // Exit safely when the soda page is not open.
  if (!modal) return;

  const amountInput = document.getElementById('custom-amount');
  const preview = document.getElementById('custom-preview');
  const usdOutput = document.getElementById('payment-usd');
  const kesOutput = document.getElementById('payment-kes');
  const rateNote = document.getElementById('exchange-rate-note');
  const retryButton = document.getElementById('retry-rate');

  let selectedAmount = 5;
  let exchangeRate = null;
  let exchangeRateUpdated = null;
  let rateRequest = null;

  const MAX_AMOUNT = 1000000;

  const yearElement = document.getElementById('soda-current-year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  function formatUSD(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function formatKES(amount) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function formatRateDate(dateString) {
    if (!dateString) return 'Date unavailable';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeZone: 'UTC'
    }).format(date);
  }

  function updateConversion() {
    usdOutput.textContent = formatUSD(selectedAmount);

    if (exchangeRate === null) {
      kesOutput.textContent = 'Unavailable';

      rateNote.textContent =
        'The exchange rate could not be loaded. Check your connection and try again.';

      retryButton.style.display = 'inline-block';
      updateCustomPreview();
      return;
    }

    kesOutput.textContent = formatKES(selectedAmount * exchangeRate);

    rateNote.textContent =
      'Reference rate: 1 USD = ' +
      formatKES(exchangeRate) +
      '. Last updated: ' +
      exchangeRateUpdated +
      '. Your payment provider may use a different rate.';

    retryButton.style.display = 'none';
    updateCustomPreview();
  }

  async function loadExchangeRate(forceRefresh) {
    if (rateRequest) {
      return rateRequest;
    }

    if (forceRefresh) {
      rateNote.textContent = 'Refreshing the exchange rate...';
      retryButton.style.display = 'none';
    }

    rateRequest = (async function () {
      try {
        const response = await fetch(
          'https://open.er-api.com/v6/latest/USD',
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error('Exchange-rate request failed.');
        }

        const data = await response.json();

        if (
          data.result !== 'success' ||
          !data.rates ||
          typeof data.rates.KES !== 'number' ||
          !Number.isFinite(data.rates.KES) ||
          data.rates.KES <= 0
        ) {
          throw new Error('No valid KES rate was returned.');
        }

        exchangeRate = data.rates.KES;
        exchangeRateUpdated = formatRateDate(data.time_last_update_utc);
      } catch (error) {
        exchangeRate = null;
        exchangeRateUpdated = null;
      } finally {
        rateRequest = null;
        updateConversion();
      }
    })();

    return rateRequest;
  }

  function selectAmount(amount) {
    if (
      !Number.isFinite(amount) ||
      amount < 1 ||
      amount > MAX_AMOUNT
    ) {
      alert('Please choose an amount between $1 and $1,000,000 USD.');
      return;
    }

    selectedAmount = Math.round(amount * 100) / 100;

    if (!modal.open) {
      modal.showModal();
    }

    updateConversion();
    loadExchangeRate(false);
  }

  function updateCustomPreview() {
    if (!amountInput || !preview) return;

    const rawValue = amountInput.value.trim();
    const amount = Number(rawValue);

    if (
      !rawValue ||
      !Number.isFinite(amount) ||
      amount < 1 ||
      amount > MAX_AMOUNT
    ) {
      preview.textContent =
        'Enter an amount of at least $1 USD to preview the conversion.';
      return;
    }

    if (exchangeRate === null) {
      preview.textContent =
        'Your USD amount is valid. The KSh estimate will appear when the rate loads.';
      return;
    }

    preview.textContent =
      formatUSD(amount) +
      ' is approximately ' +
      formatKES(amount * exchangeRate) +
      '.';
  }

  function useCustomAmount() {
    const rawValue = amountInput.value.trim();
    const amount = Number(rawValue);

    if (
      !rawValue ||
      !Number.isFinite(amount) ||
      amount < 1 ||
      amount > MAX_AMOUNT
    ) {
      alert('Enter a valid amount between $1 and $1,000,000 USD.');
      amountInput.focus();
      return;
    }

    selectAmount(Math.round(amount * 100) / 100);
  }

  function closePayment() {
    if (modal.open) {
      modal.close();
    }
  }

  function backToAmounts() {
    closePayment();

    const amountSection = document.getElementById('amounts-section');

    if (amountSection) {
      amountSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  function fallbackCopy(value) {
    window.prompt(
      'Automatic copying is unavailable. Copy this payment detail:',
      value
    );
  }

  async function copyPayment(id) {
    const element = document.getElementById(id);

    if (!element) return;

    const value = element.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        alert('Copied successfully: ' + value);
      } else {
        fallbackCopy(value);
      }
    } catch (error) {
      fallbackCopy(value);
    }
  }

  document.querySelectorAll('[data-soda-amount]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectAmount(Number(button.dataset.sodaAmount));
    });
  });

  const customForm = document.getElementById('custom-amount-form');

  if (customForm) {
    customForm.addEventListener('submit', function (event) {
      event.preventDefault();
      useCustomAmount();
    });
  }

  if (amountInput) {
    amountInput.addEventListener('input', updateCustomPreview);
  }

  const closeButton = document.getElementById('close-modal');

  if (closeButton) {
    closeButton.addEventListener('click', closePayment);
  }

  const backButton = document.getElementById('back-to-amounts');

  if (backButton) {
    backButton.addEventListener('click', backToAmounts);
  }

  if (retryButton) {
    retryButton.addEventListener('click', function () {
      loadExchangeRate(true);
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      copyPayment(button.dataset.copy);
    });
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closePayment();
    }
  });

  loadExchangeRate(false);
})();



