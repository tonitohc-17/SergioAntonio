(function () {
  "use strict";

  var CONTENT = window.CONTENT;
  var LANGS = ["en", "fr", "es"];
  var PAGES = ["welcome", "engineering", "projects", "mobility", "sustainability", "sport", "career"];
  var TODO_PREFIX = "TODO:";

  var root = document.documentElement;
  var body = document.body;
  var main = document.getElementById("main");
  var menuBtn = document.querySelector(".menu-btn");
  var topbar = document.querySelector(".topbar");
  var lang = pickLanguage();
  var currentPage = null;

  /* ---------- "Inside this portfolio" map at the end of each inner page ---------- */
  // Lists the six other sections, like the map on the Welcome page

  PAGES.forEach(function (id) {
    var wrap = document.querySelector('[data-page="' + id + '"] > .wrap');
    if (id === "welcome" || !wrap) return;
    var items = PAGES.map(function (other, i) {
      if (other === id) return "";
      return '<li><a href="#' + other + '">' +
        '<span class="map-n">0' + (i + 1) + '</span>' +
        '<span class="map-t" data-i18n="nav.' + other + '"></span>' +
        '<span class="map-d" data-i18n="welcome.m.' + other + '"></span>' +
        '</a></li>';
    }).join("");
    var map = document.createElement("div");
    map.className = "map map--end";
    map.innerHTML = '<h2 class="label" data-i18n="welcome.mapTitle"></h2><ol class="map-list">' + items + '</ol>';
    wrap.appendChild(map);
  });

  /* ---------- Reveal content as it scrolls into view ---------- */

  var REVEAL = ".hero-text > *, .page-head > *, .intro > *, .facts > div, .row, .project, " +
    ".map > .label, .map-list li, .footer-inner > *";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealer = null;

  if (!reduceMotion && "IntersectionObserver" in window) {
    root.classList.add("js-reveal");
    revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  }

  // Hide the elements again and stagger siblings that appear together
  function prepareReveal(scope) {
    if (!revealer) return;
    scope.querySelectorAll(REVEAL).forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(REVEAL); });
      el.style.setProperty("--reveal-delay", Math.min(siblings.indexOf(el), 6) * 80 + "ms");
      el.classList.remove("is-visible");
      revealer.observe(el);
    });
  }

  /* ---------- Language ---------- */

  function pickLanguage() {
    var saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    if (LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : "en";
  }

  function t(key) {
    var dict = CONTENT[lang] || {};
    if (key in dict) return dict[key];
    return key in CONTENT.en ? CONTENT.en[key] : "";
  }

  function applyLanguage(next) {
    lang = next;
    root.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (typeof value !== "string") return;
      if (value.indexOf(TODO_PREFIX) === 0) {
        el.textContent = value.slice(TODO_PREFIX.length).trim();
        el.classList.add("todo");
        el.setAttribute("data-todo-label", t("ui.todo"));
      } else {
        el.textContent = value;
        el.classList.remove("todo");
        el.removeAttribute("data-todo-label");
      }
    });

    document.querySelectorAll("[data-i18n-list]").forEach(function (el) {
      var items = t(el.getAttribute("data-i18n-list"));
      el.textContent = "";
      (Array.isArray(items) ? items : []).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        el.appendChild(li);
      });
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    updateMenuLabel();
    updateTitle();
  }

  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLanguage(btn.getAttribute("data-lang")); });
  });

  /* ---------- Pages (hash routing, works on GitHub Pages) ---------- */

  function updateTitle() {
    var base = t("meta.title");
    document.title = currentPage && currentPage !== "welcome"
      ? t("nav." + currentPage) + " | " + base.split(" | ")[0]
      : base;
  }

  function showPage(id, initial) {
    var changed = id !== currentPage;
    currentPage = id;

    document.querySelectorAll("[data-page]").forEach(function (page) {
      var active = page.getAttribute("data-page") === id;
      page.hidden = !active;
      if (active && changed && !initial) prepareReveal(page);
    });
    document.querySelectorAll("[data-link]").forEach(function (link) {
      if (link.getAttribute("data-link") === id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    updateTitle();
    closeMenu();
    return changed;
  }

  function route(initial) {
    var id = location.hash.replace("#", "") || "welcome";

    if (PAGES.indexOf(id) !== -1) {
      if (showPage(id, initial) && !initial) {
        window.scrollTo(0, 0);
        main.focus({ preventScroll: true });
      }
      return;
    }

    // An anchor inside a page (e.g. #intro) or outside all pages (#contact)
    var target = document.getElementById(id);
    var page = target && target.closest("[data-page]");
    showPage(page ? page.getAttribute("data-page") : (currentPage || "welcome"), initial);
    if (target) target.scrollIntoView();
  }

  window.addEventListener("hashchange", function () { route(false); });

  /* ---------- Menu ---------- */

  function updateMenuLabel() {
    var open = body.classList.contains("nav-open");
    menuBtn.setAttribute("aria-label", t(open ? "ui.close" : "ui.menu"));
  }

  function closeMenu() {
    if (!body.classList.contains("nav-open")) return;
    body.classList.remove("nav-open");
    menuBtn.setAttribute("aria-expanded", "false");
    updateMenuLabel();
  }

  menuBtn.addEventListener("click", function () {
    var open = !body.classList.contains("nav-open");
    body.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    updateMenuLabel();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      closeMenu();
      menuBtn.focus();
    }
  });

  window.addEventListener("scroll", function () {
    topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }, { passive: true });

  /* ---------- Images: show a placeholder until the file exists ---------- */

  document.querySelectorAll(".media img").forEach(function (img) {
    var holder = img.closest(".media");
    function empty() { holder.classList.add("is-empty"); }
    img.addEventListener("error", empty);
    img.addEventListener("load", function () { holder.classList.remove("is-empty"); });
    if (img.complete && img.naturalWidth === 0) empty();
  });

  /* ---------- Start ---------- */

  applyLanguage(lang);
  prepareReveal(document);
  route(true);
})();
