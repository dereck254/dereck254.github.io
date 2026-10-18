document.addEventListener('DOMContentLoaded',()=>{const y=document.querySelector('[data-year]');if(y)y.textContent=new Date().getFullYear();const t=document.querySelector('.menu-toggle'),n=document.querySelector('.site-nav');if(t&&n)t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',String(o));t.textContent=o?'×':'☰'});const f=document.querySelector('#contact-form');if(f)f.addEventListener('submit',e=>{e.preventDefault();const v=id=>document.querySelector(id).value.trim();const body=`Name: ${v('#name')}\nReply email: ${v('#email')}\n\n${v('#message')}`;document.querySelector('#form-status').textContent='Opening your email app. Review the message and press Send to deliver it.';location.href=`mailto:dereckongaro1086@gmail.com?subject=${encodeURIComponent(v('#subject'))}&body=${encodeURIComponent(body)}`})});


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
    <div class="loader-message">Hold on tight!</div>
  `;

  document.body.appendChild(loader);

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

      if (url.origin !== window.location.origin) return;

      // Skip the current page and same-page navigation
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) return;

      event.preventDefault();
      loader.classList.remove("is-hidden");

      window.setTimeout(() => {
        window.location.assign(url.href);
      }, 2000);
    });
  });
});

