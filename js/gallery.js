// Gallery and slider functionality
(function () {
    'use strict';

    // Gallery configuration
    const galleryConfig = {
        autoPlay: 4000,
        adaptiveHeight: true,
        prevNextButtons: true,
        pageDots: true,
        wrapAround: true,
        setGallerySize: true,
        percentPosition: true,
        imagesLoaded: true,
        pauseAutoPlayOnHover: false,
        arrowShape: {
            x0: 10,
            x1: 60, y1: 50,
            x2: 65, y2: 45,
            x3: 20
        }
    };

    // Initialize gallery
    function initGallery() {
        initWireframeGallery();
        initVideoHandling();
        initImageLazyLoading();
    }

    // Initialize wireframe gallery
    function initWireframeGallery() {
        const galleryElement = document.querySelector('.wireframe-gallery');

        if (!galleryElement) return;

        // Simple gallery functionality without external dependencies
        let currentSlide = 0;
        const slides = galleryElement.querySelectorAll('.gallery-slide');
        const totalSlides = slides.length;

        if (totalSlides <= 1) return;

        // Create navigation buttons
        createGalleryNavigation(galleryElement, slides);

        // Auto-advance slides
        if (galleryConfig.autoPlay) {
            setInterval(() => {
                nextSlide();
            }, galleryConfig.autoPlay);
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateGalleryDisplay();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateGalleryDisplay();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateGalleryDisplay();
        }

        function updateGalleryDisplay() {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentSlide ? 'block' : 'none';
            });

            updateDots();
        }

        function createGalleryNavigation(container, slides) {
            // Create previous/next buttons
            const prevBtn = document.createElement('button');
            prevBtn.className = 'gallery-prev';
            prevBtn.innerHTML = '‹';
            prevBtn.addEventListener('click', prevSlide);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'gallery-next';
            nextBtn.innerHTML = '›';
            nextBtn.addEventListener('click', nextSlide);

            // Create dots navigation
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'gallery-dots';

            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'gallery-dot';
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });

            container.appendChild(prevBtn);
            container.appendChild(nextBtn);
            container.appendChild(dotsContainer);

            // Initialize display
            updateGalleryDisplay();
        }

        function updateDots() {
            const dots = galleryElement.querySelectorAll('.gallery-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }

    // Handle video elements
    function initVideoHandling() {
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            // Ensure videos are muted for autoplay
            video.muted = true;

            // Handle video loading
            video.addEventListener('loadeddata', function () {
                this.style.opacity = '1';
            });

            // Pause video when not in viewport
            setupVideoIntersection(video);
        });
    }

    // Intersection Observer for videos
    function setupVideoIntersection(video) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video autoplay failed:', e));
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(video);
    }

    // Lazy loading for images
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Image zoom functionality
    function initImageZoom() {
        const images = document.querySelectorAll('.content-block img');

        images.forEach(img => {
            img.addEventListener('click', function () {
                if (this.classList.contains('zoomed')) {
                    this.classList.remove('zoomed');
                } else {
                    // Remove zoom from other images
                    images.forEach(otherImg => otherImg.classList.remove('zoomed'));
                    this.classList.add('zoomed');
                }
            });
        });

        // Close zoom when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.matches('.content-block img')) {
                images.forEach(img => img.classList.remove('zoomed'));
            }
        });
    }

    // Progress bar for gallery
    function createProgressBar(container, duration) {
        const progressBar = document.createElement('div');
        progressBar.className = 'gallery-progress';

        const progressFill = document.createElement('div');
        progressFill.className = 'gallery-progress-fill';
        progressBar.appendChild(progressFill);

        container.appendChild(progressBar);

        function updateProgress(progress) {
            progressFill.style.width = `${progress}%`;
        }

        return { updateProgress };
    }

    // Touch/swipe support for mobile
    function addTouchSupport(element, onSwipeLeft, onSwipeRight) {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 150;
        const restraint = 100;

        element.addEventListener('touchstart', function (e) {
            startX = e.changedTouches[0].pageX;
            startY = e.changedTouches[0].pageY;
        }, { passive: true });

        element.addEventListener('touchend', function (e) {
            distX = e.changedTouches[0].pageX - startX;
            distY = e.changedTouches[0].pageY - startY;

            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    onSwipeRight();
                } else {
                    onSwipeLeft();
                }
            }
        }, { passive: true });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    // Public API
    window.Gallery = {
        initGallery,
        initVideoHandling,
        initImageLazyLoading
    };

})();