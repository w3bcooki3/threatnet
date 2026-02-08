/* ============================================
   OSINTRIX DASHBOARD DATA ENGINE
   Real-time metrics from Intelligence Vault
   ============================================ */

/**
 * Calculate dashboard metrics from real data
 */
function calculateDashboardMetrics() {
    const tools = intelligenceTools || [];
    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
    // Tools metrics
    const toolsThisWeek = tools.filter(t => new Date(t.dateAdded) >= oneWeekAgo).length;
    const toolsThisMonth = tools.filter(t => new Date(t.dateAdded) >= oneMonthAgo).length;
    const toolsLastWeek = tools.filter(t => {
        const date = new Date(t.dateAdded);
        const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
        return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;
    
    const toolsChange = toolsThisWeek - toolsLastWeek;
    const toolsChangePercent = toolsLastWeek > 0 ? ((toolsChange / toolsLastWeek) * 100).toFixed(0) : 0;
    
    // Category distribution
    const categoryStats = {};
    tools.forEach(tool => {
        const cat = tool.parentCategory || 'general';
        categoryStats[cat] = (categoryStats[cat] || 0) + 1;
    });
    
    // Top categories
    const topCategories = Object.entries(categoryStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, count]) => ({
            name: categoryMapping[cat]?.name || cat,
            count: count,
            icon: categoryMapping[cat]?.icon || 'fas fa-folder'
        }));
    
    // Pinned and starred
    const pinnedTools = tools.filter(t => t.isPinned).length;
    const starredTools = tools.filter(t => t.isStarred).length;
    
    // Get dork templates count (from dork assistant if available)
    let dorkTemplatesCount = 0;
    try {
        const dorkCategories = JSON.parse(localStorage.getItem('dorkCategories')) || [];
        dorkTemplatesCount = dorkCategories.reduce((sum, cat) => {
            return sum + (cat.templates?.length || 0);
        }, 0);
    } catch (e) {
        console.log('Dork templates not available yet');
    }
    
    // Get threat hunting rules (from blue team playbook if available)
    let threatHuntingRules = 0;
    try {
        const playbook = JSON.parse(localStorage.getItem('blueteamPlaybook')) || [];
        threatHuntingRules = playbook.filter(item => 
            item.type === 'detection' || item.type === 'hunting'
        ).length;
    } catch (e) {
        console.log('Threat hunting rules not available yet');
    }
    
    // Get case studies count
    let caseStudiesCount = 0;
    try {
        const cases = JSON.parse(localStorage.getItem('caseStudies')) || [];
        caseStudiesCount = cases.length;
    } catch (e) {
        console.log('Case studies not available yet');
    }
    
    // Get investigation notes count
    let investigationNotesCount = 0;
    try {
        const notes = JSON.parse(localStorage.getItem('investigationNotes')) || [];
        investigationNotesCount = notes.length;
    } catch (e) {
        console.log('Investigation notes not available yet');
    }
    
    // Get threat intel items count
    let threatIntelCount = 0;
    try {
        const threatItems = JSON.parse(localStorage.getItem('threatIntelItems')) || [];
        threatIntelCount = threatItems.length;
    } catch (e) {
        console.log('Threat intel not available yet');
    }
    
    // Get cheatsheets count
    let cheatsheetsCount = 0;
    try {
        const cheatsheets = JSON.parse(localStorage.getItem('cheatsheets')) || [];
        cheatsheetsCount = cheatsheets.length;
    } catch (e) {
        console.log('Cheatsheets not available yet');
    }
    
    // Get TraceLink projects count
    let tracelinkProjectsCount = 0;
    try {
        const projects = JSON.parse(localStorage.getItem('traceLinkProjects')) || [];
        tracelinkProjectsCount = projects.length;
    } catch (e) {
        console.log('TraceLink projects not available yet');
    }
    
    // Calculate most used tools (based on access count if you track it)
    const mostUsedTools = tools
        .filter(t => t.accessCount && t.accessCount > 0)
        .sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))
        .slice(0, 5)
        .map(t => ({
            name: t.name,
            url: t.url,
            category: categoryMapping[t.parentCategory]?.name || t.parentCategory,
            accessCount: t.accessCount || 0,
            icon: categoryMapping[t.parentCategory]?.icon || 'fas fa-toolbox'
        }));
    
    // Recent activity from all sections
    const recentActivity = [];
    
    // Recent tools (last 10)
    const recentTools = tools
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 10)
        .map(t => ({
            type: 'tool',
            title: `Added ${t.name}`,
            description: `New tool in ${categoryMapping[t.parentCategory]?.name || t.parentCategory}`,
            date: t.dateAdded,
            icon: 'fas fa-plus-circle',
            iconClass: 'new'
        }));
    
    recentActivity.push(...recentTools);
    
    // Sort by date and limit to 15 most recent
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    const limitedActivity = recentActivity.slice(0, 15);
    
    return {
        totalTools: tools.length,
        toolsThisWeek,
        toolsThisMonth,
        toolsChange,
        toolsChangePercent,
        pinnedTools,
        starredTools,
        dorkTemplatesCount,
        threatHuntingRules,
        caseStudiesCount,
        investigationNotesCount,
        threatIntelCount,
        cheatsheetsCount,
        tracelinkProjectsCount,
        categoryStats,
        topCategories,
        mostUsedTools,
        recentActivity: limitedActivity
    };
}

/**
 * Get chart data for weekly tool additions
 */
function getWeeklyToolsChart() {
    const tools = intelligenceTools || [];
    const now = new Date();
    const chartData = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const count = tools.filter(t => {
            const toolDate = new Date(t.dateAdded);
            return toolDate >= dayStart && toolDate <= dayEnd;
        }).length;
        
        chartData.push({
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count: count
        });
    }
    
    return chartData;
}

/**
 * Get category distribution for pie chart
 */
function getCategoryDistribution() {
    const tools = intelligenceTools || [];
    const distribution = {};
    
    tools.forEach(tool => {
        const cat = tool.parentCategory || 'general';
        const catName = categoryMapping[cat]?.name || cat;
        distribution[catName] = (distribution[catName] || 0) + 1;
    });
    
    return Object.entries(distribution)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Update dashboard with real data
 */
function updateDashboard() {
    const metrics = calculateDashboardMetrics();
    
    // Update metric cards (with 'dashboard-' prefix to avoid conflicts)
    updateMetricCard('dashboard-total-tools', metrics.totalTools, null, 'Total Tools');
    updateMetricCard('dashboard-tools-this-week', metrics.toolsThisWeek, 
        metrics.toolsChange, 'Added This Week');
    updateMetricCard('dashboard-tools-this-month', metrics.toolsThisMonth, 
        null, 'Added This Month');
    updateMetricCard('dashboard-pinned-tools', metrics.pinnedTools, null, 'Pinned Tools');
    updateMetricCard('dashboard-starred-tools', metrics.starredTools, null, 'Starred Tools');
    updateMetricCard('dashboard-dork-templates', metrics.dorkTemplatesCount, null, 'Dork Templates');
    updateMetricCard('dashboard-threat-hunting-rules', metrics.threatHuntingRules, null, 'Threat Hunting Rules');
    updateMetricCard('dashboard-case-studies', metrics.caseStudiesCount, null, 'Case Studies');
    
    // Update top categories
    updateTopCategories(metrics.topCategories);
    
    // Update most used tools
    updateMostUsedTools(metrics.mostUsedTools);
    
    // Update recent activity
    updateRecentActivity(metrics.recentActivity);
    
    // Update charts
    updateWeeklyChart();
    updateCategoryChart(metrics.categoryStats);
    
    console.log('✓ Dashboard updated with real data');
}

/**
 * Update a metric card
 */
function updateMetricCard(id, value, change, label) {
    const valueEl = document.querySelector(`#${id} .metric-value`);
    const labelEl = document.querySelector(`#${id} .metric-label`);
    const trendEl = document.querySelector(`#${id} .metric-trend`);
    
    if (valueEl) valueEl.textContent = formatNumber(value);
    if (labelEl) labelEl.textContent = label;
    
    if (trendEl && change !== null && change !== undefined) {
        const trendIcon = trendEl.querySelector('i');
        const trendSpan = trendEl.querySelector('span');
        
        if (change > 0) {
            trendEl.className = 'metric-trend up';
            if (trendIcon) trendIcon.className = 'fas fa-arrow-up';
            if (trendSpan) trendSpan.textContent = `+${change}`;
        } else if (change < 0) {
            trendEl.className = 'metric-trend down';
            if (trendIcon) trendIcon.className = 'fas fa-arrow-down';
            if (trendSpan) trendSpan.textContent = Math.abs(change);
        } else {
            trendEl.className = 'metric-trend neutral';
            if (trendIcon) trendIcon.className = 'fas fa-minus';
            if (trendSpan) trendSpan.textContent = '0';
        }
    }
}

/**
 * Format number for display
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Update top categories list
 */
function updateTopCategories(categories) {
    const container = document.getElementById('dashboard-top-categories-list');
    if (!container) return;
    
    if (categories.length === 0) {
        container.innerHTML = '<div class="no-data">No categories yet. Start adding tools!</div>';
        return;
    }
    
    const maxCount = Math.max(...categories.map(c => c.count));
    
    container.innerHTML = categories.map(cat => `
        <div class="category-item">
            <div class="category-icon">
                <i class="${cat.icon}"></i>
            </div>
            <div class="category-info">
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${cat.count} tool${cat.count !== 1 ? 's' : ''}</div>
            </div>
            <div class="category-bar">
                <div class="category-bar-fill" style="width: ${(cat.count / maxCount * 100)}%"></div>
            </div>
        </div>
    `).join('');
}

/**
 * Update most used tools list
 */
function updateMostUsedTools(tools) {
    const container = document.getElementById('dashboard-most-used-tools-list');
    if (!container) return;
    
    if (tools.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <p>No usage data yet.</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.4);">
                    Usage tracking will show your most-used tools here.
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tools.map((tool, index) => `
        <div class="used-tool-item">
            <div class="tool-rank">#${index + 1}</div>
            <div class="tool-details">
                <div class="tool-name">${escapeHtml(tool.name)}</div>
                <div class="tool-meta">
                    <span class="tool-category"><i class="${tool.icon}"></i> ${escapeHtml(tool.category)}</span>
                    <span class="tool-uses"><i class="fas fa-mouse-pointer"></i> ${tool.accessCount} use${tool.accessCount !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <a href="${escapeHtml(tool.url)}" target="_blank" class="tool-quick-link" title="Open ${escapeHtml(tool.name)}">
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `).join('');
}

/**
 * Update recent activity timeline
 */
function updateRecentActivity(activities) {
    const container = document.getElementById('dashboard-recent-activity-timeline');
    if (!container) return;
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <p>No recent activity</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.4);">
                    Start adding tools to see activity here.
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.iconClass}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${escapeHtml(activity.title)}</div>
                <div class="activity-description">${escapeHtml(activity.description)}</div>
                <div class="activity-time">${getRelativeTime(activity.date)}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Get relative time string
 */
function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString();
}

/**
 * Update weekly tools chart
 */
function updateWeeklyChart() {
    const chartData = getWeeklyToolsChart();
    const maxCount = Math.max(...chartData.map(d => d.count), 1);
    
    const container = document.getElementById('dashboard-weekly-chart');
    if (!container) return;
    
    container.innerHTML = chartData.map(day => {
        const height = maxCount > 0 ? (day.count / maxCount * 100) : 0;
        return `
            <div class="chart-bar" style="height: ${height}%">
                <div class="chart-tooltip">${day.day}: ${day.count}</div>
            </div>
        `;
    }).join('');
}

/**
 * Update category distribution chart
 */
function updateCategoryChart(categoryStats) {
    const container = document.getElementById('dashboard-category-distribution');
    if (!container) return;
    
    const entries = Object.entries(categoryStats);
    
    if (entries.length === 0) {
        container.innerHTML = '<div class="no-data">No categories yet. Start adding tools!</div>';
        return;
    }
    
    const total = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);
    
    container.innerHTML = entries
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([cat, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            const catName = categoryMapping[cat]?.name || cat;
            return `
                <div class="distribution-item">
                    <div class="distribution-label">${escapeHtml(catName)}</div>
                    <div class="distribution-bar">
                        <div class="distribution-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="distribution-value">${count}</div>
                </div>
            `;
        }).join('');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize dashboard on page load
 */
function initDashboard() {
    // Update dashboard if it's the active section
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection && dashboardSection.classList.contains('active')) {
        updateDashboard();
    }
}

/**
 * Auto-refresh dashboard every 30 seconds when visible
 */
let dashboardRefreshInterval;

function startDashboardRefresh() {
    stopDashboardRefresh();
    dashboardRefreshInterval = setInterval(() => {
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection && dashboardSection.classList.contains('active')) {
            updateDashboard();
        }
    }, 30000); // 30 seconds
}

function stopDashboardRefresh() {
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
    }
}

/**
 * Manually refresh dashboard (called by refresh button)
 */
function refreshDashboard() {
    updateDashboard();
    showNotification('Dashboard refreshed', 'success');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            initDashboard();
            startDashboardRefresh();
        }, 500); // Small delay to ensure other components are loaded
    });
} else {
    setTimeout(() => {
        initDashboard();
        startDashboardRefresh();
    }, 500);
}

console.log('✓ Dashboard Data Engine Initialized');