// ========================================
// GLOBAL CONFIGURATION
// ========================================

const CONFIG = {
    airtableApiUrl: '/api/submit-form', // Vercel serverless function endpoint
    source: 'thepathisyou_audiobook'
};

// ========================================
// DOM ELEMENTS
// ========================================

const form = document.getElementById('audiobook-form');
const submitBtn = document.getElementById('submit-btn');
const successMessage = document.getElementById('success-message');
const stickyCta = document.getElementById('sticky-cta');

// Form inputs
const emailInput = document.getElementById('email');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');

// Error messages
const emailError = document.getElementById('email-error');
const firstNameError = document.getElementById('firstName-error');

// ========================================
// VALIDATION FUNCTIONS
// ========================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateRequired(value) {
    return value.trim().length > 0;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function validateForm() {
    let isValid = true;

    // Validate email
    const emailValue = emailInput.value.trim();
    if (!validateRequired(emailValue)) {
        showError(emailInput, emailError, 'Email address is required');
        isValid = false;
    } else if (!validateEmail(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError(emailInput, emailError);
    }

    // Validate first name
    const firstNameValue = firstNameInput.value.trim();
    if (!validateRequired(firstNameValue)) {
        showError(firstNameInput, firstNameError, 'First name is required');
        isValid = false;
    } else if (firstNameValue.length < 2) {
        showError(firstNameInput, firstNameError, 'First name must be at least 2 characters');
        isValid = false;
    } else {
        hideError(firstNameInput, firstNameError);
    }

    return isValid;
}

// Real-time validation
emailInput.addEventListener('blur', () => {
    const emailValue = emailInput.value.trim();
    if (emailValue && !validateEmail(emailValue)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
    } else if (emailValue) {
        hideError(emailInput, emailError);
    }
});

firstNameInput.addEventListener('blur', () => {
    const firstNameValue = firstNameInput.value.trim();
    if (firstNameValue && firstNameValue.length < 2) {
        showError(firstNameInput, firstNameError, 'First name must be at least 2 characters');
    } else if (firstNameValue) {
        hideError(firstNameInput, firstNameError);
    }
});

// Clear errors on input
emailInput.addEventListener('input', () => hideError(emailInput, emailError));
firstNameInput.addEventListener('input', () => hideError(firstNameInput, firstNameError));

// ========================================
// FORM SUBMISSION
// ========================================

async function submitToAirtable(formData) {
    try {
        const response = await fetch(CONFIG.airtableApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Submission error:', error);
        return { success: false, error: error.message };
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Prepare form data
    const formData = {
        email: emailInput.value.trim(),
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim() || '', // Optional field
        source: CONFIG.source,
        timestamp: new Date().toISOString(),
        website: document.getElementById('website').value // Honeypot field
    };

    // Submit to Airtable
    const result = await submitToAirtable(formData);

    if (result.success) {
        // Hide form and show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Track conversion (optional: add Google Analytics/Meta Pixel)
        if (window.gtag) {
            window.gtag('event', 'conversion', {
                'event_category': 'Lead',
                'event_label': 'Audiobook Download',
                'value': 1
            });
        }

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // Show error message
        alert(`There was an error submitting your request: ${result.error}\n\nPlease try again or contact support.`);

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// ========================================
// STICKY CTA BEHAVIOR
// ========================================

function handleStickyCtaVisibility() {
    const downloadSection = document.getElementById('download');
    const downloadRect = downloadSection.getBoundingClientRect();
    const isDownloadVisible = downloadRect.top < window.innerHeight && downloadRect.bottom > 0;

    if (window.scrollY > window.innerHeight && !isDownloadVisible && window.innerWidth <= 768) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }
}

// Throttle scroll event for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        handleStickyCtaVisibility();
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// PARALLAX EFFECT (OPTIONAL)
// ========================================

const hero = document.getElementById('hero');

function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (hero && scrolled <= window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
}

// Throttle parallax for performance
let parallaxTimeout;
window.addEventListener('scroll', () => {
    if (parallaxTimeout) {
        window.cancelAnimationFrame(parallaxTimeout);
    }
    parallaxTimeout = window.requestAnimationFrame(() => {
        handleParallax();
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe benefit cards and testimonials
document.querySelectorAll('.benefit-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Add keyboard navigation support for custom elements
document.querySelectorAll('.cta-button, .cta-button-hero').forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial sticky CTA check
    handleStickyCtaVisibility();

    // Add focus management for form
    const firstInput = form.querySelector('input:not([disabled])');
    if (firstInput) {
        // Don't auto-focus on mobile to prevent keyboard popup
        if (window.innerWidth > 768) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    console.log('The Path Is You - Landing Page Initialized');
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Optional: Send to error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Optional: Send to error tracking service
});
