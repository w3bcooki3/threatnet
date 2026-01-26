// cheatsheets.js - Cheatsheet Management
class CheatsheetsManager {
    constructor() {
        this.cheatsheets = [
            // Define your cheatsheet "chapters" here
            {
                id: 'osint-basics',
                title: 'OSINT Basics: Getting Started',
                description: 'A fundamental guide to Open-Source Intelligence, covering core principles and basic tools.',
                category: 'OSINT',
                filePath: 'cheatsheets/osint-basics.html',
                date: '2025-07-23',
                icon: 'fas fa-search-location'
            },
            // --- NEW CHAPTER ENTRIES BELOW ---
            {
                id: 'osint-th-part1-ch1',
                title: 'Chapter 1: The Investigator\'s Mindset & Advanced OSINT Frameworks',
                description: 'Part 1: Foundational Expertise & Operational Preparedness. Cultivating the Advanced OSINT Investigator\'s Mindset & translating requirements into actionable plans.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part1-ch1.html',
                date: '2025-07-26',
                icon: 'fas fa-brain'
            },
            {
                id: 'osint-th-part1-ch2',
                title: 'Chapter 2: Hardening the Investigator\'s Environment & Advanced OpSec',
                description: 'Part 1: Foundational Expertise & Operational Preparedness. Practical steps to create and maintain a secure, deniable, and effective investigative infrastructure.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part1-ch2.html',
                date: '2025-07-26',
                icon: 'fas fa-user-shield'
            },
            {
                id: 'osint-th-part1-ch3',
                title: 'Chapter 3: Intelligence Requirements & Planning for Complex Operations',
                description: 'Part 1: Foundational Expertise & Operational Preparedness. Re-evaluating large-scale project management for long-term intelligence tracking.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part1-ch3.html',
                date: '2025-07-26',
                icon: 'fas fa-clipboard-list'
            },
            {
                id: 'osint-th-part2-ch4',
                title: 'Chapter 4: Advanced Web OSINT: Deep & Dark Web Exploitation',
                description: 'Part 2: Deep Dive into Digital Footprinting & Infrastructure Discovery. Mastering sophisticated web-based search and safely navigating illicit online spaces.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part2-ch4.html',
                date: '2025-07-26',
                icon: 'fas fa-globe'
            },
            {
                id: 'osint-th-part2-ch5',
                title: 'Chapter 5: Network Infrastructure Mapping & Pivot Points (Passive)',
                description: 'Part 2: Deep Dive into Digital Footprinting & Infrastructure Discovery. Identifying and mapping adversary network infrastructure without direct interaction.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part2-ch5.html',
                date: '2025-07-26',
                icon: 'fas fa-map-marked-alt'
            },
            {
                id: 'osint-th-part2-ch6',
                title: 'Chapter 6: Domain & IP Fingerprinting for Adversary Tracking',
                description: 'Part 2: Deep Dive into Digital Footprinting & Infrastructure Discovery. Extracting critical intelligence from domain registrations and IP addresses to link infrastructure and actors.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part2-ch6.html',
                date: '2025-07-26',
                icon: 'fas fa-fingerprint'
            },
            {
                id: 'osint-th-part2-ch7',
                title: 'Chapter 7: Exposing Attack Infrastructure: Certificates, Headers & Artifacts',
                description: 'Part 2: Deep Dive into Digital Footprinting & Infrastructure Discovery. Leveraging subtle technical fingerprints to unmask hidden or obfuscated adversary infrastructure.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part2-ch7.html',
                date: '2025-07-26',
                icon: 'fas fa-lock'
            },
            {
                id: 'osint-th-part3-ch8',
                title: 'Chapter 8: Social Media & Open-Source Human Intelligence (OS-HUMINT)',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Advanced techniques for leveraging social platforms and public records for attribution.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch8.html',
                date: '2025-07-26',
                icon: 'fas fa-users'
            },
            {
                id: 'osint-th-part3-ch9',
                title: 'Chapter 9: Open Source Code & Developer Footprint Analysis',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Hunting for exposed secrets, indicators, and developer patterns within public code repositories.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch9.html',
                date: '2025-07-26',
                icon: 'fas fa-code-branch'
            },
            {
                id: 'osint-th-part3-ch10',
                title: 'Chapter 10: File & Metadata Forensics for Attribution',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Deep diving into digital files to extract hidden intelligence and establish links to actors.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch10.html',
                date: '2025-07-26',
                icon: 'fas fa-file-invoice'
            },
            {
                id: 'osint-th-part3-ch11',
                title: 'Chapter 11: Integrating OSINT with Threat Intelligence Platforms (TIPs) & SIEMs',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Operationalizing OSINT by fusing it with internal telemetry and structured threat intelligence.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch11.html',
                date: '2025-07-26',
                icon: 'fas fa-cogs'
            },
            {
                id: 'osint-th-part3-ch12',
                title: 'Chapter 12: Malware Intelligence from an OSINT Perspective',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Extracting actionable intelligence from publicly available malware samples and reports.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch12.html',
                date: '2025-07-26',
                icon: 'fas fa-virus'
            },
            {
                id: 'osint-th-part3-ch13',
                title: 'Chapter 13: Cryptocurrency & Financial Tracing (OSINT-driven)',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Practical steps for following illicit financial flows on public blockchains and linking them to cybercriminals.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch13.html',
                date: '2025-07-26',
                icon: 'fas fa-coins'
            },
            {
                id: 'osint-th-part3-ch14',
                title: 'Chapter 14: Human-in-the-Loop AI/ML for OSINT Automation',
                description: 'Part 3: Data Correlation, Attribution & Advanced Investigative Techniques. Leveraging AI/ML tools to accelerate and enhance OSINT data collection, correlation, and analysis.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part3-ch14.html',
                date: '2025-07-26',
                icon: 'fas fa-robot'
            },
            {
                id: 'osint-th-part4-ch15',
                title: 'Chapter 15: Proactive Threat Hunting based on OSINT Leads',
                description: 'Part 4: Actionable Outcomes, Reporting & Advanced Hunting Strategies. Shifting from reactive incident response to proactive hunting using intelligence gathered from OSINT.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part4-ch15.html',
                date: '2025-07-26',
                icon: 'fas fa-bullseye'
            },
            {
                id: 'osint-th-part4-ch16',
                title: 'Chapter 16: Building Comprehensive Threat Actor Profiles & TTP Mapping',
                description: 'Part 4: Actionable Outcomes, Reporting & Advanced Hunting Strategies. Structuring and enriching intelligence to create detailed profiles of cybercriminal groups and their methods.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part4-ch16.html',
                date: '2025-07-26',
                icon: 'fas fa-user-ninja'
            },
            {
                id: 'osint-th-part4-ch17',
                title: 'Chapter 17: Infrastructure Disruption & Counter-OSINT Strategies',
                description: 'Part 4: Actionable Outcomes, Reporting & Advanced Hunting Strategies. Strategies to disrupt adversary operations and understanding how threat actors use OSINT against defenders.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part4-ch17.html',
                date: '2025-07-26',
                icon: 'fas fa-slash'
            },
            {
                id: 'osint-th-part4-ch18',
                title: 'Chapter 18: Strategic Attribution: From Technical Indicators to Actors',
                description: 'Part 4: Actionable Outcomes, Reporting & Advanced Hunting Strategies. The methodical process of moving from technical indicators of compromise (IOCs) to confident attribution.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part4-ch18.html',
                date: '2025-07-26',
                icon: 'fas fa-user-secret'
            },
            {
                id: 'osint-th-part4-ch19',
                title: 'Chapter 19: High-Impact Intelligence Reporting & Dissemination',
                description: 'Part 4: Actionable Outcomes, Reporting & Advanced Hunting Strategies. Crafting clear, concise, and actionable intelligence reports for various stakeholders.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part4-ch19.html',
                date: '2025-07-26',
                icon: 'fas fa-file-contract'
            },
            {
                id: 'osint-th-part4-ch20',
                title: 'Chapter 20: The Evolving Landscape: Future Proofing Your OSINT & Hunting Capabilities',
                description: 'Part 4: Actionable Outcomes, Reporting & Advanced Hunting Strategies. Anticipating future trends, emerging technologies, and shifts in the cybercriminal landscape.',
                category: 'OSINT & Threat Hunting',
                filePath: 'cheatsheets/osint-th-part4-ch20.html',
                date: '2025-07-26',
                icon: 'fas fa-chart-line'
            }
            // Add more cheatsheets here following the same structure
        ];

        this.cheatsheetsGrid = document.getElementById('cheatsheets-grid');
        this.cheatsheetDetailView = document.getElementById('cheatsheet-detail-view');
        this.cheatsheetContentArea = document.getElementById('cheatsheet-content');
        this.emptyState = document.getElementById('empty-cheatsheet-state');

        this.cheatsheetGridViewButton = document.getElementById('grid-view-btn'); // New reference for grid view button
        this.cheatsheetListViewButton = document.getElementById('list-view-btn'); // New reference for list view button

        this.currentCheatsheetId = null;

        this.initializeUI();
        this.setCheatsheetView('grid'); // Set default view to grid on load
    }

    initializeUI() {
        this.loadCheatsheets(); // Initial render of all cheatsheet cards
    }

    loadCheatsheets() {
        if (this.cheatsheets.length === 0) {
            this.showEmptyState();
            return;
        }

        this.hideEmptyState();
        this.cheatsheetsGrid.style.display = 'grid'; // Ensure grid is visible
        this.cheatsheetDetailView.style.display = 'none'; // Ensure detail view is hidden

        this.cheatsheetsGrid.innerHTML = this.cheatsheets.map(cs => this.createCheatsheetCard(cs)).join('');
    }

    createCheatsheetCard(cheatsheet) {
        // Extract chapter number from the title if it follows "Chapter X:" pattern
        const chapterMatch = cheatsheet.title.match(/Chapter (\d+):/);
        const chapterNum = chapterMatch ? chapterMatch[1] : ''; // Get the number, or empty string if not found

        return `
            <div class="cheatsheet-card fade-in" onclick="window.cheatsheetsManager.openCheatsheet('${cheatsheet.id}')" data-chapter-num="${chapterNum}">
                <div class="cheatsheet-card-header">
                    <div class="cheatsheet-icon">
                        <i class="${cheatsheet.icon}"></i>
                    </div>
                    <h3 class="cheatsheet-title">${cheatsheet.title}</h3>
                </div>
                <p class="cheatsheet-description">${cheatsheet.description}</p>
                <div class="cheatsheet-meta">
                    <span class="cheatsheet-category-badge">${cheatsheet.category}</span>
                    <span class="cheatsheet-date">${this.formatDate(cheatsheet.date)}</span>
                </div>
            </div>
        `;
    }

    async openCheatsheet(cheatsheetId) {
        const cheatsheet = this.cheatsheets.find(cs => cs.id === cheatsheetId);
        if (!cheatsheet) {
            this.showNotification('Cheatsheet not found.', 'error');
            return;
        }

        this.currentCheatsheetId = cheatsheetId;

        // Show loading indicator (optional)
        this.cheatsheetContentArea.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:1rem;">Loading cheatsheet...</p></div>';
        
        // Hide cheatsheet grid, show detail view
        this.cheatsheetsGrid.style.display = 'none';
        this.cheatsheetDetailView.style.display = 'block';

        try {
            const response = await fetch(cheatsheet.filePath);
            if (!response.ok) {
                throw new Error(`Failed to load cheatsheet content: ${response.statusText}`);
            }
            const content = await response.text();
            this.cheatsheetContentArea.innerHTML = content; // Inject the HTML content
            
            // Scroll to top of the detail view
            this.cheatsheetDetailView.scrollTop = 0;

        } catch (error) {
            console.error('Error loading cheatsheet content:', error);
            this.cheatsheetContentArea.innerHTML = `<div style="color: #dc3545; text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
                <p style="margin-top:1rem;">Failed to load cheatsheet content. Please check the file path.</p>
                <p>Error: ${error.message}</p>
            </div>`;
            this.showNotification(`Error loading cheatsheet: ${cheatsheet.title}`, 'error');
        }
    }

    showCheatsheetList() {
        this.currentCheatsheetId = null;
        this.cheatsheetDetailView.style.display = 'none';
        this.cheatsheetsGrid.style.display = 'grid'; // Re-show the grid
        this.setCheatsheetView(this.cheatsheetsGrid.classList.contains('list-view') ? 'list' : 'grid'); // Reapply current view
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    showEmptyState() {
        this.cheatsheetsGrid.style.display = 'none';
        this.cheatsheetDetailView.style.display = 'none';
        this.emptyState.style.display = 'flex';
    }

    hideEmptyState() {
        this.emptyState.style.display = 'none';
    }

    /**
     * Switches the display mode of cheatsheets between 'grid' and 'list'.
     * @param {string} viewType - 'grid' or 'list'.
     */
    setCheatsheetView(viewType) {
        if (viewType === 'list') {
            this.cheatsheetsGrid.classList.add('list-view');
            this.cheatsheetListViewButton.classList.add('active');
            this.cheatsheetGridViewButton.classList.remove('active');
        } else { // Default to grid view
            this.cheatsheetsGrid.classList.remove('list-view');
            this.cheatsheetGridViewButton.classList.add('active');
            this.cheatsheetListViewButton.classList.remove('active');
        }
        // Ensure cheatsheet detail view is hidden when switching views (if already open)
        this.cheatsheetDetailView.style.display = 'none';
        this.cheatsheetsGrid.style.display = 'grid'; // Ensure the grid is visible when switching from detail or on initial load
    }

    // Proxy for global showNotification (assuming it exists in script.js)
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
    window.cheatsheetsManager = new CheatsheetsManager();
});