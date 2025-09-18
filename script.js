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
  const languageSwitcher = createLanguageSwitcher();

  languageSwitcher.addEventListener("click", async function (e) {
    if (e.target.classList.contains("lang-btn")) {
      const lang = e.target.getAttribute("data-lang");
      const currentLang = contentManager.getCurrentLanguage();

      if (lang !== currentLang) {
        // Show loading state
        e.target.innerHTML = lang === "en" ? "..." : "...";

        try {
          await contentManager.switchLanguage(lang);

          // Reset button text
          e.target.innerHTML = lang === "en" ? "EN" : "عربي";

          // Reinitialize interactive features with new language
          initializeInteractiveFeatures(contentManager);

          // Reinitialize modals with new language
          initializeModals(contentManager);

          // Re-apply AOS if needed
          if (typeof AOS !== "undefined") {
            AOS.refresh();
          }
        } catch (error) {
          console.error("Failed to switch language:", error);
          e.target.innerHTML = lang === "en" ? "EN" : "عربي";
        }
      }
    }
  });
}
// Animation initialization
function initializeAnimations() {
    initializeAOS();
    
    // Reveal sections on scroll
    function revealSections() {
        const reveals = document.querySelectorAll('.section-header, .feature-card, .trust-item');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealSections);
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

// Modal functionality
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

  if (!modal) return;

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

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.querySelector("i").className = icon;
    modalConfirm.textContent = confirmText;
    modalCancel.textContent = cancelText;

    modalInputContainer.style.display = showInput ? "block" : "none";
    modalCancel.style.display = showCancel ? "inline-block" : "none";

    if (showInput) {
      modalInput.placeholder = inputPlaceholder;
      modalInput.value = "";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const confirmHandler = function () {
      const inputValue = showInput ? modalInput.value : null;
      if (onConfirm) onConfirm(inputValue);
      closeModal();
      modalConfirm.removeEventListener("click", confirmHandler);
    };

    const cancelHandler = function () {
      if (onCancel) onCancel();
      closeModal();
      modalCancel.removeEventListener("click", cancelHandler);
    };

    modalConfirm.addEventListener("click", confirmHandler);
    if (showCancel) {
      modalCancel.addEventListener("click", cancelHandler);
    }
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  // Add modal functionality to buttons
  const buttons = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .btn-outline"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const text = this.textContent.trim();

      if (text.includes("Get Early Access") || text.includes("Get Updates")) {
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
      } else if (text.includes("Partner") || text.includes("Partnership")) {
        showModal({
          title: "Partnership Inquiry",
          message:
            "Thank you for your interest in partnering with 79pay. Our business development team will contact you within 24 hours.",
          icon: "fas fa-handshake",
        });
      } else if (text.includes("Learn More")) {
        showModal({
          title: "About 79pay",
          message:
            "We are building the next generation of digital payment solutions. Stay tuned for more updates as we approach our launch in late 2025.",
          icon: "fas fa-info-circle",
        });
      } else if (text.includes("Get in Touch")) {
        showModal({
          title: "Thank You!",
          message:
            "Your message has been received. Our team will get back to you within 24 hours.",
          icon: "fas fa-paper-plane",
        });
      }
    });
  });

  // Make showModal globally available
  window.showModal = showModal;
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
 
// REPLACE your existing initializeHeroVisuals function with this:
function initializeHeroVisuals() {
  console.log("Initializing enhanced hero visuals...");

  // Initialize with your existing ContentManager
  const contentManager = new ContentManager();
  const heroManager = new EnhancedHeroManager(contentManager);

  // Initialize the enhanced hero
  heroManager.init();
}
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");
  const showModal = window.showModal;

  if (!contactForm || !showModal) {
    console.warn("Contact form or showModal function not found, skipping.");
    return;
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[name="name"]').value;
    const email = contactForm.querySelector('input[name="email"]').value;
    const message = contactForm.querySelector('textarea[name="message"]').value;

    if (name && email && message) {
      // Simulate form submission
      showModal({
        title: "Message Sent!",
        message: "Thank you for your message. We will get back to you shortly.",
        icon: "fas fa-paper-plane",
      });

      contactForm.reset();
    } else {
      showModal({
        title: "Incomplete Form",
        message: "Please fill out all required fields.",
        icon: "fas fa-exclamation-triangle",
      });
    }
  });
}
// UPDATE your DOMContentLoaded event listener:
document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded, starting content initialization...");

  const contentManager = new ContentManager();

  try {
    await contentManager.loadContent();

    // Populate everything EXCEPT hero first
    contentManager.populateAllExceptHero();

    // Now initialize the enhanced hero manager with the ContentManager instance
    const heroManager = new EnhancedHeroManager(contentManager); // Pass the manager, not the content
    heroManager.init();

    initializeLanguageSwitcher(contentManager);
    initializeNavigation();
    initializeModals();
    initializeAnimations();
    initializeContactForm();
  } catch (error) {
    console.error("Failed to load content:", error);
    // Fallback if content loading fails
    // const defaultContent = contentManager.getDefaultContent(); // Assuming you have a fallback method
    // const heroManager = new EnhancedHeroManager(defaultContent);
    // heroManager.init();
  }
});
