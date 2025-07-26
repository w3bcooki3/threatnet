// tracelink.js - TraceLink Graph Visualization for Multi-Vault Data
class TraceLinkManager {
    constructor() {
        this.cy = null; // Cytoscape instance
        this.currentVaultId = null; // ID of the currently selected Multi-Vault (which corresponds to a TraceLink project)
        this.tracelinkProjects = this.loadTraceLinkProjects(); // { vaultId: { elements: [], layout: {} } }

        // DOM elements will be set in the init() method when the HTML content is loaded
        this.tracelinkTabsContainer = null;
        this.cyContainer = null;
        this.emptyState = null;
        this.canvasContainer = null;
        this.addNodeModal = null;
        this.addNodeForm = null;
        this.editLabelModal = null;
        this.editLabelForm = null;
        this.contextMenu = null;
        this.contextTarget = null; // Stores the element (node, edge, or canvas) that was right-clicked
        this.importModal = null; // New import modal
        this.tracelinkConfirmDeleteModal = null; // New TraceLink specific delete modal
        this.tracelinkConfirmDeleteCallback = null; // Callback for delete confirmation

        // Internal state for connection mode
        this._isConnecting = false;
        this._sourceNodeForConnection = null;
        this._saveStateTimeout = null; // For debouncing graph state saves

        // Dynamic Field Definitions for manual node addition
        this.entityTypeDefinitions = {
            'person': {
                icon: 'fas fa-person',
                fields: [
                    { id: 'full_name', label: 'Full Name', type: 'text', required: true },
                    { id: 'dob', label: 'Date of Birth', type: 'date' },
                    { id: 'nationality', label: 'Nationality', type: 'text' }
                ]
            },
            'organization': {
                icon: 'fas fa-building',
                fields: [
                    { id: 'org_name', label: 'Organization Name', type: 'text', required: true },
                    { id: 'industry', label: 'Industry', type: 'text' },
                    { id: 'website', label: 'Website', type: 'url' }
                ]
            },
            'wallet_address': {
                icon: 'fas fa-wallet',
                fields: [
                    { id: 'address', label: 'Wallet Address', type: 'text', required: true },
                    { id: 'currency', label: 'Currency', type: 'text' }
                ]
            },
            'ip_address': {
                icon: 'fas fa-globe',
                fields: [
                    { id: 'ip', label: 'IP Address', type: 'text', required: true },
                    { id: 'asn', label: 'ASN', type: 'text' },
                    { id: 'country', label: 'Country', type: 'text' }
                ]
            },
            'location': {
                icon: 'fas fa-map-marker-alt',
                fields: [
                    { id: 'address', label: 'Address', type: 'text', required: true },
                    { id: 'city', label: 'City', type: 'text' },
                    { id: 'country', label: 'Country', type: 'text' },
                    { id: 'coordinates', label: 'Coordinates', type: 'text' }
                ]
            },
            'domain_website': {
                icon: 'fas fa-globe-americas',
                fields: [
                    { id: 'domain', label: 'Domain/URL', type: 'text', required: true },
                    { id: 'registrar', label: 'Registrar', type: 'text' }
                ]
            },
            'social_media': {
                icon: 'fab fa-twitter', // Default for social
                fields: [
                    { id: 'username', label: 'Username/Handle', type: 'text', required: true },
                    { id: 'platform', label: 'Platform', type: 'text' },
                    { id: 'profile_url', label: 'Profile URL', type: 'url' }
                ]
            },
            'transaction': {
                icon: 'fas fa-exchange-alt',
                fields: [
                    { id: 'txid', label: 'Transaction ID', type: 'text', required: true },
                    { id: 'amount', label: 'Amount', type: 'number' },
                    { id: 'currency', label: 'Currency', type: 'text' }
                ]
            },
            'money_amount': {
                icon: 'fas fa-dollar-sign',
                fields: [
                    { id: 'amount', label: 'Amount', type: 'number', required: true },
                    { id: 'currency', label: 'Currency', type: 'text' }
                ]
            },
            'email_address': {
                icon: 'fas fa-envelope',
                fields: [
                    { id: 'email', label: 'Email Address', type: 'email', required: true },
                    { id: 'provider', label: 'Provider', type: 'text' }
                ]
            },
            'phone_number': {
                icon: 'fas fa-phone',
                fields: [
                    { id: 'number', label: 'Phone Number', type: 'tel', required: true },
                    { id: 'country_code', label: 'Country Code', type: 'text' }
                ]
            },
            'alias': {
                icon: 'fas fa-id-badge',
                fields: [
                    { id: 'alias_name', label: 'Alias', type: 'text', required: true },
                    { id: 'original_name', label: 'Original Name/Entity', type: 'text' }
                ]
            },
            'file_hash_evidence': {
                icon: 'fas fa-file-alt',
                fields: [
                    { id: 'filename', label: 'File Name', type: 'text' },
                    { id: 'hash', label: 'Hash (MD5/SHA256)', type: 'text' },
                    { id: 'type', label: 'Type', type: 'text' }
                ]
            },
            'malware_tool': {
                icon: 'fas fa-bug',
                fields: [
                    { id: 'name', label: 'Name', type: 'text', required: true },
                    { id: 'version', label: 'Version', type: 'text' },
                    { id: 'category', label: 'Category', type: 'text' }
                ]
            },
            'custom_entity': {
                icon: 'fas fa-cube',
                fields: [
                    { id: 'custom_label', label: 'Custom Label', type: 'text', required: true },
                    { id: 'custom_value', label: 'Value', type: 'text' }
                ]
            }
        };
    }

    /**
     * Public method to call when TraceLink section HTML is loaded and active.
     * Initializes DOM references and sets up event listeners.
     *
     */
    init() {
        // Set DOM references now that the HTML content is in the main document
        this.tracelinkTabsContainer = document.getElementById('tracelink-tabs');
        this.cyContainer = document.getElementById('cy');
        this.emptyState = document.getElementById('tracelink-empty-state');
        this.canvasContainer = document.getElementById('tracelink-canvas-container');
        this.addNodeModal = document.getElementById('tracelink-add-node-modal');
        this.addNodeForm = document.getElementById('tracelink-add-node-form');
        this.editLabelModal = document.getElementById('tracelink-edit-label-modal');
        this.editLabelForm = document.getElementById('tracelink-edit-label-form');
        this.contextMenu = document.getElementById('tracelink-context-menu');
        this.importModal = document.getElementById('tracelink-import-modal');
        this.tracelinkConfirmDeleteModal = document.getElementById('tracelink-confirm-delete-modal'); // Get the new delete modal

        // Set up event listeners and dynamic modal fields
        this._setupEventListeners();
        this.setupAddNodeModalDynamicFields();

        // Render initial state (tabs and potentially a graph)
        this.renderTraceLinkTabs();
    }

    /**
     * Sets up global and modal-specific event listeners.
     * @private
     *
     */
    _setupEventListeners() {
        // Global listener to hide context menu on any click outside
        document.addEventListener('click', (e) => {
            if (this.contextMenu && this.contextMenu.style.display === 'block' && !this.contextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });

        // Global keydown for Escape to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.addNodeModal && this.addNodeModal.style.display === 'flex') {
                    this.closeAddNodeModal();
                } else if (this.editLabelModal && this.editLabelModal.style.display === 'flex') {
                    this.closeEditLabelModal();
                } else if (this.importModal && this.importModal.style.display === 'flex') {
                    this.closeImportModal();
                } else if (this.tracelinkConfirmDeleteModal && this.tracelinkConfirmDeleteModal.style.display === 'flex') {
                    this.closeConfirmDeleteModal();
                }
                this.hideContextMenu();
                this._cancelConnectionMode(); // Cancel connection mode on escape
            }
        });

        // Add node form submission and modal close buttons
        if (this.addNodeForm) {
            this.addNodeForm.onsubmit = (e) => this.handleAddNodeSubmit(e);
            // Close button for add node modal
            this.addNodeModal.querySelectorAll('.close-modal-btn, .close').forEach(btn => btn.onclick = () => this.closeAddNodeModal());

            document.getElementById('add-node-type-select').addEventListener('change', () => this.updateAddNodeDynamicFields());
        }

        // Edit label form submission and modal close buttons
        if (this.editLabelForm) {
            this.editLabelForm.onsubmit = (e) => this.handleEditLabelSubmit(e);
            // Close button for edit label modal
            this.editLabelModal.querySelectorAll('.close-modal-btn, .close').forEach(btn => btn.onclick = () => this.closeEditLabelModal());
        }

        // Import modal form submission and close buttons
        if (this.importModal) {
            this.importModal.querySelector('#tracelink-import-form').onsubmit = (e) => this.handleImportFromVaultSubmit(e);
            this.importModal.querySelectorAll('.close-modal-btn, .close').forEach(btn => btn.onclick = () => this.closeImportModal());
        }

        // TraceLink specific delete confirmation modal buttons
        if (this.tracelinkConfirmDeleteModal) {
            this.tracelinkConfirmDeleteModal.querySelector('#tracelink-confirm-delete-cancel-btn').onclick = () => this.closeConfirmDeleteModal();
            this.tracelinkConfirmDeleteModal.querySelector('#tracelink-confirm-delete-btn').onclick = () => {
                if (this.tracelinkConfirmDeleteCallback) {
                    this.tracelinkConfirmDeleteCallback();
                }
                this.closeConfirmDeleteModal();
            };
            this.tracelinkConfirmDeleteModal.querySelector('.close').onclick = () => this.closeConfirmDeleteModal();
        }


        // Context Menu button listeners
        if (this.contextMenu) {
            document.getElementById('context-add-node-btn').onclick = () => this.showAddNodeModal();
            document.getElementById('context-edit-label-btn').onclick = () => this.showEditLabelModalForContextTarget();
            document.getElementById('context-delete-btn').onclick = () => this.handleContextDelete();
            // IMPORTANT: Connect nodes is handled by selecting the source node first, then
            // listening for a target node click. The context menu will only show this on a node.
            document.getElementById('context-connect-nodes-btn').onclick = () => this.handleConnectNodesFromContext();
        }

        // General control buttons (from tracelink.html header)
        const addNodeBtn = document.getElementById('tracelink-add-node-btn');
        if (addNodeBtn) addNodeBtn.onclick = () => this.showAddNodeModal();
        
        // NEW: Connect/Edit Connection Button
        const connectNodesBtn = document.getElementById('tracelink-connect-nodes-btn');
        if (connectNodesBtn) connectNodesBtn.onclick = () => this.handleConnectNodesViaButton();

        const saveLayoutBtn = document.getElementById('tracelink-save-layout-btn');
        if (saveLayoutBtn) saveLayoutBtn.onclick = () => this.saveCurrentLayout();

        const applyLayoutSelect = document.getElementById('tracelink-layout-select');
        if (applyLayoutSelect) applyLayoutSelect.onchange = (e) => this.applyNewLayout(e.target.value);

        const exportGraphBtn = document.getElementById('tracelink-export-graph-btn');
        if (exportGraphBtn) exportGraphBtn.onclick = () => this.exportCurrentGraph();

        const importFromVaultBtn = document.getElementById('tracelink-import-from-vault-btn');
        if (importFromVaultBtn) importFromVaultBtn.onclick = () => this.showImportModal();

        // New Zoom/Fit Buttons
        const zoomInBtn = document.getElementById('tracelink-zoom-in-btn');
        if (zoomInBtn) zoomInBtn.onclick = () => this.zoomGraph(0.2);

        const zoomOutBtn = document.getElementById('tracelink-zoom-out-btn');
        if (zoomOutBtn) zoomOutBtn.onclick = () => this.zoomGraph(-0.2);

        const fitViewBtn = document.getElementById('tracelink-fit-view-btn');
        if (fitViewBtn) fitViewBtn.onclick = () => this.fitGraphToView();
    }

    /**
     * Sets up Cytoscape.js specific event listeners.
     * This is called after the Cytoscape instance is created.
     * @private
     *
     */
    _setupCytoscapeEventListeners() {
        if (!this.cy) return;

        // Right-click on node, edge, or canvas background
        this.cy.on('cxttap', 'node', (e) => this.showContextMenu(e, 'node'));
        this.cy.on('cxttap', 'edge', (e) => this.showContextMenu(e, 'edge'));
        this.cy.on('cxttap', (e) => {
            if (e.target === this.cy) { // Clicked on the canvas background
                this.showContextMenu(e, 'canvas');
            }
        });

        // Listen for user panning/zooming/node dragging to save state with debounce
        this.cy.on('zoom pan free', () => { // 'free' event for node dragging
             clearTimeout(this._saveStateTimeout);
             this._saveStateTimeout = setTimeout(() => {
                 this.saveGraphState();
             }, 1000);
        });

        // Prevent default browser context menu on the canvas
        this.cy.on('cxttapstart', (e) => {
            if (e.target === this.cy || e.target.isNode() || e.target.isEdge()) {
                e.preventDefault();
            }
        });

        // If a node is selected, store it as the potential source for connection.
        // This handles cases where a user might select a node first, then click the 'Connect' button.
        this.cy.on('select', 'node', (e) => {
            if (!this._isConnecting) { // Only update if not already in connection mode
                this._sourceNodeForConnection = e.target;
            }
        });
        this.cy.on('unselect', 'node', (e) => {
            if (!this._isConnecting && this._sourceNodeForConnection && this._sourceNodeForConnection.id() === e.target.id()) {
                 this._sourceNodeForConnection = null; // Clear if the currently selected node is unselected
            }
        });
    }

    /**
     * Loads TraceLink projects from localStorage.
     * @returns {object} The loaded projects.
     *
     */
    loadTraceLinkProjects() {
        const stored = localStorage.getItem('tracelinkProjects');
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Saves TraceLink projects to localStorage.
     *
     */
    saveTraceLinkProjects() {
        localStorage.setItem('tracelinkProjects', JSON.stringify(this.tracelinkProjects));
    }

    /**
     * Renders the TraceLink project tabs based on available Multi-Vaults.
     *
     */
    renderTraceLinkTabs() {
        if (!this.tracelinkTabsContainer) {
            console.warn("tracelinkTabsContainer not found, TraceLink tabs cannot be rendered.");
            return;
        }
        this.tracelinkTabsContainer.innerHTML = '';
        
        // Ensure multiVaultManager is available
        if (!window.multiVaultManager || typeof window.multiVaultManager.getVaults !== 'function') {
            this.showNotification('Multi-Vault manager not found or not initialized. Please ensure the Multi-Vault section is functional.', 'error');
            this.showEmptyState('Multi-Vault manager not found or not initialized. Please ensure the Multi-Vault section is functional.');
            return;
        }
        const multiVaults = window.multiVaultManager.getVaults();

        let hasTabsToDisplay = false;
        let firstProjectVaultId = null;

        // Create tabs for each existing TraceLink project
        for (const vaultId in this.tracelinkProjects) {
            const vault = multiVaults.find(v => v.id === vaultId);
            // Only show tab if the associated Multi-Vault still exists and is not archived
            if (vault && !vault.archived) {
                if (!firstProjectVaultId) {
                    firstProjectVaultId = vaultId;
                }
                hasTabsToDisplay = true;
                const tab = document.createElement('div');
                tab.className = `tracelink-tab ${this.currentVaultId === vaultId ? 'active' : ''}`;
                tab.dataset.vaultId = vaultId;
                tab.innerHTML = `
                    <div class="tracelink-tab-icon" style="background-color: ${vault.color};">
                        <i class="${vault.icon}"></i>
                    </div>
                    <div class="tracelink-tab-content">
                        <div class="tracelink-tab-name">${vault.name || 'Unnamed Vault'}</div>
                        <div class="tracelink-tab-stats">${this.tracelinkProjects[vaultId].elements.length || 0} elements</div>
                    </div>
                    <button class="tab-close-btn" data-vault-id="${vaultId}" title="Delete TraceLink Project">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                tab.onclick = (e) => {
                    if (e.target.classList.contains('tab-close-btn') || e.target.closest('.tab-close-btn')) {
                        e.stopPropagation(); // Prevent tab switch
                        this.confirmDeleteProject(vaultId);
                    } else {
                        this.switchProject(vaultId);
                    }
                };
                this.tracelinkTabsContainer.appendChild(tab);
            } else {
                // If associated vault is deleted or archived, remove this tracelink project
                delete this.tracelinkProjects[vaultId];
                this.saveTraceLinkProjects();
            }
        }

        // Initial display logic
        if (Object.keys(this.tracelinkProjects).length === 0) {
            this.showEmptyState('No TraceLink projects yet. Click "Import from Vault" to create your first visualization from Multi-Vault data.');
            this.currentVaultId = null; // Ensure no project is selected
        } else if (!this.currentVaultId || !this.tracelinkProjects[this.currentVaultId]) {
            // If no project is currently selected, or the selected one was deleted/archived, switch to the first available project
            if (firstProjectVaultId) {
                this.switchProject(firstProjectVaultId);
            } else {
                 this.showEmptyState('No active TraceLink projects. Create a new one or unarchive an existing vault.');
                 this.currentVaultId = null;
            }
        } else {
            this.hideEmptyState();
            if (!this.cy) { // If a project is selected but cy isn't initialized (e.g., first load of the section)
                this.initCytoscape();
                const projectData = this.tracelinkProjects[this.currentVaultId];
                this.cy.json({ elements: projectData.elements });
                if (projectData.layout && projectData.layout.zoom !== undefined && projectData.layout.pan) {
                    this.cy.zoom(projectData.layout.zoom);
                    this.cy.pan(projectData.layout.pan);
                } else if (this.cy.nodes().length > 0) {
                    this.applyNewLayout('cola'); // Apply a default layout if no saved positions
                }
            }
        }
    }

    /**
     * Switches to a different TraceLink project (vault).
     * @param {string} vaultId - The ID of the vault to switch to.
     *
     */
    switchProject(vaultId) {
        if (this.currentVaultId === vaultId && this.cy) {
            return; // Already on this project and graph is initialized
        }

        // Save state of current project before switching
        if (this.cy && this.currentVaultId && this.tracelinkProjects[this.currentVaultId]) {
            this.saveGraphState();
        }

        this.currentVaultId = vaultId;
        this.renderTraceLinkTabs(); // Re-render to update active state

        this.hideEmptyState();
        if (this.canvasContainer) this.canvasContainer.style.display = 'block'; // Show canvas

        this.initCytoscape(); // Always re-initialize Cytoscape for a clean start

        const projectData = this.tracelinkProjects[vaultId];
        if (projectData) {
            this.cy.json({ elements: projectData.elements });
            // Apply saved position, zoom, and pan
            if (projectData.layout && projectData.layout.zoom !== undefined && projectData.layout.pan) {
                this.cy.zoom(projectData.layout.zoom);
                this.cy.pan(projectData.layout.pan);
            } else if (this.cy.nodes().length > 0) {
                this.applyNewLayout('cola'); // Apply default layout if no saved state
            }
            this.showNotification(`Loaded TraceLink project for vault "${window.multiVaultManager.getVaultById(vaultId)?.name}".`, 'info');
        } else {
            // This case should now primarily be handled by showImportModal or project creation
            // If somehow a project is switched to but not in tracelinkProjects, it's a fresh start
            this.cy.elements().remove();
            this.applyNewLayout('grid'); // Default layout for truly new projects
            this.showNotification(`New TraceLink project started for vault "${window.multiVaultManager.getVaultById(vaultId)?.name}". Import entities or add manually!`, 'info');
        }
        // Reset layout select to default option for new project or loaded one
        const layoutSelect = document.getElementById('tracelink-layout-select');
        if (layoutSelect) layoutSelect.value = 'cola';
    }

    /**
     * Confirms deletion of a TraceLink project.
     * @param {string} vaultId - The ID of the vault whose project is to be deleted.
     *
     */
    confirmDeleteProject(vaultId) {
        const vaultName = window.multiVaultManager.getVaultById(vaultId)?.name || 'this project';
        this.showConfirmDeleteModal(
            `Delete TraceLink Project`,
            `Are you sure you want to delete the TraceLink visualization for "${vaultName}"? This will only delete the visualization data, not the vault or its entries.`,
            () => this.deleteProject(vaultId)
        );
    }

    /**
     * Deletes a TraceLink project.
     * @param {string} vaultId - The ID of the vault whose project is to be deleted.
     *
     */
    deleteProject(vaultId) {
        delete this.tracelinkProjects[vaultId];
        this.saveTraceLinkProjects();
        
        // If the deleted project was the currently active one, clean up
        if (this.currentVaultId === vaultId) {
            this.currentVaultId = null;
            if (this.cy) {
                 this.cy.destroy(); // Destroy current Cytoscape instance
                 this.cy = null;
            }
            this.showEmptyState('TraceLink project deleted. Select another vault or create a new visualization.');
        }
        this.renderTraceLinkTabs(); // Update tabs
        this.showNotification('TraceLink project deleted successfully!', 'success');
    }

    /**
     * Displays the empty state message in the TraceLink section.
     * @param {string} message - The message to display.
     *
     */
    showEmptyState(message = 'No TraceLink project selected. Select a Multi-Vault from the tabs above or import entities to start a new visualization.') {
        if (this.emptyState) {
            this.emptyState.style.display = 'flex';
            this.emptyState.querySelector('p').textContent = message;
        }
        if (this.canvasContainer) this.canvasContainer.style.display = 'none'; // Hide canvas
        if (this.cy) {
            this.cy.destroy(); // Clean up existing instance
            this.cy = null;
        }
    }

    /**
     * Hides the empty state message and shows the canvas.
     *
     */
    hideEmptyState() {
        if (this.emptyState) this.emptyState.style.display = 'none';
        if (this.canvasContainer) this.canvasContainer.style.display = 'block';
    }

     /**
      * Helper to generate a Font Awesome icon as a Data URL for Cytoscape.js nodes.
      * This allows dynamic, high-quality icons directly in node backgrounds.
      * @param {string} iconUnicode - The Unicode value of the Font Awesome icon (e.g., 'f007' for fa-user).
      * @param {string} fontFamily - The font family name (e.g., 'Font Awesome 5 Free').
      * @param {string} fontWeight - The font weight (e.g., '900' for solid, '400' for regular/brands).
      * @param {number} fontSize - The desired font size for the icon within the SVG.
      * @param {string} color - The color of the icon.
      * @returns {string} A data URL representing the SVG image of the icon.
      *
      */
    _generateIconDataURL(iconUnicode, fontFamily, fontWeight, fontSize, color) {
        const svgSize = fontSize;
        const iconChar = String.fromCharCode(parseInt(iconUnicode, 16));
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
                <text x="50%" y="50%" font-family="${fontFamily}" font-size="${fontSize}px" font-weight="${fontWeight}" fill="${color}" text-anchor="middle" dominant-baseline="central">
                    ${iconChar}
                </text>
            </svg>
        `;
        // More robust UTF-8 to Base64 encoding for btoa
        const utf8EncodedSvg = new TextEncoder().encode(svg);
        let binaryString = '';
        utf8EncodedSvg.forEach(byte => {
            binaryString += String.fromCharCode(byte);
        });
        return `data:image/svg+xml;base64,${btoa(binaryString)}`;
    }


    /**
     * Initializes the Cytoscape.js graph instance with enhanced styling.
     * Destroys existing instance if any.
     * This now includes advanced node styling with dynamic colors and Font Awesome icons,
     * and refined edge styling.
     *
     */
    initCytoscape() {
        if (this.cy) {
            this.cy.destroy(); // Destroy previous instance if it exists
        }
        if (!this.cyContainer) {
            console.error("Cytoscape container (#cy) not found. Cannot initialize graph.");
            return;
        }

        this.cy = cytoscape({
            container: this.cyContainer,
            elements: [], // Start with empty elements by default
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': 'data(backgroundColor)', // Dynamic background color
                        'width': '60px',
                        'height': '60px',
                        'label': 'data(label)',
                        'font-size': '10px',
                        'text-valign': 'bottom', // Label below the node
                        'text-halign': 'center',
                        'color': 'white', // Label color
                        'text-wrap': 'wrap',
                        'text-max-width': '80px',
                        'padding': '5px',
                        'transition-property': 'background-color, border-color, transform',
                        'transition-duration': '0.3s',
                        'border-width': '2px',
                        'border-color': 'data(borderColor)', // Dynamic border color
                        'box-shadow-color': 'data(shadowColor)', // Dynamic shadow color
                        'box-shadow-blur': '8px',
                        'box-shadow-offset-x': '0px',
                        'box-shadow-offset-y': '0px',
                        'box-shadow-opacity': '0.8',
                        'shape': 'round-rectangle', // Using round-rectangle for a softer, professional look

                        // Icon properties using background-image for Font Awesome
                        'background-image': 'data(iconDataUrl)', // Use the data URL for the icon
                        'background-fit': 'contain', // Scale icon to fit node
                        'background-image-opacity': 0.9, // Opacity of the icon
                        'background-position-y': '25%', // Adjust vertical position of icon
                        'background-position-x': '50%', // Center horizontally
                        'background-width': '50%', // Size of the icon
                        'background-height': '50%', // Size of the icon

                        'text-margin-y': '5px', // Space between node bottom and label
                        'text-outline-color': 'rgba(15, 15, 25, 0.8)', // Outline for text readability
                        'text-outline-width': '1px',
                        'overlay-padding': '0px',
                        'overlay-opacity': 0
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'background-color': '#00e6e6',
                        'border-color': '#ffffff',
                        'border-width': '3px',
                        'box-shadow-color': 'rgba(0, 204, 204, 0.8)',
                        'box-shadow-blur': '15px',
                        'z-index': '999'
                    }
                },
                {
                    selector: 'node.connect-source', // For highlighting source node during connection
                    style: {
                        'overlay-padding': '8px',
                        'overlay-color': '#00cccc',
                        'overlay-opacity': 0.3
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': 'rgba(255, 255, 255, 0.4)',
                        'target-arrow-shape': 'triangle',
                        'target-arrow-color': 'rgba(255, 255, 255, 0.4)',
                        'curve-style': 'bezier',
                        'label': 'data(label)', // Display edge label
                        'font-size': '8px',
                        'color': 'rgba(255, 255, 255, 0.7)',
                        'text-background-opacity': 1,
                        'text-background-color': 'rgba(15, 15, 25, 0.8)',
                        'text-background-padding': '3px',
                        'text-border-width': 1,
                        'text-border-color': 'rgba(0, 204, 204, 0.2)',
                        'text-border-opacity': 1,
                        'transition-property': 'line-color, target-arrow-color',
                        'transition-duration': '0.3s'
                    }
                },
                {
                    selector: 'edge:selected',
                    style: {
                        'line-color': '#00cccc',
                        'target-arrow-color': '#00cccc',
                        'width': '3px',
                        'z-index': '998'
                    }
                }
            ],
            layout: {
                name: 'random' // Default initial layout
            },
            zoomingEnabled: true,
            userZoomingEnabled: true,
            panningEnabled: true,
            userPanningEnabled: true,
            boxSelectionEnabled: true,
            autounselectify: false,
            // Enhanced interaction options
            selectionType: 'additive', // Allows selecting multiple elements by clicking
            motionBlur: false, // Turn off motion blur for crisper view during pan/zoom
            pixelRatio: window.devicePixelRatio || 1, // Use device pixel ratio for sharper rendering
            textureOnViewport: true // Show background textures when moving viewport
        });

        // Add event listeners to Cytoscape instance
        this._setupCytoscapeEventListeners();
    }

    /**
     * Zooms the graph in or out.
     * @param {number} factor - Positive for zoom in, negative for zoom out.
     *
     */
    zoomGraph(factor) {
        if (!this.cy) {
            this.showNotification('Graph not initialized.', 'warning');
            return;
        }
        const currentZoom = this.cy.zoom();
        this.cy.zoom(currentZoom + factor);
        this.saveGraphState();
    }

    /**
     * Fits all graph elements into the viewport.
     *
     */
    fitGraphToView() {
        if (!this.cy) {
            this.showNotification('Graph not initialized.', 'warning');
            return;
        }
        if (this.cy.nodes().length === 0) {
            this.showNotification('No nodes to fit to view. Add nodes first!', 'warning');
            return;
        }
        this.cy.fit(); // Fits all elements to the view
        this.saveGraphState();
    }

/**
     * Returns color properties for a given entity type for graph visualization.
     * @param {string} entityType - The type of the entity.
     * @returns {object} An object containing background, border, and shadow colors.
     *
     */
    getEntityColor(entityType) {
        const colors = {
            'person': { bg: '#8b5cf6', border: '#6d28d9', shadow: 'rgba(139, 92, 246, 0.5)' }, // Purple
            'organization': { bg: '#f97316', border: '#ea580c', shadow: 'rgba(249, 115, 22, 0.5)' }, // Orange
            'wallet_address': { bg: '#facc15', border: '#eab308', shadow: 'rgba(252, 211, 77, 0.5)' }, // Yellow
            'ip_address': { bg: '#10b981', border: '#059669', shadow: 'rgba(16, 185, 129, 0.5)' }, // Teal Green
            'location': { bg: '#ef4444', border: '#dc2626', shadow: 'rgba(239, 68, 68, 0.5)' }, // Red
            'domain_website': { bg: '#3b82f6', border: '#2563eb', shadow: 'rgba(59, 130, 246, 0.5)' }, // Blue
            'social_media': { bg: '#06b6d4', border: '#0891b2', shadow: 'rgba(6, 182, 212, 0.5)' }, // Cyan
            'transaction': { bg: '#c026d3', border: '#a21caf', shadow: 'rgba(192, 38, 211, 0.5)' }, // Magenta
            'money_amount': { bg: '#be185d', border: '#9d174d', shadow: 'rgba(190, 24, 93, 0.5)' }, // Pink
            'email_address': { bg: '#22c55e', border: '#16a34a', shadow: 'rgba(34, 197, 94, 0.5)' }, // Green
            'phone_number': { bg: '#64748b', border: '#475569', shadow: 'rgba(100, 116, 139, 0.5)' }, // Slate Gray
            'alias': { bg: '#a855f7', border: '#9333ea', shadow: 'rgba(168, 85, 247, 0.5)' }, // Light Purple
            'file_hash_evidence': { bg: '#78716c', border: '#57534e', shadow: 'rgba(120, 113, 108, 0.5)' }, // Stone Gray
            'malware_tool': { bg: '#f43f5e', border: '#e11d48', shadow: 'rgba(244, 63, 94, 0.5)' }, // Rose
            'custom_entity': { bg: '#00cccc', border: '#009999', shadow: 'rgba(0, 204, 204, 0.5)' }, // Default TraceLink Accent
            // Multi-Vault types (ensure consistency if importing from Multi-Vault and matching here)
            'tool': { bg: '#28a745', border: '#28a745', shadow: 'rgba(40, 167, 69, 0.5)' },
            'email': { bg: '#007bff', border: '#007bff', shadow: 'rgba(0, 123, 255, 0.5)' },
            'phone': { bg: '#ffc107', border: '#ffc107', shadow: 'rgba(255, 193, 7, 0.5)' },
            'crypto': { bg: '#f39c12', border: '#f39c12', shadow: 'rgba(243, 156, 18, 0.5)' },
            'location': { bg: '#e74c3c', border: '#e74c3c', shadow: 'rgba(231, 76, 60, 0.5)' },
            'link': { bg: '#9b59b6', border: '#9b59b6', shadow: 'rgba(155, 89, 182, 0.5)' },
            'media': { bg: '#34495e', border: '#34495e', shadow: 'rgba(52, 73, 94, 0.5)' },
            'password': { bg: '#dc3545', border: '#dc3545', shadow: 'rgba(220, 53, 69, 0.5)' },
            'keyword': { bg: '#6c757d', border: '#6c757d', shadow: 'rgba(108, 117, 125, 0.5)' },
            'social': { bg: '#17a2b8', border: '#17a2b8', shadow: 'rgba(23, 162, 184, 0.5)' },
            'domain': { bg: '#20c997', border: '#20c997', shadow: 'rgba(32, 201, 151, 0.5)' },
            'username': { bg: '#6610f2', border: '#6610f2', shadow: 'rgba(102, 16, 242, 0.5)' },
            'threat': { bg: '#fd7e14', border: '#fd7e14', shadow: 'rgba(253, 126, 20, 0.5)' },
            'vulnerability': { bg: '#6f42c1', border: '#6f42c1', shadow: 'rgba(111, 66, 193, 0.5)' },
            'malware': { bg: '#0056b3', border: '#0056b3', shadow: 'rgba(0, 86, 179, 0.5)' },
            'breach': { bg: '#c82333', border: '#c82333', shadow: 'rgba(200, 35, 51, 0.5)' },
            'credential': { bg: '#218838', border: '#218838', shadow: 'rgba(33, 136, 56, 0.5)' },
            'forum': { bg: '#138496', border: '#138496', shadow: 'rgba(19, 132, 150, 0.5)' },
            'vendor': { bg: '#d63384', border: '#d63384', shadow: 'rgba(214, 51, 132, 0.5)' },
            'telegram': { bg: '#0088cc', border: '#0088cc', shadow: 'rgba(0, 136, 204, 0.5)' },
            'paste': { bg: '#6f42c1', border: '#6f42c1', shadow: 'rgba(111, 66, 193, 0.5)' },
            'document': { bg: '#20c997', border: '#20c997', shadow: 'rgba(32, 201, 151, 0.5)' },
            'network': { bg: '#fd7e14', border: '#fd7e14', shadow: 'rgba(253, 126, 20, 0.5)' },
            'metadata': { bg: '#6c757d', border: '#6c757d', shadow: 'rgba(108, 117, 125, 0.5)' },
            'archive': { bg: '#007bff', border: '#007bff', shadow: 'rgba(0, 123, 255, 0.5)' },
            'messaging': { bg: '#17a2b8', border: '#17a2b8', shadow: 'rgba(23, 162, 184, 0.5)' },
            'dating': { bg: '#e83e8c', border: '#e83e8c', shadow: 'rgba(232, 62, 140, 0.5)' },
            'audio': { bg: '#6610f2', border: '#6610f2', shadow: 'rgba(102, 16, 242, 0.5)' },
            'facial': { bg: '#28a745', border: '#28a745', shadow: 'rgba(40, 167, 69, 0.5)' },
            'persona': { bg: '#ff69b4', border: '#ff69b4', shadow: 'rgba(255, 105, 180, 0.5)' },
            'vpn': { bg: '#34495e', border: '#34495e', shadow: 'rgba(52, 73, 94, 0.5)' },
            'honeypot': { bg: '#e74c3c', border: '#e74c3c', shadow: 'rgba(231, 76, 60, 0.5)' },
            'exploit': { bg: '#dc3545', border: '#dc3545', shadow: 'rgba(220, 53, 69, 0.5)' },
            'publicrecord': { bg: '#f39c12', border: '#f39c12', shadow: 'rgba(243, 156, 18, 0.5)' }
        };
        const defaultColor = { bg: '#00cccc', border: '#009999', shadow: 'rgba(0, 204, 204, 0.5)' };
        return colors[entityType] || defaultColor;
    }

    /**
     * Maps entity types to Font Awesome UNICODE values.
     * These Unicode values are then converted to SVG data URLs for node icons.
     * @param {string} entityType - The type of the entity (e.g., 'person', 'email').
     * @returns {string} The Font Awesome Unicode hexadecimal string.
     *
     */
    getEntityTypeIcon(entityType) {
        // You can find Font Awesome Unicode values on their cheatsheet or by inspecting elements
        // For example, fas fa-user-circle is &#xf2bd; -> 'f2bd'
        // fab fa-bitcoin is &#xf15a; -> 'f15a'
        const icons = {
            'person': 'f2bd', // fas fa-user-circle
            'organization': 'f1ad', // fas fa-building (using font awesome 5, building looks more like a business)
            'wallet_address': 'f555', // fas fa-wallet
            'ip_address': 'f0ac', // fas fa-globe
            'location': 'f3c5', // fas fa-map-marker-alt
            'domain_website': 'f0ac', // fas fa-globe
            'social_media': 'f099', // fab fa-twitter (common social icon)
            'transaction': 'f0ec', // fas fa-exchange-alt
            'money_amount': 'f0d6', // fas fa-dollar-sign (or f155 for euro, f156 for yen)
            'email_address': 'f0e0', // fas fa-envelope
            'phone_number': 'f095', // fas fa-phone
            'alias': 'f2bb', // fas fa-id-badge
            'file_hash_evidence': 'f15b', // fas fa-file-alt
            'malware_tool': 'f188', // fas fa-bug
            'custom_entity': 'f1b2', // fas fa-cube

            // Multi-Vault types from script.js (ensure these match your multiVaultManager's entry types)
            'tool': 'f7d9', // fas fa-tools
            'email': 'f0e0', // fas fa-envelope
            'phone': 'f095', // fas fa-phone
            'crypto': 'f15a', // fab fa-bitcoin
            'location': 'f3c5', // fas fa-map-marker-alt
            'link': 'f0c1', // fas fa-link
            'media': 'f03e', // fas fa-image (or f03d for photo-video)
            'password': 'f084', // fas fa-key (for lock)
            'keyword': 'f02b', // fas fa-tag
            'social': 'f0c0', // fas fa-users
            'domain': 'f0ac', // fas fa-globe
            'username': 'f007', // fas fa-user
            'threat': 'f0e3', // fas fa-shield-alt
            'vulnerability': 'f188', // fas fa-bug
            'malware': 'f0fa', // fas fa-virus-slash (or f0fb for virus)
            'breach': 'f071', // fas fa-exclamation-triangle
            'credential': 'f2c2', // fas fa-id-card
            'forum': 'f086', // fas fa-comments
            'vendor': 'f54e', // fas fa-store
            'telegram': 'f2c6', // fab fa-telegram-plane
            'paste': 'f0ea', // fas fa-clipboard
            'document': 'f15b', // fas fa-file-alt
            'network': 'f6ff', // fas fa-network-wired
            'metadata': 'f05a', // fas fa-info-circle
            'archive': 'f187', // fas fa-archive
            'messaging': 'f075', // fas fa-comment-dots
            'dating': 'f004', // fas fa-heart
            'audio': 'f028', // fas fa-volume-up
            'facial': 'f06e', // fas fa-eye
            'persona': 'f13d', // fas fa-mask
            'vpn': 'f6e2', // fas fa-user-secret (more explicit)
            'honeypot': 'f1b2', // fas fa-spider (or f024 for flag)
            'exploit': 'f1e0', // fas fa-bomb
            'publicrecord': 'f02d' // fas fa-book
        };
        return icons[entityType] || 'f111'; // Default: fas fa-circle
    }


    /**
     * Applies a new layout to the graph.
     * @param {string} layoutName - The name of the layout to apply (e.g., 'cola', 'grid').
     *
     */
    applyNewLayout(layoutName = 'cola') {
        if (!this.cy) {
            this.showNotification('Graph not initialized.', 'warning');
            return;
        }

        // Ensure nodes exist before applying layout
        if (this.cy.nodes().length === 0) {
            this.showNotification('No nodes on the graph to apply a layout to. Import or add nodes first!', 'warning');
            return;
        }

        this.showNotification(`Applying ${layoutName.charAt(0).toUpperCase() + layoutName.slice(1)} layout...`, 'info', 1500);

        let layoutOptions = {};
        switch (layoutName) {
            case 'grid':
                layoutOptions = {
                    name: 'grid',
                    rows: Math.ceil(Math.sqrt(this.cy.nodes().length)), // More balanced grid
                    cols: Math.ceil(Math.sqrt(this.cy.nodes().length)),
                    padding: 30,
                    animate: true,
                    animationDuration: 500,
                    nodeDimensionsIncludeLabels: true,
                    spacingFactor: 1.5 // Increase spacing
                };
                break;
            case 'circle':
                layoutOptions = {
                    name: 'circle',
                    animate: true,
                    animationDuration: 500,
                    nodeDimensionsIncludeLabels: true,
                    radius: Math.max(150, this.cy.nodes().length * 10), // Adjust radius based on node count, min radius
                    spacingFactor: 1.5 // Increase spacing
                };
                break;
            case 'concentric':
                layoutOptions = {
                    name: 'concentric',
                    animate: true,
                    animationDuration: 800, // Longer animation
                    nodeDimensionsIncludeLabels: true,
                    concentric: function(node){ // Group nodes by a numerical priority (example heuristic)
                        const type = node.data('entityType');
                        const typeOrder = { // Assign arbitrary 'levels' for concentric layout
                            'person': 10, 'organization': 9, 'email_address': 8, 'phone_number': 7,
                            'location': 6, 'ip_address': 5, 'domain_website': 4, 'social_media': 3,
                            'wallet_address': 2, 'malware_tool': 2, 'threat': 2, 'vulnerability': 2,
                            'custom_entity': 1 // General/Misc innermost
                        };
                        return typeOrder[type] || 1;
                    },
                    levelWidth: function(nodes){ return 1; }, // How many concentric circles
                    minNodeSpacing: 80, // Minimum spacing between nodes
                    equidistant: true // Evenly space nodes
                };
                break;
            case 'cola': // Force-directed layout
            default:
                layoutOptions = {
                    name: 'cola',
                    animate: true,
                    animationDuration: 800,
                    nodeDimensionsIncludeLabels: true,
                    gravity: 1,
                    edgeLength: 120, // Slightly longer edges for clarity
                    padding: 30,
                    avoidOverlap: true,
                    randomize: false,
                    maxSimulationTime: 2000 // Cap simulation time
                };
                break;
        }

        const layout = this.cy.layout(layoutOptions);
        layout.run();
        layout.on('layoutstop', () => { // Listen for layout completion
            this.saveGraphState();
            this.showNotification(`Layout changed to: ${layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}`, 'success');
        });
    }

    /**
     * Saves the current graph layout (positions, zoom, pan) to the active project.
     *
     */
    saveCurrentLayout() {
        if (!this.cy || !this.currentVaultId) {
            this.showNotification('No active project to save layout for.', 'warning');
            return;
        }

        this.saveGraphState();
        this.showNotification('Current graph layout saved!', 'success');
    }

    /**
     * Exports the current graph data as a JSON file.
     *
     */
    exportCurrentGraph() {
        if (!this.cy || !this.currentVaultId) {
            this.showNotification('No active graph to export.', 'warning');
            return;
        }

        const graphData = this.cy.json().elements;
        const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const vaultName = window.multiVaultManager.getVaultById(this.currentVaultId)?.name || 'unknown_vault';
        const a = document.createElement('a');
        a.href = url;
        a.download = `tracelink_graph_${vaultName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Graph data exported successfully!', 'success');
    }

    /**
     * Shows the TraceLink Import Project modal.
     *
     */
    showImportModal() {
        if (!this.importModal) return;
        this.importModal.style.display = 'flex';
        this.populateVaultSelection();
    }

    /**
     * Closes the TraceLink Import Project modal.
     *
     */
    closeImportModal() {
        if (this.importModal) {
            this.importModal.style.display = 'none';
            this.importModal.querySelector('#tracelink-import-form').reset();
        }
    }

    /**
     * Populates the vault selection grid in the import modal.
     *
     */
    populateVaultSelection() {
        const vaultSelectionGrid = document.getElementById('vault-selection-grid');
        if (!vaultSelectionGrid) return;

        if (!window.multiVaultManager || typeof window.multiVaultManager.getVaults !== 'function') {
            vaultSelectionGrid.innerHTML = '<div class="empty-vaults-message">Multi-Vault manager not found.</div>';
            return;
        }

        const allVaults = window.multiVaultManager.getVaults();
        if (allVaults.length === 0) {
            vaultSelectionGrid.innerHTML = '<div class="empty-vaults-message">No Multi-Vaults found. Create one in the Multi-Vault section.</div>';
            return;
        }

        vaultSelectionGrid.innerHTML = ''; // Clear previous content
        allVaults.forEach(vault => {
            if (vault.archived) return; // Skip archived vaults

            const isAlreadyImported = this.tracelinkProjects.hasOwnProperty(vault.id);
            
            const vaultItem = document.createElement('div');
            vaultItem.className = `vault-selection-item ${isAlreadyImported ? 'already-imported' : ''}`;
            // Add 'selected' class directly if checkbox is pre-checked (for future pre-selection logic)
            // if (isAlreadyImported) { vaultItem.classList.add('selected'); } // Uncomment if you want disabled items to also visually appear 'selected'
            
            vaultItem.innerHTML = `
                <input type="checkbox" id="vault-select-${vault.id}" value="${vault.id}" ${isAlreadyImported ? 'disabled checked' : ''}>
                <div class="vault-icon" style="background-color: ${vault.color};">
                    <i class="${vault.icon}"></i>
                </div>
                <div class="vault-info">
                    <div class="vault-name">${vault.name || 'Unnamed Vault'}</div>
                    <div class="vault-entry-count">${vault.entries.length || 0} elements</div>
                </div>
            `;
            
            vaultItem.onclick = (e) => {
                const checkbox = vaultItem.querySelector('input[type="checkbox"]');
                // Only toggle if not disabled and click is not directly on the checkbox itself
                if (!checkbox.disabled && e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    vaultItem.classList.toggle('selected', checkbox.checked);
                } else if (e.target === checkbox && !checkbox.disabled) {
                    // If the click was directly on the checkbox, just update the selected class
                    vaultItem.classList.toggle('selected', checkbox.checked);
                }
            };
            
            vaultSelectionGrid.appendChild(vaultItem);

            // Ensure the 'selected' class is applied for initially checked (disabled) checkboxes
            const checkbox = vaultItem.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                vaultItem.classList.add('selected');
            }
        });
    }

/**
     * Handles the submission of the import from vault form.
     * Creates new TraceLink projects and imports data.
     * @param {Event} event - The form submission event.
     *
     */
    handleImportFromVaultSubmit(event) {
        event.preventDefault();
        const projectNameInput = document.getElementById('new-project-name');
        const projectName = projectNameInput.value.trim();
        const selectedVaults = Array.from(document.querySelectorAll('#vault-selection-grid input[type="checkbox"]:checked'))
                                    .map(cb => cb.value);

        if (!projectName) {
            this.showNotification('Project name is required.', 'warning');
            return;
        }

        if (selectedVaults.length === 0) {
            this.showNotification('Please select at least one Multi-Vault to import.', 'warning');
            return;
        }
        
        let importedCount = 0;
        selectedVaults.forEach(vaultId => {
            if (!this.tracelinkProjects.hasOwnProperty(vaultId)) { // Only import if not already existing
                const vault = window.multiVaultManager.getVaultById(vaultId);
                if (vault) {
                    const elementsToAdd = [];
                    vault.entries.forEach(entry => {
                        const nodeId = `entry-${entry.id}`;
                        const colors = this.getEntityColor(entry.type);
                        const faUnicode = this.getEntityTypeIcon(entry.type);
                        const iconDataUrl = this._generateIconDataURL(faUnicode, 'Font Awesome 5 Free', '900', 28, 'white'); // Icon color is white

                        elementsToAdd.push({
                            group: 'nodes',
                            data: {
                                id: nodeId,
                                label: entry.name || entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unnamed Entity',
                                entityType: entry.type,
                                vaultEntryId: entry.id,
                                originalVaultId: vaultId,
                                fullData: entry,
                                backgroundColor: colors.bg,
                                borderColor: colors.border,
                                shadowColor: colors.shadow,
                                iconDataUrl: iconDataUrl // Add icon Data URL to node data
                            }
                        });
                    });

                    this.tracelinkProjects[vaultId] = {
                        name: projectName, // Store the user-provided project name (optional, could derive from vault name)
                        elements: elementsToAdd, // Directly store the elements
                        layout: { zoom: 1, pan: { x: 0, y: 0 } } // Initial layout state
                    };
                    importedCount++;
                }
            }
        });

        this.saveTraceLinkProjects(); // Save the updated tracelinkProjects
        this.renderTraceLinkTabs(); // Re-render tabs to show new projects and updated counts

        if (importedCount > 0) {
            this.showNotification(`Successfully created ${importedCount} new TraceLink project(s) from selected vaults!`, 'success');
            // Switch to the first imported vault automatically
            this.switchProject(selectedVaults[0]);
        }
         else {
            this.showNotification('No new TraceLink projects created (already imported or invalid vaults selected).', 'info');
        }
        this.closeImportModal();
    }

/**
     * Imports entities from the currently selected Multi-Vault into the graph.
     * This method is now primarily used to ADD more entities to an *existing* graph,
     * not to create a new project.
     *
     */
    importEntitiesToCurrentGraph() {
        if (!this.currentVaultId) {
            this.showNotification('No TraceLink project selected. Create or select a project first.', 'warning');
            return;
        }
        if (!this.cy) {
            this.showNotification('Graph not initialized for current project. Switching project...', 'warning');
            this.switchProject(this.currentVaultId); // Re-initialize graph if not already
            return; // Exit and let switchProject re-call renderTraceLinkTabs
        }
        if (!window.multiVaultManager || typeof window.multiVaultManager.getVaults !== 'function') {
            this.showNotification('Multi-Vault manager not found. Cannot import entities.', 'error');
            return;
        }

        const vault = window.multiVaultManager.getVaultById(this.currentVaultId);
        if (!vault) {
            this.showNotification('Selected Multi-Vault not found or not loaded.', 'error');
            return;
        }

        if (vault.entries.length === 0) {
            this.showNotification(`Vault "${vault.name}" has no entries to import.`, 'info');
            return;
        }

        let addedCount = 0;
        const elementsToAdd = [];
        const currentElementsMap = new Map(); // For quick lookup of existing elements
        this.cy.elements().forEach(ele => currentElementsMap.set(ele.id(), ele));

        vault.entries.forEach(entry => {
            const nodeId = `entry-${entry.id}`; // Consistent ID
            const existingNode = currentElementsMap.get(nodeId);

            // Determine Font Awesome Unicode and then generate Data URL
            const faUnicode = this.getEntityTypeIcon(entry.type);
            const iconDataUrl = this._generateIconDataURL(faUnicode, 'Font Awesome 5 Free', '900', 28, 'white'); // Icon color is white


            if (!existingNode) {
                const colors = this.getEntityColor(entry.type);
                elementsToAdd.push({
                    group: 'nodes',
                    data: {
                        id: nodeId,
                        label: entry.name || entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unnamed Entity',
                        entityType: entry.type,
                        vaultEntryId: entry.id,
                        originalVaultId: this.currentVaultId,
                        fullData: entry,
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        shadowColor: colors.shadow,
                        iconDataUrl: iconDataUrl // Add icon Data URL to node data
                    },
                    position: { x: Math.random() * 500, y: Math.random() * 500 } // Random position for new nodes
                });
                addedCount++;
            } else {
                // Update existing node properties from the latest vault data
                const newColors = this.getEntityColor(entry.type);
                // Regenerate icon data URL for updates
                const newIconDataUrl = this._generateIconDataURL(this.getEntityTypeIcon(entry.type), 'Font Awesome 5 Free', '900', 28, 'white');
                existingNode.data({
                    label: entry.name || entry.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unnamed Entity',
                    entityType: entry.type,
                    fullData: entry,
                    backgroundColor: newColors.bg,
                    borderColor: newColors.border,
                    shadowColor: newColors.shadow,
                    iconDataUrl: newIconDataUrl // Update icon Data URL in node data
                });
            }
        });

        if (elementsToAdd.length > 0) {
            this.cy.add(elementsToAdd);
            this.saveGraphState(); // Save after adding/updating elements. This updates `tracelinkProjects[currentVaultId].elements`
            this.applyNewLayout('cola'); // Re-apply layout to integrate new nodes
            this.showNotification(`${addedCount} new entities imported from "${vault.name}"! Existing nodes updated.`, 'success');
            this.renderTraceLinkTabs(); // Re-render tabs to reflect the new count
        } else {
            this.showNotification('All entities from this vault are already in the graph, and existing ones were updated.', 'info');
        }
    }

    /**
     * Shows the context menu at the specified event position.
     * @param {Event} event - The right-click event.
     * @param {string} type - The type of element clicked ('node', 'edge', 'canvas').
     *
     */
    showContextMenu(event, type) {
        event.preventDefault(); // Prevent default browser context menu
        this.hideContextMenu(); // Hide any existing menu
        this._cancelConnectionMode(); // Cancel any ongoing connection mode

        this.contextTarget = event.target; // Store the clicked element (node, edge, or cy instance)

        // Reset all buttons to hidden
        document.getElementById('context-add-node-btn').style.display = 'none';
        document.getElementById('context-edit-label-btn').style.display = 'none';
        document.getElementById('context-delete-btn').style.display = 'none';
        document.getElementById('context-connect-nodes-btn').style.display = 'none';

        if (type === 'canvas') {
            document.getElementById('context-add-node-btn').style.display = 'flex';
            // Enable 'Connect Nodes' from canvas only if a node is currently selected
            if (this._sourceNodeForConnection && this._sourceNodeForConnection.isNode()) {
                 document.getElementById('context-connect-nodes-btn').style.display = 'flex';
                 document.getElementById('context-connect-nodes-btn').textContent = 'Connect from Selected Node';
            }
        } else if (type === 'node') {
            document.getElementById('context-delete-btn').style.display = 'flex';
            document.getElementById('context-connect-nodes-btn').style.display = 'flex';
            document.getElementById('context-connect-nodes-btn').textContent = 'Connect from This Node';
        } else if (type === 'edge') {
            document.getElementById('context-edit-label-btn').style.display = 'flex';
            document.getElementById('context-delete-btn').style.display = 'flex';
        }

        // Get the position relative to the Cytoscape container
        // Use renderedPosition for accurate placement within the canvas
        const menuX = event.renderedPosition.x;
        const menuY = event.renderedPosition.y;

        this.contextMenu.style.left = `${menuX}px`;
        this.contextMenu.style.top = `${menuY}px`;
        this.contextMenu.style.display = 'block';

        // Optional: Adjust position if it goes off screen (consider the actual menu dimensions)
        const menuRect = this.contextMenu.getBoundingClientRect();
        const cyContainerRect = this.cyContainer.getBoundingClientRect();
        
        // Adjust X if menu goes off right edge of container
        const currentLeft = parseInt(this.contextMenu.style.left, 10);
        if (currentLeft + menuRect.width > cyContainerRect.width) {
            this.contextMenu.style.left = `${currentLeft - menuRect.width - 10}px`; // Shift left by menu width + padding
        }
        // Adjust Y if menu goes off bottom edge of container
        const currentTop = parseInt(this.contextMenu.style.top, 10);
        if (currentTop + menuRect.height > cyContainerRect.height) {
            this.contextMenu.style.top = `${currentTop - menuRect.height - 10}px`; // Shift up by menu height + padding
        }
    }

    /**
     * Hides the context menu.
     *
     */
    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.style.display = 'none';
        }
        // No longer clear contextTarget here, as it might be needed for ongoing connection mode.
    }

    /**
     * Initiates the node connection mode from a context menu right-click on a node.
     *
     */
    handleConnectNodesFromContext() {
        this.hideContextMenu(); // Hide context menu immediately
        
        if (!this.contextTarget || !this.contextTarget.isNode()) {
            this.showNotification('Error: No valid source node selected for connection. Right-click a node to start.', 'error');
            return;
        }
        // If already connecting, and new context click is on a node, treat it as starting a new connection from this node.
        if (this._isConnecting) {
             this._cancelConnectionMode(); // Cancel previous mode if active
        }

        // Start connection mode
        this._initiateConnectionMode(this.contextTarget);
    }

    /**
     * Initiates the node connection mode from the main "Connect/Edit Connection" button.
     *
     */
    handleConnectNodesViaButton() {
        this.hideContextMenu();
        this._cancelConnectionMode(); // Always cancel any prior connection mode when button is clicked

        if (this.cy.nodes(':selected').empty()) {
            this.showNotification('No node selected. Please click on a node on the graph, then click "Connect/Edit Connection" again, or right-click a node.', 'info', 5000);
            return;
        }

        const selectedNodes = this.cy.nodes(':selected');
        if (selectedNodes.length > 1) {
             this.showNotification('Please select only ONE node to start a connection from. Deselect others or choose one.', 'warning', 5000);
             return;
        }

        const sourceNode = selectedNodes[0];
        if (!sourceNode) {
            this.showNotification('Could not identify selected node. Please try selecting a node again.', 'error');
            return;
        }

        // Initiate connection mode with the single selected node
        this._initiateConnectionMode(sourceNode);
    }

    /**
     * Internal helper to start the connection mode.
     * @param {object} sourceNode - The Cytoscape.js node element that is the source of the connection.
     * @private
     */
    _initiateConnectionMode(sourceNode) {
        if (!this.cy) {
            this.showNotification('Graph not initialized. Cannot connect nodes.', 'error');
            return;
        }
        this._sourceNodeForConnection = sourceNode;
        this._sourceNodeForConnection.addClass('connect-source'); // Highlight the source node
        this.showNotification(`Connection mode: Click on a TARGET node to connect to "${this._sourceNodeForConnection.data('label')}". Right-click CANVAS background to cancel.`, 'info', 7000);
        this._isConnecting = true;

        // Attach one-time listeners for the connection process
        this.cy.on('tap', 'node', this._handleTargetNodeClick.bind(this));
        this.cy.on('cxttap', this._handleCanvasRightClickToCancel.bind(this));
    }


    /**
     * Handles the click on a target node during connection mode.
     * @param {Event} e - The tap event.
     * @private
     */
    _handleTargetNodeClick(e) {
        if (!this._isConnecting || !this._sourceNodeForConnection) return;

        const targetNode = e.target;
        if (targetNode.isNode() && targetNode.id() !== this._sourceNodeForConnection.id()) {
            // Check if edge already exists between these two nodes (in either direction)
            const existingEdge = this.cy.elements(`edge[source = '${this._sourceNodeForConnection.id()}'][target = '${targetNode.id()}'], edge[source = '${targetNode.id()}'][target = '${this._sourceNodeForConnection.id()}']`);

            if (existingEdge.length === 0) {
                const newEdge = this.cy.add({
                    group: 'edges',
                    data: {
                        id: `edge-${this._sourceNodeForConnection.id()}-${targetNode.id()}-${Date.now()}`, // Unique ID for edge
                        source: this._sourceNodeForConnection.id(),
                        target: targetNode.id(),
                        label: '' // Default empty label, user can edit
                    }
                });
                this.saveGraphState();
                this.showNotification('Nodes connected successfully!', 'success');
                this._promptForEdgeLabel(newEdge); // Prompt user to label the new edge
                this._cancelConnectionMode(); // End connection mode after successful connection
            } else {
                this.showNotification('Nodes are already connected. Connection cancelled.', 'warning');
                this._cancelConnectionMode(); // End connection mode even if already connected
            }
        } else if (targetNode.isNode() && targetNode.id() === this._sourceNodeForConnection.id()) {
            this.showNotification('Cannot connect a node to itself. Click a different node or right-click background to cancel.', 'warning');
        }
    }

    /**
     * Handles right-click on canvas to cancel connection mode.
     * @param {Event} e - The cxttap event.
     * @private
     */
    _handleCanvasRightClickToCancel(e) {
        if (e.target === this.cy) { // Only if clicked on the canvas background
            this.showNotification('Connection cancelled.', 'info');
            this._cancelConnectionMode();
        }
    }


    /**
     * Helper to cancel connection mode and clean up.
     * @private
     *
     */
    _cancelConnectionMode() {
        if (this._isConnecting) {
            if (this._sourceNodeForConnection) {
                this._sourceNodeForConnection.removeClass('connect-source');
                this._sourceNodeForConnection = null; // Clear source node reference
            }
            // Remove specific listeners to avoid affecting other graph interactions
            this.cy.off('tap', 'node', this._handleTargetNodeClick); // Remove specific 'tap' listener for nodes
            this.cy.off('cxttap', this._handleCanvasRightClickToCancel); // Remove specific 'cxttap' listener for canvas
            this._isConnecting = false;
        }
    }

    /**
     * Prompts the user to add a label to a newly created edge.
     * @param {object} edge - The Cytoscape.js edge element.
     * @private
     *
     */
    _promptForEdgeLabel(edge) {
        if (!this.editLabelModal || !this.editLabelForm) return;

        this.contextTarget = edge; // Set the context target to the new edge
        document.getElementById('edit-label-input').value = edge.data('label') || '';
        this.editLabelModal.style.display = 'flex';
        document.getElementById('edit-label-input').focus();

        // Temporarily override the form submission to handle this specific edge
        const originalOnSubmit = this.editLabelForm.onsubmit;
        this.editLabelForm.onsubmit = (e) => {
            e.preventDefault();
            const newLabel = document.getElementById('edit-label-input').value.trim();
            edge.data('label', newLabel);
            this.saveGraphState();
            this.showNotification('Edge label updated successfully!', 'success');
            this.closeEditLabelModal();
            this.editLabelForm.onsubmit = originalOnSubmit; // Restore original handler
        };
    }


    /**
     * Shows the modal for adding a new node manually.
     *
     */
    showAddNodeModal() {
        this.hideContextMenu();
        this._cancelConnectionMode(); // Ensure connection mode is off
        
        if (!this.currentVaultId) { // Ensure a vault tab (project) is selected
            this.showNotification('Please select a TraceLink project (a Multi-Vault tab) first to add nodes.', 'warning');
            return;
        }
        if (this.addNodeModal) this.addNodeModal.style.display = 'flex';
        if (document.getElementById('add-node-label')) document.getElementById('add-node-label').value = '';
        if (document.getElementById('add-node-type-select')) document.getElementById('add-node-type-select').value = ''; // Reset type dropdown
        if (document.getElementById('add-node-label')) document.getElementById('add-node-label').focus();
        this.updateAddNodeDynamicFields(); // Clear dynamic fields initially
    }

    /**
     * Closes the add node modal.
     *
     */
    closeAddNodeModal() {
        if (this.addNodeModal) this.addNodeModal.style.display = 'none';
        if (this.addNodeForm) this.addNodeForm.reset();
        if (document.getElementById('add-node-dynamic-fields')) document.getElementById('add-node-dynamic-fields').innerHTML = ''; // Clear dynamic fields
        if (document.getElementById('add-node-custom-metadata-fields')) document.getElementById('add-node-custom-metadata-fields').innerHTML = ''; // Clear custom metadata
        // Ensure "Add Custom Field" button container is hidden when modal closes and no type is selected
        const addCustomMetadataBtnContainer = document.getElementById('add-custom-metadata-btn-container');
        if (addCustomMetadataBtnContainer) {
            addCustomMetadataBtnContainer.style.display = 'none';
        }
    }

    /**
     * Sets up the dynamic entity type dropdown and the "Add Custom Field" button in the add node modal.
     *
     */
    setupAddNodeModalDynamicFields() {
        const typeSelect = document.getElementById('add-node-type-select');
        const addCustomMetadataBtnContainer = document.getElementById('add-custom-metadata-btn-container');

        if (!typeSelect) return; // Exit if element not found

        // Clear existing options, but keep "Select Type" if it exists
        typeSelect.innerHTML = '<option value="">Select Type</option>';

        // Populate type dropdown options dynamically from entityTypeDefinitions
        for (const typeKey in this.entityTypeDefinitions) {
            const definition = this.entityTypeDefinitions[typeKey];
            const option = document.createElement('option');
            option.value = typeKey;
            // Format typeKey to be more readable (e.g., 'wallet_address' -> 'Wallet Address')
            option.textContent = typeKey.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            typeSelect.appendChild(option);
        }

        // Add "Add Custom Field" button for manual nodes if it's not already there
        // This button should *always* be available in the HTML (even if hidden by default CSS)
        // and its event listener set up here.
        if (addCustomMetadataBtnContainer) {
            let existingButton = addCustomMetadataBtnContainer.querySelector('.add-custom-metadata-button');
            if (!existingButton) { // Create only if it doesn't exist
                const addCustomFieldButton = document.createElement('button');
                addCustomFieldButton.type = 'button';
                addCustomFieldButton.className = 'btn-secondary btn-small add-custom-metadata-button';
                addCustomFieldButton.innerHTML = '<i class="fas fa-plus"></i> Add Custom Field';
                addCustomFieldButton.onclick = () => this.addCustomMetadataPair(document.getElementById('add-node-custom-metadata-fields'));
                addCustomMetadataBtnContainer.appendChild(addCustomFieldButton);
            }
        }
    }

    /**
     * Updates the dynamic fields in the node modal based on the selected entity type.
     *
     */
    updateAddNodeDynamicFields() {
        const selectedType = document.getElementById('add-node-type-select').value;
        const dynamicFieldsContainer = document.getElementById('add-node-dynamic-fields');
        const customMetadataContainer = document.getElementById('add-node-custom-metadata-fields');
        const addCustomMetadataBtnContainer = document.getElementById('add-custom-metadata-btn-container');

        if (!dynamicFieldsContainer || !customMetadataContainer || !addCustomMetadataBtnContainer) return;

        dynamicFieldsContainer.innerHTML = ''; // Clear previous fields
        customMetadataContainer.innerHTML = ''; // Clear custom metadata fields
        addCustomMetadataBtnContainer.style.display = 'none';


        if (selectedType && this.entityTypeDefinitions[selectedType]) {
            const fields = this.entityTypeDefinitions[selectedType].fields;
            fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                let inputHtml = '';
                if (field.type === 'select') {
                    inputHtml = `<select id="add-node-field-${field.id}" name="field_${field.id}" ${field.required ? 'required' : ''}>
                                    <option value="">Select ${field.label}</option>
                                    ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                                 </select>`;
                } else if (field.type === 'textarea') {
                     inputHtml = `<textarea id="add-node-field-${field.id}" name="field_${field.id}" rows="3" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}"></textarea>`;
                } else if (field.type === 'checkbox') {
                     inputHtml = `
                        <label class="checkbox-label">
                            <input type="checkbox" id="add-node-field-${field.id}" name="field_${field.id}">
                            ${field.label}
                        </label>
                    `;
                }
                else {
                    inputHtml = `<input type="${field.type}" id="add-node-field-${field.id}" name="field_${field.id}" ${field.required ? 'required' : ''} placeholder="Enter ${field.label.toLowerCase()}">`;
                }

                formGroup.innerHTML = `<label for="add-node-field-${field.id}">${field.label}${field.required ? ' *' : ''}</label>${inputHtml}`;
                dynamicFieldsContainer.appendChild(formGroup);
            });
            addCustomMetadataBtnContainer.style.display = 'block'; // Show custom metadata button
        }
    }

    /**
     * Adds a new key-value pair input for custom metadata in modals.
     * @param {HTMLElement} container - The container element to append the pair to.
     *
     */
    addCustomMetadataPair(container) {
        if (!container) return; // Ensure container exists
        const pairDiv = document.createElement('div');
        pairDiv.className = 'form-row metadata-pair';
        pairDiv.innerHTML = `
            <div class="form-group" style="flex:1;">
                <input type="text" class="metadata-key" placeholder="Key">
            </div>
            <div class="form-group" style="flex:1;">
                <input type="text" class="metadata-value" placeholder="Value">
            </div>
            <button type="button" class="btn-danger-small metadata-remove" onclick="this.closest('.metadata-pair').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(pairDiv);
    }

/**
     * Handles the submission of the add node form, creating a new node on the graph.
     * @param {Event} event - The form submission event.
     *
     */
    handleAddNodeSubmit(event) {
        event.preventDefault();
        const label = document.getElementById('add-node-label').value.trim();
        const selectedType = document.getElementById('add-node-type-select').value;
        const dynamicFieldsContainer = document.getElementById('add-node-dynamic-fields');
        const customMetadataContainer = document.getElementById('add-node-custom-metadata-fields');


        if (!label) {
            this.showNotification('Node label is required.', 'warning');
            return;
        }
        if (!selectedType) {
            this.showNotification('Node type is required.', 'warning');
            return;
        }

        if (!this.cy) { // If for some reason the graph isn't initialized for this project
            this.initCytoscape();
        }

        // Collect dynamic field values
        const dynamicData = {};
        if (this.entityTypeDefinitions[selectedType] && dynamicFieldsContainer) {
            this.entityTypeDefinitions[selectedType].fields.forEach(field => {
                const element = document.getElementById(`add-node-field-${field.id}`);
                if (element) {
                    if (field.type === 'checkbox') {
                        dynamicData[field.id] = element.checked;
                    } else {
                        dynamicData[field.id] = element.value.trim();
                    }
                }
            });
        }

        // Collect custom metadata fields
        const customMetadata = {};
        if (customMetadataContainer) {
            customMetadataContainer.querySelectorAll('.metadata-pair').forEach(pair => {
                const keyInput = pair.querySelector('.metadata-key');
                const valueInput = pair.querySelector('.metadata-value');
                if (keyInput && valueInput && keyInput.value.trim()) {
                    customMetadata[keyInput.value.trim()] = valueInput.value.trim();
                }
            });
        }

        // Determine position for new node relative to current view
        // If the context click was on the canvas, use that position, otherwise default to center.
        let positionX, positionY;
        if (this.contextTarget && this.contextTarget === this.cy && this.contextTarget.pointerData) {
            // Using pointerData for canvas click context
            positionX = (this.contextTarget.pointerData.current.x - this.cy.pan().x) / this.cy.zoom();
            positionY = (this.contextTarget.pointerData.current.y - this.cy.pan().y) / this.cy.zoom();
        } else {
            // Default to center of the current view
            positionX = (this.cy.width() / 2 - this.cy.pan().x) / this.cy.zoom();
            positionY = (this.cy.height() / 2 - this.cy.pan().y) / this.cy.zoom();
        }


        const colors = this.getEntityColor(selectedType);
        const faUnicode = this.getEntityTypeIcon(selectedType);
        const iconDataUrl = this._generateIconDataURL(faUnicode, 'Font Awesome 5 Free', '900', 28, 'white'); // Icon color is white


        this.cy.add({
            group: 'nodes',
            data: {
                id: `manual-${Date.now()}`, // Ensure unique ID for manual nodes
                label: label,
                entityType: selectedType,
                isManual: true,
                dynamicData: dynamicData, // Store dynamic fields
                customMetadata: customMetadata, // Store custom fields
                backgroundColor: colors.bg,
                borderColor: colors.border,
                shadowColor: colors.shadow,
                iconDataUrl: iconDataUrl // Add icon Data URL to node data
            },
            position: { x: positionX, y: positionY }
        });
        this.saveGraphState();
        this.showNotification('Node added successfully!', 'success');
        this.closeAddNodeModal();
    }

    /**
     * Shows the modal for editing an edge label.
     *
     */
    showEditLabelModalForContextTarget() {
        this.hideContextMenu();
        if (this.contextTarget && this.contextTarget.isEdge()) {
            if (this.editLabelModal) this.editLabelModal.style.display = 'flex';
            if (document.getElementById('edit-label-input')) {
                document.getElementById('edit-label-input').value = this.contextTarget.data('label') || '';
                document.getElementById('edit-label-input').focus();
            }
        } else {
            this.showNotification('No edge selected for editing label.', 'warning');
        }
    }

    /**
     * Closes the edit label modal.
     *
     */
    closeEditLabelModal() {
        if (this.editLabelModal) this.editLabelModal.style.display = 'none';
        if (this.editLabelForm) this.editLabelForm.reset();
    }

    /**
     * Handles the submission of the edit label form, updating the edge label.
     * @param {Event} event - The form submission event.
     *
     */
    handleEditLabelSubmit(event) {
        event.preventDefault();
        const newLabel = document.getElementById('edit-label-input').value.trim();

        if (this.contextTarget && this.contextTarget.isEdge()) {
            this.contextTarget.data('label', newLabel);
            this.saveGraphState();
            this.showNotification('Edge label updated successfully!', 'success');
        }
        this.closeEditLabelModal();
    }

    /**
     * Handles deletion of a node or edge via the context menu.
     *
     */
    handleContextDelete() {
        this.hideContextMenu();
        if (!this.contextTarget) return;

        if (this.contextTarget.isNode()) {
            const nodeLabel = this.contextTarget.data('label');
            this.showConfirmDeleteModal(
                `Delete Node`,
                `Are you sure you want to delete node "${nodeLabel}" and its connected edges? This action cannot be undone.`,
                () => {
                    this.contextTarget.remove();
                    this.saveGraphState();
                    this.showNotification('Node and its edges deleted.', 'success');
                }
            );
        } else if (this.contextTarget.isEdge()) {
            const edgeLabel = this.contextTarget.data('label') || 'unlabeled edge';
            this.showConfirmDeleteModal(
                `Delete Edge`,
                `Are you sure you want to delete this edge (${edgeLabel})? This action cannot be undone.`,
                () => {
                    this.contextTarget.remove();
                    this.saveGraphState();
                    this.showNotification('Edge deleted.', 'success');
                }
            );
        }
    }

    /**
     * Saves the current state of the graph (elements and layout) to localStorage.
     *
     */
    saveGraphState() {
        if (!this.cy || !this.currentVaultId || !this.tracelinkProjects[this.currentVaultId]) {
            // Cannot save if no graph, no current project, or project was deleted
            return;
        }

        // Get elements, including their current positions if they've been moved
        const elements = this.cy.json().elements;
        const currentZoom = this.cy.zoom();
        const currentPan = this.cy.pan();

        this.tracelinkProjects[this.currentVaultId] = {
            name: this.tracelinkProjects[this.currentVaultId]?.name || window.multiVaultManager.getVaultById(this.currentVaultId)?.name || 'Unnamed Project', // Ensure name is preserved
            elements: elements,
            layout: { // Store current view state
                zoom: currentZoom,
                pan: currentPan
            }
        };
        this.saveTraceLinkProjects();
    }

    // --- TraceLink Specific Notification System ---
    /**
     * Displays a TraceLink-specific notification message.
     * @param {string} message - The message to display.
     * @param {string} type - The type of notification ('info', 'success', 'warning', 'error').
     * @param {number} duration - How long the notification should be displayed in milliseconds.
     *
     */
    showNotification(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notificationContainer'); // Use the global container
        if (!container) {
            console.warn('Notification container not found for TraceLink notifications.');
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`; // Apply type class for styling
        
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

        // Add to container and trigger slide-in animation
        container.appendChild(notification);
        // Use a small timeout to allow CSS transition to take effect
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-remove after duration
        const autoRemoveTimeout = setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show'); // Trigger slide-out
                notification.classList.add('slide-out');
                notification.addEventListener('transitionend', function handler() {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                    notification.removeEventListener('transitionend', handler);
                });
            }
        }, duration);

        // Manual close button listener
        notification.querySelector('.notification-close').onclick = () => {
            clearTimeout(autoRemoveTimeout); // Prevent auto-removal if manually closed
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

    // --- TraceLink Specific Confirmation Modal ---
    /**
     * Shows a customized confirmation modal for TraceLink-specific deletions.
     * @param {string} title - The title of the confirmation modal.
     * @param {string} message - The message to display in the modal body.
     * @param {Function} confirmCallback - The function to execute if the user confirms.
     *
     */
    showConfirmDeleteModal(title, message, confirmCallback) {
        if (!this.tracelinkConfirmDeleteModal) {
            console.error('TraceLink delete confirmation modal not found.');
            // Fallback to native confirm if modal element is missing
            if (confirm(message)) {
                confirmCallback();
            }
            return;
        }

        document.getElementById('tracelink-confirm-delete-title').textContent = title;
        document.getElementById('tracelink-confirm-delete-message').textContent = message;
        this.tracelinkConfirmDeleteCallback = confirmCallback; // Store the callback

        this.tracelinkConfirmDeleteModal.style.display = 'flex';
    }

    /**
     * Closes the TraceLink specific confirmation modal.
     *
     */
    closeConfirmDeleteModal() {
        if (this.tracelinkConfirmDeleteModal) {
            this.tracelinkConfirmDeleteModal.style.display = 'none';
            this.tracelinkConfirmDeleteCallback = null; // Clear callback
        }
    }
}

// Global initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // We defer TraceLinkManager instantiation and init.
    // It will be instantiated *only* when showSection('tracelink') is called
    // for the first time, ensuring its HTML is in the DOM.
    // The `init()` method will then be called on that instance.
    // So, we do NOT `window.traceLinkManager = new TraceLinkManager();` here.
});

// Listener for multiVaultManagerReady event
document.addEventListener('multiVaultManagerReady', () => {
    // Check if Cytoscape.js is loaded before initializing TraceLinkManager
    if (typeof cytoscape === 'undefined') {
        console.error("Cytoscape.js is not loaded. TraceLink feature will not work.");
        return;
    }
    if (!window.traceLinkManager) {
        window.traceLinkManager = new TraceLinkManager();
    }
    // Only call init if the tracelink section is currently active
    const tracelinkSection = document.getElementById('tracelink');
    if (tracelinkSection && tracelinkSection.classList.contains('active')) {
        window.traceLinkManager.init();
    }
});