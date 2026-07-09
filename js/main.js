/**
 * Nhoca Elegance — Main JavaScript
 * Handles: Mobile menu, header scroll, cookie consent, form validation, smooth scroll
 */
(function () {
    'use strict';

    // ===== DOM ELEMENTS =====
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const rejectCookiesBtn = document.getElementById('rejectCookies');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    // ===== MOBILE MENU TOGGLE =====
    function closeMobileMenu() {
        if (nav && menuToggle) {
            nav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '☰';
        }
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuToggle.innerHTML = isOpen ? '✕' : '☰';
        });

        // Close menu when clicking a nav link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu with Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
                if (cookieBanner) {
                    hideCookieBanner();
                }
            }
        });
    }

    // ===== HEADER SCROLL BEHAVIOR =====
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY <= 100) {
            header.classList.remove('header--hidden');
        } else if (scrollY > lastScrollY) {
            // Scrolling down - hide header
            header.classList.add('header--hidden');
        } else {
            // Scrolling up - show header
            header.classList.remove('header--hidden');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // ===== COOKIE CONSENT =====
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setCookie(name, value, days) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
    }

    function showCookieBanner() {
        if (!getCookie('nhoca_cookie_consent')) {
            cookieBanner.classList.add('show');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }
    }

    function hideCookieBanner() {
        cookieBanner.classList.remove('show');
        cookieBanner.setAttribute('aria-hidden', 'true');
    }

    if (cookieBanner) {
        showCookieBanner();

        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener('click', function () {
                setCookie('nhoca_cookie_consent', 'accepted', 365);
                hideCookieBanner();
            });
        }

        if (rejectCookiesBtn) {
            rejectCookiesBtn.addEventListener('click', function () {
                setCookie('nhoca_cookie_consent', 'rejected', 30);
                hideCookieBanner();
            });
        }
    }

    // ===== FORM VALIDATION =====
    function showError(fieldId, errorId) {
        var errorEl = document.getElementById(errorId);
        var fieldEl = document.getElementById(fieldId);
        if (errorEl) errorEl.classList.add('show');
        if (fieldEl) fieldEl.style.boxShadow = '3px 3px 0 #e74c3c';
    }

    function clearError(fieldId, errorId) {
        var errorEl = document.getElementById(errorId);
        var fieldEl = document.getElementById(fieldId);
        if (errorEl) errorEl.classList.remove('show');
        if (fieldEl) fieldEl.style.boxShadow = '';
    }

    function clearAllErrors() {
        ['name', 'email', 'subject', 'message', 'gdpr'].forEach(function (id) {
            clearError(id, id + 'Error');
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function formatMessageData(formData) {
        var text = '📩 *Nova Mensagem — Nhoca Elegance*%0A%0A';
        text += '*Nome:* ' + formData.get('name') + '%0A';
        text += '*E-mail:* ' + formData.get('email') + '%0A';
        text += '*Telefone:* ' + (formData.get('phone') || 'Não informado') + '%0A';
        text += '*Assunto:* ' + formData.get('subject') + '%0A';
        text += '*Mensagem:* ' + formData.get('message');
        return text;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAllErrors();

            var formData = new FormData(contactForm);
            var isValid = true;

            // Validate name
            if (!formData.get('name') || formData.get('name').trim().length < 2) {
                showError('name', 'nameError');
                isValid = false;
            }

            // Validate email
            if (!formData.get('email') || !validateEmail(formData.get('email'))) {
                showError('email', 'emailError');
                isValid = false;
            }

            // Validate subject
            if (!formData.get('subject') || formData.get('subject').trim().length < 2) {
                showError('subject', 'subjectError');
                isValid = false;
            }

            // Validate message
            if (!formData.get('message') || formData.get('message').trim().length < 5) {
                showError('message', 'messageError');
                isValid = false;
            }

            // Validate GDPR consent
            if (!formData.get('gdpr')) {
                showError('gdpr', 'gdprError');
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Hide form and show success
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('show');
            }

            // Open WhatsApp with message data as fallback
            var whatsappUrl = 'https://wa.me/244947955995?text=' + formatMessageData(formData);

            // Try sending via mailto as well (browser best-effort)
            var mailtoUrl = 'mailto:nhocaelegance@gmail.com' +
                '?subject=' + encodeURIComponent('Contacto Site: ' + (formData.get('subject') || 'Mensagem')) +
                '&body=' + encodeURIComponent(
                    'Nome: ' + formData.get('name') + '\n' +
                    'E-mail: ' + formData.get('email') + '\n' +
                    'Telefone: ' + (formData.get('phone') || 'Não informado') + '\n' +
                    'Mensagem: ' + formData.get('message')
                );

            // Open email client
            window.location.href = mailtoUrl;

            // After 1.5s, also open WhatsApp as backup
            setTimeout(function () {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }, 1500);

            // After 5s, show a link to WhatsApp in case browser blocked popup
            setTimeout(function () {
                if (formSuccess && formSuccess.classList.contains('show')) {
                    var existingLink = formSuccess.querySelector('.whatsapp-fallback');
                    if (!existingLink) {
                        var link = document.createElement('a');
                        link.href = whatsappUrl;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.textContent = '💬 Se o e-mail não abriu, clique aqui para enviar por WhatsApp';
                        link.className = 'whatsapp-fallback';
                        link.style.display = 'block';
                        link.style.marginTop = '1rem';
                        link.style.color = 'var(--white)';
                        link.style.fontWeight = '600';
                        formSuccess.appendChild(link);
                    }
                }
            }, 5000);
        });

        // Real-time validation clearing on input
        ['name', 'email', 'subject', 'message'].forEach(function (id) {
            var input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function () {
                    clearError(id, id + 'Error');
                });
            }
        });

        // GDPR checkbox clearing
        var gdprCheckbox = document.getElementById('gdpr');
        if (gdprCheckbox) {
            gdprCheckbox.addEventListener('change', function () {
                if (gdprCheckbox.checked) {
                    clearError('gdpr', 'gdprError');
                }
            });
        }
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 80;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== CURRENT YEAR FOR FOOTER (if needed in the future) =====
    // Already hardcoded as 2026 in the HTML

    console.log('👗 Nhoca Elegance — Vista-se com Estilo.');
    console.log('📱 WhatsApp: +244 947 955 995');
    console.log('📧 E-mail: nhocaelegance@gmail.com');

})();
