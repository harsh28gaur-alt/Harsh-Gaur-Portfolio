/**
 * Portfolio Application State & Interactive Animations for Harsh Gaur
 */

function portfolioApp() {
    return {
        darkMode: localStorage.getItem('theme') === 'dark' || 
                  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
        mobileMenuOpen: false,
        openToyotaCertModal: false,
        openResumeModal: false,
        
        toast: {
            visible: false,
            message: ''
        },

        // Metric Counter Animation Values
        metrics: {
            months: 0,
            cgpa: 0,
            certs: 0
        },
        hasAnimatedMetrics: false,

        contactForm: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },

        selectedCertCategory: 'All',
        certCategories: ['All', 'Digital Marketing', 'Analytics & Data', 'Business Strategy', 'E-Commerce'],

        certifications: [
            {
                title: 'Risk Management and Financial Theory',
                issuer: 'Duke University',
                category: 'Business Strategy',
                description: 'Analyzed portfolio risks, expected return modeling, market volatility dynamics, and financial capital decision structures.'
            },
            {
                title: 'Make the Sale: Build, Launch, and Manage E-commerce Stores',
                issuer: 'Google',
                category: 'E-Commerce',
                description: 'End-to-end online store design, product inventory placement, conversion rate optimization, and customer retention funnels.'
            },
            {
                title: 'Introduction to Social Media Marketing',
                issuer: 'Meta',
                category: 'Digital Marketing',
                description: 'Paid campaign architecture, audience targeting, Meta Ads Manager, brand voice positioning, and performance metrics tracking.'
            },
            {
                title: 'Foundations: Data, Data, Everywhere',
                issuer: 'Google',
                category: 'Analytics & Data',
                description: 'Data lifecycle management, analytical query frameworks, data cleaning procedures, and structured business reporting.'
            },
            {
                title: 'Ask Questions to Make Data-Driven Decisions',
                issuer: 'Google',
                category: 'Analytics & Data',
                description: 'Formulating strategic business questions, KPI selection, data analysis methodology, and stakeholder presentations.'
            },
            {
                title: 'Foundations of Business Strategy',
                issuer: 'University of Virginia',
                category: 'Business Strategy',
                description: 'Competitive advantage analysis, SWOT & PESTLE frameworks, strategic positioning, and market entry execution.'
            }
        ],

        get filteredCertifications() {
            if (this.selectedCertCategory === 'All') {
                return this.certifications;
            }
            return this.certifications.filter(c => c.category === this.selectedCertCategory);
        },

        init() {
            this.initScrollReveal();
            this.initHeroCanvas();
            this.setupCountersObserver();
        },

        toggleTheme() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        },

        showToast(msg) {
            this.toast.message = msg;
            this.toast.visible = true;
            setTimeout(() => {
                this.toast.visible = false;
            }, 3500);
        },

        copyContactInfo() {
            navigator.clipboard.writeText('gaur28harsh@gmail.com').then(() => {
                this.showToast('Email address copied to clipboard!');
            }).catch(() => {
                this.showToast('Email: gaur28harsh@gmail.com');
            });
        },

        submitContactForm() {
            if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
                this.showToast('Please fill out all required fields.');
                return;
            }

            const mailtoUri = `mailto:gaur28harsh@gmail.com?subject=${encodeURIComponent(this.contactForm.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${this.contactForm.name} (${this.contactForm.email})\n\nMessage:\n${this.contactForm.message}`)}`;
            window.location.href = mailtoUri;

            this.showToast('Opening your mail client...');
            this.contactForm = { name: '', email: '', subject: '', message: '' };
        },

        // Scroll Reveal Animations setup
        initScrollReveal() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.12
            });

            setTimeout(() => {
                document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
            }, 100);
        },

        // Setup Metric Counter Observer
        setupCountersObserver() {
            const metricsElement = document.getElementById('metrics-bar');
            if (!metricsElement) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimatedMetrics) {
                        this.hasAnimatedMetrics = true;
                        this.animateCounters();
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(metricsElement);
        },

        // Animate counter values smoothly
        animateCounters() {
            const duration = 1600;
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quad
                const easeProgress = 1 - (1 - progress) * (1 - progress);

                this.metrics.months = Math.floor(easeProgress * 4);
                this.metrics.cgpa = (easeProgress * 8.3).toFixed(1);
                this.metrics.certs = Math.floor(easeProgress * 6);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    this.metrics.months = 4;
                    this.metrics.cgpa = 8.3;
                    this.metrics.certs = 6;
                }
            };

            requestAnimationFrame(step);
        },

        // Interactive Particles Canvas Animation in Hero
        initHeroCanvas() {
            const canvas = document.getElementById('hero-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            let width = canvas.width = canvas.parentElement.offsetWidth;
            let height = canvas.height = canvas.parentElement.offsetHeight;

            window.addEventListener('resize', () => {
                if (!canvas.parentElement) return;
                width = canvas.width = canvas.parentElement.offsetWidth;
                height = canvas.height = canvas.parentElement.offsetHeight;
            });

            const particles = Array.from({ length: 35 }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.2
            }));

            const render = () => {
                ctx.clearRect(0, 0, width, height);

                const isDark = this.darkMode;
                const particleColor = isDark ? '2, 132, 199' : '99, 102, 241';

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;
                    if (p.y < 0) p.y = height;
                    if (p.y > height) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
                    ctx.fill();
                });

                // Connect nearby particles with subtle lines
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 110) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(${particleColor}, ${0.15 * (1 - dist / 110)})`;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }

                requestAnimationFrame(render);
            };

            render();
        }
    };
}
