// Enhanced Threat Actor Database with comprehensive profiles
const threatActors = [
    {
        id: 1,
        name: "APT1 (Comment Crew)",
        aliases: ["PLA Unit 61398", "Comment Group", "Shanghai Group"],
        category: "nation-state",
        threatLevel: "high",
        region: "china",
        country: "🇨🇳",
        description: "Chinese cyber espionage group operating from Shanghai, known for large-scale intellectual property theft and persistent access to victim networks. This sophisticated unit has been linked to the People's Liberation Army and has conducted extensive campaigns against Western targets for over a decade.",
        firstSeen: "2006",
        lastActivity: "2023-11-15",
        recentActivity: "Targeting renewable energy companies with advanced spear-phishing campaigns",
        targets: ["Government", "Defense Contractors", "Technology Companies", "Financial Services", "Energy Sector"],
        techniques: ["Spear Phishing", "Remote Access Tools", "Data Exfiltration", "Credential Harvesting", "Lateral Movement"],
        attribution: "PLA Unit 61398 (Shanghai)",
        confidence: 95,
        campaigns: ["Operation Aurora", "Comment Group Campaign", "Renewable Energy Espionage"],
        iocs: ["85.25.120.45", "apt1-malware.exe", "comment-crew.com", "shanghai-backdoor.dll"],
        mitreId: "G0006",
        tools: ["WEBC2", "BACKDOOR.APT1", "TROJAN.ECLTYS", "BISCUIT"],
        motivations: ["Espionage", "Intellectual Property Theft", "Economic Advantage"],
        sophistication: "Advanced",
        infrastructure: ["Compromised websites", "Bulletproof hosting", "Domain fronting"],
        connections: ["APT40", "APT41"],
        operatingHours: "Beijing Business Hours (UTC+8)",
        languages: ["Chinese (Simplified)", "English"],
        victimCount: "141+ confirmed organizations",
        dataStolen: "Terabytes of intellectual property",
        avatar: "A1"
    },
    {
        id: 2,
        name: "Lazarus Group",
        aliases: ["Hidden Cobra", "Guardians of Peace", "Whois Team", "APT38"],
        category: "nation-state",
        threatLevel: "critical",
        region: "north-korea",
        country: "🇰🇵",
        description: "North Korean state-sponsored group responsible for major cyber attacks including Sony Pictures breach and cryptocurrency thefts worth billions. Operating under the Reconnaissance General Bureau, this group combines destructive attacks with financial crimes to support the North Korean regime.",
        firstSeen: "2009",
        lastActivity: "2024-01-08",
        recentActivity: "Cryptocurrency exchange targeting with sophisticated social engineering",
        targets: ["Financial Institutions", "Cryptocurrency Exchanges", "Entertainment", "Government", "Defense"],
        techniques: ["Destructive Malware", "Financial Theft", "Supply Chain Attacks", "Social Engineering", "Zero-day Exploits"],
        attribution: "RGB (Reconnaissance General Bureau)",
        confidence: 98,
        campaigns: ["Sony Pictures Attack", "WannaCry", "SWIFT Banking Attacks", "Cryptocurrency Heists"],
        iocs: ["192.168.1.100", "lazarus-tool.dll", "fake-adobe.com", "wannacry.exe"],
        mitreId: "G0032",
        tools: ["WannaCry", "BADCALL", "RATANKBA", "HOPLIGHT"],
        motivations: ["Financial Gain", "Espionage", "Disruption", "Sanctions Evasion"],
        sophistication: "Advanced",
        infrastructure: ["Compromised infrastructure", "Proxy networks", "Cryptocurrency mixers"],
        connections: ["APT38", "Andariel", "BlueNoroff"],
        operatingHours: "Pyongyang Time (UTC+9)",
        languages: ["Korean", "English", "Chinese"],
        victimCount: "Hundreds of organizations globally",
        dataStolen: "$1.7+ billion in cryptocurrency",
        avatar: "LZ"
    },
    {
        id: 3,
        name: "Fancy Bear",
        aliases: ["APT28", "Pawn Storm", "Sofacy", "Sednit", "Strontium"],
        category: "nation-state",
        threatLevel: "critical",
        region: "russia",
        country: "🇷🇺",
        description: "Russian military intelligence group known for election interference, espionage operations, and sophisticated cyber campaigns against Western targets. Operating under GRU Unit 26165, this group has been involved in some of the most high-profile cyber operations of the past decade.",
        firstSeen: "2007",
        lastActivity: "2024-01-12",
        recentActivity: "Targeting Ukrainian infrastructure with advanced persistent threats",
        targets: ["Government", "Military", "Political Organizations", "Media", "Think Tanks"],
        techniques: ["Zero-day Exploits", "Credential Harvesting", "Disinformation", "Spear Phishing", "Living off the Land"],
        attribution: "GRU Unit 26165",
        confidence: 96,
        campaigns: ["DNC Hack", "Olympic Games Disruption", "WADA Attacks", "Ukraine Targeting"],
        iocs: ["185.86.148.227", "fancy-bear.exe", "dcleaks.com", "x-agent.dll"],
        mitreId: "G0007",
        tools: ["X-Agent", "Sofacy", "Zebrocy", "Cannon"],
        motivations: ["Espionage", "Political Influence", "Disinformation"],
        sophistication: "Advanced",
        infrastructure: ["Dedicated servers", "Domain generation algorithms", "Compromised websites"],
        connections: ["Cozy Bear", "Sandworm", "Turla"],
        operatingHours: "Moscow Business Hours (UTC+3)",
        languages: ["Russian", "English"],
        victimCount: "Thousands of targets globally",
        dataStolen: "Classified government documents, emails",
        avatar: "FB"
    },
    {
        id: 4,
        name: "Cozy Bear",
        aliases: ["APT29", "The Dukes", "Yttrium", "Nobelium", "Midnight Blizzard"],
        category: "nation-state",
        threatLevel: "critical",
        region: "russia",
        country: "🇷🇺",
        description: "Russian intelligence service group focusing on foreign intelligence collection and long-term espionage operations with sophisticated tradecraft. Attributed to the SVR, this group is known for its stealth, persistence, and advanced techniques that often go undetected for extended periods.",
        firstSeen: "2008",
        lastActivity: "2024-01-10",
        recentActivity: "Cloud infrastructure targeting with supply chain compromises",
        targets: ["Government", "Healthcare", "Research Institutions", "Technology Companies", "NGOs"],
        techniques: ["Living off the Land", "Cloud Exploitation", "Supply Chain Attacks", "Steganography", "Advanced Persistence"],
        attribution: "SVR (Foreign Intelligence Service)",
        confidence: 94,
        campaigns: ["SolarWinds Hack", "COVID-19 Vaccine Research Theft", "Microsoft Exchange Exploitation"],
        iocs: ["13.107.42.14", "cozy-bear.dll", "solarwinds-update.com", "sunburst.dll"],
        mitreId: "G0016",
        tools: ["SolarWinds Orion", "Cobalt Strike", "PowerShell Empire", "WellMess"],
        motivations: ["Espionage", "Intelligence Collection", "Strategic Advantage"],
        sophistication: "Advanced",
        infrastructure: ["Cloud services", "Legitimate software supply chains", "Compromised certificates"],
        connections: ["Fancy Bear", "Turla", "Sandworm"],
        operatingHours: "Moscow Business Hours (UTC+3)",
        languages: ["Russian", "English"],
        victimCount: "18,000+ SolarWinds customers affected",
        dataStolen: "Government secrets, vaccine research",
        avatar: "CB"
    },
    {
        id: 5,
        name: "Carbanak",
        aliases: ["FIN7", "Anunak", "Cobalt Group"],
        category: "cybercriminal",
        threatLevel: "high",
        region: "unknown",
        country: "🏴‍☠️",
        description: "Financially motivated cybercriminal group responsible for stealing over $1 billion from financial institutions and retail companies worldwide. This international criminal organization has perfected the art of financial cybercrime through sophisticated ATM and point-of-sale attacks.",
        firstSeen: "2013",
        lastActivity: "2023-12-20",
        recentActivity: "Point-of-sale system targeting in hospitality sector",
        targets: ["Banking", "Hospitality", "Retail", "Restaurant Chains", "Payment Processors"],
        techniques: ["ATM Malware", "Point-of-Sale Attacks", "Backdoors", "Social Engineering", "Fileless Malware"],
        attribution: "International Criminal Organization",
        confidence: 85,
        campaigns: ["Carbanak Campaign", "FIN7 Restaurant Attacks", "Cobalt Strikes"],
        iocs: ["carbanak.exe", "192.168.50.10", "fin7-loader.dll", "cobalt-beacon.exe"],
        mitreId: "G0046",
        tools: ["Carbanak Backdoor", "Cobalt Strike", "PowerShell Empire", "Mimikatz"],
        motivations: ["Financial Gain", "Profit"],
        sophistication: "Advanced",
        infrastructure: ["Bulletproof hosting", "Money mule networks", "Cryptocurrency exchanges"],
        connections: ["FIN7", "Cobalt Group"],
        operatingHours: "Various time zones",
        languages: ["Russian", "English", "Spanish"],
        victimCount: "1,000+ financial institutions",
        dataStolen: "$1+ billion stolen",
        avatar: "CR"
    },
    {
        id: 6,
        name: "DarkHalo",
        aliases: ["UNC2452", "NOBELIUM", "SolarStorm"],
        category: "nation-state",
        threatLevel: "critical",
        region: "russia",
        country: "🇷🇺",
        description: "Sophisticated Russian group behind the SolarWinds supply chain attack, demonstrating advanced capabilities in software supply chain compromise. This group represents the pinnacle of supply chain attack sophistication, affecting thousands of organizations through a single compromise.",
        firstSeen: "2019",
        lastActivity: "2024-01-05",
        recentActivity: "Cloud service provider targeting with advanced techniques",
        targets: ["Government", "Technology Companies", "NGOs", "Think Tanks", "Consulting Firms"],
        techniques: ["Supply Chain Compromise", "Golden SAML", "Cloud Infrastructure Abuse", "Living off the Land"],
        attribution: "SVR",
        confidence: 92,
        campaigns: ["SolarWinds Supply Chain Attack", "Microsoft Exchange Exploitation", "Cloud Service Targeting"],
        iocs: ["avsvmcloud.com", "sunburst.dll", "teardrop.exe", "raindrop.exe"],
        mitreId: "G0118",
        tools: ["SunBurst", "TearDrop", "RainDrop", "GoldMax"],
        motivations: ["Espionage", "Intelligence Collection"],
        sophistication: "Advanced",
        infrastructure: ["Compromised software updates", "Cloud infrastructure", "Legitimate certificates"],
        connections: ["Cozy Bear", "APT29"],
        operatingHours: "Moscow Business Hours (UTC+3)",
        languages: ["Russian", "English"],
        victimCount: "18,000+ organizations affected",
        dataStolen: "Government communications, source code",
        avatar: "DH"
    },
    {
        id: 7,
        name: "Mustang Panda",
        aliases: ["TA416", "RedDelta", "PKPLUG", "Bronze President"],
        category: "apt",
        threatLevel: "high",
        region: "china",
        country: "🇨🇳",
        description: "Chinese espionage group targeting government and religious organizations worldwide, particularly focused on Southeast Asian and European targets. This group has shown particular interest in monitoring religious minorities and political dissidents.",
        firstSeen: "2017",
        lastActivity: "2024-01-03",
        recentActivity: "European government targeting with PlugX variants",
        targets: ["Government", "Religious Organizations", "NGOs", "Political Dissidents", "Academic Institutions"],
        techniques: ["PlugX RAT", "Document Exploits", "USB Propagation", "Watering Hole Attacks", "Social Engineering"],
        attribution: "PLA Unit 69010",
        confidence: 88,
        campaigns: ["Vatican Attacks", "Myanmar Government Targeting", "European Embassy Campaigns"],
        iocs: ["plugx.dll", "mustang-panda.com", "royal.dll", "korplug.exe"],
        mitreId: "G0129",
        tools: ["PlugX", "Korplug", "Poison Ivy", "Cobalt Strike"],
        motivations: ["Espionage", "Political Intelligence", "Religious Monitoring"],
        sophistication: "Intermediate to Advanced",
        infrastructure: ["Compromised websites", "Dynamic DNS", "Cloud storage services"],
        connections: ["APT1", "APT40"],
        operatingHours: "Beijing Business Hours (UTC+8)",
        languages: ["Chinese (Simplified)", "English"],
        victimCount: "200+ organizations globally",
        dataStolen: "Government documents, religious communications",
        avatar: "MP"
    },
    {
        id: 8,
        name: "REvil",
        aliases: ["Sodinokibi", "Ransomware-as-a-Service", "GandCrab"],
        category: "ransomware",
        threatLevel: "critical",
        region: "russia",
        country: "🇷🇺",
        description: "Notorious ransomware group responsible for high-profile attacks including Kaseya and JBS, operating a sophisticated ransomware-as-a-service model. This group revolutionized the ransomware landscape with their affiliate program and double extortion tactics.",
        firstSeen: "2019",
        lastActivity: "2022-10-15",
        recentActivity: "Infrastructure dismantled by law enforcement",
        targets: ["MSPs", "Critical Infrastructure", "Large Enterprises", "Healthcare", "Government"],
        techniques: ["Double Extortion", "Supply Chain Attacks", "RaaS Model", "Data Exfiltration", "Affiliate Networks"],
        attribution: "Russian Criminal Group",
        confidence: 90,
        campaigns: ["Kaseya Supply Chain Attack", "JBS Meatpacking Attack", "Travelex Ransomware"],
        iocs: ["revil.exe", "sodinokibi.dll", "darkweb-payment.onion", "gandcrab.exe"],
        mitreId: "G0135",
        tools: ["REvil Ransomware", "Cobalt Strike", "PowerShell", "PsExec"],
        motivations: ["Financial Gain", "Profit Maximization"],
        sophistication: "Advanced",
        infrastructure: ["Dark web marketplaces", "Cryptocurrency exchanges", "Affiliate networks"],
        connections: ["GandCrab", "DarkSide", "BlackMatter"],
        operatingHours: "24/7 Operations",
        languages: ["Russian", "English"],
        victimCount: "Thousands of organizations",
        dataStolen: "$200+ million in ransom payments",
        avatar: "RV"
    },
    {
        id: 9,
        name: "Sandworm",
        aliases: ["APT44", "Voodoo Bear", "IRIDIUM", "Telebots"],
        category: "nation-state",
        threatLevel: "critical",
        region: "russia",
        country: "🇷🇺",
        description: "Russian military unit responsible for destructive cyber attacks on critical infrastructure, including power grids and industrial systems. This group represents the most destructive capabilities in state-sponsored cyber warfare, targeting critical infrastructure to cause physical damage.",
        firstSeen: "2009",
        lastActivity: "2024-01-14",
        recentActivity: "Ukrainian power grid attacks with industrial control system targeting",
        targets: ["Critical Infrastructure", "Power Grids", "Government", "Military", "Industrial Systems"],
        techniques: ["Industrial Control Systems", "Destructive Malware", "Wiper Attacks", "Supply Chain Attacks"],
        attribution: "GRU Unit 74455",
        confidence: 97,
        campaigns: ["Ukraine Power Grid Attacks", "NotPetya", "Olympic Destroyer", "VPNFilter"],
        iocs: ["blackenergy.exe", "killdisk.exe", "notpetya.exe", "vpnfilter.bin"],
        mitreId: "G0034",
        tools: ["BlackEnergy", "KillDisk", "NotPetya", "Olympic Destroyer"],
        motivations: ["Disruption", "Warfare", "Political Pressure"],
        sophistication: "Advanced",
        infrastructure: ["Compromised routers", "Industrial networks", "SCADA systems"],
        connections: ["Fancy Bear", "Cozy Bear"],
        operatingHours: "Moscow Business Hours (UTC+3)",
        languages: ["Russian", "Ukrainian"],
        victimCount: "Critical infrastructure globally",
        dataStolen: "Industrial control data, power grid information",
        avatar: "SW"
    },
    {
        id: 10,
        name: "Equation Group",
        aliases: ["APT-C-05", "Tilded Team", "EQGRP"],
        category: "nation-state",
        threatLevel: "critical",
        region: "usa",
        country: "🇺🇸",
        description: "Highly sophisticated group with advanced capabilities, believed to be associated with NSA's Tailored Access Operations unit. This group represents the most advanced cyber capabilities ever observed, with techniques that were years ahead of their time.",
        firstSeen: "2001",
        lastActivity: "2023-09-22",
        recentActivity: "Advanced persistent threats with firmware-level implants",
        targets: ["Government", "Telecommunications", "Military", "Aerospace", "Energy"],
        techniques: ["Firmware Implants", "Zero-day Exploits", "Advanced Persistence", "Hardware Manipulation"],
        attribution: "NSA Tailored Access Operations",
        confidence: 85,
        campaigns: ["Stuxnet", "Flame", "Equation Platform", "Shadow Brokers Leak"],
        iocs: ["equation-implant.sys", "doublefantasy.dll", "grayfish.exe", "fanny.exe"],
        mitreId: "G0020",
        tools: ["EquationDrug", "DoublePulsar", "EternalBlue", "GrayFish"],
        motivations: ["Intelligence Collection", "National Security"],
        sophistication: "Nation-State Level",
        infrastructure: ["Satellite communications", "Firmware implants", "Hardware backdoors"],
        connections: ["Shadow Brokers"],
        operatingHours: "US Business Hours (UTC-5 to UTC-8)",
        languages: ["English"],
        victimCount: "Classified",
        dataStolen: "Classified intelligence",
        avatar: "EQ"
    }
];

// Current filters and state
let currentFilters = {
    category: 'all',
    region: 'all',
    threatLevel: 'all',
    search: ''
};

let filteredActors = [...threatActors];
let currentActorId = null;

// Navigation Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links - find the nav item that corresponds to this section
    document.querySelectorAll('.nav-item').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find the correct nav item by looking for the one with the matching onclick attribute
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(navItem => {
        const onclickAttr = navItem.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`showSection('${sectionName}')`)) {
            navItem.classList.add('active');
        }
    });
    
    // Load section-specific content
    if (sectionName === 'actors') {
        loadActorsSection();
    } else if (sectionName === 'dashboard') {
        loadDashboard();
    }
}

function showActorProfile(actorId) {
    const actor = threatActors.find(a => a.id === actorId);
    if (!actor) return;
    
    currentActorId = actorId;
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show actor profile section
    const profileSection = document.getElementById('actor-profile');
    if (profileSection) {
        profileSection.classList.add('active');
    }
    
    // Update nav (remove active from all)
    document.querySelectorAll('.nav-item').forEach(link => {
        link.classList.remove('active');
    });
    
    // Render actor profile
    renderActorProfile(actor);
}

function goBackToActors() {
    showSection('actors');
}

// Dashboard Functions
function loadDashboard() {
    loadRecentActivity();
    loadTopThreats();
}

function loadRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    const activities = [
        {
            type: 'alert',
            title: 'Critical Threat Detected',
            description: 'Lazarus Group launching new cryptocurrency exchange attacks with advanced social engineering techniques',
            time: '2 hours ago'
        },
        {
            type: 'updated',
            title: 'Intelligence Update',
            description: 'Fancy Bear profile updated with new IOCs and attack vectors targeting Ukrainian infrastructure',
            time: '4 hours ago'
        },
        {
            type: 'new',
            title: 'New Actor Identified',
            description: 'Kimsuky - North Korean APT group targeting South Korean government entities',
            time: '6 hours ago'
        },
        {
            type: 'alert',
            title: 'Infrastructure Alert',
            description: 'Sandworm targeting European power grid systems with destructive malware variants',
            time: '8 hours ago'
        },
        {
            type: 'updated',
            title: 'Campaign Analysis',
            description: 'Cozy Bear supply chain attacks show increased sophistication in cloud environments',
            time: '12 hours ago'
        }
    ];
    
    activityContainer.innerHTML = activities.map(activity => `
        <div class="activity-item fade-in">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.type === 'alert' ? 'exclamation-triangle' : 
                                   activity.type === 'updated' ? 'sync-alt' : 'plus'}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function loadTopThreats() {
    const threatsContainer = document.getElementById('topThreats');
    if (!threatsContainer) return;
    
    const topThreats = threatActors
        .filter(actor => actor.threatLevel === 'critical')
        .slice(0, 6);
    
    threatsContainer.innerHTML = topThreats.map(actor => `
        <div class="threat-item fade-in" onclick="showActorProfile(${actor.id})">
            <div class="threat-avatar">${actor.avatar}</div>
            <div class="threat-info">
                <div class="threat-name">${actor.name}</div>
                <div class="threat-category">${actor.category.toUpperCase()} • ${actor.region.toUpperCase()}</div>
            </div>
            <div class="threat-level-badge ${actor.threatLevel}">${actor.threatLevel}</div>
        </div>
    `).join('');
}

// Actor Functions
function loadActorsSection() {
    applyFilters();
}

function filterActors() {
    currentFilters.category = document.getElementById('categoryFilter').value;
    currentFilters.region = document.getElementById('regionFilter').value;
    currentFilters.threatLevel = document.getElementById('threatLevelFilter').value;
    applyFilters();
}

function applyFilters() {
    filteredActors = threatActors.filter(actor => {
        // Search filter
        if (currentFilters.search && !actor.name.toLowerCase().includes(currentFilters.search) && 
            !actor.description.toLowerCase().includes(currentFilters.search) &&
            !actor.aliases.some(alias => alias.toLowerCase().includes(currentFilters.search))) {
            return false;
        }
        
        // Category filter
        if (currentFilters.category !== 'all' && actor.category !== currentFilters.category) {
            return false;
        }
        
        // Region filter
        if (currentFilters.region !== 'all' && actor.region !== currentFilters.region) {
            return false;
        }
        
        // Threat level filter
        if (currentFilters.threatLevel !== 'all' && actor.threatLevel !== currentFilters.threatLevel) {
            return false;
        }
        
        return true;
    });
    
    renderActorCards();
}

function renderActorCards() {
    const actorsGrid = document.getElementById('actorsGrid');
    if (!actorsGrid) return;
    
    actorsGrid.innerHTML = '';
    
    filteredActors.forEach((actor, index) => {
        const card = createActorCard(actor);
        card.style.animationDelay = `${index * 0.1}s`;
        actorsGrid.appendChild(card);
    });
}

function createActorCard(actor) {
    const card = document.createElement('div');
    card.className = 'actor-card fade-in';
    card.onclick = () => showActorProfile(actor.id);
    
    const aliases = actor.aliases.slice(0, 2).join(', ');
    const techniques = actor.techniques.slice(0, 4);
    const confidenceWidth = actor.confidence;
    
    card.innerHTML = `
        <div class="actor-header">
            <div class="actor-avatar">
                ${actor.avatar}
                <div class="country-flag">${actor.country}</div>
            </div>
            <div class="actor-info">
                <div class="actor-name">${actor.name}</div>
                <div class="actor-aliases">${aliases}</div>
                <div class="actor-category">${actor.category}</div>
            </div>
        </div>
        
        <div class="actor-description">
            ${actor.description.substring(0, 180)}...
        </div>
        
        <div class="actor-meta">
            <div class="meta-item">
                <div class="meta-label">First Seen</div>
                <div class="meta-value">${actor.firstSeen}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Threat Level</div>
                <div class="meta-value threat-level-badge ${actor.threatLevel}">${actor.threatLevel}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Attribution</div>
                <div class="meta-value">${actor.attribution}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Victims</div>
                <div class="meta-value">${actor.victimCount}</div>
            </div>
        </div>
        
        <div class="actor-tags">
            ${techniques.map(technique => `<span class="actor-tag">${technique}</span>`).join('')}
        </div>
        
        <div class="actor-footer">
            <div class="confidence-indicator">
                <span>Confidence: ${actor.confidence}%</span>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidenceWidth}%"></div>
                </div>
            </div>
            <div class="last-activity">Last: ${actor.lastActivity}</div>
        </div>
    `;
    
    return card;
}

// Actor Profile Rendering
function renderActorProfile(actor) {
    const profileContent = document.getElementById('actorProfileContent');
    if (!profileContent) return;
    
    profileContent.innerHTML = `
        <div class="profile-header">
            <div class="profile-nav">
                <button class="back-btn" onclick="goBackToActors()">
                    <i class="fas fa-arrow-left"></i>
                    Back to Actors
                </button>
                <div class="profile-actions">
                    <button class="share-btn" onclick="shareProfile(${actor.id})">
                        <i class="fas fa-share-alt"></i>
                        Share Profile
                    </button>
                </div>
            </div>
            
            <div class="profile-main">
                <div class="profile-avatar-large">
                    ${actor.avatar}
                    <div class="country-flag large">${actor.country}</div>
                </div>
                <div class="profile-title">
                    <h1>${actor.name}</h1>
                    <div class="profile-subtitle">
                        <span class="threat-level-badge ${actor.threatLevel}">${actor.threatLevel} Threat</span>
                        <span class="category-badge">${actor.category.toUpperCase()}</span>
                    </div>
                    <div class="profile-aliases">
                        <strong>Also known as:</strong> ${actor.aliases.join(', ')}
                    </div>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="profile-stat">
                    <div class="stat-value">${actor.confidence}%</div>
                    <div class="stat-label">Confidence</div>
                </div>
                <div class="profile-stat">
                    <div class="stat-value">${actor.firstSeen}</div>
                    <div class="stat-label">First Seen</div>
                </div>
                <div class="profile-stat">
                    <div class="stat-value">${actor.campaigns.length}</div>
                    <div class="stat-label">Campaigns</div>
                </div>
                <div class="profile-stat">
                    <div class="stat-value">${actor.tools.length}</div>
                    <div class="stat-label">Tools</div>
                </div>
            </div>
        </div>
        
        <div class="profile-content">
            <div class="profile-main-content">
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-info-circle"></i>
                        Overview
                    </h3>
                    <div class="profile-description">
                        ${actor.description}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-crosshairs"></i>
                        Recent Activity
                    </h3>
                    <div class="recent-activity-item">
                        <div class="activity-date">${actor.lastActivity}</div>
                        <div class="activity-desc">${actor.recentActivity}</div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-bullseye"></i>
                        Primary Targets
                    </h3>
                    <div class="tags-grid">
                        ${actor.targets.map(target => `<span class="profile-tag target">${target}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-cogs"></i>
                        Techniques & Procedures
                    </h3>
                    <div class="tags-grid">
                        ${actor.techniques.map(technique => `<span class="profile-tag technique">${technique}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-tools"></i>
                        Known Tools
                    </h3>
                    <div class="tags-grid">
                        ${actor.tools.map(tool => `<span class="profile-tag tool">${tool}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-flag"></i>
                        Major Campaigns
                    </h3>
                    <div class="campaigns-list">
                        ${actor.campaigns.map(campaign => `
                            <div class="campaign-item">
                                <i class="fas fa-arrow-right"></i>
                                <span>${campaign}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-fingerprint"></i>
                        Indicators of Compromise
                    </h3>
                    <div class="iocs-grid">
                        ${actor.iocs.map(ioc => `<code class="ioc-item">${ioc}</code>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="profile-sidebar">
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-brain"></i>
                        Intelligence Assessment
                    </h3>
                    <div class="intelligence-grid">
                        <div class="intel-item">
                            <div class="intel-label">Sophistication</div>
                            <div class="intel-value">${actor.sophistication}</div>
                        </div>
                        <div class="intel-item">
                            <div class="intel-label">Primary Motivation</div>
                            <div class="intel-value">${actor.motivations.join(', ')}</div>
                        </div>
                        <div class="intel-item">
                            <div class="intel-label">Operating Hours</div>
                            <div class="intel-value">${actor.operatingHours}</div>
                        </div>
                        <div class="intel-item">
                            <div class="intel-label">Languages</div>
                            <div class="intel-value">${actor.languages.join(', ')}</div>
                        </div>
                        <div class="intel-item">
                            <div class="intel-label">MITRE ATT&CK ID</div>
                            <div class="intel-value">${actor.mitreId}</div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-network-wired"></i>
                        Infrastructure
                    </h3>
                    <div class="tags-grid">
                        ${actor.infrastructure.map(infra => `<span class="profile-tag technique">${infra}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-link"></i>
                        Known Connections
                    </h3>
                    <div class="tags-grid">
                        ${actor.connections.map(connection => `<span class="profile-tag target">${connection}</span>`).join('')}
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3 class="section-title">
                        <i class="fas fa-chart-bar"></i>
                        Impact Assessment
                    </h3>
                    <div class="intelligence-grid">
                        <div class="intel-item">
                            <div class="intel-label">Confirmed Victims</div>
                            <div class="intel-value">${actor.victimCount}</div>
                        </div>
                        <div class="intel-item">
                            <div class="intel-label">Data/Money Stolen</div>
                            <div class="intel-value">${actor.dataStolen}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Share Profile Function
function shareProfile(actorId) {
    const actor = threatActors.find(a => a.id === actorId);
    if (!actor) return;
    
    const shareData = {
        title: `${actor.name} - Threat Actor Profile`,
        text: `Check out this threat actor profile: ${actor.name} (${actor.aliases[0]})`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(error => {
            // If share fails, fall back to clipboard
            fallbackToClipboard(actorId);
        });
    } else {
        // Fallback: copy to clipboard
        fallbackToClipboard(actorId);
    }
}

function fallbackToClipboard(actorId) {
    const url = `${window.location.origin}${window.location.pathname}?actor=${actorId}`;
    navigator.clipboard.writeText(url).then(() => {
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4757, #ff6b7a);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(255, 71, 87, 0.4);
        `;
        notification.textContent = 'Profile link copied to clipboard!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }).catch(error => {
        console.log('Could not copy to clipboard:', error);
    });
}

// Search Functions
function performGlobalSearch() {
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase();
    currentFilters.search = searchTerm;
    
    // If we're on the actors page, apply filters
    if (document.getElementById('actors') && document.getElementById('actors').classList.contains('active')) {
        applyFilters();
    } else {
        // Switch to actors page and then apply filters
        showSection('actors');
        setTimeout(() => applyFilters(), 100);
    }
}

function toggleAdvancedSearch() {
    // Placeholder for advanced search functionality
    console.log('Advanced search toggled');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load initial dashboard
    loadDashboard();
    
    // Check for actor parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const actorId = urlParams.get('actor');
    if (actorId) {
        showActorProfile(parseInt(actorId));
    }
    
    // Search functionality
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performGlobalSearch();
            }
        });
        
        // Real-time search with debounce
        let searchTimeout;
        globalSearch.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = this.value.toLowerCase();
                if (document.getElementById('actors') && document.getElementById('actors').classList.contains('active')) {
                    applyFilters();
                }
            }, 300);
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('actor-profile') && document.getElementById('actor-profile').classList.contains('active')) {
                goBackToActors();
            }
        }
        
        // Quick navigation
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showSection('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    showSection('actors');
                    break;
            }
        }
    });
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements when they're added to the DOM
function observeElements() {
    document.querySelectorAll('.actor-card, .metric-card, .dashboard-card').forEach(el => {
        observer.observe(el);
    });
}

// Call observe elements after DOM updates
setTimeout(observeElements, 100);