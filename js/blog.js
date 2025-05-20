/**
 * Robin Blogs - Coming Soon Page Scripts
 */

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll behavior (borrowed from main script.js)
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

    // Elements to animate on page load
    const elementsWithAnimation = [
        { selector: '.blog-coming-soon', animation: 'fade-in' },
        { selector: '.blog-icon', animation: 'scale-in', delay: 200 },
        { selector: '.countdown', animation: 'fade-in', delay: 300 },
        { selector: '.notification-form', animation: 'slide-from-bottom', delay: 400 },
        { selector: '.social-preview', animation: 'fade-in', delay: 500 },
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

    // Countdown timer functionality
    // Set launch date - 10 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 10);
    launchDate.setHours(5, 30, 22);
    
    // Update countdown every second
    function updateCountdown() {
        const now = new Date();
        const difference = launchDate - now;
        
        if (difference <= 0) {
            // Launch time has arrived
            document.querySelector('.countdown').innerHTML = '<h2>Our blog is now live!</h2>';
            return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update DOM
        document.querySelector('.countdown-item:nth-child(1) .countdown-number').textContent = days.toString().padStart(2, '0');
        document.querySelector('.countdown-item:nth-child(2) .countdown-number').textContent = hours.toString().padStart(2, '0');
        document.querySelector('.countdown-item:nth-child(3) .countdown-number').textContent = minutes.toString().padStart(2, '0');
        document.querySelector('.countdown-item:nth-child(4) .countdown-number').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Initial call and set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Handle the notification form submission
    const notificationForm = document.querySelector('.notification-form');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Show success message
            showNotificationSuccess(email);
            
            // Clear the form
            this.reset();
        });
    }

    // Success message for notification submission
    function showNotificationSuccess(email) {
        // Create a notification div for success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-notification';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>We'll notify ${email} as soon as our blog launches!</p>
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
    }
});

// Add a slide from bottom animation
document.addEventListener('DOMContentLoaded', function() {
    // Add the new animation to the stylesheet
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideFromBottom {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .slide-from-bottom {
            animation: slideFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
});
