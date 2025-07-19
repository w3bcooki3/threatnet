// Dork Assistant - Advanced Query Builder for Multiple Search Engines
class DorkAssistant {
    constructor() {
        this.currentEngine = 'google';
        this.templates = this.loadTemplates();
        this.savedQueries = this.loadSavedQueries();
        this.currentTemplateCategory = 'all'; // Initialize current category filter
        this.itemToDelete = null; // Stores the ID of the item to be deleted
        this.itemTypeToDelete = null; // Stores the type of item ('template' or 'savedQuery')


        this.searchEngines = {
            google: {
                name: 'Google',
                url: 'https://www.google.com/search?q=',
                operators: {
                    'Site Search': { operator: 'site:', placeholder: 'example.com', category: 'Domain & Host' },
                    'File Type': { operator: 'filetype:', placeholder: 'pdf', category: 'Code & Files' },
                    'In Title': { operator: 'intitle:', placeholder: 'admin login', category: 'Content Search' },
                    'In URL': { operator: 'inurl:', placeholder: 'admin', category: 'Content Search' },
                    'In Text': { operator: 'intext:', placeholder: 'password', category: 'Content Search' },
                    'Cache': { operator: 'cache:', placeholder: 'example.com', category: 'Other Specific' },
                    'Related': { operator: 'related:', placeholder: 'example.com', category: 'Other Specific' },
                    'Exact Phrase': { operator: '"', placeholder: 'exact phrase', suffix: '"', category: 'Basic Search' },
                    'Proximity Search': { operator: 'AROUND(n)', placeholder: 'word1 AROUND(5) word2', description: 'Finds words within N words of each other.', category: 'Basic Search' },
                    'In Anchor': { operator: 'inanchor:', placeholder: 'login', description: 'Searches for text within anchor text of links.', category: 'Content Search' },
                    'In Subject': { operator: 'insubject:', placeholder: 'password reset', description: 'Searches for text in the subject of indexed pages.', category: 'Content Search' },
                    'Daterange': { operator: 'daterange:', placeholder: '2459000-2459005', description: 'Searches within a specific Julian date range.', category: 'Time & Date' }
                }
            },
            bing: {
                name: 'Bing',
                url: 'https://www.bing.com/search?q=',
                operators: {
                    'Site Search': { operator: 'site:', placeholder: 'example.com', category: 'Domain & Host' },
                    'File Type': { operator: 'filetype:', placeholder: 'pdf', category: 'Code & Files' },
                    'In Title': { operator: 'intitle:', placeholder: 'admin login', category: 'Content Search' },
                    'In URL': { operator: 'inurl:', placeholder: 'admin', category: 'Content Search' },
                    'In Text': { operator: 'intext:', placeholder: 'password', category: 'Content Search' },
                    'Contains': { operator: 'contains:', placeholder: 'login', category: 'Content Search' },
                    'IP Address': { operator: 'ip:', placeholder: '192.168.1.1', category: 'Location & Organization' },
                    'Language': { operator: 'language:', placeholder: 'en', description: 'Filters results by language.', category: 'Other Specific' },
                    'Feed': { operator: 'feed:', placeholder: 'example.com/rss.xml', description: 'Searches within RSS or Atom feeds.', category: 'Domain & Host' }
                }
            },
            shodan: {
                name: 'Shodan',
                url: 'https://www.shodan.io/search?query=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '22', category: 'Technical' },
                    'Country': { operator: 'country:', placeholder: 'US', category: 'Location & Organization' },
                    'City': { operator: 'city:', placeholder: 'New York', category: 'Location & Organization' },
                    'Organization': { operator: 'org:', placeholder: 'Google', category: 'Location & Organization' },
                    'Hostname': { operator: 'hostname:', placeholder: 'example.com', category: 'Domain & Host' },
                    'Product': { operator: 'product:', placeholder: 'Apache', category: 'Technical' },
                    'Version': { operator: 'version:', placeholder: '2.4', category: 'Technical' },
                    'Operating System': { operator: 'os:', placeholder: 'Windows', category: 'Technical' },
                    'Net': { operator: 'net:', placeholder: '192.168.1.0/24', category: 'Location & Organization' },
                    'Before Date': { operator: 'before:', placeholder: '01/01/2023', category: 'Time & Date' },
                    'After Date': { operator: 'after:', placeholder: '01/01/2023', category: 'Time & Date' },
                    'Vulnerability (CVE)': { operator: 'vuln:', placeholder: 'CVE-2021-1234', description: 'Search for specific CVEs.', category: 'Technical' },
                    'HTTP Title': { operator: 'http.title:', placeholder: 'Admin Panel', description: 'Search for text in HTTP titles.', category: 'Content Search' },
                    'SSL Subject CN': { operator: 'ssl.cert.subject.cn:', placeholder: '*.example.com', description: 'Search for common name in SSL certificate subject.', category: 'SSL/TLS' },
                    'SMTP Mail': { operator: 'smtp.mail:', placeholder: 'example.com', description: 'Search for SMTP banner mail field.', category: 'Email & Communication' }
                }
            },
            censys: {
                name: 'Censys',
                url: 'https://search.censys.io/search?resource=hosts&q=',
                operators: {
                    'Services Port': { operator: 'services.port:', placeholder: '80', category: 'Technical' },
                    'Services Service': { operator: 'services.service_name:', placeholder: 'HTTP', category: 'Technical' },
                    'Location Country': { operator: 'location.country:', placeholder: 'United States', category: 'Location & Organization' },
                    'Location City': { operator: 'location.city:', placeholder: 'New York', category: 'Location & Organization' },
                    'Autonomous System': { operator: 'autonomous_system.name:', placeholder: 'Google', category: 'Location & Organization' },
                    'DNS Names': { operator: 'dns.names:', placeholder: 'example.com', category: 'Domain & Host' },
                    'Operating System': { operator: 'operating_system.product:', placeholder: 'Linux', category: 'Technical' },
                    'TLS Certificate': { operator: 'services.tls.certificates.leaf_data.subject.common_name:', placeholder: 'example.com', category: 'SSL/TLS' },
                    'Tags': { operator: 'tags:', placeholder: 'iot', description: 'Search for hosts with specific tags.', category: 'Technical' },
                    'Protocols': { operator: 'protocols:', placeholder: '443/https', description: 'Search by protocol and port.', category: 'Technical' }
                }
            },
            zoomeye: {
                name: 'ZoomEye',
                url: 'https://www.zoomeye.org/searchResult?q=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '80', category: 'Technical' },
                    'Service': { operator: 'service:', placeholder: 'http', category: 'Technical' },
                    'Country': { operator: 'country:', placeholder: 'US', category: 'Location & Organization' },
                    'City': { operator: 'city:', placeholder: 'New York', category: 'Location & Organization' },
                    'Organization': { operator: 'org:', placeholder: 'Google', category: 'Location & Organization' },
                    'Hostname': { operator: 'hostname:', placeholder: 'example.com', category: 'Domain & Host' },
                    'Device': { operator: 'device:', placeholder: 'router', category: 'Technical' },
                    'Operating System': { operator: 'os:', placeholder: 'Linux', category: 'Technical' },
                    'App': { operator: 'app:', placeholder: 'nginx', description: 'Search for web application name.', category: 'Technical' },
                    'Vulnerability': { operator: 'vulnerability:', placeholder: 'CVE-2021-1234', description: 'Search for known vulnerabilities.', category: 'Technical' }
                }
            },
            fofa: {
                name: 'FOFA',
                url: 'https://fofa.so/result?qbase64=',
                operators: {
                    'Port': { operator: 'port=', placeholder: '80', category: 'Technical' },
                    'Protocol': { operator: 'protocol=', placeholder: 'http', category: 'Technical' },
                    'Country': { operator: 'country=', placeholder: 'US', category: 'Location & Organization' },
                    'Region': { operator: 'region=', placeholder: 'California', category: 'Location & Organization' },
                    'City': { operator: 'city=', placeholder: 'San Francisco', category: 'Location & Organization' },
                    'Organization': { operator: 'org=', placeholder: 'Google', category: 'Location & Organization' },
                    'Domain': { operator: 'domain=', placeholder: 'example.com', category: 'Domain & Host' },
                    'Host': { operator: 'host=', placeholder: 'example.com', category: 'Domain & Host' },
                    'Title': { operator: 'title=', placeholder: 'Admin Panel', category: 'Content Search' },
                    'Body': { operator: 'body=', placeholder: 'login', category: 'Content Search' },
                    'Header': { operator: 'header=', placeholder: 'Server', description: 'Search for text in HTTP headers.', category: 'Content Search' },
                    'Cert': { operator: 'cert=', placeholder: 'Google', description: 'Search for SSL certificate issuer.', category: 'SSL/TLS' }
                }
            },
            github: {
                name: 'GitHub',
                url: 'https://github.com/search?q=',
                operators: {
                    'In File': { operator: 'in:file', placeholder: 'password', category: 'Code & Files' },
                    'In Path': { operator: 'in:path', placeholder: 'config', category: 'Code & Files' },
                    'Filename': { operator: 'filename:', placeholder: '.env', category: 'Code & Files' },
                    'Extension': { operator: 'extension:', placeholder: 'sql', category: 'Code & Files' },
                    'Language': { operator: 'language:', placeholder: 'python', category: 'Code & Files' },
                    'User': { operator: 'user:', placeholder: 'username', category: 'Other Specific' },
                    'Organization': { operator: 'org:', placeholder: 'organization', category: 'Other Specific' },
                    'Repository': { operator: 'repo:', placeholder: 'user/repo', category: 'Domain & Host' },
                    'Size': { operator: 'size:', placeholder: '>1000', category: 'Other Specific' },
                    'Created': { operator: 'created:', placeholder: '2023-01-01', category: 'Time & Date' },
                    'Pushed': { operator: 'pushed:', placeholder: '>2023-01-01', description: 'Last push date.', category: 'Time & Date' },
                    'Stars': { operator: 'stars:', placeholder: '>100', description: 'Number of stars.', category: 'Other Specific' },
                    'Forks': { operator: 'forks:', placeholder: '>10', description: 'Number of forks.', category: 'Other Specific' }
                }
            },
            pastebin: {
                name: 'Pastebin',
                url: 'https://www.google.com/search?q=site:pastebin.com+', // Uses Google site search
                operators: {
                    'Keyword': { operator: '', placeholder: 'email@domain.com', description: 'General keyword search for sensitive data.', category: 'Basic Search' },
                    'Password': { operator: '', placeholder: 'password', category: 'Basic Search' }, // Example for specific keywords
                    'API Key': { operator: '', placeholder: 'api_key', category: 'Basic Search' },
                    'Database': { operator: '', placeholder: 'database dump', category: 'Basic Search' },
                    'Configuration': { operator: '', placeholder: 'config.php', category: 'Basic Search' },
                    'Type': { operator: 'type:', placeholder: 'php', description: 'Paste type (e.g., php, sql).', category: 'Code & Files' }
                }
            },
            binaryedge: {
                name: 'BinaryEdge',
                url: 'https://app.binaryedge.io/services/search?q=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '80', category: 'Technical' },
                    'Service': { operator: 'service:', placeholder: 'http', category: 'Technical' },
                    'Country': { operator: 'country:', placeholder: 'US', category: 'Location & Organization' },
                    'ASN': { operator: 'asn:', placeholder: 'AS15169', description: 'Autonomous System Number.', category: 'Location & Organization' },
                    'Tag': { operator: 'tag:', placeholder: 'iot', description: 'Service tags.', category: 'Technical' },
                    'IP': { operator: 'ip:', placeholder: '1.1.1.1', description: 'Specific IP address.', category: 'Location & Organization' },
                    'Vulnerability': { operator: 'vulnerability:', placeholder: 'CVE-2022-1234', description: 'Known vulnerabilities.', category: 'Technical' },
                    'Component': { operator: 'component.name:', placeholder: 'nginx', description: 'Software component name.', category: 'Technical' },
                    'Header': { operator: 'http.headers:', placeholder: 'Server: Apache', description: 'HTTP headers.', category: 'Content Search' },
                    'Title': { operator: 'http.title:', placeholder: 'Dashboard', description: 'HTTP title.', category: 'Content Search' }
                }
            },
            intelx: {
                name: 'IntelX',
                url: 'https://public.intelx.io/search?s=',
                operators: {
                    'Term': { operator: '', placeholder: 'email@example.com', description: 'General search term.', category: 'Basic Search' },
                    'Type': { operator: 'type:', placeholder: '2', description: 'Data type (e.g., 0=select all, 1=emails, 2=phones).', category: 'Technical' },
                    'Date From': { operator: 'datefrom:', placeholder: '2023-01-01', description: 'Start date for results.', category: 'Time & Date' },
                    'Date To': { operator: 'dateto:', placeholder: '2023-12-31', description: 'End date for results.', category: 'Time & Date' },
                    'Max Results': { operator: 'maxresults:', placeholder: '100', description: 'Maximum number of results.', category: 'Other Specific' },
                    'Sort': { operator: 'sort:', placeholder: '0', description: 'Sort order (0=relevance, 1=date desc).', category: 'Other Specific' },
                    'Selector': { operator: 'selector:', placeholder: 'email', description: 'Search for specific selectors (e.g., email, phone, BTC).', category: 'Technical' },
                    'Hostname': { operator: 'host:', placeholder: 'example.com', description: 'Search for hostnames.', category: 'Domain & Host' }
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
        this.renderTemplateCategories(); // Call this here to initially render categories
    }

    // Initialize default templates
    initializeTemplates() {
        if (this.templates.length === 0) {
            this.templates = [
                {
                    id: 1,
                    name: 'Exposed Database Files',
                    description: 'Find exposed database files and backups on web servers.',
                    query: 'filetype:sql OR filetype:db OR filetype:mdb OR filetype:sqlite',
                    category: 'databases',
                    engines: ['google', 'bing'],
                    tags: ['database', 'sql', 'backup', 'exposed', 'data leak']
                },
                {
                    id: 2,
                    name: 'Admin Login Panels',
                    description: 'Discover publicly accessible administration and login interfaces.',
                    query: 'inurl:admin OR inurl:login OR intitle:"admin panel" OR intitle:"login page"',
                    category: 'login',
                    engines: ['google', 'bing'],
                    tags: ['admin', 'login', 'interface', 'panel', 'access']
                },
                {
                    id: 3,
                    name: 'Open MongoDB Instances',
                    description: 'Identify exposed MongoDB instances on the internet.',
                    query: 'port:27017 product:MongoDB',
                    category: 'databases',
                    engines: ['shodan'],
                    tags: ['mongodb', 'database', 'exposed', 'nosql', 'vulnerability']
                },
                {
                    id: 4,
                    name: 'SSH Servers with Specific Version',
                    description: 'Locate SSH servers running a particular version, often for vulnerability assessment.',
                    query: 'port:22 product:OpenSSH version:{{SSH_VERSION}}',
                    category: 'vulnerabilities',
                    engines: ['shodan', 'censys'],
                    tags: ['ssh', 'remote access', 'server', 'version', 'vulnerability']
                },
                {
                    id: 5,
                    name: 'Public Cloud Storage Buckets',
                    description: 'Find misconfigured or exposed cloud storage buckets (AWS S3, GCP Storage).',
                    query: 'site:s3.amazonaws.com OR site:storage.googleapis.com OR site:blob.core.windows.net',
                    category: 'cloud',
                    engines: ['google', 'bing'],
                    tags: ['cloud', 'storage', 'aws', 'gcp', 'azure', 'bucket', 'misconfiguration']
                },
                {
                    id: 6,
                    name: 'Exposed IP Cameras',
                    description: 'Identify accessible IP cameras and surveillance systems.',
                    query: 'port:554 product:"IP Camera" OR inurl:view/viewer.shtml',
                    category: 'iot',
                    engines: ['shodan', 'zoomeye'],
                    tags: ['iot', 'camera', 'webcam', 'surveillance', 'exposed']
                },
                {
                    id: 7,
                    name: 'Sensitive Configuration Files on GitHub',
                    description: 'Search for common configuration files that may contain sensitive information in public GitHub repositories.',
                    query: 'filename:.env OR filename:config.php OR filename:wp-config.php OR extension:yml AND in:file password',
                    category: 'files',
                    engines: ['github'],
                    tags: ['config', 'credentials', 'api key', 'source code', 'leak']
                },
                {
                    id: 8,
                    name: 'Government Employee Emails',
                    description: 'Discover email addresses of individuals within government domains.',
                    query: 'site:gov filetype:pdf intext:email',
                    category: 'government',
                    engines: ['google'],
                    tags: ['government', 'email', 'contact', 'osint']
                },
                {
                    id: 9,
                    name: 'Pastebin API Keys/Credentials',
                    description: 'Search Pastebin for leaked API keys, passwords, or sensitive data.',
                    query: 'site:pastebin.com (api_key OR password OR "private key" OR credential OR token)',
                    category: 'data leaks',
                    engines: ['google', 'pastebin'],
                    tags: ['pastebin', 'leak', 'credentials', 'api key', 'sensitive data']
                },
                {
                    id: 10,
                    name: 'Webcams via BinaryEdge',
                    description: 'Find open webcams using BinaryEdge, often misconfigured.',
                    query: 'tag:webcam product:goahead',
                    category: 'iot',
                    engines: ['binaryedge'],
                    tags: ['webcam', 'iot', 'surveillance', 'exposed', 'binaryedge']
                },
                {
                    id: 11,
                    name: 'Email Addresses via IntelX',
                    description: 'Search for email addresses in IntelX database.',
                    query: 'type:1 "{{EMAIL_DOMAIN}}"',
                    category: 'osint',
                    engines: ['intelx'],
                    tags: ['email', 'osint', 'intelx', 'reconnaissance']
                },
                {
                    id: 12,
                    name: 'Specific CVE Vulnerability on Shodan',
                    description: 'Search Shodan for systems vulnerable to a particular CVE.',
                    query: 'vuln:{{CVE_ID}}',
                    category: 'vulnerabilities',
                    engines: ['shodan'],
                    tags: ['cve', 'vulnerability', 'exploit', 'shodan']
                },
                {
                    id: 13,
                    name: 'HTTP Basic Auth Panels',
                    description: 'Find web pages protected by HTTP Basic Authentication, often revealing exposed directories.',
                    query: 'intitle:"Restricted Area" OR inurl:auth OR intext:"basic authentication"',
                    category: 'login',
                    engines: ['google', 'bing'],
                    tags: ['authentication', 'exposed', 'http', 'panel']
                },
                {
                    id: 14,
                    name: 'SQL Injection Vulnerabilities (Generic)',
                    description: 'Attempt to identify potential SQL injection points by searching for common error messages.',
                    query: 'intext:"SQL syntax" OR intext:"mysql_fetch_array()" OR intext:"Warning: mysql_num_rows()"',
                    category: 'vulnerabilities',
                    engines: ['google', 'bing'],
                    tags: ['sql injection', 'vulnerability', 'web security', 'error message']
                },
                {
                    id: 15,
                    name: 'Apache Struts RCE Exposure',
                    description: 'Find potentially vulnerable Apache Struts instances exposed online.',
                    query: 'http.title:"Apache Struts" product:"Apache httpd" port:8080',
                    category: 'vulnerabilities',
                    engines: ['shodan', 'fofa'],
                    tags: ['apache', 'struts', 'rce', 'vulnerability', 'server']
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
        // event.target is used in the HTML directly, ensure it refers to the button
        document.querySelector(`.dork-tab-btn[onclick="showDorkTab('${tabName}')"]`).classList.add('active');


        // Refresh content based on tab
        if (tabName === 'templates') {
            this.renderTemplates();
            this.renderTemplateCategories(); // Ensure categories are rendered when tab is active
        } else if (tabName === 'saved-queries') {
            this.renderSavedQueries();
        }
    }

    // Update query syntax based on selected engine
    updateQuerySyntax() {
        const engine = document.getElementById('search-engine').value;
        this.currentEngine = engine;

        const operatorsGrid = document.getElementById('operators-grid');
        const allOperators = this.searchEngines[engine].operators;

        operatorsGrid.innerHTML = '';

        // Group operators by defined category
        const categorizedOperators = {};
        for (const opName in allOperators) {
            const op = allOperators[opName];
            // Use predefined category or default to 'Other'
            const category = op.category || 'Other Specific';
            if (!categorizedOperators[category]) {
                categorizedOperators[category] = [];
            }
            categorizedOperators[category].push({ name: opName, ...op });
        }

        // Define a consistent order for categories
        const categoryOrder = [
            'Basic Search',
            'Content Search',
            'Technical',
            'Location & Organization',
            'Domain & Host',
            'Time & Date',
            'Code & Files',
            'SSL/TLS',
            'Email & Communication',
            'Other Specific'
        ];

        // Add categories that might not be in the predefined list but exist in operators
        const sortedCategoryNames = [...new Set([...categoryOrder, ...Object.keys(categorizedOperators)])]
            .filter(cat => categorizedOperators[cat] && categorizedOperators[cat].length > 0);


        sortedCategoryNames.forEach(category => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'operator-group';
            groupDiv.innerHTML = `<h5>${category}</h5>`;

            // Sort operators within each group alphabetically by name
            categorizedOperators[category].sort((a, b) => a.name.localeCompare(b.name));

            categorizedOperators[category].forEach(op => {
                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'operator-field';
                // Add a tooltip for description if available
                const descriptionAttr = op.description ? `title="${op.description}"` : '';
                fieldDiv.innerHTML = `
                    <label>${op.name}:</label>
                    <input type="text"
                           placeholder="${op.placeholder}"
                           data-operator="${op.operator}"
                           data-suffix="${op.suffix || ''}"
                           oninput="dorkAssistant.buildQuery()"
                           ${descriptionAttr}> `;
                groupDiv.appendChild(fieldDiv);
            });

            operatorsGrid.appendChild(groupDiv);
        });

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
                // Handle special cases for operators that don't need a value if already defined by placeholder
                // For now, assume all operators need a value for consistency
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
                <div class="conversion-actions">
                    <button onclick="dorkAssistant.copyConvertedQuery('${convertedQuery.replace(/'/g, "\\'")}')" class="btn-secondary">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button onclick="dorkAssistant.testConvertedQuery('${convertedQuery.replace(/'/g, "\\'")}', '${engineKey}')" class="btn-primary">
                        <i class="fas fa-external-link-alt"></i> Test
                    </button>
                </div>
            `;
            conversionsDiv.appendChild(conversionDiv);
        });
    }

    // New: Copy a specific converted query
    copyConvertedQuery(query) {
        if (!query.trim()) {
            this.showNotification('No query to copy', 'warning');
            return;
        }
        navigator.clipboard.writeText(query).then(() => {
            this.showNotification('Converted query copied!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy converted query', 'error');
        });
    }

    // New: Test a specific converted query
    testConvertedQuery(query, engineKey) {
        if (!query.trim()) {
            this.showNotification('No query to test', 'warning');
            return;
        }
        const engine = this.searchEngines[engineKey];
        let url = engine.url + encodeURIComponent(query);

        if (engineKey === 'fofa') {
            url = engine.url + btoa(query);
        }
        window.open(url, '_blank');
    }

    // Convert query between different search engines
    convertQuery(query, fromEngine, toEngine) {
        let convertedQuery = query;

        // Step 1: Normalize common operators from source engine
        // This is a more generalized approach. For deep parsing, a proper AST would be needed.
        const operatorMap = {
            'site:': ['site:', 'domain=', 'hostname:', 'repo:', 'host:'],
            'filetype:': ['filetype:', 'extension:', 'product:', 'type:'],
            'intitle:': ['intitle:', 'title=', 'http.title:', 'in:file'],
            'inurl:': ['inurl:', 'contains:', 'host='],
            'intext:': ['intext:', 'body=', 'in:file'],
            'port:': ['port:', 'port=', 'services.port:'],
            'country:': ['country:', 'country=', 'location.country:']
            // Add more common operator mappings as needed
        };

        // Standardize common patterns
        for (const genericOp in operatorMap) {
            const patterns = operatorMap[genericOp];
            patterns.forEach(pattern => {
                if (query.includes(pattern)) {
                    // Simple replacement, might need more complex regex for quotes etc.
                    convertedQuery = convertedQuery.replace(new RegExp(pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), genericOp);
                }
            });
        }

        // Step 2: Convert to target engine's specific syntax
        let finalQueryParts = [];
        const targetEngineOps = this.searchEngines[toEngine].operators;

        // Split query into terms and attempt to re-map
        const terms = convertedQuery.match(/(?:[^\s"]+|"[^"]*")+/g) || []; // Splits by space, keeps quoted phrases together

        terms.forEach(term => {
            let foundMatch = false;
            for (const opName in targetEngineOps) {
                const op = targetEngineOps[opName];
                // Check if the current term starts with a generic operator and map to target specific
                if (term.startsWith('site:')) {
                    if (op.operator === 'site:' && op.category === 'Domain & Host') { // Google/Bing
                        finalQueryParts.push(`${op.operator}${term.substring(5)}`);
                        foundMatch = true; break;
                    } else if (op.operator === 'hostname:' && op.category === 'Domain & Host') { // Shodan/BinaryEdge
                        finalQueryParts.push(`${op.operator}${term.substring(5)}`);
                        foundMatch = true; break;
                    } else if (op.operator === 'domain=' && op.category === 'Domain & Host') { // FOFA
                        finalQueryParts.push(`${op.operator}"${term.substring(5)}"`);
                        foundMatch = true; break;
                    } else if (op.operator === 'repo:' && op.category === 'Domain & Host') { // GitHub
                        finalQueryParts.push(`${op.operator}${term.substring(5)}`);
                        foundMatch = true; break;
                    } else if (op.operator === 'host:' && op.category === 'Domain & Host') { // IntelX
                        finalQueryParts.push(`${op.operator}${term.substring(5)}`);
                        foundMatch = true; break;
                    }
                }
                else if (term.startsWith('filetype:')) {
                    if (op.operator === 'filetype:' && op.category === 'Code & Files') { // Google/Bing
                        finalQueryParts.push(`${op.operator}${term.substring(9)}`);
                        foundMatch = true; break;
                    } else if (op.operator === 'extension:' && op.category === 'Code & Files') { // GitHub
                        finalQueryParts.push(`${op.operator}${term.substring(9)}`);
                        foundMatch = true; break;
                    } else if (op.operator === 'product:' && op.category === 'Technical') { // Shodan
                        finalQueryParts.push(`${op.operator}${term.substring(9)}`);
                        foundMatch = true; break;
                    } else if (op.operator === 'type:' && op.category === 'Code & Files') { // Pastebin
                        finalQueryParts.push(`${op.operator}${term.substring(9)}`);
                        foundMatch = true; break;
                    }
                }
                else if (term.startsWith('intitle:')) {
                    const value = term.substring(8);
                    if (op.operator === 'intitle:' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'http.title:' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'title=' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'in:file' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator} ${value}`); foundMatch = true; break;
                    }
                }
                else if (term.startsWith('inurl:')) {
                    const value = term.substring(6);
                    if (op.operator === 'inurl:' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'contains:' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'host=' && op.category === 'Domain & Host') { // FOFA
                        finalQueryParts.push(`${op.operator}"${value}"`); foundMatch = true; break;
                    }
                }
                else if (term.startsWith('intext:')) {
                    const value = term.substring(7);
                    if (op.operator === 'intext:' && op.category === 'Content Search') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'body=' && op.category === 'Content Search') { // FOFA
                        finalQueryParts.push(`${op.operator}"${value}"`); foundMatch = true; break;
                    } else if (op.operator === 'in:file' && op.category === 'Content Search') { // GitHub
                        finalQueryParts.push(`${op.operator} ${value}`); foundMatch = true; break;
                    }
                }
                else if (term.startsWith('port:')) {
                    const value = term.substring(5);
                    if (op.operator === 'port:' && op.category === 'Technical') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'services.port:' && op.category === 'Technical') { // Censys
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'port=' && op.category === 'Technical') { // FOFA
                        finalQueryParts.push(`${op.operator}"${value}"`); foundMatch = true; break;
                    }
                }
                else if (term.startsWith('country:')) {
                    const value = term.substring(8);
                    if (op.operator === 'country:' && op.category === 'Location & Organization') {
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'location.country:' && op.category === 'Location & Organization') { // Censys
                        finalQueryParts.push(`${op.operator}"${value}"`); foundMatch = true; break;
                    } else if (op.operator === 'country=' && op.category === 'Location & Organization') { // FOFA
                        finalQueryParts.push(`${op.operator}"${value}"`); foundMatch = true; break;
                    }
                }
                // Handle specific operator conversions like vuln:, asn: etc.
                else if (term.startsWith('vuln:')) {
                    const value = term.substring(5);
                    if (op.operator === 'vulnerability:' && op.category === 'Technical') { // ZoomEye, BinaryEdge
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'vuln:' && op.category === 'Technical') { // Shodan
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    }
                }
                else if (term.startsWith('ASN:') || term.startsWith('asn:')) {
                    const value = term.substring(4);
                    if (op.operator === 'asn:' && op.category === 'Location & Organization') { // BinaryEdge
                        finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                    } else if (op.operator === 'autonomous_system.name:' && op.category === 'Location & Organization') { // Censys
                        finalQueryParts.push(`${op.operator}"${value}"`); foundMatch = true; break;
                    }
                }
                else if (term.startsWith('type:') && toEngine === 'intelx') {
                     const value = term.substring(5);
                     if (op.operator === 'type:' && op.category === 'Technical') {
                         finalQueryParts.push(`${op.operator}${value}`); foundMatch = true; break;
                     }
                }
                else if (term.startsWith('AROUND(')) { // Proximity
                    if (op.operator === 'AROUND(n)' && op.category === 'Basic Search') {
                        finalQueryParts.push(term); // Keep as is if target supports
                        foundMatch = true; break;
                    }
                }
            }

            if (!foundMatch) {
                // If no specific operator match, try to add as a generic term
                finalQueryParts.push(term);
            }
        });

        convertedQuery = finalQueryParts.join(' ').replace(/\s+/g, ' ').trim();

        // Final cleanup for potential multiple spaces or leading/trailing operators
        convertedQuery = convertedQuery.replace(/\s+/g, ' ').trim();
        // Remove trailing operator if it stands alone without a value after conversion
        if (convertedQuery.match(/(?:\w+[:=]|"[^"]*"=|\b(?:OR|AND|AROUND)\b)\s*$/i)) {
             convertedQuery = convertedQuery.replace(/(?:\w+[:=]|"[^"]*"=|\b(?:OR|AND|AROUND)\b)\s*$/i, '').trim();
        }

        return convertedQuery || 'Query conversion not available or exact.';
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

        document.getElementById('save-query-modal').style.display = 'flex';
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

    // Render category sidebar for templates
    renderTemplateCategories() {
        const sidebar = document.getElementById('template-category-sidebar');
        if (!sidebar) return;

        const categories = {};
        this.templates.forEach(t => {
            categories[t.category] = categories[t.category] ? categories[t.category] + 1 : 1;
        });

        // Add 'All Categories' option
        let categoryHtml = `
            <div class="category-item ${this.currentTemplateCategory === 'all' ? 'active' : ''}"
                 onclick="dorkAssistant.filterTemplatesByCategory('all')">
                <i class="fas fa-th-large"></i> All Categories (${this.templates.length})
            </div>
        `;

        Object.entries(categories).sort().forEach(([cat, count]) => {
            categoryHtml += `
                <div class="category-item ${this.currentTemplateCategory === cat ? 'active' : ''}"
                     onclick="dorkAssistant.filterTemplatesByCategory('${cat}')">
                    <i class="${this.getCategoryIcon(cat)}"></i> ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${count})
                </div>
            `;
        });
        sidebar.innerHTML = categoryHtml;
        sidebar.style.height = 'auto'; // Ensure height adjusts to content
    }

    // New method to filter templates by category from sidebar
    filterTemplatesByCategory(category) {
        this.currentTemplateCategory = category;
        this.renderTemplates(); // Re-render templates based on new category
        this.renderTemplateCategories(); // Re-render sidebar to update active state
    }

    // Helper to get icon for categories (optional, but good for design)
    getCategoryIcon(category) {
        switch (category) {
            case 'databases': return 'fas fa-database';
            case 'login': return 'fas fa-sign-in-alt';
            case 'cloud': return 'fas fa-cloud';
            case 'files': return 'fas fa-file-alt';
            case 'vulnerabilities': return 'fas fa-bug';
            case 'iot': return 'fas fa-wifi';
            case 'social': return 'fas fa-share-alt';
            case 'government': return 'fas fa-university';
            case 'data leaks': return 'fas fa-shield-virus'; // Changed icon for data leaks
            case 'osint': return 'fas fa-user-secret';
            case 'network': return 'fas fa-network-wired';
            default: return 'fas fa-folder';
        }
    }

    // Render templates
    renderTemplates() {
        const templatesContainer = document.getElementById('templates-grid'); // Still refers to the main container
        const engineFilter = document.getElementById('template-engine').value;

        let filteredTemplates = this.templates;

        // Use currentTemplateCategory for filtering
        if (this.currentTemplateCategory && this.currentTemplateCategory !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.category === this.currentTemplateCategory);
        }

        if (engineFilter !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.engines.includes(engineFilter));
        }

        templatesContainer.innerHTML = '';
        templatesContainer.className = 'templates-list'; // Apply the new list class

        if (filteredTemplates.length === 0) {
            templatesContainer.innerHTML = '<p class="no-templates-message">No templates found matching the selected filters.</p>';
            return;
        }

        filteredTemplates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-list-item'; // Use the new list item class
            templateItem.innerHTML = `
                <div class="template-info">
                    <h4>${template.name}</h4>
                    <p>${template.description}</p>
                    <div class="template-query">
                        <code>${this.highlightPlaceholders(template.query)}</code>
                    </div>
                    <div class="template-meta">
                        <span class="template-category">${template.category.charAt(0).toUpperCase() + template.category.slice(1)}</span>
                        <div class="template-engines">
                            ${template.engines.map(engine =>
                                `<span class="engine-tag">${this.searchEngines[engine].name}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="template-tags">
                        ${template.tags.map(tag =>
                            `<span class="template-tag">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="template-actions">
                    <button onclick="dorkAssistant.useTemplate(${template.id})" class="btn-primary">
                        <i class="fas fa-play-circle"></i> Use
                    </button>
                    <button onclick="dorkAssistant.editTemplate(${template.id})" class="btn-secondary">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="dorkAssistant.deleteTemplate(${template.id})" class="btn-danger">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            templatesContainer.appendChild(templateItem);
        });
    }

    // Use template
    useTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        // Check for variables and prompt user for input
        const variablePattern = /\{\{(\w+)\}\}/g;
        let queryToUse = template.query;
        let match;
        const variables = new Set();

        while ((match = variablePattern.exec(template.query)) !== null) {
            variables.add(match[1]); // e.g., "SSH_VERSION", "EMAIL_DOMAIN"
        }

        if (variables.size > 0) {
            let userInputs = {};
            for (const varName of variables) {
                const input = prompt(`Enter value for ${varName.replace(/_/g, ' ').toLowerCase()}:`);
                if (input === null) { // User cancelled the prompt
                    this.showNotification('Template loading cancelled.', 'info');
                    return;
                }
                userInputs[varName] = input;
            }
            // Replace placeholders with user inputs
            queryToUse = template.query.replace(variablePattern, (match, varName) => userInputs[varName] || '');
        }


        // Switch to query builder tab
        this.showDorkTab('query-builder');

        // Set the query
        document.getElementById('generated-query').value = queryToUse;

        // Try to set compatible engine
        if (template.engines.includes(this.currentEngine)) {
            // Current engine is compatible
            document.getElementById('search-engine').value = this.currentEngine; // Ensure selector reflects
        } else if (template.engines.length > 0) {
            // Switch to first compatible engine
            document.getElementById('search-engine').value = template.engines[0];
        } else {
            // Fallback if no engines are defined for template (shouldn't happen with validation)
            document.getElementById('search-engine').value = 'google';
        }
        this.updateQuerySyntax(); // This will re-render operators
        this.populateQueryBuilderFromLoadedQuery(queryToUse, document.getElementById('search-engine').value);


        this.showNotification(`Template "${template.name}" loaded!`, 'success');
    }

    // Filter templates
    filterTemplates() {
        // This method will now primarily trigger re-rendering of templates based on selected filters (engine)
        // Category filtering is handled by `filterTemplatesByCategory`
        this.renderTemplates();
    }

    // Show add template modal
    showAddTemplateModal() {
        // Populate engine checkboxes
        const engineCheckboxesDiv = document.querySelector('#add-template-modal .checkbox-group');
        engineCheckboxesDiv.innerHTML = '';
        Object.entries(this.searchEngines).forEach(([key, engine]) => {
            // Skip Pastebin if it uses Google site search as its primary function
            // if (key === 'pastebin') return; 
            engineCheckboxesDiv.innerHTML += `
                <label><input type="checkbox" value="${key}"> ${engine.name}</label>
            `;
        });
        document.getElementById('add-template-modal').style.display = 'flex';
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
        this.renderTemplateCategories(); // Update categories list
        this.closeAddTemplateModal();
        this.showNotification('Template saved successfully!', 'success');
    }

    // NEW: Edit Template function
    editTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) {
            this.showNotification('Template not found.', 'error');
            return;
        }

        // Populate the edit modal fields
        document.getElementById('editTemplateName').value = template.name;
        document.getElementById('editTemplateDescription').value = template.description;
        document.getElementById('editQueryText').value = template.query;
        document.getElementById('editTemplateCategory').value = template.category;
        document.getElementById('editTemplateTags').value = template.tags.join(', ');

        // Populate compatible engines checkboxes
        const editCompatibleEnginesDiv = document.getElementById('editCompatibleEngines');
        editCompatibleEnginesDiv.innerHTML = ''; // Clear previous checkboxes
        Object.entries(this.searchEngines).forEach(([key, engine]) => {
            // Skip Pastebin if it uses Google site search as its primary function
            // if (key === 'pastebin') return; 
            const isChecked = template.engines.includes(key) ? 'checked' : '';
            editCompatibleEnginesDiv.innerHTML += `
                <label><input type="checkbox" value="${key}" ${isChecked}> ${engine.name}</label>
            `;
        });

        // Set the template ID on the save button for easy retrieval during save
        document.getElementById('editSaveTemplateBtn').dataset.templateId = templateId;

        // Update initial live preview
        this.updateEditPreview();

        // Show the modal
        document.getElementById('editTemplateModal').style.display = 'flex';
    }

    // NEW: Update Live Preview in Edit Template Modal
    updateEditPreview() {
        const queryText = document.getElementById('editQueryText').value;
        const placeholderValue = document.getElementById('editPlaceholderValue').value;
        const livePreviewElement = document.getElementById('editLivePreview');

        let previewQuery = queryText;

        // Replace all {{VARIABLES}} with the placeholder value
        if (placeholderValue) {
            previewQuery = queryText.replace(/\{\{(\w+)\}\}/g, placeholderValue);
        }

        livePreviewElement.innerHTML = this.highlightPlaceholders(previewQuery);
    }

    // NEW: Execute Previewed Query in Edit Template Modal
    executeEditPreview() {
        const previewQuery = document.getElementById('editLivePreview').textContent; // Use textContent to get raw query
        
        // Find the current engine (assuming it's the one selected in the main Dork Assistant, or default to Google if not set)
        const currentEngineSelect = document.getElementById('search-engine');
        const currentEngineKey = currentEngineSelect ? currentEngineSelect.value : 'google';
        const engine = this.searchEngines[currentEngineKey];

        if (!engine) {
            this.showNotification('Could not determine search engine for preview.', 'error');
            return;
        }

        let url = engine.url + encodeURIComponent(previewQuery);

        if (currentEngineKey === 'fofa') {
            url = engine.url + btoa(previewQuery);
        }

        window.open(url, '_blank');
        this.showNotification('Executing previewed query!', 'info');
    }

    // NEW: Save Edited Template
    saveEditedTemplate() {
        const templateId = parseInt(document.getElementById('editSaveTemplateBtn').dataset.templateId);
        const templateIndex = this.templates.findIndex(t => t.id === templateId);

        if (templateIndex === -1) {
            this.showNotification('Error: Template not found for editing.', 'error');
            return;
        }

        const name = document.getElementById('editTemplateName').value.trim();
        const description = document.getElementById('editTemplateDescription').value.trim();
        const query = document.getElementById('editQueryText').value.trim();
        const category = document.getElementById('editTemplateCategory').value;
        const tags = document.getElementById('editTemplateTags').value.trim();

        if (!name || !query) {
            this.showNotification('Please fill in required fields (Name and Query).', 'warning');
            return;
        }

        // Get selected engines from edit modal's checkboxes
        const editEngineCheckboxes = document.querySelectorAll('#editCompatibleEngines input[type="checkbox"]:checked');
        const engines = Array.from(editEngineCheckboxes).map(cb => cb.value);

        if (engines.length === 0) {
            this.showNotification('Please select at least one compatible engine.', 'warning');
            return;
        }

        // Update the template object
        this.templates[templateIndex].name = name;
        this.templates[templateIndex].description = description;
        this.templates[templateIndex].query = query;
        this.templates[templateIndex].category = category;
        this.templates[templateIndex].engines = engines;
        this.templates[templateIndex].tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        this.saveTemplates();
        this.renderTemplates();
        this.renderTemplateCategories(); // Re-render sidebar as categories might change
        this.closeEditTemplateModal();
        this.showNotification('Template updated successfully!', 'success');
    }

    // NEW: Close Edit Template Modal
    closeEditTemplateModal() {
        document.getElementById('editTemplateModal').style.display = 'none';
        // Reset form fields if necessary or rely on next edit to overwrite
    }


    // Delete template (now uses custom modal)
    deleteTemplate(templateId) {
        this.showDeleteConfirmModal(templateId, 'template');
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
                q.query.toLowerCase().includes(searchTerm) ||
                q.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        if (engineFilter !== 'all') {
            filteredQueries = filteredQueries.filter(q => q.engine === engineFilter);
        }

        savedQueriesList.innerHTML = '';

        if (filteredQueries.length === 0) {
            savedQueriesList.innerHTML = '<p class="no-queries-message">No saved queries found matching the selected filters.</p>';
            return;
        }

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
                    <code>${this.highlightPlaceholders(query.query)}</code>
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
    }

    // Load saved query
    loadSavedQuery(queryId) {
        const query = this.savedQueries.find(q => q.id === queryId);
        if (!query) return;

        // Switch to query builder tab
        this.showDorkTab('query-builder');

        // Set engine and query
        document.getElementById('search-engine').value = query.engine;
        this.updateQuerySyntax(); // This will re-render operators
        document.getElementById('generated-query').value = query.query;

        // Attempt to populate operator fields from loaded query for better editing experience
        this.populateQueryBuilderFromLoadedQuery(query.query, query.engine);


        this.showNotification(`Query "${query.name}" loaded!`, 'success');
    }

    // Helper to parse and populate the query builder form from a loaded query string
    populateQueryBuilderFromLoadedQuery(queryString, engineKey) {
        const engineOperators = this.searchEngines[engineKey].operators;
        let remainingQuery = queryString;

        // Clear existing inputs
        document.getElementById('basic-terms').value = '';
        document.querySelectorAll('.operator-field input').forEach(input => input.value = '');

        // Sort operators by length of operator string (descending) to match longer operators first
        const sortedOperators = Object.values(engineOperators).sort((a, b) => (b.operator || '').length - (a.operator || '').length);

        sortedOperators.forEach(operatorConfig => {
            const op = operatorConfig.operator;
            const suffix = operatorConfig.suffix || '';

            if (!op && operatorConfig.placeholder) { // Handle generic keywords like in Pastebin/IntelX
                // This is a heuristic for general terms in engines like pastebin/intelx that don't use prefixes
                // If the placeholder is found directly in the query, assume it's a "basic term"
                // For now, prioritize explicit operators.
                return;
            }

            // Escape special regex characters in the operator and suffix
            const escapedOp = op ? op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
            const escapedSuffix = suffix ? suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';

            let regex;
            if (op && suffix) { // Operators with a fixed suffix like filetype:pdf or Exact Phrase: "value"
                if (op === '"' && suffix === '"') { // Exact Phrase special handling
                    regex = new RegExp(`${escapedOp}(.*?)${escapedSuffix}`, 'g');
                } else {
                    regex = new RegExp(`${escapedOp}([^\\s]+)${escapedSuffix}`, 'g');
                }
            } else if (op) { // Standard operators like site: example.com or intitle:"some title"
                regex = new RegExp(`${escapedOp}(?:([^\\s"']+|"[^"]+"|'[^']+')\\s*)?`, 'g'); // Optional value, consumes trailing space
            } else { // Handle empty operator for general terms, should be part of basic-terms
                return;
            }

            const matches = [...remainingQuery.matchAll(regex)];

            // Process matches from right to left to avoid issues with overlapping matches
            for (let i = matches.length - 1; i >= 0; i--) {
                const match = matches[i];
                let value = match[1] || ''; // Value is typically the first capturing group

                // Remove quotes from captured value
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }

                const inputElement = document.querySelector(
                    `.operator-field input[data-operator="${op}"][data-suffix="${suffix}"]`
                );

                if (inputElement && value) {
                    inputElement.value = value;
                    // Remove the matched part from the remaining query string
                    remainingQuery = remainingQuery.substring(0, match.index) +
                                     remainingQuery.substring(match.index + match[0].length);
                } else if (inputElement && !value && op && op.endsWith(':')) {
                    // Handle cases where operator like 'cache:' is present but no value was provided
                    inputElement.value = ''; // Clear it if no value was parsed
                    remainingQuery = remainingQuery.substring(0, match.index) +
                                     remainingQuery.substring(match.index + match[0].length);
                }
            }
        });

        // The remaining part of the query is considered basic terms
        document.getElementById('basic-terms').value = remainingQuery.trim();
        this.buildQuery(); // Rebuild the query after populating
    }


    // Function to highlight placeholders in query text for display
    highlightPlaceholders(query) {
        return query.replace(/\{\{(\w+)\}\}/g, '<span class="placeholder-variable">$&</span>');
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

    // Delete saved query (now uses custom modal)
    deleteSavedQuery(queryId) {
        this.showDeleteConfirmModal(queryId, 'savedQuery');
    }

    // Filter saved queries
    filterSavedQueries() {
        this.renderSavedQueries();
    }

    // NEW: Show custom delete confirmation modal
    showDeleteConfirmModal(id, type) {
        this.itemToDelete = id;
        this.itemTypeToDelete = type;
        const messageElement = document.getElementById('deleteMessage');
        if (type === 'template') {
            messageElement.textContent = 'Are you sure you want to delete this template? This action cannot be undone.';
        } else if (type === 'savedQuery') {
            messageElement.textContent = 'Are you sure you want to delete this saved query? This action cannot be undone.';
        }
        document.getElementById('deleteModal').style.display = 'flex';
    }

    // NEW: Close custom delete confirmation modal
    closeDeleteConfirmModal() {
        this.itemToDelete = null;
        this.itemTypeToDelete = null;
        document.getElementById('deleteModal').style.display = 'none';
    }

    // NEW: Perform deletion after confirmation
    performDeletion() {
        if (this.itemTypeToDelete === 'template') {
            this.templates = this.templates.filter(t => t.id !== this.itemToDelete);
            this.saveTemplates();
            this.renderTemplates();
            this.renderTemplateCategories();
            this.showNotification('Template deleted successfully!', 'success');
        } else if (this.itemTypeToDelete === 'savedQuery') {
            this.savedQueries = this.savedQueries.filter(q => q.id !== this.itemToDelete);
            this.saveSavedQueries();
            this.renderSavedQueries();
            this.showNotification('Saved query deleted successfully!', 'success');
        }
        this.closeDeleteConfirmModal();
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
        // Find or create notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container'; // Class from styles.css
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`; // Use classes from styles.css
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.closest('.notification').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(notification);

        // Animate in (using CSS transitions defined in styles.css)
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove after 3 seconds with slide out animation
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)'; // Slide out to the right
            notification.addEventListener('transitionend', () => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, { once: true });
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-bell';
        }
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
    // Set Query Builder as active by default on page load
    window.dorkAssistant.showDorkTab('query-builder');
});