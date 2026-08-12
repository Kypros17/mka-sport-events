/* MKA sport Events — shared site scripts (vanilla JS, no dependencies) */
(function () {
  "use strict";

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

  /* ---------- Shop category filter ---------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var productCards = document.querySelectorAll(".product-card");

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");

        filterButtons.forEach(function (other) {
          var isActive = other === button;
          other.classList.toggle("active", isActive);
          other.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        productCards.forEach(function (card) {
          var category = card.getAttribute("data-category");
          var show = filter === "all" || category === filter;
          card.classList.toggle("hidden", !show);
        });
      });
    });
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

      var subject = "Website enquiry — " + serviceText;
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + (phone || "-") + "\n" +
        "Interested in: " + serviceText + "\n\n" +
        message;

      window.location.href =
        "mailto:mkasport.cyp@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (success) {
        success.textContent =
          "Thank you, " + name + "! Your email app should now open with your message ready to send. " +
          "If it does not, please email us directly at mkasport.cyp@gmail.com.";
        success.classList.add("visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
})();
