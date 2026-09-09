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

/* ---------- Overlay header: solid once the hero has scrolled away ---------- */
function initOverlayHeader() {
  const header = document.getElementById("site-header");
  if (!header || header.dataset.variant !== "overlay") return;
  const hero = document.getElementById("hero");
  if (!hero) return;

  // Geometry-based and deterministic: solid as soon as the hero's bottom edge
  // passes under the header. One cheap layout read per scroll event.
  const update = () => {
    const solid = hero.getBoundingClientRect().bottom <= header.offsetHeight;
    header.classList.toggle("is-solid", solid);
  };
  const onScroll = update;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal, .line-reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => observer.observe(el));
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

initNav();
initOverlayHeader();
initReveal();
initContactForm();
initTracking();
