// Theme Selector Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.colorOptions = document.querySelector('.color-options');
        this.colorButtons = document.querySelectorAll('.color-option');
        this.modeBtn = document.querySelector('.mode-btn');
        this.availableThemes = ['lavender', 'mint', 'peach', 'lemon', 'sage', 'rose', 'coral', 'sky', 'lilac', 'cream', 'mint-green', 'powder'];
        this.currentTheme = this.getRandomTheme();
        this.currentMode = this.getSavedMode();
        
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

    getSavedMode() {
        const savedMode = localStorage.getItem('mode');
        return savedMode || 'light';
    }

    init() {
        // Set initial theme and mode
        this.setTheme(this.currentTheme);
        this.setMode(this.currentMode);
        this.updateActiveButton();
        this.updateModeIcon();
        this.updateNavbarBackground();
        
        // Event listeners
        this.themeToggle.addEventListener('click', () => this.toggleColorOptions());
        this.modeBtn.addEventListener('click', () => this.toggleMode());
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
        
        // Update navbar background to match new theme
        setTimeout(() => this.updateNavbarBackground(), 50);
    }

    setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    }

    setMode(mode) {
        document.body.setAttribute('data-mode', mode);
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
        this.setMode(this.currentMode);
        this.updateModeIcon();
        localStorage.setItem('mode', this.currentMode);
        
        // Update navbar background immediately
        this.updateNavbarBackground();
    }

    updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        
        // Get the current background color from CSS variables
        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--primary-bg').trim();
        
        // Convert hex to rgba if needed, or use the color directly
        let navbarBg;
        if (bgColor.startsWith('#')) {
            // Convert hex to rgb
            const r = parseInt(bgColor.slice(1, 3), 16);
            const g = parseInt(bgColor.slice(3, 5), 16);
            const b = parseInt(bgColor.slice(5, 7), 16);
            navbarBg = `rgba(${r}, ${g}, ${b}, 0.95)`;
        } else {
            // Already in rgb format, just add alpha
            navbarBg = bgColor.replace('rgb', 'rgba').replace(')', ', 0.95)');
        }
        
        navbar.style.background = navbarBg;
    }

    updateModeIcon() {
        const icon = this.modeBtn.querySelector('i');
        if (this.currentMode === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
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
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        let activeSection = null;

        // Check if we're at the bottom of the page
        if (window.scrollY + windowHeight >= documentHeight - 10) {
            // If at bottom, highlight the last section (contact)
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                activeSection = lastSection.getAttribute('id');
            }
        } else {
            // Normal scroll detection
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            });
        }

        // Update nav links based on active section
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (activeSection && linkHref === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Fade-in Animation on Scroll
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.fade-in');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.observer = null;
        this.skillObserver = null;
        this.init();
    }

    init() {
        // Create intersection observer for fade-in animations
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Create intersection observer for skill bars
        this.skillObserver = new IntersectionObserver(
            (entries) => this.handleSkillBars(entries),
            {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        // Observe all animated elements
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });

        // Observe skill bars
        this.skillBars.forEach(skillBar => {
            this.skillObserver.observe(skillBar);
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

    handleSkillBars(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const targetWidth = skillBar.getAttribute('data-width');
                
                // Animate the progress bar
                setTimeout(() => {
                    skillBar.style.width = targetWidth + '%';
                }, 200);
                
                this.skillObserver.unobserve(skillBar);
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
        
        // Get the current background color from CSS variables
        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--primary-bg').trim();
        
        // Convert hex to rgba if needed, or use the color directly
        let navbarBg;
        if (bgColor.startsWith('#')) {
            // Convert hex to rgb
            const r = parseInt(bgColor.slice(1, 3), 16);
            const g = parseInt(bgColor.slice(3, 5), 16);
            const b = parseInt(bgColor.slice(5, 7), 16);
            navbarBg = `rgba(${r}, ${g}, ${b}, 0.95)`;
        } else {
            // Already in rgb format, just add alpha
            navbarBg = bgColor.replace('rgb', 'rgba').replace(')', ', 0.95)');
        }
        
        this.navbar.style.background = navbarBg;
        this.navbar.style.backdropFilter = 'blur(10px)';
        
        this.lastScrollTop = scrollTop;
    }
}

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.preloaderText = this.preloader.querySelector('.preloader-text');
        this.progressFill = this.preloader.querySelector('.progress-fill');
        this.hellos = [
            'Hello',
            'Bonjour',
            'こんにちは',
            '你好',
            'مرحبا',
            'नमस्ते',
            '안녕하세요'
        ];
        this.currentHelloIndex = 0;

        this.init();
    }

    init() {
        if (!this.preloader || !this.preloaderText) return;

        // Create span elements for each hello message
        this.hellos.forEach(text => {
            const span = document.createElement('span');
            span.textContent = text;
            this.preloaderText.appendChild(span);
        });

        this.textSpans = this.preloaderText.querySelectorAll('span');
        this.cycleText();
    }

    cycleText() {
        if (this.currentHelloIndex >= this.textSpans.length) {
            this.hidePreloader();
            return;
        }

        // Update progress bar
        const progress = ((this.currentHelloIndex + 1) / this.textSpans.length) * 100;
        this.progressFill.style.width = progress + '%';

        // Make current text visible
        this.textSpans[this.currentHelloIndex].classList.add('visible');

        // After a delay, hide current and show next
        setTimeout(() => {
            if (this.textSpans[this.currentHelloIndex]) {
                this.textSpans[this.currentHelloIndex].classList.remove('visible');
            }
            this.currentHelloIndex++;
            this.cycleText();
        }, 400); // Slower, more deliberate cycle speed
    }

    hidePreloader() {
        setTimeout(() => {
            // Start music right when dissolve begins for perfect sync
            document.dispatchEvent(new CustomEvent('preloaderStartDissolve'));
            
            this.preloader.classList.add('loaded');
            // Notify that preloader is done after dissolve animation completes
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
            }, 1200); // Wait for dissolve animation to complete (matches CSS 1.2s)
        }, 500); // Brief pause before dissolving
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.heroSubtitle = document.querySelector('.hero-subtitle');
        this.texts = [
            'computer engineering freshman at the university of waterloo',
            'currently scaling...'
        ];
        this.currentTextIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isFixingTypo = false;
        this.typoMade = false;
        this.isDeletingInitialText = true; // Start by deleting the static text

        this.typeSpeed = 60;
        this.deleteSpeed = 30;
        this.typoDeleteSpeed = 80; // Slower backspacing for typo correction
        this.pauseTime = 1500;
        this.typoPause = 150; // Quicker typo detection (reduced from 400ms)

        this.typoString = 'comptuer';
        this.typoStartIndex = 0; // The typo is the first word
        
        
        this.init();
    }


    init() {
        // Wait for preloader to complete before starting typing animation
        document.addEventListener('preloaderComplete', () => {
            setTimeout(() => {
                // Get the current static text length to start deleting from there
                const staticText = this.heroSubtitle.textContent || this.heroSubtitle.innerText;
                this.charIndex = staticText.length;
                this.type();
            }, 1500); // Additional delay after preloader slides up
        });
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        let timeout = this.typeSpeed;

        // Handle DELETING INITIAL TEXT state (backspace the static "compeng @uwaterloo")
        if (this.isDeletingInitialText) {
            this.charIndex--;
            const staticText = "compeng @uwaterloo";
            const displayText = staticText.substring(0, this.charIndex);
            this.heroSubtitle.innerHTML = `${displayText}<span class="cursor">|</span>`;
            timeout = this.deleteSpeed;

            if (this.charIndex === 0) {
                this.isDeletingInitialText = false;
                timeout = 500; // Pause before starting to type
            }
        // Handle DELETING state
        } else if (this.isDeleting) {
            this.charIndex--;
            const displayText = currentText.substring(0, this.charIndex);
            this.heroSubtitle.innerHTML = `${displayText}<span class="cursor">|</span>`;
            timeout = this.deleteSpeed;

            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                this.typoMade = false; // Reset for next cycle
                timeout = 500;
            }
        // Handle FIXING TYPO state (backspacing)
        } else if (this.isFixingTypo) {
            this.charIndex--;
            const textBeforeTypo = currentText.substring(0, this.typoStartIndex);
            const incorrectPart = this.typoString.substring(0, this.charIndex - this.typoStartIndex);
            this.heroSubtitle.innerHTML = `${textBeforeTypo}${incorrectPart}<span class="cursor">|</span>`;
            timeout = this.typoDeleteSpeed; // Use slower delete speed for typo correction

            // Stop backspacing at the common prefix ('comp')
            const commonPrefix = 'comp';
            if (this.charIndex === this.typoStartIndex + commonPrefix.length) {
                this.isFixingTypo = false;
                this.typoMade = true; // Mark as fixed to prevent re-triggering
                timeout = 200; // Pause before typing the correct ending
            }
        // Handle TYPING state
        } else {
            // Typing characters
            let textToType = currentText;
            
            // Introduce typo at 'computer' -> 'compoter'
            if (this.currentTextIndex === 0 && !this.typoMade && this.charIndex >= this.typoStartIndex && this.charIndex < this.typoStartIndex + this.typoString.length) {
                const typoCharIndex = this.charIndex - this.typoStartIndex;
                const textBeforeTypo = currentText.substring(0, this.typoStartIndex);
                const typoPart = this.typoString.substring(0, typoCharIndex + 1);
                this.heroSubtitle.innerHTML = `${textBeforeTypo}${typoPart}<span class="cursor">|</span>`;

                if (typoCharIndex === this.typoString.length - 1) {
                    this.isFixingTypo = true;
                    timeout = this.typoPause;
                }
            } else {
                // Normal typing
                const displayText = currentText.substring(0, this.charIndex + 1);
                this.heroSubtitle.innerHTML = `${displayText}<span class="cursor">|</span>`;
            }
            
            
            this.charIndex++;

            // If finished typing a line
            if (this.charIndex === currentText.length + 1) {
                this.isDeleting = true;
                this.charIndex--; // Correct index for deletion start
                timeout = this.pauseTime;
            }
        }

        setTimeout(() => this.type(), timeout);
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
        this.musicEnabled = false;
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
        
        // Set initial volume to very low and track
        this.volumeSlider.value = 15; // Set slider to 15 (out of 30 max)
        this.audio.volume = 15 / 100; // Convert to actual volume (15%)
        this.loadTrack(this.currentTrack);
        
        // Listen for music consent
        document.addEventListener('musicConsentGiven', (e) => {
            this.musicEnabled = e.detail.musicEnabled;
            console.log('Music consent received:', this.musicEnabled);
        });
        
        // Auto-start playing when preloader starts dissolving (perfect sync)
        document.addEventListener('preloaderStartDissolve', () => {
            if (this.musicEnabled) {
                console.log('Preloader starting dissolve, starting music for perfect sync...');
                // Start music exactly when dissolve animation begins
                this.audio.play().then(() => {
                    console.log('Music started perfectly synced with dissolve!');
                    this.updatePlayButton(true);
                }).catch(e => {
                    console.log('Music failed to start:', e);
                });
            } else {
                console.log('Music disabled by user choice');
            }
        });
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

// Patch Notes Manager
class PatchNotesManager {
    constructor() {
        this.overlay = document.getElementById('patchNotesOverlay');
        this.openBtn = document.getElementById('patchNotesLink');
        this.closeBtn = document.getElementById('closePatchNotes');
        this.init();
    }

    init() {
        if (!this.overlay || !this.openBtn || !this.closeBtn) return;

        this.openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openPatchNotes();
        });

        this.closeBtn.addEventListener('click', () => {
            this.closePatchNotes();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.closePatchNotes();
            }
        });
    }

    openPatchNotes() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePatchNotes() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Music Consent Manager
class MusicConsentManager {
    constructor() {
        this.consentOverlay = document.getElementById('musicConsent');
        this.enterWithMusicBtn = document.getElementById('enterWithMusic');
        this.enterSilentBtn = document.getElementById('enterSilent');
        this.preloader = document.getElementById('preloader');
        this.musicEnabled = false;
        this.init();
    }

    init() {
        if (!this.consentOverlay || !this.enterWithMusicBtn || !this.enterSilentBtn) return;

        this.enterWithMusicBtn.addEventListener('click', () => {
            this.musicEnabled = true;
            this.startSite();
        });

        this.enterSilentBtn.addEventListener('click', () => {
            this.musicEnabled = false;
            this.startSite();
        });
    }

    startSite() {
        // Hide consent overlay
        this.consentOverlay.style.display = 'none';
        
        // Show and start preloader
        this.preloader.style.display = 'flex';
        
        // Dispatch event to let other components know music preference
        document.dispatchEvent(new CustomEvent('musicConsentGiven', { 
            detail: { musicEnabled: this.musicEnabled } 
        }));
        
        // Start preloader after a brief moment
        setTimeout(() => {
            new Preloader();
        }, 100);
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize music consent first
    new MusicConsentManager();
    
    // Initialize other components (but not Preloader - that's handled by consent)
    new ThemeManager();
    new SmoothScroll();
    new ScrollAnimations();
    new MobileNavigation();
    new NavbarScroll();
    new TypingAnimation();
    new MusicPlayer();
    new PatchNotesManager();
    
    // Initialize particle background only on larger screens
    if (window.innerWidth > 768) {
        new ParticleBackground();
        new MouseTrail();
        new ParallaxEffects();
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

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }

    init() {
        // Only on larger screens
        if (window.innerWidth < 768) return;

        document.addEventListener('mousemove', (e) => this.addTrailPoint(e));
        this.animate();
    }

    addTrailPoint(e) {
        this.trail.push({
            x: e.clientX,
            y: e.clientY,
            life: 1.0
        });

        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    animate() {
        // Remove existing trail elements
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());

        this.trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            trailElement.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: ${2 + index * 0.3}px;
                height: ${2 + index * 0.3}px;
                background: var(--text-secondary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                opacity: ${point.life * 0.15};
                transform: translate(-50%, -50%);
                transition: opacity 0.2s ease;
                filter: blur(0.5px);
            `;
            document.body.appendChild(trailElement);

            // Fade out slower
            point.life -= 0.03;
        });

        // Remove dead points
        this.trail = this.trail.filter(point => point.life > 0);

        requestAnimationFrame(() => this.animate());
    }
}

// Parallax Scrolling Effects
class ParallaxEffects {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        // Only on larger screens
        if (window.innerWidth < 768) return;

        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect on hero content
        if (this.heroContent) {
            this.heroContent.style.transform = `translateY(${rate * 0.3}px)`;
        }

        // Subtle parallax on project cards
        this.projectCards.forEach((card, index) => {
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Only apply effect when card is in viewport
            if (scrolled + windowHeight > cardTop && scrolled < cardTop + cardHeight) {
                const speed = 0.1 + (index * 0.05); // Different speeds for each card
                const yPos = -(scrolled - cardTop) * speed;
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
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
