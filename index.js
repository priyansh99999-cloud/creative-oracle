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
    
    const preloaderSeen = sessionStorage.getItem('oracle_preloader_seen');
    
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
        
        sessionStorage.setItem('oracle_preloader_seen', 'true');
        
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
    // 11. Canvas Math Orbit Render Loop
    // ==========================================================================
    const canvas = document.getElementById('orbitalCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let centerX, centerY;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            
            if (window.innerWidth < 992) {
                centerX = width * 0.5;
                centerY = height * 0.5;
            } else {
                centerX = width * 0.68;
                centerY = height * 0.5;
            }
        };

        resizeCanvas();
        
        let mouseX = width / 2;
        let mouseY = height / 2;
        let currentMouseX = width / 2;
        let currentMouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        window.addEventListener('resize', resizeCanvas);
        
        // Define Canvas parameter settings corresponding to the loaded html filename
        const pageName = window.location.pathname.split('/').pop().replace('.html', '');
        let rotationScale = 1.0;
        let orbitLineDensity = 1.0;

        // Customise canvas physics depending on theme pages
        if (pageName === 'process') {
            rotationScale = 0.5; // Slow, precise analytics speed
            orbitLineDensity = 0.6; 
        } else if (pageName === 'about') {
            rotationScale = 0.75;
            orbitLineDensity = 1.4; // Rich structural overlaps
        } else if (pageName === 'contact') {
            rotationScale = 1.8; // High energy campaign velocity
            orbitLineDensity = 0.8;
        }

        const tracks = [
            { radius: 130, speed: 0.008 * rotationScale, color: 'rgba(109, 40, 217, 0.09)', angle: 0 }, // Purple
            { radius: 240, speed: -0.005 * rotationScale, color: 'rgba(16, 165, 178, 0.08)', angle: Math.PI / 4 }, // Teal
            { radius: 360, speed: 0.003 * rotationScale, color: 'rgba(247, 160, 114, 0.06)', angle: Math.PI / 2 }, // Peach
            { radius: 500, speed: -0.002 * rotationScale, color: 'rgba(20, 113, 155, 0.05)', angle: Math.PI } // Blue
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

        const animateCanvas = () => {
            if (!isCanvasVisible) return; // Stop rendering completely when canvas is out of view!

            ctx.clearRect(0, 0, width, height);

            currentMouseX += (mouseX - currentMouseX) * 0.05;
            currentMouseY += (mouseY - currentMouseY) * 0.05;

            const parallaxOffsetX = (currentMouseX - width / 2) * 0.04;
            const parallaxOffsetY = (currentMouseY - height / 2) * 0.04;
            const activeCenterX = centerX + parallaxOffsetX;
            const activeCenterY = centerY + parallaxOffsetY;

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
                    ctx.strokeStyle = 'rgba(16, 165, 178, 0.005)';
                    ctx.stroke();
                }
            });

            satellites.forEach(sat => {
                const track = tracks[sat.trackIndex];
                const angle = track.angle + sat.offsetAngle;
                const satX = activeCenterX + Math.cos(angle) * track.radius;
                const satY = activeCenterY + Math.sin(angle) * track.radius;

                ctx.beginPath();
                ctx.moveTo(activeCenterX, activeCenterY);
                ctx.lineTo(satX, satY);
                ctx.strokeStyle = `rgba(${sat.rgb}, 0.025)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });

            satellites.forEach(sat => {
                const track = tracks[sat.trackIndex];
                const angle = track.angle + sat.offsetAngle;
                const satX = activeCenterX + Math.cos(angle) * track.radius;
                const satY = activeCenterY + Math.sin(angle) * track.radius;

                const time = performance.now() * 0.002;
                const glowRadius = sat.size + Math.sin(time + sat.offsetAngle) * 3;

                ctx.beginPath();
                ctx.arc(satX, satY, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${sat.rgb}, ${0.05 + Math.sin(time) * 0.05})`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(satX, satY, sat.size, 0, Math.PI * 2);
                ctx.fillStyle = sat.color;
                ctx.fill();
            });

            // Draw central oracle hub node core as radial multicolor gradient
            const hubGradient = ctx.createRadialGradient(activeCenterX, activeCenterY, 0, activeCenterX, activeCenterY, 8);
            hubGradient.addColorStop(0, '#FFFFFF');
            hubGradient.addColorStop(0.3, '#10A5B2'); // Teal
            hubGradient.addColorStop(0.7, '#6D28D9'); // Purple
            hubGradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(activeCenterX, activeCenterY, 8, 0, Math.PI * 2);
            ctx.fillStyle = hubGradient;
            ctx.fill();

            requestAnimationFrame(animateCanvas);
        };

        animateCanvas();
    }
});
