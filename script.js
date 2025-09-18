// Initialize AOS (Animate On Scroll) with fallback
function initializeAOS() {
  try {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        offset: 100,
      });
    } else {
      document.body.classList.add("no-aos");
      console.warn("AOS library not loaded, using fallback styles");
    }
  } catch (error) {
    document.body.classList.add("no-aos");
    console.warn("AOS initialization failed, using fallback styles");
  }
}

// Language Switcher functionality
function createLanguageSwitcher() {
  const languageSwitcher = document.createElement("div");
  languageSwitcher.className = "language-switcher";
  languageSwitcher.innerHTML = `
        <button class="lang-btn active" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="ar">عربي</button>
    `;

  document.body.appendChild(languageSwitcher);
  return languageSwitcher;
}

function initializeLanguageSwitcher(contentManager) {
  const languageSwitcher = document.querySelector(".language-switcher");

  if (!languageSwitcher) {
    console.warn("Language switcher not found in DOM");
    return;
  }

  languageSwitcher.addEventListener("click", async function (e) {
    if (e.target.classList.contains("lang-btn")) {
      const lang = e.target.getAttribute("data-lang");
      const currentLang = contentManager.getCurrentLanguage();

      if (lang !== currentLang) {
        // Show loading state
        e.target.innerHTML = "...";

        try {
          await contentManager.switchLanguage(lang);

          // Reset button text
          e.target.innerHTML = lang === "en" ? "EN" : "عربي";

          // Update active states
          updateLanguageSwitcherStates(lang);

          // Reinitialize interactive features with new language
          initializeInteractiveFeatures(contentManager);

          // Reinitialize modals with new language
          initializeModals(contentManager);

          // Re-apply AOS if needed
          if (typeof AOS !== "undefined") {
            AOS.refresh();
          }

          console.log(`Language switched to ${lang}`);
        } catch (error) {
          console.error("Failed to switch language:", error);
          e.target.innerHTML = lang === "en" ? "EN" : "عربي";
        }
      }
    }
  });
}

function updateLanguageSwitcherStates(currentLang) {
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-lang") === currentLang) {
      btn.classList.add("active");
    }
  });
}

// Animation initialization
function initializeAnimations() {
  initializeAOS();

  // Reveal sections on scroll
  function revealSections() {
    const reveals = document.querySelectorAll(
      ".section-header, .feature-card, .trust-item"
    );

    reveals.forEach((element) => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealSections);
  revealSections(); // Run once on load
}

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Active link highlighting
  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Modal functionality - UNCOMMENTED and IMPROVED
function initializeModals() {
  const modal = document.getElementById("professionalModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");
  const modalClose = document.getElementById("modalClose");
  const modalConfirm = document.getElementById("modalConfirm");
  const modalCancel = document.getElementById("modalCancel");
  const modalInputContainer = document.getElementById("modalInputContainer");
  const modalInput = document.getElementById("modalInput");

  if (
    !modal ||
    !modalTitle ||
    !modalMessage ||
    !modalIcon ||
    !modalClose ||
    !modalConfirm ||
    !modalCancel
  ) {
    console.warn("Modal elements not found - skipping modal initialization");
    return;
  }

  function showModal(options = {}) {
    const {
      title = "Success",
      message = "Operation completed successfully!",
      icon = "fas fa-check-circle",
      showInput = false,
      inputPlaceholder = "Enter your email",
      confirmText = "OK",
      cancelText = "Cancel",
      showCancel = false,
      onConfirm = null,
      onCancel = null,
    } = options;

    // Update modal content
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.querySelector("i").className = icon;
    modalConfirm.textContent = confirmText;
    modalCancel.textContent = cancelText;

    // Show/hide elements
    if (modalInputContainer) {
      modalInputContainer.style.display = showInput ? "block" : "none";
    }
    modalCancel.style.display = showCancel ? "inline-block" : "none";

    if (showInput && modalInput) {
      modalInput.placeholder = inputPlaceholder;
      modalInput.value = "";
    }

    // Show modal with proper display and overflow handling
    modal.style.display = "flex";
    modal.classList.add("active");

    // Only hide overflow if modal is actually visible
    setTimeout(() => {
      if (modal.style.display === "flex") {
        document.body.style.overflow = "hidden";
      }
    }, 50);

    // Clean up any existing event listeners properly
    const newModalConfirm = modalConfirm.cloneNode(true);
    const newModalCancel = modalCancel.cloneNode(true);

    // Check if parent exists before replacing
    if (modalConfirm.parentNode) {
      modalConfirm.parentNode.replaceChild(newModalConfirm, modalConfirm);
    }
    if (modalCancel.parentNode) {
      modalCancel.parentNode.replaceChild(newModalCancel, modalCancel);
    }

    // Add new event listeners
    newModalConfirm.addEventListener("click", function () {
      const inputValue = showInput && modalInput ? modalInput.value : null;
      if (onConfirm) onConfirm(inputValue);
      closeModal();
    });

    if (showCancel) {
      newModalCancel.addEventListener("click", function () {
        if (onCancel) onCancel();
        closeModal();
      });
    }

    // Focus input if shown
    if (showInput && modalInput) {
      setTimeout(() => modalInput.focus(), 100);
    }
  }

  function closeModal() {
    // Always restore scroll when closing
    document.body.style.overflow = "";
    modal.classList.remove("active");

    // Hide modal after animation
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }

  // Ensure scroll is restored if modal close button is clicked
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Ensure scroll is restored if clicking outside modal
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Ensure scroll is restored on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "flex") {
      closeModal();
    }
  });

  // Add modal functionality to buttons with better error handling
  // Exclude form submit buttons from generic button handling
  const buttons = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .btn-outline"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Only prevent default for non-form buttons
      if (button.type !== "submit" && !button.closest("form")) {
        e.preventDefault();

        // Add small delay to prevent immediate freezing
        setTimeout(() => {
          const text = this.textContent.trim();

          try {
            if (
              text.includes("Get Early Access") ||
              text.includes("Get Updates")
            ) {
              showModal({
                title: "Join Our Early Access Program",
                message:
                  "Be the first to know when 79pay launches. Enter your email to get exclusive updates.",
                icon: "fas fa-envelope",
                showInput: true,
                inputPlaceholder: "Enter your email address",
                confirmText: "Subscribe",
                showCancel: true,
                onConfirm: function (email) {
                  if (email && email.includes("@")) {
                    setTimeout(() => {
                      showModal({
                        title: "Thank You!",
                        message: `Thank you for your interest! We'll keep you updated at ${email}.`,
                        icon: "fas fa-check-circle",
                      });
                    }, 300);
                  } else {
                    showModal({
                      title: "Invalid Email",
                      message: "Please enter a valid email address.",
                      icon: "fas fa-exclamation-triangle",
                    });
                  }
                },
              });
            } else if (
              text.includes("Partner") ||
              text.includes("Partnership")
            ) {
              showModal({
                title: "Partnership Inquiry",
                message:
                  "Thank you for your interest in partnering with 79pay. Our business development team will contact you within 24 hours.",
                icon: "fas fa-handshake",
              });
            } else if (
              text.includes("Learn More") ||
              text.includes("Watch Demo")
            ) {
              showModal({
                title: "About 79pay",
                message:
                  "We are building the next generation of digital payment solutions. Stay tuned for more updates as we approach our launch in late 2025.",
                icon: "fas fa-info-circle",
              });
            } else {
              // Fallback modal for any unhandled buttons
              showModal({
                title: "Coming Soon",
                message:
                  "This feature will be available when 79pay launches in late 2025. Thank you for your interest!",
                icon: "fas fa-info-circle",
              });
            }
          } catch (error) {
            console.error("Modal error:", error);
            // Ensure overflow is restored even if there's an error
            document.body.style.overflow = "";
          }
        }, 100);
      }
    });
  });

  // Make showModal globally available
  window.showModal = showModal;
  window.closeModal = closeModal;
}

// Error handlers for scroll restoration
window.addEventListener("error", function () {
  document.body.style.overflow = "";
});

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    const modal = document.getElementById("professionalModal");
    if (!modal || modal.style.display !== "flex") {
      document.body.style.overflow = "";
    }
  }
});

function initializeHeroVisuals() {
  console.log("Initializing enhanced hero visuals...");

  // Initialize with your existing ContentManager
  const contentManager = new ContentManager();
  const heroManager = new EnhancedHeroManager(contentManager);

  // Initialize the enhanced hero
  heroManager.init();
}

// UPDATED Contact Form Function with Modal Integration
function initializeContactForm() {
  console.log("=== Contact Form Initialization ===");

  setTimeout(() => {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
      console.error("Contact form not found in DOM");
      return;
    }

    console.log("Contact form found, initializing...");

    // Remove any existing event listeners to prevent duplicates
    const newForm = contactForm.cloneNode(true);
    if (contactForm.parentNode) {
      contactForm.parentNode.replaceChild(newForm, contactForm);
    }

    // Add click event listener to submit button
    newForm.elements[4].addEventListener("click", async function (e) {
      console.log("Form submit button clicked");
      e.preventDefault();
      e.stopPropagation();

      try {
        // Get form data
        const formData = new FormData(newForm);
        const name = formData.get("name")?.trim();
        const email = formData.get("email")?.trim();
        const company = formData.get("company")?.trim();
        const message = formData.get("message")?.trim();

        console.log("Form data:", { name, email, company, message });

        // Basic validation - USING MODAL instead of alert
        if (!name || !email || !message) {
          console.log("Validation failed: missing required fields");

          // Use modal if available, otherwise fallback to alert
          if (typeof window.showModal === "function") {
            showModal({
              title: "Incomplete Form",
              message:
                "Please fill out all required fields (Name, Email, and Message).",
              icon: "fas fa-exclamation-triangle",
              confirmText: "OK",
            });
          } else {
            alert(
              "Please fill out all required fields (Name, Email, and Message)."
            );
          }
          return;
        }

        // Email validation - USING MODAL instead of alert
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          console.log("Email validation failed");

          if (typeof window.showModal === "function") {
            showModal({
              title: "Invalid Email",
              message: "Please enter a valid email address.",
              icon: "fas fa-exclamation-triangle",
              confirmText: "OK",
            });
          } else {
            alert("Please enter a valid email address.");
          }
          return;
        }

        // Get submit button elements
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const btnTextElement = submitBtn.querySelector(".btn-text");
        const btnIconElement = submitBtn.querySelector("i");

        // Store original values
        const originalBtnText = btnTextElement
          ? btnTextElement.textContent
          : "Send Message";
        const originalBtnIcon = btnIconElement
          ? btnIconElement.className
          : "fas fa-paper-plane";

        // Set loading state
        submitBtn.disabled = true;
        if (btnIconElement) btnIconElement.className = "fas fa-spinner fa-spin";
        if (btnTextElement) btnTextElement.textContent = "Sending...";

        try {
          console.log("Attempting to send email...");
          await sendWithEmailJS(name, email, company, message);
          console.log("Email sent successfully!");

          // SUCCESS - USING MODAL instead of alert
          if (typeof window.showModal === "function") {
            showModal({
              title: "Message Sent!",
              message:
                "Thank you for your message! We'll get back to you within 24 hours.",
              icon: "fas fa-check-circle",
              confirmText: "Great!",
            });
          } else {
            alert(
              "Message sent successfully! We'll get back to you within 24 hours."
            );
          }

          // Reset form
          newForm.reset();
        } catch (error) {
          console.error("Form submission error:", error);

          // ERROR - USING MODAL instead of alert
          if (typeof window.showModal === "function") {
            showModal({
              title: "Submission Failed",
              message:
                "There was an error sending your message. Please try again or contact us directly at info@79-pay.com",
              icon: "fas fa-exclamation-circle",
              confirmText: "OK",
            });
          } else {
            alert(
              "There was an error sending your message. Please try again or contact us directly at info@79-pay.com"
            );
          }
        } finally {
          // Restore button state
          submitBtn.disabled = false;
          if (btnIconElement) btnIconElement.className = originalBtnIcon;
          if (btnTextElement) btnTextElement.textContent = originalBtnText;
        }
      } catch (error) {
        console.error("Critical error in form handler:", error);

        // CRITICAL ERROR - USING MODAL instead of alert
        if (typeof window.showModal === "function") {
          showModal({
            title: "Unexpected Error",
            message: "An unexpected error occurred. Please try again.",
            icon: "fas fa-exclamation-circle",
            confirmText: "OK",
          });
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      }
    });

    console.log("Contact form event listener attached successfully");
  }, 500);
}

// EmailJS function (unchanged from your working version)
async function sendWithEmailJS(name, email, company, message) {
  console.log("sendWithEmailJS called with:", {
    name,
    email,
    company,
    message,
  });

  // Check if EmailJS is loaded
  if (typeof emailjs === "undefined") {
    console.error("EmailJS library not loaded");
    throw new Error("EmailJS library not loaded");
  }

  // EmailJS configuration
  const SERVICE_ID = "service_ttx68fu";
  const TEMPLATE_ID = "template_rc7t5oc";
  const PUBLIC_KEY = "u0ik6q7X4OyqTHZ-B";

  const templateParams = {
    from_name: name,
    from_email: email,
    company: company || "Not specified",
    message: message,
    to_email: "ahmedbadrr417@gmail.com",
  };

  console.log("Sending email with params:", templateParams);

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("EmailJS success:", result);
    return result;
  } catch (error) {
    console.error("EmailJS error:", error);
    throw error;
  }
}

// Main initialization
document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded, starting content initialization...");

  try {
    // Initialize modals FIRST
    initializeModals();

    // Then initialize contact form (which depends on modals)
    initializeContactForm();

    // Initialize content manager if available
    if (typeof ContentManager !== "undefined") {
      const contentManager = new ContentManager();
      await contentManager.loadContent();
      contentManager.populateAllExceptHero();

      if (typeof EnhancedHeroManager !== "undefined") {
        const heroManager = new EnhancedHeroManager(contentManager);
        heroManager.init();
      }

      initializeLanguageSwitcher(contentManager);
    }

    // Initialize other components
    initializeNavigation();
    initializeAnimations();
  } catch (error) {
    console.error("Failed to initialize application:", error);

    // Fallback initialization without content manager
    initializeModals();
    initializeContactForm();
    initializeNavigation();
    initializeAnimations();
  }
});
