// cryphunter.js
// This class manages the CryptHunter feature, including mock data, UI rendering, and visualization.

class CryptHunter {
    constructor() {
        // --- State Management ---
        this.currentTab = 'dashboard';
        this.mockData = this.generateMockData();
        this.watchlist = this.loadWatchlist();
        this.rules = this.loadRules();
        this.alerts = this.generateMockAlerts();
        this.cytoscapeInstance = null;
        this.activeAddressData = null; // Stores data for the currently viewed address
        
        // --- DOM Elements (Initial values set to null, will be populated in init) ---
        this.tabsNav = null;
        this.tabContents = null;
        this.dashboardMetrics = {
            totalAlerts: null,
            watchlistCount: null,
            suspiciousTransactions: null,
            rulesCount: null
        };
        this.suspiciousActivityList = null;
        this.alertsListContainer = null;
        this.addressInput = null;
        this.addressSearchBtn = null;
        this.addressResultsContainer = null;
        this.ruleEngineList = null;
        this.watchlistAddInput = null;
        this.watchlistAddBtn = null;
        this.watchlistTableBody = null;
        this.reportsList = null;
        this.generateReportBtn = null;
        this.exportReportDataBtn = null;
        this.addRuleBtn = null;
        this.refreshBtn = null;
        this.settingsForm = null;
        this.tabAlertsCount = null;
        this.tabWatchlistCount = null;
    }

    // Main initialization method to be called once HTML is loaded
    init() {
        // --- Populate DOM Elements ---
        this.tabsNav = document.getElementById('cryphunter-tabs-nav');
        this.tabContents = document.querySelectorAll('.cryphunter-tab-content');
        this.dashboardMetrics = {
            totalAlerts: document.getElementById('total-alerts-count'),
            watchlistCount: document.getElementById('watchlist-total-count'),
            suspiciousTransactions: document.getElementById('suspicious-transactions-count'),
            rulesCount: document.getElementById('rules-count')
        };
        this.suspiciousActivityList = document.getElementById('suspicious-activity-list');
        this.alertsListContainer = document.getElementById('alerts-list-container');
        this.addressInput = document.getElementById('crypto-address-input');
        this.addressSearchBtn = document.getElementById('crypto-address-search-btn');
        this.addressResultsContainer = document.getElementById('address-search-results');
        this.ruleEngineList = document.getElementById('rule-engine-list');
        this.watchlistAddInput = document.getElementById('watchlist-add-input');
        this.watchlistAddBtn = document.getElementById('watchlist-add-btn');
        this.watchlistTableBody = document.getElementById('watchlist-table-body');
        this.reportsList = document.getElementById('past-reports-list');
        this.generateReportBtn = document.getElementById('generate-report-btn');
        this.exportReportDataBtn = document.getElementById('export-report-data-btn');
        this.addRuleBtn = document.getElementById('rule-engine-add-rule-btn');
        this.refreshBtn = document.getElementById('cryptohunter-refresh-btn');
        this.settingsForm = document.querySelector('#crypthunter-settings-tab .api-key-form');
        this.tabAlertsCount = document.getElementById('alerts-count');
        this.tabWatchlistCount = document.getElementById('watchlist-count');

        // Render everything and set up listeners
        this.renderAll();
        this.setupEventListeners();
        const dashboardBtn = document.querySelector('.cryphunter-tab-btn[data-tab="dashboard"]');
        if (dashboardBtn) {
            this.showTab(dashboardBtn);
        } else {
            console.error('Initial dashboard button not found after initialization.');
        }
    }

    // Set up event listeners for filters and buttons
    setupEventListeners() {
        // Tab navigation
        if (this.tabsNav) {
            this.tabsNav.addEventListener('click', (e) => {
                const button = e.target.closest('.cryphunter-tab-btn');
                if (button) {
                    this.showTab(button);
                }
            });
        }
        
        // Address search
        this.addressSearchBtn?.addEventListener('click', () => this.searchAddress());
        this.addressInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchAddress();
            }
        });

        // Watchlist
        this.watchlistAddBtn?.addEventListener('click', () => this.addWatchlistAddress());
        this.watchlistAddInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addWatchlistAddress();
            }
        });
        
        // Other buttons
        this.refreshBtn?.addEventListener('click', () => this.renderDashboard());
        this.addRuleBtn?.addEventListener('click', () => this.showNotification('Rule Engine is a mock feature for this demo.', 'info'));
        this.generateReportBtn?.addEventListener('click', () => this.generateReport());
        this.exportReportDataBtn?.addEventListener('click', () => this.exportReportData());

        // Attach listeners for dynamic content
        this.watchlistTableBody?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('remove-btn')) {
                const address = target.dataset.address;
                this.removeWatchlistAddress(address);
            } else if (target.classList.contains('investigate-btn')) {
                const address = target.dataset.address;
                this.addressInput.value = address;
                this.showTab(document.querySelector('.cryphunter-tab-btn[data-tab="address-search"]'));
                this.searchAddress();
            }
        });
    }

    // --- Tab Management ---
    showTab(button) {
        if (!button) {
            console.warn("showTab called with a null button. Aborting.");
            return;
        }

        this.currentTab = button.dataset.tab;

        this.tabContents.forEach(content => content.classList.remove('active'));
        if (this.tabsNav) {
            this.tabsNav.querySelectorAll('.cryphunter-tab-btn').forEach(btn => btn.classList.remove('active'));
        }

        const targetTab = document.getElementById(`crypthunter-${this.currentTab}-tab`);
        if (targetTab) {
             targetTab.classList.add('active');
             button.classList.add('active');
        } else {
            console.error(`Tab content for crypthunter-${this.currentTab}-tab not found.`);
        }

        // Re-render based on tab
        switch (this.currentTab) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'alerts':
                this.renderAlerts();
                break;
            case 'rule-engine':
                this.renderRuleEngine();
                break;
            case 'watchlist':
                this.renderWatchlist();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    // --- Mock Data Generation ---
    generateMockData() {
        // Mock data simulating a transaction graph for a single address
        const rootAddress = '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T';
        const blacklistedAddress = '0xBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEAD';
        const suspiciousAddress = '0xCAFEF00DC0FFEECAFEF00DC0FFEECAFEF00DC0FFEE';
        const knownExchange = '0xEXCH1234EXCH1234EXCH1234EXCH1234EXCH1234';

        const transactions = [
            { id: 'tx_1', from: '0xSTART', to: rootAddress, value: 50, timestamp: '2025-07-25T10:00:00Z', riskScore: 0.1, chain: 'Ethereum' },
            { id: 'tx_2', from: rootAddress, to: suspiciousAddress, value: 25, timestamp: '2025-07-25T11:00:00Z', riskScore: 0.8, chain: 'Ethereum' },
            { id: 'tx_3', from: suspiciousAddress, to: '0xANOTHER', value: 10, timestamp: '2025-07-25T12:00:00Z', riskScore: 0.9, chain: 'Ethereum' },
            { id: 'tx_4', from: '0xGOOD', to: rootAddress, value: 100, timestamp: '2025-07-26T10:00:00Z', riskScore: 0.2, chain: 'Ethereum' },
            { id: 'tx_5', from: rootAddress, to: knownExchange, value: 75, timestamp: '2025-07-26T11:00:00Z', riskScore: 0.1, chain: 'Ethereum' },
            { id: 'tx_6', from: knownExchange, to: '0xBUYER', value: 75, timestamp: '2025-07-26T11:05:00Z', riskScore: 0.1, chain: 'Ethereum' },
            { id: 'tx_7', from: rootAddress, to: blacklistedAddress, value: 10, timestamp: '2025-07-27T10:00:00Z', riskScore: 1.0, chain: 'Ethereum' },
            { id: 'tx_8', from: blacklistedAddress, to: '0xMIXER', value: 10, timestamp: '2025-07-27T10:05:00Z', riskScore: 1.0, chain: 'Ethereum' },
            { id: 'tx_9', from: '0xSTART', to: rootAddress, value: 200, timestamp: '2025-07-28T10:00:00Z', riskScore: 0.2, chain: 'Bitcoin' },
            { id: 'tx_10', from: rootAddress, to: '0xGOOD', value: 150, timestamp: '2025-07-28T11:00:00Z', riskScore: 0.2, chain: 'Bitcoin' }
        ];

        return {
            addresses: {
                [rootAddress]: {
                    label: 'Root Address',
                    riskScore: 0.8,
                    tags: ['Primary Target', 'Wallet'],
                    txs: transactions.filter(tx => tx.from === rootAddress || tx.to === rootAddress)
                },
                [blacklistedAddress]: {
                    label: 'Blacklisted Address',
                    riskScore: 1.0,
                    tags: ['Scam', 'Malicious'],
                    txs: transactions.filter(tx => tx.from === blacklistedAddress || tx.to === blacklistedAddress)
                },
                [suspiciousAddress]: {
                    label: 'Suspicious Address',
                    riskScore: 0.9,
                    tags: ['Suspected Phishing'],
                    txs: transactions.filter(tx => tx.from === suspiciousAddress || tx.to === suspiciousAddress)
                },
                [knownExchange]: {
                    label: 'Known Exchange',
                    riskScore: 0.1,
                    tags: ['Exchange'],
                    txs: transactions.filter(tx => tx.from === knownExchange || tx.to === knownExchange)
                }
            },
            transactions: transactions,
            suspicious: [
                { address: rootAddress, reason: 'Transferred funds to a blacklisted wallet.', timestamp: '2025-07-27T10:00:00Z' },
                { address: suspiciousAddress, reason: 'Received a large transfer and immediately sent to a new wallet.', timestamp: '2025-07-25T11:00:00Z' },
            ],
        };
    }

    generateMockAlerts() {
        return [
            { id: 1, severity: 'critical', title: 'Transaction to Blacklisted Address', address: '0x1A2B3C4...', timestamp: '2025-07-27T10:00:00Z', status: 'new' },
            { id: 2, severity: 'high', title: 'Unusually Large Outgoing Transaction', address: '0xCAFEF00...', timestamp: '2025-07-25T11:00:00Z', status: 'new' },
            { id: 3, severity: 'medium', title: 'Multiple Small Incoming Transactions', address: '0x1A2B3C4...', timestamp: '2025-07-26T08:00:00Z', status: 'in-progress' },
            { id: 4, severity: 'low', title: 'First interaction with new address', address: '0xCAFEF00...', timestamp: '2025-07-25T10:05:00Z', status: 'resolved' },
        ];
    }

    // --- Watchlist Management (uses localStorage) ---
    loadWatchlist() {
        const stored = localStorage.getItem('cryptHunterWatchlist');
        return stored ? JSON.parse(stored) : [
            { address: '0x3D94628E1010A614d3f3f2E8dF6A672e043BfC92', riskScore: 0.95, tags: ['Phishing'] },
            { address: '0x88f572a1a011030e2f5b40337c7c0b2f53d10034', riskScore: 0.82, tags: ['Scam'] }
        ];
    }

    saveWatchlist() {
        localStorage.setItem('cryptHunterWatchlist', JSON.stringify(this.watchlist));
    }

    addWatchlistAddress() {
        const address = this.watchlistAddInput.value.trim();
        if (address && !this.watchlist.some(item => item.address === address)) {
            const mockRisk = (Math.random() * 0.5 + 0.5).toFixed(2); // Random risk score 0.5-1.0
            this.watchlist.push({ address, riskScore: parseFloat(mockRisk), tags: ['Manually Added'] });
            this.saveWatchlist();
            this.renderWatchlist();
            this.updateTabCounts();
            this.showNotification(`Address "${address}" added to watchlist.`, 'success');
            this.watchlistAddInput.value = '';
        } else {
            this.showNotification('Please enter a valid, non-duplicate address.', 'warning');
        }
    }

    removeWatchlistAddress(address) {
        this.watchlist = this.watchlist.filter(item => item.address !== address);
        this.saveWatchlist();
        this.renderWatchlist();
        this.updateTabCounts();
        this.showNotification(`Address removed from watchlist.`, 'info');
    }

    // --- Rendering Functions ---
    renderAll() {
        this.renderDashboard();
        this.renderAlerts();
        this.renderWatchlist();
        this.renderRuleEngine();
        this.renderReports();
        this.renderSettings();
        this.updateTabCounts();
    }

    updateTabCounts() {
        if (this.tabAlertsCount) this.tabAlertsCount.textContent = this.alerts.length;
        if (this.tabWatchlistCount) this.tabWatchlistCount.textContent = this.watchlist.length;
        if (this.dashboardMetrics.totalAlerts) this.dashboardMetrics.totalAlerts.textContent = this.alerts.length;
        if (this.dashboardMetrics.watchlistCount) this.dashboardMetrics.watchlistCount.textContent = this.watchlist.length;
        if (this.dashboardMetrics.suspiciousTransactions) this.dashboardMetrics.suspiciousTransactions.textContent = this.mockData.suspicious.length;
        if (this.dashboardMetrics.rulesCount) this.dashboardMetrics.rulesCount.textContent = this.rules.length;
    }

    renderDashboard() {
        if (!this.suspiciousActivityList) return;
        this.suspiciousActivityList.innerHTML = '';
        if (this.mockData.suspicious.length === 0) {
            this.suspiciousActivityList.innerHTML = '<div class="empty-state-message">No suspicious activity found.</div>';
            return;
        }

        this.mockData.suspicious.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'suspicious-activity-item';
            item.innerHTML = `
                <div class="activity-meta">
                    <span><strong>Address:</strong> ${activity.address.substring(0, 10)}...</span>
                    <span><strong>Time:</strong> ${this.formatDate(activity.timestamp)}</span>
                </div>
                <div class="activity-reason">
                    <strong>Reason:</strong> ${activity.reason}
                </div>
            `;
            this.suspiciousActivityList.appendChild(item);
        });
    }

    renderAlerts() {
        const container = this.alertsListContainer;
        if (!container) return;
        container.innerHTML = '';
        if (this.alerts.length === 0) {
            container.innerHTML = '<div class="empty-state-message">No alerts to display.</div>';
            return;
        }

        this.alerts.forEach(alert => {
            const card = document.createElement('div');
            card.className = `alert-card ${alert.severity}`;
            card.innerHTML = `
                <div class="alert-header">
                    <h4 class="alert-title">${alert.title}</h4>
                    <span class="alert-severity ${alert.severity}">${alert.severity}</span>
                </div>
                <div class="alert-details">
                    <p><strong>Address:</strong> ${alert.address}</p>
                    <p><strong>Timestamp:</strong> ${this.formatDate(alert.timestamp)}</p>
                    <p><strong>Status:</strong> ${alert.status}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }

    searchAddress() {
        const address = this.addressInput.value.trim();
        if (!address) {
            this.showNotification('Please enter a crypto address.', 'warning');
            return;
        }

        const addressData = this.mockData.addresses[address];
        this.activeAddressData = addressData;

        if (addressData) {
            this.addressResultsContainer.innerHTML = `
                <div class="address-summary-card">
                    <h3>Address Details</h3>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Risk Score:</strong> <span class="risk-score" style="color: ${this.getRiskColor(addressData.riskScore)}">${(addressData.riskScore * 100).toFixed(0)}%</span></p>
                    <p><strong>Tags:</strong> ${addressData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</p>
                </div>
                <h3>Transaction Graph</h3>
                <div id="crypto-graph-container"></div>
            `;
            this.renderVisualization(address);
            this.showNotification(`Found data for address: ${address}`, 'success');
        } else {
            this.addressResultsContainer.innerHTML = `<div class="empty-state-message">No data found for this address.</div>`;
            this.showNotification('No data found for the provided address.', 'error');
        }
    }

    renderVisualization(address) {
        if (this.cytoscapeInstance) {
            this.cytoscapeInstance.destroy();
        }

        const container = document.getElementById('crypto-graph-container');
        if (!container) return;

        const addressData = this.mockData.addresses[address];
        if (!addressData) return;

        const elements = [];
        const uniqueAddresses = new Set();
        uniqueAddresses.add(address);
        addressData.txs.forEach(tx => {
            uniqueAddresses.add(tx.from);
            uniqueAddresses.add(tx.to);
        });

        // Add nodes
        uniqueAddresses.forEach(addr => {
            const nodeData = this.mockData.addresses[addr] || { label: addr.substring(0, 10) + '...', riskScore: 0.1, tags: ['External'] };
            elements.push({
                group: 'nodes',
                data: {
                    id: addr,
                    label: nodeData.label || addr.substring(0, 10) + '...',
                    risk: nodeData.riskScore,
                    isRoot: addr === address
                },
                classes: addr === address ? 'root-node' : (nodeData.riskScore > 0.7 ? 'high-risk' : '')
            });
        });

        // Add edges
        addressData.txs.forEach(tx => {
            elements.push({
                group: 'edges',
                data: {
                    id: `edge_${tx.id}`,
                    source: tx.from,
                    target: tx.to,
                    label: `${tx.value} ETH`,
                    risk: tx.riskScore
                },
                classes: tx.riskScore > 0.7 ? 'high-risk' : ''
            });
        });

        this.cytoscapeInstance = cytoscape({
            container: container,
            elements: elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': (ele) => ele.data('isRoot') ? '#ff4757' : (ele.data('risk') > 0.7 ? '#f59e0b' : '#007bff'),
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'color': 'white',
                        'width': '60px',
                        'height': '60px',
                        'font-size': '12px',
                        'text-outline-width': 2,
                        'text-outline-color': '#0d0d14'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': (ele) => ele.data('risk') > 0.7 ? '#f59e0b' : '#007bff',
                        'target-arrow-color': (ele) => ele.data('risk') > 0.7 ? '#f59e0b' : '#007bff',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'color': 'white',
                        'font-size': '10px',
                        'text-background-opacity': 1,
                        'text-background-color': '#1a1a2e',
                        'text-background-padding': '3px',
                    }
                }
            ],
            layout: {
                name: 'cose',
                animate: true,
                padding: 100
            }
        });
    }

    getRiskColor(score) {
        if (score >= 0.9) return '#dc2626';
        if (score >= 0.7) return '#f59e0b';
        return '#28a745';
    }

    // --- Other Sub-Tab Renderers (Mock) ---
    renderRuleEngine() {
        this.rules = [
            { id: 1, name: 'Transaction to Blacklisted Address', status: 'Active', severity: 'Critical' },
            { id: 2, name: 'High Value Outgoing Transfer (> $100k)', status: 'Active', severity: 'High' },
            { id: 3, name: 'Known Mixing Service Interaction', status: 'Inactive', severity: 'Critical' }
        ];
        if (!this.ruleEngineList) return;
        this.ruleEngineList.innerHTML = '';
        const emptyMessage = document.querySelector('#cryphunter-rule-engine-tab .empty-state-message');
        
        if (this.rules.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }
        if (emptyMessage) emptyMessage.style.display = 'none';

        this.rules.forEach(rule => {
            const card = document.createElement('div');
            card.className = 'rule-card';
            card.innerHTML = `
                <span>${rule.name}</span>
                <div class="rule-actions">
                    <span class="tag">${rule.status}</span>
                    <button class="btn-secondary btn-sm">Edit</button>
                </div>
            `;
            this.ruleEngineList.appendChild(card);
        });
    }

    loadRules() {
        return [
            { id: 1, name: 'Transaction to Blacklisted Address', status: 'Active', severity: 'Critical' },
            { id: 2, name: 'High Value Outgoing Transfer (> $100k)', status: 'Active', severity: 'High' }
        ];
    }

    renderWatchlist() {
        if (!this.watchlistTableBody) return;
        this.watchlistTableBody.innerHTML = '';
        const emptyMessage = document.querySelector('#cryphunter-watchlist-tab .empty-state-message');
        
        if (this.watchlist.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }
        if (emptyMessage) emptyMessage.style.display = 'none';

        this.watchlist.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.address.substring(0, 20)}...</td>
                <td><span class="risk-score" style="color: ${this.getRiskColor(item.riskScore)}">${(item.riskScore * 100).toFixed(0)}%</span></td>
                <td>${item.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')}</td>
                <td>
                    <button class="btn-secondary btn-sm remove-btn" data-address="${item.address}">Remove</button>
                    <button class="btn-primary btn-sm investigate-btn" data-address="${item.address}">Investigate</button>
                </td>
            `;
            this.watchlistTableBody.appendChild(row);
        });
        this.updateTabCounts();
    }

    renderReports() {
        const mockReports = [
            { id: 1, name: 'Report for 0x1A2...', date: '2025-07-28' },
            { id: 2, name: 'Report for Alert #1', date: '2025-07-27' }
        ];
        if (!this.reportsList) return;
        this.reportsList.innerHTML = '';
        const emptyMessage = document.querySelector('#cryphunter-reports-tab .empty-state-message');
        
        if (mockReports.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }
        if (emptyMessage) emptyMessage.style.display = 'none';

        mockReports.forEach(report => {
            const item = document.createElement('div');
            item.className = 'report-list-item';
            item.innerHTML = `
                <span>${report.name}</span>
                <span>${report.date}</span>
            `;
            this.reportsList.appendChild(item);
        });
    }
    
    generateReport() {
        this.showNotification('Mock PDF report generated for download.', 'info');
    }

    exportReportData() {
        const mockData = {
            reportName: 'Mock Report Data',
            timestamp: new Date().toISOString(),
            content: this.mockData
        };
        const dataStr = JSON.stringify(mockData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'cryptohunter-report.json');
        linkElement.click();
        this.showNotification('Mock JSON data exported.', 'success');
    }

    renderSettings() {
        if (!this.settingsForm) return;
        const inputs = this.settingsForm.querySelectorAll('input[type="text"]');
        inputs.forEach(input => input.value = '');
    }

    // Helper Functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`[Notification - ${type}]: ${message}`);
        }
    }
}