// Dork Assistant - Advanced Query Builder for Multiple Search Engines
class DorkAssistant {
    constructor() {
        this.currentEngine = 'google';
        this.templates = this.loadTemplates();
        this.savedQueries = this.loadSavedQueries();
        this.searchEngines = {
            google: {
                name: 'Google',
                url: 'https://www.google.com/search?q=',
                operators: {
                    'Site Search': { operator: 'site:', placeholder: 'example.com' },
                    'File Type': { operator: 'filetype:', placeholder: 'pdf' },
                    'In Title': { operator: 'intitle:', placeholder: 'admin login' },
                    'In URL': { operator: 'inurl:', placeholder: 'admin' },
                    'In Text': { operator: 'intext:', placeholder: 'password' },
                    'Cache': { operator: 'cache:', placeholder: 'example.com' },
                    'Related': { operator: 'related:', placeholder: 'example.com' },
                    'Exact Phrase': { operator: '"', placeholder: 'exact phrase', suffix: '"' }
                }
            },
            bing: {
                name: 'Bing',
                url: 'https://www.bing.com/search?q=',
                operators: {
                    'Site Search': { operator: 'site:', placeholder: 'example.com' },
                    'File Type': { operator: 'filetype:', placeholder: 'pdf' },
                    'In Title': { operator: 'intitle:', placeholder: 'admin login' },
                    'In URL': { operator: 'inurl:', placeholder: 'admin' },
                    'In Text': { operator: 'intext:', placeholder: 'password' },
                    'Contains': { operator: 'contains:', placeholder: 'login' },
                    'IP Address': { operator: 'ip:', placeholder: '192.168.1.1' }
                }
            },
            shodan: {
                name: 'Shodan',
                url: 'https://www.shodan.io/search?query=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '22' },
                    'Country': { operator: 'country:', placeholder: 'US' },
                    'City': { operator: 'city:', placeholder: 'New York' },
                    'Organization': { operator: 'org:', placeholder: 'Google' },
                    'Hostname': { operator: 'hostname:', placeholder: 'example.com' },
                    'Product': { operator: 'product:', placeholder: 'Apache' },
                    'Version': { operator: 'version:', placeholder: '2.4' },
                    'Operating System': { operator: 'os:', placeholder: 'Windows' },
                    'Net': { operator: 'net:', placeholder: '192.168.1.0/24' },
                    'Before Date': { operator: 'before:', placeholder: '01/01/2023' },
                    'After Date': { operator: 'after:', placeholder: '01/01/2023' }
                }
            },
            censys: {
                name: 'Censys',
                url: 'https://search.censys.io/search?resource=hosts&q=',
                operators: {
                    'Services Port': { operator: 'services.port:', placeholder: '80' },
                    'Services Service': { operator: 'services.service_name:', placeholder: 'HTTP' },
                    'Location Country': { operator: 'location.country:', placeholder: 'United States' },
                    'Location City': { operator: 'location.city:', placeholder: 'New York' },
                    'Autonomous System': { operator: 'autonomous_system.name:', placeholder: 'Google' },
                    'DNS Names': { operator: 'dns.names:', placeholder: 'example.com' },
                    'Operating System': { operator: 'operating_system.product:', placeholder: 'Linux' },
                    'TLS Certificate': { operator: 'services.tls.certificates.leaf_data.subject.common_name:', placeholder: 'example.com' }
                }
            },
            zoomeye: {
                name: 'ZoomEye',
                url: 'https://www.zoomeye.org/searchResult?q=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '80' },
                    'Service': { operator: 'service:', placeholder: 'http' },
                    'Country': { operator: 'country:', placeholder: 'US' },
                    'City': { operator: 'city:', placeholder: 'New York' },
                    'Organization': { operator: 'org:', placeholder: 'Google' },
                    'Hostname': { operator: 'hostname:', placeholder: 'example.com' },
                    'Device': { operator: 'device:', placeholder: 'router' },
                    'Operating System': { operator: 'os:', placeholder: 'Linux' }
                }
            },
            fofa: {
                name: 'FOFA',
                url: 'https://fofa.so/result?qbase64=',
                operators: {
                    'Port': { operator: 'port=', placeholder: '80' },
                    'Protocol': { operator: 'protocol=', placeholder: 'http' },
                    'Country': { operator: 'country=', placeholder: 'US' },
                    'Region': { operator: 'region=', placeholder: 'California' },
                    'City': { operator: 'city=', placeholder: 'San Francisco' },
                    'Organization': { operator: 'org=', placeholder: 'Google' },
                    'Domain': { operator: 'domain=', placeholder: 'example.com' },
                    'Host': { operator: 'host=', placeholder: 'example.com' },
                    'Title': { operator: 'title=', placeholder: 'Admin Panel' },
                    'Body': { operator: 'body=', placeholder: 'login' }
                }
            },
            github: {
                name: 'GitHub',
                url: 'https://github.com/search?q=',
                operators: {
                    'In File': { operator: 'in:file', placeholder: 'password' },
                    'In Path': { operator: 'in:path', placeholder: 'config' },
                    'Filename': { operator: 'filename:', placeholder: '.env' },
                    'Extension': { operator: 'extension:', placeholder: 'sql' },
                    'Language': { operator: 'language:', placeholder: 'python' },
                    'User': { operator: 'user:', placeholder: 'username' },
                    'Organization': { operator: 'org:', placeholder: 'organization' },
                    'Repository': { operator: 'repo:', placeholder: 'user/repo' },
                    'Size': { operator: 'size:', placeholder: '>1000' },
                    'Created': { operator: 'created:', placeholder: '2023-01-01' }
                }
            },
            pastebin: {
                name: 'Pastebin',
                url: 'https://www.google.com/search?q=site:pastebin.com+',
                operators: {
                    'Email': { operator: '', placeholder: 'email@domain.com' },
                    'Password': { operator: '', placeholder: 'password' },
                    'API Key': { operator: '', placeholder: 'api_key' },
                    'Database': { operator: '', placeholder: 'database dump' },
                    'Configuration': { operator: '', placeholder: 'config.php' }
                }
            }
        };
        
        this.initializeTemplates();
        this.initializeDorkAssistant();
    }

    initializeDorkAssistant() {
        this.updateQuerySyntax();
        this.renderTemplates();
        this.renderSavedQueries();
    }

    // Initialize default templates
    initializeTemplates() {
        if (this.templates.length === 0) {
            this.templates = [
                {
                    id: 1,
                    name: 'Database Files',
                    description: 'Find exposed database files and backups',
                    query: 'filetype:sql OR filetype:db OR filetype:mdb',
                    category: 'databases',
                    engines: ['google', 'bing'],
                    tags: ['database', 'sql', 'backup', 'exposed']
                },
                {
                    id: 2,
                    name: 'Admin Login Pages',
                    description: 'Discover admin and login interfaces',
                    query: 'intitle:"admin login" OR intitle:"administrator login"',
                    category: 'login',
                    engines: ['google', 'bing'],
                    tags: ['admin', 'login', 'interface', 'panel']
                },
                {
                    id: 3,
                    name: 'Exposed MongoDB',
                    description: 'Find exposed MongoDB instances',
                    query: 'port:27017 product:MongoDB',
                    category: 'databases',
                    engines: ['shodan'],
                    tags: ['mongodb', 'database', 'exposed', 'nosql']
                },
                {
                    id: 4,
                    name: 'SSH Servers',
                    description: 'Find SSH servers with weak authentication',
                    query: 'port:22 "SSH-2.0"',
                    category: 'vulnerabilities',
                    engines: ['shodan', 'censys'],
                    tags: ['ssh', 'authentication', 'remote', 'access']
                },
                {
                    id: 5,
                    name: 'Cloud Storage Buckets',
                    description: 'Find exposed cloud storage buckets',
                    query: 'site:s3.amazonaws.com OR site:storage.googleapis.com',
                    category: 'cloud',
                    engines: ['google'],
                    tags: ['cloud', 'storage', 'aws', 'gcp', 'bucket']
                },
                {
                    id: 6,
                    name: 'IoT Cameras',
                    description: 'Find exposed IP cameras and webcams',
                    query: 'port:554 product:"IP Camera"',
                    category: 'iot',
                    engines: ['shodan'],
                    tags: ['iot', 'camera', 'webcam', 'surveillance']
                },
                {
                    id: 7,
                    name: 'Configuration Files',
                    description: 'Find exposed configuration files',
                    query: 'filename:config.php OR filename:.env OR filename:wp-config.php',
                    category: 'files',
                    engines: ['github'],
                    tags: ['config', 'environment', 'credentials', 'php']
                },
                {
                    id: 8,
                    name: 'Government Emails',
                    description: 'Find government email addresses',
                    query: 'site:gov filetype:pdf email',
                    category: 'government',
                    engines: ['google'],
                    tags: ['government', 'email', 'contact', 'official']
                }
            ];
            this.saveTemplates();
        }
    }

    // Show/Hide Dork tabs
    showDorkTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.dork-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.dork-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');

        // Refresh content based on tab
        if (tabName === 'templates') {
            this.renderTemplates();
        } else if (tabName === 'saved-queries') {
            this.renderSavedQueries();
        }
    }

    // Update query syntax based on selected engine
    updateQuerySyntax() {
        const engine = document.getElementById('search-engine').value;
        this.currentEngine = engine;
        
        const operatorsGrid = document.getElementById('operators-grid');
        const operators = this.searchEngines[engine].operators;
        
        operatorsGrid.innerHTML = '';
        
        // Group operators by category
        const categories = {
            'Basic Search': ['Site Search', 'File Type', 'Exact Phrase'],
            'Content Search': ['In Title', 'In URL', 'In Text', 'Body', 'Title'],
            'Technical': ['Port', 'Service', 'Product', 'Version', 'Protocol'],
            'Location': ['Country', 'City', 'Region', 'Organization'],
            'Network': ['IP Address', 'Net', 'Hostname', 'Domain', 'Host'],
            'System': ['Operating System', 'Device'],
            'Time': ['Before Date', 'After Date', 'Created'],
            'Code Search': ['In File', 'In Path', 'Filename', 'Extension', 'Language', 'User', 'Repository'],
            'Other': ['Cache', 'Related', 'Contains', 'Size', 'Autonomous System', 'DNS Names', 'TLS Certificate']
        };
        
        for (const [category, operatorNames] of Object.entries(categories)) {
            const availableOps = operatorNames.filter(name => operators[name]);
            if (availableOps.length === 0) continue;
            
            const groupDiv = document.createElement('div');
            groupDiv.className = 'operator-group';
            groupDiv.innerHTML = `<h5>${category}</h5>`;
            
            availableOps.forEach(opName => {
                const op = operators[opName];
                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'operator-field';
                fieldDiv.innerHTML = `
                    <label>${opName}:</label>
                    <input type="text" 
                           placeholder="${op.placeholder}" 
                           data-operator="${op.operator}"
                           data-suffix="${op.suffix || ''}"
                           onchange="dorkAssistant.buildQuery()">
                `;
                groupDiv.appendChild(fieldDiv);
            });
            
            operatorsGrid.appendChild(groupDiv);
        }
        
        this.buildQuery();
    }

    // Build query from form inputs
    buildQuery() {
        const basicTerms = document.getElementById('basic-terms').value.trim();
        const operatorInputs = document.querySelectorAll('.operator-field input');
        
        let queryParts = [];
        
        // Add basic terms
        if (basicTerms) {
            queryParts.push(basicTerms);
        }
        
        // Add operator-based terms
        operatorInputs.forEach(input => {
            const value = input.value.trim();
            if (value) {
                const operator = input.dataset.operator;
                const suffix = input.dataset.suffix || '';
                queryParts.push(`${operator}${value}${suffix}`);
            }
        });
        
        const query = queryParts.join(' ');
        document.getElementById('generated-query').value = query;
        
        // Update conversions
        this.updateConversions(query);
    }

    // Update query conversions for other engines
    updateConversions(query) {
        const conversionsDiv = document.getElementById('conversion-results');
        conversionsDiv.innerHTML = '';
        
        if (!query.trim()) return;
        
        Object.entries(this.searchEngines).forEach(([engineKey, engine]) => {
            if (engineKey === this.currentEngine) return;
            
            const convertedQuery = this.convertQuery(query, this.currentEngine, engineKey);
            
            const conversionDiv = document.createElement('div');
            conversionDiv.className = 'conversion-item';
            conversionDiv.innerHTML = `
                <h6>${engine.name}</h6>
                <code>${convertedQuery}</code>
            `;
            conversionsDiv.appendChild(conversionDiv);
        });
    }

    // Convert query between different search engines
    convertQuery(query, fromEngine, toEngine) {
        // Basic conversion logic - this can be enhanced
        let convertedQuery = query;
        
        // Google/Bing to Shodan conversions
        if ((fromEngine === 'google' || fromEngine === 'bing') && toEngine === 'shodan') {
            convertedQuery = convertedQuery
                .replace(/site:([^\s]+)/g, 'hostname:$1')
                .replace(/filetype:([^\s]+)/g, 'product:$1')
                .replace(/intitle:"([^"]+)"/g, 'title:"$1"');
        }
        
        // Shodan to Google/Bing conversions
        if (fromEngine === 'shodan' && (toEngine === 'google' || toEngine === 'bing')) {
            convertedQuery = convertedQuery
                .replace(/hostname:([^\s]+)/g, 'site:$1')
                .replace(/port:(\d+)/g, 'inurl:$1')
                .replace(/product:([^\s]+)/g, 'filetype:$1');
        }
        
        // Censys conversions
        if (toEngine === 'censys') {
            convertedQuery = convertedQuery
                .replace(/port:(\d+)/g, 'services.port:$1')
                .replace(/hostname:([^\s]+)/g, 'dns.names:$1')
                .replace(/country:([^\s]+)/g, 'location.country:"$1"');
        }
        
        // GitHub conversions
        if (toEngine === 'github') {
            convertedQuery = convertedQuery
                .replace(/filetype:([^\s]+)/g, 'extension:$1')
                .replace(/site:([^\s]+)/g, 'user:$1')
                .replace(/intitle:"([^"]+)"/g, 'in:file "$1"');
        }
        
        return convertedQuery || 'Query conversion not available';
    }

    // Copy query to clipboard
    copyQuery() {
        const query = document.getElementById('generated-query').value;
        if (!query.trim()) {
            this.showNotification('No query to copy', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(query).then(() => {
            this.showNotification('Query copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy query', 'error');
        });
    }

    // Test query by opening in search engine
    testQuery() {
        const query = document.getElementById('generated-query').value;
        if (!query.trim()) {
            this.showNotification('No query to test', 'warning');
            return;
        }
        
        const engine = this.searchEngines[this.currentEngine];
        let url = engine.url + encodeURIComponent(query);
        
        // Special handling for FOFA (base64 encoding)
        if (this.currentEngine === 'fofa') {
            url = engine.url + btoa(query);
        }
        
        window.open(url, '_blank');
    }

    // Save current query
    saveQuery() {
        const query = document.getElementById('generated-query').value;
        if (!query.trim()) {
            this.showNotification('No query to save', 'warning');
            return;
        }
        
        // Store current query for modal
        this.currentQueryToSave = {
            query: query,
            engine: this.currentEngine
        };
        
        document.getElementById('save-query-modal').style.display = 'block';
    }

    // Confirm save query
    confirmSaveQuery() {
        const name = document.getElementById('query-name').value.trim();
        const description = document.getElementById('query-description').value.trim();
        const tags = document.getElementById('query-tags').value.trim();
        
        if (!name) {
            this.showNotification('Please enter a query name', 'warning');
            return;
        }
        
        const savedQuery = {
            id: Date.now(),
            name: name,
            description: description,
            query: this.currentQueryToSave.query,
            engine: this.currentQueryToSave.engine,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            createdAt: new Date().toISOString()
        };
        
        this.savedQueries.push(savedQuery);
        this.saveSavedQueries();
        this.renderSavedQueries();
        this.closeSaveQueryModal();
        this.showNotification('Query saved successfully!', 'success');
    }

    // Close save query modal
    closeSaveQueryModal() {
        document.getElementById('save-query-modal').style.display = 'none';
        document.getElementById('save-query-form').reset();
    }

    // Render templates
    renderTemplates() {
        const templatesGrid = document.getElementById('templates-grid');
        const categoryFilter = document.getElementById('template-category').value;
        const engineFilter = document.getElementById('template-engine').value;
        
        let filteredTemplates = this.templates;
        
        if (categoryFilter !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.category === categoryFilter);
        }
        
        if (engineFilter !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.engines.includes(engineFilter));
        }
        
        templatesGrid.innerHTML = '';
        
        filteredTemplates.forEach(template => {
            const templateCard = document.createElement('div');
            templateCard.className = 'template-card';
            templateCard.innerHTML = `
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <div class="template-query">
                    <code>${template.query}</code>
                </div>
                <div class="template-meta">
                    <span class="template-category">${template.category}</span>
                    <div class="template-engines">
                        ${template.engines.map(engine => 
                            `<span class="engine-tag">${engine}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="template-tags">
                    ${template.tags.map(tag => 
                        `<span class="template-tag">${tag}</span>`
                    ).join('')}
                </div>
                <div class="template-actions">
                    <button onclick="dorkAssistant.useTemplate(${template.id})" class="btn-primary">
                        Use Template
                    </button>
                    <button onclick="dorkAssistant.editTemplate(${template.id})" class="btn-secondary">
                        Edit
                    </button>
                    <button onclick="dorkAssistant.deleteTemplate(${template.id})" class="btn-danger">
                        Delete
                    </button>
                </div>
            `;
            templatesGrid.appendChild(templateCard);
        });
        
        if (filteredTemplates.length === 0) {
            templatesGrid.innerHTML = '<p>No templates found matching the selected filters.</p>';
        }
    }

    // Use template
    useTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        // Switch to query builder tab
        this.showDorkTab('query-builder');
        
        // Set the query
        document.getElementById('generated-query').value = template.query;
        
        // Try to set compatible engine
        if (template.engines.includes(this.currentEngine)) {
            // Current engine is compatible
        } else {
            // Switch to first compatible engine
            document.getElementById('search-engine').value = template.engines[0];
            this.updateQuerySyntax();
        }
        
        this.showNotification(`Template "${template.name}" loaded!`, 'success');
    }

    // Filter templates
    filterTemplates() {
        this.renderTemplates();
    }

    // Show add template modal
    showAddTemplateModal() {
        document.getElementById('add-template-modal').style.display = 'block';
    }

    // Close add template modal
    closeAddTemplateModal() {
        document.getElementById('add-template-modal').style.display = 'none';
        document.getElementById('add-template-form').reset();
    }

    // Save new template
    saveTemplate() {
        const name = document.getElementById('template-name').value.trim();
        const description = document.getElementById('template-description').value.trim();
        const query = document.getElementById('template-query').value.trim();
        const category = document.getElementById('template-cat').value;
        const tags = document.getElementById('template-tags').value.trim();
        
        if (!name || !query) {
            this.showNotification('Please fill in required fields', 'warning');
            return;
        }
        
        // Get selected engines
        const engineCheckboxes = document.querySelectorAll('#add-template-modal input[type="checkbox"]:checked');
        const engines = Array.from(engineCheckboxes).map(cb => cb.value);
        
        if (engines.length === 0) {
            this.showNotification('Please select at least one search engine', 'warning');
            return;
        }
        
        const template = {
            id: Date.now(),
            name: name,
            description: description,
            query: query,
            category: category,
            engines: engines,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        this.templates.push(template);
        this.saveTemplates();
        this.renderTemplates();
        this.closeAddTemplateModal();
        this.showNotification('Template saved successfully!', 'success');
    }

    // Delete template
    deleteTemplate(templateId) {
        if (!confirm('Are you sure you want to delete this template?')) return;
        
        this.templates = this.templates.filter(t => t.id !== templateId);
        this.saveTemplates();
        this.renderTemplates();
        this.showNotification('Template deleted successfully!', 'success');
    }

    // Render saved queries
    renderSavedQueries() {
        const savedQueriesList = document.getElementById('saved-queries-list');
        const searchTerm = document.getElementById('search-saved-queries').value.toLowerCase();
        const engineFilter = document.getElementById('saved-queries-engine').value;
        
        let filteredQueries = this.savedQueries;
        
        if (searchTerm) {
            filteredQueries = filteredQueries.filter(q => 
                q.name.toLowerCase().includes(searchTerm) ||
                q.description.toLowerCase().includes(searchTerm) ||
                q.query.toLowerCase().includes(searchTerm)
            );
        }
        
        if (engineFilter !== 'all') {
            filteredQueries = filteredQueries.filter(q => q.engine === engineFilter);
        }
        
        savedQueriesList.innerHTML = '';
        
        filteredQueries.forEach(query => {
            const queryItem = document.createElement('div');
            queryItem.className = 'saved-query-item';
            queryItem.innerHTML = `
                <div class="saved-query-header">
                    <div class="saved-query-info">
                        <h4>${query.name}</h4>
                        <p>${query.description || 'No description'}</p>
                    </div>
                    <div class="saved-query-meta">
                        <div>Engine: ${this.searchEngines[query.engine].name}</div>
                        <div>Created: ${new Date(query.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="saved-query-content">
                    <code>${query.query}</code>
                </div>
                <div class="saved-query-footer">
                    <div class="saved-query-tags">
                        ${query.tags.map(tag => 
                            `<span class="saved-query-tag">${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="saved-query-actions">
                        <button onclick="dorkAssistant.loadSavedQuery(${query.id})" class="btn-primary">
                            Load
                        </button>
                        <button onclick="dorkAssistant.copySavedQuery(${query.id})" class="btn-secondary">
                            Copy
                        </button>
                        <button onclick="dorkAssistant.testSavedQuery(${query.id})" class="btn-success">
                            Test
                        </button>
                        <button onclick="dorkAssistant.deleteSavedQuery(${query.id})" class="btn-danger">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            savedQueriesList.appendChild(queryItem);
        });
        
        if (filteredQueries.length === 0) {
            savedQueriesList.innerHTML = '<p>No saved queries found.</p>';
        }
    }

    // Load saved query
    loadSavedQuery(queryId) {
        const query = this.savedQueries.find(q => q.id === queryId);
        if (!query) return;
        
        // Switch to query builder tab
        this.showDorkTab('query-builder');
        
        // Set engine and query
        document.getElementById('search-engine').value = query.engine;
        this.updateQuerySyntax();
        document.getElementById('generated-query').value = query.query;
        
        this.showNotification(`Query "${query.name}" loaded!`, 'success');
    }

    // Copy saved query
    copySavedQuery(queryId) {
        const query = this.savedQueries.find(q => q.id === queryId);
        if (!query) return;
        
        navigator.clipboard.writeText(query.query).then(() => {
            this.showNotification('Query copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy query', 'error');
        });
    }

    // Test saved query
    testSavedQuery(queryId) {
        const query = this.savedQueries.find(q => q.id === queryId);
        if (!query) return;
        
        const engine = this.searchEngines[query.engine];
        let url = engine.url + encodeURIComponent(query.query);
        
        if (query.engine === 'fofa') {
            url = engine.url + btoa(query.query);
        }
        
        window.open(url, '_blank');
    }

    // Delete saved query
    deleteSavedQuery(queryId) {
        if (!confirm('Are you sure you want to delete this saved query?')) return;
        
        this.savedQueries = this.savedQueries.filter(q => q.id !== queryId);
        this.saveSavedQueries();
        this.renderSavedQueries();
        this.showNotification('Saved query deleted successfully!', 'success');
    }

    // Filter saved queries
    filterSavedQueries() {
        this.renderSavedQueries();
    }

    // Storage methods
    loadTemplates() {
        const stored = localStorage.getItem('dork-templates');
        return stored ? JSON.parse(stored) : [];
    }

    saveTemplates() {
        localStorage.setItem('dork-templates', JSON.stringify(this.templates));
    }

    loadSavedQueries() {
        const stored = localStorage.getItem('dork-saved-queries');
        return stored ? JSON.parse(stored) : [];
    }

    saveSavedQueries() {
        localStorage.setItem('dork-saved-queries', JSON.stringify(this.savedQueries));
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
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
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function showDorkTab(tabName) {
    if (window.dorkAssistant) {
        window.dorkAssistant.showDorkTab(tabName);
    }
}

function updateQuerySyntax() {
    if (window.dorkAssistant) {
        window.dorkAssistant.updateQuerySyntax();
    }
}

function buildQuery() {
    if (window.dorkAssistant) {
        window.dorkAssistant.buildQuery();
    }
}

function copyQuery() {
    if (window.dorkAssistant) {
        window.dorkAssistant.copyQuery();
    }
}

function testQuery() {
    if (window.dorkAssistant) {
        window.dorkAssistant.testQuery();
    }
}

function saveQuery() {
    if (window.dorkAssistant) {
        window.dorkAssistant.saveQuery();
    }
}

function confirmSaveQuery() {
    if (window.dorkAssistant) {
        window.dorkAssistant.confirmSaveQuery();
    }
}

function closeSaveQueryModal() {
    if (window.dorkAssistant) {
        window.dorkAssistant.closeSaveQueryModal();
    }
}

function filterTemplates() {
    if (window.dorkAssistant) {
        window.dorkAssistant.filterTemplates();
    }
}

function showAddTemplateModal() {
    if (window.dorkAssistant) {
        window.dorkAssistant.showAddTemplateModal();
    }
}

function closeAddTemplateModal() {
    if (window.dorkAssistant) {
        window.dorkAssistant.closeAddTemplateModal();
    }
}

function saveTemplate() {
    if (window.dorkAssistant) {
        window.dorkAssistant.saveTemplate();
    }
}

function filterSavedQueries() {
    if (window.dorkAssistant) {
        window.dorkAssistant.filterSavedQueries();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dorkAssistant = new DorkAssistant();
});