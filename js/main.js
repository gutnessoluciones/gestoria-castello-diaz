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

    // -------- UTILS --------
    const isMobile = () => window.innerWidth <= 768;

    // -------- MOBILE MENU --------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
            // Close any open dropdowns when closing menu
            if (!navMenu.classList.contains('open')) {
                document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
            }
        });

        // Close menu when clicking a regular nav link (NOT dropdown toggles)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Don't close if this link is a dropdown parent toggle on mobile
                if (link.closest('.nav-dropdown') && link.parentElement.classList.contains('nav-dropdown') && isMobile()) {
                    return; // Let the dropdown handler manage this
                }
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking a dropdown sub-item link
        navMenu.querySelectorAll('.dropdown-menu a').forEach(subLink => {
            subLink.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
                document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
            });
        });
    }

    // -------- SMOOTH SCROLL WITHOUT HASH IN URL --------
    // Intercept clicks on same-page anchor links to scroll without showing # in URL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
                // Clean URL: remove hash without adding history entry
                history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        });
    });

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

    // -------- COOKIE BANNER (RGPD) --------
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAcceptAll = document.getElementById('cookieAcceptAll');
    const cookieSavePrefs = document.getElementById('cookieSavePrefs');
    const cookieReject = document.getElementById('cookieReject');
    const cookieAnalytics = document.getElementById('cookieAnalytics');

    if (cookieBanner) {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500);
        }

        function hideBanner() {
            cookieBanner.classList.remove('show');
        }

        if (cookieAcceptAll) {
            cookieAcceptAll.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'all');
                localStorage.setItem('cookieAnalytics', 'true');
                hideBanner();
            });
        }

        if (cookieSavePrefs) {
            cookieSavePrefs.addEventListener('click', () => {
                const analytics = cookieAnalytics ? cookieAnalytics.checked : false;
                localStorage.setItem('cookieConsent', 'custom');
                localStorage.setItem('cookieAnalytics', analytics.toString());
                hideBanner();
            });
        }

        if (cookieReject) {
            cookieReject.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                localStorage.setItem('cookieAnalytics', 'false');
                hideBanner();
            });
        }
    }

    // -------- FAQ ACCORDION --------
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');
            // Close all
            document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // -------- DROPDOWN MENU --------
    const dropdownToggles = document.querySelectorAll('.nav-dropdown > .nav-link');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (isMobile()) {
                e.preventDefault();
                e.stopPropagation();
                const parent = toggle.closest('.nav-dropdown');
                const wasOpen = parent.classList.contains('open');

                // Close all dropdowns first
                document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));

                // Toggle current
                if (!wasOpen) {
                    parent.classList.add('open');
                }
            }
        });
    });

    // Close dropdowns when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
        }
    });

    // Close all dropdowns when resizing from mobile to desktop
    window.addEventListener('resize', () => {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    });

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
