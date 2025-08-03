//before crypthunter change
// Enhanced Threat Actor Database with comprehensive profiles
let threatActors = [
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

// Intelligence Vault Data
let intelligenceTools = [
    // General Tools
    {
        id: 1,
        name: "Maltego",
        url: "https://www.maltego.com",
        parentCategory: "general",
        childCategory: "all-tools",
        description: "Comprehensive link analysis and data mining application for gathering and connecting information for investigative tasks.",
        tags: ["investigation", "link-analysis", "osint", "commercial"],
        isPinned: false,
        isStarred: true,
        dateAdded: "2024-01-15"
    },
    {
        id: 2,
        name: "Shodan",
        url: "https://www.shodan.io",
        parentCategory: "osint",
        childCategory: "search-engines",
        description: "Search engine for Internet-connected devices. Find exposed databases, webcams, industrial systems, and more.",
        tags: ["iot", "search", "reconnaissance", "devices"],
        isPinned: true,
        isStarred: true,
        dateAdded: "2024-01-14"
    },
    {
        id: 3,
        name: "VirusTotal",
        url: "https://www.virustotal.com",
        parentCategory: "malware-analysis",
        childCategory: "file-analysis",
        description: "Free online service that analyzes files and URLs for viruses, worms, trojans and other malicious content.",
        tags: ["malware", "analysis", "free", "hash-lookup"],
        isPinned: true,
        isStarred: false,
        dateAdded: "2024-01-13"
    },
    {
        id: 4,
        name: "Wireshark",
        url: "https://www.wireshark.org",
        parentCategory: "network-security",
        childCategory: "packet-analysis",
        description: "World's foremost and widely-used network protocol analyzer for troubleshooting, analysis, and protocol development.",
        tags: ["network", "packet-capture", "analysis", "free", "open-source"],
        isPinned: false,
        isStarred: true,
        dateAdded: "2024-01-12"
    },
    {
        id: 5,
        name: "Autopsy",
        url: "https://www.autopsy.com",
        parentCategory: "digital-forensics",
        childCategory: "disk-analysis",
        description: "Digital forensics platform and graphical interface to The Sleuth Kit and other digital forensics tools.",
        tags: ["forensics", "disk-analysis", "free", "open-source"],
        isPinned: false,
        isStarred: false,
        dateAdded: "2024-01-11"
    },
    {
        id: 6,
        name: "MISP",
        url: "https://www.misp-project.org",
        parentCategory: "threat-intelligence",
        childCategory: "threat-sharing",
        description: "Open source threat intelligence platform for sharing, storing and correlating Indicators of Compromise.",
        tags: ["threat-intel", "ioc", "sharing", "open-source"],
        isPinned: true,
        isStarred: true,
        dateAdded: "2024-01-10"
    },
    {
        id: 7,
        name: "TheHive",
        url: "https://thehive-project.org",
        parentCategory: "incident-response",
        childCategory: "case-management",
        description: "Scalable, open source and free Security Incident Response Platform designed to make life easier for SOCs and CSIRTs.",
        tags: ["incident-response", "case-management", "open-source", "soc"],
        isPinned: false,
        isStarred: true,
        dateAdded: "2024-01-09"
    },
    {
        id: 8,
        name: "Nessus",
        url: "https://www.tenable.com/products/nessus",
        parentCategory: "compliance",
        childCategory: "vulnerability-assessment",
        description: "Comprehensive vulnerability scanner that identifies vulnerabilities, configuration issues, and malware.",
        tags: ["vulnerability", "scanning", "compliance", "commercial"],
        isPinned: false,
        isStarred: false,
        dateAdded: "2024-01-08"
    }
];

// Parent-Child Category Mapping
const categoryMapping = {
    general: {
        name: "General",
        icon: "fas fa-home",
        children: {
            "all-tools": "All Tools",
            "favorites": "Favorites",
            "recently-added": "Recently Added",
            "most-used": "Most Used"
        }
    },
    osint: {
        name: "OSINT & Investigation",
        icon: "fas fa-search-location",
        children: {
            "search-engines": "Search Engines",
            "social-media": "Social Media Intelligence",
            "people-search": "People Search",
            "email-investigation": "Email Investigation",
            "phone-investigation": "Phone Investigation",
            "username-investigation": "Username Investigation",
            "domain-investigation": "Domain Investigation",
            "image-investigation": "Image Investigation",
            "geolocation": "Geolocation",
            "dark-web": "Dark Web",
            "breach-data": "Breach Data",
            "public-records": "Public Records"
        }
    },
    "digital-forensics": {
        name: "Digital Forensics",
        icon: "fas fa-microscope",
        children: {
            "disk-analysis": "Disk Analysis",
            "memory-analysis": "Memory Analysis",
            "mobile-forensics": "Mobile Forensics",
            "network-forensics": "Network Forensics",
            "timeline-analysis": "Timeline Analysis",
            "artifact-analysis": "Artifact Analysis",
            "file-recovery": "File Recovery",
            "metadata-analysis": "Metadata Analysis",
            "registry-analysis": "Registry Analysis",
            "log-analysis": "Log Analysis"
        }
    },
    "malware-analysis": {
        name: "Malware Analysis",
        icon: "fas fa-virus",
        children: {
            "file-analysis": "File Analysis",
            "dynamic-analysis": "Dynamic Analysis",
            "static-analysis": "Static Analysis",
            "sandboxes": "Sandboxes",
            "reverse-engineering": "Reverse Engineering",
            "hash-lookup": "Hash Lookup",
            "yara-rules": "YARA Rules",
            "decompilers": "Decompilers",
            "debuggers": "Debuggers",
            "hex-editors": "Hex Editors"
        }
    },
    "network-security": {
        name: "Network Security",
        icon: "fas fa-network-wired",
        children: {
            "packet-analysis": "Packet Analysis",
            "network-scanning": "Network Scanning",
            "vulnerability-scanning": "Vulnerability Scanning",
            "port-scanning": "Port Scanning",
            "ssl-analysis": "SSL Analysis",
            "dns-analysis": "DNS Analysis",
            "ip-analysis": "IP Analysis",
            "url-analysis": "URL Analysis",
            "traffic-analysis": "Traffic Analysis",
            "intrusion-detection": "Intrusion Detection"
        }
    },
    "threat-intelligence": {
        name: "Threat Intelligence",
        icon: "fas fa-shield-alt",
        children: {
            "ioc-analysis": "IOC Analysis",
            "threat-feeds": "Threat Feeds",
            "threat-hunting": "Threat Hunting",
            "attribution": "Attribution",
            "threat-sharing": "Threat Sharing",
            "vulnerability-research": "Vulnerability Research",
            "exploit-databases": "Exploit Databases",
            "threat-reports": "Threat Reports",
            "apt-tracking": "APT Tracking",
            "campaign-tracking": "Campaign Tracking"
        }
    },
    "incident-response": {
        name: "Incident Response",
        icon: "fas fa-exclamation-triangle",
        children: {
            "case-management": "Case Management",
            "evidence-collection": "Evidence Collection",
            "containment": "Containment",
            "eradication": "Eradication",
            "recovery": "Recovery",
            "communication": "Communication",
            "documentation": "Documentation",
            "lessons-learned": "Lessons Learned",
            "playbooks": "Playbooks",
            "automation": "Automation"
        }
    },
    "compliance": {
        name: "Compliance & Legal",
        icon: "fas fa-balance-scale",
        children: {
            "vulnerability-assessment": "Vulnerability Assessment",
            "compliance-scanning": "Compliance Scanning",
            "audit-tools": "Audit Tools",
            "policy-management": "Policy Management",
            "risk-assessment": "Risk Assessment",
            "legal-tools": "Legal Tools",
            "evidence-preservation": "Evidence Preservation",
            "chain-of-custody": "Chain of Custody",
            "reporting": "Reporting",
            "certification": "Certification"
        }
    }
};

// Current filters and state
let currentFilters = {
    category: 'all',
    region: 'all',
    threatLevel: 'all',
    search: ''
};

let filteredActors = [...threatActors];
let currentActorId = null;
let convertedMitreData = null;

// Vault state
let currentParentTab = 'general';
let currentChildTab = 'all-tools';
// Multi-Vault variables
let vaults = [];
let currentVaultId = null;
let currentVaultParentTab = 'general';
let currentVaultChildTab = 'all-entries';
let currentVaultView = 'grid';
let selectedEntries = new Set();
let isEditingEntry = false;
let editingEntryId = null;
let entryToDelete = null;

let selectedTools = new Set();
let filteredTools = [...intelligenceTools];
let editingToolId = null;
let deleteTargetId = null;
let deleteTargetType = 'single'; // 'single' or 'bulk'

// Initialize global variables
let currentView = 'grid'; // For vault view toggle
let currentDashboardView = 'dashboard'; // For main navigation
let vaultEntries = [];

let currentThreatActor = null;

function showSection(sectionName) {
    // --- START MODAL CLOSING LOGIC (refined) ---
    // Centralized modal closing, now robust for all modals
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
        if (modal.style.display === 'flex') { // Check if modal is actually open
            // Attempt to find a specific close function or fall back to general hide
            if (modal.id === 'note-modal' && window.investigationNotes) {
                window.investigationNotes.closeNoteModal();
            } else if (modal.id === 'note-detail-modal' && window.investigationNotes) {
                window.investigationNotes.closeNoteDetailModal();
            } else if (modal.id.startsWith('playbook-') && window.blueTeamPlaybook) {
                // Playbook modals
                if (modal.id === 'playbook-chapter-modal') window.blueTeamPlaybook.closeChapterModal();
                else if (modal.id === 'playbook-section-modal') window.blueTeamPlaybook.closeSectionModal();
                else if (modal.id === 'playbook-entry-modal') window.blueTeamPlaybook.closeEntryModal();
                else if (modal.id === 'playbook-delete-confirm-modal') window.blueTeamPlaybook.closeDeleteConfirmModal();
            } else if (modal.id.startsWith('tracelink-') && window.traceLinkManager) {
                // TraceLink modals
                if (modal.id === 'tracelink-add-node-modal') window.traceLinkManager.closeAddNodeModal();
                else if (modal.id === 'tracelink-edit-label-modal') window.traceLinkManager.closeEditLabelModal();
                else if (modal.id === 'tracelink-import-modal') window.traceLinkManager.closeImportModal();
                else if (modal.id === 'tracelink-confirm-delete-modal') window.traceLinkManager.closeConfirmDeleteModal();
            } else {
                // Fallback for other modals if no specific close function is needed
                modal.style.display = 'none';
                if (modal.id === 'deleteModal') { // Generic delete modal cleanup
                    deleteTargetId = null;
                    deleteTargetType = 'single';
                }
            }
        }
    });

    // Hide context menu for TraceLink if open
    if (window.traceLinkManager && document.getElementById('tracelink-context-menu')?.style.display === 'block') {
        window.traceLinkManager.hideContextMenu();
        window.traceLinkManager._cancelConnectionMode(); // Cancel connection mode explicitly
    }
    // --- END MODAL CLOSING LOGIC ---


    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');

        // Load section-specific content
        if (sectionName === 'investigation-notes') {
            if (window.investigationNotes) {
                window.investigationNotes.renderNotes();
                window.investigationNotes.updateEmptyState();
            } else {
                window.investigationNotes = new InvestigationNotes();
                window.investigationNotes.renderNotes();
                window.investigationNotes.updateEmptyState();
            }
        } else if (sectionName === 'cheatsheets') {
            if (window.cheatsheetsManager) {
                window.cheatsheetsManager.loadCheatsheets();
            } else {
                window.cheatsheetsManager = new CheatsheetsManager();
                window.cheatsheetsManager.loadCheatsheets();
            }
        } else if (sectionName === 'tracelink') {
            const tracelinkPlaceholder = document.getElementById('tracelink-content-placeholder');
            if (!tracelinkPlaceholder) {
                console.error("TraceLink content placeholder not found!");
                return;
            }

            if (!tracelinkPlaceholder.dataset.loaded) { // Only load HTML once
                fetch('tracelink.html')
                    .then(response => response.text())
                    .then(html => {
                        tracelinkPlaceholder.innerHTML = html;
                        tracelinkPlaceholder.dataset.loaded = 'true'; // Mark as loaded
                        // Initialize TraceLinkManager AFTER its HTML is in the DOM
                        if (typeof cytoscape !== 'undefined' && typeof window.multiVaultManager !== 'undefined' && typeof window.multiVaultManager.getVaults === 'function') {
                            if (!window.traceLinkManager) { // Only create new instance if it doesn't exist
                                window.traceLinkManager = new TraceLinkManager();
                            }
                            window.traceLinkManager.init(); // Call its new init method
                        } else {
                            // Fallback if Cytoscape or MultiVaultManager aren't ready
                            console.log("Cytoscape or MultiVaultManager not yet ready for TraceLink. Setting up listener.");
                            const initTraceLinkOnReady = () => {
                                if (typeof cytoscape !== 'undefined' && typeof window.multiVaultManager !== 'undefined' && typeof window.multiVaultManager.getVaults === 'function') {
                                    if (!window.traceLinkManager) {
                                        window.traceLinkManager = new TraceLinkManager();
                                    }
                                    window.traceLinkManager.init();
                                    document.removeEventListener('multiVaultManagerReady', initTraceLinkOnReady); // Clean up listener
                                }
                            };
                            document.addEventListener('multiVaultManagerReady', initTraceLinkOnReady);
                        }
                    })
                    .catch(error => {
                        console.error('Error loading tracelink.html:', error);
                        tracelinkPlaceholder.innerHTML = '<div style="color:red;text-align:center;padding:2rem;">Failed to load TraceLink content. Please check console for errors.</div>';
                    });
            } else if (window.traceLinkManager) {
                // If HTML is already loaded and manager exists, just re-render tabs
                window.traceLinkManager.renderTraceLinkTabs();
            }
        } else if (sectionName === 'actors') {
            loadActorsSection();
        } else if (sectionName === 'dashboard') {
            loadDashboard();
        } else if (sectionName === 'import') {
            loadImportSection();
        } else if (sectionName === 'vault') {
            loadVaultSection();
        } else if (sectionName === 'blueteam-playbook') {
            if (window.blueTeamPlaybook) {
                window.blueTeamPlaybook.initializeUI();
            }
        } else if (sectionName === 'multi-vault') { // Re-render multi-vault when navigating to it directly
            renderVaultTabs();
        }
    }

    // Update nav links - find the nav item that corresponds to this section
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(navItem => {
        const onclickAttr = navItem.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`showSection('${sectionName}')`)) {
            navItem.classList.add('active');
        }
    });
}


function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        console.warn('Notification container not found.');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';

    notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconClass} notification-icon"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const autoRemoveTimeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            notification.classList.add('slide-out');
            notification.addEventListener('transitionend', function handler() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                notification.removeEventListener('transitionend', handler);
            });
        }
    }, duration);

    notification.querySelector('.notification-close').onclick = () => {
        clearTimeout(autoRemoveTimeout);
        notification.classList.remove('show');
        notification.classList.add('slide-out');
        notification.addEventListener('transitionend', function handler() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            notification.removeEventListener('transitionend', handler);
        });
    };
}
window.showNotification = showNotification;

// --- Streamlined Generic Delete Confirmation Modal Logic ---
let deleteCallback = null; // Stores the function to call on confirmation

function showConfirmDeleteModal(title, message, callback) {
    const modal = document.getElementById('deleteModal');
    if (!modal) {
        console.error('Generic delete confirmation modal not found.');
        if (confirm(message)) {
            callback();
        }
        return;
    }

    modal.querySelector('h3').textContent = title;
    modal.querySelector('#deleteMessage').textContent = message;
    deleteCallback = callback; // Store the callback

    // Set up confirm and cancel buttons
    const confirmBtn = modal.querySelector('.btn-danger');
    const cancelBtn = modal.querySelector('.btn-secondary');
    const closeBtn = modal.querySelector('.modal-close');

    confirmBtn.onclick = () => {
        if (deleteCallback) {
            deleteCallback();
        }
        closeDeleteModal();
    };
    cancelBtn.onclick = () => closeDeleteModal();
    closeBtn.onclick = () => closeDeleteModal();

    modal.style.display = 'flex';
}
window.showConfirmDeleteModal = showConfirmDeleteModal; // Make it globally accessible


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
    
    // Scroll to top of the page smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function goBackToActors() {
    showSection('actors');
    
    // Scroll to top when going back to actors list
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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

// Intelligence Vault Functions
function loadVaultSection() {
    renderParentTabs();
    renderChildTabs();
    applyVaultFilters();
    setupVaultSearch();
}

function renderParentTabs() {
    const parentTabsContainer = document.querySelector('.parent-tabs');
    if (!parentTabsContainer) return;
    
    parentTabsContainer.innerHTML = Object.entries(categoryMapping).map(([key, category]) => `
        <div class="parent-tab ${key === currentParentTab ? 'active' : ''}" 
             data-parent="${key}" onclick="switchParentTab('${key}')">
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        </div>
    `).join('');
}

function renderChildTabs() {
    const childTabsContainer = document.getElementById('childTabs');
    if (!childTabsContainer) return;
    
    const currentCategory = categoryMapping[currentParentTab];
    if (!currentCategory) return;
    
    childTabsContainer.innerHTML = Object.entries(currentCategory.children).map(([key, name]) => `
        <div class="child-tab ${key === currentChildTab ? 'active' : ''}" 
             data-child="${key}" onclick="switchChildTab('${key}')">
            ${name}
        </div>
    `).join('');
}

function switchParentTab(parentTab) {
    currentParentTab = parentTab;
    
    // Reset to first child tab
    const firstChildKey = Object.keys(categoryMapping[parentTab].children)[0];
    currentChildTab = firstChildKey;
    
    // Clear selection
    selectedTools.clear();
    updateBulkActions();
    
    renderParentTabs();
    renderChildTabs();
    applyVaultFilters();
}

function switchChildTab(childTab) {
    currentChildTab = childTab;
    
    // Clear selection
    selectedTools.clear();
    updateBulkActions();
    
    renderChildTabs();
    applyVaultFilters();
}

function applyVaultFilters() {
    const searchTerm = document.getElementById('vaultSearch')?.value.toLowerCase() || '';
    
    filteredTools = intelligenceTools.filter(tool => {
        // Search filter
        if (searchTerm && !tool.name.toLowerCase().includes(searchTerm) && 
            !tool.description.toLowerCase().includes(searchTerm) &&
            !tool.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
            return false;
        }
        
        // Category filter
        if (currentParentTab === 'general') {
            if (currentChildTab === 'favorites') {
                return tool.isStarred;
            } else if (currentChildTab === 'recently-added') {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(tool.dateAdded) > weekAgo;
            } else if (currentChildTab === 'most-used') {
                return tool.isPinned;
            }
            // 'all-tools' shows everything
            return true;
        } else {
            // Filter by parent category
            if (tool.parentCategory !== currentParentTab) {
                return false;
            }
            
            // Filter by child category if not 'all'
            if (currentChildTab !== 'all' && tool.childCategory !== currentChildTab) {
                return false;
            }
        }
        
        return true;
    });
    
    // Apply sorting
    sortTools();
    renderTools();
}

function sortTools() {
    const sortBy = document.getElementById('vaultSortFilter')?.value || 'name-asc';
    
    filteredTools.sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'date-new':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            case 'date-old':
                return new Date(a.dateAdded) - new Date(b.dateAdded);
            case 'pinned':
                return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
            case 'starred':
                return (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0);
            default:
                return 0;
        }
    });
}

function filterToolsByStatus() {
    const statusFilter = document.getElementById('vaultStatusFilter')?.value || 'all';
    
    if (statusFilter === 'all') {
        applyVaultFilters();
        return;
    }
    
    filteredTools = filteredTools.filter(tool => {
        switch (statusFilter) {
            case 'pinned':
                return tool.isPinned;
            case 'starred':
                return tool.isStarred;
            case 'recent':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(tool.dateAdded) > weekAgo;
            default:
                return true;
        }
    });
    
    renderTools();
}

function renderTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    if (!toolsGrid) return;
    
    toolsGrid.className = currentView === 'grid' ? 'tools-grid' : 'tools-list';
    
    if (filteredTools.length === 0) {
        toolsGrid.innerHTML = `
            <div class="no-tools">
                <div class="no-tools-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No tools found</h3>
                <p>Try adjusting your search criteria or add new tools to your vault.</p>
                <button class="btn-primary" onclick="showAddToolModal()">
                    <i class="fas fa-plus"></i>
                    Add New Tool
                </button>
            </div>
        `;
        return;
    }
    
    toolsGrid.innerHTML = filteredTools.map(tool => createToolCard(tool)).join('');
}

function createToolCard(tool) {
    const isSelected = selectedTools.has(tool.id);
    
    if (currentView === 'list') {
        return `
            <div class="tool-item ${isSelected ? 'selected' : ''}" data-tool-id="${tool.id}">
                <div class="tool-checkbox">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleToolSelection(${tool.id})">
                </div>
                <div class="tool-info">
                    <div class="tool-header">
                        <h3 class="tool-name">${tool.name}</h3>
                        <div class="tool-url">
                            <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i>
                                ${tool.url}
                            </a>
                        </div>
                    </div>
                    <div class="tool-description">${tool.description}</div>
                    <div class="tool-tags">
                        ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="tool-actions">
                    <button class="tool-action-btn ${tool.isPinned ? 'active' : ''}" 
                            onclick="togglePin(${tool.id})" title="Pin Tool">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="tool-action-btn ${tool.isStarred ? 'active' : ''}" 
                            onclick="toggleStar(${tool.id})" title="Star Tool">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="tool-action-btn" onclick="openTool(${tool.id})" title="Open Tool">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="tool-action-btn" onclick="editTool(${tool.id})" title="Edit Tool">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="tool-action-btn danger" onclick="deleteTool(${tool.id})" title="Delete Tool">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="tool-card ${isSelected ? 'selected' : ''}" data-tool-id="${tool.id}">
                <div class="tool-checkbox">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="toggleToolSelection(${tool.id})">
                </div>
                <div class="tool-header">
                    <div class="tool-status">
                        ${tool.isPinned ? '<i class="fas fa-thumbtack pinned" title="Pinned"></i>' : ''}
                        ${tool.isStarred ? '<i class="fas fa-star starred" title="Starred"></i>' : ''}
                    </div>
                    <h3 class="tool-name">${tool.name}</h3>
                    <div class="tool-url">
                        <a href="${tool.url}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                            ${tool.url}
                        </a>
                    </div>
                </div>
                <div class="tool-description">${tool.description}</div>
                <div class="tool-tags">
                    ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
                </div>
                <div class="tool-actions">
                    <button class="tool-action-btn ${tool.isPinned ? 'active' : ''}" 
                            onclick="togglePin(${tool.id})" title="Pin Tool">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="tool-action-btn ${tool.isStarred ? 'active' : ''}" 
                            onclick="toggleStar(${tool.id})" title="Star Tool">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="tool-action-btn" onclick="openTool(${tool.id})" title="Open Tool">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="tool-action-btn" onclick="editTool(${tool.id})" title="Edit Tool">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="tool-action-btn danger" onclick="deleteTool(${tool.id})" title="Delete Tool">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }
}

function toggleView(view) {
    currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    renderTools();
}

function setupVaultSearch() {
    const searchInput = document.getElementById('vaultSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyVaultFilters();
        }, 300);
    });
}

// Tool Management Functions
function showAddToolModal() {
    editingToolId = null;
    document.getElementById('modalTitle').textContent = 'Add New Tool';
    document.getElementById('saveButtonText').textContent = 'Save Tool';
    document.getElementById('addToolForm').reset();
    document.getElementById('customCategoryGroup').style.display = 'none';
    updateChildCategories();
    document.getElementById('addToolModal').style.display = 'flex';
}

function closeAddToolModal() {
    document.getElementById('addToolModal').style.display = 'none';
    editingToolId = null;
}

function updateChildCategories() {
    const parentSelect = document.getElementById('toolParentCategory');
    const childSelect = document.getElementById('toolChildCategory');
    const customGroup = document.getElementById('customCategoryGroup');
    
    const selectedParent = parentSelect.value;
    
    if (selectedParent === 'custom') {
        customGroup.style.display = 'block';
        childSelect.innerHTML = '<option value="custom">Custom Category</option>';
        return;
    } else {
        customGroup.style.display = 'none';
    }
    
    childSelect.innerHTML = '<option value="">Select Child Category</option>';
    
    if (selectedParent && categoryMapping[selectedParent]) {
        const children = categoryMapping[selectedParent].children;
        Object.entries(children).forEach(([key, name]) => {
            childSelect.innerHTML += `<option value="${key}">${name}</option>`;
        });
    }
}

function saveToolForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const toolData = {
        name: formData.get('toolName'),
        url: formData.get('toolUrl'),
        parentCategory: formData.get('toolParentCategory'),
        childCategory: formData.get('toolChildCategory'),
        description: formData.get('toolDescription') || '',
        tags: formData.get('toolTags') ? formData.get('toolTags').split(',').map(tag => tag.trim()) : [],
        isPinned: false,
        isStarred: false,
        dateAdded: new Date().toISOString().split('T')[0]
    };
    
    // Handle custom categories
    if (toolData.parentCategory === 'custom') {
        const customParent = formData.get('customParentCategory');
        if (customParent) {
            toolData.parentCategory = customParent.toLowerCase().replace(/\s+/g, '-');
            toolData.childCategory = 'custom';
        }
    }
    
    // Check for duplicates
    const existingTool = intelligenceTools.find(tool => 
        tool.name.toLowerCase() === toolData.name.toLowerCase() && 
        tool.id !== editingToolId
    );
    
    if (existingTool) {
        showNotification('A tool with this name already exists!', 'error');
        return;
    }
    
    if (editingToolId) {
        // Update existing tool
        const toolIndex = intelligenceTools.findIndex(tool => tool.id === editingToolId);
        if (toolIndex !== -1) {
            intelligenceTools[toolIndex] = { ...intelligenceTools[toolIndex], ...toolData };
            showNotification('Tool updated successfully!', 'success');
        }
    } else {
        // Add new tool
        const newTool = {
            id: Math.max(...intelligenceTools.map(t => t.id)) + 1,
            ...toolData
        };
        intelligenceTools.push(newTool);
        showNotification('Tool added successfully!', 'success');
    }
    
    closeAddToolModal();
    applyVaultFilters();
}

function editTool(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (!tool) return;
    
    editingToolId = toolId;
    document.getElementById('modalTitle').textContent = 'Edit Tool';
    document.getElementById('saveButtonText').textContent = 'Update Tool';
    
    // Populate form
    document.getElementById('toolName').value = tool.name;
    document.getElementById('toolUrl').value = tool.url;
    document.getElementById('toolParentCategory').value = tool.parentCategory;
    document.getElementById('toolDescription').value = tool.description;
    document.getElementById('toolTags').value = tool.tags.join(', ');
    
    updateChildCategories();
    setTimeout(() => {
        document.getElementById('toolChildCategory').value = tool.childCategory;
    }, 100);
    
    document.getElementById('addToolModal').style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
        deleteCallback = null; // Clear callback
        // Reset modal content to default if needed (e.g., after custom messages)
        modal.querySelector('h3').textContent = 'Confirm Deletion';
        modal.querySelector('#deleteMessage').textContent = 'Are you sure you want to delete this item? This action cannot be undone.';
    }
}
window.closeDeleteModal = closeDeleteModal; // Make it globally accessible

function deleteTool(toolId) {
    deleteTargetId = toolId;
    deleteTargetType = 'single';
    
    const tool = intelligenceTools.find(t => t.id === toolId);
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete "${tool.name}"? This action cannot be undone.`;
    
    document.getElementById('deleteModal').style.display = 'flex';
}

function confirmDelete() { // This is the global confirm function for the `deleteModal`
    // This function will now ONLY handle deletions from sections *other* than TraceLink.
    // TraceLink deletions are handled by TraceLinkManager.showConfirmDeleteModal().
    
    if (deleteTargetType === 'single' && deleteTargetId) {
        const toolIndex = intelligenceTools.findIndex(t => t.id === deleteTargetId);
        if (toolIndex !== -1) {
            const toolName = intelligenceTools[toolIndex].name;
            intelligenceTools.splice(toolIndex, 1);
            showNotification(`"${toolName}" deleted successfully!`, 'success');
        }
    } else if (deleteTargetType === 'bulk') {
        const deletedCount = selectedTools.size;
        intelligenceTools = intelligenceTools.filter(tool => !selectedTools.has(tool.id));
        selectedTools.clear();
        showNotification(`${deletedCount} tools deleted successfully!`, 'success');
        updateBulkActions();
    } else if (deleteTargetType === 'vault' && deleteTargetId) {
        const vaultIndex = vaults.findIndex(v => v.id === deleteTargetId);
        if (vaultIndex !== -1) {
            const vaultName = vaults[vaultIndex].name;
            vaults.splice(vaultIndex, 1);
            
            saveVaults();
            renderVaultTabs();
            
            if (vaults.length > 0) {
                switchToVault(vaults[0].id);
            } else {
                currentVaultId = null;
                document.getElementById('activeVaultContent').style.display = 'none';
                document.getElementById('emptyVaultState').style.display = 'flex';
            }
            
            // Critical: Here, we specifically call TraceLinkManager's deleteProject if a TraceLink project exists for this vault.
            if (window.traceLinkManager && window.traceLinkManager.tracelinkProjects[deleteTargetId]) {
                window.traceLinkManager.deleteProject(deleteTargetId); 
            }

            showNotification(`Vault "${vaultName}" deleted successfully`, 'success');
        }
    } else if (deleteTargetType === 'vault-entry' && deleteTargetId && currentVaultId) {
        const vault = vaults.find(v => v.id === currentVaultId);
        if (vault) {
            const entryIndex = vault.entries.findIndex(e => e.id === deleteTargetId);
            if (entryIndex !== -1) {
                const entryName = vault.entries[entryIndex].name;
                vault.entries.splice(entryIndex, 1);
                vault.stats.totalEntries = vault.entries.length;
                vault.stats.lastModified = new Date().toISOString();
                
                saveVaults();
                renderVaultTabs();
                updateVaultHeader(vault);
                renderVaultEntries();
                
                showNotification(`Entry "${entryName}" deleted successfully`, 'success');
            }
        }
    }
    closeDeleteModal();
    // Only apply filters if it's a tool deletion, otherwise it might re-render other sections unexpectedly.
    if (deleteTargetType === 'single' || deleteTargetType === 'bulk') {
        applyVaultFilters(); 
    }
}

function confirmDelete() {
    if (deleteTargetType === 'single' && deleteTargetId) {
        const toolIndex = intelligenceTools.findIndex(t => t.id === deleteTargetId);
        if (toolIndex !== -1) {
            const toolName = intelligenceTools[toolIndex].name;
            intelligenceTools.splice(toolIndex, 1);
            showNotification(`"${toolName}" deleted successfully!`, 'success');
        }
    } else if (deleteTargetType === 'bulk') {
        const deletedCount = selectedTools.size;
        intelligenceTools = intelligenceTools.filter(tool => !selectedTools.has(tool.id));
        selectedTools.clear();
        showNotification(`${deletedCount} tools deleted successfully!`, 'success');
        updateBulkActions();
    }
    
    closeDeleteModal();
    applyVaultFilters();
}

function togglePin(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (tool) {
        tool.isPinned = !tool.isPinned;
        showNotification(`Tool ${tool.isPinned ? 'pinned' : 'unpinned'}!`, 'info');
        applyVaultFilters();
    }
}

function toggleStar(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (tool) {
        tool.isStarred = !tool.isStarred;
        showNotification(`Tool ${tool.isStarred ? 'starred' : 'unstarred'}!`, 'info');
        applyVaultFilters();
    }
}

function openTool(toolId) {
    const tool = intelligenceTools.find(t => t.id === toolId);
    if (tool) {
        window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
}

// Bulk Operations
function toggleToolSelection(toolId) {
    if (selectedTools.has(toolId)) {
        selectedTools.delete(toolId);
    } else {
        selectedTools.add(toolId);
    }
    
    updateBulkActions();
    updateToolCardSelection(toolId);
}

function updateToolCardSelection(toolId) {
    const toolCard = document.querySelector(`[data-tool-id="${toolId}"]`);
    if (toolCard) {
        toolCard.classList.toggle('selected', selectedTools.has(toolId));
    }
}

function updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedTools.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = `${selectedTools.size} selected`;
    } else {
        bulkActions.style.display = 'none';
    }
}

function bulkPin() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isPinned = true;
    });
    
    showNotification(`${selectedTools.size} tools pinned!`, 'success');
    clearSelection();
    applyVaultFilters();
}
function bulkUnPin() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isPinned = false;
    });
    
    showNotification(`${selectedTools.size} tools pinned!`, 'success');
    clearSelection();
    applyVaultFilters();
}

function bulkStar() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isStarred = true;
    });
    
    showNotification(`${selectedTools.size} tools starred!`, 'success');
    clearSelection();
    applyVaultFilters();
}

function bulkUnStar() {
    selectedTools.forEach(toolId => {
        const tool = intelligenceTools.find(t => t.id === toolId);
        if (tool) tool.isStarred = false;
    });
    
    showNotification(`${selectedTools.size} tools starred!`, 'success');
    clearSelection();
    applyVaultFilters();
}

function bulkDelete() {
    deleteTargetType = 'bulk';
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete ${selectedTools.size} selected tools? This action cannot be undone.`;
    
    document.getElementById('deleteModal').style.display = 'flex';
}

function clearSelection() {
    selectedTools.clear();
    updateBulkActions();
    
    // Update UI
    document.querySelectorAll('.tool-card, .tool-item').forEach(card => {
        card.classList.remove('selected');
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = false;
    });
}

// Import/Export Functions
function importTools() {
    document.getElementById('importToolsModal').style.display = 'flex';
    setupToolsFileUpload();
}

function closeImportToolsModal() {
    document.getElementById('importToolsModal').style.display = 'none';
}

function setupToolsFileUpload() {
    const fileInput = document.getElementById('toolsFileInput');
    const uploadArea = document.getElementById('toolsFileUploadArea');
    
    if (!fileInput || !uploadArea) return;
    
    fileInput.addEventListener('change', handleToolsFileSelect);
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleToolsFileDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
}

function handleToolsFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processToolsFile(file);
    }
}

function handleToolsFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processToolsFile(files[0]);
    }
}

async function processToolsFile(file) {
    if (!file.name.endsWith('.json')) {
        showNotification('Please select a JSON file', 'error');
        return;
    }
    
    try {
        const text = await file.text();
        const importedTools = JSON.parse(text);
        
        if (!Array.isArray(importedTools)) {
            throw new Error('JSON file must contain an array of tools');
        }
        
        let importedCount = 0;
        let duplicateCount = 0;
        
        importedTools.forEach(toolData => {
            // Check for duplicates
            const existingTool = intelligenceTools.find(tool => 
                tool.name.toLowerCase() === toolData.name.toLowerCase()
            );
            
            if (existingTool) {
                duplicateCount++;
                return;
            }
            
            // Add new tool
            const newTool = {
                id: Math.max(...intelligenceTools.map(t => t.id)) + 1,
                name: toolData.name || 'Unnamed Tool',
                url: toolData.url || '',
                parentCategory: toolData.parentCategory || 'general',
                childCategory: toolData.childCategory || 'all-tools',
                description: toolData.description || '',
                tags: Array.isArray(toolData.tags) ? toolData.tags : [],
                isPinned: false,
                isStarred: false,
                dateAdded: new Date().toISOString().split('T')[0]
            };
            
            intelligenceTools.push(newTool);
            importedCount++;
        });
        
        closeImportToolsModal();
        
        let message = `Successfully imported ${importedCount} tools!`;
        if (duplicateCount > 0) {
            message += ` (${duplicateCount} duplicates skipped)`;
        }
        
        showNotification(message, 'success');
        applyVaultFilters();
        
    } catch (error) {
        showNotification(`Import failed: ${error.message}`, 'error');
    }
}

function exportTools() {
    const dataStr = JSON.stringify(intelligenceTools, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `intelligence-tools-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    showNotification('Tools exported successfully!', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Import Section Functions
function loadImportSection() {
    setupFileUpload();
}

function setupFileUpload() {
    const fileInput = document.getElementById('mitreFileInput');
    const uploadArea = document.getElementById('fileUploadArea');
    
    if (!fileInput || !uploadArea) return;
    
    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop handlers
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

async function processFile(file) {
    if (!file.name.endsWith('.json')) {
        alert('Please select a JSON file');
        return;
    }
    
    showProgress();
    
    try {
        const text = await file.text();
        const mitreData = JSON.parse(text);
        
        updateProgress(20, 'Parsing MITRE data...');
        
        // Validate MITRE data structure
        if (!mitreData.objects || !Array.isArray(mitreData.objects)) {
            throw new Error('Invalid MITRE data format');
        }
        
        updateProgress(40, 'Converting threat groups...');
        
        // Convert MITRE data using the converter
        const converter = new MitreConverter();
        const convertedData = await converter.convertMitreObjects(mitreData.objects);
        
        updateProgress(80, 'Finalizing import...');
        
        // Store converted data
        convertedMitreData = convertedData;
        
        // Update threat actors array
        threatActors = [...threatActors, ...convertedData];
        filteredActors = [...threatActors];
        
        updateProgress(100, 'Import completed successfully!');
        
        setTimeout(() => {
            showResults(convertedData);
        }, 1000);
        
    } catch (error) {
        console.error('Import error:', error);
        hideProgress();
        alert(`Import failed: ${error.message}`);
    }
}

function showProgress() {
    document.getElementById('importProgress').style.display = 'block';
    document.getElementById('importResults').style.display = 'none';
}

function updateProgress(percentage, message) {
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${percentage}%`;
    document.getElementById('progressDetails').textContent = message;
}

function hideProgress() {
    document.getElementById('importProgress').style.display = 'none';
}

function showResults(data) {
    hideProgress();
    
    const resultsContainer = document.getElementById('importResults');
    const statsContainer = document.getElementById('resultsStats');
    
    // Calculate statistics
    const stats = {
        total: data.length,
        critical: data.filter(a => a.threatLevel === 'critical').length,
        high: data.filter(a => a.threatLevel === 'high').length,
        medium: data.filter(a => a.threatLevel === 'medium').length,
        nationState: data.filter(a => a.category === 'nation-state').length,
        apt: data.filter(a => a.category === 'apt').length
    };
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Imported</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.critical}</div>
            <div class="stat-label">Critical Threats</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.high}</div>
            <div class="stat-label">High Threats</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.nationState}</div>
            <div class="stat-label">Nation-State</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.apt}</div>
            <div class="stat-label">APT Groups</div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

function downloadConvertedData() {
    if (!convertedMitreData) {
        alert('No converted data available');
        return;
    }
    
    const dataStr = JSON.stringify(convertedMitreData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mitre-threat-actors.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
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
    const actorsSection = document.getElementById('actors');
    if (actorsSection && actorsSection.classList.contains('active')) {
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

// ==========================================
// MULTI-VAULT SYSTEM
// ==========================================

// Vault parent-child tab structure
const vaultTabStructure = {
    general: {
        name: 'General',
        icon: 'fas fa-home',
        children: {
            'all-entries': 'All Entries',
            'recent': 'Recently Added',
            'priority': 'High Priority',
            'starred': 'Starred',
            'notes': 'Investigation Notes'
        }
    },
    identity: {
        name: 'Identity & Social',
        icon: 'fas fa-user-secret',
        children: {
            'social': 'Social Media Profiles',
            'username': 'Usernames/Handles',
            'email': 'Email Addresses',
            'phone': 'Phone Numbers',
            'dating': 'Dating Profiles',
            'persona': 'Personas/Identities',
            'publicrecord': 'Public Records'
        }
    },
    communication: {
        name: 'Communication',
        icon: 'fas fa-comments',
        children: {
            'messaging': 'Messaging Apps',
            'telegram': 'Telegram Channels',
            'forum': 'Forums/Markets',
            'paste': 'Paste Sites',
            'link': 'Social/Internet Links'
        }
    },
    financial: {
        name: 'Financial',
        icon: 'fas fa-dollar-sign',
        children: {
            'crypto': 'Crypto Transactions',
            'vendor': 'Underground Vendors',
            'breach': 'Data Breaches',
            'credential': 'Credential Dumps'
        }
    },
    technical: {
        name: 'Technical',
        icon: 'fas fa-code',
        children: {
            'domain': 'Domains/IPs/URLs',
            'network': 'Network Analysis',
            'metadata': 'Metadata',
            'vpn': 'VPN/Anonymity',
            'honeypot': 'Honeypots'
        }
    },
    media: {
        name: 'Media & Files',
        icon: 'fas fa-photo-video',
        children: {
            'media': 'Images/Videos',
            'audio': 'Audio Files',
            'document': 'Documents',
            'archive': 'Archives/Cache',
            'facial': 'Facial Recognition'
        }
    },
    intelligence: {
        name: 'Intelligence',
        icon: 'fas fa-brain',
        children: {
            'threat': 'Threat Intelligence',
            'vulnerability': 'Vulnerabilities',
            'malware': 'Malware/Files',
            'exploit': 'Exploits/Markets',
            'tool': 'Tools'
        }
    },
    underground: {
        name: 'Underground',
        icon: 'fas fa-mask',
        children: {
            'password': 'Passwords',
            'keyword': 'Keywords',
            'location': 'Locations'
        }
    }
};

// Entry type field definitions
const entryTypeFields = {
    tool: {
        fields: [
            { name: 'url', label: 'Tool URL', type: 'url', required: true },
            { name: 'category', label: 'Category', type: 'text' },
            { name: 'version', label: 'Version', type: 'text' }
        ]
    },
    email: {
        fields: [
            { name: 'email', label: 'Email Address', type: 'email', required: true },
            { name: 'domain', label: 'Domain', type: 'text' },
            { name: 'provider', label: 'Email Provider', type: 'text' },
            { name: 'verified', label: 'Verified', type: 'checkbox' }
        ]
    },
    phone: {
        fields: [
            { name: 'number', label: 'Phone Number', type: 'tel', required: true },
            { name: 'country', label: 'Country Code', type: 'text' },
            { name: 'carrier', label: 'Carrier', type: 'text' },
            { name: 'type', label: 'Type', type: 'select', options: ['Mobile', 'Landline', 'VoIP', 'Unknown'] }
        ]
    },
    crypto: {
        fields: [
            { name: 'address', label: 'Wallet Address', type: 'text', required: true },
            { name: 'currency', label: 'Currency', type: 'select', options: ['Bitcoin', 'Ethereum', 'Monero', 'Litecoin', 'Other'] },
            { name: 'amount', label: 'Amount', type: 'number' },
            { name: 'txid', label: 'Transaction ID', type: 'text' }
        ]
    },
    location: {
        fields: [
            { name: 'address', label: 'Address', type: 'text', required: true },
            { name: 'coordinates', label: 'GPS Coordinates', type: 'text' },
            { name: 'city', label: 'City', type: 'text' },
            { name: 'country', label: 'Country', type: 'text' }
        ]
    },
    link: {
        fields: [
            { name: 'url', label: 'URL', type: 'url', required: true },
            { name: 'platform', label: 'Platform', type: 'text' },
            { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Suspended', 'Unknown'] }
        ]
    },
    media: {
        fields: [
            { name: 'url', label: 'Media URL', type: 'url', required: true },
            { name: 'type', label: 'Media Type', type: 'select', options: ['Image', 'Video', 'Audio', 'Document'] },
            { name: 'resolution', label: 'Resolution', type: 'text' },
            { name: 'filesize', label: 'File Size', type: 'text' }
        ]
    },
    social: {
        fields: [
            { name: 'username', label: 'Username', type: 'text', required: true },
            { name: 'platform', label: 'Platform', type: 'select', options: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Other'] },
            { name: 'url', label: 'Profile URL', type: 'url' },
            { name: 'followers', label: 'Followers Count', type: 'number' }
        ]
    },
    domain: {
        fields: [
            { name: 'domain', label: 'Domain/IP/URL', type: 'text', required: true },
            { name: 'type', label: 'Type', type: 'select', options: ['Domain', 'IP Address', 'URL', 'Subdomain'] },
            { name: 'registrar', label: 'Registrar', type: 'text' },
            { name: 'created', label: 'Creation Date', type: 'date' }
        ]
    },
    username: {
        fields: [
            { name: 'username', label: 'Username/Handle', type: 'text', required: true },
            { name: 'platforms', label: 'Platforms Found', type: 'text' },
            { name: 'availability', label: 'Availability', type: 'select', options: ['Available', 'Taken', 'Suspended', 'Unknown'] }
        ]
    },
    threat: {
        fields: [
            { name: 'indicator', label: 'Threat Indicator', type: 'text', required: true },
            { name: 'type', label: 'Indicator Type', type: 'select', options: ['IP', 'Domain', 'Hash', 'URL', 'Email', 'Other'] },
            { name: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
            { name: 'confidence', label: 'Confidence', type: 'select', options: ['Low', 'Medium', 'High'] }
        ]
    },
    document: {
        fields: [
            { name: 'filename', label: 'File Name', type: 'text', required: true },
            { name: 'url', label: 'Document URL', type: 'url' },
            { name: 'type', label: 'Document Type', type: 'select', options: ['PDF', 'DOC', 'XLS', 'TXT', 'Other'] },
            { name: 'hash', label: 'File Hash', type: 'text' }
        ]
    }
};

// Load vaults from localStorage
function loadVaults() {
    const savedVaults = localStorage.getItem('investigationVaults');
    if (savedVaults) {
        vaults = JSON.parse(savedVaults);
    }
    renderVaultTabs();
}

// Save vaults to localStorage
function saveVaults() {
    localStorage.setItem('investigationVaults', JSON.stringify(vaults));
}

// Show create vault modal
function showCreateVaultModal() {
    document.getElementById('createVaultModal').style.display = 'flex';
    document.getElementById('vaultName').focus();
    
    // Setup color picker
    setupColorPicker();
    setupIconPicker();
}

// Close create vault modal
function closeCreateVaultModal() {
    document.getElementById('createVaultModal').style.display = 'none';
    document.getElementById('createVaultForm').reset();
}

// Setup color picker
function setupColorPicker() {
    const colorPresets = document.querySelectorAll('.color-preset');
    const colorInput = document.getElementById('vaultColor');
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            colorInput.value = color;
            
            // Update active state
            colorPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
        });
    });
}

// Setup icon picker
function setupIconPicker() {
    const iconOptions = document.querySelectorAll('.icon-option');
    const iconInput = document.getElementById('vaultIcon');
    
    iconOptions.forEach(option => {
        option.addEventListener('click', () => {
            const icon = option.dataset.icon;
            iconInput.value = icon;
            
            // Update active state
            iconOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// Create new vault
function createNewVault(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const vaultData = {
        id: Date.now().toString(),
        name: formData.get('vaultName'),
        description: formData.get('vaultDescription') || '',
        color: formData.get('vaultColor'),
        icon: formData.get('vaultIcon'),
        created: new Date().toISOString(),
        entries: [],
        stats: {
            totalEntries: 0,
            lastModified: new Date().toISOString()
        }
    };
    
    // Check for duplicate names
    if (vaults.some(vault => vault.name.toLowerCase() === vaultData.name.toLowerCase())) {
        showNotification('A vault with this name already exists', 'error');
        return;
    }
    
    vaults.push(vaultData);
    saveVaults();
    renderVaultTabs();
    
    // Switch to the new vault
    switchToVault(vaultData.id);
    
    closeCreateVaultModal();
    showNotification(`Vault "${vaultData.name}" created successfully`, 'success');
}

// Render vault tabs
function renderVaultTabs() {
    const vaultTabs = document.getElementById('vaultTabs');
    const emptyState = document.getElementById('emptyVaultState');
    const activeContent = document.getElementById('activeVaultContent');
    
    if (vaults.length === 0) {
        vaultTabs.innerHTML = '';
        emptyState.style.display = 'flex';
        activeContent.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    activeContent.style.display = 'block';
    
    vaultTabs.innerHTML = vaults.map(vault => `
        <div class="vault-tab ${vault.id === currentVaultId ? 'active' : ''}" 
             onclick="switchToVault('${vault.id}')"
             data-vault-id="${vault.id}">
            <div class="vault-tab-icon" style="background-color: ${vault.color}">
                <i class="${vault.icon}"></i>
            </div>
            <div class="vault-tab-content">
                <div class="vault-tab-name">${vault.name}</div>
                <div class="vault-tab-stats">${vault.entries.length} entries</div>
            </div>
            <div class="vault-tab-actions">
                <button class="vault-action-btn" onclick="event.stopPropagation(); showVaultManagement('${vault.id}')" title="Manage Vault">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // If no vault is selected, select the first one
    if (!currentVaultId && vaults.length > 0) {
        switchToVault(vaults[0].id);
    }
}

// Switch to vault
function switchToVault(vaultId) {
    currentVaultId = vaultId;
    const vault = vaults.find(v => v.id === vaultId);
    
    if (!vault) return;
    
    // Update active tab
    document.querySelectorAll('.vault-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.vaultId === vaultId);
    });
    
    // Update vault header
    updateVaultHeader(vault);
    
    // Reset to general tab
    currentVaultParentTab = 'general';
    currentVaultChildTab = 'all-entries';
    
    // Update parent tabs
    updateVaultParentTabs();
    
    // Update child tabs
    updateVaultChildTabs();
    
    // Render entries
    renderVaultEntries();
}

// Update vault header
function updateVaultHeader(vault) {
    const vaultHeader = document.getElementById('vaultHeader');
    vaultHeader.innerHTML = `
        <div class="vault-header-content">
            <div class="vault-header-icon" style="background-color: ${vault.color}">
                <i class="${vault.icon}"></i>
            </div>
            <div class="vault-header-info">
                <h2>${vault.name}</h2>
                <p>${vault.description || 'No description provided'}</p>
                <div class="vault-header-stats">
                    <span class="stat-item">
                        <i class="fas fa-database"></i>
                        ${vault.entries.length} entries
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-calendar"></i>
                        Created ${new Date(vault.created).toLocaleDateString()}
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-clock"></i>
                        Modified ${new Date(vault.stats.lastModified).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Update vault parent tabs
function updateVaultParentTabs() {
    document.querySelectorAll('.vault-parent-tabs .parent-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.parent === currentVaultParentTab);
    });
}

// Switch vault parent tab
function switchVaultParentTab(parentTab) {
    currentVaultParentTab = parentTab;
    currentVaultChildTab = Object.keys(vaultTabStructure[parentTab].children)[0];
    
    updateVaultParentTabs();
    updateVaultChildTabs();
    renderVaultEntries();
}

// Update vault child tabs
function updateVaultChildTabs() {
    const vaultChildTabs = document.getElementById('vaultChildTabs');
    const children = vaultTabStructure[currentVaultParentTab].children;
    
    vaultChildTabs.innerHTML = Object.entries(children).map(([key, name]) => `
        <div class="child-tab ${key === currentVaultChildTab ? 'active' : ''}" 
             onclick="switchVaultChildTab('${key}')">
            ${name}
        </div>
    `).join('');
}

// Switch vault child tab
function switchVaultChildTab(childTab) {
    currentVaultChildTab = childTab;
    updateVaultChildTabs();
    renderVaultEntries();
}

// Show add entry modal
function showAddEntryModal() {
    if (!currentVaultId) {
        showNotification('Please select a vault first', 'warning');
        return;
    }
    
    document.getElementById('addEntryModal').style.display = 'flex';
    document.getElementById('entryModalTitle').textContent = 'Add New Entry';
    document.getElementById('saveEntryButtonText').textContent = 'Save Entry';
    document.getElementById('addEntryForm').reset();
    isEditingEntry = false;
    editingEntryId = null;
    
    // Clear dynamic fields
    document.getElementById('dynamicFields').innerHTML = '';
}

// Close add entry modal
function closeAddEntryModal() {
    document.getElementById('addEntryModal').style.display = 'none';
    document.getElementById('addEntryForm').reset();
    isEditingEntry = false;
    editingEntryId = null;
}

// Update entry fields based on type
function updateEntryFields() {
    const entryType = document.getElementById('entryType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    
    if (!entryType || !entryTypeFields[entryType]) {
        dynamicFields.innerHTML = '';
        return;
    }
    
    const fields = entryTypeFields[entryType].fields;
    
    dynamicFields.innerHTML = fields.map(field => {
        if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label for="field_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="field_${field.name}" name="field_${field.name}" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (field.type === 'checkbox') {
            return `
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="field_${field.name}" name="field_${field.name}">
                        ${field.label}
                    </label>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label for="field_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input type="${field.type}" id="field_${field.name}" name="field_${field.name}" 
                           ${field.required ? 'required' : ''} 
                           placeholder="Enter ${field.label.toLowerCase()}">
                </div>
            `;
        }
    }).join('');
}

// Add metadata pair
function addMetadataPair() {
    const container = document.getElementById('metadataContainer');
    const pairDiv = document.createElement('div');
    pairDiv.className = 'metadata-pair';
    pairDiv.innerHTML = `
        <input type="text" class="metadata-key" placeholder="Key">
        <input type="text" class="metadata-value" placeholder="Value">
        <button type="button" class="metadata-remove" onclick="removeMetadataPair(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(pairDiv);
}

// Remove metadata pair
function removeMetadataPair(button) {
    const container = document.getElementById('metadataContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}

// Save vault entry
function saveVaultEntry(event) {
    event.preventDefault();
    
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const formData = new FormData(event.target);
    const entryType = formData.get('entryType');
    
    // Collect dynamic fields
    const dynamicData = {};
    if (entryTypeFields[entryType]) {
        entryTypeFields[entryType].fields.forEach(field => {
            const value = formData.get(`field_${field.name}`);
            if (value !== null) {
                dynamicData[field.name] = field.type === 'checkbox' ? !!value : value;
            }
        });
    }
    
    // Collect metadata from key-value pairs
    const customMetadata = {};
    const metadataPairs = document.querySelectorAll('.metadata-pair');
    metadataPairs.forEach(pair => {
        const key = pair.querySelector('.metadata-key').value.trim();
        const value = pair.querySelector('.metadata-value').value.trim();
        if (key && value) {
            customMetadata[key] = value;
        }
    });
    
    const entryData = {
        id: isEditingEntry ? editingEntryId : Date.now().toString(),
        type: entryType,
        name: formData.get('entryName'),
        description: formData.get('entryDescription') || '',
        investigationNotes: formData.get('investigationNotes') || '',
        tags: formData.get('entryTags') ? formData.get('entryTags').split(',').map(tag => tag.trim()) : [],
        source: formData.get('entrySource') || '',
        priority: formData.get('entryPriority'),
        dynamicData: dynamicData,
        customMetadata: customMetadata,
        created: isEditingEntry ? vault.entries.find(e => e.id === editingEntryId)?.created : new Date().toISOString(),
        modified: new Date().toISOString(),
        starred: isEditingEntry ? vault.entries.find(e => e.id === editingEntryId)?.starred || false : false,
        pinned: isEditingEntry ? vault.entries.find(e => e.id === editingEntryId)?.pinned || false : false
    };
    
    // Check for duplicates (only for new entries)
    if (!isEditingEntry) {
        const duplicate = vault.entries.find(entry => 
            entry.name.toLowerCase() === entryData.name.toLowerCase() && 
            entry.type === entryData.type
        );
        
        if (duplicate) {
            showNotification('An entry with this name and type already exists', 'error');
            return;
        }
    }
    
    if (isEditingEntry) {
        // Update existing entry
        const index = vault.entries.findIndex(e => e.id === editingEntryId);
        if (index !== -1) {
            vault.entries[index] = entryData;
        }
    } else {
        // Add new entry
        vault.entries.push(entryData);
    }
    
    // Update vault stats
    vault.stats.totalEntries = vault.entries.length;
    vault.stats.lastModified = new Date().toISOString();
    
    saveVaults();
    renderVaultTabs();
    updateVaultHeader(vault);
    renderVaultEntries();
    
    closeAddEntryModal();
    showNotification(
        isEditingEntry ? 'Entry updated successfully' : 'Entry added successfully', 
        'success'
    );
}

// Render vault entries
function renderVaultEntries() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    let entries = [...vault.entries];
    
    // Filter by child tab
    if (currentVaultChildTab !== 'all-entries') {
        if (currentVaultChildTab === 'recent') {
            entries = entries.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 20);
        } else if (currentVaultChildTab === 'priority') {
            entries = entries.filter(entry => entry.priority === 'high' || entry.priority === 'critical');
        } else if (currentVaultChildTab === 'starred') {
            entries = entries.filter(entry => entry.starred);
        } else if (currentVaultChildTab === 'notes') {
            entries = entries.filter(entry => entry.investigationNotes);
        } else {
            // Filter by entry type
            entries = entries.filter(entry => entry.type === currentVaultChildTab);
        }
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('vaultEntrySearch')?.value.toLowerCase();
    if (searchTerm) {
        entries = entries.filter(entry => 
            entry.name.toLowerCase().includes(searchTerm) ||
            entry.description.toLowerCase().includes(searchTerm) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply type filter
    const typeFilter = document.getElementById('vaultEntryTypeFilter')?.value;
    if (typeFilter && typeFilter !== 'all') {
        entries = entries.filter(entry => entry.type === typeFilter);
    }
    
    // Apply sorting
    const sortFilter = document.getElementById('vaultSortFilter')?.value;
    if (sortFilter) {
        switch (sortFilter) {
            case 'date-new':
                entries.sort((a, b) => new Date(b.created) - new Date(a.created));
                break;
            case 'date-old':
                entries.sort((a, b) => new Date(a.created) - new Date(b.created));
                break;
            case 'name-asc':
                entries.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                entries.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'type':
                entries.sort((a, b) => a.type.localeCompare(b.type));
                break;
            case 'priority':
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                entries.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
                break;
        }
    }
    
    const vaultEntriesGrid = document.getElementById('vaultEntriesGrid');
    
    if (entries.length === 0) {
        vaultEntriesGrid.innerHTML = `
            <div class="empty-entries-state">
                <div class="empty-state-icon">
                    <i class="fas fa-database"></i>
                </div>
                <h3>No Entries Found</h3>
                <p>No entries match your current filters. Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }
    
    vaultEntriesGrid.className = `vault-entries-${currentVaultView}`;
    vaultEntriesGrid.innerHTML = entries.map(entry => createVaultEntryCard(entry)).join('');
}

// Create vault entry card
function createVaultEntryCard(entry) {
    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#dc2626'
    };
    
    const typeIcons = {
        tool: 'fas fa-tools',
        email: 'fas fa-envelope',
        phone: 'fas fa-phone',
        crypto: 'fab fa-bitcoin',
        location: 'fas fa-map-marker-alt',
        link: 'fas fa-link',
        media: 'fas fa-photo-video',
        social: 'fas fa-users',
        domain: 'fas fa-globe',
        username: 'fas fa-user',
        threat: 'fas fa-shield-alt',
        document: 'fas fa-file-alt'
    };
    
    return `
        <div class="vault-entry-card" data-entry-id="${entry.id}">
            <div class="entry-card-header">
                <div class="entry-type-icon">
                    <i class="${typeIcons[entry.type] || 'fas fa-file'}"></i>
                </div>
                <div class="entry-priority" style="background-color: ${priorityColors[entry.priority]}"></div>
                <div class="entry-actions">
                    <button class="entry-action-btn ${entry.starred ? 'active' : ''}" 
                            onclick="toggleEntryStarred('${entry.id}')" title="Star">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="entry-action-btn ${entry.pinned ? 'active' : ''}" 
                            onclick="toggleEntryPinned('${entry.id}')" title="Pin">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="entry-action-btn" onclick="editVaultEntry('${entry.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="entry-action-btn danger" onclick="deleteVaultEntry('${entry.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="entry-card-content">
                <h3 class="entry-name">${entry.name}</h3>
                <div class="entry-type">${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</div>
                
                ${entry.description ? `<p class="entry-description">${entry.description}</p>` : ''}
                
                <div class="entry-dynamic-data">
                    ${Object.entries(entry.dynamicData || {}).map(([key, value]) => 
                        value ? `<div class="dynamic-field">
                            <strong>${key}:</strong> 
                            ${key.includes('url') || key.includes('link') ? 
                                `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>` : 
                                value}
                        </div>` : ''
                    ).join('')}
                </div>
                
                ${entry.investigationNotes ? `
                    <div class="entry-notes">
                        <strong>Investigation Notes:</strong>
                        <p>${entry.investigationNotes}</p>
                    </div>
                ` : ''}
                
                ${entry.tags.length > 0 ? `
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="entry-metadata">
                    <span class="entry-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(entry.created).toLocaleDateString()}
                    </span>
                    ${entry.source ? `
                        <span class="entry-source">
                            <i class="fas fa-source"></i>
                            ${entry.source}
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Toggle entry starred
function toggleEntryStarred(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (entry) {
        entry.starred = !entry.starred;
        entry.modified = new Date().toISOString();
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultEntries();
        showNotification(
            entry.starred ? 'Entry starred' : 'Entry unstarred', 
            'success'
        );
    }
}

// Toggle entry pinned
function toggleEntryPinned(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (entry) {
        entry.pinned = !entry.pinned;
        entry.modified = new Date().toISOString();
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultEntries();
        showNotification(
            entry.pinned ? 'Entry pinned' : 'Entry unpinned', 
            'success'
        );
    }
}

// Edit vault entry
function editVaultEntry(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    isEditingEntry = true;
    editingEntryId = entryId;
    
    // Show modal
    document.getElementById('addEntryModal').style.display = 'flex';
    document.getElementById('entryModalTitle').textContent = 'Edit Entry';
    document.getElementById('saveEntryButtonText').textContent = 'Update Entry';
    
    // Populate form
    document.getElementById('entryType').value = entry.type;
    document.getElementById('entryName').value = entry.name;
    document.getElementById('entryDescription').value = entry.description;
    document.getElementById('investigationNotes').value = entry.investigationNotes;
    document.getElementById('entryTags').value = entry.tags.join(', ');
    document.getElementById('entrySource').value = entry.source;
    document.getElementById('entryPriority').value = entry.priority;
    
    // Populate metadata pairs
    const metadataContainer = document.getElementById('metadataContainer');
    if (metadataContainer) {
        metadataContainer.innerHTML = '';
    }
    
    if (Object.keys(entry.customMetadata || {}).length > 0) {
        Object.entries(entry.customMetadata).forEach(([key, value]) => {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'metadata-pair';
            pairDiv.innerHTML = `
                <input type="text" class="metadata-key" placeholder="Key" value="${key}">
                <input type="text" class="metadata-value" placeholder="Value" value="${value}">
                <button type="button" class="metadata-remove" onclick="removeMetadataPair(this)">
                    <i class="fas fa-minus"></i>
                </button>
            `;
            if (metadataContainer) {
                metadataContainer.appendChild(pairDiv);
            }
        });
    } else {
        // Add one empty pair
        if (metadataContainer) {
            addMetadataPair();
        }
    }
    
    // Update dynamic fields
    updateEntryFields();
    
    // Populate dynamic fields
    setTimeout(() => {
        Object.entries(entry.dynamicData || {}).forEach(([key, value]) => {
            const field = document.getElementById(`field_${key}`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value;
                } else {
                    field.value = value;
                }
            }
        });
    }, 100);
}

// Delete vault entry
function deleteVaultEntry(entryId) {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entry = vault.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    entryToDelete = entryId;
    
    // Show custom delete modal
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete the entry "${entry.name}"? This action cannot be undone.`;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Confirm delete entry
function confirmDeleteEntry() {
    if (!entryToDelete) return;
    
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const entryIndex = vault.entries.findIndex(e => e.id === entryToDelete);
    if (entryIndex !== -1) {
        const entryName = vault.entries[entryIndex].name;
        vault.entries.splice(entryIndex, 1);
        vault.stats.totalEntries = vault.entries.length;
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultTabs();
        updateVaultHeader(vault);
        renderVaultEntries();
        
        showNotification(`Entry "${entryName}" deleted successfully`, 'success');
    }
    
    closeDeleteModal();
    entryToDelete = null;
}

// Toggle vault view
function toggleVaultView(view) {
    currentVaultView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    renderVaultEntries();
}

// Filter vault entries
function filterVaultEntries() {
    renderVaultEntries();
}

// Sort vault entries
function sortVaultEntries() {
    renderVaultEntries();
}

// Export vault data
function exportVaultData() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) {
        showNotification('No vault selected', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(vault, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault-${vault.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Vault exported successfully', 'success');
}

// Export all vaults
function exportAllVaults() {
    if (vaults.length === 0) {
        showNotification('No vaults to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(vaults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-vaults-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('All vaults exported successfully', 'success');
}

// Import vault data
function importVaultData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Check if it's a single vault or multiple vaults
                if (Array.isArray(importedData)) {
                    // Multiple vaults
                    let importedCount = 0;
                    importedData.forEach(vault => {
                        if (vault.id && vault.name && vault.entries) {
                            // Check for duplicate names
                            if (!vaults.some(v => v.name.toLowerCase() === vault.name.toLowerCase())) {
                                vault.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                                vaults.push(vault);
                                importedCount++;
                            }
                        }
                    });
                    
                    if (importedCount > 0) {
                        saveVaults();
                        renderVaultTabs();
                        showNotification(`${importedCount} vault(s) imported successfully`, 'success');
                    } else {
                        showNotification('No new vaults imported (duplicates or invalid data)', 'warning');
                    }
                } else if (importedData.id && importedData.name && importedData.entries) {
                    // Single vault
                    if (!vaults.some(v => v.name.toLowerCase() === importedData.name.toLowerCase())) {
                        importedData.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                        vaults.push(importedData);
                        saveVaults();
                        renderVaultTabs();
                        showNotification('Vault imported successfully', 'success');
                    } else {
                        showNotification('Vault with this name already exists', 'error');
                    }
                } else {
                    showNotification('Invalid vault data format', 'error');
                }
            } catch (error) {
                showNotification('Error parsing JSON file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Show vault management modal
function showVaultManagement(vaultId) {
    currentVaultId = vaultId;
    document.getElementById('vaultManagementModal').style.display = 'flex';
}

// Close vault management modal
function closeVaultManagementModal() {
    document.getElementById('vaultManagementModal').style.display = 'none';
}

// Edit vault
function editVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    // Populate edit form (reuse create form)
    document.getElementById('vaultName').value = vault.name;
    document.getElementById('vaultDescription').value = vault.description;
    document.getElementById('vaultColor').value = vault.color;
    document.getElementById('vaultIcon').value = vault.icon;
    
    // Change form behavior to edit mode
    const form = document.getElementById('createVaultForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        vault.name = formData.get('vaultName');
        vault.description = formData.get('vaultDescription');
        vault.color = formData.get('vaultColor');
        vault.icon = formData.get('vaultIcon');
        vault.stats.lastModified = new Date().toISOString();
        
        saveVaults();
        renderVaultTabs();
        updateVaultHeader(vault);
        
        closeCreateVaultModal();
        closeVaultManagementModal();
        showNotification('Vault updated successfully', 'success');
        
        // Reset form behavior
        form.onsubmit = createNewVault;
    };
    
    closeVaultManagementModal();
    showCreateVaultModal();
    document.querySelector('#createVaultModal h3').textContent = 'Edit Vault';
}

// Duplicate vault
function duplicateVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    const duplicatedVault = {
        ...vault,
        id: Date.now().toString(),
        name: `${vault.name} (Copy)`,
        created: new Date().toISOString(),
        stats: {
            ...vault.stats,
            lastModified: new Date().toISOString()
        },
        entries: vault.entries.map(entry => ({
            ...entry,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        }))
    };
    
    vaults.push(duplicatedVault);
    saveVaults();
    renderVaultTabs();
    
    closeVaultManagementModal();
    showNotification('Vault duplicated successfully', 'success');
}

// Archive vault (for now, just add archived flag)
function archiveVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    vault.archived = !vault.archived;
    vault.stats.lastModified = new Date().toISOString();
    
    saveVaults();
    renderVaultTabs();
    
    closeVaultManagementModal();
    showNotification(
        vault.archived ? 'Vault archived' : 'Vault unarchived', 
        'success'
    );
}

// Delete vault
function deleteVault() {
    const vault = vaults.find(v => v.id === currentVaultId);
    if (!vault) return;
    
    // Show confirmation
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete the vault "${vault.name}" and all its ${vault.entries.length} entries? This action cannot be undone.`;
    
    // Override confirm delete to handle vault deletion
    const originalConfirmDelete = window.confirmDelete;
    window.confirmDelete = function() {
        const vaultIndex = vaults.findIndex(v => v.id === currentVaultId);
        if (vaultIndex !== -1) {
            const vaultName = vaults[vaultIndex].name;
            vaults.splice(vaultIndex, 1);
            
            saveVaults();
            renderVaultTabs();
            
            // Reset current vault if deleted
            if (vaults.length > 0) {
                switchToVault(vaults[0].id);
            } else {
                currentVaultId = null;
            }
            
            showNotification(`Vault "${vaultName}" deleted successfully`, 'success');
        }
        
        closeDeleteModal();
        closeVaultManagementModal();
        
        // Restore original function
        window.confirmDelete = originalConfirmDelete;
    };
    
    closeVaultManagementModal();
    document.getElementById('deleteModal').style.display = 'flex';
}

// Save custom vault entry
function saveCustomVaultEntry(event) {
    event.preventDefault();
    
    const name = document.getElementById('entryName').value;
    const type = document.getElementById('entryType').value;
    const tags = document.getElementById('entryTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const notes = document.getElementById('entryNotes').value;
    const description = document.getElementById('entryDescription').value;
    
    // Collect metadata from key-value pairs
    const metadata = {};
    const metadataPairs = document.querySelectorAll('.metadata-pair');
    metadataPairs.forEach(pair => {
        const key = pair.querySelector('.metadata-key').value.trim();
        const value = pair.querySelector('.metadata-value').value.trim();
        if (key && value) {
            metadata[key] = value;
        }
    });
    
    if (!name.trim()) {
        showNotification('Entry name is required', 'error');
        return;
    }
    
    const entry = {
        id: Date.now().toString(),
        name: name,
        type: type,
        description: description,
        notes: notes,
        tags: tags,
        metadata: metadata,
        createdAt: new Date().toISOString()
    };
    
    // Add to current vault
    const vault = customVaults.find(v => v.id === currentCustomVaultId);
    if (vault) {
        vault.entries.push(entry);
        saveCustomVaults();
        renderCustomVaultEntries(currentCustomVaultId);
    }
    
    // Clear form
    document.getElementById('customVaultEntryForm').reset();
    
    // Reset metadata container to single pair
    const metadataContainer = document.getElementById('metadataContainer');
    metadataContainer.innerHTML = `
        <div class="metadata-pair">
            <input type="text" class="metadata-key" placeholder="Key">
            <input type="text" class="metadata-value" placeholder="Value">
            <button type="button" class="metadata-remove" onclick="removeMetadataPair(this)">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    `;
    
    closeCustomVaultEntryModal();
    
    showNotification('Entry saved successfully!', 'success');
}

// Render custom vault entries
function renderCustomVaultEntries(vaultId) {
    const vault = customVaults.find(v => v.id === vaultId);
    if (!vault) return;
    
    const entriesContainer = document.getElementById('customVaultEntriesContainer');
    if (!entriesContainer) return;
    
    if (vault.entries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="no-entries">
                <div class="no-entries-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <h3>No entries yet</h3>
                <p>Start adding entries to organize your investigation data</p>
                <button class="btn-primary" onclick="showCustomVaultEntryModal()">
                    <i class="fas fa-plus"></i>
                    Add First Entry
                </button>
            </div>
        `;
        return;
    }
    
    entriesContainer.innerHTML = vault.entries.map(entry => {
        const metadataHtml = Object.keys(entry.metadata).length > 0 
            ? Object.entries(entry.metadata).map(([key, value]) => 
                `<div class="metadata-item"><strong>${key}:</strong> ${value}</div>`
              ).join('')
            : '<div class="metadata-item">No metadata</div>';
            
        return `
            <div class="custom-vault-entry-card" data-entry-id="${entry.id}">
                <div class="entry-card-header">
                    <div class="entry-type-badge ${entry.type}">
                        <i class="fas fa-${getEntryTypeIcon(entry.type)}"></i>
                        ${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </div>
                    <div class="entry-actions">
                        <button class="entry-action-btn" onclick="editCustomVaultEntry('${entry.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="entry-action-btn" onclick="deleteCustomVaultEntry('${entry.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="entry-card-content">
                    <h4 class="entry-title">${entry.name}</h4>
                    ${entry.description ? `<p class="entry-description">${entry.description}</p>` : ''}
                    
                    <div class="entry-metadata">
                        <h5>Metadata:</h5>
                        ${metadataHtml}
                    </div>
                    
                    ${entry.notes ? `
                        <div class="entry-notes">
                            <h5>Investigation Notes:</h5>
                            <p>${entry.notes}</p>
                        </div>
                    ` : ''}
                    
                    ${entry.tags.length > 0 ? `
                        <div class="entry-tags">
                            ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="entry-footer">
                        <span class="entry-date">Created: ${new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get icon for entry type
function getEntryTypeIcon(type) {
    const icons = {
        'tool': 'tools',
        'email': 'envelope',
        'phone': 'phone',
        'crypto': 'coins',
        'location': 'map-marker-alt',
        'link': 'link',
        'media': 'image',
        'password': 'key',
        'keyword': 'tag',
        'social': 'users',
        'domain': 'globe',
        'username': 'user',
        'threat': 'shield-alt',
        'vulnerability': 'bug',
        'malware': 'virus',
        'breach': 'exclamation-triangle',
        'credential': 'id-card',
        'forum': 'comments',
        'vendor': 'store',
        'telegram': 'paper-plane',
        'paste': 'clipboard',
        'document': 'file-alt',
        'network': 'network-wired',
        'metadata': 'info-circle',
        'archive': 'archive',
        'messaging': 'comment-dots',
        'dating': 'heart',
        'audio': 'volume-up',
        'facial': 'eye',
        'persona': 'mask',
        'vpn': 'user-secret',
        'honeypot': 'spider',
        'exploit': 'bomb',
        'publicrecord': 'file-contract'
    };
    return icons[type] || 'question';
}

// Delete custom vault entry
function deleteCustomVaultEntry(entryId) {
    const vault = customVaults.find(v => v.id === currentCustomVaultId);
    if (!vault) return;
    
    const entryIndex = vault.entries.findIndex(e => e.id === entryId);
    if (entryIndex !== -1) {
        vault.entries.splice(entryIndex, 1);
        saveCustomVaults();
        renderCustomVaultEntries(currentCustomVaultId);
        showNotification('Entry deleted successfully!', 'success');
    }
}

// ==========================================
// MITRE DATA IMPORT FUNCTIONALITY
// ==========================================

// Show specific view
function showView(viewName) {
    // Hide all views
    const views = ['dashboard', 'actors', 'multi-vault', 'case-studies', 'settings'];
    views.forEach(view => {
        const element = document.getElementById(view);
        if (element) {
            element.classList.remove('active');
        }
    });
    
    // Show selected view
    const selectedView = document.getElementById(viewName);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Update current view
    currentDashboardView = viewName;
    
    // Load view-specific content
    switch (viewName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'actors':
            loadActorsSection();
            break;
        case 'multi-vault':
            // Multi-vault is handled by existing functions
            break;
        case 'settings':
            if (typeof loadSettingsView === 'function') {
                loadSettingsView();
            }
            break;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize the application
function initializeApp() {
    if (typeof loadThreatActorsFromStorage === 'function') {
        loadThreatActorsFromStorage();
    }
    if (typeof loadVaults === 'function') { // Use loadVaults instead of loadVaultEntriesFromStorage
        loadVaults();
    }

    // Set up form submission handlers
    // The previous `vault-entry-form` event listener here is for a form that doesn't exist.
    // The `saveVaultEntry` function is called directly by the `addEntryForm`'s `onsubmit` handler.
    // So, this part can be removed or ensure the element ID is correct if you have such a form.

    // Load dashboard by default
    showSection('dashboard');
}

// Make functions globally available
window.showSection = showSection;
window.showActorProfile = showActorProfile;
window.goBackToActors = goBackToActors;
window.filterActors = filterActors;
window.switchParentTab = switchParentTab;
window.switchChildTab = switchChildTab;
window.toggleView = toggleView;
window.showAddToolModal = showAddToolModal;
window.closeAddToolModal = closeAddToolModal;
window.updateChildCategories = updateChildCategories;
window.saveToolForm = saveToolForm;
window.editTool = editTool;
window.deleteTool = deleteTool;
window.togglePin = togglePin;
window.toggleStar = toggleStar;
window.openTool = openTool;
window.toggleToolSelection = toggleToolSelection;
window.bulkPin = bulkPin;
window.bulkStar = bulkStar;
window.bulkDelete = bulkDelete;
window.clearSelection = clearSelection;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.importTools = importTools;
window.exportTools = exportTools;
window.closeImportToolsModal = closeImportToolsModal;
window.sortTools = sortTools;
window.filterToolsByStatus = filterToolsByStatus;
window.showCreateVaultModal = showCreateVaultModal;
window.closeCreateVaultModal = closeCreateVaultModal;
window.createNewVault = createNewVault;
window.switchToVault = switchToVault;
window.switchVaultParentTab = switchVaultParentTab;
window.switchVaultChildTab = switchVaultChildTab;
window.showAddEntryModal = showAddEntryModal;
window.closeAddEntryModal = closeAddEntryModal;
window.updateEntryFields = updateEntryFields;
window.saveVaultEntry = saveVaultEntry;
window.toggleEntryStarred = toggleEntryStarred;
window.toggleEntryPinned = toggleEntryPinned;
window.editVaultEntry = editVaultEntry;
window.deleteVaultEntry = deleteVaultEntry;
window.toggleVaultView = toggleVaultView;
window.filterVaultEntries = filterVaultEntries;
window.sortVaultEntries = sortVaultEntries;
window.exportVaultData = exportVaultData;
window.exportAllVaults = exportAllVaults;
window.importVaultData = importVaultData;
window.showVaultManagement = showVaultManagement;
window.closeVaultManagementModal = closeVaultManagementModal;
window.editVault = editVault;
window.duplicateVault = duplicateVault;
window.archiveVault = archiveVault;
window.deleteVault = deleteVault;
window.toggleAdvancedSearch = toggleAdvancedSearch;
window.shareProfile = shareProfile;
window.downloadConvertedData = downloadConvertedData;

// IMPORTANT: This multiVaultManager is crucial for TraceLink to get vault data
window.multiVaultManager = {
    getVaults: function() {
        return vaults;
    },
    getVaultById: function(vaultId) {
        return vaults.find(v => v.id === vaultId);
    },
    getEntryById: function(vaultId, entryId) {
        const vault = vaults.find(v => v.id === vaultId);
        if (vault) {
            return vault.entries.find(e => e.id === entryId);
        }
        return null;
    }
};
// Dispatch an event once multiVaultManager is defined and ready
document.dispatchEvent(new Event('multiVaultManagerReady'));



// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadVaults();
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
                const actorsSection = document.getElementById('actors');
                if (actorsSection && actorsSection.classList.contains('active')) {
                    applyFilters();
                }
            }, 300);
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const profileSection = document.getElementById('actor-profile');
            if (profileSection && profileSection.classList.contains('active')) {
                goBackToActors();
            }
            
            // Close modals (already handled more comprehensively in showSection, but good for direct escape)
            if (document.getElementById('addToolModal').style.display === 'flex') {
                closeAddToolModal();
            }
            if (document.getElementById('deleteModal').style.display === 'flex') {
                closeDeleteModal();
            }
            if (document.getElementById('importToolsModal').style.display === 'flex') {
                closeImportToolsModal();
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
                case '3':
                    e.preventDefault();
                    showSection('vault');
                    break;
            }
        }
    });
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    setupVaultSearch();
    
    // Setup file upload for MITRE import
    setupFileUpload();
    
    // Initialize Investigation Notes if the script is loaded
    if (typeof InvestigationNotes !== 'undefined') {
        window.investigationNotes = new InvestigationNotes();
    }
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
    document.querySelectorAll('.actor-card, .metric-card, .dashboard-card, .tool-card').forEach(el => {
        observer.observe(el);
    });
}

// Call observe elements after DOM updates
setTimeout(observeElements, 100);