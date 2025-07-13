// case-studies.js - Case Studies Management
class CaseStudiesManager {
    constructor(initialCaseStudies = []) {
        this.caseStudies = initialCaseStudies;
        this.currentCaseStudiesView = 'grid';
        this.editingCaseStudyId = null;
        this.currentPreviewUrl = null;
        this.currentCategoryFilter = 'all'; // New state for category tabs

        this.loadCaseStudiesFromStorage(); // Load from local storage on init
        this.initializeUI();
    }

    initializeUI() {
        this.updateCaseStudiesStats();
        this.setupEventListeners();
        this.filterCaseStudies(); // Initial render
    }

    setupEventListeners() {
        // Event listener for the "Add Case Study" button
        const addCaseStudyBtn = document.querySelector('#case-studies .btn-primary');
        if (addCaseStudyBtn) {
            addCaseStudyBtn.onclick = () => this.showAddCaseStudyForm();
        }

        // Event listeners for view toggles (grid/list)
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listViewBtn = document.getElementById('list-view-btn');

        // Ensure these buttons exist before adding listeners
        if (gridViewBtn) {
            gridViewBtn.onclick = () => this.setCaseStudyView('grid');
        } else {
            console.warn("Grid view button not found. Check HTML ID 'grid-view-btn'.");
        }
        if (listViewBtn) {
            listViewBtn.onclick = () => this.setCaseStudyView('list');
        } else {
            console.warn("List view button not found. Check HTML ID 'list-view-btn'.");
        }

        // Event listeners for filter tabs
        document.querySelectorAll('.case-studies-filter-tabs .filter-tab').forEach(button => {
            button.addEventListener('click', () => {
                this.currentCategoryFilter = button.dataset.category;
                document.querySelectorAll('.case-studies-filter-tabs .filter-tab').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filterCaseStudies();
            });
        });

        // Event listeners for search input (with debounce)
        const searchInput = document.getElementById('case-studies-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterCaseStudies();
                }, 300);
            });
        }

        // Event listeners for filter and sort dropdowns (hidden in new design, but keep for logic if they are to be revealed)
        const categoryFilter = document.getElementById('case-studies-category-filter');
        if (categoryFilter) categoryFilter.onchange = () => this.filterCaseStudies();

        const sortSelect = document.getElementById('case-studies-sort');
        if (sortSelect) sortSelect.onchange = () => this.filterCaseStudies();

        // Modal form submission and close
        const caseStudyForm = document.getElementById('case-study-form');
        if (caseStudyForm) {
            caseStudyForm.onsubmit = (event) => this.saveCaseStudy(event);
        }

        const autoFetchBtn = document.getElementById('auto-fetch-btn');
        if (autoFetchBtn) {
            autoFetchBtn.onclick = (event) => this.autoFetchCaseStudyInfo(event);
        }

        const closeAddModalBtn = document.querySelector('#addCaseStudyModal .close');
        if (closeAddModalBtn) {
            closeAddModalBtn.onclick = () => this.closeAddCaseStudyModal();
        }

        const closePreviewModalBtn = document.querySelector('#caseStudyPreviewModal .close');
        if (closePreviewModalBtn) {
            closePreviewModalBtn.onclick = () => this.closeCaseStudyPreview();
        }

        const openExternalBtn = document.querySelector('#caseStudyPreviewModal .btn-primary');
        if (openExternalBtn) {
            openExternalBtn.onclick = () => this.openExternalCaseStudy();
        }
    }

    updateCaseStudiesStats() {
        const totalStudies = this.caseStudies.length;
        const starredStudies = this.caseStudies.filter(study => study.starred).length;
        const pinnedStudies = this.caseStudies.filter(study => study.pinned).length;
        const categories = [...new Set(this.caseStudies.map(study => study.category))].length;

        const totalElement = document.getElementById('total-case-studies');
        if (totalElement) totalElement.textContent = totalStudies;
        const starredElement = document.getElementById('starred-case-studies');
        if (starredElement) starredElement.textContent = starredStudies;
        const pinnedElement = document.getElementById('pinned-case-studies');
        if (pinnedElement) pinnedElement.textContent = pinnedStudies;
        const categoriesElement = document.getElementById('case-study-categories');
        if (categoriesElement) categoriesElement.textContent = categories;
    }

    setCaseStudyView(view) {
        this.currentCaseStudiesView = view;

        // Update active state of view buttons immediately
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listViewBtn = document.getElementById('list-view-btn');

        if (gridViewBtn) gridViewBtn.classList.toggle('active', view === 'grid');
        if (listViewBtn) listViewBtn.classList.toggle('active', view === 'list');

        // Re-filter to ensure current category filter is applied
        this.filterCaseStudies();
    }

    showAddCaseStudyForm() {
        this.editingCaseStudyId = null;
        document.getElementById('case-study-modal-title').textContent = 'Add New Case Study';
        document.getElementById('case-study-form').reset();
        document.getElementById('addCaseStudyModal').style.display = 'flex';

        // Set default category if needed, or leave blank for user selection
        document.getElementById('case-study-category').value = '';
        document.getElementById('case-study-title').focus();
    }

    closeAddCaseStudyModal() {
        document.getElementById('addCaseStudyModal').style.display = 'none';
        this.editingCaseStudyId = null;
        document.getElementById('case-study-form').reset(); // Ensure form is reset on close
    }

    async autoFetchCaseStudyInfo(event) {
        // This function cannot fetch real data from external URLs due to browser's Same-Origin Policy.
        // It's designed to simulate fetching for demonstration purposes in a client-side only environment.
        // For actual fetching, a backend proxy would be required.

        const urlInput = document.getElementById('case-study-url');
        const url = urlInput.value.trim();

        if (!url) {
            this.showNotification('Please enter a URL first', 'error');
            return;
        }

        const fetchBtn = event.target;
        const originalText = fetchBtn.innerHTML;
        fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
        fetchBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            const simulatedData = {
                title: "Simulated Case Study Title for: " + url.substring(0, 30) + "...",
                author: "Simulated Author",
                source: "Simulated Source",
                preview: `This is a simulated preview content for the case study linked to "${url}". In a real application, this content would be scraped from the provided URL, summarizing the article's main points. Due to browser security policies (Same-Origin Policy), direct scraping from client-side JavaScript is not possible. A server-side proxy is required for real-time fetching.`,
                category: "osint" // Default category
            };

            // Extract domain for source if applicable (can be enhanced with real parsing)
            try {
                const domain = new URL(url).hostname.replace('www.', '');
                simulatedData.source = domain.charAt(0).toUpperCase() + domain.slice(1);
            } catch (e) {
                // Invalid URL, keep default simulated source
            }

            document.getElementById('case-study-title').value = simulatedData.title;
            document.getElementById('case-study-author').value = simulatedData.author;
            document.getElementById('case-study-source').value = simulatedData.source;
            document.getElementById('case-study-preview').value = simulatedData.preview;
            document.getElementById('case-study-category').value = simulatedData.category;

            this.showNotification('Information fetched (simulated) successfully!', 'success');
        } catch (error) {
            console.error('Auto-fetch simulation error:', error);
            this.showNotification('Could not auto-fetch (simulated). Please fill manually.', 'warning');
        } finally {
            fetchBtn.innerHTML = originalText;
            fetchBtn.disabled = false;
        }
    }

    saveCaseStudy(event) {
        event.preventDefault();

        const formData = {
            url: document.getElementById('case-study-url').value.trim(),
            title: document.getElementById('case-study-title').value.trim(),
            author: document.getElementById('case-study-author').value.trim(),
            source: document.getElementById('case-study-source').value.trim(),
            category: document.getElementById('case-study-category').value,
            preview: document.getElementById('case-study-preview').value.trim(),
            tags: document.getElementById('case-study-tags').value.trim(),
            notes: document.getElementById('case-study-notes').value.trim()
        };

        if (!formData.url || !formData.title || !formData.category) {
            this.showNotification('Please fill in all required fields: Title, URL, and Category.', 'error');
            return;
        }

        const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        const now = new Date().toISOString().split('T')[0];

        if (this.editingCaseStudyId) {
            // Update existing case study
            const index = this.caseStudies.findIndex(cs => cs.id === this.editingCaseStudyId);
            if (index !== -1) {
                this.caseStudies[index] = {
                    ...this.caseStudies[index], // Keep original pinned/starred status if not explicitly changed
                    ...formData,
                    tags: tags,
                    dateModified: now
                };
                this.showNotification('Case study updated successfully!', 'success');
            } else {
                this.showNotification('Error: Case study not found for update.', 'error');
                return;
            }
        } else {
            // Add new case study
            const newCaseStudy = {
                id: Date.now(), // Use Date.now() for unique ID for new entries
                ...formData,
                tags: tags,
                dateAdded: now,
                dateModified: now,
                starred: false,
                pinned: false,
                preAdded: false // <--- Set to false for user-added studies
            };
            this.caseStudies.push(newCaseStudy);
            this.showNotification('Case study added successfully!', 'success');
        }

        this.saveCaseStudiesToStorage();
        this.closeAddCaseStudyModal();
        this.filterCaseStudies(); // Re-render all case studies with applied filters
        this.updateCaseStudiesStats(); // Update stats
    }

    editCaseStudy(id) {
        const caseStudy = this.caseStudies.find(cs => cs.id === id);
        if (!caseStudy) {
            this.showNotification('Case study not found for editing.', 'error');
            return;
        }

        this.editingCaseStudyId = id;
        document.getElementById('case-study-modal-title').textContent = 'Edit Case Study';

        // Populate form fields correctly
        document.getElementById('case-study-url').value = caseStudy.url;
        document.getElementById('case-study-title').value = caseStudy.title;
        document.getElementById('case-study-author').value = caseStudy.author || '';
        document.getElementById('case-study-source').value = caseStudy.source || '';
        document.getElementById('case-study-category').value = caseStudy.category;
        document.getElementById('case-study-preview').value = caseStudy.preview || '';
        document.getElementById('case-study-tags').value = caseStudy.tags.join(', ');
        document.getElementById('case-study-notes').value = caseStudy.notes || '';

        document.getElementById('addCaseStudyModal').style.display = 'flex'; // Use flex for modal display
        document.getElementById('case-study-title').focus();
    }

    deleteCaseStudy(id) {
        if (confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
            this.caseStudies = this.caseStudies.filter(cs => cs.id !== id);
            this.saveCaseStudiesToStorage();
            this.filterCaseStudies();
            this.updateCaseStudiesStats();
            this.showNotification('Case study deleted successfully!', 'success');
        }
    }

    toggleCaseStudyStar(id) {
        const caseStudy = this.caseStudies.find(cs => cs.id === id);
        if (caseStudy) {
            caseStudy.starred = !caseStudy.starred;
            this.saveCaseStudiesToStorage();
            this.filterCaseStudies(); // Re-render to update the star icon color
            this.updateCaseStudiesStats();
            this.showNotification(`Case study ${caseStudy.starred ? 'starred' : 'unstarred'}!`, 'info');
        }
    }

    toggleCaseStudyPin(id) {
        const caseStudy = this.caseStudies.find(cs => cs.id === id);
        if (caseStudy) {
            caseStudy.pinned = !caseStudy.pinned;
            this.saveCaseStudiesToStorage();
            this.filterCaseStudies(); // Re-render to update the pin icon color and order
            this.updateCaseStudiesStats();
            this.showNotification(`Case study ${caseStudy.pinned ? 'pinned' : 'unpinned'}!`, 'info');
        }
    }

    previewCaseStudy(id) {
        const caseStudy = this.caseStudies.find(cs => cs.id === id);
        if (!caseStudy) return;

        this.currentPreviewUrl = caseStudy.url;

        // The main modal title is set here, so no need for an H3 inside the content.
        document.getElementById('previewTitle').textContent = caseStudy.title;

        // Corrected previewContent - removed duplicate title
        const previewContent = `

            <div class="case-study-preview-body">
                <div class="preview-section">
                    <h4>Preview Content</h4>
                    <p>${caseStudy.preview || 'No preview available'}</p>
                </div>


                ${caseStudy.notes ? `
                    <div class="preview-section">
                        <h4>Notes</h4>
                        <p>${caseStudy.notes}</p>
                    </div>
                ` : ''}

                <div class="preview-section">
                    <h4>URL</h4>
                    <a href="${caseStudy.url}" target="_blank" class="url-link" rel="noopener noreferrer">${caseStudy.url}</a>
                </div>

                ${caseStudy.tags.length > 0 ? `
                    <div class="preview-section">
                        <h4>Tags</h4>
                        <div class="tags-container">
                            ${caseStudy.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

            </div>
        `;

        document.getElementById('case-study-preview-content').innerHTML = previewContent;
        document.getElementById('caseStudyPreviewModal').style.display = 'flex'; // Use flex for modal display
    }

    closeCaseStudyPreview() {
        document.getElementById('caseStudyPreviewModal').style.display = 'none';
        this.currentPreviewUrl = null;
    }

    openExternalCaseStudy() {
        if (this.currentPreviewUrl) {
            window.open(this.currentPreviewUrl, '_blank');
        }
    }

    filterCaseStudies(clickedButton = null) {
        const searchTerm = document.getElementById('case-studies-search')?.value.toLowerCase() || '';
        // If a button was clicked, update the filter state and the 'active' class
        if (clickedButton) {
            this.currentCategoryFilter = clickedButton.dataset.category;
            document.querySelectorAll('.case-studies-filter-tabs .filter-tab').forEach(btn => btn.classList.remove('active'));
            clickedButton.classList.add('active');
        }

        const categoryFilterValue = this.currentCategoryFilter; // Use the internal state

        const sortBy = document.getElementById('case-studies-sort')?.value || 'newest'; // This dropdown is hidden but logic remains

        let filteredStudies = this.caseStudies.filter(study => {
            const matchesSearch = !searchTerm ||
                study.title.toLowerCase().includes(searchTerm) ||
                (study.author && study.author.toLowerCase().includes(searchTerm)) ||
                (study.source && study.source.toLowerCase().includes(searchTerm)) ||
                (study.preview && study.preview.toLowerCase().includes(searchTerm)) ||
                (study.notes && study.notes.toLowerCase().includes(searchTerm)) ||
                (Array.isArray(study.tags) && study.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

            const matchesCategory = categoryFilterValue === 'all' || study.category === categoryFilterValue;

            return matchesSearch && matchesCategory;
        });

        // Sort studies
        filteredStudies.sort((a, b) => {
            // Pinned items always come first
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            // Starred items come next among non-pinned or equally pinned items
            if (a.starred && !b.starred) return -1;
            if (!a.starred && b.starred) return 1;

            switch (sortBy) {
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'oldest':
                    return new Date(a.dateAdded) - new Date(b.dateAdded);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return (a.author || '').localeCompare(b.author || '');
                // 'starred' and 'pinned' are handled above for primary sort order
                default:
                    return 0;
            }
        });

        this.renderCaseStudies(filteredStudies);
    }


    renderCaseStudies(studiesToRender = null) {
        const container = document.getElementById('case-studies-grid');
        const studies = studiesToRender || this.caseStudies;

        if (!container) return;

        if (studies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No Case Studies Found</h3>
                    <p>Start building your research collection by adding case studies</p>
                    <button class="btn-primary" onclick="window.caseStudiesManager.showAddCaseStudyForm()">
                        <i class="fas fa-plus"></i> Add First Case Study
                    </button>
                </div>
            `;
            // Ensure the container's display is flex for centering the empty state
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            container.style.minHeight = '400px';
            return;
        }

        // Reset flex properties if content is present
        container.style.display = '';
        container.style.flexDirection = '';
        container.style.justifyContent = '';
        container.style.alignItems = '';
        container.style.minHeight = '';

        // Set the container's class based on the view mode
        container.className = this.currentCaseStudiesView === 'grid' ? 'case-studies-grid' : 'case-studies-list';

        // Render cards or list items
        container.innerHTML = studies.map(study => {
            if (this.currentCaseStudiesView === 'grid') {
                return this.createCaseStudyCard(study);
            } else {
                return this.createCaseStudyListItem(study);
            }
        }).join('');

        // Ensure view buttons reflect the current view after rendering
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listViewBtn = document.getElementById('list-view-btn');
        if (gridViewBtn) gridViewBtn.classList.toggle('active', this.currentCaseStudiesView === 'grid');
        if (listViewBtn) listViewBtn.classList.toggle('active', this.currentCaseStudiesView === 'list');
    }

    createCaseStudyCard(study) {
        const categoryColors = {
            'crypto': '#f39c12',
            'blockchain': '#3498db',
            'socmint': '#2ecc71',
            'threat-hunting': '#e74c3c',
            'osint': '#00acee',
            'digital-forensics': '#007bff',
            'malware-analysis': '#9b59b6',
            'incident-response': '#ff6b7a',
            'cyber-crime': '#c0392b',
            'apt': '#7877c6',
            'vulnerability': '#f59e0b',
            'other': '#6c757d',
            'breach-analysis': '#5A67D8',
            'financial-osint': '#D69E2E',
            'legal-ethical-osint': '#38B2AC',
            'reconnaissance': '#C05621',
            'social-engineering': '#805AD5',
            'threat-intelligence': '#E53E3E'
        };

        // Ensure categoryColor is defined from mapping, fallback to default if not found
        const categoryColor = categoryColors[study.category] || '#6c757d';

        // Sanitize source and author to ensure they display "Unknown" if empty
        const displaySource = study.source && study.source.trim() !== '' ? study.source : 'Unknown Source';
        const displayAuthor = study.author && study.author.trim() !== '' ? study.author : 'Unknown Author';

        return `
            <div class="case-study-card ${study.pinned ? 'pinned' : ''} ${study.starred ? 'starred' : ''}" data-id="${study.id}">
                <div class="case-study-header">
                    <div class="case-study-badges">
                        ${study.preAdded ? '<span class="badge badge-preadded">Pre-added</span>' : '<span class="badge badge-user-added">User-added</span>'}
                    </div>
                    <div class="case-study-actions visible-actions" onclick="event.stopPropagation()">
                        <button class="case-study-action-btn ${study.starred ? 'starred-active' : ''}"
                                onclick="window.caseStudiesManager.toggleCaseStudyStar(${study.id})" title="Star">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="case-study-action-btn ${study.pinned ? 'pinned-active' : ''}"
                                onclick="window.caseStudiesManager.toggleCaseStudyPin(${study.id})" title="Pin">
                            <i class="fas fa-thumbtack"></i>
                        </button>
                        <button class="case-study-action-btn" onclick="window.caseStudiesManager.editCaseStudy(${study.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="case-study-action-btn delete" onclick="window.caseStudiesManager.deleteCaseStudy(${study.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>


                <div class="case-study-content" onclick="window.caseStudiesManager.previewCaseStudy(${study.id})">
                    <h3 class="case-study-title">${study.title}</h3>
                    <div class="case-study-source-link">
                        ${displaySource} <i class="fas fa-external-link-alt"></i>
                    </div>

                    <p class="case-study-preview">${study.preview ? study.preview.substring(0, 150) + '...' : 'No preview available'}</p>

                    ${study.tags.length > 0 ? `
                        <div class="case-study-tags">
                            ${study.tags.map(tag => `<span class="tag ${tag}">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <br>
                <div class="list-item-meta">
                    <span class="meta-item">
                        <i class="fas fa-calendar"></i> Published: ${this.formatDate(study.dateAdded)}
                    </span>
                    <span class="meta-item tag-category" style="background-color: ${categoryColor}">
                        <i class="fas fa-tag"></i> ${study.category.replace('-', ' ').toUpperCase()}
                    </span>
                </div>
            </div>
        `;
    }

    createCaseStudyListItem(study) {
        const categoryColors = {
            'crypto': '#f39c12',
            'blockchain': '#3498db',
            'socmint': '#2ecc71',
            'threat-hunting': '#e74c3c',
            'osint': '#00acee',
            'digital-forensics': '#007bff',
            'malware-analysis': '#9b59b6',
            'incident-response': '#ff6b7a',
            'cyber-crime': '#c0392b',
            'apt': '#7877c6',
            'vulnerability': '#f59e0b',
            'other': '#6c757d',
            'breach-analysis': '#5A67D8',
            'financial-osint': '#D69E2E',
            'legal-ethical-osint': '#38B2AC',
            'reconnaissance': '#C05621',
            'social-engineering': '#805AD5',
            'threat-intelligence': '#E53E3E'
        };

        const categoryColor = categoryColors[study.category] || '#95a5a6';

        // Sanitize source and author to ensure they display "Unknown" if empty
        const displaySource = study.source && study.source.trim() !== '' ? study.source : 'Unknown Source';
        const displayAuthor = study.author && study.author.trim() !== '' ? study.author : 'Unknown Author';

        return `
            <div class="case-study-list-item ${study.pinned ? 'pinned' : ''} ${study.starred ? 'starred' : ''}" data-id="${study.id}" onclick="window.caseStudiesManager.previewCaseStudy(${study.id})">
                <div class="list-item-content">
                    <div class="list-item-header">
                         <div class="list-item-badges">
                            ${study.preAdded ? '<span class="badge badge-preadded">Pre-added</span>' : '<span class="badge badge-user-added">User-added</span>'}
                        </div>
                        <div class="list-item-actions visible-actions" onclick="event.stopPropagation()">
                            <button class="case-study-action-btn ${study.starred ? 'starred-active' : ''}"
                                    onclick="window.caseStudiesManager.toggleCaseStudyStar(${study.id})" title="Star">
                                <i class="fas fa-star"></i>
                            </button>
                            <button class="case-study-action-btn ${study.pinned ? 'pinned-active' : ''}"
                                    onclick="window.caseStudiesManager.toggleCaseStudyPin(${study.id})" title="Pin">
                                <i class="fas fa-thumbtack"></i>
                            </button>
                            <button class="case-study-action-btn" onclick="window.caseStudiesManager.editCaseStudy(${study.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="case-study-action-btn delete" onclick="window.caseStudiesManager.deleteCaseStudy(${study.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <h3 class="list-item-title">${study.title}</h3>

                    <div class="list-item-meta">
                        <span class="meta-item">
                            <i class="fas fa-user"></i> ${displayAuthor}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-building"></i> ${displaySource}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i> Published: ${this.formatDate(study.dateAdded)}
                        </span>
                        <span class="meta-item tag-category" style="background-color: ${categoryColor}">
                            <i class="fas fa-tag"></i> ${study.category.replace('-', ' ').toUpperCase()}
                        </span>
                    </div>

                    <p class="list-item-preview">${study.preview ? study.preview.substring(0, 200) + '...' : 'No preview available'}</p>

                    ${study.tags.length > 0 ? `
                        <div class="list-item-tags">
                            ${study.tags.map(tag => `<span class="tag ${tag}">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${study.notes ? `
                        <div class="list-item-notes-preview">
                            Notes: ${study.notes.substring(0, 100)}...
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    saveCaseStudiesToStorage() {
        localStorage.setItem('threatnet_case_studies', JSON.stringify(this.caseStudies));
    }

    loadCaseStudiesFromStorage() {
        const stored = localStorage.getItem('threatnet_case_studies');
        this.caseStudies = stored ? JSON.parse(stored) : [
            // Initial dummy data for demonstration
            {
                id: 1,
                title: "APT28's Spear-Phishing Tactics Exposed",
                source: "Mandiant Blog",
                author: "Security Research Team",
                url: "https://www.mandiant.com/resources/blog/apt28-spear-phishing-tactics",
                category: "apt",
                preview: "Detailed analysis of recent spear-phishing campaigns attributed to APT28, focusing on their evolving TTPs and targeting vectors. Includes IOCs and recommendations for defense.",
                tags: ["apt", "phishing", "russia", "threat intelligence"],
                notes: "Good overview of their recent activities. Check out the custom malware mentioned.",
                dateAdded: "2024-03-15",
                dateModified: "2024-03-15",
                pinned: true,
                starred: false,
                preAdded: true // Indicates this is dummy data
            },
            {
                id: 2,
                title: "OSINT for Financial Investigations: Following the Money Trail",
                source: "OSINT Today",
                author: "Jane Analyst",
                url: "https://osint.today/financial-investigations-money-trail",
                category: "financial-osint",
                preview: "Exploration of open-source intelligence techniques for tracking financial flows, including cryptocurrency analysis, corporate registry lookups, and public financial disclosures. Practical tips for investigators.",
                tags: ["osint", "finance", "cryptocurrency", "investigation"],
                notes: "Excellent practical tips for tracing illicit funds. Need to explore the recommended tools further.",
                dateAdded: "2024-01-20",
                dateModified: "2024-01-20",
                pinned: false,
                starred: true,
                preAdded: true // Indicates this is dummy data
            },
            {
                id: 3,
                title: "Understanding Ransomware Attack Chains: A Case Study",
                source: "CISA",
                author: "Cybersecurity & Infrastructure Security Agency",
                url: "https://www.cisa.gov/uscert/ncas/alerts/aa20-295a",
                category: "incident-response",
                preview: "This alert details the typical stages of a ransomware attack, using recent incidents as examples. It provides guidance for organizations to defend against and respond to ransomware threats effectively.",
                tags: ["ransomware", "cybersecurity", "incident response", "threats"],
                notes: "Solid, actionable advice. Useful for tabletop exercises.",
                dateAdded: "2023-08-01",
                dateModified: "2023-08-01",
                pinned: false,
                starred: false,
                preAdded: true // Indicates this is dummy data
            }
        ];
    }

    // Utility function to format dates
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Proxy for global showNotification (assuming it exists in script.js or similar global scope)
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`Notification (${type}): ${message}`);
            // Fallback for standalone testing
            const notificationDiv = document.createElement('div');
            notificationDiv.textContent = message;
            notificationDiv.style.cssText = `
                position: fixed; top: 20px; right: 20px; background: #333; color: white; padding: 10px; border-radius: 5px; z-index: 10000;
                background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            `;
            document.body.appendChild(notificationDiv);
            setTimeout(() => notificationDiv.remove(), 3000);
        }
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Instantiate the CaseStudiesManager and make it globally accessible
    // This assumes `caseStudies` (the array) might be initialized elsewhere
    // or you want to start with the dummy data from the class itself.
    window.caseStudiesManager = new CaseStudiesManager();
});