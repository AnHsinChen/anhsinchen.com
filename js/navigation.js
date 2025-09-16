// Navigation functionality
(function () {
    'use strict';

    // DOM elements
    const navbar = document.getElementById('main-navbar');
    const hamburger = document.querySelector('.menu-icon');
    const overlayMenu = document.getElementById('overlay-menu');
    const overlayLinks = document.querySelectorAll('#overlay-menu a');

    // Initialize navigation
    function initNavigation() {
        setupScrollEffect();
        setupMobileMenu();
        setupSmoothScrolling();
    }

    // Navbar scroll effect
    function setupScrollEffect() {
        let lastScrollTop = 0;

        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add/remove scrolled class based on scroll position
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop;
        });
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        if (!hamburger || !overlayMenu) return;

        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            toggleMobileMenu();
        });

        // Close menu when clicking on overlay links
        overlayLinks.forEach(link => {
            link.addEventListener('click', function () {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        overlayMenu.addEventListener('click', function (e) {
            if (e.target === overlayMenu) {
                closeMobileMenu();
            }
        });

        // Close menu with Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlayMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = overlayMenu.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        hamburger.classList.add('active');
        overlayMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        overlayMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Smooth scrolling for anchor links
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    scrollToTop();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    scrollToElement(target);
                }
            });
        });
    }

    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Scroll to specific element
    function scrollToElement(element) {
        const navbarHeight = navbar.offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }

    // Public API
    window.Navigation = {
        openMobileMenu,
        closeMobileMenu,
        scrollToTop,
        scrollToElement
    };

})();