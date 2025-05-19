/**
 * FundRobin.ai Landing Page Scripts
 * Clean, modern JavaScript for the pre-launch landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // // Header scroll behavior
    // const header = document.querySelector('header');
    
    // window.addEventListener('scroll', function() {
    //     if (window.scrollY > 10) {
    //         header.classList.add('scrolled');
    //     } else {
    //         header.classList.remove('scrolled');
    //     }
    // });
    
    // Variables to track scroll position
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;

    // Handle scroll events
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when not at the top
        if (currentScrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For mobile or negative scrolling
    }, false);

    // Elements to animate on page load with specified animations
    const elementsWithAnimation = [
        { selector: '.hero-content', animation: 'slide-from-left' },
        { selector: '.hero-signup', animation: 'fade-in', delay: 200 },
        { selector: '.hero-image', animation: 'slide-from-right', delay: 100 },
        { selector: '.badge', animation: 'scale-in', delay: 300 },
    ];
    
    // Apply initial animations
    elementsWithAnimation.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.classList.add(item.animation);
            if (item.delay) {
                element.style.animationDelay = `${item.delay}ms`;
            }
        }
    });
    
    // Sections to observe for scroll animations
    const sectionTitles = document.querySelectorAll('.why-join h2, .features h2, .faq h2, .section-intro');
    const benefitItems = document.querySelectorAll('.benefit-item');
    const featureCards = document.querySelectorAll('.feature-card');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Initialize intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply appropriate animation based on element type
                if (entry.target.classList.contains('to-animate')) {
                    entry.target.classList.add('fade-in');
                } else if (entry.target.classList.contains('to-scale')) {
                    entry.target.classList.add('scale-in');
                } else if (entry.target.classList.contains('to-slide-right')) {
                    entry.target.classList.add('slide-from-right');
                } else if (entry.target.classList.contains('to-slide-left')) {
                    entry.target.classList.add('slide-from-left');
                }
                
                // Stop observing after animation is applied
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe section titles with scale animations
    sectionTitles.forEach(title => {
        title.classList.add('to-scale');
        scrollObserver.observe(title);
    });
    
    // Observe benefit items with staggered delays
    benefitItems.forEach((item, index) => {
        item.classList.add('to-animate');
        item.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        scrollObserver.observe(item);
    });
    
    // Observe feature cards with staggered delays and alternating animations
    featureCards.forEach((card, index) => {
        if (index % 2 === 0) {
            card.classList.add('to-slide-left');
        } else {
            card.classList.add('to-slide-right');
        }
        card.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        scrollObserver.observe(card);
    });
    
    // Observe FAQ items with staggered delays
    faqItems.forEach((item, index) => {
        item.classList.add('to-animate');
        item.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        scrollObserver.observe(item);
    });    // Form validation with enhanced feedback
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        const emailField = document.getElementById('email');
        const organizationField = document.getElementById('organization');
          // Remove real-time validation to prevent styling while typing
        
        function validateEmail(input) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(input.value)) {
                input.classList.add('valid');
                input.classList.remove('invalid');
                return true;
            } else if (input.value.length > 0) {
                input.classList.add('invalid');
                input.classList.remove('valid');
                return false;
            } else {
                input.classList.remove('valid', 'invalid');
                return false;
            }
        }
          signupForm.addEventListener('submit', function(e) {
            // We need to handle Google Form submission in a way that doesn't navigate away
            e.preventDefault(); 
            
            // First validate the email
            if (!validateEmail(emailField)) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please enter a valid email address';
                
                // Remove any existing error messages
                const existingError = signupForm.querySelector('.error-message');
                if (existingError) existingError.remove();
                
                emailField.parentNode.appendChild(errorMessage);
                emailField.focus();
                
                // Trigger shake animation
                emailField.classList.add('shake');
                setTimeout(() => {
                    emailField.classList.remove('shake');
                }, 600);
                
                return;
            }
            
            // If form is valid, collect the data
            const formData = new FormData(signupForm);
            
            // Create a hidden iframe to submit the form without page navigation
            let iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'hidden_iframe';
            document.body.appendChild(iframe);
            
            // Change the target of the form to the iframe
            const originalTarget = signupForm.target;
            signupForm.target = 'hidden_iframe';
              // Show loading indicator
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitButton.disabled = true;
            
            // Submit the form to Google Forms
            signupForm.submit();
            
            // Show success message after a short delay to simulate processing
            setTimeout(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                submitSuccess();
            }, 1500);
              // Reset the form fields
            signupForm.reset();
            
            // Remove any validation styling classes
            emailField.classList.remove('valid', 'invalid');
            organizationField.classList.remove('valid', 'invalid');
            
            // Reset form target back to original
            setTimeout(() => {
                signupForm.target = originalTarget;
                // Remove the iframe after a delay to ensure submission completes
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 5000);
            }, 100);
            
            // Log the submission
            console.log('Form submitted to Google Forms');
        });
    }
      // Add CSS for form validation
    const validationStyle = document.createElement('style');
    validationStyle.textContent = `
        input.valid {
            border: 2px solid var(--success) !important;
            background-color: var(--white) !important;
        }
        input.invalid {
            border: 2px solid #e53e3e !important;
            background-color: var(--white) !important;
        }
        .error-message {
            color: #e53e3e;
            font-size: 0.85rem;
            margin-top: 8px;
            position: absolute;
            bottom: -22px;
            left: 20px;
        }
        .form-group {
            position: relative;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(validationStyle);
    
    // Enhanced FAQ Accordion with smooth transitions
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQs first
            faqQuestions.forEach(otherQuestion => {
                otherQuestion.parentElement.classList.remove('active');
            });
            
            // Toggle active state if it wasn't already active
            if (!isActive) {
                faqItem.classList.add('active');
                
                // Scroll into better view if needed
                const rect = faqItem.getBoundingClientRect();
                const isPartiallyVisible = (
                    rect.top >= 0 &&
                    rect.top <= window.innerHeight * 0.7
                );
                
                if (!isPartiallyVisible) {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });    // Success message for form submission
    function submitSuccess() {
        // Create a notification div for success message instead of replacing the form
        const successMessage = document.createElement('div');
        successMessage.className = 'success-notification';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>You've been added to our early access list. We'll be in touch soon!</p>
        `;
        
        // Add the success notification to the body
        document.body.appendChild(successMessage);
          // Create a dark overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        document.body.appendChild(overlay);
        
        // Make them appear with animation
        setTimeout(() => {
            overlay.classList.add('show');
            successMessage.classList.add('show');
        }, 100);
        
        // Remove them after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successMessage);
                document.body.removeChild(overlay);
            }, 500);
        }, 5000);
        
        // Add styles for success message
        const style = document.createElement('style');
        style.textContent = `
            .success-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                background: linear-gradient(135deg, var(--primary-dark), var(--primary));
                border-radius: 16px;
                padding: 30px 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                text-align: center;
                max-width: 90%;
                width: 400px;
            }            .success-notification.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            .success-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 9998;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .success-overlay.show {
                opacity: 1;
            }
            .success-icon {
                font-size: 60px;
                color: var(--white);
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            .success-notification h3 {
                font-size: 1.8rem;
                margin-bottom: 12px;
                color: var(--white);
                -webkit-text-fill-color: var(--white);
            }
            .success-notification p {
                color: rgba(255,255,255,0.9);
                font-size: 1.1rem;
                margin-bottom: 0;
            }
        `;
        document.head.appendChild(style);
    }
});

// Smooth scrolling for all anchor links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Add highlight effect to target element
            const originalBackgroundColor = targetElement.style.backgroundColor;
            targetElement.style.transition = 'background-color 0.8s ease';
            targetElement.style.backgroundColor = 'rgba(79, 143, 240, 0.1)';
            
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Reset background after animation
            setTimeout(() => {
                targetElement.style.backgroundColor = originalBackgroundColor;
            }, 1500);
        }
    }
});

// Hero Slideshow Implementation with enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Select all slideshows
    const slideshows = document.querySelectorAll('.hero-slideshow');
    
    slideshows.forEach(slideshow => {
        const slides = Array.from(slideshow.querySelectorAll('.slide'));
        const dots = Array.from(slideshow.querySelectorAll('.dot'));
        let currentSlideIndex = 0;
        let slideInterval;
        let touchStartX = 0;
        let touchEndX = 0;
          // Function to show a specific slide
        function showSlide(index) {
            // Ensure the index is within bounds using modulo for proper looping
            index = ((index % slides.length) + slides.length) % slides.length;
            
            // Update current index
            currentSlideIndex = index;
            
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            slides[currentSlideIndex].classList.add('active');
            dots[currentSlideIndex].classList.add('active');
        }
        
        // Functions for navigation
        function nextSlide() {
            showSlide(currentSlideIndex + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlideIndex - 1);
        }
        
        // Set up automatic slideshow with reset
        function startSlideshow() {
            // Clear any existing interval
            clearInterval(slideInterval);
            
            // Set new interval
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // Set up click handlers for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide(index);
                startSlideshow(); // Reset the interval when manually changing slides
            });
        });
        
        // Touch events for mobile swipe
        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshow.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // Handle the swipe direction
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - go to previous slide
                prevSlide();
                startSlideshow();
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - go to next slide
                nextSlide();
                startSlideshow();
            }
        }
        
        // Add keyboard navigation when slideshow is in focus
        slideshow.tabIndex = 0; // Make it focusable
        slideshow.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startSlideshow();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startSlideshow();
            }
        });
        
        // Initialize slideshow
        showSlide(0); // Ensure we start at the first slide
        startSlideshow();
        
        // Pause slideshow when mouse is over it
        slideshow.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume slideshow when mouse leaves
        slideshow.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    });
});

// Add accessibility features to slideshows
document.addEventListener('DOMContentLoaded', function() {
    const slideshows = document.querySelectorAll('.hero-slideshow');
    
    slideshows.forEach(slideshow => {
        // Add ARIA attributes for accessibility
        slideshow.setAttribute('aria-roledescription', 'carousel');
        slideshow.setAttribute('aria-label', 'Screenshot slideshow');
        
        // Add accessibility attributes to slides
        const slides = slideshow.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
            
            // Set aria-hidden based on active state
            if (slide.classList.contains('active')) {
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Add accessibility attributes to dots
        const dots = slideshow.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Show slide ${index + 1}`);
            dot.setAttribute('tabindex', '0');
            
            // Make dots keyboard navigable
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dot.click();
                }
            });
        });
        
        // Monitor for slides changing to update ARIA states
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const slide = mutation.target;
                    if (slide.classList.contains('active')) {
                        slide.setAttribute('aria-hidden', 'false');
                    } else {
                        slide.setAttribute('aria-hidden', 'true');
                    }
                }
            });
        });
        
        slides.forEach((slide) => {
            observer.observe(slide, { attributes: true });
        });
    });
});
