// Investigation Notes Manager - Professional Note-Taking for Security Investigators
class InvestigationNotes {
    constructor() {
        this.notes = [];
        this.selectedNotes = new Set();
        this.currentView = 'grid';
        this.currentSort = 'newest';
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.editingNoteId = null;
        this.currentDetailNote = null;
        
        // Instead of calling loadNotes/initializeNotes directly, 
        // we call an async init method.
        this.init();
    }

    async init() {
        await this.loadNotes(); // Wait for data from IndexedDB
        this.initializeNotes();
    }

    // Initialize the notes system
    initializeNotes() {
        this.renderNotes();
        this.updateEmptyState();
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Click outside to deselect
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.note-card') && !e.target.closest('.bulk-actions') && !e.target.closest('.modal-content')) { // Exclude modal content from deselecting
                this.clearSelection();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showAddNoteModal();
                        break;
                    case 'a':
                        if (document.getElementById('investigation-notes').classList.contains('active')) {
                            e.preventDefault();
                            this.selectAll();
                        }
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.closeNoteModal();
                this.closeNoteDetailModal();
            }
        });
    }

    // Show add note modal
    showAddNoteModal() {
        this.editingNoteId = null;
        document.getElementById('note-modal-title').textContent = 'Add Investigation Note';
        document.getElementById('note-form').reset();
        document.getElementById('note-modal').style.display = 'block';
        document.getElementById('note-title').focus();
    }

    // Show edit note modal
    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.editingNoteId = noteId;
        document.getElementById('note-modal-title').textContent = 'Edit Investigation Note';
        
        // Populate form
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-category').value = note.category;
        document.getElementById('note-priority').value = note.priority;
        document.getElementById('note-case-id').value = note.caseId || '';
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-tags').value = note.tags.join(', ');
        document.getElementById('note-attachments').value = note.attachments || '';
        
        document.getElementById('note-modal').style.display = 'block';
        document.getElementById('note-title').focus();
        this.closeNoteDetailModal(); // Close detail modal if open
    }

    // Close note modal
    closeNoteModal() {
        document.getElementById('note-modal').style.display = 'none';
        document.getElementById('note-form').reset();
        this.editingNoteId = null;
    }

    // Save note
    saveNote(event) {
        event.preventDefault();
        
        const title = document.getElementById('note-title').value.trim();
        const category = document.getElementById('note-category').value;
        const priority = document.getElementById('note-priority').value;
        const caseId = document.getElementById('note-case-id').value.trim();
        const content = document.getElementById('note-content').value.trim();
        const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const attachments = document.getElementById('note-attachments').value.trim();

        if (!title || !category || !content) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }

        const now = new Date().toISOString();
        
        if (this.editingNoteId) {
            // Update existing note
            const noteIndex = this.notes.findIndex(n => n.id === this.editingNoteId);
            if (noteIndex !== -1) {
                this.notes[noteIndex] = {
                    ...this.notes[noteIndex],
                    title,
                    category,
                    priority,
                    caseId,
                    content,
                    tags,
                    attachments,
                    updatedAt: now
                };
                this.showNotification('Note updated successfully!', 'success');
            }
        } else {
            // Create new note
            const note = {
                id: Date.now(),
                title,
                category,
                priority,
                caseId,
                content,
                tags,
                attachments,
                createdAt: now,
                updatedAt: now,
                pinned: false,
                starred: false
            };
            
            this.notes.unshift(note);
            this.showNotification('Note created successfully!', 'success');
        }

        this.saveNotes();
        this.renderNotes();
        this.updateEmptyState();
        this.closeNoteModal();
    }

    // Show note detail modal
    showNoteDetail(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentDetailNote = note;

        // Title
        document.getElementById('note-detail-title').textContent = note.title;

        // Case ID as subtitle
        const caseIdDisplay = document.getElementById('note-detail-case-id-display');
        if (note.caseId) {
            caseIdDisplay.textContent = `Case ID: ${note.caseId}`;
            caseIdDisplay.style.display = 'block'; // Show the element
        } else {
            caseIdDisplay.style.display = 'none'; // Hide if no case ID
        }

        // Category and Priority (apply the new styling class and ensure text capitalization)
        const categoryBadge = document.getElementById('note-detail-category');
        const priorityBadge = document.getElementById('note-detail-priority');

        // Add 'Category:' and 'Priority:' labels
        categoryBadge.innerHTML = `<strong>Category:</strong> ${note.category.replace('-', ' ')}`;
        categoryBadge.className = `note-detail-badge-text ${note.category}`; // Apply the new class
        
        priorityBadge.innerHTML = `<strong>Priority:</strong> ${note.priority}`;
        priorityBadge.className = `note-detail-badge-text ${note.priority}`; // Apply the new class

        // Content
        document.getElementById('note-detail-content-body').textContent = note.content;

        // Timestamps
        document.getElementById('note-detail-created').textContent = new Date(note.createdAt).toLocaleString();
        document.getElementById('note-detail-updated').textContent = new Date(note.updatedAt).toLocaleString();

        // Tags
        const tagsContainer = document.getElementById('note-detail-tags');
        const tagsSectionContainer = document.getElementById('note-detail-tags-container');
        if (note.tags.length > 0) {
            tagsContainer.innerHTML = note.tags.map(tag =>
                `<span class="note-tag">${tag}</span>`
            ).join('');
            tagsSectionContainer.style.display = 'block';
        } else {
            tagsContainer.innerHTML = ''; // Clear tags if none
            tagsSectionContainer.style.display = 'none'; // Hide the entire tags section
        }

        // Attachments
        const attachmentsSectionContainer = document.getElementById('note-detail-attachments-container');
        const attachmentsContent = document.getElementById('note-detail-attachments');
        if (note.attachments) {
            attachmentsContent.innerHTML = note.attachments;
            attachmentsSectionContainer.style.display = 'block';
        } else {
            attachmentsContent.innerHTML = ''; // Clear attachments if none
            attachmentsSectionContainer.style.display = 'none'; // Hide the entire attachments section
        }

        document.getElementById('note-detail-modal').style.display = 'block';
    }


    // Close note detail modal
    closeNoteDetailModal() {
        document.getElementById('note-detail-modal').style.display = 'none';
        this.currentDetailNote = null;
    }

    // Toggle note selection
    toggleNoteSelection(noteId, event) {
        event.stopPropagation();
        
        if (this.selectedNotes.has(noteId)) {
            this.selectedNotes.delete(noteId);
        } else {
            this.selectedNotes.add(noteId);
        }
        
        this.updateSelectionUI();
    }

    // Select all notes
    selectAll() {
        const visibleNotes = this.getFilteredNotes();
        visibleNotes.forEach(note => this.selectedNotes.add(note.id));
        this.updateSelectionUI();
    }

    // Clear selection
    clearSelection() {
        this.selectedNotes.clear();
        this.updateSelectionUI();
    }

    // Update selection UI
    updateSelectionUI() {
        const bulkActions = document.getElementById('bulk-actions');
        const selectedCount = document.getElementById('selected-count');
        
        if (this.selectedNotes.size > 0) {
            bulkActions.style.display = 'flex';
            selectedCount.textContent = `${this.selectedNotes.size} selected`;
        } else {
            bulkActions.style.display = 'none';
        }
        
        // Update note card selection state
        document.querySelectorAll('.note-card').forEach(card => {
            const noteId = parseInt(card.dataset.noteId);
            const checkbox = card.querySelector('.note-checkbox');
            
            if (this.selectedNotes.has(noteId)) {
                card.classList.add('selected');
                if (checkbox) checkbox.checked = true;
            } else {
                card.classList.remove('selected');
                if (checkbox) checkbox.checked = false;
            }
        });
    }

    // Toggle pin status
    togglePin(noteId, event) {
        event.stopPropagation();
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.pinned = !note.pinned;
            note.updatedAt = new Date().toISOString();
            this.saveNotes();
            this.renderNotes();
            this.showNotification(`Note ${note.pinned ? 'pinned' : 'unpinned'}!`, 'success');
        }
    }

    // Toggle star status
    toggleStar(noteId, event) {
        event.stopPropagation();
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            note.starred = !note.starred;
            note.updatedAt = new Date().toISOString();
            this.saveNotes();
            this.renderNotes();
            this.showNotification(`Note ${note.starred ? 'starred' : 'unstarred'}!`, 'success');
        }
    }

    // Delete note
    deleteNote(noteId, event) {
        event.stopPropagation();
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.selectedNotes.delete(noteId);
            this.saveNotes();
            this.renderNotes();
            this.updateEmptyState();
            this.updateSelectionUI();
            this.showNotification('Note deleted successfully!', 'success');
        }
    }

    // Bulk operations
    bulkPin() {
        this.selectedNotes.forEach(noteId => {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                note.pinned = true;
                note.updatedAt = new Date().toISOString();
            }
        });
        this.saveNotes();
        this.renderNotes();
        this.clearSelection();
        this.showNotification('Selected notes pinned!', 'success');
    }

    bulkUnpin() {
        this.selectedNotes.forEach(noteId => {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                note.pinned = false;
                note.updatedAt = new Date().toISOString();
            }
        });
        this.saveNotes();
        this.renderNotes();
        this.clearSelection();
        this.showNotification('Selected notes unpinned!', 'success');
    }

    bulkStar() {
        this.selectedNotes.forEach(noteId => {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                note.starred = true;
                note.updatedAt = new Date().toISOString();
            }
        });
        this.saveNotes();
        this.renderNotes();
        this.clearSelection();
        this.showNotification('Selected notes starred!', 'success');
    }

    bulkUnstar() {
        this.selectedNotes.forEach(noteId => {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                note.starred = false;
                note.updatedAt = new Date().toISOString();
            }
        });
        this.saveNotes();
        this.renderNotes();
        this.clearSelection();
        this.showNotification('Selected notes unstarred!', 'success');
    }

    bulkDelete() {
        if (confirm(`Are you sure you want to delete ${this.selectedNotes.size} selected notes?`)) {
            this.notes = this.notes.filter(n => !this.selectedNotes.has(n.id));
            this.selectedNotes.clear();
            this.saveNotes();
            this.renderNotes();
            this.updateEmptyState();
            this.updateSelectionUI();
            this.showNotification('Selected notes deleted!', 'success');
        }
    }

    // Search notes
    searchNotes() {
        this.searchTerm = document.getElementById('notes-search').value.toLowerCase();
        this.renderNotes();
    }

    // Filter notes
    filterNotes() {
        this.currentFilter = document.getElementById('notes-category-filter').value;
        this.renderNotes();
    }

    // Sort notes
    sortNotes() {
        this.currentSort = document.getElementById('notes-sort').value;
        this.renderNotes();
    }

    // Set view mode
    setView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        // Find the correct button based on data-view attribute
        const targetViewBtn = document.querySelector(`.view-btn[data-view="${view}"]`);
        if (targetViewBtn) {
            targetViewBtn.classList.add('active');
        }
        
        // Update container class
        const container = document.getElementById('notes-container');
        if (view === 'list') {
            container.classList.add('list-view');
        } else {
            container.classList.remove('list-view');
        }
        
        this.renderNotes();
    }

    // Get filtered and sorted notes
    getFilteredNotes() {
        let filteredNotes = [...this.notes];
        
        // Apply search filter
        if (this.searchTerm) {
            filteredNotes = filteredNotes.filter(note =>
                note.title.toLowerCase().includes(this.searchTerm) ||
                note.content.toLowerCase().includes(this.searchTerm) ||
                note.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)) ||
                (note.caseId && note.caseId.toLowerCase().includes(this.searchTerm))
            );
        }
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.category === this.currentFilter);
        }
        
        // Apply sorting
        filteredNotes.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'priority':
                    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0); // Handle undefined priorities
                case 'updated':
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                default:
                    return 0;
            }
        });
        
        // Sort pinned notes to top
        filteredNotes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
        });
        
        return filteredNotes;
    }

    // Render notes
    renderNotes() {
        const container = document.getElementById('notes-container');
        const filteredNotes = this.getFilteredNotes();
        
        if (filteredNotes.length === 0) {
            container.innerHTML = ''; // Clear existing notes
            this.updateEmptyState();
            return;
        }
        
        container.innerHTML = filteredNotes.map(note => this.createNoteCard(note)).join('');
        this.updateSelectionUI();
        this.updateEmptyState();
    }

    // Create note card HTML
    createNoteCard(note) {
        const isSelected = this.selectedNotes.has(note.id);
        const cardClasses = [
            'note-card',
            this.currentView === 'list' ? 'list-view' : '',
            note.pinned ? 'pinned' : '',
            note.starred ? 'starred' : '',
            isSelected ? 'selected' : ''
        ].filter(Boolean).join(' ');
        
        const truncatedContent = note.content.length > 150 
            ? note.content.substring(0, 150) + '...' 
            : note.content;
            
        const tagsHtml = note.tags.slice(0, 3).map(tag => 
            `<span class="note-tag">${tag}</span>`
        ).join('');
        
        const moreTagsCount = note.tags.length > 3 ? note.tags.length - 3 : 0;
        
        return `
            <div class="${cardClasses}" data-note-id="${note.id}" onclick="investigationNotes.showNoteDetail(${note.id})">
                <input type="checkbox" class="note-checkbox" ${isSelected ? 'checked' : ''} 
                       onclick="investigationNotes.toggleNoteSelection(${note.id}, event)">
                
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="note-actions">
                        <button class="note-action-btn pin ${note.pinned ? 'active' : ''}" 
                                onclick="investigationNotes.togglePin(${note.id}, event)" 
                                title="${note.pinned ? 'Unpin' : 'Pin'} note">
                            <i class="fas fa-thumbtack"></i>
                        </button>
                        <button class="note-action-btn star ${note.starred ? 'active' : ''}" 
                                onclick="investigationNotes.toggleStar(${note.id}, event)" 
                                title="${note.starred ? 'Unstar' : 'Star'} note">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="note-action-btn" 
                                onclick="investigationNotes.editNote(${note.id}); event.stopPropagation();" 
                                title="Edit note">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="note-action-btn" 
                                onclick="investigationNotes.deleteNote(${note.id}, event)" 
                                title="Delete note">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="note-meta">
                    <span class="category-badge ${note.category}">${note.category.replace('-', ' ').toUpperCase()}</span>
                    <span class="priority-badge ${note.priority}">${note.priority.toUpperCase()}</span>
                    ${note.caseId ? `<span class="note-tag">Case: ${note.caseId}</span>` : ''}
                </div>
                
                <div class="note-content">${truncatedContent}</div>
                
                <div class="note-footer">
                    <div class="note-tags">
                        ${tagsHtml}
                        ${moreTagsCount > 0 ? `<span class="note-tag">+${moreTagsCount} more</span>` : ''}
                    </div>
                    <div class="note-date">${this.formatDate(note.updatedAt)}</div>
                </div>
            </div>
        `;
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Update empty state
    updateEmptyState() {
        const container = document.getElementById('notes-container');
        const emptyState = document.getElementById('notes-empty-state');
        
        if (this.notes.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
        } else if (this.getFilteredNotes().length === 0) {
            container.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><h3>No notes found</h3><p>Try adjusting your search or filter criteria.</p></div>';
            emptyState.style.display = 'none';
        } else {
            container.style.display = 'grid'; // Ensure it's grid when there are notes
            emptyState.style.display = 'none';
        }
    }

    // Storage methods
    async loadNotes() {
        try {
            const stored = await localforage.getItem('investigation-notes');
            // localForage returns the object directly, no JSON.parse needed
            this.notes = stored || [];
        } catch (err) {
            console.error("Error loading notes from IndexedDB:", err);
            this.notes = [];
        }
    }

    async saveNotes() {
        try {
            // localForage handles the serialization automatically
            await localforage.setItem('investigation-notes', this.notes);
        } catch (err) {
            console.error("Error saving notes:", err);
            this.showNotification("Critical: Could not save notes to local database", "error");
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#007bff'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.investigationNotes = new InvestigationNotes();
});