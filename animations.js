// Advanced Animations and Interactions
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupParallaxEffects();
    }

    setupIntersectionObservers() {
        // Fade in animation observer
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.triggerStaggeredAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            fadeInObserver.observe(el);
        });

        this.observers.set('fadeIn', fadeInObserver);
    }

    triggerStaggeredAnimation(container) {
        const children = container.querySelectorAll('.stagger-animation');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('visible');
            }, index * 100);
        });
    }

    setupScrollAnimations() {
        let ticking = false;
        
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            
            // Parallax elements
            document.querySelectorAll('.parallax').forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            // Header background position
            const hero = document.querySelector('.hero');
            if (hero) {
                const offset = scrollY * 0.3;
                hero.style.backgroundPositionY = `${offset}px`;
            }

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.service-card, .skill-category').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addRippleEffect(card);
                card.classList.add('hover-lift');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-lift');
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('hover-glow');
            });

            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('hover-glow');
            });
        });

        // Social links animation
        document.querySelectorAll('.social-links a, .footer-social a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.classList.add('icon-bounce');
            });

            link.addEventListener('animationend', () => {
                link.classList.remove('icon-bounce');
            });
        });
    }

    setupClickEffects() {
        // Ripple effect for buttons
        document.querySelectorAll('.btn, .nav-link').forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(e, element);
            });
        });

        // Elastic effect for interactive elements
        document.querySelectorAll('.service-card, .skill-item').forEach(element => {
            element.addEventListener('click', () => {
                element.classList.add('elastic');
                setTimeout(() => {
                    element.classList.remove('elastic');
                }, 600);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addRippleEffect(element) {
        if (!element.querySelector('.ripple-bg')) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple-bg');
            element.appendChild(ripple);
        }
    }

    setupParallaxEffects() {
        // Mouse parallax for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { innerWidth, innerHeight } = window;
                
                const xPos = (clientX / innerWidth - 0.5) * 20;
                const yPos = (clientY / innerHeight - 0.5) * 20;
                
                const floatingIcons = hero.querySelectorAll('.floating-icon');
                floatingIcons.forEach((icon, index) => {
                    const multiplier = (index + 1) * 0.3;
                    icon.style.transform = `translate(${xPos * multiplier}px, ${yPos * multiplier}px)`;
                });
            });
        }
    }

    // Text animation effects
    animateText(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        typeWriter();
    }

    // Morphing loader
    createMorphingLoader(container) {
        const loader = document.createElement('div');
        loader.classList.add('morphing-shape');
        loader.style.cssText = `
            width: 80px;
            height: 80px;
            background: var(--gradient-primary);
            margin: 20px auto;
        `;
        container.appendChild(loader);
        return loader;
    }

    // Progress animation
    animateProgress(element, targetPercent, duration = 2000) {
        let start = null;
        const startPercent = 0;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            const currentPercent = startPercent + (targetPercent - startPercent) * this.easeOutCubic(progress);
            element.style.width = currentPercent + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Easing functions
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Shake animation for form validation
    shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    // Pulse animation for notifications
    pulseElement(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 1000);
    }

    // Destroy all observers (cleanup)
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

// Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                life: 1,
                decay: Math.random() * 0.02 + 0.005
            });
        }
    }

    animate() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;

            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                this.particles.push({
                    x: Math.random() * this.container.offsetWidth,
                    y: Math.random() * this.container.offsetHeight,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1,
                    life: 1,
                    decay: Math.random() * 0.02 + 0.005
                });
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Mouse trail effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
        this.animate();
    }

    addTrailPoint(x, y) {
        this.trail.push({ x, y, life: 1 });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    animate() {
        this.trail.forEach((point, index) => {
            point.life -= 0.05;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });
        requestAnimationFrame(() => this.animate());
    }
}

// GSAP-like animation utilities
class AnimationUtils {
    static to(element, duration, properties) {
        return new Promise(resolve => {
            const start = performance.now();
            const initialStyles = {};
            
            Object.keys(properties).forEach(prop => {
                initialStyles[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
            });

            const animate = (timestamp) => {
                const progress = Math.min((timestamp - start) / (duration * 1000), 1);
                const easedProgress = this.easeOutQuart(progress);

                Object.keys(properties).forEach(prop => {
                    const initial = initialStyles[prop];
                    const target = properties[prop];
                    const current = initial + (target - initial) * easedProgress;
                    
                    if (prop === 'opacity' || prop === 'scale') {
                        element.style[prop] = current;
                    } else {
                        element.style[prop] = current + 'px';
                    }
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    static from(element, duration, properties) {
        return new Promise(resolve => {
            const start = performance.now();
            const finalStyles = {};
            
            Object.keys(properties).forEach(prop => {
                finalStyles[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
                element.style[prop] = properties[prop] + (typeof properties[prop] === 'number' ? 'px' : '');
            });

            const animate = (timestamp) => {
                const progress = Math.min((timestamp - start) / (duration * 1000), 1);
                const easedProgress = this.easeOutQuart(progress);

                Object.keys(properties).forEach(prop => {
                    const initial = properties[prop];
                    const target = finalStyles[prop];
                    const current = initial + (target - initial) * easedProgress;
                    
                    if (prop === 'opacity' || prop === 'scale') {
                        element.style[prop] = current;
                    } else {
                        element.style[prop] = current + 'px';
                    }
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

    static easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Magnetic button effect
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        this.element.addEventListener('mouseenter', () => {
            this.element.addEventListener('mousemove', this.handleMouseMove);
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.removeEventListener('mousemove', this.handleMouseMove);
            AnimationUtils.to(this.element, 0.5, { transform: 'translate(0px, 0px)' });
        });
    }

    handleMouseMove = (e) => {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = 0.3;
        const moveX = x * strength;
        const moveY = y * strength;
        
        this.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}

// Smooth reveal animation
class SmoothReveal {
    constructor() {
        this.init();
    }

    init() {
        const elements = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => observer.observe(el));
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animation manager
    const animationManager = new AnimationManager();
    
    // Initialize magnetic buttons
    document.querySelectorAll('.btn, .service-card').forEach(btn => {
        new MagneticButton(btn);
    });
    
    // Initialize smooth reveal
    new SmoothReveal();
    
    // Initialize particle system for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        new ParticleSystem(hero);
    }
    
    // Initialize mouse trail (optional - can be enabled/disabled)
    // new MouseTrail();
    
    // Add CSS for dynamic animations
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .ripple-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .service-card:hover .ripple-bg {
            opacity: 1;
        }
        
        .magnetic-element {
            transition: transform 0.2s ease-out;
        }
    `;
    document.head.appendChild(style);
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        ParticleSystem,
        MouseTrail,
        AnimationUtils,
        MagneticButton,
        SmoothReveal
    };
}