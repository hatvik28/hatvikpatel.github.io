/* ============================================
   CUSTOM PORTFOLIO JS - Hatvik Patel
   Loading Screen, Typing Effect, Particles,
   Scroll Reveal
   ============================================ */

(function () {
    'use strict';

    // ========== LOADING SCREEN ==========
    function initLoader() {
        var loader = document.getElementById('loader');
        if (!loader) return;

        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('loaded');
                setTimeout(function () {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 800);
            }, 2400);
        });
    }

    // ========== TYPING EFFECT ==========
    function initTypingEffect() {
        var typedElement = document.getElementById('typed-text');
        if (!typedElement) return;

        var phrases = [
            'Software Engineer',
            'Full Stack Developer',
            'AI Enthusiast',
            'Problem Solver'
        ];

        var phraseIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typeSpeed = 100;

        function type() {
            var currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                charIndex--;
                typedElement.textContent = currentPhrase.substring(0, charIndex);
                typeSpeed = 40;
            } else {
                charIndex++;
                typedElement.textContent = currentPhrase.substring(0, charIndex);
                typeSpeed = 90;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        // Start after loader finishes
        setTimeout(type, 3000);
    }

    // ========== SCROLL REVEAL ==========
    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        // Check if IntersectionObserver is available
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            reveals.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: just show everything
            reveals.forEach(function (el) {
                el.classList.add('active');
            });
        }
    }

    // ========== GOLD PARTICLES ==========
    function initParticles() {
        var canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = 45;
        var animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.4,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.4 + 0.1
            };
        }

        function init() {
            resize();
            particles = [];
            for (var i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fade particles based on scroll position
            var scrollY = window.scrollY || window.pageYOffset;
            var fadeOut = Math.max(0, 1 - scrollY / (window.innerHeight * 0.7));

            if (fadeOut > 0.01) {
                var i, j, p, dx, dy, dist;

                for (i = 0; i < particles.length; i++) {
                    p = particles[i];
                    p.x += p.speedX;
                    p.y += p.speedY;

                    // Wrap around edges
                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(253, 185, 39, ' + (p.opacity * fadeOut) + ')';
                    ctx.fill();
                }

                // Draw connections between nearby particles
                for (i = 0; i < particles.length; i++) {
                    for (j = i + 1; j < particles.length; j++) {
                        dx = particles[i].x - particles[j].x;
                        dy = particles[i].y - particles[j].y;
                        dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 130) {
                            ctx.beginPath();
                            ctx.strokeStyle = 'rgba(253, 185, 39, ' + (0.06 * (1 - dist / 130) * fadeOut) + ')';
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', function () {
            resize();
        });

        init();
        animate();
    }

    // ========== COUNTER ANIMATION ==========
    function initCounters() {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            counters.forEach(function (el) {
                el.textContent = el.getAttribute('data-target');
            });
        }
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    // ========== INITIALIZE EVERYTHING ==========
    initLoader();
    initTypingEffect();

    // Wait for DOM to be ready for scroll-dependent features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initScrollReveal();
            initParticles();
            initCounters();
        });
    } else {
        initScrollReveal();
        initParticles();
        initCounters();
    }

})();
