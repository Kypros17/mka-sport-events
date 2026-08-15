/* MKA sport Events — shared site scripts (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* ---------- Language switch (English / Russian) ----------
     The Russian text lives in js/i18n.js as a plain string-to-string map, so
     the pages themselves stay clean English HTML. On the first switch we walk
     the document once, remember every original text node and attribute, and
     from then on swapping language is just writing values back. */
  var STORAGE_KEY = "mka-lang";
  var dict = window.MKA_RU || {};
  var TRANSLATABLE_ATTRS = ["alt", "title", "placeholder", "aria-label"];
  var originals = null;   // collected lazily on the first switch to Russian
  var currentLang = "en";

  // Same normalisation the dictionary keys use: collapse whitespace, trim ends
  function key(text) {
    return text.replace(/\s+/g, " ").replace(/^ /, "").replace(/ $/, "");
  }

  function translate(text) {
    var k = key(text);
    return Object.prototype.hasOwnProperty.call(dict, k) ? dict[k] : null;
  }

  function collectOriginals() {
    var items = { nodes: [], attrs: [], title: document.title };

    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          var parent = node.parentNode;
          if (!parent) {
            return NodeFilter.FILTER_REJECT;
          }
          var tag = parent.nodeName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip whitespace-only nodes, the language buttons themselves, and
          // the footer year (script-generated, so it must not be restored)
          if (
            !/\S/.test(node.nodeValue) ||
            parent.classList.contains("lang-btn") ||
            parent.id === "year"
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    var node;
    while ((node = walker.nextNode())) {
      items.nodes.push({ node: node, en: node.nodeValue });
    }

    var all = document.body.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      for (var a = 0; a < TRANSLATABLE_ATTRS.length; a++) {
        var name = TRANSLATABLE_ATTRS[a];
        if (all[i].hasAttribute(name)) {
          items.attrs.push({ el: all[i], name: name, en: all[i].getAttribute(name) });
        }
      }
    }

    return items;
  }

  function applyLanguage(lang) {
    if (lang === "ru" && !originals) {
      originals = collectOriginals();
    }
    currentLang = lang;

    if (originals) {
      var i;
      for (i = 0; i < originals.nodes.length; i++) {
        var item = originals.nodes[i];
        if (lang === "ru") {
          var ru = translate(item.en);
          if (ru !== null) {
            // Keep the original leading/trailing spacing so inline text that is
            // split across elements does not run together
            var lead = /^\s+/.test(item.en) ? " " : "";
            var tail = /\s+$/.test(item.en) ? " " : "";
            item.node.nodeValue = lead + ru + tail;
          }
        } else {
          item.node.nodeValue = item.en;
        }
      }

      for (i = 0; i < originals.attrs.length; i++) {
        var attr = originals.attrs[i];
        if (lang === "ru") {
          var ruAttr = translate(attr.en);
          if (ruAttr !== null) {
            attr.el.setAttribute(attr.name, ruAttr);
          }
        } else {
          attr.el.setAttribute(attr.name, attr.en);
        }
      }

      if (lang === "ru") {
        var ruTitle = translate(originals.title);
        document.title = ruTitle !== null ? ruTitle : originals.title;
      } else {
        document.title = originals.title;
      }
    }

    document.documentElement.lang = lang;

    var buttons = document.querySelectorAll(".lang-btn");
    for (var b = 0; b < buttons.length; b++) {
      var isActive = buttons[b].getAttribute("data-lang") === lang;
      buttons[b].classList.toggle("is-active", isActive);
      buttons[b].setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  // Translate a string used by the scripts themselves (form messages)
  function t(text) {
    if (currentLang !== "ru") {
      return text;
    }
    var ru = translate(text);
    return ru !== null ? ru : text;
  }

  var langButtons = document.querySelectorAll(".lang-btn");
  for (var lb = 0; lb < langButtons.length; lb++) {
    langButtons[lb].addEventListener("click", function () {
      var lang = this.getAttribute("data-lang");
      applyLanguage(lang);
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        // Private browsing with storage disabled: the choice just won't persist
      }
    });
  }

  var savedLang = null;
  try {
    savedLang = window.localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    savedLang = null;
  }
  if (savedLang === "ru") {
    applyLanguage("ru");
  }

  /* ---------- Mobile navigation toggle ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the menu when a link inside it is clicked
    siteNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close the menu when clicking outside the header
    document.addEventListener("click", function (event) {
      if (
        siteNav.classList.contains("open") &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length > 0) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Older browsers: show everything immediately
      revealEls.forEach(function (el) {
        el.classList.add("visible");
      });
    }
  }

  /* ---------- Contact form validation ---------- */
  var contactForm = document.getElementById("contact-form");

  if (contactForm) {
    var setError = function (field, hasError) {
      var group = field.closest(".form-group");
      if (group) {
        group.classList.toggle("has-error", hasError);
      }
      if (hasError) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
      return hasError;
    };

    var validateField = function (field) {
      var value = field.value.trim();

      if (field.hasAttribute("required") && value === "") {
        return setError(field, true);
      }
      if (field.type === "email" && value !== "") {
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return setError(field, !emailOk);
      }
      return setError(field, false);
    };

    var fields = contactForm.querySelectorAll("input, select, textarea");

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        var group = field.closest(".form-group");
        if (group && group.classList.contains("has-error")) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var success = document.getElementById("form-success");
      if (success) {
        success.textContent = "";
        success.classList.remove("visible");
      }

      var hasError = false;
      fields.forEach(function (field) {
        if (validateField(field)) {
          hasError = true;
        }
      });

      if (hasError) {
        var firstError = contactForm.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) {
          firstError.focus();
        }
        return;
      }

      // Static hosting, no backend: compose the enquiry in the visitor's
      // own email app via a mailto link instead of pretending to send it.
      var name = contactForm.querySelector("#name").value.trim();
      var email = contactForm.querySelector("#email").value.trim();
      var phone = contactForm.querySelector("#phone").value.trim();
      var serviceSelect = contactForm.querySelector("#service");
      var serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
      var message = contactForm.querySelector("#message").value.trim();

      var subject = t("Website enquiry") + " — " + serviceText;
      var body =
        t("Name") + ": " + name + "\n" +
        t("Email") + ": " + email + "\n" +
        t("Phone") + ": " + (phone || "-") + "\n" +
        t("Interested in") + ": " + serviceText + "\n\n" +
        message;

      window.location.href =
        "mailto:mka.sport.cyp@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (success) {
        success.textContent =
          t("Thank you") + ", " + name + "! " +
          t("Your email app should now open with your message ready to send. If it does not, please email us directly at") +
          " mka.sport.cyp@gmail.com.";
        success.classList.add("visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();
