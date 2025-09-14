// Theme Selector Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.colorOptions = document.querySelector('.color-options');
        this.colorButtons = document.querySelectorAll('.color-option');
        this.availableThemes = ['lavender', 'mint', 'peach', 'lemon', 'sage', 'rose', 'coral', 'sky', 'lilac', 'cream', 'mint-green', 'powder'];
        this.currentTheme = this.getRandomTheme();
        
        this.init();
    }

    getRandomTheme() {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            return savedTheme;
        }
        
        // Return random theme on first visit or if saved theme is invalid
        return this.availableThemes[Math.floor(Math.random() * this.availableThemes.length)];
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        this.updateActiveButton();
        
        // Event listeners
        this.themeToggle.addEventListener('click', () => this.toggleColorOptions());
        this.colorButtons.forEach(button => {
            button.addEventListener('click', (e) => this.changeTheme(e.target.dataset.color));
        });
        
        // Close color options when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) {
                this.colorOptions.classList.remove('active');
            }
        });
    }

    toggleColorOptions() {
        this.colorOptions.classList.toggle('active');
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        this.setTheme(theme);
        this.updateActiveButton();
        localStorage.setItem('theme', theme);
        this.colorOptions.classList.remove('active');
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }

    updateActiveButton() {
        this.colorButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.color === this.currentTheme);
        });
    }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScrollToSection(e));
        });
        
        // Add scroll listener for active nav highlighting
        window.addEventListener('scroll', () => this.updateActiveNav());
    }

    smoothScrollToSection(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 100;
            const elementPosition = targetSection.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Fade-in Animation on Scroll
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in');
        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe all animated elements
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.style.animationPlayState = 'running';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
        }
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Navbar scroll effect
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollTop = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background blur when scrolled
        if (scrollTop > 50) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        }
        
        this.lastScrollTop = scrollTop;
    }
}

// Hello Carousel Animation
class HelloCarousel {
    constructor() {
        this.helloTexts = document.querySelectorAll('.hello-text');
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        if (this.helloTexts.length === 0) return;
        
        // Start with first text visible
        this.helloTexts[0].classList.add('active');
        
        // Start the carousel after a short delay
        setTimeout(() => {
            this.startCarousel();
        }, 1000);
    }

    startCarousel() {
        setInterval(() => {
            this.nextText();
        }, 2000); // Change every 2 seconds
    }

    nextText() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Fade out current text
        const currentText = this.helloTexts[this.currentIndex];
        currentText.classList.remove('active');
        currentText.classList.add('fade-out');
        
        setTimeout(() => {
            // Remove fade-out class and move to next
            currentText.classList.remove('fade-out');
            this.currentIndex = (this.currentIndex + 1) % this.helloTexts.length;
            
            // Fade in next text
            const nextText = this.helloTexts[this.currentIndex];
            nextText.classList.add('active');
            
            this.isAnimating = false;
        }, 500); // Wait for fade out to complete
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.heroSubtitle = document.querySelector('.hero-subtitle');
        this.texts = [
            'Computer Engineering Freshman at the University of Waterloo',
            'Passionate about Innovation and Technology',
            'Building the Future Through Code'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }

    init() {
        // Only start typing animation after page load
        setTimeout(() => {
            this.type();
        }, 1000);
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.heroSubtitle.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            // Typing characters
            this.heroSubtitle.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseTime);
                return;
            }
        }
        
        setTimeout(() => this.type(), this.isDeleting ? this.deleteSpeed : this.typeSpeed);
    }
}

// Particle Background Effect (Optional)
class ParticleBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: 0, y: 0 };
        
        // Only initialize on larger screens
        if (window.innerWidth > 768) {
            this.init();
        }
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.1';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#3498db';
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Music Player
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('backgroundMusic');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.isPlaying = false;
        this.currentTrack = 0;
        this.originalPlaylist = [
            'music/Lofi Background Music.mp3',
            'music/Good Night Lofi Music.mp3',
            'music/Cutie Japan Lofi.mp3',
            'music/Lofi Chill Music 398290.mp3',
            'music/Lofi Hiphop 401921.mp3',
            'music/Lofi Music 344112.mp3',
            'music/Lofi Music 398288.mp3',
            'music/Lofi Music 401926.mp3',
            'music/Lofi Song 401920.mp3',
            'music/Lofi Study Calm Chill Hop.mp3',
            'music/Rainy Lofi City Music.mp3'
        ];
        this.playlist = [...this.originalPlaylist]; // Copy for shuffling
        
        this.init();
    }

    init() {
        if (!this.audio || !this.playPauseBtn || !this.nextBtn || !this.volumeSlider) return;
        
        // Shuffle playlist on page load
        this.shufflePlaylist();
        
        // Event listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Audio event listeners
        this.audio.addEventListener('play', () => this.updatePlayButton(true));
        this.audio.addEventListener('pause', () => this.updatePlayButton(false));
        this.audio.addEventListener('ended', () => this.nextTrack());
        
        // Set initial volume and track
        this.audio.volume = this.volumeSlider.value / 100;
        this.loadTrack(this.currentTrack);
    }

    shufflePlaylist() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.currentTrack = 0; // Start from the first shuffled track
    }

    loadTrack(index) {
        if (this.playlist[index]) {
            this.audio.src = this.playlist[index];
            this.currentTrack = index;
        }
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(e => {
                console.log('Audio play failed:', e);
                // Show a message to user that they need to interact first
                alert('Click anywhere on the page first to enable audio playback!');
            });
        }
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    updatePlayButton(playing) {
        this.isPlaying = playing;
        const icon = this.playPauseBtn.querySelector('i');
        if (playing) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new SmoothScroll();
    new ScrollAnimations();
    new MobileNavigation();
    new NavbarScroll();
    new HelloCarousel();
    new TypingAnimation();
    new MusicPlayer();
    
    // Initialize particle background only on larger screens
    if (window.innerWidth > 768) {
        new ParticleBackground();
    }
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images (when you add them later)
class LazyImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
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

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
}

// Add some easter eggs for fun
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    // Simple easter egg - press 'z' for a surprise
    if (e.code === 'KeyZ' && e.ctrlKey) {
        document.querySelectorAll('.social-link').forEach(link => {
            link.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                link.style.animation = '';
            }, 1000);
        });
    }
});

// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        to { transform: rotate(360deg) scale(1); }
    }
`;
document.head.appendChild(style);
