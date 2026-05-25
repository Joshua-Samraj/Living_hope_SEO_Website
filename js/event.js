let allEvents = [];
let selectedDate = new Date().toISOString().split('T')[0];
let currentMonthDate = new Date();
let expandedProjectId = null;

async function init() {
    const res = await fetch('data/events.json');
    allEvents = await res.json();
    renderCalendar();
    renderProjectList();
    lucide.createIcons();
}

function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    // Create a list of all event dates for quick lookup
    const eventDates = allEvents.map(e => e.date); 
    
    let html = `
        <div class="bg-white shadow-lg border p-6 rounded-3xl">
            <div class="flex justify-between items-center mb-6">
                <button onclick="changeMonth(-1)" class="p-2 hover:bg-gray-100 rounded-lg"><i data-lucide="chevron-left"></i></button>
                <span class="font-bold text-lg">${new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onclick="changeMonth(1)" class="p-2 hover:bg-gray-100 rounded-lg"><i data-lucide="chevron-right"></i></button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center">
                ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<div class="text-xs font-bold text-gray-400 py-2">${d}</div>`).join('')}
                ${Array(firstDay).fill('<div></div>').join('')}
                ${Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => {
                    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isSelected = dateStr === selectedDate;
                    const hasEvent = eventDates.includes(dateStr);
                    
                    return `
                        <button onclick="selectDate('${dateStr}')" class="relative h-10 w-10 flex flex-col items-center justify-center rounded-full transition-all ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}">
                            <span class="text-sm font-semibold">${day}</span>
                            ${hasEvent ? '<span class="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>' : ''}
                        </button>`;
                }).join('')}
            </div>
        </div>
    `;
    container.innerHTML = html;
}

window.selectDate = (date) => {
    selectedDate = date;
    renderCalendar();
    renderProjectList();
    lucide.createIcons();
};

window.changeMonth = (delta) => {
    currentMonthDate.setMonth(currentMonthDate.getMonth() + delta);
    renderCalendar();
    lucide.createIcons();
};

function toggleProject(id) {
    expandedProjectId = (expandedProjectId === id) ? null : id;
    renderProjectList();
    lucide.createIcons();
}

function renderProjectList() {
    const list = document.getElementById('projectList');
    // Ensure allEvents is filtered and sorted
    const filtered = allEvents.filter(p => p.date >= selectedDate).sort((a,b) => a.date.localeCompare(b.date));
    
    document.getElementById('selectedDateText').innerText = `Showing projects from ${selectedDate}`;
    
    list.innerHTML = filtered.length ? filtered.map(p => {
        const isExp = expandedProjectId === p.id;
        
        // Define pDate inside the map so it scopes properly to the current item
        const pDate = new Date(p.date); 
        
        // Date badge fallback if there is no image
        const dateBadgeHTML = `
            <div class="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                <span class="text-[9px] font-bold text-gray-400 uppercase leading-none">
                    ${pDate.toLocaleString('default', { month: 'short' })}
                </span>
                <span class="text-xl font-black text-gray-900 leading-none mt-1">
                    ${pDate.getDate()}
                </span>
            </div>
        `;
        
        return `
        <div class="p-6 rounded-2xl border border-gray-100 bg-gray-50/40 hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    ${p.imageUrl 
                        ? `<img src="${p.imageUrl}" class="w-16 h-16 rounded-xl object-cover border shadow-sm" onerror="this.src='placeholder.jpg'" />` 
                        : dateBadgeHTML 
                    }
                    <div>
                        <span class="text-[10px] px-2 py-1 rounded-full ${p.theme}">${p.category}</span>
                        <h4 class="font-bold text-lg">${p.title}</h4>
                    </div>
                </div>
                
                <button onclick="toggleProject(${p.id})" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs hover:bg-blue-50 hover:text-blue-600 transition-all">
                    ${isExp ? 'Hide' : 'View'}
                </button>
            </div>
            
            <div class="collapsible-content ${isExp ? 'expanded' : ''}">
                <div class="pt-4 mt-4 border-t border-gray-100">
                    <p class="text-sm text-gray-600 mb-4">${p.detailedExplanation}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border px-3 py-1.5 rounded-lg">
                            <i data-lucide="map-pin" class="w-3 h-3 text-blue-500"></i> ${p.location}
                        </div>
                        <button class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs shadow-lg active:scale-95 transition-transform">Support Now</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('') : '<p class="text-center py-10 text-gray-400">No upcoming projects for this date.</p>';
}

init();