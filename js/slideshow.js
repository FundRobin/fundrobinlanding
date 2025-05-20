/**
 * Scrollable Slideshow Implementation
 * This implementation allows for horizontal scrolling between slides
 */

document.addEventListener('DOMContentLoaded', function() {
    const slideshows = document.querySelectorAll('.hero-slideshow');

    slideshows.forEach(function(slideshow) {
        const slides = Array.from(slideshow.querySelectorAll('.slide'));
        const dotsContainer = slideshow.parentElement.parentElement.querySelector('.slideshow-dots');
        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
        let currentIndex = 0;
        let slideInterval;
        let isManualScroll = false;
        let scrollTimeout;

        // Initialize - show first slide
        slides[0].classList.add('active');
        dots[0].classList.add('active');        // Function to scroll to a specific slide
        function scrollToSlide(index) {
            // Normalize the index (ensure it loops properly)
            index = ((index % slides.length) + slides.length) % slides.length;
            currentIndex = index;
            
            // Update active classes
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            // Get current scroll position to restore it later
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            
            // Scroll the slideshow container horizontally instead of using scrollIntoView
            const slidePosition = slides[index].offsetLeft;
            slideshow.scrollLeft = slidePosition;
            
            // Restore the page scroll position to prevent jumping to the top
            window.scrollTo(scrollX, scrollY);
        }

        // Set up click handlers for the dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                isManualScroll = true;
                scrollToSlide(index);
                
                // Reset auto-play after manual interaction
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isManualScroll = false;
                    startAutoScroll();
                }, 2000);
            });
        });

        // Setup scroll event listener to update active state based on visible slide
        slideshow.addEventListener('scroll', () => {
            if (!isManualScroll) return;
            
            // Find which slide is most visible
            const slidePositions = slides.map((slide) => {
                const rect = slide.getBoundingClientRect();
                const slideshowRect = slideshow.getBoundingClientRect();
                
                // Calculate how centered the slide is in the viewport
                const distanceFromCenter = Math.abs(
                    (rect.left + rect.right) / 2 - 
                    (slideshowRect.left + slideshowRect.right) / 2
                );
                
                return { slide, distanceFromCenter };
            });
            
            // Sort by how centered they are
            slidePositions.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
            
            // Get the most centered slide
            const mostCenteredSlide = slidePositions[0].slide;
            const newIndex = slides.indexOf(mostCenteredSlide);
            
            if (newIndex !== currentIndex) {
                // Update active state
                currentIndex = newIndex;
                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                
                slides[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
            }
        }, { passive: true });

        // Start automatic scrolling
        function startAutoScroll() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                if (!isManualScroll) {
                    scrollToSlide(currentIndex + 1);
                }
            }, 5000);
        }

        // Initialize auto-scroll
        startAutoScroll();

        // Pause on hover/interaction
        slideshow.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        slideshow.addEventListener('mouseleave', () => {
            if (!isManualScroll) {
                startAutoScroll();
            }
        });

        // Handle touch interactions
        let touchStartX = 0;
        
        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isManualScroll = true;
            clearInterval(slideInterval);
        }, { passive: true });
        
        slideshow.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            
            // If it's a significant swipe, move to the next/previous slide
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe right - go to previous
                    scrollToSlide(currentIndex - 1);
                } else {
                    // Swipe left - go to next
                    scrollToSlide(currentIndex + 1);
                }
            }
            
            // Reset auto-play after touch interaction
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isManualScroll = false;
                startAutoScroll();
            }, 2000);
        }, { passive: true });
        
        // Add keyboard navigation
        slideshow.tabIndex = 0; // Make it focusable
        slideshow.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                isManualScroll = true;
                clearInterval(slideInterval);
                scrollToSlide(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                isManualScroll = true;
                clearInterval(slideInterval);
                scrollToSlide(currentIndex + 1);
            }
            
            // Reset auto-play after keyboard interaction
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isManualScroll = false;
                startAutoScroll();
            }, 2000);
        });

        // Add accessibility attributes
        slideshow.setAttribute('role', 'region');
        slideshow.setAttribute('aria-label', 'Product Screenshots');
        
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Screenshot ${index + 1} of ${slides.length}`);
            slide.setAttribute('id', `slide-${index}`);
        });
        
        dots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-controls', `slide-${index}`);
            dot.setAttribute('aria-label', `View screenshot ${index + 1}`);
            dot.setAttribute('tabindex', '0');
        });
    });
});
