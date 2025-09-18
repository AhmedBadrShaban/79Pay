class ContentManager {
  constructor() {
    this.content = null;
    this.isLoaded = false;
    this.currentLanguage = "en";
    this.supportedLanguages = ["en", "ar"];
  }

  async loadContent(lang = "en") {
    const jsonPath = lang === "ar" ? "./content-ar.json" : "./content.json";

    try {
      console.log(`Loading ${lang} content from ${jsonPath}...`);
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status}`);
      }
      this.content = await response.json();
      this.currentLanguage = lang;
      this.isLoaded = true;

      // Apply language attributes to HTML
      document.documentElement.lang = lang;
      if (lang === "ar") {
        document.documentElement.dir = "rtl";
        document.body.classList.add("rtl");
      } else {
        document.documentElement.dir = "ltr";
        document.body.classList.remove("rtl");
      }

      console.log(`${lang} content loaded successfully`);
      return this.content;
    } catch (error) {
      console.error(`Error loading ${lang} content:`, error);

      // Fallback to English if Arabic fails
      if (lang === "ar") {
        console.log("Falling back to English content...");
        return this.loadContent("en");
      }

      throw error;
    }
  }

  async switchLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`Language ${lang} not supported`);
      return;
    }

    if (lang === this.currentLanguage) {
      console.log(`Already using ${lang} language`);
      return;
    }

    try {
      await this.loadContent(lang);
      this.populateAll();
      this.updateLanguageSwitcher();
      console.log(`Switched to ${lang} language`);
    } catch (error) {
      console.error(`Failed to switch to ${lang}:`, error);
    }
  }

  updateLanguageSwitcher() {
    const langButtons = document.querySelectorAll(".lang-btn");
    langButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-lang") === this.currentLanguage) {
        btn.classList.add("active");
      }
    });
  }

  getContent(path) {
    console.log("path :>> ", path);
    if (!this.isLoaded || !this.content) {
      console.warn("Content not loaded yet");
      return null;
    }

    const keys = path.split(".");
    let result = this.content;

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        console.warn(`Content path not found: ${path}`);
        return null;
      }
    }

    return result;
  }

  populateNavigation() {
    const nav = this.getContent("navigation");
    if (!nav) return;

    console.log("Populating navigation in", this.currentLanguage);

    // Update logo
    const logoElement = document.querySelector(".nav-logo h2");
    if (logoElement) logoElement.textContent = nav.logo;

    // Update menu items
    const menuItems = document.querySelectorAll(
      ".nav-menu .nav-item .nav-link:not(.cta-button)"
    );
    menuItems.forEach((item, index) => {
      if (nav.menuItems[index]) {
        item.textContent = nav.menuItems[index].text;
        item.href = nav.menuItems[index].href;
      }
    });

    // Update CTA button
    const ctaButton = document.querySelector(".nav-menu .cta-button");
    if (ctaButton) ctaButton.textContent = nav.ctaButton;
  }

  populateHero() {
    const hero = this.getContent("hero");
    if (!hero) {
      console.error("Hero content not found");
      return;
    }

    console.log("Populating hero content in", this.currentLanguage, " ", hero);

    // Update title
    const gradientText = document.querySelector(".hero-title .gradient-text");
    const mainTitleSpan = document.querySelector(
      ".hero-title .hero-title-main"
    );

    if (gradientText) {
      gradientText.textContent = hero.gradientText;
    }

    if (mainTitleSpan) {
      mainTitleSpan.textContent = hero.titleMain;
    }

    // Update subtitle
    const subtitle = document.querySelector(".hero-subtitle");
    if (subtitle) {
      subtitle.textContent = hero.subtitle;
    }

    // Update buttons
    const primaryBtn = document.querySelector(".hero-buttons .btn-primary");
    const secondaryBtn = document.querySelector(".hero-buttons .btn-secondary");

    if (primaryBtn) {
      const icon = primaryBtn.querySelector("i");
      const text = primaryBtn.querySelector(".btn-text");
      if (icon) icon.className = hero.primaryButton.icon;
      if (text) text.textContent = hero.primaryButton.text;
    }

    if (secondaryBtn) {
      const icon = secondaryBtn.querySelector("i");
      const text = secondaryBtn.querySelector(".btn-text");
      if (icon) icon.className = hero.secondaryButton.icon;
      if (text) text.textContent = hero.secondaryButton.text;
    }

    // Update stats
    const stats = document.querySelectorAll(".hero-stats .stat");
    stats.forEach((stat, index) => {
      if (hero.stats[index]) {
        const number = stat.querySelector(".stat-number");
        const label = stat.querySelector(".stat-label");
        if (number) number.textContent = hero.stats[index].number;
        if (label) label.textContent = hero.stats[index].label;
      }
    });

    // Update card
    const cardNumber = document.querySelector(".card-number");
    const cardName = document.querySelector(".card-name");
    const cardExpiry = document.querySelector(".card-expiry");
    const validThru = document.querySelector(".valid-thru");

    if (cardNumber) cardNumber.textContent = hero.card.number;
    if (cardName) cardName.textContent = hero.card.name;
    if (cardExpiry) cardExpiry.textContent = hero.card.expiry;
    if (validThru) {
      validThru.textContent =
        this.currentLanguage === "ar" ? "صالح حتى" : "VALID THRU";
    }

    // Update service tooltips
    const serviceButtons = document.querySelectorAll(".corner-icon-btn");
    serviceButtons.forEach((button) => {
      const service = button.getAttribute("data-service");
      if (hero.services[service]) {
        button.title = hero.services[service].tooltip;
      }
    });

    // Update default service info
    const serviceInfo = document.getElementById("service-info-display");
    if (serviceInfo && hero.serviceInfo.default) {
      const defaultInfo = hero.serviceInfo.default;
      const icon = serviceInfo.querySelector("i");
      const title = serviceInfo.querySelector(".service-title");
      const desc = serviceInfo.querySelector(".service-desc");

      if (icon) icon.className = defaultInfo.icon;
      if (title) title.textContent = defaultInfo.title;
      if (desc) desc.textContent = defaultInfo.description;
    }
  }

  populateFeatures() {
    const features = this.getContent("features");
    if (!features) return;

    console.log("Populating features in", this.currentLanguage);

    // Update header
    const title = document.querySelector("#features .section-title");
    const subtitle = document.querySelector("#features .section-subtitle");

    if (title) title.textContent = features.header.title;
    if (subtitle) subtitle.textContent = features.header.subtitle;

    // Update feature cards
    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card, index) => {
      if (features.items[index]) {
        const item = features.items[index];
        const icon = card.querySelector(".feature-icon i");
        const title = card.querySelector(".feature-title");
        const description = card.querySelector(".feature-description");

        if (icon) icon.className = item.icon;
        if (title) title.textContent = item.title;
        if (description) description.textContent = item.description;
      }
    });
  }

  populateAbout() {
    const about = this.getContent("about");
    if (!about) return;

    console.log("Populating about in", this.currentLanguage);

    // Update title
    const title = document.querySelector("#about .section-title");
    if (title) title.textContent = about.title;

    // Update descriptions
    const descriptions = document.querySelectorAll("#about .about-description");
    descriptions.forEach((desc, index) => {
      if (about.descriptions[index]) {
        desc.textContent = about.descriptions[index];
      }
    });

    // Update features
    const featureElements = document.querySelectorAll(".about-feature");
    featureElements.forEach((feature, index) => {
      if (about.features[index]) {
        const item = about.features[index];
        const icon = feature.querySelector("i");
        const text = feature.querySelector("span");

        if (icon) icon.className = item.icon;
        if (text) text.textContent = item.text;
      }
    });

    // Update button
    const button = document.querySelector("#about .btn-primary");
    if (button && about.button) {
      const icon = button.querySelector("i");
      const text = button.querySelector(".btn-text");
      if (icon) icon.className = about.button.icon;
      if (text) text.textContent = about.button.text;
    }

    // Update visual
    const visualTitle = document.querySelector(".visual-title");
    const visualStatus = document.querySelector(".visual-status");

    if (visualTitle) visualTitle.textContent = about.visual.title;
    if (visualStatus) visualStatus.textContent = about.visual.status;

    // Update metrics
    const metrics = document.querySelectorAll(".metric");
    metrics.forEach((metric, index) => {
      if (about.visual.metrics[index]) {
        const item = about.visual.metrics[index];
        const value = metric.querySelector(".metric-value");
        const label = metric.querySelector(".metric-label");

        if (value) value.textContent = item.value;
        if (label) label.textContent = item.label;
      }
    });
  }

  populatePartners() {
    const partners = this.getContent("partners");
    if (!partners) return;

    console.log("Populating partners in", this.currentLanguage);

    // Update header
    const title = document.querySelector("#partners .section-title");
    const subtitle = document.querySelector("#partners .section-subtitle");

    if (title) title.textContent = partners.header.title;
    if (subtitle) subtitle.textContent = partners.header.subtitle;

    // Update trust items
    const trustItems = document.querySelectorAll(".trust-item");
    trustItems.forEach((item, index) => {
      if (partners.trustItems[index]) {
        const data = partners.trustItems[index];
        const icon = item.querySelector(".trust-icon i");
        const title = item.querySelector(".trust-title");
        const description = item.querySelector(".trust-description");

        if (icon) icon.className = data.icon;
        if (title) title.textContent = data.title;
        if (description) description.textContent = data.description;
      }
    });

    // Update badges
    const badges = document.querySelectorAll(".badge");
    badges.forEach((badge, index) => {
      if (partners.badges[index]) {
        const data = partners.badges[index];
        const icon = badge.querySelector("i");
        const text = badge.querySelector("span");

        if (icon) icon.className = data.icon;
        if (text) text.innerHTML = data.text;
      }
    });
  }

  populateCTA() {
    const cta = this.getContent("cta");
    if (!cta) return;

    console.log("Populating CTA in", this.currentLanguage);

    const title = document.querySelector(".cta-title");
    const subtitle = document.querySelector(".cta-subtitle");

    if (title) title.textContent = cta.title;
    if (subtitle) subtitle.textContent = cta.subtitle;

    // Update buttons
    const primaryBtn = document.querySelector(".cta-buttons .btn-primary");
    const secondaryBtn = document.querySelector(".cta-buttons .btn-outline");

    if (primaryBtn) {
      const icon = primaryBtn.querySelector("i");
      const text = primaryBtn.querySelector(".btn-text");
      if (icon) icon.className = cta.buttons.primary.icon;
      if (text) text.textContent = cta.buttons.primary.text;
    }
    if (secondaryBtn) {
      const icon = secondaryBtn.querySelector("i");
      const text = secondaryBtn.querySelector(".btn-text");
      if (icon) icon.className = cta.buttons.secondary.icon;
      if (text) text.textContent = cta.buttons.secondary.text;
    }
  }

  populateContact() {
    const contact = this.getContent("contact");
    if (!contact) return;

    console.log("Populating contact in", this.currentLanguage);

    // Update header
    const title = document.querySelector("#contact .section-title");
    const subtitle = document.querySelector("#contact .section-subtitle");

    if (title) title.textContent = contact.header.title;
    if (subtitle) subtitle.textContent = contact.header.subtitle;

    // Update contact info
    const contactItems = document.querySelectorAll(".contact-item");
    contactItems.forEach((item, index) => {
      if (contact.info[index]) {
        const data = contact.info[index];
        const icon = item.querySelector(".contact-icon i");
        const title = item.querySelector(".contact-details h3");
        const value = item.querySelector(".contact-details p");

        if (icon) icon.className = data.icon;
        if (title) title.textContent = data.title;
        if (value) value.textContent = data.value;
      }
    });

    // Update form placeholders
    const formInputs = document.querySelectorAll(".form-input");
    formInputs.forEach((input, index) => {
      if (contact.form.fields[index]) {
        input.placeholder = contact.form.fields[index].placeholder;
        input.required = contact.form.fields[index].required;
      }
    });

    // Update form button
    const formButton = document.querySelector(".contact .btn-primary");
    if (formButton && contact.form.button) {
      const icon = formButton.querySelector("i");
      const text = formButton.querySelector(".btn-text");
      if (icon) icon.className = contact.form.button.icon;
      if (text) text.textContent = contact.form.button.text;
    }
  }

  populateFooter() {
    const footer = this.getContent("footer");
    if (!footer) return;

    console.log("Populating footer in", this.currentLanguage);

    // Update logo and description
    const description = document.querySelector(".footer-description");

    if (description) description.textContent = footer.description;

    // Update social links
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link, index) => {
      if (footer.social[index]) {
        const data = footer.social[index];
        const icon = link.querySelector("i");

        if (icon) icon.className = data.icon;
        link.href = data.href;
      }
    });

    // Update contact info
    const footerContactPs = document.querySelectorAll(".footer-contact p");
    footerContactPs.forEach((contactP, index) => {
      if (footer.contact[index]) {
        const data = footer.contact[index];
        const icon = contactP.querySelector("i");
        const text = contactP.querySelector(".contact-text");

        if (icon) icon.className = data.icon;
        if (text) text.textContent = data.text;
      }
    });

    // Update footer sections
    const footerSections = document.querySelectorAll(".footer-section");
    footerSections.forEach((section, index) => {
      if (index > 0 && footer.sections[index - 1]) {
        const data = footer.sections[index - 1];
        const title = section.querySelector(".footer-title");
        const links = section.querySelectorAll(".footer-links li a");

        if (title) title.textContent = data.title;
        links.forEach((link, linkIndex) => {
          if (data.links[linkIndex]) {
            link.textContent = data.links[linkIndex].text;
            link.href = data.links[linkIndex].href;
          }
        });
      }
    });

    // Update footer bottom
    const copyright = document.querySelector(".footer-bottom .copyright");
    const license = document.querySelector(".footer-bottom .license");

    if (copyright) copyright.textContent = footer.bottom.copyright;
    if (license) license.textContent = footer.bottom.license;
  }

  populateMetadata() {
    const meta = this.getContent("meta");
    if (!meta) return;

    console.log("Populating metadata in", this.currentLanguage);

    document.title = meta.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = meta.description;
  }

  populateAll() {
    if (!this.isLoaded) {
      console.warn("Content not loaded yet. Call loadContent() first.");
      return;
    }

    console.log("Populating all content in", this.currentLanguage);

    this.populateMetadata();
    this.populateNavigation();
    this.populateHero();
    this.populateFeatures();
    this.populateAbout();
    this.populatePartners();
    this.populateCTA();
    this.populateContact();
    this.populateFooter();
  }

  getServiceData() {
    return this.getContent("hero.services");
  }

  getServiceInfo() {
    return this.getContent("hero.serviceInfo.default");
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }
  populateAllExceptHero() {
    if (!this.isLoaded) {
      console.warn("Content not loaded yet. Call loadContent() first.");
      return;
    }

    console.log("Populating all content except hero in", this.currentLanguage);

    this.populateMetadata();
    this.populateNavigation();
    // Skip this.populateHero(); - let EnhancedHeroManager handle it
    this.populateFeatures();
    this.populateAbout();
    this.populatePartners();
    this.populateCTA();
    this.populateContact();
    this.populateFooter();
  }
}
// Export for use in other modules
window.ContentManager = ContentManager;
 