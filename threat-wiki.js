/* ==========================================
   THREAT WIKI MANAGER
   Professional Threat Hunting Database
   ========================================== */

   class ThreatWikiManager {
    constructor() {
        this.rules = [];
        this.currentCategory = 'all';
        this.currentFilter = {
            type: 'all',
            severity: 'all',
            category: 'all',
            search: ''
        };
        this.currentView = 'grid';
        this.init();
    }

    async init() {
        await this.loadRules();
        this.setupEventListeners();
    
        const savedView = await localforage.getItem('threatWikiView') || 'grid';
        this.setView(savedView);
        
        this.renderRules();
        this.updateStats();
    }

    async loadRules() {
        try {
            // 1. Try to get user-modified rules from local storage
            const savedRules = await localforage.getItem('threatWikiRules');
            
            if (savedRules && savedRules.length > 0) {
                this.rules = savedRules;
                console.log('Loaded rules from local storage:', this.rules.length);
            } else {
                // 2. If nothing in local storage, fetch the external JSON file
                const response = await fetch('threat-rules.json');
                if (!response.ok) throw new Error('Failed to fetch rules.json');
                
                const defaultRules = await response.json();
                this.rules = defaultRules;
                console.log('Loaded rules from JSON file:', this.rules.length);
                
                // 3. Save to localforage so user can start editing/adding
                await this.saveRules();
            }
        } catch (err) {
            console.error("Critical error loading threat rules:", err);
            this.rules = [];
        }
    }

    async saveRules() {
        try {
            await localforage.setItem('threatWikiRules', this.rules);
            console.log('Rules saved to local storage');
        } catch (err) {
            console.error("Storage Quota Exceeded or Error:", err);
            if (typeof window.showNotification === 'function') {
                window.showNotification("Error saving rules to local database", "error");
            }
        }
    }

    
    setView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.wiki-view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update grid class
        const grid = document.getElementById('threat-wiki-grid');
        if (grid) {
            grid.classList.toggle('list-view', view === 'list');
            grid.classList.toggle('grid-view', view === 'grid');
        }
        
        // Save preference
        localforage.setItem('threatWikiView', view);
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('wiki-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value.toLowerCase();
                this.renderRules();
            });
        }

        // Filters
        const typeFilter = document.getElementById('wiki-type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentFilter.type = e.target.value;
                this.renderRules();
            });
        }

        const severityFilter = document.getElementById('wiki-severity-filter');
        if (severityFilter) {
            severityFilter.addEventListener('change', (e) => {
                this.currentFilter.severity = e.target.value;
                this.renderRules();
            });
        }

        const categoryFilter = document.getElementById('wiki-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter.category = e.target.value;
                this.renderRules();
            });
        }
    }

    filterRules() {
        return this.rules.filter(rule => {
            // Search filter
            if (this.currentFilter.search) {
                const searchLower = this.currentFilter.search;
                const matchesSearch = 
                    rule.title.toLowerCase().includes(searchLower) ||
                    rule.description.toLowerCase().includes(searchLower) ||
                    rule.tags.some(tag => tag.toLowerCase().includes(searchLower));
                
                if (!matchesSearch) return false;
            }

            // Type filter
            if (this.currentFilter.type !== 'all' && rule.type !== this.currentFilter.type) {
                return false;
            }

            // Severity filter
            if (this.currentFilter.severity !== 'all' && rule.severity !== this.currentFilter.severity) {
                return false;
            }

            // Category filter
            if (this.currentCategory !== 'all' && rule.category !== this.currentCategory) {
                return false;
            }

            if (this.currentFilter.category !== 'all' && rule.category !== this.currentFilter.category) {
                return false;
            }

            return true;
        });
    }

    // Optimized renderRules for large datasets
    renderRules(limit = 50) {
        const grid = document.getElementById('threat-wiki-grid');
        if (!grid) return;

        const filteredRules = this.filterRules();

        if (filteredRules.length === 0) {
            grid.innerHTML = `
                <div class="wiki-empty-state" style="grid-column: 1 / -1;">
                    <div class="wiki-empty-icon"><i class="fas fa-shield-virus"></i></div>
                    <h3>No Rules Found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>`;
            return;
        }

        // Only render the first 50 rules initially to maintain performance
        const rulesToDisplay = filteredRules.slice(0, limit);
        grid.innerHTML = rulesToDisplay.map(rule => this.createRuleCard(rule)).join('');

        // Update the total count in the UI header
        const countEl = document.getElementById('total-rules-count');
        if (countEl) countEl.textContent = filteredRules.length;
    }

    createRuleCard(rule) {
        return `
            <div class="wiki-rule-card" data-severity="${rule.severity}" onclick="threatWikiManager.showRuleDetail('${rule.id}')">
                <div class="wiki-rule-header">
                    <span class="rule-type-badge ${rule.type}">
                        <i class="fas fa-${rule.type === 'sigma' ? 'file-code' : 'shield-virus'}"></i>
                        ${rule.type.toUpperCase()}
                    </span>
                    <div class="wiki-rule-actions">
                        <button class="wiki-rule-action-btn ${rule.starred ? 'starred' : ''}" 
                                onclick="event.stopPropagation(); threatWikiManager.toggleStar('${rule.id}')" 
                                title="${rule.starred ? 'Unstar' : 'Star'}">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="wiki-rule-action-btn" 
                                onclick="event.stopPropagation(); threatWikiManager.exportRule('${rule.id}')" 
                                title="Export">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="wiki-rule-action-btn" 
                                onclick="event.stopPropagation(); threatWikiManager.deleteRule('${rule.id}')" 
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <h3 class="wiki-rule-title">${rule.title}</h3>
                <p class="wiki-rule-description">${rule.description}</p>

                <div class="wiki-rule-metadata">
                    <div class="metadata-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span class="severity-badge ${rule.severity}">${rule.severity}</span>
                    </div>
                    <div class="metadata-item">
                        <i class="fas fa-layer-group"></i>
                        <span class="metadata-value">${rule.category}</span>
                    </div>
                    <div class="metadata-item">
                        <i class="fas fa-bullseye"></i>
                        <span class="metadata-value">${rule.technique}</span>
                    </div>
                </div>

                <div class="wiki-rule-tags">
                    ${rule.tags.map(tag => `<span class="wiki-rule-tag">${tag}</span>`).join('')}
                </div>

                <div class="wiki-rule-footer">
                    <div class="rule-author">
                        <i class="fas fa-user"></i>
                        <span>${rule.author}</span>
                    </div>
                    <div class="rule-date">${new Date(rule.created).toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active state
        document.querySelectorAll('.wiki-category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });

        this.renderRules();
        this.updateStats();
    }

    showRuleDetail(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        const modal = document.getElementById('wiki-detail-modal');
        const modalBody = document.getElementById('wiki-detail-body');

        modalBody.innerHTML = `
            <div class="rule-detail-header">
                <div class="rule-detail-title">
                    <h2>${rule.title}</h2>
                    <div class="rule-detail-meta">
                        <span class="rule-type-badge ${rule.type}">
                            <i class="fas fa-${rule.type === 'sigma' ? 'file-code' : 'shield-virus'}"></i>
                            ${rule.type.toUpperCase()}
                        </span>
                        <span class="severity-badge ${rule.severity}">${rule.severity}</span>
                        <span class="metadata-item">
                            <i class="fas fa-user"></i>
                            ${rule.author}
                        </span>
                        <span class="metadata-item">
                            <i class="fas fa-calendar"></i>
                            ${new Date(rule.created).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div class="rule-detail-actions">
                    <button class="btn-secondary" onclick="threatWikiManager.exportRule('${rule.id}')">
                        <i class="fas fa-download"></i>
                        Export
                    </button>
                    <button class="btn-primary" onclick="threatWikiManager.editRule('${rule.id}')">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                </div>
            </div>

            <div class="rule-detail-section">
                <h3><i class="fas fa-info-circle"></i> Description</h3>
                <p>${rule.description}</p>
            </div>

            <div class="rule-detail-section">
                <h3><i class="fas fa-code"></i> Rule Code</h3>
                <div class="rule-code-block">
                    <button class="copy-code-btn" onclick="threatWikiManager.copyCode('${rule.id}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <pre><code>${this.escapeHtml(rule.code)}</code></pre>
                </div>
            </div>

            <div class="rule-detail-section">
                <h3><i class="fas fa-bullseye"></i> Detection Details</h3>
                <div class="wiki-rule-metadata">
                    <div class="metadata-item">
                        <i class="fas fa-layer-group"></i>
                        <strong>Category:</strong> <span class="metadata-value">${rule.category}</span>
                    </div>
                    <div class="metadata-item">
                        <i class="fas fa-crosshairs"></i>
                        <strong>Technique:</strong> <span class="metadata-value">${rule.technique}</span>
                    </div>
                    ${rule.platform ? `
                        <div class="metadata-item">
                            <i class="fas fa-laptop"></i>
                            <strong>Platform:</strong> <span class="metadata-value">${rule.platform}</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${rule.tags && rule.tags.length > 0 ? `
                <div class="rule-detail-section">
                    <h3><i class="fas fa-tags"></i> Tags</h3>
                    <div class="wiki-rule-tags">
                        ${rule.tags.map(tag => `<span class="wiki-rule-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${rule.references && rule.references.length > 0 ? `
                <div class="rule-detail-section">
                    <h3><i class="fas fa-link"></i> References</h3>
                    <ul class="references-list">
                        ${rule.references.map(ref => `
                            <li><a href="${ref}" target="_blank" rel="noopener noreferrer">${ref}</a></li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        modal.style.display = 'flex';
    }

    closeDetailModal() {
        document.getElementById('wiki-detail-modal').style.display = 'none';
    }

    showAddRuleModal() {
        document.getElementById('wiki-add-rule-modal').style.display = 'flex';
        document.getElementById('wiki-rule-form').reset();
        document.getElementById('wiki-rule-id').value = '';
        document.getElementById('wiki-modal-title').textContent = 'Add New Rule';
    }

    closeAddRuleModal() {
        document.getElementById('wiki-add-rule-modal').style.display = 'none';
    }

    saveRule(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const ruleId = formData.get('rule-id');
        
        const ruleData = {
            id: ruleId || Date.now().toString(),
            type: formData.get('rule-type'),
            title: formData.get('rule-title'),
            description: formData.get('rule-description'),
            code: formData.get('rule-code'),
            severity: formData.get('rule-severity'),
            category: formData.get('rule-category'),
            technique: formData.get('rule-technique'),
            author: formData.get('rule-author'),
            platform: formData.get('rule-platform') || '',
            tags: formData.get('rule-tags') ? formData.get('rule-tags').split(',').map(t => t.trim()) : [],
            references: formData.get('rule-references') ? formData.get('rule-references').split('\n').filter(r => r.trim()) : [],
            created: ruleId ? this.rules.find(r => r.id === ruleId).created : new Date().toISOString(),
            modified: new Date().toISOString(),
            starred: ruleId ? this.rules.find(r => r.id === ruleId).starred : false
        };

        if (ruleId) {
            const index = this.rules.findIndex(r => r.id === ruleId);
            this.rules[index] = ruleData;
            showNotification('Rule updated successfully', 'success');
        } else {
            this.rules.push(ruleData);
            showNotification('Rule added successfully', 'success');
        }

        this.saveRules();
        this.renderRules();
        this.updateStats();
        this.closeAddRuleModal();
    }

    editRule(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        this.closeDetailModal();
        
        // Populate form
        document.getElementById('wiki-rule-id').value = rule.id;
        document.getElementById('rule-type').value = rule.type;
        document.getElementById('rule-title').value = rule.title;
        document.getElementById('rule-description').value = rule.description;
        document.getElementById('rule-code').value = rule.code;
        document.getElementById('rule-severity').value = rule.severity;
        document.getElementById('rule-category').value = rule.category;
        document.getElementById('rule-technique').value = rule.technique;
        document.getElementById('rule-author').value = rule.author;
        document.getElementById('rule-platform').value = rule.platform || '';
        document.getElementById('rule-tags').value = rule.tags.join(', ');
        document.getElementById('rule-references').value = rule.references.join('\n');

        document.getElementById('wiki-modal-title').textContent = 'Edit Rule';
        document.getElementById('wiki-add-rule-modal').style.display = 'flex';
    }

    deleteRule(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        if (confirm(`Are you sure you want to delete "${rule.title}"? This action cannot be undone.`)) {
            this.rules = this.rules.filter(r => r.id !== ruleId);
            this.saveRules();
            this.renderRules();
            this.updateStats();
            showNotification('Rule deleted successfully', 'success');
        }
    }

    toggleStar(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.starred = !rule.starred;
            this.saveRules();
            this.renderRules();
            showNotification(rule.starred ? 'Rule starred' : 'Rule unstarred', 'info');
        }
    }

    exportRule(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        const dataStr = rule.code;
        const dataBlob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${rule.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${rule.type === 'sigma' ? 'yml' : 'yar'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        showNotification('Rule exported successfully', 'success');
    }

    exportAllRules() {
        if (this.rules.length === 0) {
            showNotification('No rules available to export', 'warning');
            return;
        }

        const dataStr = JSON.stringify(this.rules, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `all_threat_rules_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('All rules exported successfully', 'success');
    }

    // NEW: Import rules from JSON file
    importRules() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await file.text();
                const importedRules = JSON.parse(text);
                
                if (!Array.isArray(importedRules)) {
                    throw new Error('Invalid JSON format');
                }
                
                // Ask user: merge or replace?
                const merge = confirm('Merge with existing rules? (Cancel to replace all rules)');
                
                if (merge) {
                    // Add imported rules that don't exist
                    let addedCount = 0;
                    importedRules.forEach(rule => {
                        if (!this.rules.find(r => r.id === rule.id)) {
                            this.rules.push(rule);
                            addedCount++;
                        }
                    });
                    showNotification(`${addedCount} new rules imported`, 'success');
                } else {
                    // Replace all
                    this.rules = importedRules;
                    showNotification(`All rules replaced. Total: ${this.rules.length}`, 'success');
                }
                
                await this.saveRules();
                this.renderRules();
                this.updateStats();
            } catch (err) {
                console.error('Import error:', err);
                showNotification('Failed to import rules: ' + err.message, 'error');
            }
        };
        
        input.click();
    }

    // NEW: Reset to default rules from JSON
    async resetToDefault() {
        if (!confirm('Reset to default rules? All your custom rules and edits will be lost. This cannot be undone!')) {
            return;
        }
        
        try {
            const response = await fetch('threat-rules.json');
            if (!response.ok) throw new Error('Failed to fetch default rules');
            
            const defaultRules = await response.json();
            this.rules = defaultRules;
            
            await localforage.setItem('threatWikiRules', this.rules);
            
            this.renderRules();
            this.updateStats();
            showNotification('Rules reset to default from JSON file', 'success');
        } catch (err) {
            console.error('Reset error:', err);
            showNotification('Failed to reset rules: ' + err.message, 'error');
        }
    }

    copyCode(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        navigator.clipboard.writeText(rule.code).then(() => {
            showNotification('Code copied to clipboard', 'success');
        }).catch(err => {
            console.error('Copy failed:', err);
            showNotification('Failed to copy code', 'error');
        });
    }

    updateStats() {
        const sigmaCount = this.rules.filter(r => r.type === 'sigma').length;
        const yaraCount = this.rules.filter(r => r.type === 'yara').length;
        const totalCount = this.rules.length;

        document.getElementById('sigma-count').textContent = sigmaCount;
        document.getElementById('yara-count').textContent = yaraCount;
        document.getElementById('total-rules-count').textContent = totalCount;

        // Update all category count
        const allCountEl = document.querySelector('[data-category="all"] .category-count');
        if (allCountEl) allCountEl.textContent = totalCount;

        // Update other category counts
        const categories = ['malware', 'apt', 'ransomware', 'persistence', 'credential-access', 'lateral-movement', 'exfiltration'];
        categories.forEach(cat => {
            const count = this.rules.filter(r => r.category === cat).length;
            const countEl = document.querySelector(`[data-category="${cat}"] .category-count`);
            if (countEl) {
                countEl.textContent = count;
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
let threatWikiManager;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('threat-wiki-grid')) {
        threatWikiManager = new ThreatWikiManager();
        window.threatWikiManager = threatWikiManager;
    }
});

// Smooth scroll to top
const scrollBtn = document.createElement('div');
scrollBtn.className = 'scroll-to-top';
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ff4757, #ff6b7a);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
`;
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.visibility = 'visible';
    } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
