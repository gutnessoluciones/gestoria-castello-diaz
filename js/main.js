/* ============================================
   GESTORÍA CASTELLÓ DÍAZ - MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // -------- PRELOADER --------
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 1400);
        });
        // Fallback: hide preloader after 3 seconds max
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 3000);
    }

    // -------- HEADER SCROLL --------
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // -------- MOBILE MENU --------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // -------- ACTIVE NAV LINK ON SCROLL --------
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav() {
        const scrollY = window.pageYOffset + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });

    // -------- COUNTER ANIMATION --------
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString('es-ES');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString('es-ES');
                }
            }, 16);

            counter.dataset.animated = 'true';
        });
    }

    // -------- SCROLL ANIMATIONS (Intersection Observer) --------
    const animateElements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay for staggered animations
                    const delay = entry.target.style.animationDelay || '0s';
                    const delayMs = parseFloat(delay) * 1000;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delayMs);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));

        // Counter observer
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterObserver.observe(statsSection);
        }
    } else {
        // Fallback for old browsers
        animateElements.forEach(el => el.classList.add('animated'));
        animateCounters();
    }

    // -------- SMOOTH SCROLL FOR ANCHOR LINKS --------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -------- BACK TO TOP --------
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------- COOKIE BANNER --------
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');

    if (cookieBanner) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000);
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieBanner.classList.remove('show');
            });
        }

        if (cookieReject) {
            cookieReject.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                cookieBanner.classList.remove('show');
            });
        }
    }

    // -------- FORM VALIDATION ENHANCEMENT --------
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const privacidad = document.getElementById('privacidad');
            if (!privacidad.checked) {
                e.preventDefault();
                alert('Debe aceptar la Política de Privacidad para enviar el formulario.');
                return false;
            }
        });

        // Real-time validation styling
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.style.borderColor = '#e74c3c';
                } else if (this.value.trim()) {
                    this.style.borderColor = '#27ae60';
                }
            });

            input.addEventListener('focus', function() {
                this.style.borderColor = '';
            });
        });
    }
});
