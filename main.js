// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoader();
    initializeNavigation();
    initializeTheme();
    initializeScrollEffects();
    initializeAnimations();
    initializeTypingEffect();
    initializeContactForm();
    initializeStats();
    initializeSkills();
    initializeParticles();
    initializeSmoothScrolling();
});

// Loading Screen
function initializeLoader() {
    const loader = document.getElementById('loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Navigation
// main.js

// ... kode lainnya ...

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle'); // BARU: Ambil semua dropdown toggles

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (menuToggle.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });

        navLinkElements.forEach(link => {
            link.classList.remove('active');
            // Pastikan tidak mengaktifkan dropdown-toggle sebagai link aktif utama
            if (link.getAttribute('href') === `#${current}` && !link.classList.contains('dropdown-toggle')) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu when clicking on links
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            // Hanya tutup menu mobile jika bukan dropdown toggle atau item dropdown
            if (!link.classList.contains('dropdown-toggle') && !link.closest('.dropdown-menu')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });

    // BARU: Penanganan klik untuk dropdown toggle
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah navigasi default jika href="#"
            const dropdownMenu = toggle.nextElementSibling; // Ambil elemen dropdown-menu yang berdekatan
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                dropdownMenu.classList.toggle('show'); // Toggle kelas 'show'
            }

            // Tutup dropdown lain jika ada yang terbuka
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherDropdownMenu = otherToggle.nextElementSibling;
                    if (otherDropdownMenu && otherDropdownMenu.classList.contains('dropdown-menu')) {
                        otherDropdownMenu.classList.remove('show');
                    }
                }
            });
        });
    });

    // BARU: Tutup dropdown saat mengklik di luar dropdown
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownToggles.forEach(toggle => {
                const dropdownMenu = toggle.nextElementSibling;
                if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
    });
}

// ... kode lainnya ...


// Theme Toggle
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add ripple effect
        themeToggle.classList.add('ripple');
        setTimeout(() => themeToggle.classList.remove('ripple'), 300);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const scrollToTop = document.getElementById('scrollToTop');

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special handling for different animation types
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('skill-level')) {
                    animateSkillBar(entry.target);
                }
                
                if (entry.target.classList.contains('progress-fill')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .counter, .skill-level, .progress-fill'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Typing Effect
function initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const texts = [
        'Web Developer',
        'Software Engineer', 
        'UI/UX Designer',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, typingSpeed);
    }

    if (typingText) {
        setTimeout(type, 1000);
    }
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;

    const timer = setInterval(() => {
        current += Math.ceil(target / 100);
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, stepTime);
}

// Skill Bar Animation
function animateSkillBar(skillBar) {
    const level = skillBar.getAttribute('data-level');
    setTimeout(() => {
        skillBar.style.setProperty('--skill-width', `${level}%`);
        skillBar.classList.add('animate');
    }, 500);
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success modal
                showModal('successModal');
                form.reset();
                
                // Reset form labels
                const labels = form.querySelectorAll('label');
                labels.forEach(label => {
                    label.style.top = '1rem';
                    label.style.left = '1rem';
                    label.style.fontSize = '1rem';
                    label.style.color = 'var(--text-secondary)';
                });
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // Floating label effect
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const label = input.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.top = '-0.5rem';
                    label.style.left = '0.5rem';
                    label.style.fontSize = '0.85rem';
                    label.style.color = 'var(--primary-color)';
                }
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    const label = input.nextElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        label.style.top = '1rem';
                        label.style.left = '1rem';
                        label.style.fontSize = '1rem';
                        label.style.color = 'var(--text-secondary)';
                    }
                }
            });
        });
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

// Stats Animation
function initializeStats() {
    const stats = document.querySelectorAll('.stat .number');
    
    stats.forEach(stat => {
        stat.classList.add('counter');
    });
}

// Skills Animation
function initializeSkills() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.setProperty('--skill-width', '0%');
        
        // Create the animation style
        const style = document.createElement('style');
        style.textContent = `
            .skill-level.animate::after {
                width: ${level}% !important;
            }
        `;
        document.head.appendChild(style);
    });
}

// Particles Effect
function initializeParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.opacity = Math.random();
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Create particles periodically
    setInterval(createParticle, 300);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization
const debouncedScroll = debounce(() => {
    // Handle scroll events
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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

    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}