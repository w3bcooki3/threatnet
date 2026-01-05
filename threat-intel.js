class ThreatIntel {
    constructor() {
        this.rss2jsonApi = 'https://api.rss2json.com/v1/api.json?rss_url=';
        this.feeds = this.loadFeeds();
        this.articles = [];
        this.filterSettings = {
            search: '',
            source: 'all',
            sort: 'newest'
        };
        this.pageSize = 20;

        this.addFeedModal = document.getElementById('addFeedModal');
        this.addFeedForm = document.getElementById('addFeedForm');
        this.feedListContainer = document.getElementById('feedListContainer');
        this.threatIntelGrid = document.getElementById('threat-intel-grid');
        this.sourceFilterSelect = document.getElementById('threat-intel-source-filter');
        this.noArticlesState = document.getElementById('no-articles-state');

        this.iocPlatforms = [
            { name: "VirusTotal", id: "virustotal", url: "https://www.virustotal.com/gui/search/" },
            { name: "Shodan", id: "shodan", url: "https://www.shodan.io/search?query=" },
            { name: "AbuseIPDB", id: "abuseipdb", url: "https://www.abuseipdb.com/check/" },
            { name: "Censys", id: "censys", url: "https://search.censys.io/search?q=" },
            { name: "ThreatHunter.ai", id: "threathunter", url: "https://threathunter.ai/search?q=" },
            { name: "Hybrid Analysis", id: "hybridanalysis", url: "https://www.hybrid-analysis.com/search?query=" },
            { name: "Urlscan.io", id: "urlscan", url: "https://urlscan.io/search/#" }
        ];
        this.selectedPlatforms = this.loadSelectedPlatforms();
        

        this.initEventListeners();
        this.fetchFeeds();
        this.renderPlatformCheckboxes();
    }

    initEventListeners() {
        if (this.addFeedForm) {
            this.addFeedForm.onsubmit = (e) => this.addFeed(e);
        }
        if (this.sourceFilterSelect) {
            this.sourceFilterSelect.onchange = () => this.filterArticles();
        }
        const searchInput = document.getElementById('threat-intel-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterArticles();
                }, 300);
            });
        }
        const sortSelect = document.getElementById('threat-intel-sort');
        if (sortSelect) {
            sortSelect.onchange = () => this.sortArticles();
        }
        const newsCountSelect = document.getElementById('news-count-select');
        if (newsCountSelect) {
            newsCountSelect.onchange = () => this.updatePageSize();
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const platformDropdown = document.getElementById('platform-dropdown');
            const toggleBtn = document.querySelector('.selector-toggle-btn');
            if (platformDropdown && !platformDropdown.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
                platformDropdown.style.display = 'none';
            }
        });
    }
    
    updatePageSize() {
        const select = document.getElementById('news-count-select');
        this.pageSize = parseInt(select.value);
        this.renderArticles(this.articles.slice(0, this.pageSize));
    }

    renderDashboard() {
        this.populateSourceFilter();
        this.renderArticles(this.articles.slice(0, this.pageSize));
    }
    
    // Fixed multiSearchIOC function to open multiple tabs.
    multiSearchIOC(ioc) {
        ioc = ioc.trim();
        if (!ioc) {
            this.showNotification("Please enter an IP, Domain, or Hash to search.", "warning");
            return;
        }
    
        if (this.selectedPlatforms.length === 0) {
            this.showNotification("Please select at least one platform to search on.", "warning");
            return;
        }
    
        const encodedIoc = encodeURIComponent(ioc);

        this.iocPlatforms
            .filter(platform => this.selectedPlatforms.includes(platform.name))
            .forEach(platform => {
                window.open(`${platform.url}${encodedIoc}`, '_blank');
            });
            
        this.showNotification(`Searching for "${ioc}" on ${this.selectedPlatforms.length} platforms...`, 'info', 4000);
    }
    
    loadSelectedPlatforms() {
        try {
            const savedPlatforms = localStorage.getItem('selectedPlatforms');
            return savedPlatforms ? JSON.parse(savedPlatforms) : ['VirusTotal', 'Shodan', 'AbuseIPDB', 'Censys'];
        } catch (e) {
            console.error("Error loading selected platforms:", e);
            return ['VirusTotal', 'Shodan', 'AbuseIPDB', 'Censys'];
        }
    }
    
    saveSelectedPlatforms() {
        localStorage.setItem('selectedPlatforms', JSON.stringify(this.selectedPlatforms));
    }

    renderPlatformCheckboxes() {
        const platformCheckboxes = document.getElementById('platform-checkboxes');
        if (!platformCheckboxes) return;
    
        platformCheckboxes.innerHTML = this.iocPlatforms.map(platform => `
            <label class="platform-checkbox-label">
                <input type="checkbox" value="${platform.name}" 
                       ${this.selectedPlatforms.includes(platform.name) ? 'checked' : ''} 
                       onchange="window.threatIntel.togglePlatformSelection('${platform.name}')">
                ${platform.name}
            </label>
        `).join('');
    }
    
    togglePlatformSelection(platformName) {
        const index = this.selectedPlatforms.indexOf(platformName);
        if (index > -1) {
            this.selectedPlatforms.splice(index, 1);
        } else {
            this.selectedPlatforms.push(platformName);
        }
        this.saveSelectedPlatforms();
        this.renderPlatformCheckboxes();
    }
    
    toggleAllPlatforms(selectAll) {
        if (selectAll) {
            this.selectedPlatforms = this.iocPlatforms.map(p => p.name);
        } else {
            this.selectedPlatforms = [];
        }
        this.saveSelectedPlatforms();
        this.renderPlatformCheckboxes();
    }
    
    togglePlatformDropdown(event) {
        event.stopPropagation();
        const dropdown = document.getElementById('platform-dropdown');
        const isExpanded = dropdown.style.display === 'block';
        dropdown.style.display = isExpanded ? 'none' : 'block';
        event.target.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            this.renderPlatformCheckboxes();
        }
    }

    loadFeeds() {
        try {
            const storedFeeds = localStorage.getItem('threatIntelFeeds');
            return storedFeeds ? JSON.parse(storedFeeds) : [
                { name: 'Hacker News (Feedburner)', url: 'https://feeds.feedburner.com/TheHackersNews' },
                { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
                { name: 'KrebsOnSecurity', url: 'https://krebsonsecurity.com/feed/' },
                { name: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/rssfeed.xml' },
                { name: 'Microsoft Security Blog', url: 'https://www.microsoft.com/en-us/security/blog/feed/' },
                { name: 'Google Cybersecurity Blog', url: 'https://security.googleblog.com/feeds/posts/default' }
            ];
        } catch (e) {
            console.error("Error loading feeds from local storage:", e);
            return [];
        }
    }

    saveFeeds() {
        localStorage.setItem('threatIntelFeeds', JSON.stringify(this.feeds));
    }

    renderFeedList() {
        if (!this.addFeedModal) {
            this.createAddFeedModal();
            this.addFeedModal = document.getElementById('addFeedModal');
            this.addFeedForm = document.getElementById('addFeedForm');
            this.feedListContainer = document.getElementById('feedListContainer');
            this.addFeedForm.onsubmit = (e) => this.addFeed(e);
        }
        if (!this.feedListContainer) return;

        if (this.feeds.length === 0) {
            this.feedListContainer.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No feeds added yet.</p>';
            return;
        }

        this.feedListContainer.innerHTML = this.feeds.map(feed => `
            <div class="feed-item">
                <span>${feed.name}</span>
                <button type="button" onclick="threatIntel.removeFeed('${feed.url}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    addFeed(event) {
        event.preventDefault();
        const feedNameInput = document.getElementById('feedName');
        const feedUrlInput = document.getElementById('feedUrl');

        const name = feedNameInput.value.trim();
        const url = feedUrlInput.value.trim();

        if (!name || !url) {
            this.showNotification('Please enter both feed name and URL.', 'error');
            return;
        }

        if (this.feeds.some(feed => feed.url === url)) {
            this.showNotification('This feed URL already exists.', 'warning');
            return;
        }

        this.feeds.push({ name, url });
        this.saveFeeds();
        this.renderFeedList();
        this.fetchFeeds();
        this.showNotification('Feed added successfully!', 'success');
        this.closeAddFeedModal();
    }

    removeFeed(urlToRemove) {
        this.feeds = this.feeds.filter(feed => feed.url !== urlToRemove);
        this.saveFeeds();
        this.renderFeedList();
        this.fetchFeeds();
        this.showNotification('Feed removed.', 'info');
    }

    showAddFeedModal() {
        if (!this.addFeedModal) {
            this.createAddFeedModal();
            this.addFeedModal = document.getElementById('addFeedModal');
            this.addFeedForm = document.getElementById('addFeedForm');
            this.feedListContainer = document.getElementById('feedListContainer');
            this.addFeedForm.onsubmit = (e) => this.addFeed(e);
        }
        this.addFeedModal.style.display = 'flex';
        this.renderFeedList();
    }

    closeAddFeedModal() {
        if (this.addFeedModal) {
            this.addFeedModal.style.display = 'none';
            document.getElementById('addFeedForm').reset();
        }
    }

    createAddFeedModal() {
        const modalHtml = `
            <div id="addFeedModal" class="modal">
                <div class="modal-content feed-modal-content">
                    <div class="modal-header">
                        <h3>Manage Threat Feeds</h3>
                        <button class="modal-close" onclick="threatIntel.closeAddFeedModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addFeedForm">
                            <div class="form-group">
                                <label for="feedName">Feed Name *</label>
                                <input type="text" id="feedName" name="feedName" required placeholder="e.g., Hacker News RSS">
                            </div>
                            <div class="form-group">
                                <label for="feedUrl">Feed URL *</label>
                                <input type="url" id="feedUrl" name="feedUrl" required placeholder="e.g., https://news.ycombinator.com/rss">
                                <small>Ensure the URL points to an RSS or Atom feed.</small>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-plus"></i> Add Feed
                                </button>
                            </div>
                        </form>
                        <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;">
                        <h4>Current Feeds</h4>
                        <div class="feed-list-container" id="feedListContainer">
                            </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    async fetchFeeds() {
        this.articles = [];
        const fetchPromises = this.feeds.map(feed => this.fetchSingleFeed(feed));
        
        await Promise.allSettled(fetchPromises);
        this.articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        this.populateSourceFilter();
        this.renderArticles(this.articles.slice(0, this.pageSize));
    }

    async fetchSingleFeed(feed) {
        try {
            const response = await fetch(`${this.rss2jsonApi}${encodeURIComponent(feed.url)}`);
            if (!response.ok) {
                if (response.status === 422) {
                    throw new Error(`The RSS2JSON service could not process this feed. It might be an invalid URL or a feed that cannot be converted: ${response.status}`);
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
                const newArticles = data.items.map(item => {
                    let imageUrl = item.thumbnail || (item.enclosure && item.enclosure.link) || null;
                    if (!imageUrl && item.description) {
                        const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                        if (imgMatch && imgMatch[1]) {
                            imageUrl = imgMatch[1];
                        }
                    }
                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = null;
                    }

                    return {
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        pubDate: item.pubDate,
                        author: item.author || data.feed.title || feed.name,
                        source: feed.name,
                        thumbnail: imageUrl
                    };
                });
                this.articles.push(...newArticles);
            } else {
                console.error(`Error fetching feed ${feed.name}:`, data.message || 'Unknown error');
                this.showNotification(`Failed to load feed: ${feed.name}. ${data.message || 'Check URL or try again later.'}`, 'error');
            }
        } catch (error) {
            console.error(`Could not fetch RSS feed from ${feed.name} (${feed.url}):`, error);
            this.showNotification(`Error loading articles from ${feed.name}: ${error.message}.`, 'error');
        }
    }

    populateSourceFilter() {
        if (!this.sourceFilterSelect) return;
        this.sourceFilterSelect.innerHTML = '<option value="all">All Sources</option>';
        const uniqueSources = [...new Set(this.articles.map(article => article.source))].sort();
        uniqueSources.forEach(source => {
            const option = document.createElement('option');
            option.value = source;
            option.textContent = source;
            this.sourceFilterSelect.appendChild(option);
        });
        this.sourceFilterSelect.value = this.filterSettings.source;
    }

    filterArticles() {
        this.filterSettings.search = document.getElementById('threat-intel-search')?.value.toLowerCase() || '';
        this.filterSettings.source = document.getElementById('threat-intel-source-filter')?.value || 'all';
        this.filterSettings.sort = document.getElementById('threat-intel-sort')?.value || 'newest';

        let filtered = [...this.articles];

        if (this.filterSettings.search) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(this.filterSettings.search) ||
                (article.description && article.description.toLowerCase().includes(this.filterSettings.search)) ||
                article.author.toLowerCase().includes(this.filterSettings.search)
            );
        }

        if (this.filterSettings.source !== 'all') {
            filtered = filtered.filter(article => article.source === this.filterSettings.source);
        }

        switch (this.filterSettings.sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
                break;
            case 'title-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        this.renderArticles(filtered.slice(0, this.pageSize));
    }

    sortArticles() {
        this.filterArticles();
    }
    
    renderArticles(articlesToRender) {
        const newsListContainer = this.threatIntelGrid;
        if (!newsListContainer) return;

        if (articlesToRender.length === 0) {
            this.noArticlesState.style.display = 'flex';
            this.threatIntelGrid.innerHTML = '';
            return;
        } else {
            this.noArticlesState.style.display = 'none';
        }
        
        const isListView = document.querySelector('.threat-intel-view-toggle .list-btn').classList.contains('active');
        if (isListView) {
            newsListContainer.className = 'threat-intel-list';
            newsListContainer.innerHTML = articlesToRender.map(article => this.createArticleListItem(article)).join('');
        } else {
            newsListContainer.className = 'threat-intel-grid';
            newsListContainer.innerHTML = articlesToRender.map(article => this.createArticleCard(article)).join('');
        }
    }
    
    createArticleCard(article) {
        const highlightedTitle = this.highlightKeywords(this.stripHtml(article.title));
        const highlightedDescription = this.highlightKeywords(this.stripHtml(article.description || '')).substring(0, 200) + '...';
        const hasImage = article.thumbnail && article.thumbnail !== '';
        
        const firstIoc = this.stripHtml(article.title + ' ' + article.description).match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b|\b([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6})\b|\b[A-Fa-f0-9]{32}\b|\b[A-Fa-f0-9]{40}\b|\b[A-Fa-f0-9]{64}\b/);
        const viewIocButton = firstIoc ? `
            <button class="news-item-action" onclick="event.preventDefault(); event.stopPropagation(); window.threatIntel.multiSearchIOC('${firstIoc[0]}');" title="Multi-platform Search">
                <i class="fas fa-search-plus"></i>
            </button>
        ` : '';

        return `
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="threat-intel-article-card fade-in ${hasImage ? '' : 'no-image-card'}">
                ${hasImage ? `
                    <div class="article-image-container">
                        <img src="${article.thumbnail}" alt="${this.stripHtml(article.title)} thumbnail" onerror="this.style.display='none';">
                    </div>` : ''}
                <div class="article-content">
                    <div class="article-meta-info">
                        <strong>${article.source}</strong> • ${this.formatDate(article.pubDate)}
                    </div>
                    <h3 class="article-title">${highlightedTitle}</h3>
                    <p class="article-description">${highlightedDescription}</p>
                    <div class="card-footer">
                        <span class="read-more">Read More <i class="fas fa-arrow-right"></i></span>
                        ${viewIocButton}
                    </div>
                </div>
            </a>
        `;
    }

    createArticleListItem(article) {
        const highlightedTitle = this.highlightKeywords(this.stripHtml(article.title));
        const firstIoc = this.stripHtml(article.title + ' ' + article.description).match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b|\b([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6})\b|\b[A-Fa-f0-9]{32}\b|\b[A-Fa-f0-9]{40}\b|\b[A-Fa-f0-9]{64}\b/);
        const viewIocButton = firstIoc ? `
            <button class="news-item-action" onclick="event.preventDefault(); event.stopPropagation(); window.threatIntel.multiSearchIOC('${firstIoc[0]}');" title="Multi-platform Search">
                <i class="fas fa-search-plus"></i>
            </button>
        ` : '';

        return `
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-feed-item fade-in">
                <div class="news-item-details">
                    <h4 class="news-item-title">${highlightedTitle}</h4>
                    <span class="news-item-source">
                        ${article.source} &bull; ${this.formatDate(article.pubDate)}
                    </span>
                </div>
                <div class="news-item-actions">
                    ${viewIocButton}
                </div>
            </a>
        `;
    }

    toggleView(view) {
        const gridBtn = document.querySelector('.threat-intel-view-toggle .grid-btn');
        const listBtn = document.querySelector('.threat-intel-view-toggle .list-btn');

        if (view === 'grid') {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            gridBtn.classList.remove('active');
            listBtn.classList.add('active');
        }
        this.renderArticles(this.articles);
    }
    
    stripHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    
    highlightKeywords(text) {
        const keywords = {
            'apt': 'APT', 'ransomware': 'Ransomware', 'malware': 'Malware', 'phishing': 'Phishing', 'zero-day': 'Zero-Day', 'exploit': 'Exploit', 'cve-': 'CVE', 'lazarus': 'Lazarus Group', 'fancy bear': 'Fancy Bear', 'sandworm': 'Sandworm', 'revil': 'REvil'
        };
        let result = text;
        for (const key in keywords) {
            const regex = new RegExp(`\\b(${key})\\b`, 'gi');
            result = result.replace(regex, `<span class="intel-badge">${keywords[key]}</span>`);
        }
        return result;
    }
    
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.warn("showNotification function not found. Displaying alert instead:", message);
            alert(message);
        }
    }
}

window.showSection = (() => {
    const originalShowSection = window.showSection;
    return (sectionName) => {
        originalShowSection(sectionName);
        if (sectionName === 'threat-intel' && window.threatIntel) {
            window.threatIntel.renderArticles(window.threatIntel.articles);
        }
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    if (typeof ThreatIntel !== 'undefined') {
        window.threatIntel = new ThreatIntel();
    }
});