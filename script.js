// Theme Selector Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.colorOptions = document.querySelector('.color-options');
        this.colorButtons = document.querySelectorAll('.color-option');
        this.modeBtn = document.querySelector('.mode-btn');
        this.availableThemes = ['lavender','mint','peach','lemon','sage','rose','coral','sky','lilac','cream','mint-green','powder'];
        this.currentTheme = this.getRandomTheme();
        this.currentMode = this.getSavedMode();
        this.init();
    }
    getRandomTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && this.availableThemes.includes(savedTheme)) return savedTheme;
        return this.availableThemes[Math.floor(Math.random() * this.availableThemes.length)];
    }
    getSavedMode() {
        const savedMode = localStorage.getItem('mode');
        return savedMode || 'light';
    }
    init() {
        this.setTheme(this.currentTheme);
        this.setMode(this.currentMode);
        this.updateActiveButton();
        this.updateModeIcon();
        this.updateNavbarBackground();

        this.themeToggle.addEventListener('click', () => this.toggleColorOptions());
        this.modeBtn.addEventListener('click', () => this.toggleMode());
        this.colorButtons.forEach(b => b.addEventListener('click', (e) => this.changeTheme(e.target.dataset.color)));

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) this.colorOptions.classList.remove('active');
        });
    }
    toggleColorOptions() { this.colorOptions.classList.toggle('active'); }
    changeTheme(theme) {
        this.currentTheme = theme;
        this.setTheme(theme);
        this.updateActiveButton();
        localStorage.setItem('theme', theme);
        this.colorOptions.classList.remove('active');
        setTimeout(() => this.updateNavbarBackground(), 50);
    }
    setTheme(theme) { document.body.setAttribute('data-theme', theme); }
    setMode(mode) { document.body.setAttribute('data-mode', mode); }
    toggleMode() {
        this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
        this.setMode(this.currentMode);
        this.updateModeIcon();
        localStorage.setItem('mode', this.currentMode);
        this.updateNavbarBackground();
    }
    updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--primary-bg').trim();
        let navbarBg;
        if (bgColor.startsWith('#')) {
            const r = parseInt(bgColor.slice(1, 3), 16);
            const g = parseInt(bgColor.slice(3, 5), 16);
            const b = parseInt(bgColor.slice(5, 7), 16);
            navbarBg = `rgba(${r}, ${g}, ${b}, 0.95)`;
        } else {
            navbarBg = bgColor.replace('rgb', 'rgba').replace(')', ', 0.95)');
        }
        navbar.style.background = navbarBg;
    }
    updateModeIcon() {
        const icon = this.modeBtn.querySelector('i');
        icon.className = (this.currentMode === 'dark') ? 'fas fa-sun' : 'fas fa-moon';
    }
    updateActiveButton() {
        this.colorButtons.forEach(b => b.classList.toggle('active', b.dataset.color === this.currentTheme));
    }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    init() {
        this.navLinks.forEach(link => link.addEventListener('click', (e) => this.smoothScrollToSection(e)));
        window.addEventListener('scroll', () => this.updateActiveNav());
    }
    smoothScrollToSection(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;
        const headerOffset = 100;
        const offsetPosition = targetSection.offsetTop - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        let activeSection = null;

        if (window.scrollY + windowHeight >= documentHeight - 10) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) activeSection = lastSection.getAttribute('id');
        } else {
            sections.forEach(section => {
                const t = section.offsetTop, h = section.offsetHeight, id = section.getAttribute('id');
                if (scrollPos >= t && scrollPos < t + h) activeSection = id;
            });
        }

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (activeSection && href === `#${activeSection}`) link.classList.add('active');
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
        this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        this.skillObserver = new IntersectionObserver((entries) => this.handleSkillBars(entries), { threshold: 0.5, rootMargin: '0px 0px -100px 0px' });
        this.animatedElements.forEach(el => this.observer.observe(el));
        this.skillBars.forEach(sb => this.skillObserver.observe(sb));
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
                setTimeout(() => { skillBar.style.width = targetWidth + '%'; }, 200);
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
        if (!this.hamburger || !this.navMenu) return;
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        this.navLinks.forEach(link => link.addEventListener('click', () => this.closeMobileMenu()));
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
    init() { window.addEventListener('scroll', () => this.handleScroll()); }
    handleScroll() {
        const computedStyle = getComputedStyle(document.body);
        const bgColor = computedStyle.getPropertyValue('--primary-bg').trim();
        let navbarBg;
        if (bgColor.startsWith('#')) {
            const r = parseInt(bgColor.slice(1, 3), 16);
            const g = parseInt(bgColor.slice(3, 5), 16);
            const b = parseInt(bgColor.slice(5, 7), 16);
            navbarBg = `rgba(${r}, ${g}, ${b}, 0.95)`;
        } else {
            navbarBg = bgColor.replace('rgb', 'rgba').replace(')', ', 0.95)');
        }
        this.navbar.style.background = navbarBg;
        this.navbar.style.backdropFilter = 'blur(10px)';
    }
}

// Preloader (Hello carousel)
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.preloaderText = this.preloader.querySelector('.preloader-text');
        this.progressFill = this.preloader.querySelector('.progress-fill');
        this.hellos = ['Hello','Bonjour','こんにちは','你好','مرحبا','नमस्ते','안녕하세요'];
        this.currentHelloIndex = 0;
        this.init();
    }
    init() {
        if (!this.preloader || !this.preloaderText) return;
        this.hellos.forEach(text => {
            const span = document.createElement('span');
            span.textContent = text;
            this.preloaderText.appendChild(span);
        });
        this.textSpans = this.preloaderText.querySelectorAll('span');
        this.cycleText();
    }
    cycleText() {
        if (this.currentHelloIndex >= this.textSpans.length) { this.hidePreloader(); return; }
        const progress = ((this.currentHelloIndex + 1) / this.textSpans.length) * 100;
        this.progressFill.style.width = progress + '%';
        this.textSpans[this.currentHelloIndex].classList.add('visible');
        setTimeout(() => {
            if (this.textSpans[this.currentHelloIndex]) {
                this.textSpans[this.currentHelloIndex].classList.remove('visible');
            }
            this.currentHelloIndex++;
            this.cycleText();
        }, 400);
    }
    hidePreloader() {
        setTimeout(() => {
            // (Previously used to auto-start music — removed to keep music paused.)
            this.preloader.classList.add('loaded');
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
            }, 1200);
        }, 500);
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
        this.isDeletingInitialText = true;

        this.typeSpeed = 60;
        this.deleteSpeed = 30;
        this.typoDeleteSpeed = 80;
        this.pauseTime = 1500;
        this.typoPause = 150;
        this.typoString = 'comptue';
        this.typoStartIndex = 0;

        this.init();
    }
    init() {
        document.addEventListener('preloaderComplete', () => {
            setTimeout(() => {
                const staticText = this.heroSubtitle.textContent || this.heroSubtitle.innerText;
                this.charIndex = staticText.length;
                this.type();
            }, 1500);
        });
    }
    type() {
        const currentText = this.texts[this.currentTextIndex];
        let timeout = this.typeSpeed;

        if (this.isDeletingInitialText) {
            this.charIndex--;
            const staticText = "compeng @uwaterloo";
            const displayText = staticText.substring(0, this.charIndex);
            this.heroSubtitle.innerHTML = `${displayText}<span class="cursor">|</span>`;
            timeout = this.deleteSpeed;
            if (this.charIndex === 0) { this.isDeletingInitialText = false; timeout = 500; }

        } else if (this.isDeleting) {
            this.charIndex--;
            const displayText = currentText.substring(0, this.charIndex);
            this.heroSubtitle.innerHTML = `${displayText}<span class="cursor">|</span>`;
            timeout = this.deleteSpeed;
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                this.typoMade = false;
                timeout = 500;
            }

        } else if (this.isFixingTypo) {
            this.charIndex--;
            const textBeforeTypo = currentText.substring(0, this.typoStartIndex);
            const incorrectPart = this.typoString.substring(0, this.charIndex - this.typoStartIndex);
            this.heroSubtitle.innerHTML = `${textBeforeTypo}${incorrectPart}<span class="cursor">|</span>`;
            timeout = this.typoDeleteSpeed;
            const commonPrefix = 'comp';
            if (this.charIndex === this.typoStartIndex + commonPrefix.length) {
                this.isFixingTypo = false;
                this.typoMade = true;
                timeout = 200;
            }

        } else {
            if (this.currentTextIndex === 0 && !this.typoMade &&
                this.charIndex >= this.typoStartIndex &&
                this.charIndex < this.typoStartIndex + this.typoString.length) {

                const typoCharIndex = this.charIndex - this.typoStartIndex;
                const textBeforeTypo = currentText.substring(0, this.typoStartIndex);
                const typoPart = this.typoString.substring(0, typoCharIndex + 1);
                this.heroSubtitle.innerHTML = `${textBeforeTypo}${typoPart}<span class="cursor">|</span>`;
                if (typoCharIndex === this.typoString.length - 1) { this.isFixingTypo = true; timeout = this.typoPause; }

            } else {
                const displayText = currentText.substring(0, this.charIndex + 1);
                this.heroSubtitle.innerHTML = `${displayText}<span class="cursor">|</span>`;
            }
            this.charIndex++;
            if (this.charIndex === currentText.length + 1) {
                this.isDeleting = true;
                this.charIndex--;
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
        if (window.innerWidth > 768) this.init();
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
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#3498db';
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}

// Music Player (kept paused until user presses play)
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
        this.playlist = [...this.originalPlaylist];
        this.init();
    }
    init() {
        if (!this.audio || !this.playPauseBtn || !this.nextBtn || !this.volumeSlider) return;
        this.shufflePlaylist();
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.audio.addEventListener('play', () => this.updatePlayButton(true));
        this.audio.addEventListener('pause', () => this.updatePlayButton(false));
        this.audio.addEventListener('ended', () => this.nextTrack());

        // Start volume low and DO NOT autoplay.
        this.volumeSlider.value = 5;                 // 0–30 slider
        this.audio.volume = (this.volumeSlider.value) / 100; // Convert to 0–1
        this.loadTrack(this.currentTrack);
    }
    shufflePlaylist() {
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.currentTrack = 0;
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
        if (this.isPlaying) this.audio.play();
    }
    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(() => {
                // If browser requires a user gesture, pressing this button is that gesture.
            });
        }
    }
    setVolume(value) { this.audio.volume = value / 100; }
    updatePlayButton(playing) {
        this.isPlaying = playing;
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
    }
}

// Patch Notes
class PatchNotesManager {
    constructor() {
        this.overlay = document.getElementById('patchNotesOverlay');
        this.openBtn = document.getElementById('patchNotesLink');
        this.closeBtn = document.getElementById('closePatchNotes');
        this.init();
    }
    init() {
        if (!this.overlay || !this.openBtn || !this.closeBtn) return;
        this.openBtn.addEventListener('click', (e) => { e.preventDefault(); this.openPatchNotes(); });
        this.closeBtn.addEventListener('click', () => this.closePatchNotes());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) this.closePatchNotes();
        });
    }
    openPatchNotes() { this.overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    closePatchNotes() { this.overlay.classList.remove('active'); document.body.style.overflow = ''; }
}

// Mouse Trail
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }
    init() {
        if (window.innerWidth < 768) return;
        document.addEventListener('mousemove', (e) => this.addTrailPoint(e));
        this.animate();
    }
    addTrailPoint(e) {
        this.trail.push({ x: e.clientX, y: e.clientY, life: 1.0 });
        if (this.trail.length > this.maxTrailLength) this.trail.shift();
    }
    animate() {
        document.querySelectorAll('.mouse-trail').forEach(el => el.remove());
        this.trail.forEach((p, i) => {
            const el = document.createElement('div');
            el.className = 'mouse-trail';
            el.style.cssText = `
                position: fixed; left:${p.x}px; top:${p.y}px;
                width:${2 + i * 0.3}px; height:${2 + i * 0.3}px;
                background: var(--text-secondary); border-radius: 50%;
                pointer-events:none; z-index:1; opacity:${p.life * 0.15};
                transform: translate(-50%, -50%); transition: opacity .2s ease; filter: blur(.5px);
            `;
            document.body.appendChild(el);
            p.life -= 0.03;
        });
        this.trail = this.trail.filter(p => p.life > 0);
        requestAnimationFrame(() => this.animate());
    }
}

// Parallax
class ParallaxEffects {
    constructor() {
        this.heroContent = document.querySelector('.hero-content');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }
    init() {
        if (window.innerWidth < 768) return;
        window.addEventListener('scroll', () => this.updateParallax());
    }
    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        if (this.heroContent) this.heroContent.style.transform = `translateY(${rate * 0.3}px)`;
        this.projectCards.forEach((card, index) => {
            const cardTop = card.offsetTop, cardHeight = card.offsetHeight, windowHeight = window.innerHeight;
            if (scrolled + windowHeight > cardTop && scrolled < cardTop + cardHeight) {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled - cardTop) * speed;
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
}

// Debounce helper (if needed)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Easter egg spin
const style = document.createElement('style');
style.textContent = `
@keyframes spin { from{transform:rotate(0deg) scale(1);} 50%{transform:rotate(180deg) scale(1.2);} to{transform:rotate(360deg) scale(1);} }
`;
document.head.appendChild(style);
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyZ' && e.ctrlKey) {
        document.querySelectorAll('.social-link').forEach(link => {
            link.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => { link.style.animation = ''; }, 1000);
        });
    }
});

// Init (NO consent; preloader starts immediately; music stays paused)
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();            // start hello carousel right away
    new ThemeManager();
    new SmoothScroll();
    new ScrollAnimations();
    new MobileNavigation();
    new NavbarScroll();
    new TypingAnimation();
    new MusicPlayer();          // loaded & paused
    new PatchNotesManager();

    if (window.innerWidth > 768) {
        new ParticleBackground();
        new MouseTrail();
        new ParallaxEffects();
    }
    setTimeout(() => { document.body.classList.add('loaded'); }, 100);
});
