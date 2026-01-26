// Intelligence Vault Data
let intelligenceTools = [];

// Parent-Child Category Mapping
const categoryMapping = {
    general: {
        name: "General",
        icon: "fas fa-home",
        children: {
            "all-tools": "All Tools",
            "favorites": "Favorites",
            "recently-added": "Recently Added",
            "most-used": "Most Used"
        }
    },
    osint: {
        name: "OSINT & Investigation",
        icon: "fas fa-search-location",
        children: {
            "search-engines": "Search Engines",
            "social-media": "Social Media Intelligence",
            "people-search": "People Search",
            "email-investigation": "Email Investigation",
            "phone-investigation": "Phone Investigation",
            "username-investigation": "Username Investigation",
            "domain-investigation": "Domain Investigation",
            "image-investigation": "Image Investigation",
            "geolocation": "Geolocation",
            "dark-web": "Dark Web",
            "breach-data": "Breach Data",
            "public-records": "Public Records"
        }
    },
    "digital-forensics": {
        name: "Digital Forensics",
        icon: "fas fa-microscope",
        children: {
            "disk-analysis": "Disk Analysis",
            "memory-analysis": "Memory Analysis",
            "mobile-forensics": "Mobile Forensics",
            "network-forensics": "Network Forensics",
            "timeline-analysis": "Timeline Analysis",
            "artifact-analysis": "Artifact Analysis",
            "file-recovery": "File Recovery",
            "metadata-analysis": "Metadata Analysis",
            "registry-analysis": "Registry Analysis",
            "log-analysis": "Log Analysis"
        }
    },
    "malware-analysis": {
        name: "Malware Analysis",
        icon: "fas fa-virus",
        children: {
            "file-analysis": "File Analysis",
            "dynamic-analysis": "Dynamic Analysis",
            "static-analysis": "Static Analysis",
            "sandboxes": "Sandboxes",
            "reverse-engineering": "Reverse Engineering",
            "hash-lookup": "Hash Lookup",
            "yara-rules": "YARA Rules",
            "decompilers": "Decompilers",
            "debuggers": "Debuggers",
            "hex-editors": "Hex Editors"
        }
    },
    "network-security": {
        name: "Network Security",
        icon: "fas fa-network-wired",
        children: {
            "packet-analysis": "Packet Analysis",
            "network-scanning": "Network Scanning",
            "vulnerability-scanning": "Vulnerability Scanning",
            "port-scanning": "Port Scanning",
            "ssl-analysis": "SSL Analysis",
            "dns-analysis": "DNS Analysis",
            "ip-analysis": "IP Analysis",
            "url-analysis": "URL Analysis",
            "traffic-analysis": "Traffic Analysis",
            "intrusion-detection": "Intrusion Detection"
        }
    },
    "threat-intelligence": {
        name: "Threat Intelligence",
        icon: "fas fa-shield-alt",
        children: {
            "ioc-analysis": "IOC Analysis",
            "threat-feeds": "Threat Feeds",
            "threat-hunting": "Threat Hunting",
            "attribution": "Attribution",
            "threat-sharing": "Threat Sharing",
            "vulnerability-research": "Vulnerability Research",
            "exploit-databases": "Exploit Databases",
            "threat-reports": "Threat Reports",
            "apt-tracking": "APT Tracking",
            "campaign-tracking": "Campaign Tracking"
        }
    },
    "incident-response": {
        name: "Incident Response",
        icon: "fas fa-exclamation-triangle",
        children: {
            "case-management": "Case Management",
            "evidence-collection": "Evidence Collection",
            "containment": "Containment",
            "eradication": "Eradication",
            "recovery": "Recovery",
            "communication": "Communication",
            "documentation": "Documentation",
            "lessons-learned": "Lessons Learned",
            "playbooks": "Playbooks",
            "automation": "Automation"
        }
    },
    "compliance": {
        name: "Compliance & Legal",
        icon: "fas fa-balance-scale",
        children: {
            "vulnerability-assessment": "Vulnerability Assessment",
            "compliance-scanning": "Compliance Scanning",
            "audit-tools": "Audit Tools",
            "policy-management": "Policy Management",
            "risk-assessment": "Risk Assessment",
            "legal-tools": "Legal Tools",
            "evidence-preservation": "Evidence Preservation",
            "chain-of-custody": "Chain of Custody",
            "reporting": "Reporting",
            "certification": "Certification"
        }
    }
};

// Current filters and state
let currentFilters = {
    category: 'all',
    region: 'all',
    threatLevel: 'all',
    search: ''
};


// Vault state
let currentParentTab = 'general';
let currentChildTab = 'all-tools';
// Multi-Vault variables
let vaults = [];
let currentVaultId = null;
let currentVaultParentTab = 'general';
let currentVaultChildTab = 'all-entries';
let currentVaultView = 'grid';
let selectedEntries = new Set();
let isEditingEntry = false;
let editingEntryId = null;
let entryToDelete = null;

let selectedTools = new Set();
let filteredTools = [...intelligenceTools];
let editingToolId = null;
let deleteTargetId = null;
let deleteTargetType = 'single'; // 'single' or 'bulk'

// Initialize global variables
let currentView = 'grid'; // For vault view toggle
let currentDashboardView = 'dashboard'; // For main navigation
let vaultEntries = [];


function showSection(sectionName) {
    // --- START MODAL CLOSING LOGIC (refined) ---
    // Centralized modal closing, now robust for all modals
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
        if (modal.style.display === 'flex') { // Check if modal is actually open
            // Attempt to find a specific close function or fall back to general hide
            if (modal.id === 'note-modal' && window.investigationNotes) {
                window.investigationNotes.closeNoteModal();
            } else if (modal.id === 'note-detail-modal' && window.investigationNotes) {
                window.investigationNotes.closeNoteDetailModal();
            } else if (modal.id.startsWith('playbook-') && window.blueTeamPlaybook) {
                // Playbook modals
                if (modal.id === 'playbook-chapter-modal') window.blueTeamPlaybook.closeChapterModal();
                else if (modal.id === 'playbook-section-modal') window.blueTeamPlaybook.closeSectionModal();
                else if (modal.id === 'playbook-entry-modal') window.blueTeamPlaybook.closeEntryModal();
                else if (modal.id === 'playbook-delete-confirm-modal') window.blueTeamPlaybook.closeDeleteConfirmModal();
            } else if (modal.id.startsWith('tracelink-') && window.traceLinkManager) {
                // TraceLink modals
                if (modal.id === 'tracelink-add-node-modal') window.traceLinkManager.closeAddNodeModal();
                else if (modal.id === 'tracelink-edit-label-modal') window.traceLinkManager.closeEditLabelModal();
                else if (modal.id === 'tracelink-import-modal') window.traceLinkManager.closeImportModal();
                else if (modal.id === 'tracelink-confirm-delete-modal') window.traceLinkManager.closeConfirmDeleteModal();
            } else {
                // Fallback for other modals if no specific close function is needed
                modal.style.display = 'none';
                if (modal.id === 'deleteModal') { // Generic delete modal cleanup
                    deleteTargetId = null;
                    deleteTargetType = 'single';
                }
            }
        }
    });

    // Hide context menu for TraceLink if open
    if (window.traceLinkManager && document.getElementById('tracelink-context-menu')?.style.display === 'block') {
        window.traceLinkManager.hideContextMenu();
        window.traceLinkManager._cancelConnectionMode(); // Cancel connection mode explicitly
    }
    // --- END MODAL CLOSING LOGIC ---


    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');

        // Load section-specific content
        if (sectionName === 'investigation-notes') {
            if (window.investigationNotes) {
                window.investigationNotes.renderNotes();
                window.investigationNotes.updateEmptyState();
            } else {
                window.investigationNotes = new InvestigationNotes();
                window.investigationNotes.renderNotes();
                window.investigationNotes.updateEmptyState();
            }
        } else if (sectionName === 'cheatsheets') {
            if (window.cheatsheetsManager) {
                window.cheatsheetsManager.loadCheatsheets();
            } else {
                window.cheatsheetsManager = new CheatsheetsManager();
                window.cheatsheetsManager.loadCheatsheets();
            }
        } else if (sectionName === 'tracelink') {
            const tracelinkPlaceholder = document.getElementById('tracelink-content-placeholder');
            if (!tracelinkPlaceholder) {
                console.error("TraceLink content placeholder not found!");
                return;
            }

            if (!tracelinkPlaceholder.dataset.loaded) { // Only load HTML once
                fetch('tracelink.html')
                    .then(response => response.text())
                    .then(html => {
                        tracelinkPlaceholder.innerHTML = html;
                        tracelinkPlaceholder.dataset.loaded = 'true'; // Mark as loaded
                        // Initialize TraceLinkManager AFTER its HTML is in the DOM
                        if (typeof cytoscape !== 'undefined' && typeof window.multiVaultManager !== 'undefined' && typeof window.multiVaultManager.getVaults === 'function') {
                            if (!window.traceLinkManager) { // Only create new instance if it doesn't exist
                                window.traceLinkManager = new TraceLinkManager();
                            }
                            window.traceLinkManager.init(); // Call its new init method
                        } else {
                            // Fallback if Cytoscape or MultiVaultManager aren't ready
                            console.log("Cytoscape or MultiVaultManager not yet ready for TraceLink. Setting up listener.");
                            const initTraceLinkOnReady = () => {
                                if (typeof cytoscape !== 'undefined' && typeof window.multiVaultManager !== 'undefined' && typeof window.multiVaultManager.getVaults === 'function') {
                                    if (!window.traceLinkManager) {
                                        window.traceLinkManager = new TraceLinkManager();
                                    }
                                    window.traceLinkManager.init();
                                    document.removeEventListener('multiVaultManagerReady', initTraceLinkOnReady); // Clean up listener
                                }
                            };
                            document.addEventListener('multiVaultManagerReady', initTraceLinkOnReady);
                        }
                    })
                    .catch(error => {
                        console.error('Error loading tracelink.html:', error);
                        tracelinkPlaceholder.innerHTML = '<div style="color:red;text-align:center;padding:2rem;">Failed to load TraceLink content. Please check console for errors.</div>';
                    });
            } else if (window.traceLinkManager) {
                // If HTML is already loaded and manager exists, just re-render tabs
                window.traceLinkManager.renderTraceLinkTabs();
            }
        } else if (sectionName === 'dashboard') {
            loadDashboard();
        } else if (sectionName === 'import') {
            loadImportSection();
        } else if (sectionName === 'vault') {
            loadVaultSection();
        } else if (sectionName === 'blueteam-playbook') {
            if (window.blueTeamPlaybook) {
                window.blueTeamPlaybook.initializeUI();
            }
        } else if (sectionName === 'multi-vault') { // Re-render multi-vault when navigating to it directly
            renderVaultTabs();
        }
        
    }

    // Update nav links - find the nav item that corresponds to this section
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(navItem => {
        const onclickAttr = navItem.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`showSection('${sectionName}')`)) {
            navItem.classList.add('active');
        }
    });
}


function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.warn('Notification container not found.');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';

    notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconClass} notification-icon"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const autoRemoveTimeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            notification.classList.add('slide-out');
            notification.addEventListener('transitionend', function handler() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                notification.removeEventListener('transitionend', handler);
            });
        }
    }, duration);

    notification.querySelector('.notification-close').onclick = () => {
        clearTimeout(autoRemoveTimeout);
        notification.classList.remove('show');
        notification.classList.add('slide-out');
        notification.addEventListener('transitionend', function handler() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            notification.removeEventListener('transitionend', handler);
        });
    };
}
window.showNotification = showNotification;

// --- Streamlined Generic Delete Confirmation Modal Logic ---
let deleteCallback = null; // Stores the function to call on confirmation

function showConfirmDeleteModal(title, message, callback) {
    const modal = document.getElementById('deleteModal');
    if (!modal) {
        console.error('Generic delete confirmation modal not found.');
        if (confirm(message)) {
            callback();
        }
        return;
    }

    modal.querySelector('h3').textContent = title;
    modal.querySelector('#deleteMessage').textContent = message;
    deleteCallback = callback; // Store the callback

    // Set up confirm and cancel buttons
    const confirmBtn = modal.querySelector('.btn-danger');
    const cancelBtn = modal.querySelector('.btn-secondary');
    const closeBtn = modal.querySelector('.modal-close');

    confirmBtn.onclick = () => {
        if (deleteCallback) {
            deleteCallback();
        }
        closeDeleteModal();
    };
    cancelBtn.onclick = () => closeDeleteModal();
    closeBtn.onclick = () => closeDeleteModal();

    modal.style.display = 'flex';
}
window.showConfirmDeleteModal = showConfirmDeleteModal; // Make it globally accessible


// Function to save intelligence tools to local storage (IndexedDB)
async function saveTools() {
    try {
        // localForage automatically handles JSON.stringify
        await localforage.setItem('intelligenceTools', intelligenceTools);
    } catch (err) {
        console.error("Error saving intelligence tools:", err);
        showNotification("Failed to save tools to local database", "error");
    }
}

// Updated function to load tools from JSON file or Local Storage
async function loadTools() {
    try {
        // 1. Try to get saved tools from the local database (IndexedDB)
        const savedTools = await localforage.getItem('intelligenceTools');

        if (savedTools && savedTools.length > 0) {
            // If the user has local data, use it
            intelligenceTools = savedTools;
        } else {
            // 2. If no local data exists, fetch the default tools from tools.json
            const response = await fetch('tools.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            intelligenceTools = await response.json();

            // 3. Save these default tools to local storage for future persistence
            await saveTools();
        }
    } catch (err) {
        console.error("Error loading intelligence tools:", err);
        showNotification("Failed to load tools from external file.", "error");
    }
}

// Dashboard Functions
function loadDashboard() {
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    const activities = [
        {
            type: 'alert',
            title: 'Critical Threat Detected',
            description: 'Lazarus Group launching new cryptocurrency exchange attacks with advanced social engineering techniques',
            time: '2 hours ago'
        },
        {
            type: 'updated',
            title: 'Intelligence Update',
            description: 'Fancy Bear profile updated with new IOCs and attack vectors targeting Ukrainian infrastructure',
            time: '4 hours ago'
        },
        {
            type: 'new',
            title: 'New Actor Identified',
            description: 'Kimsuky - North Korean APT group targeting South Korean government entities',
            time: '6 hours ago'
        },
        {
            type: 'alert',
            title: 'Infrastructure Alert',
            description: 'Sandworm targeting European power grid systems with destructive malware variants',
            time: '8 hours ago'
        },
        {
            type: 'updated',
            title: 'Campaign Analysis',
            description: 'Cozy Bear supply chain attacks show increased sophistication in cloud environments',
            time: '12 hours ago'
        }
    ];
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item fade-in">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.type === 'alert' ? 'exclamation-triangle' : 
                                   activity.type === 'updated' ? 'sync-alt' : 'plus'}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}


// Intelligence Vault Functions
function loadVaultSection() {
    renderParentTabs();
    renderChildTabs();
    applyVaultFilters();
    setupVaultSearch();
}

// Function to count tools per parent category
function countToolsByParentCategory(parentCategory) {
    if (parentCategory === 'general') {
        return intelligenceTools.length;
    }
    return intelligenceTools.filter(tool => tool.parentCategory === parentCategory).length;
}

// Function to count tools per child category
function countToolsByChildCategory(childCategory) {
    if (currentParentTab === 'general') {
        if (childCategory === 'all-tools') {
            return intelligenceTools.length;
        } else if (childCategory === 'favorites') {
            return intelligenceTools.filter(tool => tool.isStarred).length;
        } else if (childCategory === 'recently-added') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return intelligenceTools.filter(tool => new Date(tool.dateAdded) > weekAgo).length;
        } else if (childCategory === 'most-used') {
            return intelligenceTools.filter(tool => tool.isPinned).length;
        }
    }
    return intelligenceTools.filter(tool => tool.parentCategory === currentParentTab && tool.childCategory === childCategory).length;
}

function renderParentTabs() {
    const parentTabsContainer = document.querySelector('.parent-tabs');
    if (!parentTabsContainer) return;

    parentTabsContainer.innerHTML = Object.entries(categoryMapping).map(([key, category]) => {
        const toolCount = countToolsByParentCategory(key);
        return `
            <div class="parent-tab ${key === currentParentTab ? 'active' : ''}" 
                 data-parent="${key}" onclick="switchParentTab('${key}')">
                <i class="${category.icon}"></i>
                <span>${category.name} (${toolCount})</span>
            </div>
        `;
    }).join('');
}


function renderChildTabs() {
    const childTabsContainer = document.getElementById('childTabs');
    if (!childTabsContainer) return;
    
    const currentCategory = categoryMapping[currentParentTab];
    if (!currentCategory) return;
    
    childTabsContainer.innerHTML = Object.entries(currentCategory.children).map(([key, name]) => {
        const toolCount = countToolsByChildCategory(key);
        return `
            <div class="child-tab ${key === currentChildTab ? 'active' : ''}" 
                 data-child="${key}" onclick="switchChildTab('${key}')">
                ${name} (${toolCount})
            </div>
        `;
    }).join('');
}


function switchParentTab(parentTab) {
    currentParentTab = parentTab;
    
    // Reset to first child tab
    const firstChildKey = Object.keys(categoryMapping[parentTab].children)[0];
    currentChildTab = firstChildKey;
    
    // Clear selection
    selectedTools.clear();
    updateBulkActions();
    
    renderParentTabs();
    renderChildTabs();
    applyVaultFilters();
}

function switchChildTab(childTab) {
    currentChildTab = childTab;
    
    // Clear selection
    selectedTools.clear();
    updateBulkActions();
    
    renderChildTabs();
    applyVaultFilters();
}

function applyVaultFilters() {
    const searchTerm = document.getElementById('vaultSearch')?.value.toLowerCase().trim() || '';
    const statusFilter = document.getElementById('vaultStatusFilter')?.value || 'all';
    
    filteredTools = intelligenceTools.filter(tool => {
        
        const matchesSearch = !searchTerm || 
            tool.name.toLowerCase().includes(searchTerm) || 
            tool.description.toLowerCase().includes(searchTerm) ||
            (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

        if (!matchesSearch) return false;

        if (statusFilter !== 'all') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const matchesStatus = 
                (statusFilter === 'pinned' && tool.isPinned) ||
                (statusFilter === 'starred' && tool.isStarred) ||
                (statusFilter === 'recent' && new Date(tool.dateAdded) > weekAgo);
            
            if (!matchesStatus) return false;
        }

        // --- STEP C: Category Filter (Parent & Child Tabs) ---
        if (currentParentTab === 'general') {
            // Dashboard-style views (Favorites, Recently Added, etc.)
            if (currentChildTab === 'favorites') return tool.isStarred;
            if (currentChildTab === 'most-used') return tool.isPinned;
            if (currentChildTab === 'recently-added') {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(tool.dateAdded) > weekAgo;
            }
            return true; // 'all-tools'
        } else {
            // Specific Category Navigation
            const matchesParent = tool.parentCategory === currentParentTab;
            const matchesChild = currentChildTab === 'all' || tool.childCategory === currentChildTab;
            return matchesParent && matchesChild;
        }
    });

    sortTools();
    renderTools();

    renderParentTabs();
    renderChildTabs();
}

function sortTools() {
    const sortBy = document.getElementById('vaultSortFilter')?.value || 'name-asc';
    
    filteredTools.sort((a, b) => {
        switch (sortBy) {
            case 'name-asc': 
                return (a.name || "").localeCompare(b.name || "");
            case 'name-desc': 
                return (b.name || "").localeCompare(a.name || "");
            case 'date-new': 
                return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
            case 'date-old': 
                return new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0);
            case 'pinned': 
                // Moves Pinned (1) above Unpinned (0)
                return (Number(b.isPinned) || 0) - (Number(a.isPinned) || 0);
            case 'starred': 
                // Moves Starred (1) above Unstarred (0)
                return (Number(b.isStarred) || 0) - (Number(a.isStarred) || 0);
            default: 
                return 0;
        }
    });
}

function filterToolsByStatus() {
    applyVaultFilters();
}

function renderTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    if (!toolsGrid) return;
    
    toolsGrid.className = currentView === 'grid' ? 'tools-grid' : 'tools-list';
    
    if (filteredTools.length === 0) {
        toolsGrid.innerHTML = `
            <div class="no-tools">
                <div class="no-tools-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No tools found</h3>
                <p>Try adjusting your search criteria or add new tools to your vault.</p>
                <button class="btn-primary" onclick="showAddToolModal()">
                    <i class="fas fa-plus"></i>
                    Add New Tool
                </button>
            </div>
        `;
        return;
    }
    
    toolsGrid.innerHTML = filteredTools.map(tool => createToolCard(tool)).join('');
}

function createToolCard(tool) {
    const isSelected = selectedTools.has(tool.id);
    
    if (currentView === 'list') {
        return `
            <div class="tool-item ${isSelected ? 'selected' : ''}" data-tool-id="${tool.id}">
                <div class="tool-checkbox">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleToolSelection(${tool.id})">
                </div>
                <div class="tool-info">
                    <div class="tool-header">
                        <h3 class="tool-name">${tool.name}</h3>
                        <div class="tool-url">
                            <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i>
                                ${tool.url}
                            </a>
                        </div>
                    </div>
                    <div class="tool-description">${tool.description}</div>
                    <div class="tool-tags">
                        ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="tool-actions">
                    <button class="tool-action-btn ${tool.isPinned ? 'active' : ''}" 
                            onclick="togglePin(${tool.id})" title="Pin Tool">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="tool-action-btn ${tool.isStarred ? 'active' : ''}" 
                            onclick="toggleStar(${tool.id})" title="Star Tool">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="tool-action-btn" onclick="openTool(${tool.id})" title="Open Tool">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="tool-action-btn" onclick="editTool(${tool.id})" title="Edit Tool">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="tool-action-btn danger" onclick="deleteTool(${tool.id})" title="Delete Tool">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="tool-card ${isSelected ? 'selected' : ''}" data-tool-id="${tool.id}">
                <div class="tool-checkbox">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleToolSelection(${tool.id})">
                </div>
                <div class="tool-header">
                    <div class="tool-status">
                        ${tool.isPinned ? '<i class="fas fa-thumbtack pinned" title="Pinned"></i>' : ''}
                        ${tool.isStarred ? '<i class="fas fa-star starred" title="Starred"></i>' : ''}
                    </div>
                    <h3 class="tool-name">${tool.name}</h3>
                    <div class="tool-url">
                        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                            ${tool.url}
                        </a>
                    </div>
                </div>
                <div class="tool-description">${tool.description}</div>
                <div class="tool-tags">
                    ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                </div>
                <div class="tool-actions">
                    <button class="tool-action-btn ${tool.isPinned ? 'active' : ''}" 
                            onclick="togglePin(${tool.id})" title="Pin Tool">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="tool-action-btn ${tool.isStarred ? 'active' : ''}" 
                            onclick="toggleStar(${tool.id})" title="Star Tool">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="tool-action-btn" onclick="openTool(${tool.id})" title="Open Tool">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="tool-action-btn" onclick="editTool(${tool.id})" title="Edit Tool">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="tool-action-btn danger" onclick="deleteTool(${tool.id})" title="Delete Tool">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
}

function toggleView(view) {
    currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    renderTools();
}

function setupVaultSearch() {
    const searchInput = document.getElementById('vaultSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyVaultFilters();
        }, 300);
    });
}

// Tool Management Functions
function showAddToolModal() {
    editingToolId = null;
    document.getElementById('modalTitle').textContent = 'Add New Tool';
    document.getElementById('saveButtonText').textContent = 'Save Tool';
    document.getElementById('addToolForm').reset();
    document.getElementById('customCategoryGroup').style.display = 'none';
    updateChildCategories();
    document.getElementById('addToolModal').style.display = 'flex';
}

function closeAddToolModal() {
    document.getElementById('addToolModal').style.display = 'none';
    editingToolId = null;
}

function updateChildCategories() {
    const parentSelect = document.getElementById('toolParentCategory');
    const childSelect = document.getElementById('toolChildCategory');
    const customGroup = document.getElementById('customCategoryGroup');
    
    const selectedParent = parentSelect.value;
    
    if (selectedParent === 'custom') {
        customGroup.style.display = 'block';
        childSelect.innerHTML = '<option value="custom">Custom Category</option>';
        return;
    } else {
        customGroup.style.display = 'none';
    }
    
    childSelect.innerHTML = '<option value="">Select Child Category</option>';
    
    if (selectedParent && categoryMapping[selectedParent]) {
        const children = categoryMapping[selectedParent].children;
        Object.entries(children).forEach(([key, name]) => {
            childSelect.innerHTML += `<option value="${key}">${name}</option>`;
        });
    }
}

// Save tool form
function saveToolForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const toolData = {
        name: formData.get('toolName'),
        url: formData.get('toolUrl'),
        parentCategory: formData.get('toolParentCategory'),
        childCategory: formData.get('toolChildCategory'),
        description: formData.get('toolDescription') || '',
        tags: formData.get('toolTags') ? formData.get('toolTags').split(',').map(tag => tag.trim()) : [],
        isPinned: false,
        isStarred: false,
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    // Handle custom categories
    if (toolData.parentCategory === 'custom') {
        const customParent = formData.get('customParentCategory');
        if (customParent) {
            toolData.parentCategory = customParent.toLowerCase().replace(/\s+/g, '-');
            toolData.childCategory = 'custom';
        }
    }
    
    // Check for duplicates
    const existingTool = intelligenceTools.find(tool => 
        tool.name.toLowerCase() === toolData.name.toLowerCase() && 
        tool.id !== editingToolId
    );
    
    if (existingTool) {
        showNotification('A tool with this name already exists!', 'error');
        return;
    }
    
    if (editingToolId) {
        // Update existing tool
        const toolIndex = intelligenceTools.findIndex(tool => tool.id === editingToolId);
        if (toolIndex !== -1) {
            intelligenceTools[toolIndex] = { ...intelligenceTools[toolIndex], ...toolData };
            showNotification('Tool updated successfully!', 'success');
        }
    } else {
        // Add new tool
        const newTool = {
            id: Math.max(...intelligenceTools.map(t => t.id)) + 1,
            ...toolData
        };
        intelligenceTools.push(newTool);
        showNotification('Tool added successfully!', 'success');
    }
    
    closeAddToolModal();
    applyVaultFilters();
    
    // Call rendering functions to update the counts in real time
    renderParentTabs();
    renderChildTabs();
    saveTools();
}


function editTool(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (!tool) return;
    
    editingToolId = toolId;
    document.getElementById('modalTitle').textContent = 'Edit Tool';
    document.getElementById('saveButtonText').textContent = 'Update Tool';
    
    // Populate form
    document.getElementById('toolName').value = tool.name;
    document.getElementById('toolUrl').value = tool.url;
    document.getElementById('toolParentCategory').value = tool.parentCategory;
    document.getElementById('toolDescription').value = tool.description;
    document.getElementById('toolTags').value = tool.tags.join(', ');
    
    updateChildCategories();
    setTimeout(() => {
        document.getElementById('toolChildCategory').value = tool.childCategory;
    }, 100);
    
    document.getElementById('addToolModal').style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        deleteCallback = null; // Clear callback
        // Reset modal content to default if needed (e.g., after custom messages)
        modal.querySelector('h3').textContent = 'Confirm Deletion';
        modal.querySelector('#deleteMessage').textContent = 'Are you sure you want to delete this item? This action cannot be undone.';
    }
}
window.closeDeleteModal = closeDeleteModal; // Make it globally accessible

// Updated deleteTool function
function deleteTool(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (!tool) return;

    showConfirmDeleteModal(
        'Confirm Tool Deletion',
        `Are you sure you want to delete the tool "${tool.name}"? This action cannot be undone.`,
        () => {
            const toolIndex = intelligenceTools.findIndex(t => t.id === toolId);
            if (toolIndex !== -1) {
                const toolName = intelligenceTools[toolIndex].name;
                intelligenceTools.splice(toolIndex, 1);
                saveTools();
                showNotification(`"${toolName}" deleted successfully!`, 'success');
                applyVaultFilters();
                // Call rendering functions to update the counts in real time
                renderParentTabs();
                renderChildTabs();
            }
        }
    );
}

// This is the updated generic confirmDelete() function at the bottom of the file
function confirmDelete() {
    // This is the new, multi-purpose confirmDelete function
    if (deleteTargetType === 'single' && deleteTargetId) {
        const toolIndex = intelligenceTools.findIndex(t => t.id === deleteTargetId);
        if (toolIndex !== -1) {
            const toolName = intelligenceTools[toolIndex].name;
            intelligenceTools.splice(toolIndex, 1);
            showNotification(`"${toolName}" deleted successfully!`, 'success');
        }
    } else if (deleteTargetType === 'bulk') {
        const deletedCount = selectedTools.size;
        intelligenceTools = intelligenceTools.filter(tool => !selectedTools.has(tool.id));
        selectedTools.clear();
        showNotification(`${deletedCount} tools deleted successfully!`, 'success');
        updateBulkActions();
    } else if (deleteTargetType === 'vault' && deleteTargetId) {
        const vaultIndex = vaults.findIndex(v => v.id === deleteTargetId);
        if (vaultIndex !== -1) {
            const vaultName = vaults[vaultIndex].name;
            vaults.splice(vaultIndex, 1);
            saveVaults();
            renderVaultTabs();
            if (vaults.length > 0) {
                switchToVault(vaults[0].id);
            } else {
                currentVaultId = null;
                document.getElementById('activeVaultContent').style.display = 'none';
                document.getElementById('emptyVaultState').style.display = 'flex';
            }
            if (window.traceLinkManager && window.traceLinkManager.tracelinkProjects[deleteTargetId]) {
                window.traceLinkManager.deleteProject(deleteTargetId);
            }
            showNotification(`Vault "${vaultName}" deleted successfully`, 'success');
        }
    } else if (deleteTargetType === 'vault-entry' && deleteTargetId) {
        const vault = vaults.find(v => v.id === currentVaultId);
        if (vault) {
            const entryIndex = vault.entries.findIndex(e => e.id === deleteTargetId);
            if (entryIndex !== -1) {
                const entryName = vault.entries[entryIndex].name;
                vault.entries.splice(entryIndex, 1);
                vault.stats.totalEntries = vault.entries.length;
                vault.stats.lastModified = new Date().toISOString();
                saveVaults();
                renderVaultTabs();
                updateVaultHeader(vault);
                renderVaultEntries();
                showNotification(`Entry "${entryName}" deleted successfully`, 'success');
            }
        }
    }
    closeDeleteModal();
    if (deleteTargetType === 'single' || deleteTargetType === 'bulk') {
        applyVaultFilters();
    }
}

// Updated togglePin function
function togglePin(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (tool) {
        tool.isPinned = !tool.isPinned;
        saveTools(); // Save immediately after state change
        showNotification(`Tool ${tool.isPinned ? 'pinned' : 'unpinned'}!`, 'info');
        applyVaultFilters();
        // Call rendering functions to update the counts in real time
        renderParentTabs();
        renderChildTabs();
    }
}
// Updated toggleStar function
function toggleStar(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (tool) {
        tool.isStarred = !tool.isStarred;
        saveTools(); // Save immediately after state change
        showNotification(`Tool ${tool.isStarred ? 'starred' : 'unstarred'}!`, 'info');
        applyVaultFilters();
        // Call rendering functions to update the counts in real time
        renderParentTabs();
        renderChildTabs();
    }
}

function openTool(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (tool) {
        window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
}

// Bulk Operations
function toggleToolSelection(toolId) {
    if (selectedTools.has(toolId)) {
        selectedTools.delete(toolId);
    } else {
        selectedTools.add(toolId);
    }
    
    updateBulkActions();
    updateToolCardSelection(toolId);
}

function updateToolCardSelection(toolId) {
    const toolCard = document.querySelector(`[data-tool-id="${toolId}"]`);
    if (toolCard) {
        toolCard.classList.toggle('selected', selectedTools.has(toolId));
    }
}

function updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedTools.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = `${selectedTools.size} selected`;
    } else {
        bulkActions.style.display = 'none';
    }
}

// Updated bulkPin, bulkStar, bulkDelete, etc. functions
function bulkPin() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isPinned = true;
    });
    saveTools();
    showNotification(`${selectedTools.size} tools pinned!`, 'success');
    clearSelection();
    applyVaultFilters();
    renderParentTabs();
    renderChildTabs();
}
function bulkUnPin() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isPinned = false;
    });
    saveTools();
    showNotification(`${selectedTools.size} tools unpinned!`, 'success');
    clearSelection();
    applyVaultFilters();
    renderParentTabs();
    renderChildTabs();
}

function bulkStar() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isStarred = true;
    });
    saveTools();
    showNotification(`${selectedTools.size} tools starred!`, 'success');
    clearSelection();
    applyVaultFilters();
    renderParentTabs();
    renderChildTabs();
}

function bulkUnStar() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isStarred = false;
    });
    saveTools();
    showNotification(`${selectedTools.size} tools unstarred!`, 'success');
    clearSelection();
    applyVaultFilters();
    renderParentTabs();
    renderChildTabs();
}
// Updated bulkDelete function
function bulkDelete() {
    if (selectedTools.size === 0) return;

    showConfirmDeleteModal(
        'Confirm Bulk Deletion',
        `Are you sure you want to delete all ${selectedTools.size} selected tools? This action cannot be undone.`,
        () => {
            const deletedCount = selectedTools.size;
            intelligenceTools = intelligenceTools.filter(tool => !selectedTools.has(tool.id));
            selectedTools.clear();
            saveTools();
            showNotification(`${deletedCount} tools deleted successfully!`, 'success');
            updateBulkActions();
            applyVaultFilters();
            renderParentTabs();
            renderChildTabs();
        }
    );
}

function clearSelection() {
    selectedTools.clear();
    updateBulkActions();
    
    // Update UI
    document.querySelectorAll('.tool-card, .tool-item').forEach(card => {
        card.classList.remove('selected');
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
    });
}

// Import/Export Functions
function importTools() {
    document.getElementById('importToolsModal').style.display = 'flex';
    setupToolsFileUpload();
}

function closeImportToolsModal() {
    document.getElementById('importToolsModal').style.display = 'none';
}

function setupToolsFileUpload() {
    const fileInput = document.getElementById('toolsFileInput');
    const uploadArea = document.getElementById('toolsFileUploadArea');
    
    if (!fileInput || !uploadArea) return;
    
    fileInput.addEventListener('change', handleToolsFileSelect);
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleToolsFileDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
}

function handleToolsFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processToolsFile(file);
    }
}

function handleToolsFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processToolsFile(files[0]);
    }
}

async function processToolsFile(file) {
    if (!file.name.endsWith('.json')) {
        showNotification('Please select a JSON file', 'error');
        return;
    }
    
    try {
        const text = await file.text();
        const importedTools = JSON.parse(text);
        
        if (!Array.isArray(importedTools)) {
            throw new Error('JSON file must contain an array of tools');
        }
        
        let importedCount = 0;
        let duplicateCount = 0;
        
        importedTools.forEach(toolData => {
            // Check for duplicates
            const existingTool = intelligenceTools.find(tool => 
                tool.name.toLowerCase() === toolData.name.toLowerCase()
            );
            
            if (existingTool) {
                duplicateCount++;
                return;
            }
            
            // Add new tool
            const newTool = {
                id: Math.max(...intelligenceTools.map(t => t.id)) + 1,
                name: toolData.name || 'Unnamed Tool',
                url: toolData.url || '',
                parentCategory: toolData.parentCategory || 'general',
                childCategory: toolData.childCategory || 'all-tools',
                description: toolData.description || '',
                tags: Array.isArray(toolData.tags) ? toolData.tags : [],
                isPinned: false,
                isStarred: false,
                dateAdded: new Date().toISOString().split('T')[0]
            };
            
            intelligenceTools.push(newTool);
            importedCount++;
        });
        
        closeImportToolsModal();
        
        let message = `Successfully imported ${importedCount} tools!`;
        if (duplicateCount > 0) {
            message += ` (${duplicateCount} duplicates skipped)`;
        }
        
        showNotification(message, 'success');
        applyVaultFilters();
        
    } catch (error) {
        showNotification(`Import failed: ${error.message}`, 'error');
    }
}

function exportTools() {
    const dataStr = JSON.stringify(intelligenceTools, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `intelligence-tools-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    showNotification('Tools exported successfully!', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Import Section Functions
function loadImportSection() {
    setupFileUpload();
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}



// ==========================================
// MULTI-VAULT SYSTEM
// ==========================================

// Vault parent-child tab structure
const vaultTabStructure = {
    general: {
        name: 'General',
        icon: 'fas fa-home',
        children: {
            'all-entries': 'All Entries',
            'recent': 'Recently Added',
            'priority': 'High Priority',
            'starred': 'Starred',
            'notes': 'Investigation Notes'
        }
    },
    identity: {
        name: 'Identity & Social',
        icon: 'fas fa-user-secret',
        children: {
            'social': 'Social Media Profiles',
            'username': 'Usernames/Handles',
            'email': 'Email Addresses',
            'phone': 'Phone Numbers',
            'dating': 'Dating Profiles',
            'persona': 'Personas/Identities',
            'publicrecord': 'Public Records'
        }
    },
    communication: {
        name: 'Communication',
        icon: 'fas fa-comments',
        children: {
            'messaging': 'Messaging Apps',
            'telegram': 'Telegram Channels',
            'forum': 'Forums/Markets',
            'paste': 'Paste Sites',
            'link': 'Social/Internet Links'
        }
    },
    financial: {
        name: 'Financial',
        icon: 'fas fa-dollar-sign',
        children: {
            'crypto': 'Crypto Transactions',
            'vendor': 'Underground Vendors',
            'breach': 'Data Breaches',
            'credential': 'Credential Dumps'
        }
    },
    technical: {
        name: 'Technical',
        icon: 'fas fa-code',
        children: {
            'domain': 'Domains/IPs/URLs',
            'network': 'Network Analysis',
            'metadata': 'Metadata',
            'vpn': 'VPN/Anonymity',
            'honeypot': 'Honeypots'
        }
    },
    media: {
        name: 'Media & Files',
        icon: 'fas fa-photo-video',
        children: {
            'media': 'Images/Videos',
            'audio': 'Audio Files',
            'document': 'Documents',
            'archive': 'Archives/Cache',
            'facial': 'Facial Recognition'
        }
    },
    intelligence: {
        name: 'Intelligence',
        icon: 'fas fa-brain',
        children: {
            'threat': 'Threat Intelligence',
            'vulnerability': 'Vulnerabilities',
            'malware': 'Malware/Files',
            'exploit': 'Exploits/Markets',
            'tool': 'Tools'
        }
    },
    underground: {
        name: 'Underground',
        icon: 'fas fa-mask',
        children: {
            'password': 'Passwords',
            'keyword': 'Keywords',
            'location': 'Locations'
        }
    }
};

// Entry type field definitions
const entryTypeFields = {
    tool: {
        fields: [
            { name: 'url', label: 'Tool URL', type: 'url', required: true },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'version', label: 'Version', type: 'text' }
        ]
    },
    email: {
        fields: [
            { name: 'email', label: 'Email Address', type: 'email', required: true },
            { name: 'domain', label: 'Domain', type: 'text' },
            { name: 'provider', label: 'Email Provider', type: 'text' },
            { name: 'verified', label: 'Verified', type: 'checkbox' }
        ]
    },
    phone: {
        fields: [
            { name: 'number', label: 'Phone Number', type: 'tel', required: true },
            { name: 'country', label: 'Country Code', type: 'text' },
            { name: 'carrier', label: 'Carrier', type: 'text' },
            { name: 'type', label: 'Type', type: 'select', options: ['Mobile', 'Landline', 'VoIP', 'Unknown'] }
        ]
    },
    crypto: {
        fields: [
            { name: 'address', label: 'Wallet Address', type: 'text', required: true },
            { name: 'currency', label: 'Currency', type: 'select', options: ['Bitcoin', 'Ethereum', 'Monero', 'Litecoin', 'Other'] },
            { name: 'amount', label: 'Amount', type: 'number' },
            { name: 'txid', label: 'Transaction ID', type: 'text' }
        ]
    },
    location: {
        fields: [
            { name: 'address', label: 'Address', type: 'text', required: true },
            { name: 'coordinates', label: 'GPS Coordinates', type: 'text' },
            { name: 'city', label: 'City', type: 'text' },
            { name: 'country', label: 'Country', type: 'text' }
        ]
    },
    link: {
        fields: [
            { name: 'url', label: 'URL', type: 'url', required: true },
            { name: 'platform', label: 'Platform', type: 'text' },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Suspended', 'Unknown'] }
        ]
    },
    media: {
        fields: [
            { name: 'url', label: 'Media URL', type: 'url', required: false },
            { name: 'existingMedia', type: 'placeholder', label: 'Existing Media' }, // Placeholder for existing media
            { name: 'file', label: 'Or Upload New File(s)', type: 'file', required: false }, // New file upload option
            { name: 'type', label: 'Media Type', type: 'select', options: ['Image', 'Video', 'Audio', 'Document'] },
            { name: 'resolution', label: 'Resolution', type: 'text' },
            { name: 'filesize', label: 'File Size', type: 'text' }
        ]
    },
    social: {
        fields: [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'platform', label: 'Platform', type: 'select', options: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Other'] },
            { name: 'url', label: 'Profile URL', type: 'url' },
            { name: 'followers', label: 'Followers Count', type: 'number' }
        ]
    },
    domain: {
        fields: [
            { name: 'domain', label: 'Domain/IP/URL', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['Domain', 'IP Address', 'URL', 'Subdomain'] },
            { name: 'registrar', label: 'Registrar', type: 'text' },
            { name: 'created', label: 'Creation Date', type: 'date' }
        ]
    },
    username: {
        fields: [
            { name: 'username', label: 'Username/Handle', type: 'text', required: true },
            { name: 'platforms', label: 'Platforms Found', type: 'text' },
            { name: 'availability', label: 'Availability', type: 'select', options: ['Available', 'Taken', 'Suspended', 'Unknown'] }
        ]
    },
    threat: {
        fields: [
            { name: 'indicator', label: 'Threat Indicator', type: 'text', required: true },
            { name: 'type', label: 'Indicator Type', type: 'select', options: ['IP', 'Domain', 'Hash', 'URL', 'Email', 'Other'] },
            { name: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
            { name: 'confidence', label: 'Confidence', type: 'select', options: ['Low', 'Medium', 'High'] }
        ]
    },
    document: {
        fields: [
            { name: 'url', label: 'Document URL', type: 'url', required: false },
            { name: 'file', label: 'Or Upload File', type: 'file', required: false },
            { name: 'type', label: 'Document Type', type: 'select', options: ['PDF', 'DOC', 'XLS', 'TXT', 'Other'] },
            { name: 'hash', label: 'File Hash', type: 'text' }
        ]
    }
};

// Load vaults from IndexedDB
async function loadVaults() {
    try {
        const savedVaults = await localforage.getItem('investigationVaults');
        if (savedVaults) {
            vaults = savedVaults;
        }
        // renderVaultTabs must wait until the data is actually loaded
        renderVaultTabs();
    } catch (err) {
        console.error("Error loading vaults:", err);
    }
}

// Save vaults to IndexedDB
async function saveVaults() {
    try {
        await localforage.setItem('investigationVaults', vaults);
    } catch (err) {
        console.error("Error saving vaults:", err);
        showNotification("Critical: Local database is full or inaccessible.", "error");
    }
}

// Show create vault modal
function showCreateVaultModal() {
    document.getElementById('createVaultModal').style.display = 'flex';
    document.getElementById('vaultName').focus();
    
    // Setup color picker
    setupColorPicker();
    setupIconPicker();
}

// Close create vault modal
function closeCreateVaultModal() {
    document.getElementById('createVaultModal').style.display = 'none';
    document.getElementById('createVaultForm').reset();
}

// Setup color picker
function setupColorPicker() {
    const colorPresets = document.querySelectorAll('.color-preset');
    const colorInput = document.getElementById('vaultColor');
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            colorInput.value = color;
            
            // Update active state
            colorPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
}

// Setup icon picker
function setupIconPicker() {
    const iconOptions = document.querySelectorAll('.icon-option');
    const iconInput = document.getElementById('vaultIcon');
    
    iconOptions.forEach(option => {
        option.addEventListener('click', () => {
            const icon = option.dataset.icon;
            iconInput.value = icon;
            
            // Update active state
            iconOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// Create new vault
function createNewVault(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const vaultData = {
        id: Date.now().toString(),
        name: formData.get('vaultName'),
        description: formData.get('vaultDescription') || '',
        color: formData.get('vaultColor'),
        icon: formData.get('vaultIcon'),
        created: new Date().toISOString(),
        entries: [],
        stats: {
            totalEntries: 0,
            lastModified: new Date().toISOString()
        }
    };
    
    // Check for duplicate names
    if (vaults.some(vault => vault.name.toLowerCase() === vaultData.name.toLowerCase())) {
        showNotification('A vault with this name already exists', 'error');
        return;
    }
    
    vaults.push(vaultData);
    saveVaults();
    renderVaultTabs();
    
    // Switch to the new vault
    switchToVault(vaultData.id);
    
    closeCreateVaultModal();
    showNotification(`Vault "${vaultData.name}" created successfully`, 'success');
}

// Render vault tabs
function renderVaultTabs() {
    const vaultTabs = document.getElementById('vaultTabs');
    const emptyState = document.getElementById('emptyVaultState');
    const activeContent = document.getElementById('activeVaultContent');
    
    if (vaults.length === 0) {
        vaultTabs.innerHTML = '';
        emptyState.style.display = 'flex';
        activeContent.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    activeContent.style.display = 'block';
    
    vaultTabs.innerHTML = vaults.map(vault => `
        <div class="vault-tab ${vault.id === currentVaultId ? 'active' : ''}" 
             onclick="switchToVault('${vault.id}')"
             data-vault-id="${vault.id}">
            <div class="vault-tab-icon" style="background-color: ${vault.color}">
                <i class="${vault.icon}"></i>
            </div>
            <div class="vault-tab-content">
                <div class="vault-tab-name">${vault.name}</div>
                <div class="vault-tab-stats">${vault.entries.length} entries</div>
            </div>
            <div class="vault-tab-actions">
                <button class="vault-action-btn" onclick="event.stopPropagation(); showVaultManagement('${vault.id}')" title="Manage Vault">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // If no vault is selected, select the first one
    if (!currentVaultId && vaults.length > 0) {
        switchToVault(vaults[0].id);
    }
}

// Switch to vault
function switchToVault(vaultId) {
    currentVaultId = vaultId;
    const vault = vaults.find(v => v.id === vaultId);
    
    if (!vault) return;
    
    // Update active tab
    document.querySelectorAll('.vault-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.vaultId === vaultId);
    });
    
    // Update vault header
    updateVaultHeader(vault);
    
    // Reset to general tab
    currentVaultParentTab = 'general';
    currentVaultChildTab = 'all-entries';
    
    // Update parent tabs
    updateVaultParentTabs();
    
    // Update child tabs
    updateVaultChildTabs();
    
    // Render entries
    renderVaultEntries();
}

// Update vault header
function updateVaultHeader(vault) {
    const vaultHeader = document.getElementById('vaultHeader');
    vaultHeader.innerHTML = `
        <div class="vault-header-content">
            <div class="vault-header-icon" style="background-color: ${vault.color}">
                <i class="${vault.icon}"></i>
            </div>
            <div class="vault-header-info">
                <h2>${vault.name}</h2>
                <p>${vault.description || 'No description provided'}</p>
                <div class="vault-header-stats">
                    <span class="stat-item">
                        <i class="fas fa-database"></i>
                        ${vault.entries.length} entries
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-calendar"></i>
                        Created ${new Date(vault.created).toLocaleDateString()}
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-clock"></i>
                        Modified ${new Date(vault.stats.lastModified).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Function to count entries per vault parent category
function countEntriesByVaultParentCategory(parentCategory) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return 0;
    
    if (parentCategory === 'general') {
        return vault.entries.length;
    }
    
    // Get all entry types in this parent category
    const childCategories = Object.keys(vaultTabStructure[parentCategory].children);
    const entryTypesInParent = childCategories.filter(child => child !== 'all-entries');
    
    return vault.entries.filter(entry => entryTypesInParent.includes(entry.type)).length;
}

// Function to count entries per vault child category
function countEntriesByVaultChildCategory(childCategory) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return 0;
    
    if (childCategory === 'all-entries') {
        return vault.entries.length;
    } else if (childCategory === 'recent') {
        return vault.entries.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 20).length;
    } else if (childCategory === 'priority') {
        return vault.entries.filter(entry => entry.priority === 'high' || entry.priority === 'critical').length;
    } else if (childCategory === 'starred') {
        return vault.entries.filter(entry => entry.starred).length;
    } else if (childCategory === 'notes') {
        return vault.entries.filter(entry => entry.investigationNotes).length;
    }
    
    // Default to filtering by entry type
    return vault.entries.filter(entry => entry.type === childCategory).length;
}

function updateVaultParentTabs() {
    const parentTabsContainer = document.querySelector('.vault-parent-tabs');
    if (!parentTabsContainer) return;

    parentTabsContainer.innerHTML = Object.entries(vaultTabStructure).map(([key, category]) => {
        const entryCount = countEntriesByVaultParentCategory(key);
        return `
            <div class="parent-tab ${key === currentVaultParentTab ? 'active' : ''}" 
                 data-parent="${key}" onclick="switchVaultParentTab('${key}')">
                <i class="${category.icon}"></i>
                <span>${category.name} (${entryCount})</span>
            </div>
        `;
    }).join('');
}

// Switch vault parent tab
function switchVaultParentTab(parentTab) {
    currentVaultParentTab = parentTab;
    currentVaultChildTab = Object.keys(vaultTabStructure[parentTab].children)[0];
    
    updateVaultParentTabs();
    updateVaultChildTabs();
    renderVaultEntries();
}


function updateVaultChildTabs() {
    const vaultChildTabs = document.getElementById('vaultChildTabs');
    const children = vaultTabStructure[currentVaultParentTab].children;
    
    vaultChildTabs.innerHTML = Object.entries(children).map(([key, name]) => {
        const entryCount = countEntriesByVaultChildCategory(key);
        return `
            <div class="child-tab ${key === currentVaultChildTab ? 'active' : ''}" 
                 onclick="switchVaultChildTab('${key}')">
                ${name} (${entryCount})
            </div>
        `;
    }).join('');
}

// Switch vault child tab
function switchVaultChildTab(childTab) {
    currentVaultChildTab = childTab;
    updateVaultChildTabs();
    renderVaultEntries();
}

// Show add entry modal
function showAddEntryModal() {
    if (!currentVaultId) {
        showNotification('Please select a vault first', 'warning');
        return;
    }
    
    document.getElementById('addEntryModal').style.display = 'flex';
    document.getElementById('entryModalTitle').textContent = 'Add New Entry';
    document.getElementById('saveEntryButtonText').textContent = 'Save Entry';
    document.getElementById('addEntryForm').reset();
    isEditingEntry = false;
    editingEntryId = null;
    
    // Clear dynamic fields
    document.getElementById('dynamicFields').innerHTML = '';
}

// Close add entry modal
function closeAddEntryModal() {
    document.getElementById('addEntryModal').style.display = 'none';
    document.getElementById('addEntryForm').reset();
    isEditingEntry = false;
    editingEntryId = null;
}

// Update entry fields based on type
function updateEntryFields() {
    const entryType = document.getElementById('entryType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    
    if (!entryType || !entryTypeFields[entryType]) {
        dynamicFields.innerHTML = '';
        return;
    }
    
    const fields = entryTypeFields[entryType].fields;
    
    dynamicFields.innerHTML = fields.map(field => {
        if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label for="field_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="field_${field.name}" name="field_${field.name}" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (field.type === 'checkbox') {
            return `
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="field_${field.name}" name="field_${field.name}">
                        ${field.label}
                    </label>
                </div>
            `;
        } else if (field.type === 'file') {
             // This is the file upload field with the 'multiple' attribute for all media and documents
            return `
                <div class="form-group">
                    <label for="field_${field.name}">${field.label}</label>
                    <input type="file" id="field_${field.name}" name="field_${field.name}" accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" multiple>
                    <small>Supports common images, videos, PDFs, Word, and text files.</small>
                </div>
            `;
        } else if (field.type === 'placeholder') {
            // This is the new placeholder for existing media
            return `<div id="mediaPlaceholder" class="form-group"></div>`;
        }
        else {
            return `
                <div class="form-group">
                    <label for="field_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input type="${field.type}" id="field_${field.name}" name="field_${field.name}" 
                           ${field.required ? 'required' : ''} 
                           placeholder="Enter ${field.label.toLowerCase()}">
                </div>
            `;
        }
    }).join('');

}

// Add metadata pair
function addMetadataPair() {
    const container = document.getElementById('metadataContainer');
    const pairDiv = document.createElement('div');
    pairDiv.className = 'metadata-pair';
    pairDiv.innerHTML = `
        <input type="text" class="metadata-key" placeholder="Key">
        <input type="text" class="metadata-value" placeholder="Value">
        <button type="button" class="metadata-remove" onclick="removeMetadataPair(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(pairDiv);
}

// Remove metadata pair
function removeMetadataPair(button) {
    const container = document.getElementById('metadataContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}


// Save vault entry
function saveVaultEntry(event) {
    event.preventDefault();

    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;

    const formData = new FormData(event.target);
    const entryType = formData.get('entryType');
    
    const existingEntry = isEditingEntry ? vault.entries.find(e => e.id === editingEntryId) : null;

    const dynamicData = {};
    if (entryTypeFields[entryType]) {
        entryTypeFields[entryType].fields.forEach(field => {
            if (field.type === 'file' || field.type === 'placeholder') return;
            const value = formData.get(`field_${field.name}`);
            if (value !== null) {
                dynamicData[field.name] = field.type === 'checkbox' ? !!value : value;
            }
        });
    }

    const customMetadata = {};
    const metadataPairs = document.querySelectorAll('.metadata-pair');
    metadataPairs.forEach(pair => {
        const key = pair.querySelector('.metadata-key').value.trim();
        const value = pair.querySelector('.metadata-value').value.trim();
        if (key && value) {
            customMetadata[key] = value;
        }
    });

    const entryData = {
        id: isEditingEntry ? editingEntryId : Date.now().toString(),
        type: entryType,
        name: formData.get('entryName'),
        description: formData.get('entryDescription') || '',
        investigationNotes: formData.get('investigationNotes') || '',
        tags: formData.get('entryTags') ? formData.get('entryTags').split(',').map(tag => tag.trim()) : [],
        source: formData.get('entrySource') || '',
        priority: formData.get('entryPriority'),
        dynamicData: dynamicData,
        customMetadata: customMetadata,
        created: isEditingEntry ? existingEntry.created : new Date().toISOString(),
        modified: new Date().toISOString(),
        starred: isEditingEntry ? existingEntry.starred || false : false,
        pinned: isEditingEntry ? existingEntry.pinned || false : false
    };


    if (entryType === 'media' || entryType === 'document') {
        const fileInput = document.getElementById('field_file');
        const files = fileInput.files;
        const urlValue = entryData.dynamicData.url;
        
        if (files.length === 0 && !urlValue && (!existingEntry || !existingEntry.dynamicData.fileDataUrls)) {
            showNotification('Please provide either a URL or upload at least one file.', 'error');
            return;
        }

        if (files.length > 0) {
            const filePromises = Array.from(files).map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(filePromises).then(newFileDataUrls => {
                const newFileNames = Array.from(files).map(f => f.name);
                const newFileSizes = Array.from(files).map(f => f.size);

                // Concatenate new files with existing ones
                const combinedUrls = existingEntry && existingEntry.dynamicData.fileDataUrls ? existingEntry.dynamicData.fileDataUrls.concat(newFileDataUrls) : newFileDataUrls;
                const combinedNames = existingEntry && existingEntry.dynamicData.fileNames ? existingEntry.dynamicData.fileNames.concat(newFileNames) : newFileNames;
                const combinedSizes = existingEntry && existingEntry.dynamicData.fileSizes ? existingEntry.dynamicData.fileSizes.concat(newFileSizes) : newFileSizes;

                entryData.dynamicData.fileDataUrls = combinedUrls;
                entryData.dynamicData.fileNames = combinedNames;
                entryData.dynamicData.fileSizes = combinedSizes;
                
                delete entryData.dynamicData.url;
                finalizeSave(vault, entryData);
            });
            return;
        } else if (existingEntry && existingEntry.dynamicData.fileDataUrls) {
            entryData.dynamicData.fileDataUrls = existingEntry.dynamicData.fileDataUrls;
            entryData.dynamicData.fileNames = existingEntry.dynamicData.fileNames;
            entryData.dynamicData.fileSizes = existingEntry.dynamicData.fileSizes;
        }
    }
    
    finalizeSave(vault, entryData);
}


// New helper function to finalize the save process
function finalizeSave(vault, entryData) {
    if (!isEditingEntry) {
        const duplicate = vault.entries.find(entry => 
            entry.name.toLowerCase() === entryData.name.toLowerCase() && 
            entry.type === entryData.type
        );
        
        if (duplicate) {
            showNotification('An entry with this name and type already exists', 'error');
            return;
        }
    }
    
    if (isEditingEntry) {
        const index = vault.entries.findIndex(e => e.id === editingEntryId);
        if (index !== -1) {
            vault.entries[index] = entryData;
        }
    } else {
        vault.entries.push(entryData);
    }
    
    vault.stats.totalEntries = vault.entries.length;
    vault.stats.lastModified = new Date().toISOString();
    
    saveVaults();
    renderVaultTabs();
    updateVaultHeader(vault);
    renderVaultEntries();
    
    closeAddEntryModal();
    showNotification(
        isEditingEntry ? 'Entry updated successfully' : 'Entry added successfully', 
        'success'
    );
    
    updateVaultParentTabs();
    updateVaultChildTabs();
}

// Make the new helper function globally available if it needs to be called from other modules
window.finalizeSave = finalizeSave;

// New helper function to remove a media file from an entry
function removeMediaFromEntry(entryId, indexToRemove) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry || !entry.dynamicData.fileDataUrls) return;

    entry.dynamicData.fileDataUrls.splice(indexToRemove, 1);
    entry.dynamicData.fileNames.splice(indexToRemove, 1);
    entry.dynamicData.fileSizes.splice(indexToRemove, 1);

    if (entry.dynamicData.fileDataUrls.length === 0) {
        delete entry.dynamicData.fileDataUrls;
        delete entry.dynamicData.fileNames;
        delete entry.dynamicData.fileSizes;
    }

    // Re-render the edit form to reflect the change
    showNotification('Media file removed from entry. Click "Update Entry" to save changes.', 'info');
    editVaultEntry(entryId);
}

let currentMediaViewerEntry = null;
let currentMediaViewerIndex = 0;

function showMediaViewer(entryId, mediaIndex) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry || !entry.dynamicData.fileDataUrls || entry.dynamicData.fileDataUrls.length === 0) return;

    currentMediaViewerEntry = entry;
    currentMediaViewerIndex = mediaIndex;

    const modal = document.getElementById('imageViewModal');
    const mediaContainer = document.getElementById('imageViewerContainer');
    const viewerTitle = document.getElementById('imageViewerTitle');
    const caption = document.getElementById('imageViewerCaption');
    
    const fileUrl = currentMediaViewerEntry.dynamicData.fileDataUrls[currentMediaViewerIndex];
    const fileType = getMediaType(fileUrl);
    
    // Clear previous media content
    mediaContainer.innerHTML = '';
    viewerTitle.textContent = currentMediaViewerEntry.name;

    let mediaContent = '';
    if (fileType === 'image') {
        mediaContent = `<img id="viewerMedia" src="${fileUrl}" alt="Uploaded Image">`;
    } else if (fileType === 'video') {
        mediaContent = `<video id="viewerMedia" src="${fileUrl}" controls autoplay></video>`;
    } else if (fileType === 'audio') {
        mediaContent = `<audio id="viewerMedia" src="${fileUrl}" controls autoplay></audio>`;
    } else if (fileType === 'pdf') {
        mediaContent = `<embed id="viewerMedia" src="${fileUrl}" type="application/pdf" width="100%" height="100%"/>`;
    } else { // Handle other documents by providing a download link
        mediaContent = `
            <div class="unsupported-preview">
                <i class="fas fa-file-alt"></i>
                <h3>File Preview Not Available</h3>
                <p>This file type cannot be displayed in the browser. Please use the download button below.</p>
            </div>
        `;
    }

    mediaContainer.innerHTML = mediaContent + `
        <div id="viewerControls" style="display: ${fileType === 'image' && currentMediaViewerEntry.dynamicData.fileDataUrls.length > 1 ? 'flex' : 'none'};">
            <button class="nav-btn prev-btn" onclick="event.stopPropagation(); navigateMediaViewer('prev')"><i class="fas fa-chevron-left"></i></button>
            <button class="nav-btn next-btn" onclick="event.stopPropagation(); navigateMediaViewer('next')"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    
    caption.textContent = currentMediaViewerEntry.dynamicData.fileNames[currentMediaViewerIndex];

    modal.style.display = 'flex';
}

function closeMediaViewer() {
    document.getElementById('imageViewModal').style.display = 'none';
    currentMediaViewerEntry = null;
    currentMediaViewerIndex = 0;
    
    // Pause any playing media
    const mediaElement = document.getElementById('viewerMedia');
    if (mediaElement && typeof mediaElement.pause === 'function') {
        mediaElement.pause();
    }
}

function navigateMediaViewer(direction) {
    if (!currentMediaViewerEntry || currentMediaViewerEntry.dynamicData.fileDataUrls.length <= 1) {
        return;
    }
    
    const totalMedia = currentMediaViewerEntry.dynamicData.fileDataUrls.length;
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentMediaViewerIndex + 1) % totalMedia;
    } else if (direction === 'prev') {
        newIndex = (currentMediaViewerIndex - 1 + totalMedia) % totalMedia;
    }
    
    const fileUrl = currentMediaViewerEntry.dynamicData.fileDataUrls[newIndex];
    const fileType = getMediaType(fileUrl);
    
    const mediaContainer = document.getElementById('imageViewerContainer');
    const viewerTitle = document.getElementById('imageViewerTitle');
    const caption = document.getElementById('imageViewerCaption');

    // Pause current media before changing it
    const oldMediaElement = document.getElementById('viewerMedia');
    if(oldMediaElement && typeof oldMediaElement.pause === 'function') {
        oldMediaElement.pause();
    }

    let mediaContent = '';
    if (fileType === 'image') {
        mediaContent = `<img id="viewerMedia" src="${fileUrl}" alt="Uploaded Image">`;
    } else if (fileType === 'video') {
        mediaContent = `<video id="viewerMedia" src="${fileUrl}" controls autoplay></video>`;
    } else if (fileType === 'audio') {
        mediaContent = `<audio id="viewerMedia" src="${fileUrl}" controls autoplay></audio>`;
    } else if (fileType === 'pdf') {
        mediaContent = `<embed id="viewerMedia" src="${fileUrl}" type="application/pdf" width="100%" height="100%"/>`;
    } else { // Handle other documents by providing a download link
        mediaContent = `
            <div class="unsupported-preview">
                <i class="fas fa-file-alt"></i>
                <h3>File Preview Not Available</h3>
                <p>This file type cannot be displayed in the browser. Please use the download button below.</p>
            </div>
        `;
    }

    mediaContainer.innerHTML = mediaContent + `
        <div id="viewerControls" style="display: ${fileType === 'image' && currentMediaViewerEntry.dynamicData.fileDataUrls.length > 1 ? 'flex' : 'none'};">
            <button class="nav-btn prev-btn" onclick="event.stopPropagation(); navigateMediaViewer('prev')"><i class="fas fa-chevron-left"></i></button>
            <button class="nav-btn next-btn" onclick="event.stopPropagation(); navigateMediaViewer('next')"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;

    currentMediaViewerIndex = newIndex;
    caption.textContent = currentMediaViewerEntry.dynamicData.fileNames[currentMediaViewerIndex];
}

function downloadFile() {
    if (!currentMediaViewerEntry) return;

    const currentMedia = currentMediaViewerEntry.dynamicData.fileDataUrls[currentMediaViewerIndex];
    const fileName = currentMediaViewerEntry.dynamicData.fileNames[currentMediaViewerIndex];
    
    const link = document.createElement('a');
    link.href = currentMedia;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function getMediaType(dataUrl) {
    if (dataUrl.startsWith('data:image')) {
        return 'image';
    } else if (dataUrl.startsWith('data:video')) {
        return 'video';
    } else if (dataUrl.startsWith('data:audio')) {
        return 'audio';
    } else if (dataUrl.startsWith('data:application/pdf')) {
        return 'pdf';
    } else if (dataUrl.startsWith('data:text')) {
        return 'text';
    } else {
        return 'unknown';
    }
}

//To show popup of entries when clicked on the entry in the multi-vault tab
function showEntryDetailsModal(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry) return;

    const modal = document.getElementById('entryDetailsModal');
    const modalTitle = document.getElementById('entryDetailsModalTitle');
    const modalBody = document.getElementById('entryDetailsModalBody');
    const editButton = document.getElementById('editEntryButton');

    modalTitle.textContent = entry.name;
    
    // --- Start Media Gallery Rendering ---
    let mediaGalleryHtml = '';
    if (entry.dynamicData.fileDataUrls && entry.dynamicData.fileDataUrls.length > 0) {
        const fileType = getMediaType(entry.dynamicData.fileDataUrls[0]);

        if (fileType === 'image') {
            mediaGalleryHtml = `
                <div class="entry-details-gallery">
                    ${entry.dynamicData.fileDataUrls.map((url, index) => `
                        <img src="${url}" alt="${entry.dynamicData.fileNames[index]}" onclick="openMediaViewerFromDetails('${entry.id}', ${index})">
                    `).join('')}
                </div>
            `;
        } else if (fileType === 'video' || fileType === 'audio') {
            mediaGalleryHtml = `
                <div class="entry-details-gallery">
                    <div class="media-preview-placeholder" onclick="openMediaViewerFromDetails('${entry.id}', 0)">
                        <i class="fas fa-play"></i>
                        <span>Click to Play ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}</span>
                    </div>
                </div>
            `;
        } else {
            mediaGalleryHtml = `
                <div class="entry-details-gallery">
                    <div class="media-preview-placeholder" onclick="openMediaViewerFromDetails('${entry.id}', 0)">
                        <i class="fas fa-file-alt"></i>
                        <span>Click to View Document</span>
                    </div>
                </div>
            `;
        }
    }
    // --- End Media Gallery Rendering ---

    // --- Start Dynamic Data Rendering (Bug Fix) ---
    const filteredDynamicData = Object.fromEntries(
        Object.entries(entry.dynamicData || {}).filter(([key, value]) => 
            key !== 'file' && key !== 'fileDataUrls' && key !== 'fileNames' && key !== 'fileSizes' && typeof value !== 'object'
        )
    );
    let dynamicDataHtml = Object.entries(filteredDynamicData).map(([key, value]) => 
        value ? `<div class="dynamic-field">
            <strong>${key}:</strong> 
            ${key.includes('url') || key.includes('link') ? 
                `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>` : 
                value}
        </div>` : ''
    ).join('');
    // --- End Dynamic Data Rendering ---
    
    // Generate the tags HTML
    const tagsHtml = entry.tags.length > 0 ? `
        <div class="details-section">
            <h4>Tags</h4>
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
            </div>
        </div>
    ` : '';
    
    // Generate the metadata HTML
    const metadataHtml = `
        <div class="details-section">
            <h4>Metadata</h4>
            <div class="entry-metadata-list">
                <span><strong>Created:</strong> ${new Date(entry.created).toLocaleDateString()}</span>
                <span><strong>Modified:</strong> ${new Date(entry.modified).toLocaleDateString()}</span>
                ${entry.source ? `<span><strong>Source:</strong> ${entry.source}</span>` : ''}
            </div>
        </div>
    `;

    let bodyHtml = `
        <div class="entry-details-container">
            <div class="entry-type-header">
                <span class="entry-type-badge">${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</span>
                <span class="entry-priority-badge">${entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}</span>
            </div>
            
            ${entry.description ? `
                <div class="details-section">
                    <h4>Description</h4>
                    <p>${entry.description}</p>
                </div>
            ` : ''}

            ${mediaGalleryHtml ? `<div class="details-section"><h4>Media</h4>${mediaGalleryHtml}</div>` : ''}

            ${dynamicDataHtml ? `
                <div class="details-section">
                    <h4>Additional Data</h4>
                    <div class="dynamic-data-list">
                        ${dynamicDataHtml}
                    </div>
                </div>
            ` : ''}
            
            ${entry.investigationNotes ? `
                <div class="details-section">
                    <h4>Investigation Notes</h4>
                    <p>${entry.investigationNotes}</p>
                </div>
            ` : ''}
            
            ${tagsHtml}
            ${metadataHtml}
        </div>
    `;

    modalBody.innerHTML = bodyHtml;
    
    editButton.onclick = () => {
        closeEntryDetailsModal();
        editVaultEntry(entryId);
    };

    modal.style.display = 'flex';
}

function openMediaViewerFromDetails(entryId, index) {
    closeEntryDetailsModal();
    showMediaViewer(entryId, index);
}

function closeEntryDetailsModal() {
    document.getElementById('entryDetailsModal').style.display = 'none';
}


// Render vault entries
function renderVaultEntries() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    let entries = [...vault.entries];
    
    // Filter by child tab
    if (currentVaultChildTab !== 'all-entries') {
        if (currentVaultChildTab === 'recent') {
            entries = entries.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 20);
        } else if (currentVaultChildTab === 'priority') {
            entries = entries.filter(entry => entry.priority === 'high' || entry.priority === 'critical');
        } else if (currentVaultChildTab === 'starred') {
            entries = entries.filter(entry => entry.starred);
        } else if (currentVaultChildTab === 'notes') {
            entries = entries.filter(entry => entry.investigationNotes);
        } else {
            // Filter by entry type
            entries = entries.filter(entry => entry.type === currentVaultChildTab);
        }
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('vaultEntrySearch')?.value.toLowerCase();
    if (searchTerm) {
        entries = entries.filter(entry => 
            entry.name.toLowerCase().includes(searchTerm) ||
            entry.description.toLowerCase().includes(searchTerm) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply type filter
    const typeFilter = document.getElementById('vaultEntryTypeFilter')?.value;
    if (typeFilter && typeFilter !== 'all') {
        entries = entries.filter(entry => entry.type === typeFilter);
    }
    
    // Apply sorting
    const sortFilter = document.getElementById('vaultSortFilter')?.value;
    if (sortFilter) {
        switch (sortFilter) {
            case 'date-new':
                entries.sort((a, b) => new Date(b.created) - new Date(a.created));
                break;
            case 'date-old':
                entries.sort((a, b) => new Date(a.created) - new Date(b.created));
                break;
            case 'name-asc':
                entries.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                entries.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'type':
                entries.sort((a, b) => a.type.localeCompare(b.type));
                break;
            case 'priority':
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                entries.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
                break;
        }
    }
    
    const vaultEntriesGrid = document.getElementById('vaultEntriesGrid');
    
    if (entries.length === 0) {
        vaultEntriesGrid.innerHTML = `
            <div class="empty-entries-state">
                <div class="empty-state-icon">
                    <i class="fas fa-database"></i>
                </div>
                <h3>No Entries Found</h3>
                <p>No entries match your current filters. Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }
    
    vaultEntriesGrid.className = `vault-entries-${currentVaultView}`;
    vaultEntriesGrid.innerHTML = entries.map(entry => createVaultEntryCard(entry)).join('');
}

// New function to create an entry card with the Intelligence Vault's visual style
function createVaultEntryCard(entry) {
    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#dc2626'
    };
    
    const typeIcons = {
        tool: 'fas fa-tools', email: 'fas fa-envelope', phone: 'fas fa-phone', crypto: 'fab fa-bitcoin', location: 'fas fa-map-marker-alt', link: 'fas fa-link', media: 'fas fa-photo-video', social: 'fas fa-users', domain: 'fas fa-globe', username: 'fas fa-user', threat: 'fas fa-shield-alt', document: 'fas fa-file-alt', password: 'fas fa-key', keyword: 'fas fa-tag', breach: 'fas fa-exclamation-triangle', credential: 'fas fa-id-card', forum: 'fas fa-comments', vendor: 'fas fa-store', telegram: 'fab fa-telegram-plane', paste: 'fas fa-clipboard', network: 'fas fa-network-wired', metadata: 'fas fa-info-circle', archive: 'fas fa-archive', messaging: 'fas fa-comment-dots', dating: 'fas fa-heart', audio: 'fas fa-volume-up', facial: 'fas fa-eye', persona: 'fas fa-mask', vpn: 'fas fa-user-secret', honeypot: 'fas fa-spider', exploit: 'fas fa-bomb', publicrecord: 'fas fa-file-contract', malware: 'fas fa-bug', vulnerability: 'fas fa-bug'
    };
    
    const fileDataUrls = entry.dynamicData.fileDataUrls;
    const fileNames = entry.dynamicData.fileNames;
    const fileSizes = entry.dynamicData.fileSizes;
    let mediaDisplayHtml = '';
    
    if (fileDataUrls && fileDataUrls.length > 0) {
        const fileType = getMediaType(fileDataUrls[0]);
        const isSingleFile = fileDataUrls.length === 1;

        if (isSingleFile) {
            if (fileType === 'image') {
                mediaDisplayHtml = `
                    <div class="media-preview-container">
                        <img src="${fileDataUrls[0]}" alt="${fileNames[0]}">
                        <button class="media-popout-btn" onclick="event.stopPropagation(); showMediaViewer('${entry.id}', 0)">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                `;
            } else if (fileType === 'video') {
                mediaDisplayHtml = `
                    <div class="media-preview-container">
                        <video src="${fileDataUrls[0]}" controls></video>
                        <button class="media-popout-btn" onclick="event.stopPropagation(); showMediaViewer('${entry.id}', 0)">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                `;
            } else if (fileType === 'audio') {
                mediaDisplayHtml = `
                    <div class="media-preview-container">
                        <audio src="${fileDataUrls[0]}" controls></audio>
                        <button class="media-popout-btn" onclick="event.stopPropagation(); showMediaViewer('${entry.id}', 0)">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                `;
            } else { // Documents and Unknown
                mediaDisplayHtml = `
                    <div class="media-preview-container document-preview">
                        <div class="document-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="document-details">
                            <strong>${fileNames[0]}</strong>
                            <small>${(fileSizes[0] / 1024).toFixed(2)} KB</small>
                        </div>
                        <button class="media-popout-btn" onclick="event.stopPropagation(); showMediaViewer('${entry.id}', 0)">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                `;
            }
        } else { // Multiple files - always show carousel
             mediaDisplayHtml = `
                <div class="media-gallery-carousel">
                    ${fileDataUrls.map((url, index) => {
                        const fileTypeForThumb = getMediaType(url);
                        if (fileTypeForThumb === 'image') {
                            return `<img src="${url}" alt="${fileNames[index]}" class="${index === 0 ? 'active' : ''}">`;
                        } else if (fileTypeForThumb === 'video') {
                            return `<div class="media-thumbnail-placeholder ${index === 0 ? 'active' : ''}" data-file-type="video"><i class="fas fa-video"></i></div>`;
                        } else if (fileTypeForThumb === 'audio') {
                            return `<div class="media-thumbnail-placeholder ${index === 0 ? 'active' : ''}" data-file-type="audio"><i class="fas fa-headphones"></i></div>`;
                        } else {
                            return `<div class="media-thumbnail-placeholder ${index === 0 ? 'active' : ''}" data-file-type="document"><i class="fas fa-file-alt"></i></div>`;
                        }
                    }).join('')}
                    <button class="media-gallery-nav-btn prev" onclick="event.stopPropagation(); navigateMediaGallery('${entry.id}', 'prev')"><i class="fas fa-chevron-left"></i></button>
                    <button class="media-gallery-nav-btn next" onclick="event.stopPropagation(); navigateMediaGallery('${entry.id}', 'next')"><i class="fas fa-chevron-right"></i></button>
                    <button class="media-gallery-popout-btn" onclick="event.stopPropagation(); showMediaViewer('${entry.id}', 0)">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            `;
        }
    }

    const filteredDynamicData = Object.fromEntries(
        Object.entries(entry.dynamicData || {}).filter(([key, value]) => 
            key !== 'file' && key !== 'fileDataUrls' && key !== 'fileNames' && key !== 'fileSizes' && typeof value !== 'object'
        )
    );

    return `
        <div class="vault-entry-card" data-entry-id="${entry.id}">
            <div class="entry-card-header">
                <div class="entry-type-icon">
                    <i class="${typeIcons[entry.type] || 'fas fa-file'}"></i>
                </div>
                <div class="entry-priority" style="background-color: ${priorityColors[entry.priority]}"></div>
                <div class="entry-actions">
                    <button class="entry-action-btn" onclick="showEntryDetailsModal('${entry.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="entry-action-btn ${entry.starred ? 'active' : ''}" 
                            onclick="toggleEntryStarred('${entry.id}')" title="Star">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="entry-action-btn ${entry.pinned ? 'active' : ''}" 
                            onclick="toggleEntryPinned('${entry.id}')" title="Pin">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="entry-action-btn" onclick="editVaultEntry('${entry.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="entry-action-btn danger" onclick="deleteVaultEntry('${entry.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="entry-card-content">
                <h3 class="entry-name">${entry.name}</h3>
                <div class="entry-type">${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</div>
                
                ${entry.description ? `<p class="entry-description">${entry.description}</p>` : ''}

                ${mediaDisplayHtml}
                
                <div class="entry-dynamic-data">
                    ${Object.entries(filteredDynamicData || {}).map(([key, value]) => 
                        value ? `<div class="dynamic-field">
                            <strong>${key}:</strong> 
                            ${key.includes('url') || key.includes('link') ? 
                                `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>` : 
                                value}
                        </div>` : ''
                    ).join('')}
                </div>
                
                <div class="entry-metadata">
                    <span class="entry-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(entry.created).toLocaleDateString()}
                    </span>
                    ${entry.source ? `
                        <span class="entry-source">
                            <i class="fas fa-source"></i>
                            ${entry.source}
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Add this new function to handle the carousel navigation
function navigateMediaGallery(entryId, direction) {
    const card = document.querySelector(`.vault-entry-card[data-entry-id="${entryId}"]`);
    if (!card) return;

    const images = card.querySelectorAll('.media-gallery-carousel img');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    
    images[currentIndex].classList.remove('active');

    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % images.length;
    } else {
        newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    images[newIndex].classList.add('active');
    
    // Update the popout button to show the correct image
    const popoutBtn = card.querySelector('.media-gallery-popout-btn');
    popoutBtn.onclick = () => { event.stopPropagation(); showMediaViewer(entryId, newIndex); };
}

// Toggle entry starred
function toggleEntryStarred(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (entry) {
        entry.starred = !entry.starred;
        entry.modified = new Date().toISOString();
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultEntries();
        showNotification(
            entry.starred ? 'Entry starred' : 'Entry unstarred', 
            'success'
        );
    }
}

// Toggle entry pinned
function toggleEntryPinned(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (entry) {
        entry.pinned = !entry.pinned;
        entry.modified = new Date().toISOString();
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultEntries();
        showNotification(
            entry.pinned ? 'Entry pinned' : 'Entry unpinned', 
            'success'
        );
    }
}

function editVaultEntry(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    isEditingEntry = true;
    editingEntryId = entryId;
    
    // Show modal and set title
    document.getElementById('addEntryModal').style.display = 'flex';
    document.getElementById('entryModalTitle').textContent = 'Edit Entry';
    document.getElementById('saveEntryButtonText').textContent = 'Update Entry';
    
    // Populate form
    document.getElementById('entryType').value = entry.type;
    document.getElementById('entryName').value = entry.name;
    document.getElementById('entryDescription').value = entry.description;
    document.getElementById('investigationNotes').value = entry.investigationNotes;
    document.getElementById('entryTags').value = entry.tags.join(', ');
    document.getElementById('entrySource').value = entry.source;
    document.getElementById('entryPriority').value = entry.priority;
    
    // Reset metadata container
    const metadataContainer = document.getElementById('metadataContainer');
    if (metadataContainer) {
        metadataContainer.innerHTML = '';
        if (Object.keys(entry.customMetadata || {}).length > 0) {
            Object.entries(entry.customMetadata).forEach(([key, value]) => {
                const pairDiv = document.createElement('div');
                pairDiv.className = 'metadata-pair';
                pairDiv.innerHTML = `
                    <input type="text" class="metadata-key" placeholder="Key" value="${key}">
                    <input type="text" class="metadata-value" placeholder="Value" value="${value}">
                    <button type="button" class="metadata-remove" onclick="removeMetadataPair(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                `;
                metadataContainer.appendChild(pairDiv);
            });
        } else {
            addMetadataPair();
        }
    }
    
    // Update dynamic fields
    updateEntryFields();
    
    // Populate dynamic fields with a slight delay
    setTimeout(() => {
        Object.entries(entry.dynamicData || {}).forEach(([key, value]) => {
            // Fix: Do not set the value for file input fields
            if (key !== 'fileDataUrls' && key !== 'fileNames' && key !== 'fileSizes' && key !== 'file') {
                const field = document.getElementById(`field_${key}`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = value;
                    } else {
                        field.value = value;
                    }
                }
            }
        });

        // --- New Logic for Existing Media ---
        const existingMediaContainer = document.getElementById('mediaPlaceholder');
        if (existingMediaContainer && entry.dynamicData.fileDataUrls && entry.dynamicData.fileDataUrls.length > 0) {
            existingMediaContainer.innerHTML = `
                <label>Existing Media</label>
                <div class="existing-media-gallery">
                    ${entry.dynamicData.fileDataUrls.map((url, index) => {
                        const fileName = entry.dynamicData.fileNames[index];
                        const mediaType = getMediaType(url);
                        let mediaHtml;

                        if (mediaType === 'image') {
                            mediaHtml = `<img src="${url}" alt="${fileName}" onclick="openMediaViewerFromDetails('${entry.id}', ${index})">`;
                        } else if (mediaType === 'video' || mediaType === 'audio') {
                            mediaHtml = `<div class="media-icon-placeholder" onclick="openMediaViewerFromDetails('${entry.id}', ${index})"><i class="fas fa-play"></i></div>`;
                        } else {
                            mediaHtml = `<div class="media-icon-placeholder" onclick="openMediaViewerFromDetails('${entry.id}', ${index})"><i class="fas fa-file"></i></div>`;
                        }

                        return `
                            <div class="media-preview-item">
                                ${mediaHtml}
                                <span class="file-name">${fileName}</span>
                                <button type="button" class="media-delete-btn" onclick="removeMediaFromEntry('${entry.id}', ${index})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
                <small>Click a file to view, or use the X to delete it. Uploading new files will replace these.</small>
            `;
        } else {
            // Clear the placeholder if there's no media
            if (existingMediaContainer) {
                existingMediaContainer.innerHTML = '';
            }
        }
        // --- End New Logic ---
    }, 100);
}

// Delete vault entry
function deleteVaultEntry(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry) return;

    showConfirmDeleteModal(
        'Confirm Entry Deletion',
        `Are you sure you want to delete the entry "${entry.name}"? This action cannot be undone.`,
        () => {
            const entryIndex = vault.entries.findIndex(e => e.id === entryId);
            if (entryIndex !== -1) {
                const entryName = vault.entries[entryIndex].name;
                vault.entries.splice(entryIndex, 1);
                vault.stats.totalEntries = vault.entries.length;
                vault.stats.lastModified = new Date().toISOString();
                saveVaults();
                renderVaultTabs();
                updateVaultHeader(vault);
                renderVaultEntries();
                showNotification(`Entry "${entryName}" deleted successfully`, 'success');
                // Call rendering functions to update counts in real time
                updateVaultParentTabs();
                updateVaultChildTabs();
            }
        }
    );
}

// Confirm delete entry
function confirmDeleteEntry() {
    if (!entryToDelete) return;
    
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entryIndex = vault.entries.findIndex(e => e.id === entryToDelete);
    if (entryIndex !== -1) {
        const entryName = vault.entries[entryIndex].name;
        vault.entries.splice(entryIndex, 1);
        vault.stats.totalEntries = vault.entries.length;
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultTabs();
        updateVaultHeader(vault);
        renderVaultEntries();
        
        showNotification(`Entry "${entryName}" deleted successfully`, 'success');
    }
    
    closeDeleteModal();
    entryToDelete = null;
}

// Toggle vault view
function toggleVaultView(view) {
    currentVaultView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    renderVaultEntries();
}

// Filter vault entries
function filterVaultEntries() {
    renderVaultEntries();
}

// Sort vault entries
function sortVaultEntries() {
    renderVaultEntries();
}

// Export vault data
function exportVaultData() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) {
        showNotification('No vault selected', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(vault, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault-${vault.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Vault exported successfully', 'success');
}

// Export all vaults
function exportAllVaults() {
    if (vaults.length === 0) {
        showNotification('No vaults to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(vaults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-vaults-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('All vaults exported successfully', 'success');
}

// Import vault data
function importVaultData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Check if it's a single vault or multiple vaults
                if (Array.isArray(importedData)) {
                    // Multiple vaults
                    let importedCount = 0;
                    importedData.forEach(vault => {
                        if (vault.id && vault.name && vault.entries) {
                            // Check for duplicate names
                            if (!vaults.some(v => v.name.toLowerCase() === vault.name.toLowerCase())) {
                                vault.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                                vaults.push(vault);
                                importedCount++;
                            }
                        }
                    });
                    
                    if (importedCount > 0) {
                        saveVaults();
                        renderVaultTabs();
                        showNotification(`${importedCount} vault(s) imported successfully`, 'success');
                    } else {
                        showNotification('No new vaults imported (duplicates or invalid data)', 'warning');
                    }
                } else if (importedData.id && importedData.name && importedData.entries) {
                    // Single vault
                    if (!vaults.some(v => v.name.toLowerCase() === importedData.name.toLowerCase())) {
                        importedData.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                        vaults.push(importedData);
                        saveVaults();
                        renderVaultTabs();
                        showNotification('Vault imported successfully', 'success');
                    } else {
                        showNotification('Vault with this name already exists', 'error');
                    }
                } else {
                    showNotification('Invalid vault data format', 'error');
                }
            } catch (error) {
                showNotification('Error parsing JSON file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Show vault management modal
function showVaultManagement(vaultId) {
    currentVaultId = vaultId;
    document.getElementById('vaultManagementModal').style.display = 'flex';
}

// Close vault management modal
function closeVaultManagementModal() {
    document.getElementById('vaultManagementModal').style.display = 'none';
}

// Edit vault
function editVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    // Populate edit form (reuse create form)
    document.getElementById('vaultName').value = vault.name;
    document.getElementById('vaultDescription').value = vault.description;
    document.getElementById('vaultColor').value = vault.color;
    document.getElementById('vaultIcon').value = vault.icon;
    
    // Change form behavior to edit mode
    const form = document.getElementById('createVaultForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        vault.name = formData.get('vaultName');
        vault.description = formData.get('vaultDescription');
        vault.color = formData.get('vaultColor');
        vault.icon = formData.get('vaultIcon');
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultTabs();
        updateVaultHeader(vault);
        
        closeCreateVaultModal();
        closeVaultManagementModal();
        showNotification('Vault updated successfully', 'success');
        
        // Reset form behavior
        form.onsubmit = createNewVault;
    };
    
    closeVaultManagementModal();
    showCreateVaultModal();
    document.querySelector('#createVaultModal h3').textContent = 'Edit Vault';
}

// Duplicate vault
function duplicateVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const duplicatedVault = {
        ...vault,
        id: Date.now().toString(),
        name: `${vault.name} (Copy)`,
        created: new Date().toISOString(),
        stats: {
            ...vault.stats,
            lastModified: new Date().toISOString()
        },
        entries: vault.entries.map(entry => ({
            ...entry,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        }))
    };
    
    vaults.push(duplicatedVault);
    saveVaults();
    renderVaultTabs();
    
    closeVaultManagementModal();
    showNotification('Vault duplicated successfully', 'success');
}

// Archive vault (for now, just add archived flag)
function archiveVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    vault.archived = !vault.archived;
    vault.stats.lastModified = new Date().toISOString();
    
    saveVaults();
    renderVaultTabs();
    
    closeVaultManagementModal();
    showNotification(
        vault.archived ? 'Vault archived' : 'Vault unarchived', 
        'success'
    );
}

// Updated deleteVault function
function deleteVault() {
    // Close the management modal first
    closeVaultManagementModal();

    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    // Use the generic confirm modal
    showConfirmDeleteModal(
        'Confirm Vault Deletion',
        `Are you sure you want to delete the vault "${vault.name}" and all its ${vault.entries.length} entries? This action cannot be undone.`,
        () => {
            const vaultIndex = vaults.findIndex(v => v.id === currentVaultId);
            if (vaultIndex !== -1) {
                const vaultName = vaults[vaultIndex].name;
                vaults.splice(vaultIndex, 1);
                saveVaults();
                renderVaultTabs();
                if (vaults.length > 0) {
                    switchToVault(vaults[0].id);
                } else {
                    currentVaultId = null;
                    document.getElementById('activeVaultContent').style.display = 'none';
                    document.getElementById('emptyVaultState').style.display = 'flex';
                }
                showNotification(`Vault "${vaultName}" deleted successfully`, 'success');
            }
        }
    );
}


// Save custom vault entry
function saveCustomVaultEntry(event) {
    event.preventDefault();
    
    const name = document.getElementById('entryName').value;
    const type = document.getElementById('entryType').value;
    const tags = document.getElementById('entryTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const notes = document.getElementById('entryNotes').value;
    const description = document.getElementById('entryDescription').value;
    
    // Collect metadata from key-value pairs
    const metadata = {};
    const metadataPairs = document.querySelectorAll('.metadata-pair');
    metadataPairs.forEach(pair => {
        const key = pair.querySelector('.metadata-key').value.trim();
        const value = pair.querySelector('.metadata-value').value.trim();
        if (key && value) {
            metadata[key] = value;
        }
    });
    
    if (!name.trim()) {
        showNotification('Entry name is required', 'error');
        return;
    }
    
    const entry = {
        id: Date.now().toString(),
        name: name,
        type: type,
        description: description,
        notes: notes,
        tags: tags,
        metadata: metadata,
        createdAt: new Date().toISOString()
    };
    
    // Add to current vault
    const vault = customVaults.find(v => v.id === currentCustomVaultId);
    if (vault) {
        vault.entries.push(entry);
        saveCustomVaults();
        renderCustomVaultEntries(currentCustomVaultId);
    }
    
    // Clear form
    document.getElementById('customVaultEntryForm').reset();
    
    // Reset metadata container to single pair
    const metadataContainer = document.getElementById('metadataContainer');
    metadataContainer.innerHTML = `
        <div class="metadata-pair">
            <input type="text" class="metadata-key" placeholder="Key">
            <input type="text" class="metadata-value" placeholder="Value">
            <button type="button" class="metadata-remove" onclick="removeMetadataPair(this)">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    `;
    
    closeCustomVaultEntryModal();
    
    showNotification('Entry saved successfully!', 'success');
}

// Render custom vault entries
function renderCustomVaultEntries(vaultId) {
    const vault = customVaults.find(v => v.id === vaultId);
    if (!vault) return;
    
    const entriesContainer = document.getElementById('customVaultEntriesContainer');
    if (!entriesContainer) return;
    
    if (vault.entries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="no-entries">
                <div class="no-entries-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <h3>No entries yet</h3>
                <p>Start adding entries to organize your investigation data</p>
                <button class="btn-primary" onclick="showCustomVaultEntryModal()">
                    <i class="fas fa-plus"></i>
                    Add First Entry
                </button>
            </div>
        `;
        return;
    }
    
    entriesContainer.innerHTML = vault.entries.map(entry => {
        const metadataHtml = Object.keys(entry.metadata).length > 0 
            ? Object.entries(entry.metadata).map(([key, value]) => 
                `<div class="metadata-item"><strong>${key}:</strong> ${value}</div>`
              ).join('')
            : '<div class="metadata-item">No metadata</div>';
            
        return `
            <div class="custom-vault-entry-card" data-entry-id="${entry.id}">
                <div class="entry-card-header">
                    <div class="entry-type-badge ${entry.type}">
                        <i class="fas fa-${getEntryTypeIcon(entry.type)}"></i>
                        ${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </div>
                    <div class="entry-actions">
                        <button class="entry-action-btn" onclick="editCustomVaultEntry('${entry.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="entry-action-btn" onclick="deleteCustomVaultEntry('${entry.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="entry-card-content">
                    <h4 class="entry-title">${entry.name}</h4>
                    ${entry.description ? `<p class="entry-description">${entry.description}</p>` : ''}
                    
                    <div class="entry-metadata">
                        <h5>Metadata:</h5>
                        ${metadataHtml}
                    </div>
                    
                    ${entry.notes ? `
                        <div class="entry-notes">
                            <h5>Investigation Notes:</h5>
                            <p>${entry.notes}</p>
                        </div>
                    ` : ''}
                    
                    ${entry.tags.length > 0 ? `
                        <div class="entry-tags">
                            ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="entry-footer">
                        <span class="entry-date">Created: ${new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get icon for entry type
function getEntryTypeIcon(type) {
    const icons = {
        'tool': 'tools',
        'email': 'envelope',
        'phone': 'phone',
        'crypto': 'coins',
        'location': 'map-marker-alt',
        'link': 'link',
        'media': 'image',
        'password': 'key',
        'keyword': 'tag',
        'social': 'users',
        'domain': 'globe',
        'username': 'user',
        'threat': 'shield-alt',
        'vulnerability': 'bug',
        'malware': 'virus',
        'breach': 'exclamation-triangle',
        'credential': 'id-card',
        'forum': 'comments',
        'vendor': 'store',
        'telegram': 'paper-plane',
        'paste': 'clipboard',
        'document': 'file-alt',
        'network': 'network-wired',
        'metadata': 'info-circle',
        'archive': 'archive',
        'messaging': 'comment-dots',
        'dating': 'heart',
        'audio': 'volume-up',
        'facial': 'eye',
        'persona': 'mask',
        'vpn': 'user-secret',
        'honeypot': 'spider',
        'exploit': 'bomb',
        'publicrecord': 'file-contract'
    };
    return icons[type] || 'question';
}

// Delete custom vault entry
function deleteCustomVaultEntry(entryId) {
    const vault = customVaults.find(v => v.id === currentCustomVaultId);
    if (!vault) return;
    
    const entryIndex = vault.entries.findIndex(e => e.id === entryId);
    if (entryIndex !== -1) {
        vault.entries.splice(entryIndex, 1);
        saveCustomVaults();
        renderCustomVaultEntries(currentCustomVaultId);
        showNotification('Entry deleted successfully!', 'success');
    }
}

// Show specific view
function showView(viewName) {
    // Hide all views
    const views = ['dashboard', 'actors', 'multi-vault', 'case-studies', 'settings'];
    views.forEach(view => {
        const element = document.getElementById(view);
        if (element) {
            element.classList.remove('active');
        }
    });
    
    // Show selected view
    const selectedView = document.getElementById(viewName);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Update current view
    currentDashboardView = viewName;
    
    // Load view-specific content
    switch (viewName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'actors':
            loadActorsSection();
            break;
        case 'multi-vault':
            // Multi-vault is handled by existing functions
            break;
        case 'settings':
            if (typeof loadSettingsView === 'function') {
                loadSettingsView();
            }
            break;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize the application
async function initializeApp() {
    // We wait for tools to load before proceeding
    await loadTools();

    if (typeof loadVaults === 'function') {
        // Assuming loadVaults is also updated to be async
        await loadVaults();
    }

    // Set up form submission handlers
    // (Your existing logic for event listeners stays here)

    // Load dashboard by default
    showSection('dashboard');
    
    // If you have a function that renders the tools on the dashboard, 
    // call it here AFTER loadTools() has finished.
    if (typeof renderTools === 'function') {
        renderTools(intelligenceTools);
    }
}

// Make functions globally available
window.showSection = showSection;
window.switchParentTab = switchParentTab;
window.switchChildTab = switchChildTab;
window.toggleView = toggleView;
window.showAddToolModal = showAddToolModal;
window.closeAddToolModal = closeAddToolModal;
window.updateChildCategories = updateChildCategories;
window.saveToolForm = saveToolForm;
window.editTool = editTool;
window.deleteTool = deleteTool;
window.togglePin = togglePin;
window.toggleStar = toggleStar;
window.openTool = openTool;
window.toggleToolSelection = toggleToolSelection;
window.bulkPin = bulkPin;
window.bulkStar = bulkStar;
window.bulkDelete = bulkDelete;
window.clearSelection = clearSelection;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.importTools = importTools;
window.exportTools = exportTools;
window.closeImportToolsModal = closeImportToolsModal;
window.sortTools = sortTools;
window.filterToolsByStatus = filterToolsByStatus;
window.showCreateVaultModal = showCreateVaultModal;
window.closeCreateVaultModal = closeCreateVaultModal;
window.createNewVault = createNewVault;
window.switchToVault = switchToVault;
window.switchVaultParentTab = switchVaultParentTab;
window.switchVaultChildTab = switchVaultChildTab;
window.showAddEntryModal = showAddEntryModal;
window.closeAddEntryModal = closeAddEntryModal;
window.updateEntryFields = updateEntryFields;
window.saveVaultEntry = saveVaultEntry;
window.toggleEntryStarred = toggleEntryStarred;
window.toggleEntryPinned = toggleEntryPinned;
window.editVaultEntry = editVaultEntry;
window.deleteVaultEntry = deleteVaultEntry;
window.toggleVaultView = toggleVaultView;
window.filterVaultEntries = filterVaultEntries;
window.sortVaultEntries = sortVaultEntries;
window.exportVaultData = exportVaultData;
window.exportAllVaults = exportAllVaults;
window.importVaultData = importVaultData;
window.showVaultManagement = showVaultManagement;
window.closeVaultManagementModal = closeVaultManagementModal;
window.editVault = editVault;
window.duplicateVault = duplicateVault;
window.archiveVault = archiveVault;
window.deleteVault = deleteVault;

// IMPORTANT: This multiVaultManager is crucial for TraceLink to get vault data
window.multiVaultManager = {
    getVaults: function() {
        return vaults;
    },
    getVaultById: function(vaultId) {
        return vaults.find(v => v.id === vaultId);
    },
    getEntryById: function(vaultId, entryId) {
        const vault = vaults.find(v => v.id === vaultId);
        if (vault) {
            return vault.entries.find(e => e.id === entryId);
        }
        return null;
    }
};
// Dispatch an event once multiVaultManager is defined and ready
document.dispatchEvent(new Event('multiVaultManagerReady'));



// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Event Listeners
document.addEventListener('DOMContentLoaded', async function() {
    await loadTools();
    renderTools(intelligenceTools);
    // Load initial dashboard
    loadDashboard();
    

    // Search functionality
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performGlobalSearch();
            }
        });
        
        // Real-time search with debounce
        let searchTimeout;
        globalSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = this.value.toLowerCase();
            }, 300);
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close modals (already handled more comprehensively in showSection, but good for direct escape)
            if (document.getElementById('addToolModal').style.display === 'flex') {
                closeAddToolModal();
            }
            if (document.getElementById('deleteModal').style.display === 'flex') {
                closeDeleteModal();
            }
            if (document.getElementById('importToolsModal').style.display === 'flex') {
                closeImportToolsModal();
            }
        }
        
        // Quick navigation
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showSection('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    showSection('vault');
                    break;
            }
        }
    });
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    setupVaultSearch();
    
    
    // Initialize Investigation Notes if the script is loaded
    if (typeof InvestigationNotes !== 'undefined') {
        window.investigationNotes = new InvestigationNotes();
    }
});

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements when they're added to the DOM
function observeElements() {
    document.querySelectorAll('.actor-card, .metric-card, .dashboard-card, .tool-card').forEach(el => {
        observer.observe(el);
    });
}

// Call observe elements after DOM updates
setTimeout(observeElements, 100);

/**
 * OSINTrix Mobile Guard
 * Ensures the app only runs on Desktop for UI/UX integrity.
 */
function enforceDesktopAccess() {
    const mobileOverlay = document.getElementById('mobile-restriction');
    if (!mobileOverlay) return;

    // Detection: Width < 1024px OR Mobile User Agent
    const isSmallScreen = window.innerWidth < 1024;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isSmallScreen || isMobileDevice) {
        mobileOverlay.style.display = 'flex';
        
        // Stop background execution to save mobile resources
        if (window.stop) window.stop(); 
        
        // Lock scrolling on the main page
        document.body.style.overflow = 'hidden';
    } else {
        mobileOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Attach listeners
window.addEventListener('load', enforceDesktopAccess);
// Uses your existing debounce function from script.js
window.addEventListener('resize', debounce(enforceDesktopAccess, 250));