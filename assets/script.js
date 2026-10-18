
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


