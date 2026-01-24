
(function () {
  const btn = document.querySelector("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  const icon = document.querySelector("[data-nav-icon]");

  function setOpen(open) {
    if (!drawer || !btn) return;
    drawer.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    if (icon) icon.textContent = open ? "✕" : "☰";
  }

  if (btn && drawer) {
    btn.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("open");
      setOpen(!isOpen);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    drawer.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") setOpen(false);
    });
  }

  // Highlight current page
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('nav a[href]').forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (href === path || (path === "" && href === "index.html")) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });

  // Contact: build a mailto (no backend)
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = form.getAttribute("data-to") || "";
      const name = form.querySelector("[name='name']")?.value?.trim() || "";
      const email = form.querySelector("[name='email']")?.value?.trim() || "";
      const msg = form.querySelector("[name='message']")?.value?.trim() || "";

      const subject = encodeURIComponent(`Message depuis le site — ${name || "Visiteur"}`);
      const body = encodeURIComponent(
        `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n`
      );

      if (!to) {
        alert("Ajoute ton email dans contact.html (data-to) pour activer l'envoi.");
        return;
      }
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      const ok = document.querySelector("[data-contact-success]");
      if (ok) ok.hidden = false;
      form.reset();
    });
  }
})();
// Lightbox (galerie)
(function () {
  const root = document.querySelector("[data-lightbox-root]");
  if (!root) return;

  const img = root.querySelector("[data-lightbox-img]");
  const cap = root.querySelector("[data-lightbox-caption]");
  const closeBtns = root.querySelectorAll("[data-lightbox-close]");
  const triggers = document.querySelectorAll("[data-lightbox]");

  let lastFocus = null;

  function openLightbox({ src, alt, caption }) {
    lastFocus = document.activeElement;
    img.src = src;
    img.alt = alt || "";
    cap.textContent = caption || "";
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus close button for accessibility
    const closeBtn = root.querySelector(".lightbox__close");
    closeBtn && closeBtn.focus();
  }

  function closeLightbox() {
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    img.src = "";
    img.alt = "";
    cap.textContent = "";
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      openLightbox({
        src: btn.getAttribute("data-src"),
        alt: btn.getAttribute("data-alt"),
        caption: btn.getAttribute("data-caption"),
      });
    });
  });

  closeBtns.forEach((b) => b.addEventListener("click", closeLightbox));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("open")) closeLightbox();
  });
})();

