class EnhancedHeroManager {
  constructor(contentManager) {
    this.contentManager = contentManager; // Store the ContentManager instance
    this.activeService = null;
    this.isLoading = true;
    this.observers = new Map();
    this.autoHideTimeout = null;
  }

  async init() {
    try {
      await this.simulateLoading();

      // Populate hero content first
      this.contentManager.populateHero();
      this.initializeInteractions();
      this.initializeAnimations();
      this.initializeServiceButtons();
      this.hideLoading();
    } catch (error) {
      console.error("Hero initialization failed:", error);
      this.hideLoading();
    }
  }
  updateServiceDisplay(serviceName, display) {
    // Now this will work because this.contentManager exists
    const services = this.contentManager.getServiceData
      ? this.contentManager.getServiceData()
      : this.getDefaultServiceData();

    const service = services[serviceName];

    if (!service) return;

    if (this.activeService === serviceName) {
      this.hideServiceDisplay(display);
      return;
    }

    // Update content
    const icon = display.querySelector(".service-icon");
    const title = display.querySelector(".service-title");
    const desc = display.querySelector(".service-desc");

    if (icon) icon.className = `service-icon ${service.icon}`;
    if (title) title.textContent = service.title;
    if (desc) desc.textContent = service.description;

    // Show display
    display.classList.add("active");
    this.activeService = serviceName;

    // Auto-hide after 5 seconds
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
    this.autoHideTimeout = setTimeout(() => {
      this.hideServiceDisplay(display);
    }, 5000);
  }

  // Add a fallback method for default service data
  getDefaultServiceData() {
    return {
      security: {
        title: "Advanced Security",
        description: "Bank-level encryption and fraud protection",
        icon: "fas fa-shield-alt",
      },
      speed: {
        title: "Lightning Fast",
        description: "Instant transfers and payments",
        icon: "fas fa-bolt",
      },
      support: {
        title: "24/7 Support",
        description: "Round-the-clock customer assistance",
        icon: "fas fa-headset",
      },
    };
  }
  simulateLoading() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  initializeInteractions() {
    // Card hover effects
    const card3d = document.querySelector(".card-3d");
    if (card3d) {
      card3d.addEventListener("mouseenter", () => {
        card3d.style.animationPlayState = "paused";
      });

      card3d.addEventListener("mouseleave", () => {
        card3d.style.animationPlayState = "running";
      });

      // Mouse movement parallax
      card3d.addEventListener("mousemove", (e) => {
        const rect = card3d.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / rect.height) * 20;
        const rotateY = (mouseX / rect.width) * -20;

        card3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) scale(1.05)`;
      });
    }

    // Button interactions
    this.initializeButtons();
  }

  initializeButtons() {
    const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleButtonClick(button);
      });

      // Add ripple effect
      button.addEventListener("click", (e) => {
        this.createRipple(e, button);
      });
    });
  }

  createRipple(event, button) {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

    const style = document.createElement("style");
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  handleButtonClick(button) {
    const buttonText = button.querySelector(".btn-text").textContent;

    if (
      buttonText.includes("Early Access") ||
      buttonText.includes("Get Started")
    ) {
      // Use your existing showModal function if available
      if (typeof window.showModal === "function") {
        window.showModal({
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
                window.showModal({
                  title: "Thank You!",
                  message: `Thank you for your interest! We'll keep you updated at ${email}.`,
                  icon: "fas fa-check-circle",
                });
              }, 300);
            } else {
              window.showModal({
                title: "Invalid Email",
                message: "Please enter a valid email address.",
                icon: "fas fa-exclamation-triangle",
              });
            }
          },
        });
      } else {
        this.showNotification(
          "Coming Soon!",
          "We'll notify you when 79Pay launches. Thank you for your interest!",
          "success"
        );
      }
    } else if (
      buttonText.includes("Demo") ||
      buttonText.includes("Watch") ||
      buttonText.includes("Learn More")
    ) {
      if (typeof window.showModal === "function") {
        window.showModal({
          title: "About 79pay",
          message:
            "We are building the next generation of digital payment solutions. Stay tuned for more updates as we approach our launch in late 2025.",
          icon: "fas fa-info-circle",
        });
      } else {
        this.showNotification(
          "Demo Available Soon!",
          "Our interactive demo will be available shortly. Stay tuned!",
          "info"
        );
      }
    }
  }

  initializeServiceButtons() {
    const serviceButtons = document.querySelectorAll(".service-btn");
    const serviceDisplay = document.getElementById("serviceInfoDisplay");

    if (!serviceDisplay) return;

    serviceButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const service = button.getAttribute("data-service");
        this.updateServiceDisplay(service, serviceDisplay);

        // Add click animation
        button.style.transform = "scale(0.9)";
        setTimeout(() => {
          button.style.transform = "";
        }, 150);
      });

      // Hover effects
      button.addEventListener("mouseenter", () => {
        button.style.animationPlayState = "paused";
      });

      button.addEventListener("mouseleave", () => {
        button.style.animationPlayState = "running";
      });
    });

    // Click outside to hide service display
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".service-btn") &&
        !e.target.closest(".service-info")
      ) {
        this.hideServiceDisplay(serviceDisplay);
      }
    });
  }

  updateServiceDisplay(serviceName, display) {
    console.log('object :>> ', serviceName);
     const services = this.contentManager.getServiceData
      ? this.contentManager.getServiceData()
      : this.getDefaultServiceData();
     console.log("services :>> ", services);

   const service = services.find((s) => s.id === serviceName);

   console.log("service :>> ", service);

    if (!service) return;
      const heroSection = document.querySelector(".hero");
      if (heroSection) {
        heroSection.classList.add("expanded");
      }

    if (this.activeService === serviceName) {
      this.hideServiceDisplay(display);
      return;
    }

    // Update content
    const icon = display.querySelector(".service-icon");
    const title = display.querySelector(".service-title");
    const desc = display.querySelector(".service-desc");

    if (icon) icon.className = `service-icon ${service.icon}`;
    if (title) title.textContent = service.title;
    if (desc) desc.textContent = service.description;

    // Show display
    display.classList.add("active");
    this.activeService = serviceName;

    // Auto-hide after 5 seconds
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
    this.autoHideTimeout = setTimeout(() => {
      this.hideServiceDisplay(display);
    }, 5000);
  }

  hideServiceDisplay(display) {
     const heroSection = document.querySelector(".hero");
     if (heroSection) {
       heroSection.classList.remove("expanded");
     }
    display.classList.remove("active");
    this.activeService = null;
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  initializeAnimations() {
    // Counter animation for stats
    this.animateCounters();

    // Intersection Observer for scroll animations
    this.setupScrollAnimations();

    // Typing animation for title
    setTimeout(() => {
      this.initTypingAnimation();
    }, 1000);
  }
 initTypingAnimation() {
    const gradientText = document.querySelector(".gradient-text");
    if (!gradientText) return;

    const text = gradientText.textContent;
    gradientText.textContent = "";

    let i = 0;
    const typeTimer = setInterval(() => {
      gradientText.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(typeTimer);
        gradientText.style.borderRight = "none";
      }
    }, 100);

    gradientText.style.borderRight = "2px solid #3048ba";
    gradientText.style.animation = "blink 1s infinite";

    const style = document.createElement("style");
    style.textContent = `
            @keyframes blink {
                0%, 50% { border-color: #3048ba; }
                51%, 100% { border-color: transparent; }
            }
        `;
    document.head.appendChild(style);
  }
  animateCounters() {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach((counter) => {
      const target = counter.textContent;
      const isNumber = /^\d+/.test(target);

      if (isNumber) {
        const finalNumber = parseInt(target.replace(/\D/g, ""));
        const suffix = target.replace(/[\d,]/g, "");
        let current = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= finalNumber) {
            counter.textContent = finalNumber.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toLocaleString() + suffix;
          }
        }, 40);
      }
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe hero elements
    const elementsToAnimate = document.querySelectorAll(
      ".hero-text, .hero-visual"
    );
    elementsToAnimate.forEach((el) => observer.observe(el));
  }

 

  showNotification(title, message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

    // Add styles if not already added
    if (!document.querySelector("#notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid var(--primary-blue);
                    z-index: 10000;
                    max-width: 350px;
                    transform: translateX(400px);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-left-color: #10B981;
                }
                
                .notification-info {
                    border-left-color: #3B82F6;
                }
                
                .notification-content h4 {
                    margin: 0 0 8px 0;
                    color: var(--dark-blue);
                    font-size: 1.1rem;
                }
                
                .notification-content p {
                    margin: 0;
                    color: rgba(9, 25, 97, 0.8);
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .notification-close {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: rgba(9, 25, 97, 0.5);
                    transition: color 0.2s;
                }
                
                .notification-close:hover {
                    color: var(--primary-blue);
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100);

    // Auto-hide after 5 seconds
    const autoHide = setTimeout(() => {
      this.hideNotification(notification);
    }, 5000);

    // Close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        clearTimeout(autoHide);
        this.hideNotification(notification);
      });
  }

  hideNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 400);
  }

  hideLoading() {
    const loading = document.getElementById("heroLoading");
    if (loading) {
      loading.classList.add("hide");
      setTimeout(() => {
        loading.style.display = "none";
      }, 500);
    }
    this.isLoading = false;
  }
}

window.EnhancedHeroManager = EnhancedHeroManager;
