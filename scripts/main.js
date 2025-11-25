// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.attachListeners();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  attachListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// ============================================
// MOBILE MENU
// ============================================

class MobileMenu {
  constructor() {
    this.toggle = document.getElementById('mobileMenuToggle');
    this.menu = document.querySelector('.nav-links');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (this.toggle && this.menu) {
      this.toggle.addEventListener('click', () => this.toggleMenu());

      // Close menu when clicking nav links
      const navLinks = this.menu.querySelectorAll('.nav-link, .btn-nav');
      navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
          this.closeMenu();
        }
      });
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
  }

  closeMenu() {
    this.isOpen = false;
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
  }
}

// ============================================
// SMOOTH SCROLLING
// ============================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');

        // Skip if href is just "#"
        if (href === '#') {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.scrollThreshold = 50;
    this.init();
  }

  init() {
    if (this.navbar) {
      window.addEventListener('scroll', () => this.handleScroll());
    }
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold) {
      this.navbar.style.boxShadow = 'var(--shadow-lg)';
    } else {
      this.navbar.style.boxShadow = 'none';
    }
  }
}

// ============================================
// ANIMATE ON SCROLL
// ============================================

class AnimateOnScroll {
  constructor() {
    this.elements = document.querySelectorAll('[data-aos]');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    // Create intersection observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, observerOptions);

    // Observe all elements
    this.elements.forEach(element => {
      this.observer.observe(element);
    });
  }
}

// ============================================
// CALCULATOR FUNCTIONALITY
// ============================================

class Calculator {
  constructor() {
    this.form = document.getElementById('decisionForm');
    this.resultsContainer = document.getElementById('calculatorResults');
    this.init();
  }

  init() {
    if (this.form && this.resultsContainer) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));

      // Add listeners for labor cost calculation
      const partsCost = document.getElementById('partsCost');
      const laborHours = document.getElementById('laborHours');
      const laborRateType = document.getElementById('laborRateType');

      if (partsCost) partsCost.addEventListener('input', () => this.updateRepairCost());
      if (laborHours) laborHours.addEventListener('input', () => this.updateRepairCost());
      if (laborRateType) laborRateType.addEventListener('change', () => this.updateRepairCost());
    }
  }

  updateRepairCost() {
    const partsCost = parseFloat(document.getElementById('partsCost').value) || 0;
    const laborHours = parseFloat(document.getElementById('laborHours').value) || 0;
    const laborRate = parseFloat(document.getElementById('laborRateType').value) || 80;

    const laborCost = laborHours * laborRate;
    const totalRepairCost = partsCost + laborCost;

    const repairCostInput = document.getElementById('repairCost');
    if (repairCostInput) {
      repairCostInput.value = totalRepairCost > 0 ? totalRepairCost.toFixed(2) : '';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // Get labor cost details
    const partsCost = parseFloat(document.getElementById('partsCost').value) || 0;
    const laborHours = parseFloat(document.getElementById('laborHours').value) || 0;
    const laborRateSelect = document.getElementById('laborRateType');
    const laborRate = parseFloat(laborRateSelect.value) || 80;
    const laborRateLabel = laborRateSelect.options[laborRateSelect.selectedIndex].text;
    const laborCost = laborHours * laborRate;

    // Get form values
    const formData = {
      assetType: document.getElementById('assetType').value,
      assetAge: parseFloat(document.getElementById('assetAge').value) || 0,
      originalCost: parseFloat(document.getElementById('originalCost').value) || 0,
      partsCost: partsCost,
      laborHours: laborHours,
      laborRate: laborRate,
      laborRateLabel: laborRateLabel,
      laborCost: laborCost,
      repairCost: parseFloat(document.getElementById('repairCost').value) || 0,
      replaceCost: parseFloat(document.getElementById('replaceCost').value) || 0,
      lifespan: parseFloat(document.getElementById('lifespan').value) || 10,
      energyEfficiency: document.getElementById('energyEfficiency').checked
    };

    // Validate
    if (!formData.assetType || formData.repairCost === 0 || formData.replaceCost === 0) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate recommendation
    const result = this.calculateRecommendation(formData);

    // Display results
    this.displayResults(result);
  }

  calculateRecommendation(data) {
    const {
      assetAge,
      originalCost,
      repairCost,
      replaceCost,
      lifespan,
      energyEfficiency
    } = data;

    // Calculate depreciation
    const depreciation = (assetAge / lifespan) * 100;
    const currentValue = originalCost * (1 - (depreciation / 100));

    // Calculate repair vs replace percentage
    const repairPercentage = (repairCost / replaceCost) * 100;

    // Calculate remaining useful life
    const remainingLife = Math.max(0, lifespan - assetAge);
    const repairLifeExtension = remainingLife * 0.5; // Assume repair extends life by 50%

    // Calculate total cost of ownership (5 years)
    const repairTCO = repairCost + (repairCost * 0.15 * Math.min(5, repairLifeExtension)); // Assume 15% annual maintenance
    const replaceTCO = replaceCost + (replaceCost * 0.05 * 5); // Assume 5% annual maintenance for new

    // Energy efficiency savings
    let energySavings = 0;
    if (energyEfficiency) {
      energySavings = replaceCost * 0.20 * 5; // Assume 20% energy savings over 5 years
    }

    const adjustedReplaceTCO = replaceTCO - energySavings;

    // Determine recommendation
    let recommendation = 'REPAIR';
    let confidence = 0;

    if (repairPercentage > 50) {
      recommendation = 'REPLACE';
      confidence = Math.min(95, 50 + (repairPercentage - 50));
    } else if (depreciation > 80) {
      recommendation = 'REPLACE';
      confidence = Math.min(95, 60 + (depreciation - 80));
    } else if (remainingLife < 2) {
      recommendation = 'REPLACE';
      confidence = 85;
    } else {
      confidence = Math.min(95, 90 - repairPercentage);
    }

    // If energy efficiency is significant, adjust recommendation
    if (energyEfficiency && energySavings > repairCost * 2) {
      recommendation = 'REPLACE';
      confidence = Math.max(confidence, 80);
    }

    return {
      recommendation,
      confidence: Math.round(confidence),
      partsCost: data.partsCost || 0,
      laborHours: data.laborHours || 0,
      laborRate: data.laborRate || 80,
      laborRateLabel: data.laborRateLabel || 'Day Rate - $80/hour',
      laborCost: data.laborCost || 0,
      repairCost,
      replaceCost,
      currentValue: Math.round(currentValue),
      depreciation: Math.round(depreciation),
      remainingLife: Math.round(remainingLife * 10) / 10,
      repairTCO: Math.round(repairTCO),
      replaceTCO: Math.round(adjustedReplaceTCO),
      savingsAmount: Math.round(Math.abs(repairTCO - adjustedReplaceTCO)),
      energySavings: Math.round(energySavings)
    };
  }

  displayResults(result) {
    const isRepair = result.recommendation === 'REPAIR';
    const gradientClass = isRepair ? 'gradient-green' : 'gradient-orange';
    const icon = isRepair ? '🔧' : '✨';

    const html = `
      <div class="results-content" style="width: 100%;">
        <div class="result-header" style="text-align: center; margin-bottom: var(--spacing-6);">
          <div class="result-icon ${gradientClass}" style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-full); margin: 0 auto var(--spacing-4); color: white; font-size: var(--font-size-4xl);">
            ${icon}
          </div>
          <h3 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin-bottom: var(--spacing-2);">
            Recommended: ${result.recommendation}
          </h3>
          <div style="display: inline-block; padding: var(--spacing-2) var(--spacing-4); background: var(--bg-tertiary); border-radius: var(--radius-full); font-size: var(--font-size-sm); color: var(--text-secondary);">
            ${result.confidence}% confidence
          </div>
        </div>

        <div class="result-stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-4); margin-bottom: var(--spacing-6);">
          <div class="stat-box" style="padding: var(--spacing-4); background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); text-align: center;">
            <div style="font-size: var(--font-size-sm); color: var(--text-tertiary); margin-bottom: var(--spacing-2);">Total Repair Cost</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary);">$${result.repairCost.toLocaleString()}</div>
          </div>
          <div class="stat-box" style="padding: var(--spacing-4); background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); text-align: center;">
            <div style="font-size: var(--font-size-sm); color: var(--text-tertiary); margin-bottom: var(--spacing-2);">Replace Cost</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary);">$${result.replaceCost.toLocaleString()}</div>
          </div>
        </div>

        ${result.laborCost > 0 ? `
        <div class="labor-breakdown" style="padding: var(--spacing-4); background: var(--bg-tertiary); border-radius: var(--radius-lg); margin-bottom: var(--spacing-6);">
          <h4 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-secondary); margin-bottom: var(--spacing-3);">Labor Cost Breakdown</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-3);">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-tertiary);">Parts Cost:</span>
              <span style="font-weight: var(--font-weight-medium); color: var(--text-primary);">$${result.partsCost.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-tertiary);">Labor Hours:</span>
              <span style="font-weight: var(--font-weight-medium); color: var(--text-primary);">${result.laborHours} hrs</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-tertiary);">Rate Type:</span>
              <span style="font-weight: var(--font-weight-medium); color: var(--text-primary);">${result.laborRateLabel}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-tertiary);">Labor Cost:</span>
              <span style="font-weight: var(--font-weight-medium); color: var(--text-primary);">$${result.laborCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="result-stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-4); margin-bottom: var(--spacing-8);">
          <div class="stat-box" style="padding: var(--spacing-4); background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); text-align: center;">
            <div style="font-size: var(--font-size-sm); color: var(--text-tertiary); margin-bottom: var(--spacing-2);">5-Year TCO (Repair)</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary);">$${result.repairTCO.toLocaleString()}</div>
          </div>
          <div class="stat-box" style="padding: var(--spacing-4); background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); text-align: center;">
            <div style="font-size: var(--font-size-sm); color: var(--text-tertiary); margin-bottom: var(--spacing-2);">5-Year TCO (Replace)</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary);">$${result.replaceTCO.toLocaleString()}</div>
          </div>
        </div>

        <div class="result-details" style="padding: var(--spacing-6); background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-xl);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--spacing-4);">Analysis Details</h4>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
            <div style="display: flex; justify-content: space-between; padding: var(--spacing-2) 0; border-bottom: 1px solid var(--border-color);">
              <span style="color: var(--text-secondary);">Current Value</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--text-primary);">$${result.currentValue.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: var(--spacing-2) 0; border-bottom: 1px solid var(--border-color);">
              <span style="color: var(--text-secondary);">Depreciation</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--text-primary);">${result.depreciation}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: var(--spacing-2) 0; border-bottom: 1px solid var(--border-color);">
              <span style="color: var(--text-secondary);">Remaining Life</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--text-primary);">${result.remainingLife} years</span>
            </div>
            ${result.energySavings > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: var(--spacing-2) 0; border-bottom: 1px solid var(--border-color);">
              <span style="color: var(--text-secondary);">Energy Savings (5yr)</span>
              <span style="font-weight: var(--font-weight-semibold); color: var(--color-success);">$${result.energySavings.toLocaleString()}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: var(--spacing-2) 0;">
              <span style="color: var(--text-secondary); font-weight: var(--font-weight-semibold);">Potential Savings</span>
              <span style="font-weight: var(--font-weight-bold); color: var(--color-success); font-size: var(--font-size-lg);">$${result.savingsAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: var(--spacing-6); padding: var(--spacing-4); background: ${isRepair ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)'}; border-radius: var(--radius-lg); text-align: center;">
          <p style="color: var(--text-secondary); line-height: var(--line-height-relaxed);">
            ${isRepair
              ? 'Based on the analysis, repairing is the most cost-effective option. The repair cost is reasonable relative to the replacement cost and remaining useful life.'
              : 'Based on the analysis, replacement is recommended. The repair cost is high relative to replacement, or the asset is near end-of-life, making replacement more economical long-term.'
            }
          </p>
        </div>
      </div>
    `;

    this.resultsContainer.innerHTML = html;

    // Smooth scroll to results
    setTimeout(() => {
      this.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    // Animate results
    const resultContent = this.resultsContainer.querySelector('.results-content');
    if (resultContent) {
      resultContent.style.opacity = '0';
      resultContent.style.transform = 'translateY(20px)';

      setTimeout(() => {
        resultContent.style.transition = 'all 0.6s ease-out';
        resultContent.style.opacity = '1';
        resultContent.style.transform = 'translateY(0)';
      }, 50);
    }
  }
}

// ============================================
// PRICING TOGGLE
// ============================================

class PricingToggle {
  constructor() {
    this.toggleBtns = document.querySelectorAll('.toggle-btn');
    this.init();
  }

  init() {
    if (this.toggleBtns.length === 0) return;

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleToggle(btn));
    });
  }

  handleToggle(clickedBtn) {
    const period = clickedBtn.getAttribute('data-period');

    // Update active state
    this.toggleBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');

    // Update pricing (you can implement actual price changes here)
    const prices = document.querySelectorAll('.price-amount');
    prices.forEach(price => {
      const monthlyPrice = parseInt(price.textContent);
      if (period === 'annual') {
        const annualPrice = Math.round(monthlyPrice * 12 * 0.8 / 12);
        price.textContent = annualPrice;
      } else {
        // Reset to monthly prices
        const baseMonthly = {
          '15': 19, // Approximate conversions
          '39': 49,
          '12': 49
        };
        price.textContent = baseMonthly[monthlyPrice] || monthlyPrice;
      }
    });
  }
}

// ============================================
// FORM VALIDATION
// ============================================

class FormValidation {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    });
  }

  validateField(field) {
    let isValid = true;
    const value = field.value.trim();

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    // Number validation
    if (field.type === 'number' && value) {
      const min = field.getAttribute('min');
      const max = field.getAttribute('max');
      const numValue = parseFloat(value);

      if (min !== null && numValue < parseFloat(min)) {
        isValid = false;
      }
      if (max !== null && numValue > parseFloat(max)) {
        isValid = false;
      }
    }

    // Update UI
    if (isValid) {
      field.classList.remove('error');
      field.style.borderColor = '';
    } else {
      field.classList.add('error');
      field.style.borderColor = 'var(--color-error)';
    }

    return isValid;
  }
}

// ============================================
// NEWSLETTER FORM
// ============================================

class NewsletterForm {
  constructor() {
    this.form = document.querySelector('.newsletter-form');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const input = this.form.querySelector('.newsletter-input');
    const email = input.value.trim();

    if (!email || !this.validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Simulate submission
    this.showSuccess();
    input.value = '';
  }

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  showSuccess() {
    const button = this.form.querySelector('.newsletter-button');
    const originalHTML = button.innerHTML;

    button.innerHTML = '✓';
    button.style.background = 'var(--color-success)';

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
  }
}

// ============================================
// COUNTER ANIMATION
// ============================================

class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.animationDuration = 2000;
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          this.animateCounter(entry.target);
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    this.counters.forEach(counter => {
      this.observer.observe(counter);
    });
  }

  animateCounter(element) {
    const text = element.textContent;
    const hasPrefix = text.includes('$');
    const hasSuffix = text.includes('%') || text.includes('M') || text.includes('K') || text.includes('min');

    let suffix = '';
    let prefix = '';
    let numText = text;

    if (hasPrefix) {
      prefix = '$';
      numText = text.replace('$', '');
    }

    if (hasSuffix) {
      const matches = text.match(/[a-zA-Z%]+/g);
      if (matches) {
        suffix = matches[matches.length - 1];
        numText = numText.replace(suffix, '').trim();
      }
    }

    const targetValue = parseFloat(numText);
    if (isNaN(targetValue)) return;

    const startValue = 0;
    const duration = this.animationDuration;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOut;

      let displayValue = currentValue.toFixed(1);
      if (targetValue >= 10) {
        displayValue = Math.round(currentValue);
      }

      element.textContent = prefix + displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = text; // Restore original text
      }
    };

    animate();
  }
}

// ============================================
// PARALLAX EFFECT
// ============================================

class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('.gradient-orb');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const scrolled = window.pageYOffset;

    this.elements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ============================================
// LAZY LOADING
// ============================================

class LazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if (this.images.length === 0) return;

    const observerOptions = {
      threshold: 0,
      rootMargin: '50px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    }, observerOptions);

    this.images.forEach(image => {
      this.observer.observe(image);
    });
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');
    this.observer.unobserve(img);
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  new ThemeManager();
  new MobileMenu();
  new SmoothScroll();
  new NavbarScroll();
  new AnimateOnScroll();
  new Calculator();
  new PricingToggle();
  new FormValidation();
  new NewsletterForm();
  new CounterAnimation();
  new ParallaxEffect();
  new LazyLoad();

  // Add loaded class to body for any CSS animations
  document.body.classList.add('loaded');

  // Console message
  console.log('%c🎨 Repair vs Replace Platform', 'font-size: 24px; font-weight: bold; color: #667eea;');
  console.log('%cBuilt with modern web technologies', 'font-size: 14px; color: #6b7280;');
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      console.log('%cPerformance Metrics:', 'font-weight: bold; color: #667eea;');
      console.log(`Page Load Time: ${pageLoadTime}ms`);
      console.log(`Server Response Time: ${connectTime}ms`);
      console.log(`DOM Render Time: ${renderTime}ms`);
    }, 0);
  });
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
