/* =========================================================
   Snap to 3D — JavaScript principal
   - Año dinámico en el footer
   - Menú de navegación móvil
   - Cambio de tema claro/oscuro (con detección automática del navegador)
   - Aparición de secciones al hacer scroll (continuidad visual)
   El scroll suave se gestiona vía CSS (scroll-behavior: smooth).
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Cambio de tema claro / oscuro ----------
     Sin elección manual, el CSS sigue la preferencia del navegador
     (prefers-color-scheme). Al pulsar el botón se fija una preferencia
     explícita que se guarda en localStorage. */
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const effectiveTheme = () => {
      const attr = root.getAttribute("data-theme");
      if (attr === "light" || attr === "dark") return attr;
      return prefersDark.matches ? "dark" : "light";
    };

    themeToggle.addEventListener("click", () => {
      const next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Menú de navegación móvil ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    // Cierra el menú al pulsar un enlace (útil en móvil)
    menu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu();
      }
    });

    // Cierra el menú con la tecla Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* ---------- Aparición progresiva al hacer scroll ---------- */
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealTargets = document.querySelectorAll(
    ".section__header, .section__text, .section__media, .step, .gallery__item, .roadmap__item"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Sin animación: el contenido se muestra directamente.
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }
})();
