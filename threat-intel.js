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

        this.addFeedModal = document.getElementById('addFeedModal');
        this.addFeedForm = document.getElementById('addFeedForm');
        this.feedListContainer = document.getElementById('feedListContainer');
        this.threatIntelGrid = document.getElementById('threat-intel-grid');
        this.sourceFilterSelect = document.getElementById('threat-intel-source-filter');
        this.noArticlesState = document.getElementById('no-articles-state');

        this.initEventListeners();
        this.fetchFeeds();
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
    }

    loadFeeds() {
        try {
            const storedFeeds = localStorage.getItem('threatIntelFeeds');
            return storedFeeds ? JSON.parse(storedFeeds) : [
                { name: 'Hacker News (Feedburner)', url: 'https://feeds.feedburner.com/TheHackersNews' },
                { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
                { name: 'KrebsOnSecurity', url: 'https://krebsonsecurity.com/feed/' },
                { name: 'SecurityWeek', url: 'https://www.securityweek.com/feed/' },
                { name: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/rssfeed.xml' },
                { name: 'Microsoft Security Blog', url: 'https://www.microsoft.com/en-us/security/blog/feed/' },
                { name: 'Google Cybersecurity Blog', url: 'https://security.googleblog.com/feeds/posts/default' }
                // Add more feeds, but test them first on rss2json.com!
                // { name: 'Cybersecurity Dive', url: 'https://www.cybersecuritydive.com/feeds/news/' },
                // { name: 'ThreatConnect Blog', url: 'https://threatconnect.com/blog/feed/' }
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
        this.filterArticles();
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

        this.renderArticles(filtered);
    }

    sortArticles() {
        this.filterArticles();
    }

    // --- Article Rendering for Magazine Style ---
    renderArticles(articlesToRender) {
        if (!this.threatIntelGrid) return;

        if (articlesToRender.length === 0) {
            this.noArticlesState.style.display = 'flex';
            this.threatIntelGrid.innerHTML = '';
            return;
        } else {
            this.noArticlesState.style.display = 'none';
        }

        const articleHtml = articlesToRender.map((article, index) => {
            const hasImage = article.thumbnail && article.thumbnail !== '';
            let articleTypeClass = 'type-card'; // Default to a standard grid card

            if (index === 0) {
                // Main featured article
                articleTypeClass = 'type-main-featured';
            } else if (index >= 1 && index <= 4 && hasImage) {
                // Next few articles with images: list item style
                articleTypeClass = 'type-list-item';
            } else if (index >= 5 && index <= 8 && !hasImage) {
                // Some text-only articles after the list items
                articleTypeClass = 'type-text-only';
            }
            // All others will default to 'type-card'

            return `
                <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="threat-intel-article-link ${articleTypeClass} fade-in" style="animation-delay: ${index * 0.05}s;">
                    ${hasImage ? `
                        <div class="article-image-container">
                            <img src="${article.thumbnail}" alt="${this.stripHtml(article.title)} thumbnail" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x225?text=Image+Not+Found';">
                        </div>` : ''}
                    <div class="article-content">
                        <div class="article-meta-info">
                            <strong>${article.source}</strong> / ${this.formatDate(article.pubDate)}
                        </div>
                        <h3 class="article-title">${article.title}</h3>
                        ${!articleTypeClass.includes('type-list-item') && !articleTypeClass.includes('type-text-only') ? // Show description for main-featured and standard cards
                            `<p class="article-description">${this.stripHtml(article.description).substring(0, 150)}...</p>` : ''}
                        ${articleTypeClass.includes('type-text-only') ? // Show description explicitly for text-only
                            `<p class="article-description">${this.stripHtml(article.description).substring(0, 200)}...</p>` : ''}
                        
                        <div class="card-footer">
                            <span class="read-more">Read More <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        this.threatIntelGrid.innerHTML = articleHtml;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    stripHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
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

document.addEventListener('DOMContentLoaded', () => {
    window.threatIntel = new ThreatIntel();
});