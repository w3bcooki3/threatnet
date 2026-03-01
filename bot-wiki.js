/* ============================================
   OSINTRIX BOT WIKI
   Version 1.4.0 | January 2025
   - Data loaded from bots.json (with localforage cache)
   - IOC export: JSON, CSV, STIX-lite
   ============================================ */

const BW_VERSION     = '1.4.0';
const BW_UPDATED     = 'January 2025';
const BW_CACHE_KEY   = 'osintrix_botwiki_data';
const BW_CACHE_VER   = 'osintrix_botwiki_version';
const BW_DATA_URL    = 'bots.json';   // JSON file to fetch from

/* ---- State ---- */
let bwBots        = [];
let bwSelected    = null;
let bwFilter      = 'all';
let bwSearch      = '';
let bwActiveTab   = 'overview';
let bwOpenRules   = new Set();

/* ============================================
   BOOTSTRAP
   ============================================ */
async function initBotWiki() {
    showBwListLoading();

    try {
        const cached = await loadFromCache();
        if (cached && cached.length) {
            bwBots = cached;
            renderBotList();
        } else {
            await fetchAndCacheData();
        }
    } catch (err) {
        // Fallback: use inline data if JSON fetch fails
        console.warn('[BotWiki] Could not load bots.json, using embedded data.', err);
        bwBots = getBundledBots();
        await cacheData(bwBots);
        renderBotList();
    }

    setupBwSearch();
    setupBwFilters();
}

async function fetchAndCacheData() {
    try {
        const res = await fetch(BW_DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        bwBots = json.bots || json;
        await cacheData(bwBots);
        renderBotList();
    } catch (err) {
        throw err;
    }
}

/* ---- LocalForage cache ---- */
async function cacheData(data) {
    try {
        await localforage.setItem(BW_CACHE_KEY, data);
        await localforage.setItem(BW_CACHE_VER, BW_VERSION);
    } catch (e) { console.warn('[BotWiki] Cache write failed', e); }
}

async function loadFromCache() {
    try {
        const ver  = await localforage.getItem(BW_CACHE_VER);
        const data = await localforage.getItem(BW_CACHE_KEY);
        if (ver === BW_VERSION && Array.isArray(data) && data.length) return data;
        return null;
    } catch (e) { return null; }
}

async function bwRefreshData() {
    showBwListLoading();
    try {
        await localforage.removeItem(BW_CACHE_KEY);
        await localforage.removeItem(BW_CACHE_VER);
        await fetchAndCacheData();
        showBwNotification('Bot database refreshed from source', 'success');
    } catch (err) {
        bwBots = getBundledBots();
        renderBotList();
        showBwNotification('Using bundled data (could not reach bots.json)', 'warning');
    }
}

function showBwListLoading() {
    const list = document.getElementById('bw-bot-list');
    if (list) list.innerHTML = `<div class="bw-loading" style="min-height:120px"><div class="bw-spinner"></div><span>Loading database...</span></div>`;
}

/* ============================================
   RENDER BOT LIST
   ============================================ */
function renderBotList() {
    const list = document.getElementById('bw-bot-list');
    if (!list) return;

    const q = bwSearch.toLowerCase();
    const filtered = bwBots.filter(b => {
        const matchF = bwFilter === 'all' || b.classification === bwFilter;
        const matchS = !q || b.name.toLowerCase().includes(q)
            || (b.family || '').toLowerCase().includes(q)
            || (b.author || '').toLowerCase().includes(q);
        return matchF && matchS;
    });

    list.innerHTML = filtered.length === 0
        ? `<div style="padding:1.5rem;text-align:center;color:rgba(255,255,255,0.25);font-size:0.82rem">No bots match.</div>`
        : filtered.map(b => `
            <div class="bw-bot-row ${bwSelected === b.id ? 'selected' : ''}" onclick="bwSelect('${b.id}')">
                <div class="bw-dot dot-${b.classification}"></div>
                <div class="bw-row-meta">
                    <div class="bw-row-name">${b.name}</div>
                    <div class="bw-row-fam">${b.family || ''}</div>
                </div>
                <span class="bw-risk-pill pill-${b.riskScore || 'info'}">${b.riskScore || 'info'}</span>
            </div>`).join('');

    // Stats
    const stats = document.getElementById('bw-list-stats');
    if (stats) {
        const c = { legitimate: 0, gray: 0, malicious: 0 };
        bwBots.forEach(b => { if (c[b.classification] !== undefined) c[b.classification]++; });
        stats.innerHTML = `
            <span><span class="bw-dot dot-legitimate" style="display:inline-block;margin-right:4px;vertical-align:middle"></span>${c.legitimate} Safe</span>
            <span><span class="bw-dot dot-gray"       style="display:inline-block;margin-right:4px;vertical-align:middle"></span>${c.gray} Gray</span>
            <span><span class="bw-dot dot-malicious"  style="display:inline-block;margin-right:4px;vertical-align:middle"></span>${c.malicious} Threat</span>`;
    }
}

/* ============================================
   SELECT BOT
   ============================================ */
function bwSelect(id) {
    bwSelected  = id;
    bwActiveTab = 'overview';
    bwOpenRules.clear();
    renderBotList();
    const bot = bwBots.find(b => b.id === id);
    if (bot) renderBwDetail(bot);
}

/* ============================================
   RENDER DETAIL
   ============================================ */
function renderBwDetail(bot) {
    const wrap = document.getElementById('bw-detail-wrap');
    if (!wrap) return;

    const recIcon = { allow: 'fas fa-check-circle', monitor: 'fas fa-eye', block: 'fas fa-ban' };
    const clsIcon = { legitimate: 'fas fa-check-circle', gray: 'fas fa-exclamation-triangle', malicious: 'fas fa-skull-crossbones' };
    const rec = bot.recommendation || {};

    wrap.innerHTML = `
        <!-- BOT HEADER -->
        <div class="bw-bot-header">
            <div class="bw-header-top">
                <div>
                    <div class="bw-name-row">
                        <div class="bw-bot-name">${bot.name}</div>
                        <span class="bw-class-badge badge-${bot.classification}">
                            <i class="${clsIcon[bot.classification]}"></i>${bot.classification}
                        </span>
                        <span class="bw-risk-pill pill-${bot.riskScore || 'info'}" style="font-size:0.65rem">
                            ${(bot.riskScore || 'info').toUpperCase()} RISK
                        </span>
                    </div>
                    <div class="bw-meta-row">
                        ${bot.author    ? `<span class="bw-meta-item"><i class="fas fa-user"></i><strong>Author:</strong> ${bot.author}</span>` : ''}
                        ${bot.family    ? `<span class="bw-meta-item"><i class="fas fa-layer-group"></i><strong>Family:</strong> ${bot.family}</span>` : ''}
                        ${bot.firstSeen ? `<span class="bw-meta-item"><i class="fas fa-calendar"></i><strong>First seen:</strong> ${bot.firstSeen}</span>` : ''}
                        ${bot.lastSeen  ? `<span class="bw-meta-item"><i class="fas fa-satellite-dish"></i><strong>Last active:</strong> ${bot.lastSeen}</span>` : ''}
                    </div>
                </div>
                <div class="bw-header-btns">
                    <button class="bw-btn bw-btn-ghost" onclick="bwExportJSON('${bot.id}')">
                        <i class="fas fa-file-code"></i> JSON
                    </button>
                    <button class="bw-btn bw-btn-ghost" onclick="bwCopyAllRules('${bot.id}')">
                        <i class="fas fa-copy"></i> All Rules
                    </button>
                    <button class="bw-btn bw-btn-primary" onclick="bwExportIOC('${bot.id}','csv')">
                        <i class="fas fa-download"></i> IOC Export
                    </button>
                </div>
            </div>

            ${rec.text ? `
            <div class="bw-rec rec-${rec.action || 'monitor'}">
                <i class="${recIcon[rec.action] || 'fas fa-eye'}"></i>
                <div>
                    <span class="bw-rec-label">${(rec.action || 'monitor').toUpperCase()}</span>
                    ${rec.text}
                </div>
            </div>` : ''}
        </div>

        <!-- TABS -->
        <div class="bw-tabs-bar">
            <button class="bw-tab-btn active" data-tab="overview"   onclick="bwSwitchTab('overview')">  <i class="fas fa-info-circle"></i> Overview</button>
            <button class="bw-tab-btn"         data-tab="detection"  onclick="bwSwitchTab('detection')"> <i class="fas fa-crosshairs"></i> Detection</button>
            <button class="bw-tab-btn"         data-tab="behavior"   onclick="bwSwitchTab('behavior')">  <i class="fas fa-chart-bar"></i> Behavior</button>
            <button class="bw-tab-btn"         data-tab="mitigation" onclick="bwSwitchTab('mitigation')"><i class="fas fa-shield-alt"></i> Mitigation</button>
            <button class="bw-tab-btn"         data-tab="iocs"       onclick="bwSwitchTab('iocs')">      <i class="fas fa-fingerprint"></i> IOCs</button>
        </div>

        <!-- PANELS -->
        <div class="bw-panels">
            ${bwRenderOverview(bot)}
            ${bwRenderDetection(bot)}
            ${bwRenderBehavior(bot)}
            ${bwRenderMitigation(bot)}
            ${bwRenderIOCs(bot)}
        </div>

        <!-- FOOTER -->
        <div class="bw-footer">
            <span>OSINTrix Bot Wiki <span class="bw-version">v${BW_VERSION}</span></span>
            <span><i class="fas fa-calendar-alt" style="margin-right:4px"></i>Updated: ${BW_UPDATED}</span>
            <span>For informational use — verify before deploying. <a href="#" onclick="bwShowMethodology(event)">Methodology</a></span>
        </div>
    `;

    bwSwitchTab(bwActiveTab);
}

/* ============================================
   TAB PANELS
   ============================================ */
function bwRenderOverview(bot) {
    const related = (bot.relatedBots || []).map(rid => {
        const r = bwBots.find(b => b.id === rid);
        return `<div class="bw-related-card" onclick="${r ? `bwSelect('${rid}')` : ''}">
            <div class="bw-dot dot-${r ? r.classification : 'gray'}" style="margin-bottom:5px"></div>
            <div class="bw-related-name">${r ? r.name : rid}</div>
            <div class="bw-related-fam">${r ? r.family : 'Unknown'}</div>
        </div>`;
    }).join('');

    return `<div class="bw-panel active" id="bw-pnl-overview">
        <div style="font-size:0.84rem;color:rgba(255,255,255,0.55);line-height:1.7;margin-bottom:1rem;padding:0.875rem 1rem;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.065);border-left:3px solid #ff4757;border-radius:0 12px 12px 0">
            ${bot.summary || ''}
        </div>

        <div class="bw-info-grid">
            <div class="bw-card">
                <div class="bw-card-label"><i class="fas fa-bullseye"></i> Targets</div>
                <div class="bw-tags">${(bot.targets||[]).map(t=>`<span class="bw-tag target">${t}</span>`).join('')}</div>
            </div>
            <div class="bw-card">
                <div class="bw-card-label"><i class="fas fa-tools"></i> Techniques</div>
                <div class="bw-tags">${(bot.techniques||[]).map(t=>`<span class="bw-tag technique">${t}</span>`).join('')}</div>
            </div>
        </div>

        ${(bot.timeline||[]).length ? `
        <div class="bw-sh"><i class="fas fa-history"></i> Timeline</div>
        <div class="bw-timeline">
            ${bot.timeline.map(t=>`
                <div class="bw-tl-item">
                    <div class="bw-tl-dot"></div>
                    <div class="bw-tl-date">${t.date}</div>
                    <div class="bw-tl-text">${t.event}</div>
                </div>`).join('')}
        </div>` : ''}

        ${related ? `
        <div class="bw-sh"><i class="fas fa-link"></i> Related Bots</div>
        <div class="bw-related-grid">${related}</div>` : ''}
    </div>`;
}

function bwRenderDetection(bot) {
    const d = bot.detection || {};
    const rules = [
        { key:'signature',   label:'Signature',             type:'signature',   icon:'fas fa-fingerprint' },
        { key:'yara',        label:'YARA Rule',             type:'yara',        icon:'fas fa-code' },
        { key:'sigma',       label:'Sigma Rule (YAML)',      type:'sigma',       icon:'fas fa-file-code' },
        { key:'nginx',       label:'Nginx Config',          type:'nginx',       icon:'fas fa-server' },
        { key:'apache',      label:'Apache / .htaccess',    type:'apache',      icon:'fas fa-server' },
        { key:'cloudflare',  label:'Cloudflare Rule',       type:'cloudflare',  icon:'fas fa-cloud' },
        { key:'modsecurity', label:'ModSecurity Rules',     type:'modsec',      icon:'fas fa-shield-alt' },
    ];

    const items = rules.filter(r => d[r.key]).map(r => `
        <div class="bw-rule-item">
            <div class="bw-rule-head" onclick="bwToggleRule('${bot.id}-${r.key}')">
                <div class="bw-rule-title-row">
                    <i class="${r.icon}" style="color:rgba(255,255,255,0.4);font-size:0.8rem"></i>
                    ${r.label}
                    <span class="bw-rule-label rl-${r.type}">${r.type}</span>
                </div>
                <div class="bw-rule-controls">
                    <button class="bw-copy-btn" id="bwcopy-${bot.id}-${r.key}"
                            onclick="event.stopPropagation();bwCopyRule('${bot.id}','${r.key}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <i class="fas fa-chevron-down bw-chevron" id="bwchev-${bot.id}-${r.key}"></i>
                </div>
            </div>
            <div class="bw-rule-body" id="bwrule-${bot.id}-${r.key}">
                <pre>${escHtml(d[r.key])}</pre>
            </div>
        </div>`).join('');

    return `<div class="bw-panel" id="bw-pnl-detection">
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.28);margin-bottom:1rem;display:flex;align-items:center;gap:6px">
            <i class="fas fa-info-circle" style="color:#ff6b7a"></i>
            Click any row to expand. Rules are production-ready starting points — review before deploying.
        </div>
        ${items || '<div style="color:rgba(255,255,255,0.25);font-size:0.83rem">No detection rules available for this bot.</div>'}
    </div>`;
}

function bwRenderBehavior(bot) {
    const behClass = { normal:'beh-normal', neutral:'beh-neutral', suspicious:'beh-bad', bad:'beh-bad' };

    return `<div class="bw-panel" id="bw-pnl-behavior">
        <div class="bw-sh" style="margin-top:0"><i class="fas fa-robot"></i> Known User-Agent Strings</div>
        <div class="bw-ua-list">
            ${(bot.userAgents||[]).map(ua=>`<div class="bw-ua-entry">${ua}</div>`).join('')}
        </div>

        <div class="bw-sh"><i class="fas fa-eye"></i> Observed Behavior</div>
        <div class="bw-beh-list">
            ${(bot.behaviors||[]).map(b=>`
                <div class="bw-beh-item ${behClass[b.type]||'beh-neutral'}">
                    <i class="${b.icon}"></i>
                    <span>${b.text}</span>
                </div>`).join('')}
        </div>
    </div>`;
}

function bwRenderMitigation(bot) {
    return `<div class="bw-panel" id="bw-pnl-mitigation">
        <div class="bw-steps">
            ${(bot.mitigation||[]).map((s,i)=>`
                <div class="bw-step">
                    <div class="bw-step-num">${i+1}</div>
                    <div class="bw-step-body">
                        <div class="bw-step-title">
                            ${s.title}
                            <span class="bw-pri pri-${s.priority||'medium'}">${s.priority||'medium'}</span>
                        </div>
                        <div class="bw-step-desc">${s.desc}</div>
                    </div>
                </div>`).join('')}
        </div>
    </div>`;
}

function bwRenderIOCs(bot) {
    const iocClass = { ua:'ioc-ua', ip:'ioc-ip', domain:'ioc-domain', asn:'ioc-asn', behavior:'ioc-behavior', header:'ioc-header' };
    const confClass= { high:'conf-high', medium:'conf-medium', low:'conf-low' };

    return `<div class="bw-panel" id="bw-pnl-iocs">
        <div class="bw-ioc-toolbar">
            <span class="bw-ioc-note"><i class="fas fa-info-circle" style="margin-right:4px;color:#ff6b7a"></i>${(bot.iocs||[]).length} indicators · Export for use in SIEM, firewall, or threat feeds</span>
            <div class="bw-ioc-exports">
                <button class="bw-btn bw-btn-ghost" onclick="bwExportIOC('${bot.id}','csv')" title="Export as CSV">
                    <i class="fas fa-file-csv"></i> CSV
                </button>
                <button class="bw-btn bw-btn-ghost" onclick="bwExportIOC('${bot.id}','json')" title="Export as JSON">
                    <i class="fas fa-file-code"></i> JSON
                </button>
                <button class="bw-btn bw-btn-ghost" onclick="bwExportIOC('${bot.id}','txt')" title="Export as plain text IOC list">
                    <i class="fas fa-file-alt"></i> TXT
                </button>
                <button class="bw-btn bw-btn-success" onclick="bwExportIOC('${bot.id}','stix')" title="Export STIX-lite JSON">
                    <i class="fas fa-shield-alt"></i> STIX
                </button>
            </div>
        </div>

        <div class="bw-table-wrap">
            <table class="bw-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Indicator</th>
                        <th>Confidence</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    ${(bot.iocs||[]).map(ioc=>`
                        <tr>
                            <td><span class="bw-ioc-badge ${iocClass[ioc.type]||''}">${(ioc.type||'').toUpperCase()}</span></td>
                            <td class="mono">${ioc.value}</td>
                            <td><span class="bw-conf ${confClass[ioc.confidence]||''}">${ioc.confidence||''}</span></td>
                            <td style="font-size:0.75rem;color:rgba(255,255,255,0.32)">${ioc.note||'—'}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

/* ============================================
   IOC EXPORT
   ============================================ */
function bwExportIOC(botId, format) {
    const bot = bwBots.find(b => b.id === botId);
    if (!bot || !bot.iocs) return;

    const iocs = bot.iocs;
    const ts   = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
    const fname = `osintrix-ioc-${bot.id}-${ts}`;

    if (format === 'csv') {
        const header = 'type,value,confidence,note\n';
        const rows   = iocs.map(i => `"${i.type}","${(i.value||'').replace(/"/g,'""')}","${i.confidence}","${(i.note||'').replace(/"/g,'""')}"`).join('\n');
        bwDownload(`${fname}.csv`, header + rows, 'text/csv');
    }

    else if (format === 'json') {
        const out = {
            meta: {
                bot: bot.name,
                family: bot.family,
                classification: bot.classification,
                exported: new Date().toISOString(),
                source: 'OSINTrix Bot Wiki v' + BW_VERSION
            },
            iocs: iocs
        };
        bwDownload(`${fname}.json`, JSON.stringify(out, null, 2), 'application/json');
    }

    else if (format === 'txt') {
        const lines = [
            `# OSINTrix Bot Wiki - IOC Export`,
            `# Bot: ${bot.name} | ${bot.classification} | Risk: ${bot.riskScore}`,
            `# Exported: ${new Date().toISOString()}`,
            `# Source: OSINTrix Bot Wiki v${BW_VERSION}`,
            '',
            '# USER-AGENTS',
            ...iocs.filter(i=>i.type==='ua').map(i=>`${i.value}`),
            '',
            '# IP RANGES',
            ...iocs.filter(i=>i.type==='ip').map(i=>`${i.value}`),
            '',
            '# DOMAINS',
            ...iocs.filter(i=>i.type==='domain').map(i=>`${i.value}`),
            '',
            '# ASNs',
            ...iocs.filter(i=>i.type==='asn').map(i=>`${i.value}`),
            '',
            '# BEHAVIORAL INDICATORS',
            ...iocs.filter(i=>i.type==='behavior').map(i=>`# ${i.value}`),
        ].join('\n');
        bwDownload(`${fname}.txt`, lines, 'text/plain');
    }

    else if (format === 'stix') {
        // STIX 2.1 lite — indicator objects
        const stixBundle = {
            type: 'bundle',
            id: `bundle--${generateUUID()}`,
            spec_version: '2.1',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            objects: [
                {
                    type: 'identity',
                    id: `identity--${generateUUID()}`,
                    spec_version: '2.1',
                    name: 'OSINTrix Bot Wiki',
                    identity_class: 'organization'
                },
                {
                    type: 'malware',
                    id: `malware--${generateUUID()}`,
                    spec_version: '2.1',
                    name: bot.name,
                    malware_types: [bot.classification === 'malicious' ? 'bot' : 'tool'],
                    is_family: false,
                    description: bot.summary || '',
                    labels: [bot.classification, bot.family || 'crawler']
                },
                ...iocs
                  .filter(i => ['ua','ip','domain'].includes(i.type))
                  .map(i => ({
                    type: 'indicator',
                    id: `indicator--${generateUUID()}`,
                    spec_version: '2.1',
                    name: `${bot.name} - ${i.type.toUpperCase()} - ${i.value}`,
                    pattern_type: 'stix',
                    pattern: buildSTIXPattern(i),
                    valid_from: new Date().toISOString(),
                    confidence: i.confidence === 'high' ? 85 : i.confidence === 'medium' ? 50 : 25,
                    labels: ['malicious-activity'],
                    description: i.note || ''
                  }))
            ]
        };
        bwDownload(`${fname}-stix21.json`, JSON.stringify(stixBundle, null, 2), 'application/json');
    }

    showBwNotification(`IOC export (${format.toUpperCase()}) downloaded for ${bot.name}`, 'success');
}

function buildSTIXPattern(ioc) {
    if (ioc.type === 'ua')     return `[network-traffic:extensions.'http-request-ext'.request_header.'User-Agent' MATCHES '${ioc.value.replace(/'/g, "\\'")}']`;
    if (ioc.type === 'ip')     return `[ipv4-addr:value = '${ioc.value}']`;
    if (ioc.type === 'domain') return `[domain-name:value = '${ioc.value}']`;
    return `[artifact:mime_type = 'text/plain']`; // fallback
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function bwDownload(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ============================================
   RULE COPY
   ============================================ */
function bwCopyRule(botId, ruleKey) {
    const bot = bwBots.find(b => b.id === botId);
    if (!bot || !bot.detection || !bot.detection[ruleKey]) return;

    navigator.clipboard.writeText(bot.detection[ruleKey]).then(() => {
        const btn = document.getElementById(`bwcopy-${botId}-${ruleKey}`);
        if (btn) {
            btn.classList.add('done');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { btn.classList.remove('done'); btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2200);
        }
    }).catch(() => fbCopy(bot.detection[ruleKey]));
}

function bwCopyAllRules(botId) {
    const bot = bwBots.find(b => b.id === botId);
    if (!bot) return;
    const text = Object.entries(bot.detection || {})
        .map(([k,v]) => `${'='.repeat(48)}\n${k.toUpperCase()} RULE\n${'='.repeat(48)}\n${v}`)
        .join('\n\n');
    const full = `# OSINTrix Bot Wiki — ${bot.name} Detection Rules\n# v${BW_VERSION} | ${new Date().toISOString()}\n\n${text}`;
    navigator.clipboard.writeText(full)
        .then(() => showBwNotification(`All rules for ${bot.name} copied`, 'success'))
        .catch(() => fbCopy(full));
}

function bwToggleRule(blockId) {
    const body  = document.getElementById(`bwrule-${blockId}`);
    const chev  = document.getElementById(`bwchev-${blockId}`);
    if (!body) return;
    const open = body.classList.toggle('open');
    if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
    open ? bwOpenRules.add(blockId) : bwOpenRules.delete(blockId);
}

function fbCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
}

/* ============================================
   EXPORT FULL PROFILE AS JSON
   ============================================ */
function bwExportJSON(botId) {
    const bot = bwBots.find(b => b.id === botId);
    if (!bot) return;
    bwDownload(`osintrix-bot-${bot.id}.json`, JSON.stringify(bot, null, 2), 'application/json');
    showBwNotification(`Profile exported: ${bot.name}`, 'success');
}

/* ============================================
   TAB SWITCH
   ============================================ */
function bwSwitchTab(tab) {
    bwActiveTab = tab;
    document.querySelectorAll('#bw-detail-wrap .bw-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('#bw-detail-wrap .bw-panel').forEach(p => {
        p.classList.toggle('active', p.id === `bw-pnl-${tab}`);
    });
}

/* ============================================
   SEARCH & FILTER
   ============================================ */
function setupBwSearch() {
    const inp = document.getElementById('bw-search');
    if (inp) inp.addEventListener('input', e => { bwSearch = e.target.value.toLowerCase(); renderBotList(); });
}

function setupBwFilters() {
    document.querySelectorAll('#bot-wiki .bw-chip').forEach(c => {
        c.addEventListener('click', () => {
            document.querySelectorAll('#bot-wiki .bw-chip').forEach(x => x.classList.remove('active'));
            c.classList.add('active');
            bwFilter = c.dataset.filter;
            renderBotList();
        });
    });
}

/* ============================================
   HELPERS
   ============================================ */
function escHtml(str) {
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;');
}

function showBwNotification(msg, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':type==='warning'?'exclamation-triangle':'info-circle'}"></i> ${msg}`;
    container.appendChild(el);
    setTimeout(() => el.style.opacity = '0', 3200);
    setTimeout(() => el.remove(), 3700);
}

function bwShowMethodology(e) {
    e && e.preventDefault();
    alert(`OSINTrix Bot Wiki — Methodology & Transparency\n\nDATA SOURCES\n• Official bot operator documentation\n• Public security research and CVE databases\n• Community-contributed detection rules (YARA, Sigma)\n• Analysis of real-world access logs\n• Academic and industry papers on web crawling\n\nCLASSIFICATION\n• Legitimate — respects robots.txt, verified operator, provides value\n• Gray — legal but ethically contested, aggressive, or no direct value\n• Malicious — ignores robots.txt, harvests data without consent, or harmful\n\nRULE QUALITY\n• All rules reviewed before inclusion\n• YARA/Sigma follow community standards\n• Server configs tested against common deployments\n• Rules are starting points — always test in your environment\n\nDATASET v${BW_VERSION} — Updated ${BW_UPDATED}\nProvided as-is for informational purposes only.`);
}

/* ============================================
   BUNDLED FALLBACK DATA
   (used when bots.json cannot be fetched)
   ============================================ */
function getBundledBots() {
    return [
  {
    "id": "googlebot",
    "name": "Googlebot",
    "family": "Search Engine Crawlers",
    "author": "Google LLC",
    "classification": "legitimate",
    "riskScore": "info",
    "firstSeen": "1997-11",
    "lastSeen": "Active (ongoing)",
    "summary": "Google's primary web crawler for indexing pages in Google Search. Completely legitimate when verified via reverse DNS. Many impersonators exist — always verify before trusting. Site operators can control access via robots.txt.",
    "recommendation": {
      "action": "allow",
      "text": "Allow verified Googlebot. Verify via rDNS: IP → hostname ending in .googlebot.com or .google.com → forward DNS back to same IP. Block any Googlebot UA from non-Google IP ranges immediately."
    },
    "targets": ["All websites", "E-commerce", "News sites", "Blogs"],
    "techniques": ["HTTP crawling", "Sitemap parsing", "robots.txt compliance", "JavaScript rendering"],
    "userAgents": [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Googlebot-Image/1.0",
      "Googlebot-Video/1.0"
    ],
    "iocs": [
      { "type": "ua",       "value": "Googlebot/2.1",        "confidence": "medium", "note": "Can be spoofed — verify via rDNS" },
      { "type": "asn",      "value": "AS15169 (GOOGLE)",      "confidence": "high",   "note": "All legitimate Googlebot traffic" },
      { "type": "domain",   "value": "*.googlebot.com",       "confidence": "high",   "note": "Verified rDNS hostname" },
      { "type": "behavior", "value": "Respects robots.txt",   "confidence": "high",   "note": "Legitimate Googlebot always respects crawl directives" }
    ],
    "timeline": [
      { "date": "1997", "event": "Googlebot first deployed to index the early web for BackRub." },
      { "date": "2014", "event": "Google announces Googlebot now renders JavaScript for indexing." },
      { "date": "2019", "event": "Googlebot moves to evergreen Chromium-based rendering engine." },
      { "date": "2023", "event": "Increased frequency of smartphone Googlebot for mobile-first indexing." }
    ],
    "behaviors": [
      { "type": "normal",    "icon": "fas fa-check-circle",      "text": "Respects robots.txt and Crawl-delay directives." },
      { "type": "normal",    "icon": "fas fa-check-circle",      "text": "Performs reverse DNS verification — rDNS resolves to *.googlebot.com." },
      { "type": "suspicious","icon": "fas fa-exclamation-triangle","text": "IMPERSONATORS: Many malicious bots fake Googlebot UA. Always verify via rDNS." }
    ],
    "mitigation": [
      { "title": "Verify via Reverse DNS", "desc": "Run: host <IP>\nConfirm hostname ends in .googlebot.com or .google.com, then forward-resolve to confirm match.", "priority": "immediate" },
      { "title": "Block Impersonators", "desc": "Create server rules to block any IP claiming Googlebot UA that fails rDNS verification.", "priority": "high" },
      { "title": "Control via robots.txt", "desc": "Use Crawl-delay and Disallow directives to control crawl scope and frequency.", "priority": "medium" }
    ],
    "relatedBots": ["bingbot", "ahrefsbot"],
    "detection": {
      "signature": "User-Agent contains 'Googlebot' AND rDNS resolves to *.googlebot.com AND forward DNS matches source IP",
      "yara": "rule Googlebot_UserAgent {\n    meta:\n        description = \"Detects Googlebot user-agent\"\n        author = \"OSINTrix Bot Wiki\"\n        date = \"2025-01\"\n    strings:\n        $ua1 = \"Googlebot/2.1\" ascii nocase\n        $ua2 = \"Googlebot-Image\" ascii nocase\n    condition:\n        any of ($ua*)\n}",
      "nginx": "# Verify Googlebot — block impersonators\ngeo $is_google_ip {\n    default 0;\n    66.249.64.0/19  1;\n    66.249.80.0/20  1;\n    64.233.160.0/19 1;\n    74.125.0.0/16   1;\n    209.85.128.0/17 1;\n}\n\nmap $http_user_agent $is_googlebot_ua {\n    default         0;\n    ~*[Gg]ooglebot  1;\n}\n\nlocation / {\n    # Block if UA says Googlebot but IP is not Google\n    set $check \"\";\n    if ($is_googlebot_ua = 1) { set $check \"bot_\"; }\n    if ($is_google_ip = 0)    { set $check \"${check}noip\"; }\n    if ($check = \"bot_noip\")  { return 403; }\n}",
      "apache": "# .htaccess — Block Googlebot from non-Google IPs\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTP_USER_AGENT} [Gg]ooglebot [NC]\nRewriteCond %{REMOTE_ADDR} !^66\\.249\\.\nRewriteCond %{REMOTE_ADDR} !^64\\.233\\.\nRewriteCond %{REMOTE_ADDR} !^74\\.125\\.\nRewriteRule ^ - [F,L]\n</IfModule>",
      "cloudflare": "# Cloudflare WAF — Block Googlebot Impersonators\n# Expression:\n(http.user_agent contains \"Googlebot\" and not ip.src in {66.249.64.0/19 66.249.80.0/20 64.233.160.0/19 74.125.0.0/16 209.85.128.0/17})\n# Action: Block",
      "modsecurity": "SecRule REQUEST_HEADERS:User-Agent \"@contains Googlebot\" \\\n    \"id:9001001,phase:1,deny,status:403,\\\n    msg:'Googlebot Impersonation',tag:'BOT_IMPERSONATION',chain\"\n    SecRule REMOTE_ADDR \"!@ipMatch 66.249.64.0/19,66.249.80.0/20,64.233.160.0/19\""
    }
  },
  {
    "id": "ahrefsbot",
    "name": "AhrefsBot",
    "family": "SEO & Backlink Crawlers",
    "author": "Ahrefs Pte Ltd",
    "classification": "gray",
    "riskScore": "medium",
    "firstSeen": "2011-06",
    "lastSeen": "Active (ongoing)",
    "summary": "Commercial web crawler that builds Ahrefs' backlink database. Extremely aggressive crawl rate — often top-5 globally by volume. Provides no direct SEO benefit to crawled sites. Respects robots.txt. Many operators block it to save bandwidth, especially on shared hosting.",
    "recommendation": {
      "action": "monitor",
      "text": "Block or rate-limit if bandwidth is a concern. AhrefsBot respects robots.txt. Blocking has no SEO penalty. Consider allowing if you actively use Ahrefs products."
    },
    "targets": ["All public websites", "E-commerce", "News", "Blogs"],
    "techniques": ["High-frequency HTTP crawling", "Backlink discovery", "Content analysis"],
    "userAgents": [
      "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
      "Mozilla/5.0 (compatible; AhrefsBot/6.1; +http://ahrefs.com/robot/)"
    ],
    "iocs": [
      { "type": "ua",       "value": "AhrefsBot/7.0",                           "confidence": "high",   "note": "Current version" },
      { "type": "asn",      "value": "AS20473 (Vultr)",                          "confidence": "medium", "note": "Primary hosting ASN" },
      { "type": "behavior", "value": "Very high crawl frequency — millions req/day", "confidence": "high", "note": "Can cause measurable server load" }
    ],
    "timeline": [
      { "date": "2011", "event": "Ahrefs launches AhrefsBot to build backlink database." },
      { "date": "2014", "event": "Becomes one of top 5 most active crawlers globally." },
      { "date": "2021", "event": "AhrefsBot 7.0 launches with faster infrastructure." }
    ],
    "behaviors": [
      { "type": "neutral",   "icon": "fas fa-exclamation-circle",    "text": "Respects robots.txt Disallow and Crawl-delay." },
      { "type": "suspicious","icon": "fas fa-exclamation-triangle",   "text": "Extremely aggressive crawl rate — significant bandwidth impact on smaller hosts." },
      { "type": "normal",    "icon": "fas fa-check-circle",           "text": "Provides opt-out at ahrefs.com/robot/" }
    ],
    "mitigation": [
      { "title": "Block via robots.txt", "desc": "User-agent: AhrefsBot\nDisallow: /\n\nSimplest method. Takes effect within 24–48h.", "priority": "high" },
      { "title": "Server-level UA Block", "desc": "Block 'AhrefsBot' UA string at Nginx/Apache/Cloudflare for immediate effect.", "priority": "high" },
      { "title": "Rate Limiting", "desc": "If you want Ahrefs data but lower frequency:\nCrawl-delay: 10", "priority": "medium" }
    ],
    "relatedBots": ["semrushbot", "googlebot"],
    "detection": {
      "yara": "rule AhrefsBot_Crawler {\n    meta:\n        description = \"Detects AhrefsBot SEO crawler\"\n        author = \"OSINTrix Bot Wiki\"\n        classification = \"gray\"\n    strings:\n        $ua1 = \"AhrefsBot\" ascii nocase\n        $ua2 = \"ahrefs.com/robot\" ascii nocase\n    condition:\n        any of ($ua*)\n}",
      "nginx": "# Block AhrefsBot\nmap $http_user_agent $block_ahrefs {\n    default     0;\n    ~*AhrefsBot 1;\n}\n\nserver {\n    if ($block_ahrefs) { return 403; }\n}",
      "apache": "# .htaccess — Block AhrefsBot\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTP_USER_AGENT} AhrefsBot [NC]\nRewriteRule .* - [F,L]\n</IfModule>",
      "cloudflare": "# Cloudflare WAF — Block AhrefsBot\n# Expression:\n(http.user_agent contains \"AhrefsBot\")\n# Action: Block or Challenge",
      "modsecurity": "SecRule REQUEST_HEADERS:User-Agent \"@contains AhrefsBot\" \\\n    \"id:9002001,phase:1,deny,status:403,\\\n    msg:'AhrefsBot SEO Crawler Blocked',tag:'SEO_CRAWLER'\""
    }
  },
  {
    "id": "scrapy",
    "name": "Scrapy Generic Scraper",
    "family": "Web Scraping Frameworks",
    "author": "Unknown / Various",
    "classification": "malicious",
    "riskScore": "high",
    "firstSeen": "2013-01",
    "lastSeen": "Active (ongoing)",
    "summary": "Scrapy is a legitimate open-source Python framework, but unidentified generic Scrapy bots in logs typically indicate unauthorized scraping — harvesting prices, emails, listings, or copyrighted content. Default Scrapy UA in access logs is almost always unauthorized. Operators using Scrapy legitimately customize their user-agent.",
    "recommendation": {
      "action": "block",
      "text": "Block the default Scrapy UA immediately. Implement rate limiting and honeypot traps as secondary defenses. Header anomaly detection catches rotating scrapers."
    },
    "targets": ["E-commerce (price scraping)", "Job boards", "Real estate", "Legal databases", "Any structured data"],
    "techniques": ["High-concurrency requests", "robots.txt violation", "IP rotation", "Sequential URL enumeration"],
    "userAgents": [
      "Scrapy/2.11.2 (+https://scrapy.org)",
      "Scrapy/2.0",
      "Python-urllib/3.x",
      "python-requests/2.x"
    ],
    "iocs": [
      { "type": "ua",       "value": "Scrapy/",                                    "confidence": "high",   "note": "Default Scrapy UA — almost always unauthorized" },
      { "type": "ua",       "value": "Python-urllib/",                             "confidence": "medium", "note": "Common after UA rotation" },
      { "type": "behavior", "value": "High request rate to structured data pages", "confidence": "high",   "note": "Price lists, search results, product IDs" },
      { "type": "behavior", "value": "Sequential URL patterns (?page=1, ?page=2)", "confidence": "high",   "note": "Classic pagination crawl" },
      { "type": "behavior", "value": "Missing Accept-Language and Sec-Fetch headers","confidence": "medium","note": "Script-based scrapers rarely include these" }
    ],
    "timeline": [
      { "date": "2013", "event": "Scrapy open-sourced; immediately adopted for unauthorized scraping." },
      { "date": "2016", "event": "Rise of scraping-as-a-service platforms built on Scrapy." },
      { "date": "2021", "event": "Residential proxy services enable Scrapy deployments evading IP blocks." },
      { "date": "2024", "event": "AI training data harvesting via Scrapy surges significantly." }
    ],
    "behaviors": [
      { "type": "suspicious","icon": "fas fa-exclamation-triangle","text": "Often ignores robots.txt — check logs for crawl of Disallowed paths." },
      { "type": "suspicious","icon": "fas fa-exclamation-triangle","text": "High concurrency — dozens of simultaneous requests causing load spikes." },
      { "type": "suspicious","icon": "fas fa-exclamation-triangle","text": "Systematic URL enumeration — crawls paginated results or sequential product IDs." },
      { "type": "neutral",   "icon": "fas fa-exclamation-circle","text": "Scrapy itself is a legitimate tool — block the behavior and default UA." }
    ],
    "mitigation": [
      { "title": "Block Default Scrapy UA", "desc": "Block any request with 'Scrapy' in User-Agent immediately. Legitimate users always set custom UAs.", "priority": "immediate" },
      { "title": "Rate Limiting", "desc": "Limit to 60 req/min per IP. Return 429 Too Many Requests. Use Nginx limit_req or Cloudflare Rate Limiting.", "priority": "immediate" },
      { "title": "Honeypot Links", "desc": "Add hidden links (display:none) to pages. Any bot following them is definitively a scraper. Auto-ban IP.", "priority": "high" },
      { "title": "Header Anomaly Detection", "desc": "Block requests missing Accept-Language or Sec-Fetch-Site. Script scrapers rarely include these correctly.", "priority": "high" },
      { "title": "CAPTCHA on High-Value Pages", "desc": "Deploy Cloudflare Turnstile or hCaptcha on pricing pages and data-rich search results.", "priority": "medium" }
    ],
    "relatedBots": ["googlebot", "ahrefsbot"],
    "detection": {
      "signature": "User-Agent contains 'Scrapy' OR missing Accept-Language AND high request rate from single IP",
      "yara": "rule Scrapy_Scraper {\n    meta:\n        description = \"Detects Scrapy-based scraper by default UA\"\n        author = \"OSINTrix Bot Wiki\"\n        classification = \"malicious\"\n    strings:\n        $ua1 = \"Scrapy/\" ascii nocase\n        $ua2 = \"scrapy.org\" ascii nocase\n    condition:\n        any of ($ua*)\n}",
      "sigma": "title: Scrapy Web Scraper Activity\nstatus: stable\ndescription: Detects Scrapy framework usage indicating potential unauthorized scraping\nlogsource:\n  category: webserver\ndetection:\n  selection:\n    cs-user-agent|contains: 'Scrapy/'\n  condition: selection\nlevel: high\ntags:\n  - attack.collection\n  - attack.t1119",
      "nginx": "# Block Scrapy scrapers\nmap $http_user_agent $block_scraper {\n    default         0;\n    ~*[Ss]crapy     1;\n    ~*Python-urllib 1;\n}\n\nlimit_req_zone $binary_remote_addr zone=scraper_limit:10m rate=30r/m;\n\nserver {\n    if ($block_scraper) { return 403; }\n    location /products/ {\n        limit_req zone=scraper_limit burst=5 nodelay;\n    }\n}",
      "apache": "# .htaccess — Block Scrapy\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTP_USER_AGENT} Scrapy [NC]\nRewriteRule .* - [F,L]\nRewriteCond %{HTTP_USER_AGENT} Python-urllib [NC]\nRewriteRule .* - [F,L]\n</IfModule>",
      "cloudflare": "# Cloudflare WAF — Block Scrapy\n# Expression:\n(http.user_agent contains \"Scrapy\")\n# Action: Block\n\n# Also add Rate Limiting rule:\n# Path: /products/* or /search\n# Threshold: 60 req/min\n# Action: Block",
      "modsecurity": "SecRule REQUEST_HEADERS:User-Agent \"@rx [Ss]crapy\" \\\n    \"id:9003001,phase:1,deny,status:403,\\\n    msg:'Scrapy Scraper Detected',tag:'BOT_MALICIOUS',severity:'HIGH'\"\n\n# Header anomaly — missing Accept-Language\nSecRule &REQUEST_HEADERS:Accept-Language \"@eq 0\" \\\n    \"id:9003002,phase:1,pass,setvar:tx.bot_score=+2\"\n\nSecRule TX:BOT_SCORE \"@gt 3\" \\\n    \"id:9003003,phase:1,deny,status:403,msg:'Bot Anomaly Detected'\""
    }
  },
  {
    "id": "bingbot",
    "name": "Bingbot",
    "family": "Search Engine Crawlers",
    "author": "Microsoft Corporation",
    "classification": "legitimate",
    "riskScore": "info",
    "firstSeen": "2010-05",
    "lastSeen": "Active (ongoing)",
    "summary": "Microsoft's web crawler for Bing search. Like Googlebot, it should be verified via reverse DNS before being trusted. Verified Bingbot is completely benign. Blocking it removes your site from Bing search results.",
    "recommendation": {
      "action": "allow",
      "text": "Allow verified Bingbot. Verify: IP should rDNS to *.search.msn.com, forward-resolve to same IP. Block any Bingbot UA from non-Microsoft IP ranges."
    },
    "targets": ["All public websites", "News sites", "E-commerce"],
    "techniques": ["HTTP crawling", "Sitemap parsing", "JavaScript rendering"],
    "userAgents": [
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
    ],
    "iocs": [
      { "type": "ua",     "value": "bingbot/2.0",       "confidence": "medium", "note": "Always verify via rDNS" },
      { "type": "domain", "value": "*.search.msn.com",  "confidence": "high",   "note": "Verified rDNS hostname" },
      { "type": "asn",    "value": "AS8075 (Microsoft)", "confidence": "high",   "note": "Primary Microsoft ASN" }
    ],
    "timeline": [
      { "date": "2009", "event": "MSNBot succeeded by Bingbot as Microsoft launches Bing." },
      { "date": "2020", "event": "Bingbot gains JavaScript rendering capabilities." },
      { "date": "2023", "event": "Activity increases following Microsoft OpenAI/Bing integration." }
    ],
    "behaviors": [
      { "type": "normal",    "icon": "fas fa-check-circle",       "text": "Respects robots.txt including Crawl-delay." },
      { "type": "normal",    "icon": "fas fa-check-circle",       "text": "rDNS verifiable — resolves to *.search.msn.com." },
      { "type": "suspicious","icon": "fas fa-exclamation-triangle","text": "Bingbot impersonation is common — always verify." }
    ],
    "mitigation": [
      { "title": "Verify via Reverse DNS", "desc": "host <IP> → must resolve to *.search.msn.com → forward resolve back to same IP.", "priority": "immediate" },
      { "title": "Block Impersonators", "desc": "Block Bingbot UA from non-Microsoft ASN (AS8075, AS8068). Impersonators use Bingbot UA to appear legitimate.", "priority": "high" },
      { "title": "Use Bing Webmaster Tools", "desc": "Monitor crawl stats and adjust crawl rate at webmaster.bing.com.", "priority": "medium" }
    ],
    "relatedBots": ["googlebot", "ahrefsbot"],
    "detection": {
      "nginx": "# Verify Bingbot — block impersonators\ngeo $is_msft_ip {\n    default 0;\n    40.77.167.0/24  1;\n    207.46.0.0/16   1;\n    157.54.0.0/15   1;\n    65.52.0.0/14    1;\n}\n\nmap $http_user_agent $is_bingbot {\n    default 0;\n    ~*bingbot 1;\n}\n\nlocation / {\n    set $bcheck \"\";\n    if ($is_bingbot = 1)  { set $bcheck \"bot_\"; }\n    if ($is_msft_ip = 0)  { set $bcheck \"${bcheck}noip\"; }\n    if ($bcheck = \"bot_noip\") { return 403; }\n}",
      "apache": "# .htaccess — Block Bingbot from non-Microsoft IPs\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTP_USER_AGENT} bingbot [NC]\nRewriteCond %{REMOTE_ADDR} !^40\\.77\\.167\\.\nRewriteCond %{REMOTE_ADDR} !^207\\.46\\.\nRewriteRule ^ - [F,L]\n</IfModule>",
      "cloudflare": "# Cloudflare WAF — Block Bingbot Impersonators\n# Expression:\n(http.user_agent contains \"bingbot\" and not ip.src in {40.77.167.0/24 207.46.0.0/16 157.54.0.0/15 65.52.0.0/14})\n# Action: Block"
    }
  },
  {
    "id": "gptbot",
    "name": "GPTBot / ChatGPT-User",
    "family": "AI Training & Content Crawlers",
    "author": "OpenAI",
    "classification": "gray",
    "riskScore": "medium",
    "firstSeen": "2023-08",
    "lastSeen": "Active (ongoing)",
    "summary": "OpenAI operates two distinct crawlers: GPTBot harvests content for AI model training, and ChatGPT-User fetches real-time content for ChatGPT's browsing. GPTBot is controversial — it uses published content for commercial AI training without compensation. Many publishers now block it by default. Both respect robots.txt.",
    "recommendation": {
      "action": "monitor",
      "text": "Block GPTBot if you don't want your content used for AI training (no SEO penalty). Allow ChatGPT-User if you want ChatGPT to cite and link to your content. Both respect robots.txt opt-out."
    },
    "targets": ["News sites", "Blogs", "Academic content", "Creative writing", "Code repositories"],
    "techniques": ["Content harvesting for LLM training", "Real-time content fetching"],
    "userAgents": [
      "GPTBot/1.0 (+https://openai.com/gptbot)",
      "ChatGPT-User/1.0 (+https://openai.com/bot)"
    ],
    "iocs": [
      { "type": "ua",       "value": "GPTBot/1.0",                                 "confidence": "high",   "note": "AI training data crawler" },
      { "type": "ua",       "value": "ChatGPT-User/1.0",                           "confidence": "high",   "note": "Real-time browsing bot" },
      { "type": "behavior", "value": "Focuses on text-rich pages (articles, docs)", "confidence": "high",   "note": "" }
    ],
    "timeline": [
      { "date": "2023-08", "event": "OpenAI announces GPTBot with robots.txt opt-out." },
      { "date": "2023-09", "event": "Major publishers (NYT, CNN) begin blocking GPTBot." },
      { "date": "2024-02", "event": "OpenAI lawsuit with NYT reveals scale of content harvesting." },
      { "date": "2024-06", "event": "Reddit, Wikipedia restrict AI crawlers amid licensing disputes." }
    ],
    "behaviors": [
      { "type": "neutral",   "icon": "fas fa-exclamation-circle","text": "Respects robots.txt — add 'User-agent: GPTBot / Disallow: /' to opt out." },
      { "type": "suspicious","icon": "fas fa-exclamation-triangle","text": "Content used for commercial AI training without compensation or consent." },
      { "type": "normal",    "icon": "fas fa-check-circle",       "text": "Does not exploit vulnerabilities or exfiltrate user PII." }
    ],
    "mitigation": [
      { "title": "Block GPTBot via robots.txt", "desc": "User-agent: GPTBot\nDisallow: /\n\nOfficial opt-out. Takes effect within days.", "priority": "high" },
      { "title": "Differentiate Crawlers", "desc": "Block GPTBot (training) but allow ChatGPT-User (citations/traffic). Use separate robots.txt rules.", "priority": "high" },
      { "title": "Server-Level Block", "desc": "Block 'GPTBot' UA at Nginx/Apache/Cloudflare for immediate effect.", "priority": "medium" }
    ],
    "relatedBots": ["googlebot", "ahrefsbot"],
    "detection": {
      "yara": "rule OpenAI_Crawlers {\n    meta:\n        description = \"Detects OpenAI crawlers (GPTBot, ChatGPT-User)\"\n        author = \"OSINTrix Bot Wiki\"\n        classification = \"gray\"\n    strings:\n        $ua1 = \"GPTBot\" ascii nocase\n        $ua2 = \"ChatGPT-User\" ascii nocase\n    condition:\n        any of ($ua*)\n}",
      "nginx": "# Block GPTBot AI training crawler\nmap $http_user_agent $block_gptbot {\n    default 0;\n    ~*GPTBot 1;\n}\n\nserver {\n    if ($block_gptbot) { return 403; }\n    # ChatGPT-User allowed by default (drives referral traffic)\n}",
      "apache": "# .htaccess — Block GPTBot\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTP_USER_AGENT} GPTBot [NC]\nRewriteRule .* - [F,L]\n</IfModule>",
      "cloudflare": "# Cloudflare WAF — Block GPTBot\n# Expression:\n(http.user_agent contains \"GPTBot\")\n# Action: Block\n\n# Note: Cloudflare Security > Bots has\n# 'AI Scrapers and Crawlers' toggle in newer plans",
      "modsecurity": "SecRule REQUEST_HEADERS:User-Agent \"@rx (GPTBot|ChatGPT-User)\" \\\n    \"id:9005001,phase:1,deny,status:403,\\\n    msg:'OpenAI AI Training Crawler Blocked',tag:'BOT_AI_CRAWLER'\""
    }
  }
];
}

/* ============================================
   AUTO-INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bot-wiki')) {
        initBotWiki();
    }
});

console.log(`✓ OSINTrix Bot Wiki v${BW_VERSION} ready`);