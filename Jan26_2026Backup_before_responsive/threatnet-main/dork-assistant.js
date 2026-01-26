// Dork Assistant - Advanced Query Builder for Multiple Search Engines
class DorkAssistant {
    constructor() {
        this.currentEngine = 'google';
        this.templates = this.loadTemplates();
        this.savedQueries = this.loadSavedQueries();
        this.currentTemplateCategory = 'all'; // Initialize current category filter
        this.itemToDelete = null; // Stores the ID of the item to be deleted
        this.itemTypeToDelete = null; // Stores the type of item ('template' or 'savedQuery')
        this.auditLog = this.loadAuditLog(); // Initialize audit log

        // NEW: Raw Data Analyzer properties
        this.extractedEntities = {
            urls: [],
            ips: [],
            emails: [],
            credentials: [],
            file_paths: [],
            custom: []
        };
        this.selectedEntity = {
            value: null,
            type: null
        };

        // NEW: Regex patterns for entity extraction
        this.regexPatterns = {
            url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi,
            ip: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b(?::\d+)?/g, // Also captures port
            email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
            credential: /(password|passwd|pwd|secret|api_key|access_key|auth_token|bearer_token|private_key|client_secret|db_pass|s3_key|ssh_key|ftp_pass|admin_pass)[=\s:]{0,3}([\w\d\S]{8,64})(?:[\s;"'`,\n]|$)/gmi, // General, multi-line, case-insensitive
            aws_key: /(AKIA|ASIA|AGIA|AIDA)[0-9A-Z]{16}/g,
            s3_bucket: /(s3\.amazonaws\.com\/|s3:\/\/)([a-zA-Z0-9\-\.]{3,63})/g,
            sensitive_path: /(\/(etc|var|home|root|admin|config|logs|backup|data)\/([\w\-\.\/]+)?\.(env|conf|log|sql|bak|zip|rar|7z|tgz|tar|gz|txt|json|xml|csv|yml|yaml|ini|php|js|css|py|rb|go|java|c|cpp|h|hpp|md|pdf|doc|docx|xls|xlsx)|(\.env|\.git\/config|\.hg\/hgrc|wp-config\.php|web\.config|database\.yml|config\.inc\.php))/gi // common files/paths
        };

        this.searchEngines = {
            google: {
                name: 'Google',
                url: 'https://www.google.com/search?q=',
                operators: {
                    'Site Search': { operator: 'site:', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain', 'url'] },
                    'File Type': { operator: 'filetype:', placeholder: 'pdf', category: 'Code & Files', appliesTo: ['file'] },
                    'In Title': { operator: 'intitle:', placeholder: 'admin login', category: 'Content Search', appliesTo: ['webapp', 'credential', 'general'] },
                    'In URL': { operator: 'inurl:', placeholder: 'admin', category: 'Content Search', appliesTo: ['webapp', 'credential', 'file'] },
                    'In Text': { operator: 'intext:', placeholder: 'password', category: 'Content Search', appliesTo: ['credential', 'general', 'file', 'person', 'organization'] },
                    'Cache': { operator: 'cache:', placeholder: 'example.com', category: 'Other Specific', appliesTo: ['domain', 'url'] },
                    'Related': { operator: 'related:', placeholder: 'example.com', category: 'Other Specific', appliesTo: ['domain', 'url'] },
                    'Exact Phrase': { operator: '"', placeholder: 'exact phrase', suffix: '"', category: 'Basic Search', appliesTo: ['general', 'person', 'organization', 'cve', 'software'] },
                    'Proximity Search': { operator: 'AROUND(n)', placeholder: 'word1 AROUND(5) word2', description: 'Finds words within N words of each other.', category: 'Basic Search', appliesTo: ['general'] },
                    'In Anchor': { operator: 'inanchor:', placeholder: 'login', description: 'Searches for text within anchor text of links.', category: 'Content Search', appliesTo: ['webapp'] },
                    'In Subject': { operator: 'insubject:', placeholder: 'password reset', description: 'Searches for text in the subject of indexed pages.', category: 'Content Search', appliesTo: ['general'] },
                    'Daterange': { operator: 'daterange:', placeholder: '2459000-2459005', description: 'Searches within a specific Julian date range.', category: 'Time & Date', appliesTo: ['general'] }
                }
            },
            bing: {
                name: 'Bing',
                url: 'https://www.bing.com/search?q=',
                operators: {
                    'Site Search': { operator: 'site:', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain', 'url'] },
                    'File Type': { operator: 'filetype:', placeholder: 'pdf', category: 'Code & Files', appliesTo: ['file'] },
                    'In Title': { operator: 'intitle:', placeholder: 'admin login', category: 'Content Search', appliesTo: ['webapp', 'credential', 'general'] },
                    'In URL': { operator: 'inurl:', placeholder: 'admin', category: 'Content Search', appliesTo: ['webapp', 'credential', 'file'] },
                    'In Text': { operator: 'intext:', placeholder: 'password', category: 'Content Search', appliesTo: ['credential', 'general', 'file', 'person', 'organization'] },
                    'Contains': { operator: 'contains:', placeholder: 'login', category: 'Content Search', appliesTo: ['content'] },
                    'IP Address': { operator: 'ip:', placeholder: '192.168.1.1', category: 'Location & Organization', appliesTo: ['ip'] },
                    'Language': { operator: 'language:', placeholder: 'en', description: 'Filters results by language.', category: 'Other Specific', appliesTo: ['general'] },
                    'Feed': { operator: 'feed:', placeholder: 'example.com/rss.xml', description: 'Searches within RSS or Atom feeds.', category: 'Domain & Host', appliesTo: ['domain', 'url'] }
                }
            },
            shodan: {
                name: 'Shodan',
                url: 'https://www.shodan.io/search?query=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '22', category: 'Technical', appliesTo: ['ip', 'network'] },
                    'Country': { operator: 'country:', placeholder: 'US', category: 'Location & Organization', appliesTo: ['location'] },
                    'City': { operator: 'city:', placeholder: 'New York', category: 'Location & Organization', appliesTo: ['location'] },
                    'Organization': { operator: 'org:', placeholder: 'Google', category: 'Location & Organization', appliesTo: ['organization'] },
                    'Hostname': { operator: 'hostname:', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain'] },
                    'Product': { operator: 'product:', placeholder: 'Apache', category: 'Technical', appliesTo: ['webapp', 'software', 'network', 'iot'] },
                    'Version': { operator: 'version:', placeholder: '2.4', category: 'Technical', appliesTo: ['webapp', 'software', 'network', 'iot'] },
                    'Operating System': { operator: 'os:', placeholder: 'Windows', category: 'Technical', appliesTo: ['software'] },
                    'Net': { operator: 'net:', placeholder: '192.168.1.0/24', category: 'Location & Organization', appliesTo: ['ip', 'network'] },
                    'Before Date': { operator: 'before:', placeholder: '01/01/2023', category: 'Time & Date', appliesTo: ['general'] },
                    'After Date': { operator: 'after:', placeholder: '01/01/2023', category: 'Time & Date', appliesTo: ['general'] },
                    'Vulnerability (CVE)': { operator: 'vuln:', placeholder: 'CVE-2021-1234', description: 'Search for specific CVEs.', category: 'Technical', appliesTo: ['cve'] },
                    'HTTP Title': { operator: 'http.title:', placeholder: 'Admin Panel', description: 'Search for text in HTTP titles.', category: 'Content Search', appliesTo: ['webapp', 'general'] },
                    'SSL Subject CN': { operator: 'ssl.cert.subject.cn:', placeholder: '*.example.com', description: 'Search for common name in SSL certificate subject.', category: 'SSL/TLS', appliesTo: ['domain', 'url'] },
                    'SMTP Mail': { operator: 'smtp.mail:', placeholder: 'example.com', description: 'Search for SMTP banner mail field.', category: 'Email & Communication', appliesTo: ['domain', 'email'] }
                }
            },
            censys: {
                name: 'Censys',
                url: 'https://search.censys.io/search?resource=hosts&q=',
                operators: {
                    'Services Port': { operator: 'services.port:', placeholder: '80', category: 'Technical', appliesTo: ['ip', 'network'] },
                    'Services Service': { operator: 'services.service_name:', placeholder: 'HTTP', category: 'Technical', appliesTo: ['webapp', 'software'] },
                    'Location Country': { operator: 'location.country:', placeholder: 'United States', category: 'Location & Organization', appliesTo: ['location'] },
                    'Location City': { operator: 'location.city:', placeholder: 'New York', category: 'Location & Organization', appliesTo: ['location'] },
                    'Autonomous System': { operator: 'autonomous_system.name:', placeholder: 'Google', category: 'Location & Organization', appliesTo: ['organization'] },
                    'DNS Names': { operator: 'dns.names:', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain'] },
                    'Operating System': { operator: 'operating_system.product:', placeholder: 'Linux', category: 'Technical', appliesTo: ['software'] },
                    'TLS Certificate': { operator: 'services.tls.certificates.leaf_data.subject.common_name:', placeholder: 'example.com', category: 'SSL/TLS', appliesTo: ['domain', 'url'] },
                    'Tags': { operator: 'tags:', placeholder: 'iot', description: 'Search for hosts with specific tags.', category: 'Technical', appliesTo: ['iot'] },
                    'Protocols': { operator: 'protocols:', placeholder: '443/https', description: 'Search by protocol and port.', category: 'Technical', appliesTo: ['ip', 'network'] }
                }
            },
            zoomeye: {
                name: 'ZoomEye',
                url: 'https://www.zoomeye.org/searchResult?q=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '80', category: 'Technical', appliesTo: ['ip', 'network'] },
                    'Service': { operator: 'service:', placeholder: 'http', category: 'Technical', appliesTo: ['webapp', 'software'] },
                    'Country': { operator: 'country:', placeholder: 'US', category: 'Location & Organization', appliesTo: ['location'] },
                    'City': { operator: 'city:', placeholder: 'New York', category: 'Location & Organization', appliesTo: ['location'] },
                    'Organization': { operator: 'org:', placeholder: 'Google', category: 'Location & Organization', appliesTo: ['organization'] },
                    'Hostname': { operator: 'hostname:', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain'] },
                    'Device': { operator: 'device:', placeholder: 'router', category: 'Technical', appliesTo: ['iot', 'network'] },
                    'Operating System': { operator: 'os:', placeholder: 'Linux', category: 'Technical', appliesTo: ['software'] },
                    'App': { operator: 'app:', placeholder: 'nginx', description: 'Search for web application name.', category: 'Technical', appliesTo: ['webapp', 'software'] },
                    'Vulnerability': { operator: 'vulnerability:', placeholder: 'CVE-2021-1234', description: 'Search for known vulnerabilities.', category: 'Technical', appliesTo: ['cve'] }
                }
            },
            fofa: {
                name: 'FOFA',
                url: 'https://fofa.so/result?qbase64=',
                operators: {
                    'Port': { operator: 'port=', placeholder: '80', category: 'Technical', appliesTo: ['ip', 'network'] },
                    'Protocol': { operator: 'protocol=', placeholder: 'http', category: 'Technical', appliesTo: ['ip', 'network'] },
                    'Country': { operator: 'country=', placeholder: 'US', category: 'Location & Organization', appliesTo: ['location'] },
                    'Region': { operator: 'region=', placeholder: 'California', category: 'Location & Organization', appliesTo: ['location'] },
                    'City': { operator: 'city=', placeholder: 'San Francisco', category: 'Location & Organization', appliesTo: ['location'] },
                    'Organization': { operator: 'org=', placeholder: 'Google', category: 'Location & Organization', appliesTo: ['organization'] },
                    'Domain': { operator: 'domain=', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain'] },
                    'Host': { operator: 'host=', placeholder: 'example.com', category: 'Domain & Host', appliesTo: ['domain', 'ip'] }, // FOFA host can be IP or domain
                    'Title': { operator: 'title=', placeholder: 'Admin Panel', category: 'Content Search', appliesTo: ['webapp', 'general'] },
                    'Body': { operator: 'body=', placeholder: 'login', category: 'Content Search', appliesTo: ['credential', 'general'] },
                    'Header': { operator: 'header=', placeholder: 'Server', description: 'Search for text in HTTP headers.', category: 'Content Search', appliesTo: ['general'] },
                    'Cert': { operator: 'cert=', placeholder: 'Google', description: 'Search for SSL certificate issuer.', category: 'SSL/TLS', appliesTo: ['domain', 'url'] }
                }
            },
            github: {
                name: 'GitHub',
                url: 'https://github.com/search?q=',
                operators: {
                    'In File': { operator: 'in:file', placeholder: 'password', category: 'Code & Files', appliesTo: ['file', 'credential', 'general'] },
                    'In Path': { operator: 'in:path', placeholder: 'config', category: 'Code & Files', appliesTo: ['file'] },
                    'Filename': { operator: 'filename:', placeholder: '.env', category: 'Code & Files', appliesTo: ['file'] },
                    'Extension': { operator: 'extension:', placeholder: 'sql', category: 'Code & Files', appliesTo: ['file'] },
                    'Language': { operator: 'language:', placeholder: 'python', category: 'Code & Files', appliesTo: ['software'] },
                    'User': { operator: 'user:', placeholder: 'username', category: 'Other Specific', appliesTo: ['person', 'social'] },
                    'Organization': { operator: 'org:', placeholder: 'organization', category: 'Other Specific', appliesTo: ['organization'] },
                    'Repository': { operator: 'repo:', placeholder: 'user/repo', category: 'Domain & Host', appliesTo: ['domain'] },
                    'Size': { operator: 'size:', placeholder: '>1000', category: 'Other Specific', appliesTo: ['file'] },
                    'Created': { operator: 'created:', placeholder: '2023-01-01', category: 'Time & Date', appliesTo: ['general'] },
                    'Pushed': { operator: 'pushed:', placeholder: '>2023-01-01', description: 'Last push date.', category: 'Time & Date', appliesTo: ['general'] },
                    'Stars': { operator: 'stars:', placeholder: '>100', description: 'Number of stars.', category: 'Other Specific', appliesTo: ['general'] },
                    'Forks': { operator: 'forks:', placeholder: '>10', description: 'Number of forks.', category: 'Other Specific', appliesTo: ['general'] }
                }
            },
            pastebin: {
                name: 'Pastebin',
                url: 'https://www.google.com/search?q=site:pastebin.com+', // Uses Google site search
                operators: {
                    'Keyword': { operator: '', placeholder: 'email@domain.com', description: 'General keyword search for sensitive data.', category: 'Basic Search', appliesTo: ['general', 'credential', 'email', 'person'] },
                    'Password': { operator: '', placeholder: 'password', category: 'Basic Search', appliesTo: ['credential'] }, // Example for specific keywords
                    'API Key': { operator: '', placeholder: 'api_key', category: 'Basic Search', appliesTo: ['credential'] },
                    'Database': { operator: '', placeholder: 'database dump', category: 'Basic Search', appliesTo: ['file', 'general'] },
                    'Configuration': { operator: '', placeholder: 'config.php', category: 'Basic Search', appliesTo: ['file', 'general'] },
                    'Type': { operator: 'type:', placeholder: 'php', description: 'Paste type (e.g., php, sql).', category: 'Code & Files', appliesTo: ['file'] }
                }
            },
            binaryedge: {
                name: 'BinaryEdge',
                url: 'https://app.binaryedge.io/services/search?q=',
                operators: {
                    'Port': { operator: 'port:', placeholder: '80', category: 'Technical', appliesTo: ['ip', 'network'] },
                    'Service': { operator: 'service:', placeholder: 'http', category: 'Technical', appliesTo: ['webapp', 'software'] },
                    'Country': { operator: 'country:', placeholder: 'US', category: 'Location & Organization', appliesTo: ['location'] },
                    'ASN': { operator: 'asn:', placeholder: 'AS15169', description: 'Autonomous System Number.', category: 'Location & Organization', appliesTo: ['organization', 'ip'] },
                    'Tag': { operator: 'tag:', placeholder: 'iot', description: 'Service tags.', category: 'Technical', appliesTo: ['iot', 'software'] },
                    'IP': { operator: 'ip:', placeholder: '1.1.1.1', description: 'Specific IP address.', category: 'Location & Organization', appliesTo: ['ip'] },
                    'Vulnerability': { operator: 'vulnerability:', placeholder: 'CVE-2022-1234', description: 'Known vulnerabilities.', category: 'Technical', appliesTo: ['cve'] },
                    'Component': { operator: 'component.name:', placeholder: 'nginx', description: 'Software component name.', category: 'Technical', appliesTo: ['webapp', 'software'] },
                    'Header': { operator: 'http.headers:', placeholder: 'Server: Apache', description: 'HTTP headers.', category: 'Content Search', appliesTo: ['general'] },
                    'Title': { operator: 'http.title:', placeholder: 'Dashboard', description: 'HTTP title.', category: 'Content Search', appliesTo: ['webapp', 'general'] }
                }
            },
            intelx: {
                name: 'IntelX',
                url: 'https://public.intelx.io/search?s=',
                operators: {
                    'Term': { operator: '', placeholder: 'email@example.com', description: 'General search term.', category: 'Basic Search', appliesTo: ['general', 'email', 'credential', 'person', 'organization'] },
                    'Type': { operator: 'type:', placeholder: '2', description: 'Data type (e.g., 0=select all, 1=emails, 2=phones).', category: 'Technical', appliesTo: ['email', 'phone'] }, // 'phone' is an example custom type
                    'Date From': { operator: 'datefrom:', placeholder: '2023-01-01', description: 'Start date for results.', category: 'Time & Date', appliesTo: ['general'] },
                    'Date To': { operator: 'dateto:', placeholder: '2023-12-31', description: 'End date for results.', category: 'Time & Date', appliesTo: ['general'] },
                    'Max Results': { operator: 'maxresults:', placeholder: '100', description: 'Maximum number of results.', category: 'Other Specific', appliesTo: ['general'] },
                    'Sort': { operator: 'sort:', placeholder: '0', description: 'Sort order (0=relevance, 1=date desc).', category: 'Other Specific', appliesTo: ['general'] },
                    'Selector': { operator: 'selector:', placeholder: 'email', description: 'Search for specific selectors (e.g., email, phone, BTC).', category: 'Technical', appliesTo: ['email', 'blockchain'] },
                    'Hostname': { operator: 'host:', placeholder: 'example.com', description: 'Search for hostnames.', category: 'Domain & Host', appliesTo: ['domain'] }
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
        this.renderAuditLog(); // Render audit log on initialization
        this._renderSampleDorkSuggestions('', ''); // Initialize with empty state
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
                    query: 'intext:"SQL syntax" OR intext:"mysql_fetch_array()" OR intext:\"Warning: mysql_num_rows()\"',
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
                },
                {
                    id: 16,
                    name: 'WordPress Vulnerabilities',
                    description: 'Identify WordPress sites with known vulnerabilities',
                    query: 'inurl:wp-content OR inurl:wp-includes intitle:\"WordPress\"',
                    category: 'web',
                    engines: ['google', 'bing'],
                    tags: ['wordpress', 'cms', 'vulnerability', 'php']
                },
                {
                    id: 17,
                    name: 'IoT Devices by Manufacturer',
                    description: 'Find specific IoT devices by manufacturer',
                    query: 'product:\"D-Link\" port:80',
                    category: 'iot',
                    engines: ['shodan'],
                    tags: ['iot', 'device', 'manufacturer', 'smart-home']
                },
                {
                    id: 18,
                    name: 'Employee Directories',
                    description: 'Search for exposed employee directories or lists',
                    query: 'intitle:\"employee directory\" OR intitle:\"staff list\"',
                    category: 'people',
                    engines: ['google', 'bing'],
                    tags: ['employee', 'directory', 'staff', 'osint']
                },
                {
                    id: 19,
                    name: 'Google Docs Public',
                    description: 'Find publicly accessible Google Docs',
                    query: 'site:docs.google.com inurl:edit filetype:doc',
                    category: 'cloud',
                    engines: ['google'],
                    tags: ['google-docs', 'cloud', 'public', 'sharing']
                },
                {
                    id: 20,
                    name: 'Exposed AWS S3 Buckets',
                    description: 'Specific search for exposed AWS S3 buckets',
                    query: 'site:.s3.amazonaws.com public',
                    category: 'cloud',
                    engines: ['google'],
                    tags: ['aws', 's3', 'bucket', 'cloud']
                },
                {
                    id: 21,
                    name: 'Social Media OSINT',
                    description: 'Find public social media profiles related to a keyword',
                    query: 'site:twitter.com OR site:linkedin.com \"keyword\"',
                    category: 'social',
                    engines: ['google'],
                    tags: ['social-media', 'osint', 'profile', 'public']
                },
                {
                    id: 22,
                    name: 'Government Tender Documents',
                    description: 'Locate public government tender documents',
                    query: 'site:gov.au filetype:pdf tender OR bid',
                    category: 'government',
                    engines: ['google'],
                    tags: ['government', 'tender', 'procurement', 'public-records']
                },
                {
                    id: 23,
                    name: 'Exposed Log Files',
                    description: 'Find publicly exposed server log files',
                    query: 'filetype:log access_log OR error_log',
                    category: 'files',
                    engines: ['google', 'bing'],
                    tags: ['logs', 'server', 'exposed', 'debug']
                },
                {
                    id: 24,
                    name: 'Vulnerable Jenkins Instances',
                    description: 'Find exposed Jenkins CI/CD servers',
                    query: 'product:Jenkins port:8080',
                    category: 'vulnerabilities',
                    engines: ['shodan', 'censys'],
                    tags: ['jenkins', 'ci/cd', 'exposed', 'devops']
                },
                {
                    id: 25,
                    name: 'IoT Dashboards',
                    description: 'Discover exposed IoT control panels/dashboards',
                    query: 'intitle:\"dashboard\" inurl:iot',
                    category: 'iot',
                    engines: ['google', 'bing'],
                    tags: ['iot', 'dashboard', 'control', 'exposed']
                },
                {
                    id: 26,
                    name: 'Company Contact Lists',
                    description: 'Search for exposed company contact information',
                    query: 'intitle:\"contact us\" OR \"our team\" filetype:xls',
                    category: 'people',
                    engines: ['google', 'bing'],
                    tags: ['company', 'contact', 'employees', 'osint']
                },
                {
                    id: 27,
                    name: 'Git Repositories',
                    description: 'Find exposed .git directories or repository leaks',
                    query: 'inurl:.git/config OR inurl:.git/HEAD',
                    category: 'files',
                    engines: ['google', 'bing'],
                    tags: ['git', 'repository', 'exposed', 'source-code']
                },
                {
                    id: 28,
                    name: 'Blockchain Explorers',
                    description: 'Access public blockchain explorers for crypto investigations',
                    query: 'site:etherscan.io OR site:blockchain.com bitcoin',
                    category: 'crypto',
                    engines: ['google'],
                    tags: ['blockchain', 'crypto', 'bitcoin', 'ethereum']
                },
                {
                    id: 29,
                    name: 'Dark Web Forums (via Clearnet)',
                    description: 'Find mentions or links to dark web forums on clearnet',
                    query: 'site:.onion link:forum OR \"darknet market\"',
                    category: 'dark-web',
                    engines: ['google'],
                    tags: ['darkweb', 'forum', 'market', 'clearnet']
                },
                {
                    id: 30,
                    name: 'Vulnerable Routers',
                    description: 'Identify potentially vulnerable router interfaces',
                    query: 'intitle:\"router setup\" OR \"admin login\" inurl:8080',
                    category: 'network',
                    engines: ['google', 'shodan'],
                    tags: ['router', 'vulnerability', 'network', 'admin']
                },
                {
                    id: 31,
                    name: 'Specific SSH Version via Shodan',
                    description: 'Find SSH servers running a specific version (e.g., for known vulnerabilities)',
                    query: 'port:22 product:OpenSSH version:{{SSH_VERSION}}',
                    category: 'vulnerabilities',
                    engines: ['shodan'],
                    tags: ['ssh', 'version', 'vulnerability']
                },
                {
                    id: 32,
                    name: 'Emails from Specific Domain (IntelX)',
                    description: 'Search for email addresses from a specific domain in IntelX',
                    query: 'type:1 \"{{EMAIL_DOMAIN}}\"',
                    category: 'osint',
                    engines: ['intelx'],
                    tags: ['email', 'osint', 'domain']
                },
                {
                    id: 33,
                    name: 'Apache Struts CVE Search (Shodan)',
                    description: 'Search Shodan for Apache Struts instances vulnerable to a specific CVE',
                    query: 'product:Apache Struts vuln:{{CVE_ID}}',
                    category: 'vulnerabilities',
                    engines: ['shodan'],
                    tags: ['apache', 'struts', 'cve', 'vulnerability']
                },
                {
                    id: 34,
                    name: 'Public Trello Boards',
                    description: 'Find publicly accessible Trello boards that might contain sensitive information',
                    query: 'site:trello.com inurl:board intext:confidential OR password',
                    category: 'cloud',
                    engines: ['google', 'bing'],
                    tags: ['trello', 'collaboration', 'exposed', 'misconfiguration']
                },
                {
                    id: 35,
                    name: 'Exposed ElasticSearch Instances',
                    description: 'Discover publicly accessible ElasticSearch instances',
                    query: 'port:9200 product:ElasticSearch',
                    category: 'databases',
                    engines: ['shodan'],
                    tags: ['elasticsearch', 'database', 'exposed', 'nosql']
                },
                {
                    id: 36,
                    name: 'Microsoft Exchange Web Access',
                    description: 'Find Microsoft Exchange Web Access (OWA) portals',
                    query: 'intitle:\"Outlook Web App\" inurl:owa',
                    category: 'web',
                    engines: ['google', 'bing'],
                    tags: ['exchange', 'owa', 'webmail']
                },
                {
                    id: 37,
                    name: 'Open Jenkins Servers',
                    description: 'Find Jenkins servers that might be openly accessible',
                    query: 'intitle:\"Jenkins\" inurl:jenkins/login',
                    category: 'web',
                    engines: ['google', 'bing'],
                    tags: ['jenkins', 'ci/cd', 'exposed']
                },
                {
                    id: 38,
                    name: 'Exposed Docker Registries',
                    description: 'Identify public or misconfigured Docker registries',
                    query: 'port:5000 \"Docker Registry\"',
                    category: 'cloud',
                    engines: ['shodan'],
                    tags: ['docker', 'registry', 'exposed', 'container']
                },
                {
                    id: 39,
                    name: 'Confidential PDFs',
                    description: 'Search for PDF documents containing the word \'confidential\'',
                    query: 'filetype:pdf confidential',
                    category: 'files',
                    engines: ['google', 'bing'],
                    tags: ['pdf', 'confidential', 'document']
                },
                {
                    id: 40,
                    name: 'Public CCTV Streams',
                    description: 'Find public CCTV camera streams',
                    query: 'inurl:\"/view/viewer_index.shtml\" intitle:\"Live View\"',
                    category: 'iot',
                    engines: ['google'],
                    tags: ['cctv', 'camera', 'stream', 'public']
                },
                {
                    id: 41,
                    name: 'Exposed RDP Servers',
                    description: 'Find systems with exposed RDP (Remote Desktop Protocol)',
                    query: 'port:3389',
                    category: 'remote-access',
                    engines: ['shodan', 'censys', 'zoomeye'],
                    tags: ['rdp', 'remote', 'desktop', 'access']
                },
                {
                    id: 42,
                    name: 'Publicly Accessible FTP Servers',
                    description: 'Find exposed FTP servers allowing anonymous login',
                    query: 'port:21 \"Anonymous FTP login accepted\"',
                    category: 'network',
                    engines: ['shodan', 'censys'],
                    tags: ['ftp', 'filetransfer', 'exposed', 'anonymous']
                },
                {
                    id: 43,
                    name: 'Cisco IOS Devices',
                    description: 'Identify exposed Cisco IOS devices',
                    query: 'product:\"Cisco IOS\" port:8080',
                    category: 'network',
                    engines: ['shodan', 'censys', 'zoomeye'],
                    tags: ['cisco', 'network', 'device', 'router']
                },
                {
                    id: 44,
                    name: "Wayback Machine - All Snapshots for Domain",
                    description: "Find all historical snapshots of a given domain using Wayback Machine via Google.",
                    query: "site:web.archive.org/web/* {{DOMAIN_NAME}}",
                    category: "osint",
                    engines: ["google"],
                    tags: ["wayback machine", "archive", "domain", "osint", "historical data"]
                },
                {
                    id: 45,
                    name: "Wayback Machine - Specific File Type on Domain",
                    description: "Search for specific file types (e.g., PDF, DOCX) on a domain's historical snapshots.",
                    query: "site:web.archive.org/web/* {{DOMAIN_NAME}} filetype:{{FILE_TYPE}}",
                    category: "files",
                    engines: ["google"],
                    tags: ["wayback machine", "archive", "file type", "osint", "historical data"]
                },
                {
                    id: 46,
                    name: "GitHub - Private Key Exposure",
                    description: "Identify repositories containing common private key extensions that might be exposed.",
                    query: "extension:pem OR extension:key OR extension:ppk OR extension:p12 OR filename:id_rsa",
                    category: "code & files",
                    engines: ["github"],
                    tags: ["github", "private key", "credentials", "exposed", "leak", "source code"]
                },
                {
                    id: 47,
                    name: "GitHub - API Key Exposure (Generic)",
                    description: "Search for generic API key patterns in GitHub repositories.",
                    query: "github_token OR api_key OR authorization_key OR client_secret OR consumer_key",
                    category: "code & files",
                    engines: ["github"],
                    tags: ["github", "api key", "token", "credentials", "exposed", "leak"]
                },
                {
                    id: 48,
                    name: "GitHub - SQL Dump/Database Files",
                    description: "Find SQL database dumps or backup files exposed on GitHub.",
                    query: "filename:dump.sql OR extension:sql in:file database password",
                    category: "databases",
                    engines: ["github"],
                    tags: ["github", "sql", "database", "dump", "exposed", "leak"]
                },
                {
                    id: 49,
                    name: "GitHub - History of Deleted Files",
                    description: "Leverage GitHub's history to find content from deleted files (requires manual investigation of results).",
                    query: "in:history \"deleted file\" OR \"removed credentials\" OR \"secret\"",
                    category: "code & files",
                    engines: ["github"],
                    tags: ["github", "history", "deleted files", "leak", "version control"]
                },
                {
                    id: 50,
                    name: "Wayback Machine - Sensitive Keywords",
                    description: "Search Wayback Machine archives for specific sensitive keywords on a domain.",
                    query: "site:web.archive.org/web/* {{DOMAIN_NAME}} (password OR confidential OR secret OR private)",
                    category: "data leaks",
                    engines: ["google"],
                    tags: ["wayback machine", "sensitive data", "keywords", "osint", "data leak"]
                },
                {
                    id: 51,
                    name: "Publicly Exposed .git Folder",
                    description: "Find web servers with exposed .git folders containing repository information.",
                    query: "inurl:.git/HEAD OR inurl:.git/config",
                    category: "files",
                    engines: ["google", "bing"],
                    tags: ["git", "exposed", "repository", "misconfiguration"]
                },
                {
                    id: 52,
                    name: "Open Redirect Vulnerabilities",
                    description: "Discover potential open redirect vulnerabilities on websites.",
                    query: "inurl:redirect= OR inurl:url= OR inurl:next= site:{{TARGET_SITE}}",
                    category: "vulnerabilities",
                    engines: ["google", "bing"],
                    tags: ["vulnerability", "open redirect", "web security"]
                },
                {
                    id: 53,
                    name: "Cross-Site Scripting (XSS) - Reflected",
                    description: "Search for common reflected XSS patterns in URLs.",
                    query: "inurl:\"<script>alert\" OR inurl:\"javascript:alert\" site:{{TARGET_SITE}}",
                    category: "vulnerabilities",
                    engines: ["google", "bing"],
                    tags: ["xss", "vulnerability", "web security", "injection"]
                },
                {
                    id: 54,
                    name: "Exposed Nginx Configuration Files",
                    description: "Locate publicly accessible Nginx configuration files that might reveal server details.",
                    query: "filetype:conf intext:nginx version",
                    category: "files",
                    engines: ["google", "bing"],
                    tags: ["nginx", "config", "exposed", "server"]
                },
                {
                    id: 55,
                    name: "Open Proxy Servers",
                    description: "Identify potentially open proxy servers.",
                    query: "intitle:\"Proxy Server\" inurl:proxy.php OR intext:\"Powered by Squid\"",
                    category: "network",
                    engines: ["google", "bing"],
                    tags: ["proxy", "open proxy", "network"]
                },
                {
                    id: 56,
                    name: "OSINT - Social Media Profiles by Name",
                    description: "Find public social media profiles (Twitter, LinkedIn, Facebook, Instagram) for a given name.",
                    query: "\"{{FULL_NAME}}\" site:twitter.com OR site:linkedin.com OR site:facebook.com OR site:instagram.com",
                    category: "osint",
                    engines: ["google", "bing"],
                    tags: ["osint", "social media", "person", "reconnaissance"]
                },
                {
                    id: 57,
                    name: "OSINT - Company Documents/Presentations",
                    description: "Locate public documents or presentations from a specific company, often containing internal data.",
                    query: "site:{{COMPANY_DOMAIN}} filetype:ppt OR filetype:pptx OR filetype:pdf OR filetype:doc OR filetype:docx (confidential OR internal OR proprietary)",
                    category: "osint",
                    engines: ["google", "bing"],
                    tags: ["osint", "company", "documents", "data leak", "corporate intelligence"]
                },
                {
                    id: 58,
                    name: "OSINT - Email Lists/Spreadsheets",
                    description: "Find spreadsheets or documents containing lists of email addresses.",
                    query: "filetype:xls OR filetype:xlsx OR filetype:csv intext:@{{DOMAIN_NAME}}",
                    category: "osint",
                    engines: ["google", "bing"],
                    tags: ["osint", "email", "list", "spreadsheet", "data leak"]
                },
                {
                    id: 59,
                    name: "OSINT - Forum/Blog Mentions of Entity",
                    description: "Search for mentions of a specific entity (person, company, product) across forums and blogs.",
                    query: "intext:\"{{ENTITY_NAME}}\" (inurl:forum OR inurl:blog OR inurl:comment)",
                    category: "osint",
                    engines: ["google", "bing"],
                    tags: ["osint", "reputation", "mentions", "forum", "blog"]
                },
                {
                    id: 60,
                    name: "GitHub - Exposed SSH Keys",
                    description: "Find public GitHub repositories containing .ssh directories or common SSH key names.",
                    query: "inpath:.ssh id_rsa OR id_dsa OR known_hosts",
                    category: "code & files",
                    engines: ["github"],
                    tags: ["github", "ssh key", "credentials", "exposed", "leak", "source code"]
                },
                {
                    id: 61,
                    name: "GitHub - AWS Credentials Exposure",
                    description: "Search for common AWS credential patterns in GitHub repositories.",
                    query: "aws_access_key_id OR aws_secret_access_key OR \"AKIA\" OR \"ASIA\"",
                    category: "cloud",
                    engines: ["github"],
                    tags: ["github", "aws", "credentials", "exposed", "cloud", "leak"]
                },
                {
                    id: 62,
                    name: "GitHub - Google API Key Exposure",
                    description: "Find Google API keys in public GitHub repositories.",
                    query: "AIza{{GOOGLE_API_KEY_PATTERN}}",
                    category: "cloud",
                    engines: ["github"],
                    tags: ["github", "google api", "api key", "credentials", "exposed", "cloud"]
                },
                {
                    id: 63,
                    name: "Wayback Machine - Domain Whois History",
                    description: "Look for historical WHOIS records via Wayback Machine (may require external WHOIS tools, but directs to archive).",
                    query: "site:whois.domaintools.com/{{DOMAIN_NAME}} OR site:who.is/whois/{{DOMAIN_NAME}}",
                    category: "osint",
                    engines: ["google"],
                    tags: ["wayback machine", "whois", "domain", "osint", "historical data"]
                },
                {
                    id: 64,
                    name: "Wayback Machine - CMS Login Pages",
                    description: "Find historical login pages for common CMS (e.g., WordPress, Joomla, Drupal) on a specific domain.",
                    query: "site:web.archive.org/web/* {{DOMAIN_NAME}} (inurl:wp-admin OR inurl:administrator OR inurl:user/login)",
                    category: "login",
                    engines: ["google"],
                    tags: ["wayback machine", "cms", "login", "vulnerability", "historical data"]
                },
                {
                    id: 65,
                    name: "Wayback Machine - Old API Endpoints",
                    description: "Discover old or deprecated API endpoints in historical snapshots that might be vulnerable.",
                    query: "site:web.archive.org/web/* {{DOMAIN_NAME}} inurl:api/v1 OR inurl:oldapi OR intext:\"deprecated endpoint\"",
                    category: "vulnerabilities",
                    engines: ["google"],
                    tags: ["wayback machine", "api", "vulnerability", "historical data"]
                },
                {
                    id: 66,
                    name: "OSINT - Exposed Employee Resumes/CVs",
                    description: "Search for public resumes or CVs associated with a company or domain, potentially revealing sensitive information.",
                    query: "site:{{COMPANY_DOMAIN}} filetype:pdf (resume OR CV OR curriculum vitae) OR intext:\"looking for a new opportunity\" intext:{{COMPANY_NAME}}",
                    category: "osint",
                    engines: ["google", "bing"],
                    tags: ["osint", "employee", "resume", "cv", "personal data", "reconnaissance"]
                },
                {
                    id: 67,
                    name: "OSINT - Exposed Google Groups/Forums",
                    description: "Find publicly accessible Google Groups or other forum discussions related to a target.",
                    query: "site:groups.google.com intext:{{TARGET_KEYWORD}} (confidential OR internal OR restricted)",
                    category: "osint",
                    engines: ["google"],
                    tags: ["osint", "forum", "google groups", "discussion", "data leak"]
                },
                {
                    id: 68,
                    name: "GitHub - Exposed Database Connection Strings",
                    description: "Search for common database connection string patterns in public GitHub repositories.",
                    query: "jdbc:mysql:// OR postgresql:// OR mongodb:// OR sqlserver:// in:file password",
                    category: "databases",
                    engines: ["github"],
                    tags: ["github", "database", "connection string", "credentials", "exposed", "leak"]
                },
                {
                    id: 69,
                    name: "GitHub - Generic Sensitive Information (Broad)",
                    description: "A broad search for commonly exposed sensitive terms in GitHub repositories.",
                    query: "password OR credentials OR secret OR token OR api_key OR private_key OR id_rsa OR .env",
                    category: "code & files",
                    engines: ["github"],
                    tags: ["github", "sensitive data", "credentials", "leak", "broad scan"]
                },
                {
                    id: 70,
                    name: "Wayback Machine - Exposed Directories/Indexes",
                    description: "Discover historical snapshots of exposed directories or file indexes.",
                    query: "site:web.archive.org/web/* {{DOMAIN_NAME}} intitle:\"index of\" OR intitle:\"directory listing for\"",
                    category: "files",
                    engines: ["google"],
                    tags: ["wayback machine", "directory listing", "exposed", "files", "historical data"]
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
        } else if (tabName === 'audit-log') {
            this.renderAuditLog();
        } else if (tabName === 'raw-data-analyzer') { // NEW
            this.analyzeRawData(); // Re-run analysis if there's data
            this.updateSelectedEntityDisplay(); // Refresh selected entity display
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
        // No longer using targetInput directly in buildQuery.
        // It's handled by _useSuggestedSampleDork or just exists for category detection.
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

    // Clear all inputs in the query builder
    clearQuery() {
        document.getElementById('target-input').value = '';
        document.getElementById('basic-terms').value = '';
        document.querySelectorAll('.operator-field input').forEach(input => {
            input.value = '';
        });
        document.getElementById('generated-query').value = '';
        document.getElementById('target-profile-category').value = ''; // Reset to "Auto-Detect"
        this.updateConversions(''); // Clear conversions as well
        this._renderSampleDorkSuggestions('', ''); // Clear sample dorks
        this.showNotification('Query builder cleared!', 'info');
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
        this.logAudit('TEST_CONVERTED_QUERY', { query: query, targetEngine: engine.name });
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
            this.logAudit('COPY_QUERY', { query: query, engine: this.currentEngine });
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
        this.logAudit('TEST_QUERY', { query: query, engine: this.currentEngine });
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
        this.logAudit('SAVE_QUERY', { name: name, query: savedQuery.query, engine: savedQuery.engine });
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
            case 'web': return 'fas fa-globe';
            case 'people': return 'fas fa-user-friends';
            case 'crypto': return 'fas fa-bitcoin';
            case 'dark-web': return 'fas fa-moon';
            case 'remote-access': return 'fas fa-desktop';
            case 'code & files': return 'fas fa-code'; // For GitHub section
            default: return 'fas fa-folder';
        }
    }

    // Render templates
    renderTemplates() {
        const templatesContainer = document.getElementById('templates-grid'); // Still refers to the main container
        const engineFilter = document.getElementById('template-engine').value;
        const searchTerm = document.getElementById('template-search-input').value.toLowerCase(); // Get search term

        let filteredTemplates = this.templates;

        // Apply category filter
        if (this.currentTemplateCategory && this.currentTemplateCategory !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.category === this.currentTemplateCategory);
        }

        // Apply engine filter
        if (engineFilter !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.engines.includes(engineFilter));
        }

        // Apply search term filter
        if (searchTerm) {
            filteredTemplates = filteredTemplates.filter(t =>
                t.name.toLowerCase().includes(searchTerm) ||
                t.description.toLowerCase().includes(searchTerm) ||
                t.query.toLowerCase().includes(searchTerm) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
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
                        <span class="template-category">
                            <i class="${this.getCategoryIcon(template.category)}"></i>
                            ${template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                        </span>
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

        this.logAudit('USE_TEMPLATE', { name: template.name, query: queryToUse, originalTemplate: template.query, engine: document.getElementById('search-engine').value });
        this.showNotification(`Template "${template.name}" loaded!`, 'success');
    }

    // Filter templates
    filterTemplates() {
        // This method will now primarily trigger re-rendering of templates based on selected filters (engine)
        // Category filtering is handled by `filterTemplatesByCategory`
        this.renderTemplates();
    }

    // Search templates by name, description, or tags
    searchTemplates() {
        this.renderTemplates(); // Rerender templates with the new search term applied
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
        this.logAudit('ADD_TEMPLATE', { name: name, query: query });
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
        this.logAudit('EXECUTE_PREVIEWED_QUERY', { query: previewQuery, engine: engine.name });
    }

    // NEW: Save Edited Template
    saveEditedTemplate() {
        const templateId = parseInt(document.getElementById('editSaveTemplateBtn').dataset.templateId);
        const templateIndex = this.templates.findIndex(t => t.id === templateId);

        if (templateIndex === -1) {
            this.showNotification('Error: Template not found for editing.', 'error');
            return;
        }

        const oldTemplate = { ...this.templates[templateIndex] }; // Clone for audit log

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
        this.logAudit('EDIT_TEMPLATE', { id: templateId, old: oldTemplate, new: this.templates[templateIndex] });
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

        this.logAudit('LOAD_SAVED_QUERY', { name: query.name, query: query.query, engine: query.engine });
        this.showNotification(`Query "${query.name}" loaded!`, 'success');
    }

    // Helper to parse and populate the query builder form from a loaded query string
    populateQueryBuilderFromLoadedQuery(queryString, engineKey) {
        // Clear all relevant inputs first
        this.clearQuery(); // This clears everything. We'll repopulate smart.

        const targetInputElem = document.getElementById('target-input');
        const basicTermsElem = document.getElementById('basic-terms');
        const operatorInputs = document.querySelectorAll('.operator-field input');

        let remainingQuery = queryString;

        // Step 1: Try to extract a primary target from the beginning of the query string
        // Heuristic: Check if the first 'word' (or quoted phrase) looks like a common target type
        const firstTermMatch = remainingQuery.match(/^(?:[^\s"]+|"[^"]*")(?:\s|$)/);
        let potentialTargetValue = firstTermMatch ? firstTermMatch[0].trim().replace(/"/g, '') : '';
        let detectedTargetCategory = this._detectCategoryFromValue(potentialTargetValue);

        if (potentialTargetValue && detectedTargetCategory !== 'general' && detectedTargetCategory !== '') {
            targetInputElem.value = potentialTargetValue;
            document.getElementById('target-profile-category').value = detectedTargetCategory;
            remainingQuery = remainingQuery.substring(potentialTargetValue.length).trim();
        } else {
            // If no clear target, the entire string initially goes to basic terms for parsing operators
            basicTermsElem.value = queryString;
            remainingQuery = queryString; // Reset remainingQuery for operator parsing
        }

        // Step 2: Populate operators and remaining basic terms
        const engineOperators = this.searchEngines[engineKey].operators;

        // Sort operators by length of operator string (descending) to match longer operators first
        const sortedOperators = Object.values(engineOperators).sort((a, b) => (b.operator || '').length - (a.operator || '').length);

        sortedOperators.forEach(operatorConfig => {
            const op = operatorConfig.operator;
            const suffix = operatorConfig.suffix || '';

            if (!op && operatorConfig.placeholder) {
                return; // Skip generic placeholders without an operator prefix
            }

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
            } else {
                return; // Skip if no operator defined
            }

            const matches = [...remainingQuery.matchAll(regex)];

            for (let i = matches.length - 1; i >= 0; i--) {
                const match = matches[i];
                let value = match[1] || '';

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

        // The remaining part of the query is considered basic terms (after removing operators and initial target)
        // Only update basic terms if it wasn't already explicitly set by target detection
        if (basicTermsElem.value === queryString || !basicTermsElem.value) { // If basicTerms still holds original string or is empty
            basicTermsElem.value = remainingQuery.trim();
        } else {
            // If basic terms already had content from target detection, append remaining
            if (remainingQuery.trim() && !basicTermsElem.value.includes(remainingQuery.trim())) {
                basicTermsElem.value = `${basicTermsElem.value} ${remainingQuery.trim()}`;
            }
        }


        this.buildQuery(); // Rebuild the full query string displayed in the output
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
            this.logAudit('COPY_SAVED_QUERY', { name: query.name, query: query.query });
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
        this.logAudit('TEST_SAVED_QUERY', { name: query.name, query: query.query, engine: query.engine });
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
            const template = this.templates.find(t => t.id === id);
            messageElement.textContent = `Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`;
        } else if (type === 'savedQuery') {
            const savedQuery = this.savedQueries.find(q => q.id === id);
            messageElement.textContent = `Are you sure you want to delete the saved query "${savedQuery.name}"? This action cannot be undone.`;
        } else if (type === 'auditLog') {
            messageElement.textContent = 'Are you sure you want to clear the entire audit log? This action cannot be undone.';
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
            const deletedTemplate = this.templates.find(t => t.id === this.itemToDelete);
            this.templates = this.templates.filter(t => t.id !== this.itemToDelete);
            this.saveTemplates();
            this.renderTemplates();
            this.renderTemplateCategories();
            this.showNotification('Template deleted successfully!', 'success');
            this.logAudit('DELETE_TEMPLATE', { name: deletedTemplate.name, query: deletedTemplate.query });
        } else if (this.itemTypeToDelete === 'savedQuery') {
            const deletedQuery = this.savedQueries.find(q => q.id === this.itemToDelete);
            this.savedQueries = this.savedQueries.filter(q => q.id !== this.itemToDelete);
            this.saveSavedQueries();
            this.renderSavedQueries();
            this.showNotification('Saved query deleted successfully!', 'success');
            this.logAudit('DELETE_SAVED_QUERY', { name: deletedQuery.name, query: deletedQuery.query });
        } else if (this.itemTypeToDelete === 'auditLog') {
            this.clearAuditLog();
            this.showNotification('Audit log cleared!', 'success');
        }
        this.closeDeleteConfirmModal();
    }

    // Audit Log Methods
    logAudit(action, details = {}) {
        const timestamp = new Date().toISOString();
        const auditEntry = {
            id: Date.now(),
            timestamp: timestamp,
            action: action,
            details: details,
            user: 'Admin' // Placeholder for user
        };
        this.auditLog.unshift(auditEntry); // Add to the beginning for newest first
        this.saveAuditLog();
        // Only re-render if the audit log tab is active
        if (document.getElementById('audit-log-tab') && document.getElementById('audit-log-tab').classList.contains('active')) {
            this.renderAuditLog();
        }
    }

    renderAuditLog() {
        const auditLogContainer = document.getElementById('audit-log-list');
        if (!auditLogContainer) return;

        auditLogContainer.innerHTML = '';

        if (this.auditLog.length === 0) {
            auditLogContainer.innerHTML = '<p class="no-logs-message">No audit log entries found.</p>';
            return;
        }

        this.auditLog.forEach(entry => {
            const logItem = document.createElement('div');
            logItem.className = 'audit-log-item';
            let detailsHtml = '';
            for (const key in entry.details) {
                let value = entry.details[key];
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value, null, 2); // Pretty print JSON objects
                    detailsHtml += `<li><strong>${key}:</strong> <pre><code>${value}</code></pre></li>`;
                } else {
                    detailsHtml += `<li><strong>${key}:</strong> ${value}</li>`;
                }
            }
            logItem.innerHTML = `
                <div class="log-header">
                    <span class="log-timestamp">${new Date(entry.timestamp).toLocaleString()}</span>
                    <span class="log-action">${entry.action.replace(/_/g, ' ')}</span>
                    <span class="log-user">by ${entry.user}</span>
                </div>
                <div class="log-details">
                    <ul>
                        ${detailsHtml}
                    </ul>
                </div>
            `;
            auditLogContainer.appendChild(logItem);
        });
    }

    clearAuditLog() {
        this.auditLog = [];
        this.saveAuditLog();
        this.renderAuditLog();
        this.showNotification('Audit log cleared!', 'success');
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

    loadAuditLog() {
        const stored = localStorage.getItem('dork-audit-log');
        return stored ? JSON.parse(stored) : [];
    }

    saveAuditLog() {
        localStorage.setItem('dork-audit-log', JSON.stringify(this.auditLog));
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

    // =======================================================
    // NEW FEATURES IMPLEMENTATION START HERE
    // =======================================================

    // 1. Intelligent Category Detection & Sample Dork Suggestions (Query Builder)
    detectCategory() {
        const targetInput = document.getElementById('target-input').value.trim();
        const categorySelect = document.getElementById('target-profile-category');

        let detectedCategory = this._detectCategoryFromValue(targetInput);

        // Update the dropdown only if a non-empty category is detected, otherwise keep "Auto-Detect"
        categorySelect.value = detectedCategory || '';

        // Render sample dorks based on the detected category
        this._renderSampleDorkSuggestions(targetInput, detectedCategory);
        this.buildQuery(); // Rebuild query to reflect any changes from targetInput
    }

    _detectCategoryFromValue(value) {
        if (!value) return '';

        // Prioritize more specific regex
        // IP Address
        if (value.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::\d+)?$/)) {
            return 'ip';
        }
        // CVE
        if (value.match(/CVE-\d{4}-\d{4,7}/i)) {
            return 'cve';
        }
        // Email
        if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
            return 'email';
        }
        // Credential/Secret (more generic patterns for API keys, passwords, sensitive terms)
        if (value.match(/(AKIA|ASIA|AGIA|AIDA)[0-9A-Z]{16}/) ||
            value.match(/(password|secret|api_key|token|client_secret|db_pass|s3_key|ssh_key|ftp_pass|admin_pass)/i) ||
            value.match(/(\b(?:pk|sk|access|secret|auth|token)[_.-]?[kK]ey\b)/i) ) {
            return 'credential';
        }
        // URL
        if (value.match(/^https?:\/\/[^\s/$.?#].[^\s]*$/i) || value.match(/^www\.[^\s/$.?#].[^\s]*$/i)) {
            return 'url';
        }
        // Domain (basic check, often follows URL detection)
        if (value.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:[:/].*)?$/) && !value.includes(' ') && !value.includes('/') && !value.includes('@')) {
            return 'domain';
        }
        // File Path/Extension (includes common sensitive file names)
        if (value.match(/\.(sql|env|conf|log|bak|zip|rar|7z|tgz|tar|gz|txt|json|xml|csv|yml|yaml|ini|php|js|css|py|rb|go|java|c|cpp|h|hpp|md|pdf|doc|docx|xls|xlsx)$/i) ||
            value.match(/(\/(etc|var|home|root|admin|config|logs|backup|data)\/)/i) ||
            value.match(/(\.env|\.git\/config|\.hg\/hgrc|wp-config\.php|web\.config|database\.yml|config\.inc\.php)/i)) {
            return 'file';
        }
        // Social Media platform
        if (value.match(/(twitter|linkedin|facebook|instagram|github|trello)\.com/i)) {
            return 'social';
        }
        // Web Application/Software
        if (value.match(/(apache|nginx|wordpress|joomla|drupal|jenkins|jira|confluence|gitlab|microsoft exchange|elastic|docker)/i)) {
            return 'webapp';
        }
        // Network Device
        if (value.match(/(cisco|juniper|huawei|router|switch|firewall|modem)/i)) {
            return 'network';
        }
        // IoT Device
        if (value.match(/(iot|camera|webcam|sensor|smart home|thermostat|d-link|hikvision)/i)) {
            return 'iot';
        }
        // Blockchain/Crypto
        if (value.match(/(bitcoin|ethereum|blockchain|crypto|wallet|btc|eth|xrp)/i) || value.length >= 26 && value.length <= 35 && value.match(/^[13][a-km-zA-HJ-NP-Z1-9]{26,33}$/)) { // Basic BTC address regex
            return 'blockchain';
        }
        // Person (very basic keywords)
        if (value.match(/(ceo|cto|founder|john doe|jane smith|employee|staff)/i)) {
            return 'person';
        }
        // Organization (very basic keywords)
        if (value.match(/(inc|llc|corp|company|foundation|group|university|hospital|ltd)/i)) {
            return 'organization';
        }

        return 'general'; // Default fallback
    }

    setDetectedCategory(category) {
        const targetInput = document.getElementById('target-input').value.trim();
        this._renderSampleDorkSuggestions(targetInput, category);
        this.buildQuery();
    }

    _renderSampleDorkSuggestions(targetValue, targetCategory) {
        const suggestionsContainer = document.getElementById('sample-dork-suggestions');
        suggestionsContainer.innerHTML = '';

        if (!targetValue || !targetCategory || targetCategory === 'general') {
            suggestionsContainer.innerHTML = `<p class="placeholder-message">Type a target or select a category to see sample dorks.</p>`;
            if (targetValue && targetCategory === 'general') {
                // If general keyword, still provide a basic phrase search option
                suggestionsContainer.innerHTML = `<h5>General Suggestions for "${targetValue}"</h5>`;
                 suggestionsContainer.innerHTML += this._createSampleDorkItem({
                    name: `Exact phrase search for "${targetValue}"`,
                    description: `Find exact mentions of your keyword across the web.`,
                    query: `"${targetValue}"`,
                    engine: 'google',
                    icon: 'fas fa-quote-left'
                });
            }
            return;
        }

        suggestionsContainer.innerHTML = `<h5>Sample Dorks for "${targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1)}": ${targetValue}</h5>`;

        const dorksToSuggest = [];

        // Dynamic Suggestions based on Category
        switch (targetCategory) {
            case 'domain':
            case 'url':
                const domain = targetValue.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                dorksToSuggest.push(
                    { name: `Find all pages on ${domain}`, description: `Use 'site:' to restrict search to this domain.`, query: `site:${domain}`, engine: 'google', icon: 'fas fa-globe' },
                    { name: `Identify exposed files on ${domain}`, description: `Look for common sensitive file types like configs, logs, or backups.`, query: `site:${domain} (filetype:log OR filetype:env OR inurl:backup OR inurl:admin)`, engine: 'google', icon: 'fas fa-file-code' },
                    { name: `Discover subdomains of ${domain}`, description: `Find subdomains indexed by Google that might host different services.`, query: `site:*.${domain} -www`, engine: 'google', icon: 'fas fa-sitemap' },
                    { name: `Check Wayback Machine for ${domain}`, description: `Explore historical versions of web pages for old content.`, query: `site:web.archive.org/web/* ${domain}`, engine: 'google', icon: 'fas fa-archive' }
                );
                break;
            case 'ip':
                const ip = targetValue.split(':')[0]; // remove port if present
                dorksToSuggest.push(
                    { name: `Shodan search for ${ip}`, description: `Find open ports, banners, and services on this IP address.`, query: `ip:${ip}`, engine: 'shodan', icon: 'fas fa-search-dollar' },
                    { name: `Censys analysis for ${ip}`, description: `Get detailed host information, certificates, and potential vulnerabilities.`, query: `ip:${ip}`, engine: 'censys', icon: 'fas fa-microscope' },
                    { name: `Find webcams on ${ip}'s subnet`, description: `Scan the /24 subnet for exposed IP cameras.`, query: `net:${ip.split('.').slice(0,3).join('.')}.0/24 product:"IP Camera"`, engine: 'shodan', icon: 'fas fa-video' }
                );
                break;
            case 'email':
                const emailDomain = targetValue.split('@')[1];
                dorksToSuggest.push(
                    { name: `IntelX search for ${emailDomain} emails`, description: `Find more emails associated with this domain in IntelX database.`, query: `type:1 "${emailDomain}"`, engine: 'intelx', icon: 'fas fa-fingerprint' },
                    { name: `Find documents containing ${targetValue}`, description: `Search for PDFs or other documents that mention this email.`, query: `"${targetValue}" filetype:pdf OR filetype:doc OR filetype:xls`, engine: 'google', icon: 'fas fa-envelope-open-text' },
                    { name: `LinkedIn profiles for "${targetValue}"`, description: `Search for LinkedIn profiles associated with the email.`, query: `site:linkedin.com "${targetValue}"`, engine: 'google', icon: 'fab fa-linkedin' }
                );
                break;
            case 'credential':
                dorksToSuggest.push(
                    { name: `Search GitHub for "${targetValue}"`, description: `Find code repositories that might expose this credential.`, query: `"${targetValue}" language:json OR language:yaml OR language:xml`, engine: 'github', icon: 'fab fa-github' },
                    { name: `Search Pastebin for "${targetValue}"`, description: `Look for leaked pastes containing the credential.`, query: `site:pastebin.com "${targetValue}"`, engine: 'google', icon: 'fas fa-clipboard' },
                    { name: `Google search for exposed credentials`, description: `Broad search for the credential with terms like 'exposed' or 'leak'.`, query: `"${targetValue}" (exposed OR leak OR confidential)`, engine: 'google', icon: 'fas fa-key' }
                );
                break;
            case 'file':
                const filename = targetValue.split('/').pop();
                const fileExtension = filename.includes('.') ? filename.split('.').pop() : '';
                dorksToSuggest.push(
                    { name: `Find filename "${filename}" on GitHub`, description: `Search GitHub for repositories containing this exact filename.`, query: `filename:${filename}`, engine: 'github', icon: 'fab fa-github' },
                    { name: `Search for filetype:${fileExtension} across sites`, description: `Look for other files of this type on the web.`, query: `filetype:${fileExtension} ${filename}`, engine: 'google', icon: 'fas fa-file-export' },
                    { name: `Find public directories for "${targetValue}"`, description: `Look for exposed directory listings that include this file path.`, query: `intitle:"index of" "${targetValue}"`, engine: 'google', icon: 'fas fa-folder-open' }
                );
                break;
            case 'cve':
                dorksToSuggest.push(
                    { name: `Shodan search for CVE ${targetValue}`, description: `Find hosts vulnerable to this specific CVE on Shodan.`, query: `vuln:${targetValue}`, engine: 'shodan', icon: 'fas fa-bug' },
                    { name: `Exploit-DB for ${targetValue}`, description: `Search for public exploits or proof-of-concepts related to the CVE.`, query: `site:exploit-db.com intext:"${targetValue}"`, engine: 'google', icon: 'fas fa-flask' },
                    { name: `GitHub: Search for ${targetValue} POC`, description: `Find code or discussions about the CVE vulnerability.`, query: `"${targetValue}" (poc OR exploit)`, engine: 'github', icon: 'fab fa-github' }
                );
                break;
            case 'webapp':
            case 'software':
                dorksToSuggest.push(
                    { name: `Shodan search for product "${targetValue}"`, description: `Find instances of this web application or software exposed online.`, query: `product:"${targetValue}"`, engine: 'shodan', icon: 'fas fa-server' },
                    { name: `Find login panels for "${targetValue}"`, description: `Discover publicly accessible admin or login interfaces.`, query: `intitle:"${targetValue} login" OR inurl:${targetValue}/admin`, engine: 'google', icon: 'fas fa-sign-in-alt' },
                    { name: `Known vulnerabilities for "${targetValue}"`, description: `Search for known CVEs or exploit mentions related to the software.`, query: `"${targetValue}" vulnerability OR CVE`, engine: 'google', icon: 'fas fa-bug' }
                );
                break;
            case 'social':
            case 'person':
                dorksToSuggest.push(
                    { name: `Google for all social profiles of "${targetValue}"`, description: `Find public profiles across major social media platforms.`, query: `"${targetValue}" site:twitter.com OR site:linkedin.com OR site:facebook.com OR site:instagram.com`, engine: 'google', icon: 'fas fa-user-friends' },
                    { name: `LinkedIn profile for "${targetValue}"`, description: `Directly search for professional profiles.`, query: `site:linkedin.com/in/ "${targetValue}"`, engine: 'google', icon: 'fab fa-linkedin' },
                    { name: `News/Mentions of "${targetValue}"`, description: `Find articles or discussions mentioning the person or social entity.`, query: `"${targetValue}" site:news.google.com OR inurl:blog OR inurl:forum`, engine: 'google', icon: 'fas fa-newspaper' }
                );
                break;
            case 'organization':
                dorksToSuggest.push(
                    { name: `Company domain for "${targetValue}"`, description: `Try to find the official website for the organization.`, query: `"${targetValue}" website`, engine: 'google', icon: 'fas fa-building' },
                    { name: `Employee emails for "${targetValue}"`, description: `Look for exposed employee directories or email patterns.`, query: `"${targetValue}" employee email list filetype:xls OR filetype:csv`, engine: 'google', icon: 'fas fa-envelope' },
                    { name: `Data leaks related to "${targetValue}"`, description: `Search for mentions of data breaches or exposed data.`, query: `"${targetValue}" data leak OR breach OR confidential filetype:pdf`, engine: 'google', icon: 'fas fa-shield-virus' }
                );
                break;
            case 'iot':
                dorksToSuggest.push(
                    { name: `Shodan search for IoT device "${targetValue}"`, description: `Find instances of the IoT device exposed online.`, query: `product:"${targetValue}"`, engine: 'shodan', icon: 'fas fa-wifi' },
                    { name: `Find exposed IoT dashboards for "${targetValue}"`, description: `Look for public control panels or interfaces.`, query: `intitle:"dashboard" inurl:iot "${targetValue}"`, engine: 'google', icon: 'fas fa-tachometer-alt' }
                );
                break;
            case 'blockchain':
                dorksToSuggest.push(
                    { name: `Blockchain explorer for "${targetValue}"`, description: `Search public blockchain explorers for transaction history.`, query: `site:etherscan.io OR site:blockchain.com "${targetValue}"`, engine: 'google', icon: 'fas fa-bitcoin' },
                    { name: `IntelX: Crypto addresses matching "${targetValue}"`, description: `Search IntelX for mentions of this crypto address/keyword.`, query: `selector:btc OR selector:eth "${targetValue}"`, engine: 'intelx', icon: 'fas fa-fingerprint' }
                );
                break;
            default:
                // Fallback for categories not explicitly handled or 'general'
                dorksToSuggest.push(
                    { name: `General search for "${targetValue}"`, description: `A broad web search for your input.`, query: `"${targetValue}"`, engine: 'google', icon: 'fas fa-search' }
                );
                break;
        }

        if (dorksToSuggest.length > 0) {
            dorksToSuggest.forEach(dork => {
                suggestionsContainer.innerHTML += this._createSampleDorkItem(dork, targetValue);
            });
        } else {
            suggestionsContainer.innerHTML = `<p class="placeholder-message">No specific sample dorks for this category. Try a general search.</p>`;
        }
    }

    _createSampleDorkItem(dork, targetValuePlaceholder) {
        // Replace dynamic placeholders in the query if they exist
        let finalQuery = dork.query;
        if (targetValuePlaceholder) {
            finalQuery = finalQuery
                .replace(/\{\{DOMAIN_NAME\}\}/g, targetValuePlaceholder.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0])
                .replace(/\{\{TARGET_SITE\}\}/g, targetValuePlaceholder.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0])
                .replace(/\{\{EMAIL_DOMAIN\}\}/g, targetValuePlaceholder.split('@')[1] || targetValuePlaceholder)
                .replace(/\{\{SSH_VERSION\}\}/g, targetValuePlaceholder) // Assuming target value can be a version
                .replace(/\{\{CVE_ID\}\}/g, targetValuePlaceholder)
                .replace(/\{\{FULL_NAME\}\}/g, targetValuePlaceholder)
                .replace(/\{\{COMPANY_DOMAIN\}\}/g, targetValuePlaceholder)
                .replace(/\{\{COMPANY_NAME\}\}/g, targetValuePlaceholder)
                .replace(/\{\{ENTITY_NAME\}\}/g, targetValuePlaceholder)
                .replace(/\{\{FILE_TYPE\}\}/g, targetValuePlaceholder.split('.').pop())
                .replace(/\{\{GOOGLE_API_KEY_PATTERN\}\}/g, targetValuePlaceholder); // Example for API key pattern
        }

        // Encode the query for passing to onclick, especially if it contains quotes
        const encodedQuery = finalQuery.replace(/'/g, "\\'");

        return `
            <div class="sample-dork-item">
                <span class="dork-title"><i class="${dork.icon}"></i> ${dork.name}</span>
                <p class="dork-description">${dork.description}</p>
                <code>${this.highlightPlaceholders(finalQuery)}</code>
                <div class="dork-actions">
                    <button onclick="dorkAssistant._useSuggestedSampleDork('${encodedQuery}', '${targetValuePlaceholder}')" class="btn-primary">
                        <i class="fas fa-arrow-right"></i> Use Dork
                    </button>
                    <button onclick="navigator.clipboard.writeText('${encodedQuery}').then(() => dorkAssistant.showNotification(\'Dork copied!\', \'success\')).catch(() => dorkAssistant.showNotification(\'Failed to copy dork\', \'error\'))" class="btn-secondary">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        `;
    }

    _useSuggestedSampleDork(query, targetValue) {
        // Clear all existing inputs in the query builder
        this.clearQueryBuilderOperators();
        document.getElementById('basic-terms').value = ''; // Ensure basic terms is also clear

        // Try to intelligently populate basic terms and operators
        let remainingQuery = query;
        const currentEngine = document.getElementById('search-engine').value;
        const engineOperators = this.searchEngines[currentEngine].operators;

        // Populate target input if the suggested query strongly features the target value
        const targetInputElem = document.getElementById('target-input');
        if (targetValue && query.includes(targetValue)) {
            targetInputElem.value = targetValue;
            document.getElementById('target-profile-category').value = this._detectCategoryFromValue(targetValue) || '';
            remainingQuery = remainingQuery.replace(targetValue, '').trim(); // Remove target value from remaining
        } else {
            targetInputElem.value = '';
            document.getElementById('target-profile-category').value = '';
        }

        // Sort operators by length of operator string (descending) to match longer operators first
        const sortedOperators = Object.values(engineOperators).sort((a, b) => (b.operator || '').length - (a.operator || '').length);

        sortedOperators.forEach(operatorConfig => {
            const op = operatorConfig.operator;
            const suffix = operatorConfig.suffix || '';

            if (!op && operatorConfig.placeholder) {
                return;
            }

            const escapedOp = op ? op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
            const escapedSuffix = suffix ? suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';

            let regex;
            if (op && suffix) {
                if (op === '"' && suffix === '"') {
                    regex = new RegExp(`${escapedOp}(.*?)${escapedSuffix}`, 'g');
                } else {
                    regex = new RegExp(`${escapedOp}([^\\s]+)${escapedSuffix}`, 'g');
                }
            } else if (op) {
                regex = new RegExp(`${escapedOp}(?:([^\\s"']+|"[^"]+"|'[^']+')\\s*)?`, 'g');
            } else {
                return;
            }

            const matches = [...remainingQuery.matchAll(regex)];

            for (let i = matches.length - 1; i >= 0; i--) {
                const match = matches[i];
                let value = match[1] || '';

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
                    remainingQuery = remainingQuery.substring(0, match.index) +
                                     remainingQuery.substring(match.index + match[0].length);
                } else if (inputElement && !value && op && op.endsWith(':')) {
                    inputElement.value = '';
                    remainingQuery = remainingQuery.substring(0, match.index) +
                                     remainingQuery.substring(match.index + match[0].length);
                }
            }
        });

        // Any remaining text goes to basic terms
        if (remainingQuery.trim()) {
            document.getElementById('basic-terms').value = remainingQuery.trim();
        }


        this.buildQuery(); // Rebuild the final query in the output box
        this.showNotification('Dork loaded into builder!', 'success');
        this.logAudit('USE_SAMPLE_DORK', { query: query, targetValue: targetValue });
    }

    _clearQueryBuilderOperators() {
        document.querySelectorAll('.operator-field input').forEach(input => {
            input.value = '';
        });
    }

    // 2. Raw Data Analyzer & Entity Extractor (No changes here, as requested)

    // ... (rest of the Raw Data Analyzer code remains the same as previous full JS file) ...

    analyzeRawData() {
        const rawData = document.getElementById('raw-data-input').value;
        this.extractedEntities = {
            urls: new Set(), // Use Set to avoid duplicates
            ips: new Set(),
            emails: new Set(),
            credentials: new Set(),
            file_paths: new Set(),
            custom: new Set()
        };

        // Extract URLs
        let match;
        this.regexPatterns.url.lastIndex = 0; // Reset regex for multiple exec calls
        while ((match = this.regexPatterns.url.exec(rawData)) !== null) {
            this.extractedEntities.urls.add(match[0]);
        }

        // Extract IPs
        this.regexPatterns.ip.lastIndex = 0;
        while ((match = this.regexPatterns.ip.exec(rawData)) !== null) {
            this.extractedEntities.ips.add(match[0]);
        }

        // Extract Emails
        this.regexPatterns.email.lastIndex = 0;
        while ((match = this.regexPatterns.email.exec(rawData)) !== null) {
            this.extractedEntities.emails.add(match[0]);
        }

        // Extract Credentials/Secrets (combine patterns)
        // Ensure new RegExp is created each time to reset lastIndex for combined regex
        const combinedCredentialRegex = new RegExp(
            `${this.regexPatterns.credential.source}|${this.regexPatterns.aws_key.source}`, 'gmi'
        );
        while ((match = combinedCredentialRegex.exec(rawData)) !== null) {
            this.extractedEntities.credentials.add(match[0]);
        }
        // Also add S3 bucket URLs as potential sensitive info
        this.regexPatterns.s3_bucket.lastIndex = 0;
        while ((match = this.regexPatterns.s3_bucket.exec(rawData)) !== null) {
             this.extractedEntities.credentials.add(match[0]); // Add full S3 URL
        }


        // Extract Sensitive File Paths
        this.regexPatterns.sensitive_path.lastIndex = 0;
        while ((match = this.regexPatterns.sensitive_path.exec(rawData)) !== null) {
            this.extractedEntities.file_paths.add(match[0]);
        }

        // Re-apply custom regex if pattern exists
        const customPatternInput = document.getElementById('custom-regex-pattern');
        if (customPatternInput && customPatternInput.value.trim()) {
            this.applyCustomRegex(false); // Apply but don't show notification or log audit for passive re-analysis
        }


        this.renderExtractedEntities();
        // Log audit only if user actively changes input, not on passive re-render
        // this.logAudit('ANALYZE_RAW_DATA', { inputLength: rawData.length, entitiesFound: Object.values(this.extractedEntities).reduce((acc, curr) => acc + curr.size, 0) });
    }

    renderExtractedEntities() {
        for (const type in this.extractedEntities) {
            const listElement = document.querySelector(`#entity-category-${type} .entity-list`);
            const countElement = document.querySelector(`#entity-category-${type} .count`);
            listElement.innerHTML = ''; // Clear previous entries
            const uniqueEntities = Array.from(this.extractedEntities[type]); // Convert Set to Array

            countElement.textContent = uniqueEntities.length;

            if (uniqueEntities.length === 0) {
                listElement.innerHTML = `<li style="text-align: center; color: rgba(255,255,255,0.5); border: none; cursor: default; padding: 0.5rem;">No ${type.replace(/_/g, ' ').toLowerCase().replace('ips', 'IP addresses').replace('urls', 'URLs').replace('file_paths', 'file paths')} found.</li>`;
            } else {
                uniqueEntities.forEach(entity => {
                    const listItem = document.createElement('li');
                    listItem.textContent = entity;
                    listItem.onclick = () => this.selectEntity(entity, type);
                    listElement.appendChild(listItem);
                });
            }
        }
    }

    // Data Input Methods
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('raw-data-input').value = e.target.result;
            this.analyzeRawData();
            this.showNotification(`File "${file.name}" loaded.`, 'success');
            this.logAudit('UPLOAD_FILE_FOR_ANALYSIS', { fileName: file.name, fileSize: file.size });
        };
        reader.onerror = () => {
            this.showNotification('Error reading file!', 'error');
            this.logAudit('FILE_UPLOAD_ERROR', { fileName: file.name, error: reader.error });
        };
        reader.readAsText(file);
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('raw-data-input').value = text;
            this.analyzeRawData();
            this.showNotification('Content pasted from clipboard!', 'success');
            this.logAudit('PASTE_FROM_CLIPBOARD', { contentPreview: text.substring(0, 100) + (text.length > 100 ? '...' : '') });
        } catch (err) {
            this.showNotification('Failed to read from clipboard. Ensure permission is granted.', 'error');
            console.error('Failed to read clipboard contents: ', err);
            this.logAudit('CLIPBOARD_PASTE_ERROR', { error: err.message });
        }
    }

    clearRawDataInput() {
        document.getElementById('raw-data-input').value = '';
        this.analyzeRawData(); // This will clear the displayed entities
        this.showNotification('Raw data input cleared!', 'info');
        this.logAudit('CLEAR_RAW_DATA_INPUT');
    }

    // Custom Regex Support
    updateCustomRegexPreview() {
        const pattern = document.getElementById('custom-regex-pattern').value;
        const rawData = document.getElementById('raw-data-input').value;
        const previewDiv = document.getElementById('custom-regex-preview');

        if (!pattern) {
            previewDiv.innerHTML = 'No matches yet.';
            return;
        }

        try {
            const flags = this.getRegexFlags();
            const regex = new RegExp(pattern, flags);
            // Ensure regex is reset for replace
            regex.lastIndex = 0;
            let highlightedText = rawData.replace(regex, (match) => `<span class="highlight">${match}</span>`);
            previewDiv.innerHTML = highlightedText || 'No matches found with this regex.';
        } catch (e) {
            previewDiv.innerHTML = `<span style="color: #ff4757;">Invalid regex: ${e.message}</span>`;
        }
    }

    applyCustomRegex(log = true) {
        const pattern = document.getElementById('custom-regex-pattern').value;
        const rawData = document.getElementById('raw-data-input').value;
        if (!pattern) {
            if (log) this.showNotification('Please enter a custom regex pattern.', 'warning');
            return;
        }

        try {
            const flags = this.getRegexFlags();
            const regex = new RegExp(pattern, flags);
            let match;
            this.extractedEntities.custom.clear(); // Clear previous custom matches
            regex.lastIndex = 0; // Reset regex for exec loop

            while ((match = regex.exec(rawData)) !== null) {
                this.extractedEntities.custom.add(match[0]); // Add the full match
            }
            this.renderExtractedEntities();
            if (log) {
                this.showNotification(`Custom regex applied. Found ${this.extractedEntities.custom.size} matches.`, 'success');
                this.logAudit('APPLY_CUSTOM_REGEX', { pattern: pattern, flags: flags, matchesFound: this.extractedEntities.custom.size });
            }
        } catch (e) {
            if (log) this.showNotification(`Invalid regex pattern: ${e.message}`, 'error');
            console.error("Custom regex error:", e);
            if (log) this.logAudit('CUSTOM_REGEX_ERROR', { pattern: pattern, error: e.message });
        }
    }

    getRegexFlags() {
        let flags = '';
        if (document.getElementById('regex-flag-i').checked) flags += 'i';
        if (document.getElementById('regex-flag-g').checked) flags += 'g';
        if (document.getElementById('regex-flag-m').checked) flags += 'm';
        if (document.getElementById('regex-flag-s').checked) flags += 's';
        return flags;
    }

    // 3. Cross-Referencing & New Dork Suggestions

    selectEntity(value, type) {
        this.selectedEntity = { value, type };
        this.updateSelectedEntityDisplay();
        this.generateContextualDorks();
        this.generateExternalOsintLinks();
        this.logAudit('SELECT_ENTITY', { entityValue: value, entityType: type });
        // No notification here as it's a frequent interaction
    }

    updateSelectedEntityDisplay() {
        document.getElementById('selected-entity-value').textContent = this.selectedEntity.value || 'None';
        document.getElementById('selected-entity-type').textContent = this.selectedEntity.type ? `(${this.selectedEntity.type.replace(/_/g, ' ')})` : '(Click an extracted entity to select)';
        this.generateContextualDorks(); // Refresh when selected entity changes
        this.generateExternalOsintLinks(); // Refresh when selected entity changes
    }

    generateContextualDorks() {
        const dorkSuggestionsList = document.getElementById('dork-suggestions-list');
        dorkSuggestionsList.innerHTML = '';

        if (!this.selectedEntity.value) {
            dorkSuggestionsList.innerHTML = '<p class="placeholder-message">Select an entity to see relevant dorking suggestions.</p>';
            return;
        }

        let suggestions = [];
        const entityVal = this.selectedEntity.value;
        const entityType = this.selectedEntity.type;

        // General suggestions across engines
        suggestions.push({
            name: `General Search for "${entityVal}"`,
            query: `"${entityVal}"`,
            engines: ['google', 'bing'],
            icon: 'fas fa-search',
            description: 'Perform a general search for the selected entity.'
        });

        if (entityType === 'urls' || entityType === 'domain') {
            const domain = entityVal.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
            suggestions.push(
                { name: `Site search for ${domain}`, description: `Use 'site:' to restrict search to this domain.`, query: `site:${domain}`, engines: ['google', 'bing'], icon: 'fas fa-globe' },
                { name: `Identify exposed files on ${domain}`, description: `Look for common sensitive file types like configs, logs, or backups.`, query: `site:${domain} (filetype:log OR filetype:env OR inurl:backup OR inurl:admin)`, engines: ['google', 'bing'], icon: 'fas fa-file-code' },
                { name: `Discover subdomains of ${domain}`, description: `Find subdomains indexed by Google that might host different services.`, query: `site:*.${domain} -www`, engines: ['google'], icon: 'fas fa-sitemap' },
                { name: `Check Wayback Machine for ${domain}`, description: `Explore historical snapshots of web pages for old content.`, query: `site:web.archive.org/web/* ${domain}`, engines: ['google'], icon: 'fas fa-archive' },
                { name: `GitHub repositories for ${domain}`, description: `Search GitHub for code or projects related to this domain.`, query: `site:github.com "${domain}"`, engines: ['github'], icon: 'fab fa-github' }
            );
        } else if (entityType === 'ips') {
            const ip = entityVal.split(':')[0]; // Remove port if present
            suggestions.push(
                { name: `Shodan: IP services for ${ip}`, description: `Find open ports, banners, and services on this IP address.`, query: `ip:${ip}`, engine: 'shodan', icon: 'fas fa-search-dollar' },
                { name: `Censys: IP analysis for ${ip}`, description: `Get detailed host information and certificate data for the IP.`, query: `ip:${ip}`, engines: ['censys'], icon: 'fas fa-microscope' },
                { name: `ZoomEye: IP services for ${ip}`, description: `Identify services, devices, and applications running on the IP.`, query: `ip:${ip}`, engines: ['zoomeye'], icon: 'fas fa-crosshairs' },
                { name: `BinaryEdge: IP details for ${ip}`, description: `Access threat intelligence and historical data for the IP.`, query: `ip:${ip}`, engines: ['binaryedge'], icon: 'fas fa-binary' },
                { name: `Find webcams on network ${ip.split('.').slice(0,3).join('.')}.0/24`, description: `Scan the /24 subnet for exposed IP cameras.`, query: `net:${ip.split('.').slice(0,3).join('.')}.0/24 product:"IP Camera"`, engines: ['shodan'], icon: 'fas fa-video' }
            );
        } else if (entityType === 'emails') {
            const domain = entityVal.split('@')[1];
            suggestions.push(
                { name: `IntelX: Emails from ${domain}`, description: `Find more emails associated with this domain in IntelX database.`, query: `type:1 "${domain}"`, engines: ['intelx'], icon: 'fas fa-fingerprint' },
                { name: `Google for emails on ${domain} documents`, description: `Find documents on the domain containing email addresses.`, query: `site:${domain} filetype:pdf intext:"email"`, engines: ['google'], icon: 'fas fa-file-pdf' },
                { name: `LinkedIn profiles for "${entityVal}"`, description: `Search for LinkedIn profiles associated with the email.`, query: `site:linkedin.com "${entityVal}"`, engines: ['google'], icon: 'fab fa-linkedin' }
            );
        } else if (entityType === 'credentials') {
            suggestions.push(
                { name: `Search GitHub for "${entityVal}"`, description: `Find code repositories that might expose this credential, focusing on config files.`, query: `"${entityVal}" language:json OR language:yaml OR language:xml`, engines: ['github'], icon: 'fab fa-github' },
                { name: `Search Pastebin for "${entityVal}"`, description: `Look for leaked pastes containing the credential.`, query: `site:pastebin.com "${entityVal}"`, engines: ['google'], icon: 'fas fa-clipboard' },
                { name: `Google: Broad search for "${entityVal}"`, description: `Perform a broad web search for the credential with leak indicators.`, query: `"${entityVal}" (exposed OR leak OR confidential)`, engines: ['google', 'bing'], icon: 'fas fa-key' }
            );
        } else if (entityType === 'file_paths') {
            const filename = entityVal.split('/').pop();
            const fileExtension = filename.includes('.') ? filename.split('.').pop() : '';
            dorksToSuggest.push(
                { name: `Find filename "${filename}" on GitHub`, description: `Search GitHub for repositories containing this exact filename.`, query: `filename:${filename}`, engines: ['github'], icon: 'fab fa-github' },
                { name: `Search for filetype:${fileExtension} across sites`, description: `Look for other files of this type on the web.`, query: `filetype:${fileExtension} ${filename}`, engines: ['google', 'bing'], icon: 'fas fa-file-export' },
                { name: `Find public directories for "${entityVal}"`, description: `Look for exposed directory listings that include this file path.`, query: `intitle:"index of" "${entityVal}"`, engine: 'google', icon: 'fas fa-folder-open' }
            );
        } else if (entityType === 'custom') {
             suggestions.push(
                { name: `Google Search for custom match`, description: `General Google search for the custom extracted value.`, query: `"${entityVal}"`, engines: ['google'], icon: 'fab fa-google' },
                { name: `GitHub Search for custom match`, description: `Search GitHub for code containing the custom extracted value.`, query: `"${entityVal}"`, engines: ['github'], icon: 'fab fa-github' }
            );
        } else if (entityType === 'cve') {
            suggestions.push(
                { name: `Shodan search for CVE ${entityVal}`, description: `Find hosts vulnerable to this specific CVE on Shodan.`, query: `vuln:${entityVal}`, engine: 'shodan', icon: 'fas fa-bug' },
                { name: `Exploit-DB for ${entityVal}`, description: `Search for public exploits or proof-of-concepts related to the CVE.`, query: `site:exploit-db.com intext:"${entityVal}"`, engine: 'google', icon: 'fas fa-flask' },
                { name: `GitHub: Search for ${entityVal} POC`, description: `Find code or discussions about the CVE vulnerability.`, query: `"${entityVal}" (poc OR exploit)`, engine: 'github', icon: 'fab fa-github' }
            );
        } else if (entityType === 'person') {
            suggestions.push(
                { name: `Google for all social profiles of "${entityVal}"`, description: `Find public profiles across major social media platforms.`, query: `"${entityVal}" site:twitter.com OR site:linkedin.com OR site:facebook.com OR site:instagram.com`, engine: 'google', icon: 'fas fa-user-friends' },
                { name: `LinkedIn profile for "${entityVal}"`, description: `Directly search for professional profiles.`, query: `site:linkedin.com/in/ "${entityVal}"`, engine: 'google', icon: 'fab fa-linkedin' },
                { name: `News/Mentions of "${entityVal}"`, description: `Find articles or discussions mentioning the person or social entity.`, query: `"${entityVal}" site:news.google.com OR inurl:blog OR inurl:forum`, engine: 'google', icon: 'fas fa-newspaper' }
            );
        } else if (entityType === 'organization') {
            suggestions.push(
                { name: `Company domain for "${entityVal}"`, description: `Try to find the official website for the organization.`, query: `"${entityVal}" website`, engine: 'google', icon: 'fas fa-building' },
                { name: `Employee emails for "${entityVal}"`, description: `Look for exposed employee directories or email patterns.`, query: `"${entityVal}" employee email list filetype:xls OR filetype:csv`, engine: 'google', icon: 'fas fa-envelope' },
                { name: `Data leaks related to "${entityVal}"`, description: `Search for mentions of data breaches or exposed data.`, query: `"${entityVal}" data leak OR breach OR confidential filetype:pdf`, engine: 'google', icon: 'fas fa-shield-virus' }
            );
        } else if (entityType === 'iot') {
            dorksToSuggest.push(
                { name: `Shodan search for IoT device "${entityVal}"`, description: `Find instances of the IoT device exposed online.`, query: `product:"${entityVal}"`, engine: 'shodan', icon: 'fas fa-wifi' },
                { name: `Find exposed IoT dashboards for "${entityVal}"`, description: `Look for public control panels or interfaces.`, query: `intitle:"dashboard" inurl:iot "${entityVal}"`, engine: 'google', icon: 'fas fa-tachometer-alt' }
            );
        } else if (entityType === 'blockchain') {
            dorksToSuggest.push(
                { name: `Blockchain explorer for "${entityVal}"`, description: `Search public blockchain explorers for transaction history.`, query: `site:etherscan.io OR site:blockchain.com "${entityVal}"`, engine: 'google', icon: 'fas fa-bitcoin' },
                { name: `IntelX: Crypto addresses matching "${entityVal}"`, description: `Search IntelX for mentions of this crypto address/keyword.`, query: `selector:btc OR selector:eth "${entityVal}"`, engine: 'intelx', icon: 'fas fa-fingerprint' }
            );
        }


        if (dorksToSuggest.length > 0) {
            dorksToSuggest.forEach(dork => {
                suggestionsContainer.innerHTML += this._createSampleDorkItem(dork, targetValue);
            });
        } else {
            suggestionsContainer.innerHTML = `<p class="placeholder-message">No specific sample dorks for this category. Try a general search.</p>`;
        }
    }

    _createSampleDorkItem(dork, targetValuePlaceholder) {
        // Replace dynamic placeholders in the query if they exist
        let finalQuery = dork.query;
        if (targetValuePlaceholder) {
            finalQuery = finalQuery
                .replace(/\{\{DOMAIN_NAME\}\}/g, targetValuePlaceholder.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0])
                .replace(/\{\{TARGET_SITE\}\}/g, targetValuePlaceholder.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0])
                .replace(/\{\{EMAIL_DOMAIN\}\}/g, targetValuePlaceholder.split('@')[1] || targetValuePlaceholder)
                .replace(/\{\{SSH_VERSION\}\}/g, targetValuePlaceholder) // Assuming target value can be a version
                .replace(/\{\{CVE_ID\}\}/g, targetValuePlaceholder)
                .replace(/\{\{FULL_NAME\}\}/g, targetValuePlaceholder)
                .replace(/\{\{COMPANY_DOMAIN\}\}/g, targetValuePlaceholder)
                .replace(/\{\{COMPANY_NAME\}\}/g, targetValuePlaceholder)
                .replace(/\{\{ENTITY_NAME\}\}/g, targetValuePlaceholder)
                .replace(/\{\{FILE_TYPE\}\}/g, targetValuePlaceholder.split('.').pop())
                .replace(/\{\{GOOGLE_API_KEY_PATTERN\}\}/g, targetValuePlaceholder); // Example for API key pattern
        }

        // Encode the query for passing to onclick, especially if it contains quotes
        const encodedQuery = finalQuery.replace(/'/g, "\\'");

        return `
            <div class="sample-dork-item">
                <span class="dork-title"><i class="${dork.icon}"></i> ${dork.name}</span>
                <p class="dork-description">${dork.description}</p>
                <code>${this.highlightPlaceholders(finalQuery)}</code>
                <div class="dork-actions">
                    <button onclick="dorkAssistant._useSuggestedSampleDork('${encodedQuery}', '${targetValuePlaceholder}')" class="btn-primary">
                        <i class="fas fa-arrow-right"></i> Use Dork
                    </button>
                    <button onclick="navigator.clipboard.writeText('${encodedQuery}').then(() => dorkAssistant.showNotification(\'Dork copied!\', \'success\')).catch(() => dorkAssistant.showNotification(\'Failed to copy dork\', \'error\'))" class="btn-secondary">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        `;
    }

    _useSuggestedSampleDork(query, targetValue) {
        // Clear all existing inputs in the query builder
        document.getElementById('target-input').value = '';
        document.getElementById('basic-terms').value = '';
        this._clearQueryBuilderOperators();
        document.getElementById('target-profile-category').value = ''; // Reset category dropdown

        // Set the Target Input field if a target value was part of the suggestion
        if (targetValue) {
            document.getElementById('target-input').value = targetValue;
            document.getElementById('target-profile-category').value = this._detectCategoryFromValue(targetValue);
        }

        // Parse the suggested query and populate basic terms and operators
        let remainingQuery = query;

        // Extract any known operators from the suggested query
        const currentEngineOperators = this.searchEngines[this.currentEngine].operators;
        const operatorElements = document.querySelectorAll('.operator-field input');

        Object.values(currentEngineOperators).forEach(opConfig => {
            const operator = opConfig.operator;
            const suffix = opConfig.suffix || '';
            if (!operator) return;

            // Create a regex to find the operator and its value (handling quotes)
            const opRegex = new RegExp(`${operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:("|')([^"']*)("|')|([^\\s"]+))?`, 'i');
            const match = remainingQuery.match(opRegex);

            if (match) {
                let value = '';
                if (match[2]) { // For quoted values (match[2] is content inside quotes)
                    value = match[2];
                } else if (match[4]) { // For unquoted values (match[4] is the value after operator)
                    value = match[4];
                }

                const targetInput = Array.from(operatorElements).find(
                    input => input.dataset.operator === operator && input.dataset.suffix === suffix
                );

                if (targetInput) {
                    targetInput.value = value;
                    // Remove the matched part from the remaining query string
                    remainingQuery = remainingQuery.replace(match[0], '').trim();
                }
            }
        });

        // The rest of the query, after extracting operators, goes into basic terms
        document.getElementById('basic-terms').value = remainingQuery.trim();


        this.buildQuery(); // Rebuild the final query string displayed in the output box
        this.showNotification('Dork loaded into builder!', 'success');
        this.logAudit('USE_SAMPLE_DORK', { query: query, targetValue: targetValue });
    }

    _clearQueryBuilderOperators() {
        document.querySelectorAll('.operator-field input').forEach(input => {
            input.value = '';
        });
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

function clearQuery() { // Added global function for the new button
    if (window.dorkAssistant) {
        window.dorkAssistant.clearQuery();
    }
}

function searchTemplates() { // Added global function for template search bar
    if (window.dorkAssistant) {
        window.dorkAssistant.searchTemplates();
    }
}

function clearAuditLog() { // Added global function for clearing audit log
    if (window.dorkAssistant) {
        window.dorkAssistant.showDeleteConfirmModal(null, 'auditLog'); // Use the general delete confirm modal
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dorkAssistant = new DorkAssistant();
    // Set Query Builder as active by default on page load
    window.dorkAssistant.showDorkTab('query-builder');
});