/* MKA sport Events — site behaviour. Vanilla JS, no dependencies.
   Everything is feature-detected so this one bundle serves every page. */

import { initTracking } from "./track.js";

/* ---------- Mobile navigation ---------- */
function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const focusable = () =>
    Array.from(nav.querySelectorAll('a[href], button:not([disabled])')).filter(
      (el) => el.offsetParent !== null
    );

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      const first = focusable()[0];
      if (first) first.focus();
    }
  }

  const isOpen = () => nav.classList.contains("is-open");

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
      return;
    }
    if (event.key === "Tab") {
      // Keep focus inside the open panel (toggle button included)
      const items = [toggle].concat(focusable());
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Reset if the viewport grows past the collapse breakpoint while open
  const mq = window.matchMedia("(min-width: 961px)");
  const onChange = () => {
    if (mq.matches && isOpen()) setOpen(false);
  };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
}

/* ---------- Motion preferences ---------- */
const root = document.documentElement;
const reducedMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
const prefersReducedMotion = () => Boolean(reducedMotionQuery && reducedMotionQuery.matches);

function onMediaChange(query, handler) {
  if (!query) return;
  if (query.addEventListener) query.addEventListener("change", handler);
  else if (query.addListener) query.addListener(handler);
}

/* ---------- Overlay header: solid once the hero has scrolled away ---------- */
function initOverlayHeader() {
  const header = document.getElementById("site-header");
  if (!header || header.dataset.variant !== "overlay") return;
  const hero = document.getElementById("hero");
  if (!hero) return;

  // The first state is applied without transitions (for example after a
  // reload part-way down the page); real scrolling then animates.
  header.classList.add("is-instant");
  let released = false;
  const setSolid = (solid) => {
    header.classList.toggle("is-solid", solid);
    if (released) return;
    released = true;
    requestAnimationFrame(() => requestAnimationFrame(() => header.classList.remove("is-instant")));
  };

  if ("IntersectionObserver" in window) {
    // Solid as soon as the hero's bottom edge passes under the header. An
    // observer whose root is inset by the header height reports exactly that
    // crossing, with no work at all on ordinary scroll events.
    let observer = null;
    let observedHeight = -1;
    const observe = () => {
      const height = header.offsetHeight;
      if (height === observedHeight) return;
      observedHeight = height;
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          setSolid(!entry.isIntersecting && entry.boundingClientRect.bottom <= height);
        },
        { rootMargin: "-" + height + "px 0px 0px 0px", threshold: 0 }
      );
      observer.observe(hero);
    };
    observe();
    let resizeFrame = 0;
    window.addEventListener(
      "resize",
      () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(observe);
      },
      { passive: true }
    );
    return;
  }

  // Fallback: at most one layout read per animation frame
  let frame = 0;
  const update = () => {
    frame = 0;
    setSolid(hero.getBoundingClientRect().bottom <= header.offsetHeight);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}

/* ---------- Reveal on scroll ----------
   Handles the classic .reveal and .line-reveal classes and the opt-in
   [data-motion] primitives defined in global.css. A [data-stagger] container
   is observed as one unit: when it enters, everything inside it reveals with
   an index-based delay (--i). That also covers sideways scrollers, whose
   off-screen items would never intersect the viewport on their own. */
const REVEAL_TARGETS = ".reveal, .line-reveal, [data-motion]";
const MAX_STAGGER_STEPS = 8;

function initReveal() {
  const targets = Array.from(document.querySelectorAll(REVEAL_TARGETS));
  const groups = Array.from(document.querySelectorAll("[data-stagger]"));
  if (!targets.length) {
    root.classList.add("motion-ready");
    return;
  }

  const groupOf = (el) => (el.parentElement ? el.parentElement.closest("[data-stagger]") : null);

  groups.forEach((group) => {
    let index = 0;
    group.querySelectorAll(REVEAL_TARGETS).forEach((el) => {
      if (groupOf(el) === group) el.style.setProperty("--i", String(Math.min(index++, MAX_STAGGER_STEPS)));
    });
  });

  targets.forEach((el) => {
    const delay = Number(el.getAttribute("data-motion-delay"));
    if (delay > 0) el.style.setProperty("--motion-delay", delay + "ms");
  });

  const finish = (el) => {
    if (el.hasAttribute("data-motion")) el.classList.add("is-done");
  };

  const show = (el) => {
    if (el.classList.contains("is-visible")) return;
    if (el.hasAttribute("data-motion")) {
      const done = (event) => {
        if (event.target !== el) return;
        el.removeEventListener("transitionend", done);
        finish(el);
      };
      el.addEventListener("transitionend", done);
    }
    el.classList.add("is-visible");
  };

  const showAll = () => {
    targets.forEach((el) => {
      el.classList.add("is-visible");
      finish(el);
    });
  };

  // Reduced motion, the failsafe having already fired, or no observer
  // support: everything is shown in its final state at once.
  if (root.classList.contains("motion-off") || prefersReducedMotion() || !("IntersectionObserver" in window)) {
    showAll();
    root.classList.add("motion-ready");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        if (el.hasAttribute("data-stagger")) {
          if (el.matches(REVEAL_TARGETS)) show(el);
          el.querySelectorAll(REVEAL_TARGETS).forEach(show);
        } else {
          show(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  groups.filter((group) => !groupOf(group)).forEach((group) => observer.observe(group));
  targets.filter((el) => !groupOf(el) && !el.hasAttribute("data-stagger")).forEach((el) => observer.observe(el));
  root.classList.add("motion-ready");

  // Switching reduced motion on mid-visit reveals everything immediately
  onMediaChange(reducedMotionQuery, () => {
    if (!prefersReducedMotion()) return;
    observer.disconnect();
    showAll();
  });
}

/* ---------- Contact form (mailto handoff + live WhatsApp link) ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const cfg = JSON.parse(form.dataset.config || "{}");
  const success = document.getElementById("form-success");
  const waLink = document.getElementById("form-whatsapp");
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));

  const value = (name) => {
    const el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  };

  const selectedText = (name) => {
    const el = form.elements[name];
    return el && el.selectedIndex > 0 ? el.options[el.selectedIndex].text : "";
  };

  function setError(field, hasError) {
    const group = field.closest(".field");
    if (group) group.classList.toggle("has-error", hasError);
    if (hasError) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return hasError;
  }

  function validate(field) {
    const v = field.value.trim();
    if (field.hasAttribute("required") && v === "") return setError(field, true);
    if (field.type === "email" && v !== "") return setError(field, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    return setError(field, false);
  }

  function summary() {
    const L = cfg.labels || {};
    const lines = [
      [L.name, value("name")],
      [L.organisation, value("organisation")],
      [L.email, value("email")],
      [L.phone, value("phone")],
      [L.sport, value("sport")],
      [L.service, selectedText("service")],
      [L.participants, value("participants")],
      [L.dates, value("dates")],
      [L.duration, value("duration")],
    ]
      .filter((pair) => pair[1])
      .map((pair) => pair[0] + ": " + pair[1]);
    const message = value("message");
    return lines.join("\n") + (message ? "\n\n" + message : "");
  }

  function updateWhatsApp() {
    if (!waLink) return;
    const body = summary();
    const text = cfg.whatsappPrefix + (body ? "\n\n" + body : "");
    waLink.href = "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text);
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => validate(field));
    field.addEventListener("input", () => {
      const group = field.closest(".field");
      if (group && group.classList.contains("has-error")) validate(field);
      updateWhatsApp();
    });
    field.addEventListener("change", updateWhatsApp);
  });
  updateWhatsApp();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (success) {
      success.textContent = "";
      success.classList.remove("is-visible");
    }
    let hasError = false;
    fields.forEach((field) => {
      if (validate(field)) hasError = true;
    });
    if (hasError) {
      const first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }

    // Static hosting, no backend: hand the enquiry to the visitor's email app.
    const subject = cfg.subject + " — " + (selectedText("service") || value("sport") || "");
    const href =
      "mailto:" + cfg.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(summary());

    if (typeof window.mkaTrack === "function") window.mkaTrack("form_submit", { service: value("service") });
    window.location.href = href;

    if (success) {
      success.textContent = cfg.successText + " " + cfg.email + ".";
      success.classList.add("is-visible");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

// Each feature starts on its own, so one failure cannot block the others.
// The reveal system goes first: until it runs, revealed content stays hidden.
[initReveal, initNav, initOverlayHeader, initContactForm, initTracking].forEach((init) => {
  try {
    init();
  } catch (error) {
    if (init === initReveal) root.classList.add("motion-off");
    console.error(error);
  }
});
