let globalProjects = [];
let globalCategories = [];

const loadData = async () => {
    try {
        const [projectsRes, categoriesRes] = await Promise.all([
            fetch('../data/projects.json'),
            fetch('../data/categories.json')
        ]);
        globalProjects = await projectsRes.json();
        globalCategories = await categoriesRes.json();
        
        initPage();
    } catch (error) {
        console.error("Error loading data:", error);
    }
};

const initPage = () => {
    if (CURRENT_CATEGORY) {
        setupCategoryPage();
    } else {
        setupMainPage();
    }
    
    setTimeout(() => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealObserver.observeElements(revealElements);
    }, 100);
};

const setupMainPage = () => {
    const catsGrid = document.getElementById('categoriesGrid');
    catsGrid.classList.remove('hidden');
    
    const counts = {};
    globalCategories.forEach(cat => {
        counts[cat.keyword] = globalProjects.filter(p => p.category === cat.keyword).length;
    });

    globalCategories.forEach((cat, index) => {
        const delay = `delay-${(index % 4) * 100}`;
        const count = counts[cat.keyword] || 0;
        const text = count === 1 ? 'Project' : 'Projects';
        
        const card = `
            <div class="scroll-reveal slide-up ${delay}">
                <a href="/projects/${cat.keyword}.html" class="block relative overflow-hidden rounded-2xl shadow-lg group hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                    <div class="absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90"></div>
                    <div class="relative z-10 px-8 pb-8 text-white h-full flex flex-col">
                        <div class="-mx-8 relative w-auto aspect-[16/9] overflow-hidden rounded-t-lg group">
                            <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105" />
                        </div>
                        <h3 class="text-2xl font-bold mb-2 mt-4">${cat.name}</h3>
                        <p class="text-white/90 mb-4 line-clamp-2 flex-grow">${cat.description}</p>
                        <div class="flex items-center justify-between mt-auto">
                            <span class="text-sm font-medium bg-white/20 px-2 py-1 rounded-full text-center">
                                ${count} ${text}
                            </span>
                            <div class="flex items-center gap-2 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1">
                                View Projects <i data-lucide="arrow-right" class="h-4 w-4"></i>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </a>
            </div>
        `;
        catsGrid.insertAdjacentHTML('beforeend', card);
    });
    lucide.createIcons();
};

const setupCategoryPage = () => {
    const cat = globalCategories.find(c => c.keyword === CURRENT_CATEGORY);
    
    // 1. Update Left Side (Title & Description)
    if (cat) {
        const titleEl = document.getElementById('headerTitle');
        titleEl.textContent = cat.name;
        // Dynamic font size for long titles
        if (cat.name.length > 20) {
            titleEl.className = 'font-bold leading-tight text-2xl sm:text-3xl md:text-5xl scroll-reveal slide-up';
        }

        const descEl = document.getElementById('headerDesc');
        descEl.textContent = cat.description;
        // Dynamic font size for long descriptions
        if (cat.description.length > 150) {
            descEl.className = 'text-gray-300 max-w-lg leading-relaxed line-clamp-4 md:line-clamp-none text-sm md:text-base scroll-reveal slide-up delay-200';
        }

        if(cat.banner) {
            document.getElementById('headerImage').src = cat.banner;
        }
    }

    // 2. Populate Right Side (Featured Latest Project)
    const categoryProjects = globalProjects.filter(p => p.category === CURRENT_CATEGORY).reverse();
    const featuredContainer = document.getElementById('featuredProjectContainer');
    
    if (categoryProjects.length > 0 && featuredContainer) {
        const featured = categoryProjects[0]; // Get the latest project
        
        featuredContainer.innerHTML = `
            <div onclick='openModal(${JSON.stringify(featured).replace(/'/g, "&#39;")})' class="group cursor-pointer relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <div class="relative h-60 overflow-hidden rounded-xl mb-4">
                    <img src="${featured.image}" alt="${featured.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-[10px] text-white rounded-full">
                        Featured Project
                    </div>
                </div>
                <h3 class="font-bold text-white mb-2 transition-all ${featured.title.length > 25 ? 'text-lg' : 'text-xl'}">
                    ${featured.title}
                </h3>
                <p class="text-gray-300 text-xs sm:text-sm line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
                    ${featured.description}
                </p>
                <div class="mt-4 flex items-center text-blue-400 font-medium text-xs group-hover:text-blue-300">
                    View Details &rarr;
                </div>
            </div>
        `;
    }

    // 3. Show Grid and setup filters
    document.getElementById('filterSection').classList.remove('hidden');
    document.getElementById('projectsGrid').classList.remove('hidden');

    renderFilteredProjects();

    document.getElementById('searchInput').addEventListener('input', renderFilteredProjects);
    document.getElementById('statusFilter').addEventListener('change', renderFilteredProjects);
};

const renderFilteredProjects = () => {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const grid = document.getElementById('projectsGrid');
    const noMsg = document.getElementById('noProjectsMessage');

    grid.innerHTML = '';
    
    const filtered = globalProjects.filter(p => {
        const catMatch = p.category === CURRENT_CATEGORY;
        const searchMatch = p.title.toLowerCase().includes(search) || 
                            p.category.toLowerCase().includes(search) || 
                            p.description.toLowerCase().includes(search);
        const statusMatch = status === 'all' || p.status === status;
        
        return catMatch && searchMatch && statusMatch;
    });

    if (filtered.length === 0) {
        grid.classList.add('hidden');
        noMsg.classList.remove('hidden');
    } else {
        grid.classList.remove('hidden');
        noMsg.classList.add('hidden');

        filtered.forEach((p, i) => {
            let statusColor = 'bg-gray-100 text-gray-800';
            if (p.status === 'active') statusColor = 'bg-green-100 text-green-800';
            if (p.status === 'completed') statusColor = 'bg-blue-100 text-blue-800';
            if (p.status === 'upcoming') statusColor = 'bg-yellow-100 text-yellow-800';

            const card = `
                <div class="scroll-reveal slide-up delay-${(i % 3) * 100}">
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:-translate-y-1 hover:scale-102 transition-all duration-300 h-full flex flex-col" onclick='openModal(${JSON.stringify(p).replace(/'/g, "&#39;")})'>
                        <div class="relative h-48 overflow-hidden shrink-0">
                            <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            <div class="absolute top-4 right-4">
                                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                                    ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">${p.title}</h3>
                            <p class="text-gray-600 mb-4 line-clamp-2">${p.fullDescription}</p>
                            <div class="space-y-2 text-sm text-gray-500 mt-auto">
                                <div class="flex items-center"><i data-lucide="users" class="h-4 w-4 mr-2"></i><span>${p.beneficiaries} beneficiaries</span></div>
                                <div class="flex items-center"><i data-lucide="map-pin" class="h-4 w-4 mr-2"></i><span>${p.location}</span></div>
                                <div class="flex items-center"><i data-lucide="calendar" class="h-4 w-4 mr-2"></i><span>${p.date}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', card);
        });
        lucide.createIcons();
    }
    
    setTimeout(() => {
        const reveals = grid.querySelectorAll('.scroll-reveal');
        revealObserver.observeElements(reveals);
    }, 50);
};

const openModal = (project) => {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    
    document.getElementById('modalImg').src = project.image;
    document.getElementById('modalTitle').textContent = project.title;
    
    const statusEl = document.getElementById('modalStatus');
    let statusColor = 'bg-gray-100 text-gray-800';
    let iconHTML = '';
    if (project.status === 'active') statusColor = 'bg-green-100 text-green-800';
    if (project.status === 'completed') {
        statusColor = 'bg-blue-100 text-blue-800';
        iconHTML = `<i data-lucide="check-circle" class="h-5 w-5"></i>`;
    }
    if (project.status === 'upcoming') statusColor = 'bg-yellow-100 text-yellow-800';
    
    statusEl.className = `px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusColor}`;
    statusEl.innerHTML = `${iconHTML} ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}`;
    
    document.getElementById('modalBen').textContent = `${project.beneficiaries} beneficiaries`;
    document.getElementById('modalLoc').textContent = project.location;
    document.getElementById('modalDate').textContent = project.date;
    document.getElementById('modalDesc').textContent = project.fullDescription;
    
    const supportSec = document.getElementById('modalSupportSection');
    if(project.status) {
        supportSec.classList.remove('hidden');
        document.getElementById('modalLink').href = project.link;
    } else {
        supportSec.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    lucide.createIcons();
    document.body.style.overflow = 'hidden';
};

const closeModal = (e) => {
    if (e && e.target !== document.getElementById('projectModal') && !e.target.closest('button')) return;
    
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
};

const revealObserver = {
    obs: new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }),
    
    observeElements: function(elements) {
        elements.forEach(el => this.obs.observe(el));
    }
};

loadData();