class Presentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideElement = document.getElementById('currentSlide');
        this.totalSlidesElement = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateNavigation();
        this.setupTouchGestures();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Slide indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    e.preventDefault();
                    break;
            }
        });
        
        // Prevent default behavior for spacebar scrolling
        document.addEventListener('keydown', (e) => {
            if(e.key === ' ' && e.target === document.body) {
                e.preventDefault();
            }
        });
    }
    
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous slide
                this.previousSlide();
            } else {
                // Swipe left - go to next slide
                this.nextSlide();
            }
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide - 1].classList.remove('active');
        this.indicators[this.currentSlide - 1].classList.remove('active');
        
        // Add prev class to current slide for exit animation
        if (slideNumber > this.currentSlide) {
            this.slides[this.currentSlide - 1].classList.add('prev');
        }
        
        // Update current slide
        this.currentSlide = slideNumber;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide - 1].classList.add('active');
        this.indicators[this.currentSlide - 1].classList.add('active');
        
        // Remove prev class after transition
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 800);
        
        this.updateSlideCounter();
        this.updateNavigation();
        this.triggerSlideAnimations();
    }
    
    updateSlideCounter() {
        this.currentSlideElement.textContent = this.currentSlide;
        this.totalSlidesElement.textContent = this.totalSlides;
    }
    
    updateNavigation() {
        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        
        // Update next button
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
    
    triggerSlideAnimations() {
        const currentSlideElement = this.slides[this.currentSlide - 1];
        
        // Add animation classes based on slide content
        const animatableElements = currentSlideElement.querySelectorAll(
            '.stat-card, .content-item, .toc-item, .impact-card, .initiative-card'
        );
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
        
        // Special animations for title slide
        if (this.currentSlide === 1) {
            const titleElements = currentSlideElement.querySelectorAll('.main-title, .subtitle, .tagline');
            titleElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 300 + 500);
            });
        }
        
        // Special animations for conclusion slide
        if (this.currentSlide === 10) {
            const conclusionElements = currentSlideElement.querySelectorAll('.conclusion-title, .conclusion-message, .call-to-action');
            conclusionElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(40px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 400 + 300);
            });
        }
    }
    
    // Auto-play functionality (optional)
    startAutoPlay(interval = 10000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoPlay();
            }
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Fullscreen functionality
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Additional utility functions
class PresentationEffects {
    static addParticleEffects() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(particleContainer);
            }, i * 200);
        }
        
        // Continue creating particles
        setInterval(() => {
            this.createParticle(particleContainer);
        }, 3000);
    }
    
    static createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const opacity = Math.random() * 0.3 + 0.1;
        const duration = Math.random() * 10 + 15;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 229, 255, ${opacity}) 0%, transparent 70%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: floatUp ${duration}s linear forwards;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
}

// CSS for particle animation
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .presentation-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
            radial-gradient(circle at 20% 20%, rgba(0, 229, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(31, 184, 205, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(13, 71, 161, 0.1) 0%, transparent 50%);
        pointer-events: none;
        z-index: 1;
    }
`;
document.head.appendChild(particleStyles);

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new Presentation();
    
    // Add particle effects
    PresentationEffects.addParticleEffects();
    
    // Add loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0e27 0%, #1a237e 50%, #001122 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        transition: opacity 1s ease-out;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Loading Presentation...';
    loadingText.style.cssText = `
        color: #00e5ff;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
    `;
    
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
    
    // Remove loading overlay after presentation is ready
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 1000);
        
        // Trigger initial slide animations
        presentation.triggerSlideAnimations();
    }, 2000);
    
    // Add keyboard shortcut help
    document.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
            showKeyboardHelp();
        }
        if (e.key === 'f' || e.key === 'F') {
            presentation.toggleFullscreen();
        }
    });
    
    function showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
        `;
        
        const helpContent = document.createElement('div');
        helpContent.style.cssText = `
            background: rgba(10, 14, 39, 0.95);
            padding: 2rem;
            border-radius: 12px;
            border: 1px solid rgba(0, 229, 255, 0.2);
            color: white;
            max-width: 400px;
            text-align: left;
        `;
        
        helpContent.innerHTML = `
            <h3 style="color: #00e5ff; margin-bottom: 1rem;">Keyboard Shortcuts</h3>
            <div style="display: grid; gap: 0.5rem;">
                <div><strong>→ or Space:</strong> Next slide</div>
                <div><strong>← :</strong> Previous slide</div>
                <div><strong>Home:</strong> First slide</div>
                <div><strong>End:</strong> Last slide</div>
                <div><strong>F:</strong> Toggle fullscreen</div>
                <div><strong>H:</strong> Show this help</div>
                <div><strong>Esc:</strong> Close help</div>
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <small style="color: rgba(255, 255, 255, 0.7);">Press Esc to close</small>
            </div>
        `;
        
        helpModal.appendChild(helpContent);
        document.body.appendChild(helpModal);
        
        const closeHelp = () => {
            if (helpModal.parentNode) {
                helpModal.parentNode.removeChild(helpModal);
            }
            document.removeEventListener('keydown', escHandler);
        };
        
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeHelp();
            }
        };
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                closeHelp();
            }
        });
        
        document.addEventListener('keydown', escHandler);
        
        setTimeout(closeHelp, 5000); // Auto close after 5 seconds
    }
    
    // Add presentation progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00e5ff, #1fb8cd);
        z-index: 100;
        transition: width 0.3s ease;
        width: ${(1 / 10) * 100}%;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress bar on slide change
    const originalGoToSlide = presentation.goToSlide.bind(presentation);
    presentation.goToSlide = function(slideNumber) {
        originalGoToSlide(slideNumber);
        progressBar.style.width = `${(slideNumber / 10) * 100}%`;
    };
});

// Add performance optimizations
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would go here for offline capability
    });
}

// Preload next slide images for smooth transitions
class ImagePreloader {
    static preloadImages() {
        // Since no specific images are provided, this would preload any images
        const imageUrls = [];
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
}

// Initialize image preloading
ImagePreloader.preloadImages();