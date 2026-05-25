const values = [
    {
        icon: 'target',
        title: 'Transparency',
        description: 'We maintain complete transparency in all our operations and fund utilization.'
    },
    {
        icon: 'user',
        title: 'Community Focus',
        description: 'Our programs are designed with and for the communities we serve.'
    },
    {
        icon: 'eye',
        title: 'Sustainability',
        description: 'We create lasting solutions that communities can maintain independently.'
    },
    {
        icon: 'award',
        title: 'Excellence',
        description: 'We strive for excellence in every project and initiative we undertake.'
    }
];

const valuesContainer = document.getElementById('valuesContainer');

if (valuesContainer) {
    values.forEach((value, index) => {
        const delayClass = `delay-${index * 100}`;
        const cardHTML = `
            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 scroll-reveal slide-up ${delayClass}">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${value.icon}" class="h-8 w-8 text-blue-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-3">${value.title}</h3>
                <p class="text-gray-600">${value.description}</p>
            </div>
        `;
        valuesContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

const handleNavbarScroll = () => {
    const navbar = document.getElementById('navbar');
    const navLogo = document.getElementById('navLogo');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (isHomePage) {
        if (window.scrollY > 20) {
            navbar.classList.remove('bg-transparent', 'text-white');
            navbar.classList.add('bg-blue-50/95', 'text-black');
            navLogo.classList.remove('drop-shadow-lg');
            
            mobileMenuBtn.classList.remove('text-white', 'hover:bg-white/20', 'drop-shadow-md');
            mobileMenuBtn.classList.add('text-black', 'hover:bg-black/5');

            navLinks.forEach(link => {
                link.classList.remove('text-white', 'drop-shadow-md');
                link.classList.add('text-black');
            });
        } else {
            navbar.classList.add('bg-transparent', 'text-white');
            navbar.classList.remove('bg-blue-50/95', 'text-black');
            navLogo.classList.add('drop-shadow-lg');
            
            mobileMenuBtn.classList.add('text-white', 'hover:bg-white/20', 'drop-shadow-md');
            mobileMenuBtn.classList.remove('text-black', 'hover:bg-black/5');

            navLinks.forEach(link => {
                link.classList.add('text-white', 'drop-shadow-md');
                link.classList.remove('text-black');
            });
        }
    } else {
        navbar.classList.add('bg-white/95', 'text-black');
        navLogo.classList.remove('drop-shadow-lg');
        mobileMenuBtn.classList.add('text-black', 'hover:bg-black/5');
        mobileMenuBtn.classList.remove('text-white', 'hover:bg-white/20', 'drop-shadow-md');
        navLinks.forEach(link => {
            link.classList.add('text-black');
            link.classList.remove('text-white', 'drop-shadow-md');
        });
    }
};

window.addEventListener('scroll', handleNavbarScroll);
handleNavbarScroll(); 

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const menuIcon = document.getElementById('menuIcon');
const mobileMenu = document.getElementById('mobileMenu');
let isMenuOpen = false;

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

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

setTimeout(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => revealObserver.observe(el));
}, 100);

lucide.createIcons();