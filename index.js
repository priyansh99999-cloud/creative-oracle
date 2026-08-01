/* ==========================================================================
   Creative Oracle - Interactive Experience Engine (Multi-Page Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Dynamic Element Injection (Cursor & Curtain Transitions)
    // ==========================================================================
    


    // Inject Transition Curtain overlay
    const curtain = document.createElement('div');
    curtain.className = 'transition-curtain';
    
    let preloaderSeen = false;
    try {
        preloaderSeen = sessionStorage.getItem('oracle_preloader_seen');
    } catch(e) {
        console.warn('sessionStorage restricted');
    }
    
    if (preloaderSeen) {
        // If already seen in this session, use regular curtain transition on load
        curtain.style.transition = 'none';
        curtain.style.transform = 'translateY(0)';
        document.body.appendChild(curtain);
        
        curtain.offsetHeight;
        requestAnimationFrame(() => {
            curtain.style.transition = 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)';
            curtain.style.transform = 'translateY(-100%)';
        });
    } else {
        // First load of session: multilingual greeting loader overlay
        curtain.style.transition = 'none';
        curtain.style.transform = 'translateY(-100%)';
        document.body.appendChild(curtain);
        
        try { sessionStorage.setItem('oracle_preloader_seen', 'true'); } catch(e) {}
        
        const loaderOverlay = document.createElement('div');
        loaderOverlay.className = 'site-preloader';
        loaderOverlay.innerHTML = `
            <div class="preloader-content">
                <span class="loader-dot"></span>
                <span class="loader-word" id="loaderWord">Namaste</span>
            </div>
        `;
        document.body.appendChild(loaderOverlay);
        document.body.classList.add('preloader-active');
        
        const loaderWord = document.getElementById('loaderWord');
        
        // Target list of international greeting words starting with Namaste and Hello
        const greetings = ["Namaste", "Hello", "Bonjour", "Ciao", "Hola", "Konnichiwa", "Olá", "Guten Tag", "Nǐ Hǎo"];
        let wordIndex = 0;
        
        // Initially show the first word
        setTimeout(() => {
            if (loaderWord) {
                loaderWord.style.opacity = '1';
                loaderWord.style.transform = 'translateY(0)';
            }
        }, 50);
        
        // Cycle words sequentially (optimized readable speed with 60ms transitions)
        const wordInterval = setInterval(() => {
            wordIndex++;
            if (wordIndex < greetings.length) {
                if (loaderWord) {
                    loaderWord.style.opacity = '0';
                    loaderWord.style.transform = 'translateY(-8px)';
                    
                    setTimeout(() => {
                        loaderWord.textContent = greetings[wordIndex];
                        loaderWord.style.opacity = '1';
                        loaderWord.style.transform = 'translateY(0)';
                    }, 60);
                }
            } else {
                clearInterval(wordInterval);
                
                // Exit animations
                setTimeout(() => {
                    if (loaderWord) {
                        loaderWord.style.opacity = '0';
                        loaderWord.style.transform = 'translateY(-10px)';
                    }
                    const dot = loaderOverlay.querySelector('.loader-dot');
                    if (dot) {
                        dot.style.opacity = '0';
                        dot.style.transform = 'scale(0.8)';
                        dot.style.transition = 'opacity 0.15s, transform 0.15s';
                    }
                }, 100);
                
                setTimeout(() => {
                    loaderOverlay.classList.add('loaded');
                    document.body.classList.remove('preloader-active');
                    
                    // Reveal the initial content blocks
                    if (typeof initRevealObserver === 'function') {
                        initRevealObserver();
                    }
                }, 250);
                
                setTimeout(() => {
                    loaderOverlay.remove();
                }, 800);
            }
        }, 160);
    }

    // Intercept navigation links for smooth curtain wipes
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && !link.target && !link.href.includes('#') && link.host === window.location.host) {
            e.preventDefault();
            const destination = link.href;
            
            // Snap curtain to bottom of screen instantly
            curtain.style.transition = 'none';
            curtain.style.transform = 'translateY(100%)';
            
            // Force reflow
            curtain.offsetHeight;
            
            // Slide up to cover screen
            curtain.style.transition = 'transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)';
            curtain.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                window.location.href = destination;
            }, 600);
        }
    });

    // Handle back-forward cache show
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            curtain.style.transition = 'none';
            curtain.style.transform = 'translateY(-100%)';
        }
    });


    // ==========================================================================
    // 2. Navigation & Header Mechanics
    // ==========================================================================
    const mainHeader = document.getElementById('mainHeader');
    if (mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }

    // Full-Screen Hamburger Toggle
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuToggle && menuOverlay) {
        const toggleMenu = () => {
            const isActive = menuOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
            
            const bars = menuToggle.querySelectorAll('.menu-bar');
            if (isActive) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);
        
        menuOverlay.querySelectorAll('.menu-nav-link').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }


    // ==========================================================================
    // 3. Lead Capture Modals
    // ==========================================================================
    const leadModal = document.getElementById('leadModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const triggerButtons = document.querySelectorAll('.trigger-modal-btn');

    if (leadModal && modalCloseBtn) {
        const openModal = () => {
            leadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            leadModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        triggerButtons.forEach(btn => btn.addEventListener('click', openModal));
        modalCloseBtn.addEventListener('click', closeModal);
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) closeModal();
        });
    }


    // ==========================================================================
    // 4. Scroll Reveal Animations (IntersectionObserver)
    // ==========================================================================
    function initRevealObserver() {
        const revealItems = document.querySelectorAll('.reveal-item');
        if (revealItems.length > 0) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            revealItems.forEach(item => revealObserver.observe(item));
        }
    }

    // Trigger immediately if preloader was already seen, otherwise called by preloader exit callback
    if (preloaderSeen) {
        initRevealObserver();
    }


    // ==========================================================================
    // 5. Statistics Numeric Count-ups
    // ==========================================================================
    const statsSection = document.querySelector('.why-stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    if (statsSection && statNumbers.length > 0) {
        const countUp = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10);
                const duration = 1800;
                const startTime = performance.now();

                const updateNumber = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic out
                    
                    const currentValue = Math.floor(easeProgress * target);
                    stat.textContent = currentValue;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.textContent = target;
                    }
                };
                requestAnimationFrame(updateNumber);
            });
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    countUp();
                    hasCounted = true;
                }
            });
        }, { threshold: 0.25 });
        statsObserver.observe(statsSection);
    }


    // ==========================================================================
    // 6. Portfolio Category Selector
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (category === 'all' || itemCategory === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }


    // ==========================================================================
    // 7. Timeline Scroll Line Mechanics
    // ==========================================================================
    const processSection = document.getElementById('process');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineFill = document.getElementById('timelineProgressFill');

    if (processSection && timelineItems.length > 0 && timelineFill) {
        const updateTimeline = () => {
            const viewportHeight = window.innerHeight;
            const scrollMiddle = window.scrollY + (viewportHeight / 2);
            
            let progress = 0;
            const firstItem = timelineItems[0];
            const lastItem = timelineItems[timelineItems.length - 1];
            
            if (firstItem && lastItem) {
                const firstRect = firstItem.getBoundingClientRect();
                const lastRect = lastItem.getBoundingClientRect();
                
                const startScrollY = firstRect.top + window.scrollY;
                const endScrollY = lastRect.top + window.scrollY;
                const timelineLength = endScrollY - startScrollY;
                
                if (scrollMiddle >= startScrollY) {
                    progress = Math.min((scrollMiddle - startScrollY) / timelineLength, 1) * 100;
                }
            }
            
            timelineFill.style.height = `${progress}%`;
            
            timelineItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemMiddle = itemRect.top + window.scrollY;
                
                if (scrollMiddle >= itemMiddle - 50) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', updateTimeline);
        window.addEventListener('resize', updateTimeline);
        updateTimeline();
    }


    // ==========================================================================
    // 8. FAQ Accordeon Mechanics & Search Engine
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    const faqSearchInput = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqNoResults = document.getElementById('faqNoResults');

    if (faqTriggers.length > 0) {
        faqTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                
                faqTriggers.forEach(other => {
                    if (other !== trigger) {
                        other.setAttribute('aria-expanded', 'false');
                    }
                });
                
                trigger.setAttribute('aria-expanded', !isExpanded);
            });
        });
    }

    // Live search accordion elements
    if (faqSearchInput && faqItems.length > 0) {
        faqSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            faqItems.forEach(item => {
                const title = item.querySelector('.faq-trigger span:first-child').textContent.toLowerCase();
                const bodyText = item.querySelector('.faq-panel-content p').textContent.toLowerCase();

                if (title.includes(query) || bodyText.includes(query)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });

            if (faqNoResults) {
                faqNoResults.style.display = (visibleCount === 0) ? 'block' : 'none';
            }
        });
    }


    // ==========================================================================
    // 9. Magnetic Button Hover Fields
    // ==========================================================================
    const magneticButtons = document.querySelectorAll('.btn-magnetic');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });


    // ==========================================================================
    // 10. Interactive Growth Scale Calculator
    // ==========================================================================
    const calcSpend = document.getElementById('calcSpend');
    const calcSpendVal = document.getElementById('calcSpendVal');
    const calcGoal = document.getElementById('calcGoal');
    
    const estCac = document.getElementById('estCac');
    const estGrowth = document.getElementById('estGrowth');
    const estHours = document.getElementById('estHours');

    if (calcSpend && calcGoal && estCac && estGrowth && estHours) {
        const updateCalculator = () => {
            const spend = parseInt(calcSpend.value, 10);
            const goal = calcGoal.value;

            // Formatted Spend Label
            calcSpendVal.textContent = `$${spend.toLocaleString()}`;

            let cacReduction = 0;
            let organicGrowth = 0;
            let hoursSaved = 0;

            // Calculate metrics based on sliders and goal selection
            if (goal === 'paid') {
                cacReduction = 20 + (spend / 100000) * 15; // 20% to 35%
                organicGrowth = 80 + (spend / 100000) * 100; // 80% to 180%
                hoursSaved = 15 + Math.floor((spend / 10000) * 4); // 15 to 55 hrs
            } else if (goal === 'seo') {
                cacReduction = 15 + (spend / 100000) * 10; // 15% to 25%
                organicGrowth = 150 + (spend / 100000) * 270; // 150% to 420%
                hoursSaved = 10 + Math.floor((spend / 10000) * 3); // 10 to 40 hrs
            } else if (goal === 'automation') {
                cacReduction = 25 + (spend / 100000) * 20; // 25% to 45%
                organicGrowth = 50 + (spend / 100000) * 50; // 50% to 100%
                hoursSaved = 35 + Math.floor((spend / 10000) * 12.5); // 35 to 160 hrs
            } else { // 'all' - Comprehensive scale
                cacReduction = 30 + (spend / 100000) * 15; // 30% to 45%
                organicGrowth = 200 + (spend / 100000) * 220; // 200% to 420%
                hoursSaved = 40 + Math.floor((spend / 10000) * 12); // 40 to 160 hrs
            }

            // Cap figures to logical design constraints
            cacReduction = Math.min(Math.round(cacReduction), 50);
            organicGrowth = Math.min(Math.round(organicGrowth), 500);
            hoursSaved = Math.min(Math.round(hoursSaved), 160);

            // Animate metric printouts
            estCac.textContent = `-${cacReduction}%`;
            estGrowth.textContent = `+${organicGrowth}%`;
            estHours.textContent = `${hoursSaved}h`;
        };

        calcSpend.addEventListener('input', updateCalculator);
        calcGoal.addEventListener('change', updateCalculator);
        updateCalculator(); // Initial calculation on document ready
    }


    // ==========================================================================
    // 11. Canvas Math Orbit Render Loop (Rewritten for robustness)
    // ==========================================================================
    const canvas = document.getElementById('orbitalCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) { console.warn('Canvas 2D context unavailable'); return; }

        let width = 0, height = 0;
        let centerX = 0, centerY = 0;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            const w = parent ? parent.offsetWidth : window.innerWidth;
            const h = parent ? parent.offsetHeight : window.innerHeight;
            if (w === 0 || h === 0) return; // Skip if not laid out yet

            width = w;
            height = h;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const pageName = window.location.pathname.split('/').pop().replace('.html', '');
            
            if (window.innerWidth < 992 || pageName === 'portfolio') {
                centerX = width * 0.5;
                centerY = height * 0.5;
            } else {
                centerX = width * 0.68;
                centerY = height * 0.45;
            }
        };

        // Delay initial resize to ensure layout is complete
        resizeCanvas();
        if (width === 0 || height === 0) {
            setTimeout(resizeCanvas, 100);
        }

        let mouseX = 0, mouseY = 0;
        let currentMouseX = 0, currentMouseY = 0;
        let mouseInitialized = false;

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            if (!mouseInitialized) {
                currentMouseX = mouseX;
                currentMouseY = mouseY;
                mouseInitialized = true;
            }
        });

        window.addEventListener('resize', resizeCanvas);

        // Page-specific speed tuning
        const pageName = window.location.pathname.split('/').pop().replace('.html', '');
        let rotationScale = 1.0;
        let orbitLineDensity = 1.0;

        if (pageName === 'process') {
            rotationScale = 0.5;
            orbitLineDensity = 0.6;
        } else if (pageName === 'about') {
            rotationScale = 0.75;
            orbitLineDensity = 1.4;
        } else if (pageName === 'contact') {
            rotationScale = 1.8;
            orbitLineDensity = 0.8;
        }

        const tracks = [
            { radius: 130, speed: 0.008 * rotationScale, color: 'rgba(109, 40, 217, 0.12)', angle: 0 },
            { radius: 240, speed: -0.005 * rotationScale, color: 'rgba(16, 165, 178, 0.10)', angle: Math.PI / 4 },
            { radius: 360, speed: 0.003 * rotationScale, color: 'rgba(247, 160, 114, 0.08)', angle: Math.PI / 2 },
            { radius: 500, speed: -0.002 * rotationScale, color: 'rgba(20, 113, 155, 0.07)', angle: Math.PI }
        ];

        const satellites = [
            { trackIndex: 0, size: 4, offsetAngle: 0, color: '#6D28D9', rgb: '109, 40, 217' },
            { trackIndex: 0, size: 2.5, offsetAngle: Math.PI, color: '#10A5B2', rgb: '16, 165, 178' },
            { trackIndex: 1, size: 5, offsetAngle: Math.PI / 3, color: '#10A5B2', rgb: '16, 165, 178' },
            { trackIndex: 2, size: 6, offsetAngle: Math.PI / 1.5, color: '#F7A072', rgb: '247, 160, 114' },
            { trackIndex: 2, size: 3, offsetAngle: -Math.PI / 4, color: '#6D28D9', rgb: '109, 40, 217' },
            { trackIndex: 3, size: 8, offsetAngle: Math.PI / 6, color: '#14719B', rgb: '20, 113, 155' }
        ];

        let isCanvasVisible = true;
        const canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const wasVisible = isCanvasVisible;
                isCanvasVisible = entry.isIntersecting;
                if (isCanvasVisible && !wasVisible) {
                    requestAnimationFrame(animateCanvas);
                }
            });
        }, { threshold: 0.01 });
        canvasObserver.observe(canvas);

        function animateCanvas() {
            if (!isCanvasVisible) return;

            // Always schedule next frame first, so errors don't kill the loop
            requestAnimationFrame(animateCanvas);

            try {
                // Re-check dimensions (handles late layout)
                if (width === 0 || height === 0) {
                    resizeCanvas();
                    if (width === 0 || height === 0) return;
                }

                ctx.clearRect(0, 0, width, height);

                // Smooth mouse following
                if (mouseInitialized) {
                    currentMouseX += (mouseX - currentMouseX) * 0.05;
                    currentMouseY += (mouseY - currentMouseY) * 0.05;
                } else {
                    currentMouseX = width / 2;
                    currentMouseY = height / 2;
                }

                const parallaxOffsetX = (currentMouseX - width / 2) * 0.04;
                const parallaxOffsetY = (currentMouseY - height / 2) * 0.04;
                const activeCenterX = centerX + parallaxOffsetX;
                const activeCenterY = centerY + parallaxOffsetY;

                // Draw orbit tracks
                tracks.forEach((track) => {
                    track.angle += track.speed;

                    ctx.beginPath();
                    ctx.arc(activeCenterX, activeCenterY, track.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = track.color;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    if (orbitLineDensity > 1) {
                        ctx.beginPath();
                        ctx.arc(activeCenterX - 60, activeCenterY + 40, track.radius * 0.8, 0, Math.PI * 2);
                        ctx.strokeStyle = 'rgba(16, 165, 178, 0.03)';
                        ctx.stroke();
                    }
                });

                // Draw connector lines from center to satellites
                satellites.forEach(sat => {
                    const track = tracks[sat.trackIndex];
                    const angle = track.angle + sat.offsetAngle;
                    const satX = activeCenterX + Math.cos(angle) * track.radius;
                    const satY = activeCenterY + Math.sin(angle) * track.radius;

                    ctx.beginPath();
                    ctx.moveTo(activeCenterX, activeCenterY);
                    ctx.lineTo(satX, satY);
                    ctx.strokeStyle = 'rgba(' + sat.rgb + ', 0.03)';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                });

                // Draw satellites with glow
                const time = performance.now() * 0.002;
                satellites.forEach(sat => {
                    const track = tracks[sat.trackIndex];
                    const angle = track.angle + sat.offsetAngle;
                    const satX = activeCenterX + Math.cos(angle) * track.radius;
                    const satY = activeCenterY + Math.sin(angle) * track.radius;

                    const glowRadius = Math.max(1, sat.size + Math.sin(time + sat.offsetAngle) * 2);
                    const glowAlpha = Math.max(0.02, 0.06 + Math.sin(time) * 0.04);

                    // Outer glow
                    ctx.beginPath();
                    ctx.arc(satX, satY, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(' + sat.rgb + ', ' + glowAlpha + ')';
                    ctx.fill();

                    // Solid core
                    ctx.beginPath();
                    ctx.arc(satX, satY, Math.max(1, sat.size), 0, Math.PI * 2);
                    ctx.fillStyle = sat.color;
                    ctx.fill();
                });

                // Central hub gradient
                const hubGradient = ctx.createRadialGradient(activeCenterX, activeCenterY, 0, activeCenterX, activeCenterY, 8);
                hubGradient.addColorStop(0, '#FFFFFF');
                hubGradient.addColorStop(0.3, '#10A5B2');
                hubGradient.addColorStop(0.7, '#6D28D9');
                hubGradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(activeCenterX, activeCenterY, 8, 0, Math.PI * 2);
                ctx.fillStyle = hubGradient;
                ctx.fill();

            } catch (e) {
                // Silently continue - animation should never crash
                console.warn('Orbital canvas error:', e);
            }
        }

        // Start the animation
        animateCanvas();
    }
    // ==========================================================================
    // 8. Contact Form Submission Logic
    // ==========================================================================
    const contactForm = document.getElementById('contactBriefForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            
            // IMPORTANT: The user must replace this URL with their Google Apps Script Web App URL
            const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
            
            const formData = new FormData(contactForm);
            
            try {
                if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                    throw new Error("Google Apps Script URL is not configured yet.");
                }

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });
                
                // Show success state inline
                contactForm.innerHTML = 
                    <div style="text-align: center; padding: 3rem 1rem;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" style="margin-bottom: 1.5rem; display: inline-block;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.5rem;">Audit Request Received!</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">Thank you for your interest. Our strategists will review your details and contact you within 24 hours.</p>
                    </div>
                ;
            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.innerText = 'Error - Try Again';
                submitBtn.disabled = false;
                alert('There was an issue sending your request (ensure you have updated the GOOGLE_SCRIPT_URL in index.js). Please try again or contact us via WhatsApp.');
            }
        });
    }
});

// Mark JS as loaded for CSS fallbacks
document.body.classList.add('js-loaded');

