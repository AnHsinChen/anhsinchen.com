// Main application JavaScript
(function () {
    'use strict';

    // Application configuration
    const config = {
        smoothScrollDuration: 800,
        debounceDelay: 250,
        lazyLoadOffset: 50
    };

    // Initialize application
    function initApp() {
        setupBackToTop();
        setupFormHandling();
        setupExternalLinks();
        setupImageModal();
        setupPerformanceOptimizations();
        setupAccessibility();
        setupErrorHandling();

        // Mark app as initialized
        document.body.classList.add('app-initialized');

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('appInitialized'));
    }

    // Back to top functionality
    function setupBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top a');

        if (!backToTopBtn) return;

        // Show/hide back to top button based on scroll position
        const toggleButton = debounce(() => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            if (scrolled > windowHeight * 0.5) {
                backToTopBtn.parentElement.classList.add('visible');
            } else {
                backToTopBtn.parentElement.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleButton);

        // Handle click
        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form handling (if any forms exist)
    function setupFormHandling() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);

            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', debounce(validateField, 300));
            });
        });
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        // Validate form
        if (!validateForm(form)) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
            return;
        }

        // Here you would typically send the form data to a server
        console.log('Form data:', Object.fromEntries(formData));

        // Simulate success
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            form.reset();

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        }, 1000);
    }

    // Validate individual field
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remove previous error state
        clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            showFieldError(field, message);
        }

        return isValid;
    }

    // Validate entire form
    function validateForm(form) {
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');

        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Setup external links
    function setupExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');

        externalLinks.forEach(link => {
            // Add external link indicator
            if (!link.querySelector('.external-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-icon';
                icon.innerHTML = ' ↗';
                link.appendChild(icon);
            }

            // Open in new tab
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');

            // Add click tracking
            link.addEventListener('click', function () {
                console.log('External link clicked:', this.href);
            });
        });
    }

    // Image modal functionality
    function setupImageModal() {
        const images = document.querySelectorAll('.content-block img');
        let modal = null;

        images.forEach(img => {
            // Skip small images and icons
            if (img.offsetWidth < 200 || img.offsetHeight < 200) return;

            img.style.cursor = 'pointer';
            img.title = 'Click to enlarge';

            img.addEventListener('click', function () {
                openImageModal(this);
            });
        });

        function openImageModal(img) {
            // Create modal if it doesn't exist
            if (!modal) {
                modal = createImageModal();
            }

            const modalImg = modal.querySelector('.modal-image');
            const modalCaption = modal.querySelector('.modal-caption');

            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalCaption.textContent = img.alt || '';

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function createImageModal() {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-caption"></div>
                </div>
            `;

            // Close modal events
            modal.querySelector('.modal-close').addEventListener('click', closeImageModal);
            modal.querySelector('.modal-overlay').addEventListener('click', closeImageModal);

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeImageModal();
                }
            });

            document.body.appendChild(modal);
            return modal;
        }

        function closeImageModal() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    // Performance optimizations
    function setupPerformanceOptimizations() {
        // Preload critical images
        const criticalImages = document.querySelectorAll('.hero-image img, .solution-image img');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });

        // Optimize scroll performance
        let ticking = false;

        function updateScrollEffects() {
            // Any scroll-based effects go here
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    // Accessibility enhancements
    function setupAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Focus management for modals
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.image-modal.active, #overlay-menu.active');
                if (activeModal) {
                    trapFocus(e, activeModal);
                }
            }
        });

        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    // Focus trap for modals
    function trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // Error handling
    function setupErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('JavaScript error:', e.error);
            // You could send error reports to a logging service here
        });

        window.addEventListener('unhandledrejection', function (e) {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // Utility functions
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'notification-close';
        closeBtn.addEventListener('click', () => removeNotification(notification));
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => removeNotification(notification), 5000);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
    }

    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Device detection
    function getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    // Cookie utilities
    function setCookie(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Local storage with fallback
    function getStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return getCookie(key);
        }
    }

    function setStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            setCookie(key, value);
        }
    }

    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    // Additional CSS for new functionality
    const additionalStyles = `
        .back-to-top {
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .skip-to-content {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s ease;
        }
        
        .skip-to-content:focus {
            top: 6px;
        }
        
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .image-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90vw;
            max-height: 90vh;
            text-align: center;
        }
        
        .modal-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
        }
        
        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
        }
        
        .modal-caption {
            color: white;
            margin-top: 1rem;
            font-size: 0.9rem;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            color: white;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            background: #4CAF50;
        }
        
        .notification-error {
            background: #f44336;
        }
        
        .notification-info {
            background: #2196F3;
        }
        
        .notification-close {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
        }
        
        .field-error {
            color: #f44336;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        
        input.error,
        textarea.error {
            border-color: #f44336;
            box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
        }
        
        .external-icon {
            font-size: 0.8em;
            opacity: 0.7;
        }
        
        .high-contrast {
            filter: contrast(1.5);
        }
        
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                max-width: 95vw;
                max-height: 95vh;
            }
            
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
                transform: translateY(-100%);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;

    // Inject additional styles
    const additionalStyleSheet = document.createElement('style');
    additionalStyleSheet.textContent = additionalStyles;
    document.head.appendChild(additionalStyleSheet);

    // Public API
    window.App = {
        showNotification,
        getDeviceType,
        debounce,
        throttle,
        getStorage,
        setStorage,
        config
    };

    // Analytics and tracking (placeholder)
    function trackEvent(eventName, eventData = {}) {
        console.log('Event tracked:', eventName, eventData);
        // Here you would integrate with Google Analytics, Adobe Analytics, etc.
    }

    // Performance monitoring
    function measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', function () {
                setTimeout(function () {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);

                    // Track Core Web Vitals
                    if ('web-vitals' in window) {
                        // This would require the web-vitals library
                        // getCLS(console.log);
                        // getFID(console.log);
                        // getLCP(console.log);
                    }
                }, 0);
            });
        }
    }

    measurePerformance();

})();