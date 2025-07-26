// dork-analyzer.js
class DorkAnalyzer {
    constructor() {
        this.extractedEntities = {
            urls: [],
            ipAddresses: [],
            emailAddresses: [],
            credentials: [],
            sensitiveFilePaths: [],
            customEntities: {}
        };
        this.customRegexPatterns = this.loadCustomRegexPatterns();
        this.selectedEntity = null;
        this.selectedEntityType = null;

        this.osintTools = {
            'VirusTotal (Domain/IP/URL)': { url: 'https://www.virustotal.com/gui/search/', types: ['url', 'ipAddress', 'domain'] },
            'AbuseIPDB (IP)': { url: 'https://www.abuseipdb.com/check/', types: ['ipAddress'] },
            'WHOIS (Domain/IP)': { url: 'https://who.is/whois/', types: ['domain', 'ipAddress'] },
            'crt.sh (Domain)': { url: 'https://crt.sh/?q=', types: ['domain'] },
            'HaveIBeenPwned? (Email)': { url: 'https://haveibeenpwned.com/unified/', types: ['emailAddress'] },
            'DNSDumpster (Domain)': { url: 'https://dnsdumpster.com/', types: ['domain'] },
            'Wayback Machine (URL/Domain)': { url: 'https://web.archive.org/web/*/', types: ['url', 'domain'] },
            'Exploit-DB (CVE/Keyword)': { url: 'https://www.exploit-db.com/search?q=', types: ['credential', 'sensitiveFilePath', 'other'] }, // Broad category for general keywords
            'Shodan (IP/Domain/Keyword)': { url: 'https://www.shodan.io/search?query=', types: ['ipAddress', 'domain', 'other'] },
            'Censys (IP/Domain/Keyword)': { url: 'https://search.censys.io/search?resource=hosts&q=', types: ['ipAddress', 'domain', 'other'] },
            'URLScan.io (URL/Domain)': { url: 'https://urlscan.io/search/#', types: ['url', 'domain'] },
            'Hunter.io (Domain/Email)': { url: 'https://hunter.io/search/', types: ['domain', 'emailAddress'] },
            'Google Dorks (Any)': { url: 'https://www.google.com/search?q=', types: ['url', 'ipAddress', 'emailAddress', 'credential', 'sensitiveFilePath', 'domain', 'other'] },
            'Bing Dorks (Any)': { url: 'https://www.bing.com/search?q=', types: ['url', 'ipAddress', 'emailAddress', 'credential', 'sensitiveFilePath', 'domain', 'other'] }
        };

        this.initializeEventListeners();
        this.renderCustomRegexPatterns();
        this.renderCrossReferencingSection();
    }

    initializeEventListeners() {
        document.getElementById('analyzer-data-input').addEventListener('input', () => this.analyzeData());
        document.getElementById('analyzer-file-upload').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('analyzer-paste-clipboard').addEventListener('click', () => this.pasteFromClipboard());

        document.getElementById('add-regex-btn').addEventListener('click', () => this.showAddRegexModal());
        document.getElementById('save-regex-btn').addEventListener('click', (e) => this.saveCustomRegex(e));
        document.getElementById('close-regex-modal').addEventListener('click', () => this.closeAddRegexModal());

        document.getElementById('clear-analyzer-data').addEventListener('click', () => this.clearAnalyzer());
    }

    clearAnalyzer() {
        document.getElementById('analyzer-data-input').value = '';
        this.extractedEntities = {
            urls: [],
            ipAddresses: [],
            emailAddresses: [],
            credentials: [],
            sensitiveFilePaths: [],
            customEntities: {}
        };
        this.selectedEntity = null;
        this.selectedEntityType = null;
        this.renderExtractedEntities();
        this.renderCrossReferencingSection();
        if (window.dorkAssistant) {
            window.dorkAssistant.showNotification('Analyzer cleared!', 'info');
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('analyzer-data-input').value = text;
            this.analyzeData();
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Pasted from clipboard!', 'success');
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Failed to paste from clipboard. Ensure clipboard permissions are granted.', 'error');
            }
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('analyzer-data-input').value = e.target.result;
            this.analyzeData();
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification(`File "${file.name}" loaded and analyzed!`, 'success');
            }
        };
        reader.onerror = (e) => {
            console.error('Error reading file:', e);
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Error reading file.', 'error');
            }
        };
        reader.readAsText(file);
    }

    analyzeData() {
        const text = document.getElementById('analyzer-data-input').value;
        this.extractedEntities = {
            urls: [],
            ipAddresses: [],
            emailAddresses: [],
            credentials: [],
            sensitiveFilePaths: [],
            customEntities: {}
        };

        this.extractURLs(text);
        this.extractIPAddresses(text);
        this.extractEmailAddresses(text);
        this.extractCredentials(text);
        this.extractSensitiveFilePaths(text);
        this.extractCustomEntities(text);

        this.renderExtractedEntities();
        // Clear selected entity when new data is analyzed
        this.selectedEntity = null;
        this.selectedEntityType = null;
        this.renderCrossReferencingSection();
    }

    extractURLs(text) {
        const urlRegex = /(https?:\/\/[^\s$.?#].[^\s]*)|(www\.[^\s$.?#].[^\s]*)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
        let match;
        const seen = new Set();
        while ((match = urlRegex.exec(text)) !== null) {
            let url = match[0];
            // Basic cleanup for URLs that might end with punctuation or parentheses
            url = url.replace(/[,.;:!?()]+\s*$/, '');
            if (!seen.has(url)) {
                this.extractedEntities.urls.push(url);
                seen.add(url);
            }
        }
    }

    extractIPAddresses(text) {
        const ipRegex = /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?\b/g;
        const seen = new Set();
        let match;
        while ((match = ipRegex.exec(text)) !== null) {
            if (!seen.has(match[0])) {
                this.extractedEntities.ipAddresses.push(match[0]);
                seen.add(match[0]);
            }
        }
    }

    extractEmailAddresses(text) {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const seen = new Set();
        let match;
        while ((match = emailRegex.exec(text)) !== null) {
            if (!seen.has(match[0])) {
                this.extractedEntities.emailAddresses.push(match[0]);
                seen.add(match[0]);
            }
        }
    }

    extractCredentials(text) {
        const credentialRegexes = {
            awsKeys: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
            apiKeys: /(?:api_key|apikey|token|auth_token|client_secret|consumer_key|private_key|secret_key|ssh-rsa)\W{0,5}[a-zA-Z0-9]{20,}/gi,
            genericPasswords: /(?:password|passwd|pwd|pass)\s*[=:]\s*['"]?([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,})['"]?/gi,
            googleApiKeys: /AIza[0-9A-Za-z_-]{35}/g,
            slackTokens: /xoxb-[0-9]{12}-[0-9]{12}-[0-9a-zA-Z]{24}/g,
            githubTokens: /(ghp|gho|ghu|ghs|ghr)_[0-9a-zA-Z]{36}/g,
            s3Buckets: /s3(?:[-_.]|bucket[_-]|\d{1,3}[-.]){1}[a-z0-9.-]{3,63}/gi,
        };

        const seen = new Set();
        for (const type in credentialRegexes) {
            let match;
            while ((match = credentialRegexes[type].exec(text)) !== null) {
                // For generic passwords, ensure we only capture the actual password part
                let extractedValue = match[0];
                if (type === 'genericPasswords' && match[1]) {
                    extractedValue = match[1];
                }

                if (!seen.has(extractedValue)) {
                    this.extractedEntities.credentials.push(extractedValue);
                    seen.add(extractedValue);
                }
            }
        }
    }

    extractSensitiveFilePaths(text) {
        const sensitiveFileRegex = /\b(?:etc|var|log|tmp|root|home|opt|usr|bin|sbin|dev|proc|sys|boot|srv|mnt|media|run)\/(?:[a-zA-Z0-9._-]+\/?){1,}|(?:\.(?:env|sql|bak|conf|log|zip|rar|7z|tgz|tar|git|ssh|key|pem|p12|jks|passwd|htpasswd|json|xml|yaml|yml|properties|ini|cnf|config|bashrc|history|profile|secret|id_rsa|id_dsa|known_hosts|aws|azure|gcp|credentials|certificate|db|sqlite|mdb|access|backup|dump)\b)/gi;
        const seen = new Set();
        let match;
        while ((match = sensitiveFileRegex.exec(text)) !== null) {
            // Further refine to only include actual file paths/extensions
            let path = match[0];
            // Remove common preceding words like 'path' or 'file' if they're not part of the actual path
            path = path.replace(/(?:path|file|location)\s*[:=]\s*/i, '');
            if (!seen.has(path)) {
                this.extractedEntities.sensitiveFilePaths.push(path);
                seen.add(path);
            }
        }
    }

    extractCustomEntities(text) {
        for (const patternName in this.customRegexPatterns) {
            const patternData = this.customRegexPatterns[patternName];
            try {
                const regex = new RegExp(patternData.pattern, patternData.flags);
                let match;
                const matchesForPattern = [];
                const seen = new Set();
                while ((match = regex.exec(text)) !== null) {
                    let extracted = match[1] || match[0]; // Prefer first capturing group, fallback to full match
                    if (!seen.has(extracted)) {
                        matchesForPattern.push(extracted);
                        seen.add(extracted);
                    }
                }
                if (matchesForPattern.length > 0) {
                    this.extractedEntities.customEntities[patternName] = matchesForPattern;
                }
            } catch (e) {
                console.error(`Error with custom regex "${patternName}":`, e);
                if (window.dorkAssistant) {
                    window.dorkAssistant.showNotification(`Error with custom regex "${patternName}": ${e.message}`, 'error');
                }
            }
        }
    }

    renderExtractedEntities() {
        const resultsContainer = document.getElementById('extracted-entities-results');
        resultsContainer.innerHTML = '';

        const categories = [
            { name: 'URLs', key: 'urls', icon: 'fas fa-link' },
            { name: 'IP Addresses', key: 'ipAddresses', icon: 'fas fa-network-wired' },
            { name: 'Email Addresses', key: 'emailAddresses', icon: 'fas fa-envelope' },
            { name: 'Credentials / Secrets', key: 'credentials', icon: 'fas fa-key' },
            { name: 'Sensitive File Paths', key: 'sensitiveFilePaths', icon: 'fas fa-file-code' }
        ];

        let hasEntities = false;

        categories.forEach(category => {
            if (this.extractedEntities[category.key] && this.extractedEntities[category.key].length > 0) {
                hasEntities = true;
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'entity-category';
                categoryDiv.innerHTML = `
                    <div class="category-header">
                        <i class="${category.icon}"></i>
                        <h4>${category.name} (${this.extractedEntities[category.key].length})</h4>
                        <button class="expand-btn">
                             <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <ul class="entity-list"></ul>
                `;
                const ul = categoryDiv.querySelector('.entity-list');
                this.extractedEntities[category.key].forEach(entity => {
                    const li = document.createElement('li');
                    li.textContent = entity;
                    li.addEventListener('click', () => this.selectEntity(entity, category.key));
                    ul.appendChild(li);
                });
                resultsContainer.appendChild(categoryDiv);

                // Add toggle functionality
                const expandBtn = categoryDiv.querySelector('.expand-btn');
                expandBtn.addEventListener('click', () => {
                    ul.classList.toggle('expanded');
                    expandBtn.querySelector('i').classList.toggle('fa-chevron-down');
                    expandBtn.querySelector('i').classList.toggle('fa-chevron-up');
                });
            }
        });

        // Custom entities
        for (const customCatName in this.extractedEntities.customEntities) {
            const entities = this.extractedEntities.customEntities[customCatName];
            if (entities.length > 0) {
                hasEntities = true;
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'entity-category custom-entity';
                categoryDiv.innerHTML = `
                    <div class="category-header">
                        <i class="fas fa-star"></i>
                        <h4>${customCatName} (${entities.length})</h4>
                         <button class="expand-btn">
                             <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <ul class="entity-list"></ul>
                `;
                const ul = categoryDiv.querySelector('.entity-list');
                entities.forEach(entity => {
                    const li = document.createElement('li');
                    li.textContent = entity;
                    li.addEventListener('click', () => this.selectEntity(entity, 'custom')); // Use 'custom' as generic type for suggestions
                    ul.appendChild(li);
                });
                resultsContainer.appendChild(categoryDiv);

                 // Add toggle functionality
                const expandBtn = categoryDiv.querySelector('.expand-btn');
                expandBtn.addEventListener('click', () => {
                    ul.classList.toggle('expanded');
                    expandBtn.querySelector('i').classList.toggle('fa-chevron-down');
                    expandBtn.querySelector('i').classList.toggle('fa-chevron-up');
                });
            }
        }

        const noEntitiesMessage = document.getElementById('no-entities-message');
        if (hasEntities) {
            noEntitiesMessage.style.display = 'none';
        } else {
            noEntitiesMessage.style.display = 'block';
        }
    }

    selectEntity(entity, type) {
        this.selectedEntity = entity;
        // Map internal keys to more general types for dork suggestions and external tools
        let mappedType;
        if (type === 'urls') {
            // Check if it's likely a domain or full URL
            mappedType = (entity.startsWith('http://') || entity.startsWith('https://')) ? 'url' : 'domain';
        } else if (type === 'ipAddresses') {
            mappedType = 'ipAddress';
        } else if (type === 'emailAddresses') {
            mappedType = 'emailAddress';
        } else if (type === 'credentials') {
            mappedType = 'credential';
        } else if (type === 'sensitiveFilePaths') {
            mappedType = 'sensitiveFilePath';
        } else { // For custom and general keywords
            mappedType = 'other';
        }
        this.selectedEntityType = mappedType;

        this.renderCrossReferencingSection();
        if (window.dorkAssistant) {
            window.dorkAssistant.showNotification(`Selected entity: "${entity}" (${type})`, 'info');
        }

        // Highlight selected entity in the list
        document.querySelectorAll('.entity-list li').forEach(li => li.classList.remove('selected'));
        // Find the clicked li and add 'selected' class
        event.target.classList.add('selected');
    }

    renderCrossReferencingSection() {
        const selectedEntityDisplay = document.getElementById('selected-entity-display');
        const dorkSuggestionsDiv = document.getElementById('dork-suggestions');
        const externalToolsDiv = document.getElementById('external-osint-tools');

        dorkSuggestionsDiv.innerHTML = '';
        externalToolsDiv.innerHTML = '';

        if (this.selectedEntity) {
            selectedEntityDisplay.innerHTML = `<i class="fas fa-tag"></i> Selected: <code>${this.selectedEntity}</code> (Type: ${this.selectedEntityType})`;
            
            // Populate Dork Suggestions
            this.getDorkSuggestions(this.selectedEntity, this.selectedEntityType).forEach(suggestion => {
                const dorkItem = document.createElement('div');
                dorkItem.className = 'dork-suggestion-item';
                dorkItem.innerHTML = `
                    <p class="suggestion-title">${suggestion.name} <span class="suggestion-engine">(${suggestion.engine})</span></p>
                    <code class="suggestion-query">${suggestion.query}</code>
                    <div class="suggestion-actions">
                        <button class="btn-secondary btn-small" onclick="dorkAnalyzer.copyToClipboard('${suggestion.query}')"><i class="fas fa-copy"></i> Copy</button>
                        <button class="btn-primary btn-small" onclick="dorkAnalyzer.testDorkSuggestion('${suggestion.query}', '${suggestion.engine}')"><i class="fas fa-external-link-alt"></i> Test</button>
                         <button class="btn-info btn-small" onclick="dorkAnalyzer.loadSuggestionToBuilder('${suggestion.query}', '${suggestion.engine}')"><i class="fas fa-tools"></i> Load to Builder</button>
                    </div>
                `;
                dorkSuggestionsDiv.appendChild(dorkItem);
            });

            // Populate External OSINT Tools
            for (const toolName in this.osintTools) {
                const tool = this.osintTools[toolName];
                if (tool.types.includes(this.selectedEntityType) || tool.types.includes('other')) {
                    const toolButton = document.createElement('button');
                    toolButton.className = 'btn-external-tool';
                    toolButton.innerHTML = `<i class="fas fa-external-link-alt"></i> ${toolName}`;
                    toolButton.onclick = () => this.openExternalTool(tool.url, this.selectedEntity, toolName);
                    externalToolsDiv.appendChild(toolButton);
                }
            }
        } else {
            selectedEntityDisplay.innerHTML = '<i class="fas fa-info-circle"></i> No entity selected. Click an extracted entity to get suggestions.';
        }

        // Toggle visibility of the sections based on selected entity
        document.getElementById('cross-referencing-section').classList.toggle('active', this.selectedEntity !== null);
    }

    // Helper to get suggested dorks based on entity type
    getDorkSuggestions(entity, type) {
        const suggestions = [];

        // Fuzzy/related dorking ideas
        suggestions.push({
            name: `Fuzzy search for "${entity}"`,
            query: `"${entity}" OR "${this.getFuzzyTerm(entity)}"*`,
            engine: 'Google'
        });
         suggestions.push({
            name: `Pastebin mentions of "${entity}"`,
            query: `site:pastebin.com "${entity}"`,
            engine: 'Google'
        });
        suggestions.push({
            name: `GitHub search for "${entity}"`,
            query: `"${entity}" in:file language:any`,
            engine: 'GitHub'
        });


        switch (type) {
            case 'url':
                suggestions.push(
                    { name: 'Site search (Google)', query: `site:${new URL(entity).hostname}`, engine: 'Google' },
                    { name: 'Wayback Machine (All snapshots)', query: `site:web.archive.org/web/* ${entity}`, engine: 'Google' },
                    { name: 'Subdomains (Google)', query: `site:*.${new URL(entity).hostname}`, engine: 'Google' },
                    { name: 'File types on site (Google)', query: `site:${new URL(entity).hostname} filetype:pdf OR filetype:doc`, engine: 'Google' },
                    { name: 'Inurl search for path', query: `inurl:${new URL(entity).pathname.slice(1)}`, engine: 'Google' } // Path only
                );
                break;
            case 'ipAddress':
                suggestions.push(
                    { name: 'Shodan search', query: `ip:${entity}`, engine: 'Shodan' },
                    { name: 'Censys search', query: `ip:${entity}`, engine: 'Censys' },
                    { name: 'Reverse DNS lookup (Google)', query: `reverse dns ${entity}`, engine: 'Google' },
                    { name: 'Associated domains (Google)', query: `"${entity}" intext:"domain.com"`, engine: 'Google' }
                );
                break;
            case 'emailAddress':
                const domain = entity.split('@')[1];
                suggestions.push(
                    { name: 'IntelX search', query: `type:1 "${entity}"`, engine: 'IntelX' },
                    { name: 'Company domain search (Google)', query: `site:${domain} intext:"${entity}"`, engine: 'Google' },
                    { name: 'Social media mentions (Google)', query: `"${entity}" site:linkedin.com OR site:twitter.com`, engine: 'Google' }
                );
                break;
            case 'credential':
                suggestions.push(
                    { name: 'GitHub potential exposure', query: `"${entity}" OR "${entity.substring(0, Math.min(entity.length, 10))}..." in:file`, engine: 'GitHub' },
                    { name: 'Pastebin search', query: `site:pastebin.com "${entity}"`, engine: 'Google' }
                );
                break;
            case 'sensitiveFilePath':
                suggestions.push(
                    { name: 'File path on Google', query: `inurl:"${entity}" OR filetype:${entity.split('.').pop()} ${entity.split('/').pop()}`, engine: 'Google' },
                    { name: 'GitHub path search', query: `in:path ${entity}`, engine: 'GitHub' }
                );
                break;
            case 'domain':
                 suggestions.push(
                    { name: 'Site search (Google)', query: `site:${entity}`, engine: 'Google' },
                    { name: 'Wayback Machine (All snapshots)', query: `site:web.archive.org/web/* ${entity}`, engine: 'Google' },
                    { name: 'Subdomains (Google)', query: `site:*.${entity}`, engine: 'Google' },
                    { name: 'IP addresses for domain (Shodan)', query: `hostname:${entity}`, engine: 'Shodan' },
                    { name: 'Email addresses from domain (IntelX)', query: `type:1 "@${entity}"`, engine: 'IntelX' }
                );
                break;
            case 'other': // General keyword search
                suggestions.push(
                    { name: `General search for "${entity}"`, query: `"${entity}"`, engine: 'Google' },
                    { name: `Forum discussions about "${entity}"`, query: `"${entity}" (inurl:forum OR inurl:thread)`, engine: 'Google' }
                );
                break;
        }

        return suggestions;
    }

    getFuzzyTerm(term) {
        // Simple fuzzy logic: remove common separators, truncate, or add wildcards
        let fuzzy = term.replace(/[-_.]/g, ''); // Remove hyphens, underscores, dots
        if (fuzzy.length > 5) {
            fuzzy = fuzzy.substring(0, fuzzy.length - 2); // Truncate slightly
        }
        return fuzzy;
    }


    openExternalTool(baseUrl, entity, toolName) {
        let url = baseUrl;
        let encodedEntity = encodeURIComponent(entity);

        // Special handling for specific tools if needed
        if (toolName.includes('DNSDumpster') || toolName.includes('Wayback Machine')) {
            // These tools often take the domain directly or have their own input fields
            url = baseUrl; // Base URL is sufficient, user will paste or interact
            window.open(url, '_blank');
            return;
        } else if (toolName.includes('Hunter.io')) {
            // Hunter.io search path might be different based on entity type
            if (this.selectedEntityType === 'emailAddress') {
                 encodedEntity = entity.split('@')[1]; // Hunter.io typically searches by domain for email
            }
        }
        
        // Append entity to URL. Some tools might need different encoding or parameters.
        url += encodedEntity;

        window.open(url, '_blank');
        if (window.dorkAssistant) {
            window.dorkAssistant.logAudit('OPEN_EXTERNAL_TOOL', { tool: toolName, entity: entity });
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Copied to clipboard!', 'success');
            }
        }).catch(() => {
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Failed to copy to clipboard', 'error');
            }
        });
    }

    testDorkSuggestion(query, engineName) {
        const engine = window.dorkAssistant.searchEngines[engineName.toLowerCase()];
        if (!engine) {
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Invalid engine for testing.', 'error');
            }
            return;
        }
        let url = engine.url + encodeURIComponent(query);
        if (engineName.toLowerCase() === 'fofa') {
            url = engine.url + btoa(query);
        }
        window.open(url, '_blank');
        if (window.dorkAssistant) {
            window.dorkAssistant.logAudit('TEST_DORK_SUGGESTION', { query: query, engine: engineName });
        }
    }

    loadSuggestionToBuilder(query, engineName) {
        if (window.dorkAssistant) {
            window.dorkAssistant.showDorkTab('query-builder');
            document.getElementById('generated-query').value = query;
            document.getElementById('search-engine').value = engineName.toLowerCase();
            window.dorkAssistant.updateQuerySyntax();
            window.dorkAssistant.populateQueryBuilderFromLoadedQuery(query, engineName.toLowerCase());
            window.dorkAssistant.showNotification('Suggestion loaded to Query Builder!', 'info');
        }
    }

    showAddRegexModal(editName = null) {
        const modal = document.getElementById('add-regex-modal');
        const form = document.getElementById('add-regex-form');
        form.reset();
        document.getElementById('regex-modal-title').textContent = 'Add Custom Regex Pattern';
        document.getElementById('regex-name').value = '';
        document.getElementById('regex-pattern').value = '';
        document.getElementById('regex-flags').value = 'g'; // Default to global
        document.getElementById('regex-name').readOnly = false; // Allow editing name for new regex

        if (editName) {
            const pattern = this.customRegexPatterns[editName];
            if (pattern) {
                document.getElementById('regex-modal-title').textContent = `Edit Custom Regex Pattern: ${editName}`;
                document.getElementById('regex-name').value = editName;
                document.getElementById('regex-pattern').value = pattern.pattern;
                document.getElementById('regex-flags').value = pattern.flags;
                document.getElementById('regex-name').readOnly = true; // Prevent editing name when editing
            }
        }
        modal.style.display = 'flex';
    }

    closeAddRegexModal() {
        document.getElementById('add-regex-modal').style.display = 'none';
        document.getElementById('add-regex-form').reset();
    }

    saveCustomRegex(event) {
        event.preventDefault();
        const name = document.getElementById('regex-name').value.trim();
        const pattern = document.getElementById('regex-pattern').value.trim();
        const flags = document.getElementById('regex-flags').value.trim();

        if (!name || !pattern) {
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification('Regex Name and Pattern are required!', 'warning');
            }
            return;
        }

        try {
            // Test if the regex is valid
            new RegExp(pattern, flags);
        } catch (e) {
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification(`Invalid Regex: ${e.message}`, 'error');
            }
            return;
        }

        this.customRegexPatterns[name] = { pattern, flags };
        this.saveCustomRegexPatterns();
        this.renderCustomRegexPatterns();
        this.analyzeData(); // Re-analyze data with new regex
        this.closeAddRegexModal();
        if (window.dorkAssistant) {
            window.dorkAssistant.showNotification(`Custom regex "${name}" saved!`, 'success');
            window.dorkAssistant.logAudit('ADD_CUSTOM_REGEX', { name: name, pattern: pattern, flags: flags });
        }
    }

    deleteCustomRegex(name) {
        if (confirm(`Are you sure you want to delete the custom regex "${name}"?`)) {
            delete this.customRegexPatterns[name];
            this.saveCustomRegexPatterns();
            this.renderCustomRegexPatterns();
            this.analyzeData(); // Re-analyze data without deleted regex
            if (window.dorkAssistant) {
                window.dorkAssistant.showNotification(`Custom regex "${name}" deleted!`, 'success');
                window.dorkAssistant.logAudit('DELETE_CUSTOM_REGEX', { name: name });
            }
        }
    }

    renderCustomRegexPatterns() {
        const container = document.getElementById('custom-regex-list');
        container.innerHTML = '';
        if (Object.keys(this.customRegexPatterns).length === 0) {
            container.innerHTML = '<p class="no-regex-message">No custom regex patterns added yet.</p>';
            return;
        }

        for (const name in this.customRegexPatterns) {
            const pattern = this.customRegexPatterns[name];
            const div = document.createElement('div');
            div.className = 'custom-regex-item';
            div.innerHTML = `
                <div>
                    <strong>${name}</strong>: <code>/${pattern.pattern}/${pattern.flags}</code>
                </div>
                <div class="regex-actions">
                    <button class="btn-secondary btn-small" onclick="dorkAnalyzer.showAddRegexModal('${name}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-danger btn-small" onclick="dorkAnalyzer.deleteCustomRegex('${name}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            container.appendChild(div);
        }
    }

    loadCustomRegexPatterns() {
        const stored = localStorage.getItem('dork-custom-regex-patterns');
        return stored ? JSON.parse(stored) : {};
    }

    saveCustomRegexPatterns() {
        localStorage.setItem('dork-custom-regex-patterns', JSON.stringify(this.customRegexPatterns));
    }
}

// Global functions for HTML onclick handlers for Dork Analyzer
function analyzeData() {
    if (window.dorkAnalyzer) {
        window.dorkAnalyzer.analyzeData();
    }
}

function handleFileUpload(event) {
    if (window.dorkAnalyzer) {
        window.dorkAnalyzer.handleFileUpload(event);
    }
}

function pasteFromClipboard() {
    if (window.dorkAnalyzer) {
        window.dorkAnalyzer.pasteFromClipboard();
    }
}

function clearAnalyzer() {
    if (window.dorkAnalyzer) {
        window.dorkAnalyzer.clearAnalyzer();
    }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dorkAnalyzer = new DorkAnalyzer();
});