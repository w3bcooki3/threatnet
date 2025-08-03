// CryptHunter functionality
const cryptohunter = {
    // Current active sub-tab for CryptHunter
    currentTab: 'cryptohunter-dashboard',
    cy: null, // Holds the Cytoscape instance for graph visualization

    // --- Data Model ---
    data: {
        alerts: [
            {
                id: 'AL-001',
                type: 'High Velocity',
                wallet: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
                risk: 'high',
                timestamp: '2025-08-03T14:30:00Z',
                status: 'new',
                source: 'On-chain monitoring',
                description: 'A newly created wallet is involved in over 50 transactions in a 30-minute window.',
                chain: 'Ethereum',
                details: { 'tx_count_30min': 52, 'total_value_usd': 85000, }
            },
            {
                id: 'AL-002',
                type: 'Mixer Detected',
                wallet: '0xefgh567890123456789012345678901234567890',
                risk: 'critical',
                timestamp: '2025-08-03T13:15:00Z',
                status: 'new',
                source: 'Behavioral analysis',
                description: 'Wallet shows classic coin mixing behavior, receiving small, fragmented amounts from multiple sources and consolidating them to a privacy-enhancing service.',
                chain: 'Bitcoin',
                details: { 'mixer_service': 'ChipMixer', 'hops': 15, }
            },
            {
                id: 'AL-003',
                type: 'Blacklisted Wallet',
                wallet: '0xijkl901234567890123456789012345678901234',
                risk: 'critical',
                timestamp: '2025-08-02T10:00:00Z',
                status: 'in-progress',
                source: 'Threat intelligence feed',
                description: 'This wallet has been identified on a list of wallets associated with the notorious cybercriminal group "Op. Phoenix".',
                chain: 'Binance Smart Chain',
                details: { 'threat_group': 'Op. Phoenix', 'intel_source': 'TRM Labs' }
            },
            {
                id: 'AL-004',
                type: 'Cross-Chain Anomaly',
                wallet: '0xmno34567890123456789012345678901234567',
                risk: 'medium',
                timestamp: '2025-08-01T18:45:00Z',
                status: 'resolved',
                source: 'On-chain monitoring',
                description: 'Funds were bridged from Ethereum to Solana through a non-standard bridge, suggesting an attempt to obscure the trail.',
                chain: 'Ethereum & Solana',
                details: { 'bridge_used': 'unknown-bridge.io' }
            },
        ],
        watchlist: [
            { id: 'WL-001', address: '0xabcdef0123456789012345678901234567890123', tags: ['Suspect A', 'Op. Phoenix'], notes: 'Initial investigation from Op. Phoenix alert.', added: '2025-07-28', status: 'active', transactions: [
                 { id: 'wltx-1', type: 'in', from: '0x123...', to: '0xabc...', amount: '2.5 ETH', label: 'funds received', timestamp: new Date(Date.now() - 86400000) },
                 { id: 'wltx-2', type: 'out', from: '0xabc...', to: '0x456...', amount: '1.0 ETH', label: 'sent to exchange', timestamp: new Date(Date.now() - 172800000) }
            ]},
            { id: 'WL-002', address: '0x13579bdf13579bdf13579bdf13579bdf13579bdf', tags: ['Darknet Vendor'], notes: 'Wallet associated with a darknet market vendor.', added: '2025-07-25', status: 'active', transactions: [] },
        ],
        rules: [
            { id: 'RULE-001', name: 'High-Value Transfer', description: 'Triggers on any transaction with a value over $50,000.', enabled: true, risk: 'high', conditions: [{field: 'value_usd', operator: '>', value: 50000}]},
            { id: 'RULE-002', name: 'Mixer Interaction', description: 'Triggers when a wallet interacts with a known mixer service.', enabled: true, risk: 'critical', conditions: [{field: 'destination_tag', operator: 'contains', value: 'mixer'}]},
            { id: 'RULE-003', name: 'Rapid Transactions', description: 'Detects over 10 transactions in less than 5 minutes from a single wallet.', enabled: false, risk: 'medium', conditions: [{field: 'tx_count_5min', operator: '>', value: 10}]},
        ],
        apiKeys: JSON.parse(localStorage.getItem('cryptohunter_api_keys')) || [],
        scamDatabases: JSON.parse(localStorage.getItem('cryptohunter_scam_dbs')) || [
            { id: 'SCAM-001', name: 'BitcoinAbuse', apiUrl: 'https://www.bitcoinabuse.com/api/reports/', enabled: true },
        ],
        notifications: JSON.parse(localStorage.getItem('cryptohunter_notifications')) || {
            email: { enabled: true, address: '' },
            sms: { enabled: false, number: '' },
            webhook: { enabled: false, url: '' }
        },
    },
    
    // --- Mock API Service ---
    apiService: {
        apiKey: localStorage.getItem('cryptohunter_api_key') || '',
        validateKey: function(key) {
            const configuredKey = cryptohunter.data.apiKeys.find(k => k.value === key);
            return !!configuredKey && configuredKey.enabled;
        },
        checkWalletReputation: function(address) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const enabledDbs = cryptohunter.data.scamDatabases.filter(db => db.enabled);
                    let isFlagged = false;
                    for (const db of enabledDbs) {
                        // Simulate a check against a specific address
                        if (address.startsWith('0xdeadbeef')) {
                            isFlagged = true;
                            break;
                        }
                    }
                    resolve(isFlagged);
                }, 500);
            });
        },
        fetchWalletData: function(address) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const mockApiKey = this.apiKey;
                    const configuredKey = cryptohunter.data.apiKeys.find(k => k.value === mockApiKey && k.platform === 'mock-api');
                    if (!configuredKey || !configuredKey.enabled) {
                        reject('No valid Mock API key configured. Please add one in Settings.');
                        return;
                    }
                    const mockAddressData = {
                        '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b': { balance: '12.45 ETH', txCount: 87, riskScore: 78, status: 'suspicious', firstSeen: '2025-06-15',
                            transactions: [
                                { id: 'tx-1', type: 'in', from: '0xdef4567890123456789012345678901234567890', to: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', amount: '5.2 ETH', label: 'funds received', timestamp: new Date(Date.now() - 3600000) },
                                { id: 'tx-2', type: 'out', from: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', to: '0xabc1234567890123456789012345678901234567', amount: '2.1 ETH', label: 'sent to exchange', timestamp: new Date(Date.now() - 7200000) },
                                { id: 'tx-3', type: 'in', from: '0xghi9876543210987654321098765432109876543', to: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', amount: '10.0 ETH', label: 'received from mixer', timestamp: new Date(Date.now() - 10800000) },
                                { id: 'tx-4', type: 'out', from: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', to: '0xxyz1234567890123456789012345678901234567', amount: '0.5 ETH', label: 'sent to darknet wallet', timestamp: new Date(Date.now() - 14400000) },
                            ]
                        },
                        '0xdef4567890123456789012345678901234567890': { balance: '1.2 ETH', txCount: 12, riskScore: 20, status: 'clean', transactions: [] },
                        '0xabc1234567890123456789012345678901234567': { balance: '50.1 BTC', txCount: 5000, riskScore: 10, status: 'exchange', transactions: [] },
                        '0xdeadbeef12345678901234567890123456789012': { balance: '0.01 ETH', txCount: 2, riskScore: 99, status: 'scam', transactions: [] }
                    };
                    const data = mockAddressData[address];
                    if (data) { resolve(data); } else { reject('Address not found in mock data.'); }
                }, 1500);
            });
        }
    },

    // --- Tab Rendering Functions ---
    init: function() { this.renderDashboard(); },
    renderDashboard: function() {
        const totalAlerts = this.data.alerts.length;
        const highRiskWallets = this.data.alerts.filter(a => a.risk === 'critical' || a.risk === 'high').length;
        const watchlistCount = this.data.watchlist.length;
        document.getElementById('totalAlerts').textContent = totalAlerts;
        document.getElementById('highRiskWallets').textContent = highRiskWallets;
        document.getElementById('watchlistCount').textContent = watchlistCount;
        this.renderRecentAlerts();
        this.renderActivityChart();
        this.generateGraph();
    },
    renderRecentAlerts: function() {
        const recentAlertsContainer = document.getElementById('recentAlertsFeed');
        if (!recentAlertsContainer) return;
        const recentAlerts = this.data.alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        if (recentAlerts.length === 0) {
            recentAlertsContainer.innerHTML = '<p class="text-secondary">No recent alerts to display.</p>';
            return;
        }
        recentAlertsContainer.innerHTML = recentAlerts.map(alert => `
            <div class="alert-feed-item alert-status-${alert.status}">
                <div class="alert-icon"><i class="fas fa-${this.getAlertIcon(alert.type)}"></i></div>
                <div class="alert-details">
                    <span class="alert-type">${alert.type}</span>
                    <span class="alert-wallet">${alert.wallet.substring(0, 20)}...</span>
                    <span class="alert-risk risk-${alert.risk}">${alert.risk.toUpperCase()}</span>
                </div>
                <span class="alert-time">${getRelativeTime(alert.timestamp)}</span>
            </div>
        `).join('');
    },
    renderAlertsTab: function() {
        const alertsContainer = document.getElementById('alertsListContainer');
        if (!alertsContainer) return;
        if (this.data.alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-bell-slash"></i><h3>No Alerts</h3><p>No suspicious activities have been detected yet.</p></div>';
            return;
        }
        alertsContainer.innerHTML = this.data.alerts.map(alert => `
            <div class="alert-list-item alert-status-${alert.status}" onclick="window.cryptohunter.viewAlertDetails('${alert.id}')">
                <div class="alert-header">
                    <div class="alert-info-primary">
                        <div class="alert-icon"><i class="fas fa-${this.getAlertIcon(alert.type)}"></i></div>
                        <div class="alert-meta">
                            <span class="alert-title">${alert.type} - ${alert.wallet.substring(0, 20)}...</span>
                            <span class="alert-timestamp">${new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="alert-header-actions">
                        <span class="alert-risk-badge risk-${alert.risk}">${alert.risk.toUpperCase()}</span>
                        <span class="alert-status-badge status-${alert.status}">${alert.status.toUpperCase()}</span>
                        <button class="action-btn" title="View Details"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
                <div class="alert-body"><p>${alert.description}</p><div class="alert-tags"><span class="alert-tag">${alert.chain}</span><span class="alert-tag">${alert.source}</span></div></div>
            </div>
        `).join('');
    },
    renderSettingsTab: function() {
        this.renderApiKeysList();
        this.renderScamDatabasesList();
        const notifications = this.data.notifications;
        document.getElementById('emailNotifications').checked = notifications.email.enabled;
        document.getElementById('emailAddress').value = notifications.email.address;
        document.getElementById('emailAddress').disabled = !notifications.email.enabled;
        document.getElementById('smsNotifications').checked = notifications.sms.enabled;
        document.getElementById('smsNumber').value = notifications.sms.number;
        document.getElementById('smsNumber').disabled = !notifications.sms.enabled;
        document.getElementById('webhookNotifications').checked = notifications.webhook.enabled;
        document.getElementById('webhookUrl').value = notifications.webhook.url;
        document.getElementById('webhookUrl').disabled = !notifications.webhook.enabled;
    },
    updateApiKeyStatus: function() {
        const statusBadge = document.getElementById('apiKeyStatus');
        if (!statusBadge) return;
        const isValid = this.apiService.validateKey(this.apiService.apiKey);
        if (isValid) {
            statusBadge.textContent = 'API Key Status: Configured';
            statusBadge.classList.remove('api-status-red');
            statusBadge.classList.add('api-status-green');
        } else {
            statusBadge.textContent = 'API Key Status: Not Configured';
            statusBadge.classList.remove('api-status-green');
            statusBadge.classList.add('api-status-red');
        }
    },
    renderApiKeysList: function() {
        const container = document.getElementById('apiKeysList');
        if (!container) return;
        if (this.data.apiKeys.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-key"></i><h3>No API Keys Configured</h3><p>Add API keys for blockchain explorers and threat intelligence services to enable real-time data retrieval.</p></div>`;
            return;
        }
        container.innerHTML = this.data.apiKeys.map(key => `
            <div class="api-key-item status-${key.enabled ? 'active' : 'inactive'}">
                <div class="api-key-info">
                    <span class="api-platform">${this.getPlatformIcon(key.platform)} ${key.platform.toUpperCase()}</span>
                    <span class="api-key-value">${key.value.substring(0, 4)}...${key.value.slice(-4)}</span>
                </div>
                <div class="api-key-actions">
                    <button class="status-toggle-btn" onclick="window.cryptohunter.toggleApiKey('${key.id}')">
                        <i class="fas fa-${key.enabled ? 'check-circle' : 'times-circle'}"></i>
                    </button>
                    <button class="action-btn danger-btn" onclick="window.cryptohunter.deleteApiKey('${key.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    getPlatformIcon: function(platform) {
        switch(platform) {
            case 'etherscan': return '<i class="fas fa-file-contract"></i>';
            case 'solscan': return '<i class="fas fa-solar-panel"></i>';
            case 'trmlabs': return '<i class="fas fa-fingerprint"></i>';
            case 'chainalysis': return '<i class="fas fa-link"></i>';
            default: return '<i class="fas fa-code"></i>';
        }
    },
    showApiModal: function(key = null) {
        const modal = document.getElementById('apiModal');
        const title = document.getElementById('apiModalTitle');
        const form = document.getElementById('apiForm');
        form.reset();
        document.getElementById('apiKeyId').value = '';
        if (key) {
            title.textContent = `Edit API Key for ${key.platform.toUpperCase()}`;
            document.getElementById('apiKeyId').value = key.id;
            document.getElementById('apiPlatform').value = key.platform;
            document.getElementById('apiKeyValue').value = key.value;
        } else {
            title.textContent = 'Add New API Key';
        }
        modal.style.display = 'flex';
    },
    closeApiModal: function() { document.getElementById('apiModal').style.display = 'none'; },
    saveApiKey: function(event) {
        event.preventDefault();
        const form = event.target;
        const keyId = form.elements.apiKeyId.value;
        const newKey = {
            id: keyId || 'API-' + Date.now(),
            platform: form.elements.apiPlatform.value,
            value: form.elements.apiKeyValue.value,
            enabled: true,
        };
        const existingKeyIndex = this.data.apiKeys.findIndex(k => k.id === keyId);
        if (existingKeyIndex > -1) {
            this.data.apiKeys[existingKeyIndex] = newKey;
            showNotification('API Key updated successfully!', 'success');
        } else {
            this.data.apiKeys.push(newKey);
            showNotification('New API Key added successfully!', 'success');
        }
        localStorage.setItem('cryptohunter_api_keys', JSON.stringify(this.data.apiKeys));
        this.renderApiKeysList();
        this.closeApiModal();
    },
    toggleApiKey: function(id) {
        const key = this.data.apiKeys.find(k => k.id === id);
        if (key) {
            key.enabled = !key.enabled;
            localStorage.setItem('cryptohunter_api_keys', JSON.stringify(this.data.apiKeys));
            this.renderApiKeysList();
            showNotification(`API Key for ${key.platform.toUpperCase()} has been ${key.enabled ? 'enabled' : 'disabled'}.`, 'info');
        }
    },
    deleteApiKey: function(id) {
        if (confirm('Are you sure you want to delete this API key?')) {
            this.data.apiKeys = this.data.apiKeys.filter(k => k.id !== id);
            localStorage.setItem('cryptohunter_api_keys', JSON.stringify(this.data.apiKeys));
            this.renderApiKeysList();
            showNotification('API Key deleted successfully.', 'success');
        }
    },

    // --- Scam Database Functions ---
    renderScamDatabasesList: function() {
        const container = document.getElementById('scamDbList');
        if (!container) return;
        if (this.data.scamDatabases.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-database"></i><h3>No Databases Configured</h3><p>Add URLs and API keys for known scam databases to cross-reference addresses.</p></div>`;
            return;
        }
        container.innerHTML = this.data.scamDatabases.map(db => `
            <div class="api-key-item status-${db.enabled ? 'active' : 'inactive'}">
                <div class="api-key-info">
                    <span class="api-platform"><i class="fas fa-shield-alt"></i> ${db.name}</span>
                    <span class="api-key-value">${db.apiUrl.split('//')[1].split('/')[0]}</span>
                </div>
                <div class="api-key-actions">
                    <button class="status-toggle-btn" onclick="window.cryptohunter.toggleScamDbEnabled('${db.id}')">
                        <i class="fas fa-${db.enabled ? 'check-circle' : 'times-circle'}"></i>
                    </button>
                    <button class="action-btn" onclick="window.cryptohunter.editScamDatabase('${db.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger-btn" onclick="window.cryptohunter.deleteScamDatabase('${db.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    showScamDbModal: function(db = null) {
        const modal = document.getElementById('scamDbModal');
        const title = document.getElementById('scamDbModalTitle');
        const form = document.getElementById('scamDbForm');
        form.reset();
        document.getElementById('scamDbId').value = '';
        if (db) {
            title.textContent = `Edit Database: ${db.name}`;
            document.getElementById('scamDbId').value = db.id;
            document.getElementById('scamDbName').value = db.name;
            document.getElementById('scamDbUrl').value = db.apiUrl;
            document.getElementById('scamDbApiKey').value = db.apiKey || '';
        } else {
            title.textContent = 'Add Known Scam Database';
        }
        modal.style.display = 'flex';
    },
    closeScamDbModal: function() { document.getElementById('scamDbModal').style.display = 'none'; },
    saveScamDatabase: function(event) {
        event.preventDefault();
        const form = event.target;
        const dbId = form.elements.scamDbId.value;
        const newDb = {
            id: dbId || 'DB-' + Date.now(),
            name: form.elements.scamDbName.value,
            apiUrl: form.elements.scamDbUrl.value,
            apiKey: form.elements.scamDbApiKey.value,
            enabled: true,
        };
        const existingDbIndex = this.data.scamDatabases.findIndex(d => d.id === dbId);
        if (existingDbIndex > -1) {
            this.data.scamDatabases[existingDbIndex] = newDb;
            showNotification('Scam database updated successfully!', 'success');
        } else {
            this.data.scamDatabases.push(newDb);
            showNotification('Scam database added successfully!', 'success');
        }
        localStorage.setItem('cryptohunter_scam_dbs', JSON.stringify(this.data.scamDatabases));
        this.renderScamDatabasesList();
        this.closeScamDbModal();
    },
    editScamDatabase: function(id) {
        const db = this.data.scamDatabases.find(d => d.id === id);
        if (db) { this.showScamDbModal(db); }
    },
    deleteScamDatabase: function(id) {
        if (confirm('Are you sure you want to delete this scam database?')) {
            this.data.scamDatabases = this.data.scamDatabases.filter(d => d.id !== id);
            localStorage.setItem('cryptohunter_scam_dbs', JSON.stringify(this.data.scamDatabases));
            this.renderScamDatabasesList();
            showNotification('Scam database deleted successfully.', 'success');
        }
    },
    toggleScamDbEnabled: function(id) {
        const db = this.data.scamDatabases.find(d => d.id === id);
        if (db) {
            db.enabled = !db.enabled;
            localStorage.setItem('cryptohunter_scam_dbs', JSON.stringify(this.data.scamDatabases));
            this.renderScamDatabasesList();
            showNotification(`Scam database "${db.name}" has been ${db.enabled ? 'enabled' : 'disabled'}.`, 'info');
        }
    },
    saveNotificationSettings: function() {
        const notifications = {
            email: {
                enabled: document.getElementById('emailNotifications').checked,
                address: document.getElementById('emailAddress').value
            },
            sms: {
                enabled: document.getElementById('smsNotifications').checked,
                number: document.getElementById('smsNumber').value
            },
            webhook: {
                enabled: document.getElementById('webhookNotifications').checked,
                url: document.getElementById('webhookUrl').value
            }
        };
        this.data.notifications = notifications;
        localStorage.setItem('cryptohunter_notifications', JSON.stringify(notifications));
        showNotification('Notification settings saved successfully!', 'success');
    },
    toggleNotification: function(channel) {
        const input = document.getElementById(`${channel}Notifications`);
        const target = document.getElementById(`${channel}Address`) || document.getElementById(`${channel}Number`) || document.getElementById(`${channel}Url`);
        if (target) {
            target.disabled = !input.checked;
        }
    },
    
    // --- Rule Engine Functions ---
    renderRuleEngineTab: function() {
        const rulesContainer = document.getElementById('ruleListContainer');
        if (!rulesContainer) return;
        if (this.data.rules.length === 0) {
            rulesContainer.innerHTML = `<div class="empty-state"><i class="fas fa-cogs"></i><h3>No Rules Defined</h3><p>Start by creating a new rule to monitor blockchain activity.</p></div>`;
            return;
        }
        rulesContainer.innerHTML = this.data.rules.map(rule => `
            <div class="rule-item rule-status-${rule.enabled ? 'active' : 'inactive'}">
                <div class="rule-header">
                    <div class="rule-info-primary">
                        <div class="status-toggle-container">
                            <button class="status-toggle-btn" onclick="window.cryptohunter.toggleRuleEnabled('${rule.id}')">
                                <span class="status-icon"><i class="fas fa-${rule.enabled ? 'check-circle' : 'times-circle'}"></i></span>
                            </button>
                        </div>
                        <span class="rule-name">${rule.name}</span>
                        <span class="rule-risk risk-${rule.risk}">${rule.risk.toUpperCase()}</span>
                    </div>
                    <div class="rule-header-actions">
                        <button class="action-btn" onclick="window.cryptohunter.editRule('${rule.id}')" title="Edit Rule"><i class="fas fa-edit"></i></button>
                        <button class="action-btn danger-btn" onclick="window.cryptohunter.deleteRule('${rule.id}')" title="Delete Rule"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="rule-body">
                    <p>${rule.description}</p>
                    <div class="rule-conditions">
                        <strong>Conditions:</strong>
                        <ul>${rule.conditions.map(cond => `<li><span class="condition-field">${this.getConditionFieldLabel(cond.field)}</span><span class="condition-operator">${this.getConditionOperatorLabel(cond.operator)}</span><span class="condition-value">${cond.value}</span></li>`).join('')}</ul>
                    </div>
                </div>
            </div>
        `).join('');
    },
    showRuleModal: function(rule = null) {
        const modal = document.getElementById('ruleModal');
        const title = document.getElementById('ruleModalTitle');
        const form = document.getElementById('ruleForm');
        form.reset();
        document.getElementById('ruleConditions').innerHTML = '';
        if (rule) {
            title.textContent = `Edit Rule: ${rule.name}`;
            document.getElementById('ruleId').value = rule.id;
            document.getElementById('ruleName').value = rule.name;
            document.getElementById('ruleDescription').value = rule.description;
            document.getElementById('ruleRisk').value = rule.risk;
            rule.conditions.forEach(cond => this.addRuleCondition(cond));
        } else {
            title.textContent = 'Create New Rule';
            document.getElementById('ruleId').value = '';
            this.addRuleCondition();
        }
        modal.style.display = 'flex';
    },
    closeRuleModal: function() { document.getElementById('ruleModal').style.display = 'none'; },
    addRuleCondition: function(condition = null) {
        const container = document.getElementById('ruleConditions');
        const newCondition = document.createElement('div');
        newCondition.className = 'rule-condition-row';
        newCondition.innerHTML = `
            <select class="condition-field">
                <option value="value_usd">Transaction Value (USD)</option>
                <option value="tx_count_5min">Tx Count in 5 min</option>
                <option value="destination_tag">Destination Tag</option>
                <option value="source_in">Source Address In</option>
                <option value="destination_in">Destination Address In</option>
            </select>
            <select class="condition-operator">
                <option value=">">is greater than</option>
                <option value="<">is less than</option>
                <option value="==">is exactly</option>
                <option value="contains">contains</option>
            </select>
            <input type="text" class="condition-value" placeholder="Value">
            <button type="button" class="btn-danger btn-small" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;
        if (condition) {
            newCondition.querySelector('.condition-field').value = condition.field;
            newCondition.querySelector('.condition-operator').value = condition.operator;
            newCondition.querySelector('.condition-value').value = condition.value;
        }
        container.appendChild(newCondition);
    },
    saveRule: function(event) {
        event.preventDefault();
        const form = event.target;
        const ruleId = form.elements.ruleId.value;
        const conditions = Array.from(form.querySelectorAll('.rule-condition-row')).map(row => ({
            field: row.querySelector('.condition-field').value,
            operator: row.querySelector('.condition-operator').value,
            value: row.querySelector('.condition-value').value
        }));
        const newRule = {
            id: ruleId || 'RULE-' + Date.now(),
            name: form.elements.ruleName.value,
            description: form.elements.ruleDescription.value,
            enabled: true, // New rules are enabled by default
            risk: form.elements.ruleRisk.value,
            conditions: conditions
        };
        const existingRuleIndex = this.data.rules.findIndex(r => r.id === ruleId);
        if (existingRuleIndex > -1) {
            this.data.rules[existingRuleIndex] = newRule;
            showNotification('Rule updated successfully!', 'success');
        } else {
            this.data.rules.push(newRule);
            showNotification('New rule created successfully!', 'success');
        }
        this.renderRuleEngineTab();
        this.closeRuleModal();
    },
    editRule: function(id) {
        const rule = this.data.rules.find(r => r.id === id);
        if (rule) { this.showRuleModal(rule); }
    },
    deleteRule: function(id) {
        if (confirm('Are you sure you want to delete this rule?')) {
            this.data.rules = this.data.rules.filter(r => r.id !== id);
            this.renderRuleEngineTab();
            showNotification('Rule deleted successfully.', 'success');
        }
    },
    toggleRuleEnabled: function(id) {
        const rule = this.data.rules.find(r => r.id === id);
        if (rule) {
            rule.enabled = !rule.enabled;
            this.renderRuleEngineTab();
            showNotification(`Rule "${rule.name}" has been ${rule.enabled ? 'enabled' : 'disabled'}.`, 'info');
        }
    },
    // Helper function to get readable labels for rule conditions
    getConditionFieldLabel: function(field) {
        switch(field) {
            case 'value_usd': return 'Transaction Value (USD)';
            case 'tx_count_5min': return 'Tx Count in 5 min';
            case 'destination_tag': return 'Destination Tag';
            case 'source_in': return 'Source Address In';
            case 'destination_in': return 'Destination Address In';
            default: return field;
        }
    },
    getConditionOperatorLabel: function(op) {
        switch(op) {
            case '>': return 'is greater than';
            case '<': return 'is less than';
            case '==': return 'is exactly';
            case 'contains': return 'contains';
            default: return op;
        }
    },

    // --- Watchlist Functions ---
    renderWatchlistTab: function() {
        const watchlistContainer = document.getElementById('watchlistContainer');
        const detailViewContainer = document.getElementById('watchlistDetailView');
        const listContainer = document.querySelector('.watchlist-list-container');
        
        listContainer.style.display = 'flex';
        detailViewContainer.style.display = 'none';

        if (!watchlistContainer) return;

        const watchlistSearchInput = document.getElementById('watchlistSearchInput');
        const searchTerm = watchlistSearchInput ? watchlistSearchInput.value.toLowerCase() : '';

        const filteredWatchlist = this.data.watchlist.filter(item => 
            item.address.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            item.notes.toLowerCase().includes(searchTerm)
        );

        if (filteredWatchlist.length === 0) {
            watchlistContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h3>No Addresses Match Search</h3>
                    <p>Try a different address, tag, or note keyword.</p>
                </div>`;
            return;
        }
        
        const watchlistItems = filteredWatchlist.map(item => `
            <div class="watchlist-item status-${item.status}">
                <div class="watchlist-info-primary">
                    <div class="watchlist-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="watchlist-meta">
                        <span class="watchlist-address">${item.address.substring(0, 20)}...</span>
                        <span class="watchlist-added-date">Added: ${item.added}</span>
                    </div>
                </div>
                <div class="watchlist-info-secondary">
                    <div class="watchlist-tags">
                        ${item.tags.map(tag => `<span class="watchlist-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="watchlist-actions">
                        <button class="action-btn" title="View Details" onclick="window.cryptohunter.viewWatchlistItem('${item.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn danger-btn" title="Remove from Watchlist" onclick="window.cryptohunter.removeFromWatchlist('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        watchlistContainer.innerHTML = watchlistItems;
    },
    filterWatchlist: function() {
        this.renderWatchlistTab();
    },
    showAddToWatchlistModal: function(item = null) {
        const modal = document.getElementById('addToWatchlistModal');
        const form = document.getElementById('addToWatchlistForm');
        form.reset();
        document.getElementById('watchlistId').value = '';
        modal.style.display = 'flex';
    },
    closeAddToWatchlistModal: function() {
        document.getElementById('addToWatchlistModal').style.display = 'none';
    },
    saveWatchlistAddress: function(event) {
        event.preventDefault();
        const form = event.target;
        const newAddress = form.elements.watchlistWalletAddress.value.trim();
        const newTags = form.elements.watchlistTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const newNotes = form.elements.watchlistNotes.value.trim();
        
        if (!newAddress) { showNotification('Wallet address is required.', 'error'); return; }

        const existingItem = this.data.watchlist.find(item => item.address === newAddress);
        if (existingItem) {
            showNotification('This address is already on your watchlist.', 'warning');
            return;
        }

        this.data.watchlist.push({
            id: 'WL-' + Date.now(),
            address: newAddress,
            tags: newTags,
            notes: newNotes,
            added: new Date().toISOString().split('T')[0],
            status: 'active'
        });

        this.renderWatchlistTab();
        this.closeAddToWatchlistModal();
        showNotification('Address added to watchlist.', 'success');
    },
    removeFromWatchlist: function(id) {
        if (confirm('Are you sure you want to remove this address from your watchlist?')) {
            this.data.watchlist = this.data.watchlist.filter(item => item.id !== id);
            this.renderWatchlistTab();
            showNotification('Address removed from watchlist.', 'success');
        }
    },
    viewWatchlistItem: function(id) {
        const item = this.data.watchlist.find(i => i.id === id);
        if (!item) {
            showNotification('Watchlist item not found!', 'error');
            return;
        }

        const watchlistListContainer = document.getElementById('watchlistContainer');
        const watchlistDetailView = document.getElementById('watchlistDetailView');
        const watchlistDetailContent = document.getElementById('watchlistDetailContent');

        watchlistListContainer.style.display = 'none';
        watchlistDetailView.style.display = 'block';

        const transactionData = item.transactions || []; // Use dummy data from the watchlist model

        watchlistDetailContent.innerHTML = `
            <div class="watchlist-detail-header">
                <div class="watchlist-info">
                    <h4 class="watchlist-detail-address">Address: <span>${item.address}</span></h4>
                    <span class="watchlist-status-badge status-${item.status}">${item.status.toUpperCase()}</span>
                </div>
                <div class="watchlist-detail-actions">
                    <button class="btn-secondary" onclick="window.cryptohunter.removeFromWatchlist('${item.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    <button class="btn-primary" onclick="showNotification('Monitor feature coming soon...', 'info')">
                        <i class="fas fa-satellite-dish"></i> Monitor
                    </button>
                </div>
            </div>
            
            <div class="watchlist-detail-body">
                <div class="detail-section">
                    <h4>Notes & Tags</h4>
                    <p class="notes">${item.notes || 'No notes available.'}</p>
                    <div class="watchlist-tags">
                        ${item.tags.map(tag => `<span class="watchlist-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Transaction Graph</h4>
                    <div id="watchlist-tx-graph" class="transaction-graph">
                        <div class="empty-state">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Generating graph...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.generateAddressGraph(item.address, transactionData, 'watchlist-tx-graph');
    },

    // --- API Key & Settings Logic ---
    saveApiKey: function(event) {
        event.preventDefault();
        const form = event.target;
        const keyId = form.elements.apiKeyId.value;
        const newKey = {
            id: keyId || 'API-' + Date.now(),
            platform: form.elements.apiPlatform.value,
            value: form.elements.apiKeyValue.value,
            enabled: true,
        };
        const existingKeyIndex = this.data.apiKeys.findIndex(k => k.id === keyId);
        if (existingKeyIndex > -1) {
            this.data.apiKeys[existingKeyIndex] = newKey;
            showNotification('API Key updated successfully!', 'success');
        } else {
            this.data.apiKeys.push(newKey);
            showNotification('New API Key added successfully!', 'success');
        }
        localStorage.setItem('cryptohunter_api_keys', JSON.stringify(this.data.apiKeys));
        this.renderApiKeysList();
        this.closeApiModal();
    },
    toggleApiKey: function(id) {
        const key = this.data.apiKeys.find(k => k.id === id);
        if (key) {
            key.enabled = !key.enabled;
            localStorage.setItem('cryptohunter_api_keys', JSON.stringify(this.data.apiKeys));
            this.renderApiKeysList();
            showNotification(`API Key for ${key.platform.toUpperCase()} has been ${key.enabled ? 'enabled' : 'disabled'}.`, 'info');
        }
    },
    deleteApiKey: function(id) {
        if (confirm('Are you sure you want to delete this API key?')) {
            this.data.apiKeys = this.data.apiKeys.filter(k => k.id !== id);
            localStorage.setItem('cryptohunter_api_keys', JSON.stringify(this.data.apiKeys));
            this.renderApiKeysList();
            showNotification('API Key deleted successfully.', 'success');
        }
    },
    saveNotificationSettings: function() {
        const notifications = {
            email: {
                enabled: document.getElementById('emailNotifications').checked,
                address: document.getElementById('emailAddress').value
            },
            sms: {
                enabled: document.getElementById('smsNotifications').checked,
                number: document.getElementById('smsNumber').value
            },
            webhook: {
                enabled: document.getElementById('webhookNotifications').checked,
                url: document.getElementById('webhookUrl').value
            }
        };
        this.data.notifications = notifications;
        localStorage.setItem('cryptohunter_notifications', JSON.stringify(notifications));
        showNotification('Notification settings saved successfully!', 'success');
    },
    toggleNotification: function(channel) {
        const input = document.getElementById(`${channel}Notifications`);
        const target = document.getElementById(`${channel}Address`) || document.getElementById(`${channel}Number`) || document.getElementById(`${channel}Url`);
        if (target) {
            target.disabled = !input.checked;
        }
    },
    
    // --- Search & Graph Logic ---
    searchAddress: function() {
        const addressInput = document.getElementById('walletAddressInput');
        const address = addressInput.value.trim();
        const detailsContainer = document.getElementById('addressDetailsContainer');
        const detailsContent = document.getElementById('addressDetails');
        if (!address) {
            showNotification('Please enter a wallet address.', 'error');
            return;
        }
        detailsContainer.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><h3>Searching for ${address}...</h3><p>This may take a moment as we query blockchain data and threat intelligence feeds.</p></div>`;
        detailsContent.style.display = 'none';
        
        // Simulate checking against scam databases
        this.apiService.checkWalletReputation(address)
            .then(isFlagged => {
                const dataPromise = this.apiService.fetchWalletData(address);
                dataPromise.then(data => {
                    data.isFlagged = isFlagged;
                    this.renderAddressDetails(address, data);
                    detailsContent.style.display = 'flex';
                    detailsContainer.innerHTML = '';
                    if (isFlagged) {
                        showNotification('Warning: This address is flagged on a known scam database!', 'warning');
                    }
                }).catch(error => {
                    detailsContainer.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Search Failed</h3><p>${error}</p><button class="btn-primary" onclick="showCryptHunterTab('cryptohunter-settings')"><i class="fas fa-sliders-h"></i> Go to Settings</button></div>`;
                    showNotification(`Search failed: ${error}`, 'error');
                });
            })
            .catch(error => {
                detailsContainer.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Search Failed</h3><p>${error}</p><button class="btn-primary" onclick="showCryptHunterTab('cryptohunter-settings')"><i class="fas fa-sliders-h"></i> Go to Settings</button></div>`;
                showNotification(`Search failed: ${error}`, 'error');
            });
    },
    renderAddressDetails: function(address, data) {
        document.getElementById('summary-address').textContent = address;
        document.getElementById('summary-balance').textContent = data.balance;
        document.getElementById('summary-tx-count').textContent = data.txCount;
        document.getElementById('summary-first-seen').textContent = data.firstSeen;
        const riskBadge = document.getElementById('summary-risk-score');
        if (riskBadge) {
            riskBadge.textContent = `Score: ${data.riskScore}`;
            riskBadge.className = `risk-score-badge risk-score-${this.getRiskLevelClass(data.riskScore)}`;
        }
        const statusBadge = document.getElementById('summary-status-badge');
        if (statusBadge) {
            statusBadge.textContent = data.status.toUpperCase();
            statusBadge.className = `status-badge status-${data.status}`;
            if (data.isFlagged) {
                statusBadge.textContent = 'SCAM FLAG';
                statusBadge.classList.add('status-scam-flagged');
            }
        }
        const transactionsList = document.getElementById('transactionsList');
        if (transactionsList) {
            transactionsList.innerHTML = data.transactions.map(tx => `
                <div class="transaction-item tx-type-${tx.type}">
                    <div class="tx-icon"><i class="fas fa-${tx.type === 'in' ? 'arrow-down' : 'arrow-up'}"></i></div>
                    <div class="tx-details">
                        <span class="tx-amount">${tx.amount}</span>
                        <span class="tx-label">${tx.label}</span>
                        <span class="tx-timestamp">${tx.timestamp.toLocaleString()}</span>
                    </div>
                </div>
            `).join('');
        }
        this.generateAddressGraph(address, data.transactions, 'address-tx-graph');
    },
    generateAddressGraph: function(centerAddress, transactions, containerId = 'cryptohunter-graph') {
        const graphContainer = document.getElementById(containerId);
        if (!graphContainer) return;
        graphContainer.innerHTML = '';
        if (!transactions || transactions.length === 0) {
            graphContainer.innerHTML = `<div class="empty-state"><i class="fas fa-project-diagram"></i><p>No transactions to display.</p></div>`;
            return;
        }
        const elements = [];
        const nodes = new Set();
        let edgeIdCounter = 0;
        if (typeof centerAddress === 'string') {
            nodes.add(centerAddress);
            elements.push({ data: { id: centerAddress, label: centerAddress.substring(0, 10), type: 'main' }, classes: `main-wallet` });
        }
        transactions.forEach(tx => {
            const source = tx.from;
            const target = tx.to;
            if (typeof source === 'string' && !nodes.has(source)) { nodes.add(source); elements.push({ data: { id: source, label: source.substring(0, 10), type: 'related', amount: tx.amount }, classes: 'related-wallet' }); }
            if (typeof target === 'string' && !nodes.has(target)) { nodes.add(target); elements.push({ data: { id: target, label: target.substring(0, 10), type: 'related', amount: tx.amount }, classes: 'related-wallet' }); }
            if (typeof source === 'string' && typeof target === 'string') { elements.push({ data: { id: `edge-${edgeIdCounter++}`, source: source, target: target, label: `${tx.label}\n(${tx.amount})`, amount: tx.amount }, classes: `tx-edge tx-type-${tx.type}` }); }
        });
        this.cy = cytoscape({
            container: graphContainer,
            elements: elements,
            style: [
                { selector: 'node', style: { 'background-color': '#ff4757', 'label': 'data(label)', 'color': '#fff', 'text-valign': 'bottom', 'text-margin-y': '5px', 'font-size': '12px', 'width': '60px', 'height': '60px', 'border-width': '2px', 'border-color': 'rgba(255, 255, 255, 0.5)', 'text-wrap': 'wrap', 'text-max-width': '80px', 'shape': 'round-rectangle', 'padding': '10px' } },
                { selector: '.main-wallet', style: { 'background-color': '#ff4757', 'border-color': '#fff', 'border-width': '4px', 'shape': 'ellipse', 'width': '80px', 'height': '80px', 'label': 'data(label)', 'font-size': '14px' } },
                { selector: '.related-wallet', style: { 'background-color': '#6e5494', } },
                { selector: 'edge', style: { 'width': 2, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'label': 'data(label)', 'font-size': '10px', 'color': '#fff', 'text-background-opacity': 1, 'text-background-color': '#1a1a2e', 'text-background-shape': 'round-rectangle', 'text-border-width': 1, 'text-border-color': '#333' } },
                { selector: '.tx-type-in', style: { 'line-color': '#10b981', 'target-arrow-color': '#10b981', } },
                { selector: '.tx-type-out', style: { 'line-color': '#dc3545', 'target-arrow-color': '#dc3545', } },
            ],
            layout: { name: 'cose', animate: 'end', animationEasing: 'ease-out', randomize: true }
        });
    },
    generateGraph: function() {
        const container = document.getElementById('cryptohunter-graph');
        if (!container) return;
        container.innerHTML = '';
        const graphData = this.getGraphDataFromAlerts();
        if (graphData.nodes.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-project-diagram"></i><h3>No Graph Data</h3><p>Click "Generate Graph" to visualize wallet relationships from recent alerts.</p></div>`;
            return;
        }
        this.cy = cytoscape({
            container: container,
            elements: graphData,
            style: [
                { selector: 'node', style: { 'background-color': '#ff4757', 'label': 'data(label)', 'color': '#fff', 'text-valign': 'bottom', 'text-margin-y': '5px', 'font-size': '12px', 'width': '60px', 'height': '60px', 'border-width': '2px', 'border-color': '#ffffff', 'text-wrap': 'wrap', 'text-max-width': '80px', 'shape': 'round-rectangle', 'padding': '10px' } },
                { selector: 'edge', style: { 'width': 2, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'label': 'data(label)', 'font-size': '10px', 'color': '#fff', 'text-background-opacity': 1, 'text-background-color': '#0a0a0f', 'text-background-shape': 'round-rectangle', 'text-border-width': 1, 'text-border-color': '#333' } },
                { selector: '.mixer-node', style: { 'background-color': '#f59e0b', 'shape': 'star' } },
                { selector: '.risk-critical', style: { 'background-color': '#dc3545', 'border-color': '#dc3545', 'color': '#fff' } },
                { selector: '.risk-high', style: { 'background-color': '#ff4757', 'border-color': '#ff4757', 'color': '#fff' } },
            ],
            layout: { name: 'cose', animate: 'end', animationEasing: 'ease-out', randomize: true }
        });
        this.cy.on('tap', 'node', function(evt){ const node = evt.target; showNotification(`Wallet: ${node.data('id')}\nRisk: ${node.data('risk') || 'N/A'}`, 'info'); });
        this.cy.on('tap', 'edge', function(evt){ const edge = evt.target; showNotification(`Transaction: ${edge.data('label')}\nFrom: ${edge.source().data('label')}\nTo: ${edge.target().data('label')}`, 'info'); });
    },
    getGraphDataFromAlerts: function() {
        const nodes = new Map();
        const edges = [];
        let edgeIdCounter = 0;
        this.data.alerts.forEach(alert => {
            const walletId = alert.wallet;
            const mixerAddress = '0xMixerPool12345...';
            if (!nodes.has(walletId)) { nodes.set(walletId, { id: walletId, label: walletId.substring(0, 10), risk: alert.risk, classes: `risk-${alert.risk}` }); }
            if (alert.type === 'Mixer Detected') {
                if (!nodes.has(mixerAddress)) { nodes.set(mixerAddress, { id: mixerAddress, label: 'Mixer', classes: 'mixer-node' }); }
                edges.push({ id: `edge-${edgeIdCounter++}`, source: walletId, target: mixerAddress, label: 'funds sent to mixer' });
            }
        });
        return { nodes: Array.from(nodes.values()).map(node => ({ data: node })), edges: edges.map(edge => ({ data: edge })) };
    },
    getAlertIcon: function(type) {
        switch(type) {
            case 'High Velocity': return 'rocket';
            case 'Mixer Detected': return 'random';
            case 'Blacklisted Wallet': return 'ban';
            case 'Cross-Chain Anomaly': return 'exchange-alt';
            default: return 'exclamation-triangle';
        }
    },
    getRiskLevelClass: function(score) {
        if (score >= 80) return 'critical';
        if (score >= 60) return 'high';
        if (score >= 40) return 'medium';
        return 'low';
    },
    renderActivityChart: function() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;
        const data = [12, 19, 3, 5, 2, 3, 10];
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        ctx.innerHTML = '';
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'dashboard-chart-wrapper';
        const maxData = Math.max(...data);
        chartWrapper.innerHTML = labels.map((label, index) => `<div class="chart-bar-container"><div class="chart-bar" style="height: ${data[index] / maxData * 100}%;"></div><span class="chart-label">${label}</span></div>`).join('');
        ctx.appendChild(chartWrapper);
    },
    showCryptHunterTab: function(tabId) {
        document.querySelectorAll('.cryptohunter-tab-content').forEach(tab => { tab.classList.remove('active'); });
        document.querySelectorAll('.cryptohunter-tab-btn').forEach(btn => { btn.classList.remove('active'); });
        const activeTabContent = document.getElementById(tabId);
        if (activeTabContent) { activeTabContent.classList.add('active'); }
        const activeTabButton = document.querySelector(`.cryptohunter-tab-btn[onclick="showCryptHunterTab('${tabId}')"]`);
        if (activeTabButton) { activeTabButton.classList.add('active'); }
        this.currentTab = tabId;
        if (tabId === 'cryptohunter-dashboard') { this.renderDashboard(); }
        else if (tabId === 'cryptohunter-alerts') { this.renderAlertsTab(); }
        else if (tabId === 'cryptohunter-settings') { this.renderSettingsTab(); }
        else if (tabId === 'cryptohunter-rule-engine') { this.renderRuleEngineTab(); }
        else if (tabId === 'cryptohunter-watchlist') { this.renderWatchlistTab(); }
        else if (tabId === 'cryptohunter-address-search') {
            document.getElementById('addressDetails').style.display = 'none';
            document.getElementById('addressDetailsContainer').innerHTML = `<div class="empty-state"><i class="fas fa-wallet"></i><h3>Search for an Address</h3><p>Enter a cryptocurrency wallet address to view its full history, transactions, and linked entities.</p></div>`;
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    window.cryptohunter = cryptohunter;
    window.showCryptHunterTab = cryptohunter.showCryptHunterTab.bind(cryptohunter);
    window.searchAddress = cryptohunter.searchAddress.bind(cryptohunter);
    window.viewAlertDetails = cryptohunter.viewAlertDetails.bind(cryptohunter);
    window.showNewAlertModal = cryptohunter.showNewAlertModal.bind(cryptohunter);
    window.closeNewAlertModal = cryptohunter.closeNewAlertModal.bind(cryptohunter);
    window.createNewAlert = cryptohunter.createNewAlert.bind(cryptohunter);
    window.saveApiKey = cryptohunter.saveApiKey.bind(cryptohunter);
    window.showRuleModal = cryptohunter.showRuleModal.bind(cryptohunter);
    window.closeRuleModal = cryptohunter.closeRuleModal.bind(cryptohunter);
    window.addRuleCondition = cryptohunter.addRuleCondition.bind(cryptohunter);
    window.saveRule = cryptohunter.saveRule.bind(cryptohunter);
    window.editRule = cryptohunter.editRule.bind(cryptohunter);
    window.deleteRule = cryptohunter.deleteRule.bind(cryptohunter);
    window.toggleRuleEnabled = cryptohunter.toggleRuleEnabled.bind(cryptohunter);
    window.showAddToWatchlistModal = cryptohunter.showAddToWatchlistModal.bind(cryptohunter);
    window.closeAddToWatchlistModal = cryptohunter.closeAddToWatchlistModal.bind(cryptohunter);
    window.saveWatchlistAddress = cryptohunter.saveWatchlistAddress.bind(cryptohunter);
    window.removeFromWatchlist = cryptohunter.removeFromWatchlist.bind(cryptohunter);
    window.viewWatchlistItem = cryptohunter.viewWatchlistItem.bind(cryptohunter);
    window.filterWatchlist = cryptohunter.filterWatchlist.bind(cryptohunter);

    const originalShowSection = window.showSection;
    window.showSection = (sectionName) => {
        originalShowSection(sectionName);
        if (sectionName === 'cryptohunter') { cryptohunter.init(); }
    };
});

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return `just now`;
}