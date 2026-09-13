/*
  BTI — Between The Irons
  Vanilla JS, no dependencies. Three small features:
    1. Mobile menu toggle   (fixes: nav had no way to open on phones below 950px)
    2. Scroll-reveal fade-ins (sections/cards fade + slide up as you scroll to them)
    3. Active nav-link highlighting (highlights "Services" etc. as you scroll past that section)
*/

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initScrollReveal();
  initActiveNavLinks();
});

/* ------------------------------------------------------------------ */
/* 1. Mobile menu toggle                                               */
/* ------------------------------------------------------------------ */
function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu whenever a nav link is clicked (so it doesn't stay open
  // after jumping to a section).
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on escape key, for keyboard users.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // If the window is resized back to desktop width while the menu is open,
  // reset it so it doesn't get stuck open when they shrink it again later.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 950) closeMenu();
  });
}

/* ------------------------------------------------------------------ */
/* 2. Scroll-reveal fade-ins                                           */
/* ------------------------------------------------------------------ */
function initScrollReveal() {
  // Elements we want to fade/slide in as the user scrolls to them.
  // Add or remove selectors here to control what animates.
  var targets = document.querySelectorAll(
    ".section-title, .card, .tile, .service-item, .step, .price-card, .visual-main, .visual-side"
  );

  if (!targets.length) return;

  // If the browser doesn't support IntersectionObserver, just show
  // everything immediately instead of leaving it invisible.
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* 3. Active nav-link highlighting                                     */
/* ------------------------------------------------------------------ */
function initActiveNavLinks() {
  var navLinks = document.querySelectorAll('#primary-nav a[href^="#"]');
  if (!navLinks.length) return;

  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ link: link, section: section });
  });

  if (!sections.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) {
          return s.section === entry.target;
        });
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) {
            l.classList.remove("active");
          });
          match.link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(function (s) {
    observer.observe(s.section);
  });
}
