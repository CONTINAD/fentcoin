// ===== Scanner Overlay Animation =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('scanner-active');

    const scannerOverlay = document.getElementById('scannerOverlay');
    const progressBar = document.getElementById('progressBar');
    const scanStatus = document.getElementById('scanStatus');
    const scanResults = document.querySelectorAll('.result-item');
    const enterBtn = document.getElementById('enterBtn');

    const statusMessages = [
        'Initializing quantum scan protocols...',
        'Analyzing wallet balance...',
        'Detecting fiend status...',
        'Checking for paper hands...',
        'Evading DEA surveillance...',
        'Scan complete. Welcome to the Fold.'
    ];

    let progress = 0;
    let statusIndex = 0;

    // Progress bar animation
    const progressInterval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressBar.style.width = progress + '%';

        // Update status messages
        const newStatusIndex = Math.floor((progress / 100) * (statusMessages.length - 1));
        if (newStatusIndex !== statusIndex && newStatusIndex < statusMessages.length) {
            statusIndex = newStatusIndex;
            scanStatus.textContent = statusMessages[statusIndex];
        }
    }, 200);

    // Show results one by one
    scanResults.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 1500 + (index * 500));
    });

    // Show enter button after scan complete
    setTimeout(() => {
        scanStatus.textContent = statusMessages[statusMessages.length - 1];
        scanStatus.style.color = '#00ff88';
        enterBtn.style.display = 'inline-block';
        enterBtn.style.animation = 'pulse 2s infinite';
    }, 4000);

    // Enter button click
    enterBtn.addEventListener('click', () => {
        scannerOverlay.classList.add('hidden');
        document.body.classList.remove('scanner-active');

        // Unmute video on user interaction (required by browsers)
        const video = document.getElementById('videoBg');
        if (video) {
            video.muted = false;
            video.play().catch(e => console.log('Video play failed:', e));
        }

        // Store in session so it doesn't show again on refresh
        sessionStorage.setItem('fentScanned', 'true');
    });

    // Check if already scanned this session
    if (sessionStorage.getItem('fentScanned') === 'true') {
        scannerOverlay.classList.add('hidden');
        document.body.classList.remove('scanner-active');

        // Try to unmute video (may not work without fresh interaction)
        const video = document.getElementById('videoBg');
        if (video) {
            // Add a click listener to unmute on first click anywhere
            document.addEventListener('click', function unmuteOnClick() {
                video.muted = false;
                video.play().catch(e => console.log('Video play failed:', e));
                document.removeEventListener('click', unmuteOnClick);
            }, { once: true });
        }
    }
});

// ===== Particle Background Effect =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;
const colors = ['#00ff88', '#00ccff', '#8b5cf6', '#ffffff'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Initialize
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ===== Copy Contract Address =====
function copyContract() {
    const contractAddress = document.getElementById('contractAddress').textContent;

    if (contractAddress === 'COMING SOON...') {
        return;
    }

    navigator.clipboard.writeText(contractAddress).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');

        // Show feedback
        const originalContent = btn.innerHTML;
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalContent;
        }, 2000);
    });
}

// ===== Copy CA from Banner =====
function copyCA() {
    const ca = document.getElementById('caAddress').textContent;

    if (ca === 'COMING SOON...') {
        return;
    }

    navigator.clipboard.writeText(ca).then(() => {
        const btn = document.querySelector('.ca-copy');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.background = '#00ff88';

        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Apply fade-in class to elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.about-card, .tech-card, .token-card, .social-card, .contract-section, .buy-card, .about-intro');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip empty hrefs

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Parallax Effect on Hero Image =====
const heroImage = document.querySelector('.hero-image');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    if (scrolled < heroHeight && heroImage) {
        const parallaxValue = scrolled * 0.3;
        heroImage.style.transform = `translateY(${parallaxValue}px)`;
    }
});

// ===== Nav Background on Scroll =====
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 10, 15, 0.8)';
    }
});

// ===== Configuration - Update these with your links =====
const CONFIG = {
    contractAddress: 'COMING SOON...',
    buyLink: '#',
    chartLink: '#',
    bluepaperLink: 'bluepaper.html',
    jupiterLink: '#',
    communityLink: 'https://x.com/i/communities/2001073989222105492',
    dexLink: '#'
};

// Apply configuration
document.addEventListener('DOMContentLoaded', () => {
    // Update contract address (both banner and section)
    const contractEl = document.getElementById('contractAddress');
    const caAddressEl = document.getElementById('caAddress');
    if (contractEl) contractEl.textContent = CONFIG.contractAddress;
    if (caAddressEl) caAddressEl.textContent = CONFIG.contractAddress;

    // Update buy buttons
    const buyBtn = document.getElementById('buyBtn');
    const buyBtnHero = document.getElementById('buyBtnHero');
    const chartBtn = document.getElementById('chartBtn');
    const bluepaperBtn = document.getElementById('bluepaperBtn');
    const jupiterLink = document.getElementById('jupiterLink');

    if (buyBtn) buyBtn.href = CONFIG.buyLink;
    if (buyBtnHero) buyBtnHero.href = CONFIG.buyLink;
    if (chartBtn) chartBtn.href = CONFIG.chartLink;
    if (bluepaperBtn) bluepaperBtn.href = CONFIG.bluepaperLink;
    if (jupiterLink) jupiterLink.href = CONFIG.jupiterLink;

    // Update social links
    const twitterLink = document.getElementById('twitterLink');
    const dexLink = document.getElementById('dexLink');

    if (twitterLink) twitterLink.href = CONFIG.communityLink;
    if (dexLink) dexLink.href = CONFIG.dexLink;
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===== Typing Effect for Scanner Status =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== Random Glitch Effect on Title =====
const glitchElement = document.querySelector('.glitch');
if (glitchElement) {
    setInterval(() => {
        if (Math.random() > 0.95) {
            glitchElement.style.animation = 'none';
            setTimeout(() => {
                glitchElement.style.animation = 'glitch-skew 4s infinite linear alternate-reverse';
            }, 200);
        }
    }, 100);
}

console.log('💊 $FENT - The Fentanyl Fold');
console.log('Welcome to the fold, fiend.');
