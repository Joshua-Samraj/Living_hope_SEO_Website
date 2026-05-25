lucide.createIcons();

const navbar = document.getElementById('navbar');
const navLogo = document.getElementById('navLogo');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const menuIcon = document.getElementById('menuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
let isMenuOpen = false;

const navHoverStyles = {
    'about': 'hover:bg-emerald-100 hover:text-emerald-700',
    'projects': 'hover:bg-purple-100 hover:text-purple-700',
    'events': 'hover:bg-orange-100 hover:text-orange-700',
    'donation': 'hover:bg-rose-100 hover:text-rose-700',
    'volunteer': 'hover:bg-teal-100 hover:text-teal-700',
    'gallery': 'hover:bg-indigo-100 hover:text-indigo-700'
};

const handleScroll = () => {
    if (window.scrollY > 20) {
        navbar.classList.remove('bg-transparent', 'text-white');
        navbar.classList.add('bg-blue-50/95', 'text-black');
        navLogo.classList.remove('drop-shadow-lg');
        
        mobileMenuBtn.classList.remove('text-white', 'hover:bg-white/20', 'drop-shadow-md');
        mobileMenuBtn.classList.add('text-black', 'hover:bg-black/5');

        mobileMenu.classList.remove('bg-black/80', 'backdrop-blur-xl');
        mobileMenu.classList.add('bg-blue-50');

        navLinks.forEach(link => {
            link.classList.remove('text-white', 'hover:text-blue-200', 'drop-shadow-md');
            link.classList.add('text-black');
            const hrefKey = link.getAttribute('href').replace('/', '');
            if(navHoverStyles[hrefKey]) {
                navHoverStyles[hrefKey].split(' ').forEach(cls => link.classList.add(cls));
            }
        });

        mobileNavLinks.forEach(link => {
            link.className = 'block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 text-black mobile-nav-link';
            const hrefKey = link.getAttribute('href').replace('/', '');
            if(navHoverStyles[hrefKey]) {
                navHoverStyles[hrefKey].split(' ').forEach(cls => link.classList.add(cls));
            }
        });

    } else {
        navbar.classList.add('bg-transparent', 'text-white');
        navbar.classList.remove('bg-blue-50/95', 'text-black');
        navLogo.classList.add('drop-shadow-lg');
        
        mobileMenuBtn.classList.add('text-white', 'hover:bg-white/20', 'drop-shadow-md');
        mobileMenuBtn.classList.remove('text-black', 'hover:bg-black/5');

        mobileMenu.classList.add('bg-black/80', 'backdrop-blur-xl');
        mobileMenu.classList.remove('bg-blue-50');

        navLinks.forEach(link => {
            link.classList.add('text-white', 'hover:text-blue-200', 'drop-shadow-md');
            link.classList.remove('text-black');
            const hrefKey = link.getAttribute('href').replace('/', '');
            if(navHoverStyles[hrefKey]) {
                navHoverStyles[hrefKey].split(' ').forEach(cls => link.classList.remove(cls));
            }
        });

        mobileNavLinks.forEach(link => {
            link.className = 'block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 text-gray-200 hover:text-white hover:bg-white/10 mobile-nav-link';
        });
    }
};

window.addEventListener('scroll', handleScroll);
handleScroll();

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menuIcon.setAttribute('data-lucide', 'x');
            mobileMenu.style.height = mobileMenu.scrollHeight + 'px';
            mobileMenu.style.opacity = '1';
            mobileMenu.style.pointerEvents = 'auto';
        } else {
            menuIcon.setAttribute('data-lucide', 'menu');
            mobileMenu.style.height = '0px';
            mobileMenu.style.opacity = '0';
            mobileMenu.style.pointerEvents = 'none';
        }
        lucide.createIcons();
    });
}

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        menuIcon.setAttribute('data-lucide', 'menu');
        mobileMenu.style.height = '0px';
        mobileMenu.style.opacity = '0';
        mobileMenu.style.pointerEvents = 'none';
        lucide.createIcons();
    });
});

const ENABLE_COSMIC_ANIMATION = true;
if (ENABLE_COSMIC_ANIMATION) {
    const canvas = document.getElementById('cosmicCanvas');
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;
    const connectDistance = isMobile ? 100 : 150;
    const particleSpeed = 0.5;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - distance / connectDistance;
                    ctx.strokeStyle = `rgba(37, 99, 235, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();
}

const heroImages = [
    "/image/projects/gallery/good_samariten/patti.jpeg",
];

const emergencyImages = [
    "image/projects/gallery/good_samariten/patti.jpeg",
    "image/projects/gallery/good_samariten/(1).jpg",
    "image/projects/gallery/good_samariten/(1).png",
];

let currentImageIndex = 0;
const heroImageEl = document.getElementById('heroImage');
if (heroImages.length > 1 && heroImageEl) {
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        heroImageEl.style.opacity = 0;
        setTimeout(() => {
            heroImageEl.src = heroImages[currentImageIndex];
            heroImageEl.style.opacity = 1;
        }, 500);
    }, 5000);
}

let currentEmergencyImageIndex = 0;
const emergencyImageEl = document.getElementById('emergencyImage');
if (emergencyImages.length > 0 && emergencyImageEl) {
    setInterval(() => {
        currentEmergencyImageIndex = (currentEmergencyImageIndex + 1) % emergencyImages.length;
        emergencyImageEl.style.opacity = 0;
        setTimeout(() => {
            emergencyImageEl.src = emergencyImages[currentEmergencyImageIndex];
            emergencyImageEl.style.opacity = 1;
        }, 500);
    }, 4000);
}

const shareButton = document.getElementById('shareButton');
const shareIcon = document.getElementById('shareIcon');
if (shareButton) {
    shareButton.addEventListener('click', async () => {
        const url = `${window.location.origin}${window.location.pathname}#emergency`;
        const shareData = {
            title: 'Emergency Need - Living Hope Charitable Trust',
            text: 'Your immediate support is required for our critical development project.',
            url: url
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {}
        } else {
            navigator.clipboard.writeText(url);
            shareIcon.setAttribute('data-lucide', 'check');
            shareIcon.classList.add('text-green-500');
            lucide.createIcons();
            setTimeout(() => {
                shareIcon.setAttribute('data-lucide', 'share-2');
                shareIcon.classList.remove('text-green-500');
                lucide.createIcons();
            }, 2000);
        }
    });
}

const landToggle = document.getElementById('landDetailsToggle');
const summaryText = document.getElementById('summaryText');
const detailsContent = document.getElementById('detailsContent');
const chevronIcon = document.getElementById('chevronIcon');
let showLandDetails = false;

if (landToggle) {
    landToggle.addEventListener('click', () => {
        showLandDetails = !showLandDetails;
        if (showLandDetails) {
            chevronIcon.classList.add('rotate-90');
            summaryText.classList.add('hidden', 'opacity-0');
            summaryText.classList.remove('opacity-100', 'h-auto');
            detailsContent.classList.remove('hidden', 'h-0', 'opacity-0');
            detailsContent.classList.add('opacity-100', 'h-auto');
        } else {
            chevronIcon.classList.remove('rotate-90');
            detailsContent.classList.add('hidden', 'h-0', 'opacity-0');
            detailsContent.classList.remove('opacity-100', 'h-auto');
            summaryText.classList.remove('hidden', 'opacity-0');
            summaryText.classList.add('opacity-100', 'h-auto');
        }
    });
}

const targetAmount = 15000000;
const currentAmount = 100000;
const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const currentAmountEl = document.getElementById('currentAmountText');
const progressTextEl = document.getElementById('progressText');
const supporterCountEl = document.getElementById('supporterCount');

if (currentAmountEl) currentAmountEl.textContent = formatCurrency(currentAmount);
if (progressTextEl) progressTextEl.textContent = progressPercentage.toFixed(1);
if (supporterCountEl) supporterCountEl.textContent = Math.floor(currentAmount / 2500);

const progressBar = document.getElementById('progressBar');
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                progressBar.style.width = `${progressPercentage}%`;
            }, 200);
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (progressBar) {
    barObserver.observe(progressBar);
}

const projectsContainer = document.getElementById('projectsContainer');
const setupAutoScroll = (container, speed) => {
    if (!container) return;
    let interval;
    const startScroll = () => {
        interval = setInterval(() => {
            if (container.scrollWidth > container.clientWidth) {
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScroll - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const child = container.firstElementChild;
                    const scrollAmount = child ? child.offsetWidth + 16 : container.clientWidth * 0.8;
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, speed);
    };

    startScroll();

    container.addEventListener('mouseenter', () => clearInterval(interval));
    container.addEventListener('mouseleave', startScroll);
    container.addEventListener('touchstart', () => clearInterval(interval), { passive: true });
    container.addEventListener('touchend', startScroll);
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

if (projectsContainer) {
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const featuredProjectIds = ['1', '15', '24'];
            const featuredProjects = projects.filter(project => featuredProjectIds.includes(project.id));
            
            featuredProjects.forEach(project => {
                const statusColor = project.status === 'completed' ? 'bg-green-100/90 text-green-800'
                    : project.status === 'active' ? 'bg-blue-100/90 text-blue-800'
                    : 'bg-orange-100/90 text-orange-800';

                const cardHTML = `
                    <div class="min-w-[85vw] sm:min-w-[45vw] md:min-w-0 snap-center scroll-reveal">
                        <a href="/projects/${project.category.toLowerCase()}" class="bg-gray-600 text-white rounded-xl shadow-md overflow-hidden text-left flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div class="relative h-40 md:h-48 w-full">
                                <img src="${project.image}" alt="${project.title}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                <div class="absolute top-2 right-2 md:top-3 md:right-3">
                                    <span class="px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold shadow-sm backdrop-blur-md ${statusColor}">
                                        ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div class="p-4 md:p-5 flex flex-col flex-grow">
                                <span class="text-[10px] md:text-xs font-bold text-blue-300 uppercase mb-1.5 md:mb-2 tracking-wider">${project.category}</span>
                                <h4 class="font-bold text-base md:text-lg mb-1.5 md:mb-2 text-white line-clamp-1 md:line-clamp-2">${project.title}</h4>
                                <p class="text-gray-200 text-xs md:text-sm flex-grow line-clamp-2 mb-3">${project.description}</p>
                                <div class="mt-auto pt-3 border-t border-gray-500 flex justify-between items-center text-xs md:text-sm">
                                    <span class="text-gray-300 flex items-center">
                                        <i data-lucide="calendar" class="w-3 h-3 md:w-4 md:h-4 mr-1"></i>
                                        <span class="truncate max-w-[120px]">${project.date}</span>
                                    </span>
                                    <span class="text-blue-300 font-medium flex items-center group-hover:underline">
                                        Details <i data-lucide="chevron-right" class="w-3 h-3 ml-0.5"></i>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
            lucide.createIcons();
            setupAutoScroll(projectsContainer, 4000);
            
            const revealElements = document.querySelectorAll('.scroll-reveal');
            revealElements.forEach(el => revealObserver.observe(el));
        })
        .catch(error => console.error('Error fetching projects:', error));
} else {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => revealObserver.observe(el));
}