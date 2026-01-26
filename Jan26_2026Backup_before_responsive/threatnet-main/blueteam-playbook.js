// blueteam-playbook.js - Blue Team Playbook Manager
class BlueTeamPlaybook {
    constructor() {
        this.playbookData = []; // Structure: [{chapter}, {chapter}, ...]
                                // chapter: {id, title, description, sections: [{section}, ...]}
                                // section: {id, title, description, entries: [{entry}, ...]}
                                // entry:   {id, title, content, tags, references}

        this.currentChapterId = null;
        this.currentSectionId = null;
        this.currentEntryId = null;

        // Flags for modals
        this.editingChapter = null;
        this.editingSection = null;
        this.editingEntry = null;

        // Flags for deletion confirmation modal
        this.itemToDelete = null; // Stores { id: ..., type: 'chapter'/'section'/'entry' }

        // Flags for edit modal unsaved changes
        this.activeEditModalType = null; // 'chapter', 'section', 'entry'
        this.originalFormValues = {}; // To store initial values for change detection

        // UI state: 'chapter-overview', 'section-entries', 'entry-detail'
        this.activeMainContentView = 'chapter-overview';

        this.loadPlaybookData(); // This now handles initial data loading
        this.initializeUI();
    }

    // --- Core Initialization ---
    initializeUI() {
        this.renderSidebar(); // Render left-hand TOC
        this.updateMainContentHeader(); // Update main header title and buttons
        this.showMainContentView(this.activeMainContentView); // Display initial view in main content
        this.updateEmptyState(); // Check and display empty messages
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Global Escape key listener to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleModalCloseAttempt(); // Use a new handler for robust close logic
            }
        });

        // Debounce sidebar search
        let searchTimeout;
        const sidebarSearchInput = document.getElementById('playbook-sidebar-search');
        if (sidebarSearchInput) {
            sidebarSearchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterSidebar();
                }, 300); // 300ms debounce
            });
        }
    }

    // --- Data Management (IndexDB) ---
    async loadPlaybookData() {
        try {
            const savedData = await localforage.getItem('blueteam-playbook-data');
            if (savedData) {
                this.playbookData = savedData;
            } else {
                const response = await fetch('blueteam-playbook-initial-data.json');
                this.playbookData = await response.json();
                await this.savePlaybookData();
            }
            this.renderSidebar();
            this.updateMainContentHeader();
        } catch (error) {
            console.error("Failed to load playbook data:", error);
        }
    }

    async savePlaybookData() {
        try {
            await localforage.setItem('blueteam-playbook-data', this.playbookData);
        } catch (err) {
            this.showNotification("Failed to save playbook changes locally", "error");
        }
    }

    // New method to load initial sample data
    async loadInitialSampleData() {
        const filePath = 'blueteam-playbook-initial-data.json'; // Ensure this path is correct
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Initial playbook data file not found at: ${filePath}`);
                    this.showNotification(`Initial playbook data file not found: ${filePath}`, 'warning');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return;
            }
            const data = await response.json();

            if (!Array.isArray(data)) {
                this.showNotification('Initial data JSON format invalid: Expected an array of chapters.', 'error');
                return;
            }

            console.log(`Successfully fetched initial playbook data from ${filePath}`);
            this.importDataIntoPlaybook(data); // Use the common import logic
            this.savePlaybookData(); // Save to localStorage immediately
            this.renderSidebar(); // Re-render everything
            this.updateEmptyState();
            if (this.playbookData.length > 0 && !this.currentChapterId) {
                this.selectChapter(this.playbookData[0].id); // Select first chapter after import
            }
            this.showNotification('Initial playbook data loaded!', 'success');

        } catch (error) {
            console.error('Failed to load initial sample data:', error);
            this.showNotification(`Error loading initial playbook data: ${error.message}`, 'error');
        }
    }

    // Refactor importPlaybookData to use this common logic
    importPlaybookData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) {
                this.showNotification('No file selected for import.', 'warning');
                return;
            }
            try {
                const text = await file.text();
                const importedData = JSON.parse(text);

                if (!Array.isArray(importedData)) {
                    this.showNotification('Invalid JSON format: Expected an array of chapters.', 'error');
                    return;
                }

                this.importDataIntoPlaybook(importedData); // Use the new common method
                this.savePlaybookData();
                this.renderSidebar();
                this.updateEmptyState();
                if (this.playbookData.length > 0 && !this.currentChapterId) {
                    this.selectChapter(this.playbookData[0].id);
                }
                this.showNotification(`Playbook data imported successfully!`, 'success');

            } catch (error) {
                console.error('Error importing playbook JSON:', error);
                this.showNotification(`Failed to import playbook: ${error.message}`, 'error');
            }
        };
        input.click();
    }

    // New helper method to integrate imported data
    importDataIntoPlaybook(importedChapters) {
        let importedCount = 0;
        let duplicateCount = 0;
        const now = Date.now();

        importedChapters.forEach(newChapterData => {
            if (!newChapterData.title) {
                console.warn('Skipping invalid chapter (missing title):', newChapterData);
                return;
            }

            // Simple duplicate check: chapter title
            const isDuplicate = this.playbookData.some(existingCh =>
                existingCh.title === newChapterData.title
            );

            if (isDuplicate) {
                duplicateCount++;
            } else {
                const newChapter = {
                    id: now + Math.random(), // Generate unique ID
                    title: newChapterData.title,
                    description: newChapterData.description || '',
                    createdAt: newChapterData.createdAt || now,
                    updatedAt: now,
                    sections: []
                };

                (newChapterData.sections || []).forEach(newSectionData => {
                    const newSection = {
                        id: now + Math.random() + Math.random(), // Unique ID
                        title: newSectionData.title,
                        description: newSectionData.description || '',
                        createdAt: newSectionData.createdAt || now,
                        updatedAt: now,
                        entries: []
                    };

                    (newSectionData.entries || []).forEach(newEntryData => {
                        const newEntry = {
                            id: now + Math.random() + Math.random() + Math.random(), // Unique ID
                            title: newEntryData.title,
                            content: newEntryData.content || '',
                            tags: Array.isArray(newEntryData.tags) ? newEntryData.tags : (newEntryData.tags ? String(newEntryData.tags).split(',').map(t => t.trim()) : []),
                            references: newEntryData.references || '',
                            createdAt: newEntryData.createdAt || now,
                            updatedAt: now
                        };
                        newSection.entries.push(newEntry);
                    });
                    newChapter.sections.push(newSection);
                });
                this.playbookData.push(newChapter);
                importedCount++;
            }
        });

        // This method doesn't save/render by itself, the caller will.
        console.log(`Import summary: ${importedCount} imported, ${duplicateCount} skipped.`);
    }

    // --- Sidebar (Table of Contents) Rendering ---

    renderSidebar() {
        const chapterListDiv = document.getElementById('playbook-chapter-list');
        if (!chapterListDiv) return;

        const searchTerm = document.getElementById('playbook-sidebar-search')?.value.toLowerCase() || '';

        if (this.playbookData.length === 0) {
            chapterListDiv.innerHTML = '<div class="empty-list-message">No playbook content. Add a chapter or import data.</div>';
            return;
        }

        let filteredChapters = this.playbookData.filter(chapter => {
            const chapterMatches = chapter.title.toLowerCase().includes(searchTerm) ||
                                   (chapter.description && chapter.description.toLowerCase().includes(searchTerm));
            if (chapterMatches && searchTerm) return true; // Show chapter if it matches directly

            // Check if any section or entry within the chapter matches
            const contentMatches = chapter.sections.some(section => {
                const sectionMatches = section.title.toLowerCase().includes(searchTerm) ||
                                       (section.description && section.description.toLowerCase().includes(searchTerm));
                if (sectionMatches && searchTerm) return true;

                return section.entries.some(entry =>
                    entry.title.toLowerCase().includes(searchTerm) ||
                    entry.content.toLowerCase().includes(searchTerm) ||
                    (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                );
            });
            return chapterMatches || contentMatches || !searchTerm; // Show if chapter itself matches, or any nested content matches, or if no search term
        });

        if (filteredChapters.length === 0 && searchTerm) {
            chapterListDiv.innerHTML = '<div class="empty-list-message">No matching content found in playbook.</div>';
            return;
        }


        chapterListDiv.innerHTML = filteredChapters.map(chapter => {
            const isChapterActive = chapter.id === this.currentChapterId;
            const isChapterExpanded = isChapterActive || searchTerm; // Expand active chapter or if searching

            let filteredSections = chapter.sections;
            if (searchTerm) {
                // If searching, only show sections/entries that match
                filteredSections = chapter.sections.filter(section => {
                    const sectionMatches = section.title.toLowerCase().includes(searchTerm) ||
                                           (section.description && section.description.toLowerCase().includes(searchTerm));
                    if (sectionMatches) return true;

                    return section.entries.some(entry =>
                        entry.title.toLowerCase().includes(searchTerm) ||
                        entry.content.toLowerCase().includes(searchTerm) ||
                        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                    );
                });
            }


            return `
                <div class="chapter-item-sidebar ${isChapterActive ? 'active' : ''} ${searchTerm ? 'filtered-match' : ''}"
                     onclick="blueTeamPlaybook.selectChapter(${chapter.id})"
                     data-id="${chapter.id}">
                    <div class="title"><i class="fas fa-book"></i> ${chapter.title}</div>
                    <div class="actions">
                        <button onclick="event.stopPropagation(); blueTeamPlaybook.editChapter(${chapter.id})" title="Edit Chapter"><i class="fas fa-edit"></i></button>
                        <button onclick="event.stopPropagation(); blueTeamPlaybook.deleteChapter(${chapter.id})" title="Delete Chapter"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="section-list-sidebar" id="chapter-${chapter.id}-sections">
                    ${isChapterExpanded ? this.renderSectionsInSidebar(filteredSections, searchTerm) : ''}
                </div>
            `;
        }).join('');

        this.updateEmptyState();
    }

    renderSectionsInSidebar(sections, searchTerm = '') {
        if (!sections || sections.length === 0) return '';
        return sections.map(section => {
            const isSectionActive = section.id === this.currentSectionId;
            const isSectionExpanded = isSectionActive || searchTerm;

            let filteredEntries = section.entries;
            if (searchTerm) {
                filteredEntries = section.entries.filter(entry =>
                    entry.title.toLowerCase().includes(searchTerm) ||
                    entry.content.toLowerCase().includes(searchTerm) ||
                    (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                );
            }

            return `
                <div class="section-item-sidebar ${isSectionActive ? 'active' : ''} ${searchTerm ? 'filtered-match' : ''}"
                     onclick="event.stopPropagation(); blueTeamPlaybook.selectSection(${section.id})"
                     data-id="${section.id}">
                    <div class="title"><i class="fas fa-folder-open"></i> ${section.title}</div>
                    <div class="actions">
                        <button onclick="event.stopPropagation(); blueTeamPlaybook.editSection(${section.id})" title="Edit Section"><i class="fas fa-edit"></i></button>
                        <button onclick="event.stopPropagation(); blueTeamPlaybook.deleteSection(${section.id})" title="Delete Section"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="entry-list-sidebar" id="section-${section.id}-entries">
                    ${isSectionExpanded ? this.renderEntriesInSidebar(filteredEntries, searchTerm) : ''}
                </div>
            `;
        }).join('');
    }

    renderEntriesInSidebar(entries, searchTerm = '') {
        if (!entries || entries.length === 0) return '';
        return entries.map(entry => `
            <div class="entry-item-sidebar ${entry.id === this.currentEntryId ? 'active' : ''} ${searchTerm ? 'filtered-match' : ''}"
                 onclick="event.stopPropagation(); blueTeamPlaybook.selectEntry(${entry.id})"
                 data-id="${entry.id}">
                <div class="title"><i class="fas fa-file-alt"></i> ${entry.title}</div>
                <div class="actions">
                    <button onclick="event.stopPropagation(); blueTeamPlaybook.editEntry(${entry.id})" title="Edit Entry"><i class="fas fa-edit"></i></button>
                    <button onclick="event.stopPropagation(); blueTeamPlaybook.deleteEntry(${entry.id})" title="Delete Entry"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    filterSidebar() {
        this.renderSidebar(); // Re-renders the sidebar with filtered/expanded content
    }

    // --- Main Content Area Rendering ---

    // Updates the main header title and button visibility
    updateMainContentHeader() {
        const currentTitleElem = document.getElementById('playbook-current-title');
        const addSectionBtn = document.getElementById('playbook-add-section-btn');
        const addEntryBtn = document.getElementById('playbook-add-entry-btn');
        const editItemBtn = document.getElementById('playbook-edit-selected-item-btn');
        const deleteItemBtn = document.getElementById('playbook-delete-selected-item-btn');

        // Reset button visibility
        [addSectionBtn, addEntryBtn, editItemBtn, deleteItemBtn].forEach(btn => {
            if (btn) btn.style.display = 'none';
        });

        let titleText = "Select a Chapter or Entry";
        let editDeleteTarget = null; // To determine what item is being edited/deleted

        if (this.currentEntryId) {
            const entry = this.getEntryById(this.currentEntryId);
            if (entry) {
                titleText = entry.title;
                editDeleteTarget = 'entry';
                // Add new entry button is shown when section is selected, not specific entry
                // addEntryBtn.style.display = 'inline-flex'; // Can add new entry to current section
            }
        } else if (this.currentSectionId) {
            const section = this.getSectionById(this.currentSectionId);
            if (section) {
                titleText = section.title;
                editDeleteTarget = 'section';
                addEntryBtn.style.display = 'inline-flex'; // Add entry to this section
                addSectionBtn.style.display = 'inline-flex'; // Add new section to current chapter
            }
        } else if (this.currentChapterId) {
            const chapter = this.getChapterById(this.currentChapterId);
            if (chapter) {
                titleText = chapter.title;
                editDeleteTarget = 'chapter';
                addSectionBtn.style.display = 'inline-flex'; // Add section to this chapter
            }
        }

        currentTitleElem.textContent = titleText;

        // Show edit/delete buttons based on selected item
        if (editDeleteTarget) {
            editItemBtn.style.display = 'inline-flex';
            deleteItemBtn.style.display = 'inline-flex';
        }
    }

    // Displays the correct view in the main content area
    showMainContentView(viewName) {
        // Hide all views
        document.getElementById('playbook-chapter-overview-view').style.display = 'none';
        document.getElementById('playbook-section-entries-view').style.display = 'none';
        document.getElementById('playbook-entry-detail-view').style.display = 'none';

        // Show the requested view
        const targetView = document.getElementById(`playbook-${viewName}-view`);
        if (targetView) {
            targetView.style.display = 'flex'; // Use flex for layout inside
            this.activeMainContentView = viewName;
        }

        // Render content specific to the view
        if (viewName === 'chapter-overview') {
            this.renderChapterOverview();
        } else if (viewName === 'section-entries') {
            this.renderSectionEntriesList();
        } else if (viewName === 'entry-detail') {
            this.renderEntryDetail();
        }

        this.updateMainContentHeader(); // Re-evaluate header buttons
        this.updateEmptyState(); // Re-evaluate empty messages
    }

    // Renders the overview for the selected chapter
    renderChapterOverview() {
        const chapterOverviewDiv = document.getElementById('playbook-chapter-overview-view');
        const chapterOverviewTitle = document.getElementById('chapter-overview-title');
        const chapterOverviewDesc = document.getElementById('chapter-overview-description');
        const chapterOverviewSectionsList = document.getElementById('chapter-overview-sections-list');

        const chapter = this.getChapterById(this.currentChapterId);

        if (!chapterOverviewDiv || !chapter) {
            // This case should be handled by updateEmptyState and the empty-message-main
            chapterOverviewTitle.textContent = '';
            chapterOverviewDesc.textContent = '';
            chapterOverviewSectionsList.innerHTML = '';
            return;
        }

        chapterOverviewTitle.textContent = chapter.title;
        chapterOverviewDesc.textContent = chapter.description || 'No description provided for this chapter.';

        if (chapter.sections.length === 0) {
            chapterOverviewSectionsList.innerHTML = '<div class="empty-message-main">No sections in this chapter. Click \'<i class="fas fa-plus"></i> Section\' above to create one.</div>';
        } else {
            chapterOverviewSectionsList.innerHTML = chapter.sections.map(section => `
                <div class="chapter-overview-section-item" onclick="blueTeamPlaybook.selectSection(${section.id})">
                    <h5 class="section-title"><i class="fas fa-folder-open"></i> ${section.title}</h5>
                    <p class="section-description">${section.description || 'No description.'}</p>
                    <div class="section-entries-overview">
                        ${section.entries.map(entry => `
                            <div class="chapter-overview-entry-item" onclick="event.stopPropagation(); blueTeamPlaybook.selectEntry(${entry.id})">
                                <i class="fas fa-file-alt"></i> ${entry.title}
                            </div>
                        `).join('')}
                        ${section.entries.length === 0 ? '<div class="chapter-overview-entry-item empty">No entries in this section.</div>' : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    // Renders the list of entries for the selected section
    renderSectionEntriesList() {
        const sectionEntriesListTitle = document.getElementById('section-entries-list-title');
        const sectionEntriesListDiv = document.getElementById('section-entries-list');

        const section = this.getSectionById(this.currentSectionId);

        if (!sectionEntriesListDiv || !section) {
            // This case should be handled by updateEmptyState and the empty-message-main
            sectionEntriesListTitle.textContent = '';
            sectionEntriesListDiv.innerHTML = '';
            return;
        }

        sectionEntriesListTitle.textContent = section.title;

        if (section.entries.length === 0) {
            sectionEntriesListDiv.innerHTML = '<div class="empty-message-main">No entries in this section. Click \'<i class="fas fa-plus"></i> Entry\' above to create one.</div>';
        } else {
            sectionEntriesListDiv.innerHTML = section.entries.map(entry => `
                <div class="section-entry-item" onclick="blueTeamPlaybook.selectEntry(${entry.id})">
                    <div class="title">${entry.title}</div>
                    <div class="date">${this.formatDate(entry.updatedAt)}</div>
                </div>
            `).join('');
        }
    }

    // Renders the full content of the selected entry
    renderEntryDetail() {
        const entryDetailContentDiv = document.getElementById('entry-detail-content');
        const entry = this.getEntryById(this.currentEntryId);

        if (!entryDetailContentDiv || !entry) {
            // This case should be handled by updateEmptyState and the empty-message-main
            entryDetailContentDiv.innerHTML = '';
            return;
        }

        entryDetailContentDiv.innerHTML = `
            <h3>${entry.title}</h3>
            ${entry.content}
            ${entry.tags && entry.tags.length > 0 ? `
                <div style="margin-top:20px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.08); font-size:0.9em; color:rgba(255,255,255,0.7);">
                    <strong>Tags:</strong> ${entry.tags.map(tag => `<span style="background:rgba(0,123,255,0.1); color:#007bff; padding:3px 8px; border-radius:4px; margin-right:5px; display:inline-block;">${tag}</span>`).join('')}
                </div>
            ` : ''}
            ${entry.references ? `
                <div style="margin-top:10px; font-size:0.9em; color:rgba(255,255,255,0.7);">
                    <strong>References:</strong> <span style="word-break:break-all;">${this.formatReferences(entry.references)}</span>
                </div>
            ` : ''}
        `;
    }

    formatReferences(refsString) {
        // Splits by newline or comma, then formats as clickable links
        if (!refsString) return '';
        return refsString.split(/[\n,]/).map(ref => ref.trim()).filter(Boolean).map(ref => {
            // Basic URL validation, could be more robust
            if (ref.startsWith('http://') || ref.startsWith('https://')) {
                return `<a href="${ref}" target="_blank" rel="noopener noreferrer">${ref}</a>`;
            }
            return ref;
        }).join('<br>');
    }

    // --- Empty State Management ---
    updateEmptyState() {
        const sidebarEmptyMessage = document.querySelector('#playbook-chapter-list .empty-list-message');
        if (sidebarEmptyMessage) {
            sidebarEmptyMessage.style.display = this.playbookData.length === 0 ? 'block' : 'none';
        }

        // Hide all main content empty messages first
        document.querySelectorAll('.empty-message-main').forEach(el => el.style.display = 'none');

        // Then show the relevant one based on active view and data availability
        if (this.activeMainContentView === 'chapter-overview') {
            const overviewEmpty = document.getElementById('chapter-overview-empty-message');
            // If no chapter is selected OR the selected chapter has no sections
            if (!this.currentChapterId || (this.getChapterById(this.currentChapterId) && this.getChapterById(this.currentChapterId).sections.length === 0)) {
                if (overviewEmpty) overviewEmpty.style.display = 'flex';
            }
        } else if (this.activeMainContentView === 'section-entries') {
            const entriesEmpty = document.getElementById('section-entries-empty-message');
            // If no section is selected OR the selected section has no entries
            if (!this.currentSectionId || (this.getSectionById(this.currentSectionId) && this.getSectionById(this.currentSectionId).entries.length === 0)) {
                if (entriesEmpty) entriesEmpty.style.display = 'flex';
            }
        } else if (this.activeMainContentView === 'entry-detail') {
            const detailEmpty = document.getElementById('entry-detail-empty-message');
            // If no entry is selected
            if (!this.currentEntryId) {
                if (detailEmpty) detailEmpty.style.display = 'flex';
            }
        }
    }

    // --- Item Selection Logic ---

    selectChapter(chapterId) {
        // If the same chapter is clicked, toggle collapse/expand
        // Only toggle if not currently searching
        const sidebarSearchInput = document.getElementById('playbook-sidebar-search');
        if (this.currentChapterId === chapterId && !sidebarSearchInput.value) {
            this.currentChapterId = null; // Deselect and collapse
            this.currentSectionId = null;
            this.currentEntryId = null;
            this.showMainContentView('chapter-overview'); // Show empty overview
        } else {
            this.currentChapterId = chapterId;
            this.currentSectionId = null; // Deselect section
            this.currentEntryId = null; // Deselect entry
            this.showMainContentView('chapter-overview'); // Show chapter overview
        }
        this.renderSidebar(); // Re-render sidebar to update active/expanded state
    }

    selectSection(sectionId) {
        // If the same section is clicked, toggle collapse/expand
        // Only toggle if not currently searching
        const sidebarSearchInput = document.getElementById('playbook-sidebar-search');
        if (this.currentSectionId === sectionId && !sidebarSearchInput.value) {
            this.currentSectionId = null; // Deselect and collapse
            this.currentEntryId = null;
            this.showMainContentView('chapter-overview'); // Go back to chapter overview
        } else {
            this.currentSectionId = sectionId;
            this.currentEntryId = null; // Deselect entry
            this.showMainContentView('section-entries'); // Show list of entries for this section
        }
        this.renderSidebar(); // Re-render sidebar to update active/expanded state
    }

    selectEntry(entryId) {
        this.currentEntryId = entryId;
        this.showMainContentView('entry-detail'); // Show full content of the entry
        this.renderSidebar(); // Re-render sidebar to update active state
    }

    // --- Helper Getters ---
    getChapterById(id) {
        return this.playbookData.find(chapter => chapter.id === id);
    }
    getSectionById(id) {
        for (const chapter of this.playbookData) {
            const section = chapter.sections.find(sec => sec.id === id);
            if (section) return section;
        }
        return null;
    }
    getEntryById(id) {
        for (const chapter of this.playbookData) {
            for (const section of chapter.sections) {
                const entry = section.entries.find(e => e.id === id);
                if (entry) return entry;
            }
        }
        return null;
    }
    getParentOf(id, type) { // type: 'section' or 'entry'
        if (type === 'section') {
            return this.playbookData.find(chapter => chapter.sections.some(s => s.id === id));
        } else if (type === 'entry') {
            for (const chapter of this.playbookData) {
                const section = chapter.sections.find(s => s.entries.some(e => e.id === id));
                if (section) return section;
            }
        }
        return null;
    }


    // --- CRUD Modals & Logic ---

    // Chapter Modals
    showAddChapterModal() {
        this.editingChapter = null;
        this.activeEditModalType = 'chapter'; // Set active modal type
        document.getElementById('chapter-modal-title').textContent = 'Create New Chapter';
        document.getElementById('chapter-form').reset();
        // Clear originalFormValues for new entries so no "unsaved changes" prompt
        this.originalFormValues = {};
        document.getElementById('playbook-chapter-modal').style.display = 'flex';
        // Capture initial state *after* reset for comparison on close
        this.captureOriginalFormValues('chapter-form', ['chapter-name', 'chapter-description']);
    }
    closeChapterModal() {
        // Only ask about unsaved changes if editing an existing item OR if creating a new item with changes
        const isNewChapter = this.editingChapter === null;
        const hasChanges = this.hasFormChanges('chapter-form', ['chapter-name', 'chapter-description'], this.originalFormValues);

        if (!isNewChapter || hasChanges) {
            if (!confirm('You have unsaved changes. Discard changes?')) {
                return; // User cancelled discard
            }
        }
        document.getElementById('playbook-chapter-modal').style.display = 'none';
        this.activeEditModalType = null; // Clear active modal type
        this.originalFormValues = {}; // Reset original values
    }
    saveChapter(event) {
        event.preventDefault();
        const title = document.getElementById('chapter-name').value.trim();
        const description = document.getElementById('chapter-description').value.trim();
        const now = Date.now();

        if (!title) {
            this.showNotification('Chapter title is required.', 'warning');
            return;
        }

        if (this.editingChapter) {
            this.editingChapter.title = title;
            this.editingChapter.description = description;
            this.editingChapter.updatedAt = now;
            this.showNotification('Chapter updated successfully!', 'success');
        } else {
            const newChapter = { id: now, title, description, createdAt: now, updatedAt: now, sections: [] };
            this.playbookData.push(newChapter);
            this.currentChapterId = newChapter.id; // Auto-select new chapter
            this.showNotification('Chapter created successfully!', 'success');
        }
        this.savePlaybookData();
        this.renderSidebar();
        // Crucial: Reset originalFormValues and activeEditModalType after a successful save
        this.originalFormValues = {};
        this.activeEditModalType = null;
        this.closeChapterModal();
        this.updateMainContentHeader();
        this.showMainContentView('chapter-overview'); // Always show overview of the (newly selected) chapter
    }
    editChapter(chapterId) {
        const chapter = this.getChapterById(chapterId);
        if (!chapter) return;
        this.editingChapter = chapter;
        this.activeEditModalType = 'chapter'; // Set active modal type
        document.getElementById('chapter-modal-title').textContent = 'Edit Chapter';
        document.getElementById('chapter-name').value = chapter.title;
        document.getElementById('chapter-description').value = chapter.description;
        document.getElementById('playbook-chapter-modal').style.display = 'flex';
        this.captureOriginalFormValues('chapter-form', ['chapter-name', 'chapter-description']);
    }
    deleteChapter(chapterId) {
        this.itemToDelete = { id: chapterId, type: 'chapter' };
        this.showDeleteConfirmModal(`Are you sure you want to delete this chapter and all its sections and entries? This cannot be undone.`);
    }


    // Section Modals
    showAddSectionModal() {
        if (!this.currentChapterId) { this.showNotification('Select a chapter first.', 'warning'); return; }
        this.editingSection = null;
        this.activeEditModalType = 'section'; // Set active modal type
        document.getElementById('section-modal-title').textContent = 'Create New Section';
        document.getElementById('section-form').reset();
        // Clear originalFormValues for new entries
        this.originalFormValues = {};
        document.getElementById('playbook-section-modal').style.display = 'flex';
        // Capture initial state *after* reset for comparison on close
        this.captureOriginalFormValues('section-form', ['section-name', 'section-description']);
    }
    closeSectionModal() {
        // Only ask if editing an existing item OR if creating a new item with changes
        const isNewSection = this.editingSection === null;
        const hasChanges = this.hasFormChanges('section-form', ['section-name', 'section-description'], this.originalFormValues);

        if (!isNewSection || hasChanges) {
            if (!confirm('You have unsaved changes. Discard changes?')) {
                return;
            }
        }
        document.getElementById('playbook-section-modal').style.display = 'none';
        this.activeEditModalType = null;
        this.originalFormValues = {};
    }
    saveSection(event) {
        event.preventDefault();
        const title = document.getElementById('section-name').value.trim();
        const description = document.getElementById('section-description').value.trim();
        const now = Date.now();

        if (!title) {
            this.showNotification('Section title is required.', 'warning');
            return;
        }

        const chapter = this.getChapterById(this.currentChapterId);
        if (!chapter) { this.showNotification('Error: Chapter not found.', 'error'); return; }

        if (this.editingSection) {
            this.editingSection.title = title;
            this.editingSection.description = description;
            this.editingSection.updatedAt = now;
            this.showNotification('Section updated successfully!', 'success');
        } else {
            const newSection = { id: now, title, description, createdAt: now, updatedAt: now, entries: [] };
            chapter.sections.push(newSection);
            this.currentSectionId = newSection.id; // Auto-select new section
            this.showNotification('Section created successfully!', 'success');
        }
        this.savePlaybookData();
        this.renderSidebar();
        // Crucial: Reset originalFormValues and activeEditModalType after a successful save
        this.originalFormValues = {};
        this.activeEditModalType = null;
        this.closeSectionModal();
        this.updateMainContentHeader();
        this.showMainContentView('section-entries'); // Show entries of the (newly selected) section
    }
    editSection(sectionId) {
        const section = this.getSectionById(sectionId);
        if (!section) return;
        this.editingSection = section;
        this.activeEditModalType = 'section'; // Set active modal type
        document.getElementById('section-modal-title').textContent = 'Edit Section';
        document.getElementById('section-name').value = section.title;
        document.getElementById('section-description').value = section.description;
        document.getElementById('playbook-section-modal').style.display = 'flex';
        this.captureOriginalFormValues('section-form', ['section-name', 'section-description']);
    }
    deleteSection(sectionId) {
        this.itemToDelete = { id: sectionId, type: 'section' };
        this.showDeleteConfirmModal(`Are you sure you want to delete this section and all its entries? This cannot be undone.`);
    }


    // Entry Modals
    showAddEntryModal() {
        if (!this.currentSectionId) { this.showNotification('Select a section first.', 'warning'); return; }
        this.editingEntry = null;
        this.activeEditModalType = 'entry'; // Set active modal type
        document.getElementById('entry-modal-title').textContent = 'Create New Entry';
        document.getElementById('entry-form').reset();
        // Clear originalFormValues for new entries
        this.originalFormValues = {};
        document.getElementById('playbook-entry-modal').style.display = 'flex';
        // Capture initial state *after* reset for comparison on close
        this.captureOriginalFormValues('entry-form', ['entry-title', 'entry-content', 'entry-tags', 'entry-references']);
    }
    closeEntryModal() {
        // Only ask if editing an existing item OR if creating a new item with changes
        const isNewEntry = this.editingEntry === null;
        const hasChanges = this.hasFormChanges('entry-form', ['entry-title', 'entry-content', 'entry-tags', 'entry-references'], this.originalFormValues);

        if (!isNewEntry || hasChanges) {
            if (!confirm('You have unsaved changes. Discard changes?')) {
                return;
            }
        }
        document.getElementById('playbook-entry-modal').style.display = 'none';
        this.activeEditModalType = null;
        this.originalFormValues = {};
    }
    saveEntry(event) {
        event.preventDefault();
        const title = document.getElementById('entry-title').value.trim();
        const content = document.getElementById('entry-content').value;
        const tags = document.getElementById('entry-tags').value.split(',').map(tag => tag.trim()).filter(Boolean);
        const references = document.getElementById('entry-references').value.trim();
        const now = Date.now();

        if (!title || !content) {
            this.showNotification('Entry title and content are required.', 'warning');
            return;
        }

        const section = this.getSectionById(this.currentSectionId);
        if (!section) { this.showNotification('Error: Section not found.', 'error'); return; }

        if (this.editingEntry) {
            this.editingEntry.title = title;
            this.editingEntry.content = content;
            this.editingEntry.tags = tags;
            this.editingEntry.references = references;
            this.editingEntry.updatedAt = now;
            this.showNotification('Entry updated successfully!', 'success');
        } else {
            const newEntry = { id: now, title, content, tags, references, createdAt: now, updatedAt: now };
            section.entries.push(newEntry);
            this.currentEntryId = newEntry.id; // Auto-select new entry
            this.showNotification('Entry created successfully!', 'success');
        }
        this.savePlaybookData();
        this.renderSidebar();
        // Crucial: Reset originalFormValues and activeEditModalType after a successful save
        this.originalFormValues = {};
        this.activeEditModalType = null;
        this.closeEntryModal();
        this.updateMainContentHeader();
        this.showMainContentView('entry-detail'); // Show detail of the (newly selected) entry
    }
    editEntry(entryId) {
        const entry = this.getEntryById(entryId);
        if (!entry) return;
        this.editingEntry = entry;
        this.activeEditModalType = 'entry'; // Set active modal type
        document.getElementById('entry-modal-title').textContent = 'Edit Entry';
        document.getElementById('entry-title').value = entry.title;
        document.getElementById('entry-content').value = entry.content;
        document.getElementById('entry-tags').value = entry.tags.join(', ');
        document.getElementById('entry-references').value = entry.references;
        document.getElementById('playbook-entry-modal').style.display = 'flex';
        this.captureOriginalFormValues('entry-form', ['entry-title', 'entry-content', 'entry-tags', 'entry-references']);
    }
    deleteEntry(entryId) {
        this.itemToDelete = { id: entryId, type: 'entry' };
        this.showDeleteConfirmModal(`Are you sure you want to delete this entry? This cannot be undone.`);
    }

    // --- Contextual Edit/Delete for Main Content Buttons ---
    editSelectedItem() {
        if (this.currentEntryId) {
            this.editEntry(this.currentEntryId);
        } else if (this.currentSectionId) {
            this.editSection(this.currentSectionId);
        } else if (this.currentChapterId) {
            this.editChapter(this.currentChapterId);
        } else {
            this.showNotification('No item selected to edit.', 'warning');
        }
    }

    deleteSelectedItem() {
        if (this.currentEntryId) {
            this.deleteEntry(this.currentEntryId);
        } else if (this.currentSectionId) {
            this.deleteSection(this.currentSectionId);
        } else if (this.currentChapterId) {
            this.deleteChapter(this.currentChapterId);
        } else {
            this.showNotification('No item selected to delete.', 'warning');
        }
    }

    // --- Custom Delete Confirmation Modal Logic ---
    showDeleteConfirmModal(message) {
        document.getElementById('playbook-delete-confirm-message').textContent = message;
        document.getElementById('playbook-delete-confirm-modal').style.display = 'flex';
    }

    closeDeleteConfirmModal() {
        document.getElementById('playbook-delete-confirm-modal').style.display = 'none';
        this.itemToDelete = null; // Clear pending deletion
    }

    performDeletion() {
        if (!this.itemToDelete) {
            this.showNotification('No item selected for deletion.', 'error');
            this.closeDeleteConfirmModal();
            return;
        }

        const { id, type } = this.itemToDelete;

        switch (type) {
            case 'chapter':
                this.playbookData = this.playbookData.filter(ch => ch.id !== id);
                if (this.currentChapterId === id) {
                    this.currentChapterId = null;
                    this.currentSectionId = null;
                    this.currentEntryId = null;
                    this.showMainContentView('chapter-overview');
                }
                this.showNotification('Chapter deleted successfully!', 'success');
                break;
            case 'section':
                const parentChapterForSection = this.getParentOf(id, 'section');
                if (parentChapterForSection) {
                    parentChapterForSection.sections = parentChapterForSection.sections.filter(sec => sec.id !== id);
                    if (this.currentSectionId === id) {
                        this.currentSectionId = null;
                        this.currentEntryId = null;
                        this.showMainContentView('chapter-overview'); // Go back to chapter overview after deleting section
                    }
                    this.showNotification('Section deleted successfully!', 'success');
                }
                break;
            case 'entry':
                const parentSectionForEntry = this.getParentOf(id, 'entry');
                if (parentSectionForEntry) {
                    parentSectionForEntry.entries = parentSectionForEntry.entries.filter(e => e.id !== id);
                    if (this.currentEntryId === id) {
                        this.currentEntryId = null;
                        this.showMainContentView('section-entries'); // Go back to section entries list after deleting entry
                    }
                    this.showNotification('Entry deleted successfully!', 'success');
                }
                break;
        }

        this.savePlaybookData();
        this.renderSidebar(); // Re-render sidebar after any deletion
        this.closeDeleteConfirmModal(); // Close modal after deletion
        this.updateMainContentHeader(); // Update buttons and title
        this.updateEmptyState(); // Check empty states
    }

    // --- Unsaved Changes Logic ---

    // Captures current form values to compare against later
    captureOriginalFormValues(formId, fieldNames) {
        const form = document.getElementById(formId);
        if (!form) return;
        this.originalFormValues = {};
        fieldNames.forEach(name => {
            const element = form.elements[name];
            if (element) {
                // Special handling for tags: ensure it's always compared as a sorted string for consistency
                if (name === 'entry-tags') {
                    this.originalFormValues[name] = element.value.split(',').map(t => t.trim()).filter(Boolean).sort().join(',');
                } else if (element.tagName === 'TEXTAREA') { // Also trim textarea values
                    this.originalFormValues[name] = element.value.trim();
                }
                else {
                    this.originalFormValues[name] = element.value;
                }
            }
        });
    }

    // Checks if the form has unsaved changes
    hasFormChanges(formId, fieldNames, originalValues) {
        const form = document.getElementById(formId);
        if (!form || !originalValues) return false;

        let changed = false;
        fieldNames.forEach(name => {
            const element = form.elements[name];
            if (element) {
                if (name === 'entry-tags') {
                    const currentTags = element.value.split(',').map(t => t.trim()).filter(Boolean).sort().join(',');
                    const originalTagString = originalValues[name]; // Already a sorted string
                    if (currentTags !== originalTagString) {
                        changed = true;
                    }
                } else if (element.tagName === 'TEXTAREA') { // Trim textarea values for comparison
                    if (element.value.trim() !== originalValues[name]) {
                        changed = true;
                    }
                }
                else {
                    if (element.value !== originalValues[name]) {
                        changed = true;
                    }
                }
            }
        });
        return changed;
    }

    // Handles attempts to close any modal (including 'x' button or Escape key)
    handleModalCloseAttempt() {
        let modalToCloseId = null;
        let formId = null;
        let fieldNames = [];
        let isEditing = false; // Flag to determine if it's an existing entry being edited

        // Determine which modal is currently open and if it's an edit operation
        if (document.getElementById('playbook-chapter-modal').style.display === 'flex') {
            modalToCloseId = 'playbook-chapter-modal';
            formId = 'chapter-form';
            fieldNames = ['chapter-name', 'chapter-description'];
            isEditing = this.editingChapter !== null;
        } else if (document.getElementById('playbook-section-modal').style.display === 'flex') {
            modalToCloseId = 'playbook-section-modal';
            formId = 'section-form';
            fieldNames = ['section-name', 'section-description'];
            isEditing = this.editingSection !== null;
        } else if (document.getElementById('playbook-entry-modal').style.display === 'flex') {
            modalToCloseId = 'playbook-entry-modal';
            formId = 'entry-form';
            fieldNames = ['entry-title', 'entry-content', 'entry-tags', 'entry-references'];
            isEditing = this.editingEntry !== null;
        } else if (document.getElementById('playbook-delete-confirm-modal').style.display === 'flex') {
             // If delete confirm modal is open, simply close it without asking for changes
             this.closeDeleteConfirmModal();
             return; // Exit function early
        }

        // Only ask about unsaved changes if:
        // A. It's an *existing* item being edited (isEditing is true) AND there are changes.
        // B. It's a *new* item (isEditing is false) AND there are changes from the initial (empty) state.
        if (modalToCloseId && this.hasFormChanges(formId, fieldNames, this.originalFormValues)) {
            if (!confirm('You have unsaved changes. Discard changes?')) {
                return; // User chose NOT to discard, so keep modal open
            }
        }
        
        // If no changes, or user confirmed discard, proceed to close
        if (modalToCloseId === 'playbook-chapter-modal') {
            document.getElementById('playbook-chapter-modal').style.display = 'none';
            this.editingChapter = null;
        } else if (modalToCloseId === 'playbook-section-modal') {
            document.getElementById('playbook-section-modal').style.display = 'none';
            this.editingSection = null;
        } else if (modalToCloseId === 'playbook-entry-modal') {
            document.getElementById('playbook-entry-modal').style.display = 'none';
            this.editingEntry = null;
        }
        this.activeEditModalType = null;
        this.originalFormValues = {};
    }


    // --- Export ---
    exportPlaybookData() {
        if (this.playbookData.length === 0) {
            this.showNotification('No playbook data to export.', 'warning');
            return;
        }
        const dataStr = JSON.stringify(this.playbookData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threatnet_blueteam_playbook_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Playbook data exported successfully!', 'success');
    }

    // Add this method to the BlueTeamPlaybook class
    savePlaybookData() {
        localStorage.setItem('blueteam-playbook-data', JSON.stringify(this.playbookData));
    }


    // --- Utility Function (copied from script.js) ---
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Show a global notification (reusing function from script.js)
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`Notification (${type}): ${message}`);
            // Fallback notification for standalone testing
            const notification = document.createElement('div');
            notification.className = `temp-notification temp-notification-${type}`;
            notification.textContent = message;
            Object.assign(notification.style, {
                position: 'fixed', top: '20px', right: '20px',
                background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff',
                color: 'white', padding: '10px 15px', borderRadius: '5px', zIndex: '10000'
            });
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.blueTeamPlaybook = new BlueTeamPlaybook();
});