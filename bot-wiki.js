/* ============================================
   OSINTRIX BOT WIKI — FULL INTELLIGENCE DATABASE
   Version: 1.4.0 | Updated: 2025-01
   ============================================ */

const BOT_WIKI_VERSION = '1.4.0';
const BOT_WIKI_UPDATED = 'January 2025';

/* ============================================
   COMPLETE BOT DATABASE
   ============================================ */
const BOT_DATABASE = [
    {
        id: 'googlebot',
        name: 'Googlebot',
        family: 'Search Engine Crawlers',
        author: 'Google LLC',
        classification: 'legitimate',
        riskScore: 'info',
        firstSeen: '1997-11',
        lastSeen: 'Active (ongoing)',
        version: '2.1',
        summary: 'Googlebot is Google\'s web crawling bot (spider) used to index pages for Google Search. It is one of the most common bots on the internet and is completely legitimate when properly verified. Operators can control its access via robots.txt. There are many impersonators of Googlebot, making verification critical.',
        recommendation: {
            action: 'allow',
            text: 'Allow verified Googlebot. Always verify via reverse DNS lookup (IP → hostname ending in .googlebot.com or .google.com, then forward DNS hostname → same IP). Unverified crawlers claiming to be Googlebot should be treated as suspicious and can be blocked.'
        },
        targets: ['All websites', 'E-commerce', 'News sites', 'Blogs'],
        techniques: ['HTTP crawling', 'Sitemap parsing', 'robots.txt compliance', 'Dynamic rendering (Googlebot renders JavaScript)'],
        userAgents: [
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
            'Googlebot-Image/1.0',
            'Googlebot-Video/1.0',
            'Googlebot-News',
            'APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)'
        ],
        iocs: [
            { type: 'ua', value: 'Googlebot/2.1', confidence: 'medium', note: 'Can be spoofed — verify via rDNS' },
            { type: 'asn', value: 'AS15169 (GOOGLE)', confidence: 'high', note: 'All legitimate Googlebot traffic' },
            { type: 'domain', value: '*.googlebot.com', confidence: 'high', note: 'Verified reverse DNS hostname' },
            { type: 'domain', value: '*.google.com', confidence: 'high', note: 'Alternate verified hostname' },
            { type: 'behavior', value: 'Respects robots.txt directives', confidence: 'high', note: 'Legitimate Googlebot always respects crawl directives' },
            { type: 'behavior', value: 'Does not execute login forms or POST requests for data theft', confidence: 'high', note: '' }
        ],
        timeline: [
            { date: '1997', event: 'Googlebot first deployed to index the early web for BackRub (precursor to Google).' },
            { date: '2003', event: 'Googlebot begins respecting Sitemaps protocol in addition to robots.txt.' },
            { date: '2014', event: 'Google announces Googlebot now renders JavaScript for indexing.' },
            { date: '2019', event: 'Googlebot moves to evergreen Chromium-based rendering engine.' },
            { date: '2023', event: 'Increased frequency of smartphone Googlebot for mobile-first indexing.' }
        ],
        behaviors: [
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Respects robots.txt and Crawl-delay directives.' },
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Performs reverse DNS verification — rDNS resolves to *.googlebot.com.' },
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Does not submit forms or exploit vulnerabilities.' },
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'Can cause significant server load if crawl budget is high — use rate limiting in robots.txt.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'IMPERSONATORS: Many malicious bots fake Googlebot UA. Always verify via reverse/forward DNS before trusting.' }
        ],
        mitigation: [
            { title: 'Verify via Reverse DNS', desc: 'Run: host <IP>. Confirm hostname ends in .googlebot.com or .google.com, then forward resolve to confirm match. Never trust the User-Agent alone.', priority: 'immediate' },
            { title: 'Control via robots.txt', desc: 'Use "User-agent: Googlebot" and "Disallow:" directives to limit crawl scope. Use "Crawl-delay" to reduce server load.', priority: 'high' },
            { title: 'Block Googlebot Impersonators', desc: 'Create server rules to block any IP claiming Googlebot UA that fails rDNS verification. Impersonators commonly perform scraping or reconnaissance.', priority: 'high' },
            { title: 'Use Google Search Console', desc: 'Monitor crawl stats, errors, and coverage via Google Search Console. Set preferred crawl rate if needed.', priority: 'medium' },
            { title: 'Noindex / Nofollow meta tags', desc: 'Use <meta name="robots" content="noindex,nofollow"> on sensitive pages you do not want indexed.', priority: 'low' }
        ],
        relatedBots: ['bingbot', 'duckduckbot', 'yandexbot'],
        detection: {
            signature: 'User-Agent contains "Googlebot" AND rDNS of source IP resolves to *.googlebot.com or *.google.com AND forward DNS of rDNS hostname matches source IP',
            yara: `rule Googlebot_UserAgent {
    meta:
        description = "Detects Googlebot user-agent string in HTTP logs"
        author = "OSINTrix Bot Wiki"
        date = "2025-01"
        classification = "legitimate"
        reference = "https://developers.google.com/search/docs/crawling-indexing/googlebot"
    strings:
        $ua1 = "Googlebot/2.1" ascii nocase
        $ua2 = "Googlebot-Image" ascii nocase
        $ua3 = "Googlebot-Video" ascii nocase
        $ua4 = "APIs-Google" ascii nocase
        $spoof_indicator = "Googlebot" ascii nocase
    condition:
        any of ($ua*) and not $spoof_indicator
}`,
            sigma: `title: Googlebot Impersonation Detection
id: a3b2c1d0-e4f5-6a7b-8c9d-0e1f2a3b4c5d
status: experimental
description: Detects requests claiming to be Googlebot from IPs not in Google ASN
author: OSINTrix Bot Wiki
date: 2025-01-01
references:
  - https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot
logsource:
  category: webserver
detection:
  selection:
    cs-user-agent|contains: 'Googlebot'
  filter_google_asn:
    c-ip|cidr:
      - '66.249.64.0/19'
      - '64.233.160.0/19'
      - '74.125.0.0/16'
  condition: selection and not filter_google_asn
falsepositives:
  - Test environments
  - Legitimate Google IPs not in filter list (update regularly)
level: medium
tags:
  - attack.reconnaissance
  - bot.impersonation`,
            nginx: `# Googlebot Verification - Allow verified, block impersonators
# Add to nginx.conf or site config

geo $is_google_ip {
    default 0;
    66.249.64.0/19  1;
    66.249.80.0/20  1;
    64.233.160.0/19 1;
    74.125.0.0/16   1;
    209.85.128.0/17 1;
    216.239.32.0/19 1;
}

map $http_user_agent $is_googlebot_ua {
    default         0;
    ~*[Gg]ooglebot  1;
}

# Block impersonators claiming to be Googlebot from non-Google IPs
location / {
    if ($is_googlebot_ua = 1) {
        set $check "googlebot_";
    }
    if ($is_google_ip = 0) {
        set $check "\${check}not_google_ip";
    }
    if ($check = "googlebot_not_google_ip") {
        return 403;  # Googlebot impersonator
    }
}`,
            apache: `# .htaccess - Allow verified Googlebot, block impersonators
# Requires mod_rewrite

<IfModule mod_rewrite.c>
RewriteEngine On

# Block Googlebot UA from non-Google IP ranges
RewriteCond %{HTTP_USER_AGENT} [Gg]ooglebot [NC]
RewriteCond %{REMOTE_ADDR} !^66\.249\.(6[4-9]|7[0-9]|8[0-9]|9[0-5])\.
RewriteCond %{REMOTE_ADDR} !^64\.233\.16[0-9]\.
RewriteCond %{REMOTE_ADDR} !^74\.125\.
RewriteRule ^ - [F,L]
</IfModule>`,
            cloudflare: `# Cloudflare Firewall Rule - Block Googlebot Impersonators
# Create in Cloudflare Dashboard > Security > WAF > Firewall Rules

# Expression:
(http.user_agent contains "Googlebot" and not ip.src in {66.249.64.0/19 66.249.80.0/20 64.233.160.0/19 74.125.0.0/16 209.85.128.0/17 216.239.32.0/19})

# Action: Block
# Priority: High`,
            modsecurity: `# ModSecurity Rule - Googlebot Impersonation
SecRule REQUEST_HEADERS:User-Agent "@contains Googlebot" \\
    "id:9001001,\\
    phase:1,\\
    deny,\\
    status:403,\\
    msg:'Googlebot Impersonation from non-Google IP',\\
    tag:'OWASP_CRS',\\
    tag:'BOT_IMPERSONATION',\\
    chain"
    SecRule REMOTE_ADDR "!@ipMatch 66.249.64.0/19,66.249.80.0/20,64.233.160.0/19,74.125.0.0/16,209.85.128.0/17"

SecAction \\
    "id:9001000,\\
    phase:1,\\
    nolog,\\
    pass,\\
    setvar:tx.googlebot_verified=0"`
        }
    },
    {
        id: 'ahrefsbot',
        name: 'AhrefsBot',
        family: 'SEO & Backlink Crawlers',
        author: 'Ahrefs Pte Ltd (Singapore)',
        classification: 'gray',
        riskScore: 'medium',
        firstSeen: '2011-06',
        lastSeen: 'Active (ongoing)',
        version: '7.0',
        summary: 'AhrefsBot is a commercial web crawler operated by Ahrefs, an SEO analytics company. It aggressively indexes the web to build a backlink database sold to SEO professionals. It is NOT a search engine and provides no direct indexing benefit to crawled sites. Its crawl rate is extremely high — often placing in the top 5 most active bots globally — which can significantly impact server resources. Many site operators choose to block it.',
        recommendation: {
            action: 'monitor',
            text: 'Block or rate-limit if bandwidth/server load is a concern. AhrefsBot respects robots.txt. Blocking provides no SEO penalty. Consider allowing if you use Ahrefs products and want data accuracy. For small sites and personal blogs with limited hosting, blocking is advisable.'
        },
        targets: ['All public websites', 'E-commerce', 'News', 'Blogs', 'SaaS'],
        techniques: ['High-frequency HTTP crawling', 'Backlink discovery', 'Content analysis', 'Anchor text extraction'],
        userAgents: [
            'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
            'Mozilla/5.0 (compatible; AhrefsBot/6.1; +http://ahrefs.com/robot/)'
        ],
        iocs: [
            { type: 'ua', value: 'AhrefsBot/7.0', confidence: 'high', note: 'Current version' },
            { type: 'ua', value: 'AhrefsBot/6.1', confidence: 'medium', note: 'Legacy version' },
            { type: 'asn', value: 'AS20473 (Choopa/Vultr)', confidence: 'medium', note: 'Primary hosting ASN' },
            { type: 'domain', value: '*.ahrefs.com', confidence: 'high', note: 'Operator domain' },
            { type: 'behavior', value: 'Extremely high crawl frequency (millions of pages/day)', confidence: 'high', note: 'Can cause measurable server load' },
            { type: 'behavior', value: 'Crawls at ~6 million pages per 24hr across the web', confidence: 'medium', note: 'Per Ahrefs public documentation' }
        ],
        timeline: [
            { date: '2011', event: 'Ahrefs launches AhrefsBot to build their Site Explorer backlink database.' },
            { date: '2014', event: 'AhrefsBot becomes one of the top 5 most active crawlers globally by request volume.' },
            { date: '2018', event: 'AhrefsBot 5.x released with improved politeness settings.' },
            { date: '2021', event: 'AhrefsBot 7.0 launches with faster crawling infrastructure.' },
            { date: '2023', event: 'Ahrefs launches own search engine; AhrefsBot increases scope of crawl.' }
        ],
        behaviors: [
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'Respects robots.txt Disallow and Crawl-delay directives.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Extremely aggressive crawl rate — can generate significant bandwidth costs and CPU load on shared hosting.' },
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'Collects data for a commercial product — site owners receive no direct SEO benefit from being crawled.' },
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Provides verified crawl information and respects opt-out at https://ahrefs.com/robot/' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Distributed across many IP ranges, making IP-based blocking complex without UA-based filtering.' }
        ],
        mitigation: [
            { title: 'Block via robots.txt (Recommended)', desc: 'Add to robots.txt:\nUser-agent: AhrefsBot\nDisallow: /\n\nThis is the simplest and most effective method. AhrefsBot respects this directive within ~24–48 hours.', priority: 'high' },
            { title: 'Server-level UA Block', desc: 'Block the User-Agent string at Nginx/Apache/Cloudflare level for immediate effect — robots.txt can take time to propagate. Use pattern matching on "AhrefsBot".', priority: 'high' },
            { title: 'Rate Limiting', desc: 'If you want Ahrefs to crawl but at lower frequency, set a crawl-delay in robots.txt: Crawl-delay: 10 (10 seconds between requests)', priority: 'medium' },
            { title: 'Cloudflare Bot Management', desc: 'Use Cloudflare Bot Fight Mode or WAF rules to identify and throttle SEO crawler traffic. "Verified Bots" can be selectively allowed.', priority: 'medium' },
            { title: 'Monitor Bandwidth', desc: 'Review access logs monthly for AhrefsBot request volume. If it exceeds 1% of your total traffic, consider blocking.', priority: 'low' }
        ],
        relatedBots: ['semrushbot', 'mj12bot', 'dotbot'],
        detection: {
            signature: 'User-Agent contains "AhrefsBot" AND request rate > threshold',
            yara: `rule AhrefsBot_Crawler {
    meta:
        description = "Detects AhrefsBot SEO crawler in HTTP logs"
        author = "OSINTrix Bot Wiki"
        date = "2025-01"
        classification = "gray"
        risk = "medium"
    strings:
        $ua1 = "AhrefsBot" ascii nocase
        $ua2 = "ahrefs.com/robot" ascii nocase
    condition:
        any of ($ua*)
}`,
            sigma: `title: AhrefsBot High-Volume Crawling Detection
id: b4c3d2e1-f5a6-7b8c-9d0e-1f2a3b4c5d6e
status: stable
description: Detects AhrefsBot crawling activity, especially at high volume
author: OSINTrix Bot Wiki
date: 2025-01-01
logsource:
  category: webserver
detection:
  selection:
    cs-user-agent|contains: 'AhrefsBot'
  condition: selection
falsepositives:
  - Legitimate SEO monitoring
level: low
tags:
  - bot.seo
  - bot.aggressive_crawler`,
            nginx: `# Block AhrefsBot in Nginx
# Add inside http{} block or server{} block

map $http_user_agent $block_ahrefs {
    default     0;
    ~*AhrefsBot 1;
}

server {
    # ...
    if ($block_ahrefs) {
        return 403;
    }
    # Or return 410 (Gone) to signal the page won't return
    # Or return 200 with an empty body to waste crawler resources
}`,
            apache: `# .htaccess - Block AhrefsBot
# Works in Apache 2.x

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} AhrefsBot [NC]
RewriteRule .* - [F,L]
</IfModule>

# Alternative using BrowserMatchNoCase:
BrowserMatchNoCase "AhrefsBot" bad_bot
Order Allow,Deny
Allow from all
Deny from env=bad_bot`,
            cloudflare: `# Cloudflare WAF - Block AhrefsBot
# Firewall Rules > Create Rule

# Expression:
(http.user_agent contains "AhrefsBot")

# Action: Block (or Challenge if you want CAPTCHA)
# Priority: Medium

# Note: You can also go to Cloudflare Dashboard >
# Security > Bots > Configure "AhrefsBot" verified bot
# and set action to Block.`,
            modsecurity: `# ModSecurity - Block AhrefsBot
SecRule REQUEST_HEADERS:User-Agent "@contains AhrefsBot" \\
    "id:9002001,\\
    phase:1,\\
    deny,\\
    status:403,\\
    msg:'AhrefsBot SEO Crawler Blocked',\\
    tag:'SEO_CRAWLER',\\
    tag:'BOT_GRAY'"

# Rate-limit alternative instead of hard block:
SecRule REQUEST_HEADERS:User-Agent "@contains AhrefsBot" \\
    "id:9002002,\\
    phase:1,\\
    pass,\\
    setvar:ip.ahrefs_count=+1,\\
    expirevar:ip.ahrefs_count=60"

SecRule IP:AHREFS_COUNT "@gt 10" \\
    "id:9002003,\\
    phase:1,\\
    deny,\\
    status:429"`
        }
    },
    {
        id: 'scrapy',
        name: 'Scrapy Generic Scraper',
        family: 'Web Scraping Frameworks',
        author: 'Unknown / Various threat actors',
        classification: 'malicious',
        riskScore: 'high',
        firstSeen: '2013-01',
        lastSeen: 'Active (ongoing)',
        version: 'Multiple versions',
        summary: 'Scrapy is a legitimate open-source Python web scraping framework, but generic unidentified Scrapy bots in logs typically indicate unauthorized scraping activity. Unlike legitimate bots, generic Scrapy deployments often harvest pricing data, personal information, product catalogs, email addresses, or copyrighted content. They frequently ignore robots.txt, use rotating IPs/proxies, and attempt to evade detection. This profile covers malicious/unauthorized Scrapy deployments.',
        recommendation: {
            action: 'block',
            text: 'Block generic Scrapy User-Agent strings immediately. Legitimate operators using Scrapy will typically modify the default UA to identify themselves. Default "Scrapy" UA in access logs almost always indicates unauthorized scraping. Implement rate limiting and honeypot traps as additional countermeasures.'
        },
        targets: ['E-commerce (price scraping)', 'Job boards', 'Real estate listings', 'Legal & news databases', 'Social platforms', 'Any site with structured data'],
        techniques: ['High-speed parallel HTTP requests', 'robots.txt violation', 'IP rotation via proxies', 'Session cookie evasion', 'JavaScript bypass (via Splash/Playwright integration)', 'Anti-detection techniques'],
        userAgents: [
            'Scrapy/1.0 (+https://scrapy.org)',
            'Scrapy/2.0',
            'Scrapy/2.11.2 (+https://scrapy.org)',
            'Python-urllib/3.x',
            'python-requests/2.x'
        ],
        iocs: [
            { type: 'ua', value: 'Scrapy/', confidence: 'high', note: 'Default Scrapy UA — almost always unauthorized' },
            { type: 'ua', value: 'Python-urllib/', confidence: 'medium', note: 'Common after UA rotation' },
            { type: 'ua', value: 'python-requests/', confidence: 'medium', note: 'Common after UA rotation' },
            { type: 'behavior', value: 'High request rate to structured data pages (product listings, search results)', confidence: 'high', note: '' },
            { type: 'behavior', value: 'Sequential crawling patterns — URL iteration (?page=1, ?page=2...)', confidence: 'high', note: '' },
            { type: 'behavior', value: 'Missing typical browser headers (Accept-Language, Accept-Encoding)', confidence: 'medium', note: '' },
            { type: 'behavior', value: 'Requests from data center ASNs (OVH, DigitalOcean, Hetzner, AWS)', confidence: 'medium', note: '' },
            { type: 'ip', value: 'Residential proxy ranges (varies)', confidence: 'low', note: 'Sophisticated scrapers use residential proxies' }
        ],
        timeline: [
            { date: '2013', event: 'Scrapy framework open-sourced; immediately adopted for both legitimate and unauthorized scraping.' },
            { date: '2016', event: 'Rise of scraping-as-a-service platforms built on Scrapy. Price scraping becomes common competitive attack.' },
            { date: '2019', event: 'Scrapy-Playwright and Scrapy-Splash integrations enable JavaScript rendering for scraping dynamic sites.' },
            { date: '2021', event: 'Mass adoption of residential proxy services enables Scrapy deployments that evade IP-based blocks.' },
            { date: '2024', event: 'Scrapy-based AI training data harvesting surges; sites targeted for LLM corpus creation without consent.' }
        ],
        behaviors: [
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Often ignores robots.txt — explicitly check logs for crawl of Disallowed paths.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Very high concurrency (tens to hundreds of simultaneous requests) causing server load spikes.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Systematic URL enumeration — crawls paginated results, product IDs, or sequential paths.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Abnormal HTTP header fingerprint — missing Accept, Accept-Language, Referer headers common in browsers.' },
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'Note: Scrapy is a legitimate tool. Block the behavior and default UA, not just the framework name.' }
        ],
        mitigation: [
            { title: 'Block Default Scrapy User-Agent', desc: 'Immediately block any request with "Scrapy" in the User-Agent. Legitimate Scrapy users configure custom UAs. Add to server config or WAF.', priority: 'immediate' },
            { title: 'Implement Rate Limiting', desc: 'Limit requests per IP to reasonable thresholds (e.g., 60 requests/min). Return 429 Too Many Requests. Use Nginx limit_req or Cloudflare Rate Limiting.', priority: 'immediate' },
            { title: 'Deploy Honeypot Links', desc: 'Add hidden links (display:none or comment) to pages. Any bot following them is definitively a scraper ignoring visible content rules. Auto-ban the IP.', priority: 'high' },
            { title: 'Header Anomaly Detection', desc: 'Block or challenge requests missing standard browser headers like Accept-Language or Sec-Fetch-Site. Script-based scrapers rarely include these correctly.', priority: 'high' },
            { title: 'CAPTCHA on High-Value Pages', desc: 'Deploy CAPTCHA or JS challenge (Cloudflare Turnstile, hCaptcha) on pricing pages, search results, or data-rich pages that are scraper targets.', priority: 'medium' },
            { title: 'Anti-Scraping Platform', desc: 'For high-impact scraping: consider DataDome, Kasada, or Cloudflare Bot Management for ML-based scraper detection that catches even sophisticated evasion.', priority: 'medium' },
            { title: 'Monitor for Data Exfiltration Patterns', desc: 'Alert on single IPs that access > N unique product/listing pages per hour. This pattern is a near-certain indicator of scraping.', priority: 'high' }
        ],
        relatedBots: ['python-requests', 'curl-scraper', 'headless-chrome'],
        detection: {
            signature: 'User-Agent contains "Scrapy" OR missing Accept-Language header AND high request rate from single IP/ASN',
            yara: `rule Scrapy_Scraper_Detection {
    meta:
        description = "Detects Scrapy-based web scraper by default user-agent"
        author = "OSINTrix Bot Wiki"
        date = "2025-01"
        classification = "malicious"
        risk = "high"
        reference = "https://scrapy.org"
    strings:
        $ua_scrapy1 = "Scrapy/" ascii nocase
        $ua_scrapy2 = "scrapy.org" ascii nocase
        $ua_python1 = "Python-urllib" ascii nocase
        $ua_python2 = "python-requests" ascii nocase
        $scrapy_header = "X-Scrapy" ascii
    condition:
        any of ($ua_scrapy*) or
        ($ua_python1 and $scrapy_header) or
        ($ua_python2 and $scrapy_header)
}`,
            sigma: `title: Scrapy Web Scraper Activity
id: c5d4e3f2-a6b7-8c9d-0e1f-2a3b4c5d6e7f
status: stable
description: Detects Scrapy framework usage in web server logs indicating potential unauthorized scraping
author: OSINTrix Bot Wiki
date: 2025-01-01
logsource:
  category: webserver
detection:
  selection_scrapy_ua:
    cs-user-agent|contains:
      - 'Scrapy/'
      - 'scrapy.org'
  selection_python_ua:
    cs-user-agent|contains:
      - 'Python-urllib'
      - 'python-requests'
  filter_legitimate:
    cs-uri-query|contains: 'bot'
  condition: (selection_scrapy_ua or selection_python_ua) and not filter_legitimate
falsepositives:
  - Legitimate API clients using requests library
  - Internal monitoring scripts
level: high
tags:
  - attack.collection
  - attack.t1119
  - bot.scraper
  - bot.malicious`,
            nginx: `# Nginx - Block Scrapy and Common Scraper UAs
# Add to http{} or server{} block

map $http_user_agent $block_scraper {
    default         0;
    ~*[Ss]crapy     1;
    ~*Python-urllib 1;
    # Be careful blocking python-requests broadly - may affect APIs
    # ~*python-requests 1;
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;

server {
    # Block known scraper UAs
    if ($block_scraper) {
        return 403;
    }
    
    # Rate limiting on product/data pages
    location ~* \\.(json|csv|xml)$ {
        limit_req zone=api_limit burst=5 nodelay;
        # ... other config
    }
    
    location /products/ {
        limit_req zone=api_limit burst=10;
        # ... other config
    }
}`,
            apache: `# .htaccess - Block Scrapy Scrapers
<IfModule mod_rewrite.c>
RewriteEngine On

# Block Scrapy UA
RewriteCond %{HTTP_USER_AGENT} Scrapy [NC]
RewriteRule .* - [F,L]

# Block Python scraping libraries
RewriteCond %{HTTP_USER_AGENT} Python-urllib [NC]
RewriteRule .* - [F,L]

# Optional: Block requests missing Accept header (common in script scrapers)
RewriteCond %{HTTP_ACCEPT} ^$
RewriteCond %{HTTP_USER_AGENT} !^Mozilla
RewriteRule .* - [F,L]
</IfModule>

# Rate limiting requires mod_ratelimit or mod_qos`,
            cloudflare: `# Cloudflare WAF Rule - Block Scrapy
# Security > WAF > Custom Rules

# Rule 1: Block default Scrapy UA
# Expression:
(http.user_agent contains "Scrapy")
# Action: Block

# Rule 2: Rate limit on data-heavy pages
# Expression:
(http.request.uri.path contains "/products" or
 http.request.uri.path contains "/search" or
 http.request.uri.path contains "/listings")
# Action: Rate Limit - 60 requests per minute

# Rule 3: Challenge requests missing browser headers
# Expression:
(not http.request.headers.names contains "Accept-Language" and
 not cf.client.bot)
# Action: Managed Challenge`,
            modsecurity: `# ModSecurity Rules - Block Scrapy
# Rule 1: Block Scrapy user-agent
SecRule REQUEST_HEADERS:User-Agent "@rx [Ss]crapy" \\
    "id:9003001,\\
    phase:1,\\
    deny,\\
    status:403,\\
    msg:'Scrapy Scraper Detected',\\
    tag:'BOT_MALICIOUS',\\
    tag:'SCRAPER',\\
    severity:'HIGH'"

# Rule 2: Detect missing standard browser headers
SecRule &REQUEST_HEADERS:Accept-Language "@eq 0" \\
    "id:9003002,\\
    phase:1,\\
    pass,\\
    setvar:tx.scraper_score=+1"

SecRule &REQUEST_HEADERS:Accept "@eq 0" \\
    "id:9003003,\\
    phase:1,\\
    pass,\\
    setvar:tx.scraper_score=+1"

SecRule TX:SCRAPER_SCORE "@gt 1" \\
    "id:9003004,\\
    phase:1,\\
    deny,\\
    status:403,\\
    msg:'Headless Scraper Detected by Header Anomaly',\\
    tag:'BOT_MALICIOUS'"

# Rule 3: Rate limiting
SecAction \\
    "id:9003005,\\
    phase:1,\\
    pass,\\
    initcol:ip=%{REMOTE_ADDR},\\
    setvar:ip.req_count=+1,\\
    expirevar:ip.req_count=60"

SecRule IP:REQ_COUNT "@gt 100" \\
    "id:9003006,\\
    phase:1,\\
    deny,\\
    status:429,\\
    msg:'Rate Limit Exceeded'"

`
        }
    },
    {
        id: 'bingbot',
        name: 'Bingbot',
        family: 'Search Engine Crawlers',
        author: 'Microsoft Corporation',
        classification: 'legitimate',
        riskScore: 'info',
        firstSeen: '2010-05',
        lastSeen: 'Active (ongoing)',
        version: '2.0',
        summary: 'Bingbot is Microsoft\'s web crawler for the Bing search engine and associated Microsoft products including Bing News, Bing Shopping, and Cortana. Like Googlebot, it should be verified via reverse DNS before being trusted. Verified Bingbot is completely benign. Unverified requests claiming to be Bingbot are potentially malicious scrapers or reconnaissance tools.',
        recommendation: {
            action: 'allow',
            text: 'Allow verified Bingbot. Verify via reverse DNS: IP should resolve to *.search.msn.com, then forward-resolve to the same IP. Block any Bingbot UA from non-Microsoft IP ranges. Bingbot provides SEO value for Bing search ranking — blocking it will remove your site from Bing search results.'
        },
        targets: ['All public websites', 'News sites', 'E-commerce', 'Blogs'],
        techniques: ['HTTP crawling', 'Sitemap parsing', 'robots.txt compliance', 'JavaScript rendering'],
        userAgents: [
            'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/W.X.Y.Z Safari/537.36'
        ],
        iocs: [
            { type: 'ua', value: 'bingbot/2.0', confidence: 'medium', note: 'Always verify via rDNS' },
            { type: 'domain', value: '*.search.msn.com', confidence: 'high', note: 'Verified reverse DNS hostname' },
            { type: 'asn', value: 'AS8075 (Microsoft)', confidence: 'high', note: 'Primary Microsoft ASN' },
            { type: 'asn', value: 'AS8068 (Microsoft)', confidence: 'high', note: 'Secondary Microsoft ASN' },
            { type: 'behavior', value: 'Respects robots.txt and Crawl-delay', confidence: 'high', note: '' }
        ],
        timeline: [
            { date: '2009', event: 'MSNBot rebranded and succeeded by Bingbot as Microsoft launched Bing search engine.' },
            { date: '2010', event: 'Bingbot 2.0 formally released with improved politeness and robots.txt support.' },
            { date: '2015', event: 'Bingbot begins supporting XML Sitemaps more comprehensively.' },
            { date: '2020', event: 'Bingbot gains JavaScript rendering capabilities similar to Googlebot.' },
            { date: '2023', event: 'Bingbot activity increases significantly following Microsoft\'s OpenAI integration into Bing.' }
        ],
        behaviors: [
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Fully respects robots.txt including Crawl-delay directives.' },
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Reverse DNS verifiable — resolves to *.search.msn.com from Microsoft ASNs.' },
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'May crawl at high frequency on popular or rapidly-updating sites.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Bingbot impersonation is common — verify all claimed Bingbot traffic.' }
        ],
        mitigation: [
            { title: 'Verify via Reverse DNS', desc: 'Execute: host <IP>. Verify result ends in .search.msn.com. Forward resolve the hostname and confirm it matches original IP.', priority: 'immediate' },
            { title: 'Block Bingbot Impersonators', desc: 'Block any IP claiming to be Bingbot that does not originate from Microsoft ASN (AS8075, AS8068, AS3598). Impersonators use Bingbot UA to appear legitimate.', priority: 'high' },
            { title: 'Use Bing Webmaster Tools', desc: 'Monitor crawl stats and adjust crawl rate via Bing Webmaster Tools (webmaster.bing.com). Provides direct control over Bingbot behavior.', priority: 'medium' },
            { title: 'Optimize robots.txt', desc: 'Use specific Bingbot directives if needed: User-agent: bingbot / Crawl-delay: 5', priority: 'low' }
        ],
        relatedBots: ['googlebot', 'yandexbot', 'msnbot'],
        detection: {
            signature: 'User-Agent contains "bingbot" AND rDNS resolves to *.search.msn.com AND forward DNS matches',
            yara: `rule Bingbot_UserAgent {
    meta:
        description = "Detects Bingbot user-agent string in HTTP logs"
        author = "OSINTrix Bot Wiki"
        date = "2025-01"
        classification = "legitimate"
    strings:
        $ua1 = "bingbot/2.0" ascii nocase
        $ua2 = "bing.com/bingbot" ascii nocase
        $ua3 = "MSNBot" ascii
    condition:
        any of ($ua*)
}`,
            sigma: `title: Bingbot Impersonation Detection
id: d6e5f4a3-b7c8-9d0e-1f2a-3b4c5d6e7f8a
status: experimental
description: Detects requests claiming to be Bingbot from non-Microsoft IP ranges
author: OSINTrix Bot Wiki
date: 2025-01-01
logsource:
  category: webserver
detection:
  selection:
    cs-user-agent|contains|all:
      - 'bingbot'
  filter_msft:
    c-ip|cidr:
      - '40.77.167.0/24'
      - '207.46.0.0/16'
      - '157.54.0.0/15'
  condition: selection and not filter_msft
falsepositives:
  - Legitimate Microsoft IPs not in filter list
level: medium`,
            nginx: `# Nginx - Bingbot Verification
geo $is_msft_ip {
    default 0;
    40.77.167.0/24  1;
    207.46.0.0/16   1;
    157.54.0.0/15   1;
    157.60.0.0/16   1;
    65.52.0.0/14    1;
}

map $http_user_agent $is_bingbot_ua {
    default 0;
    ~*bingbot 1;
}

location / {
    if ($is_bingbot_ua = 1) {
        set $bingcheck "bingbot_";
    }
    if ($is_msft_ip = 0) {
        set $bingcheck "\${bingcheck}non_msft";
    }
    if ($bingcheck = "bingbot_non_msft") {
        return 403;
    }
}`,
            apache: `# .htaccess - Block Bingbot from non-Microsoft IPs
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} bingbot [NC]
RewriteCond %{REMOTE_ADDR} !^40\.77\.167\.
RewriteCond %{REMOTE_ADDR} !^207\.46\.
RewriteCond %{REMOTE_ADDR} !^157\.54\.
RewriteRule ^ - [F,L]
</IfModule>`,
            cloudflare: `# Cloudflare WAF - Block Bingbot Impersonators
# Expression:
(http.user_agent contains "bingbot" and not ip.src in {40.77.167.0/24 207.46.0.0/16 157.54.0.0/15 65.52.0.0/14})

# Action: Block`,
            modsecurity: `# ModSecurity - Bingbot Impersonation
SecRule REQUEST_HEADERS:User-Agent "@contains bingbot" \\
    "id:9004001,\\
    phase:1,\\
    deny,\\
    status:403,\\
    msg:'Bingbot Impersonation from non-Microsoft IP',\\
    tag:'BOT_IMPERSONATION',\\
    chain"
    SecRule REMOTE_ADDR "!@ipMatch 40.77.167.0/24,207.46.0.0/16,157.54.0.0/15"`
        }
    },
    {
        id: 'chatgpt-user',
        name: 'ChatGPT-User / GPTBot',
        family: 'AI Training & Content Crawlers',
        author: 'OpenAI',
        classification: 'gray',
        riskScore: 'medium',
        firstSeen: '2023-08',
        lastSeen: 'Active (ongoing)',
        version: '1.0',
        summary: 'OpenAI operates two distinct crawlers: GPTBot collects data for training AI models, and ChatGPT-User fetches real-time information for ChatGPT\'s browsing features. Both are controversial — GPTBot harvests content for AI training without explicit consent or compensation, while ChatGPT-User can send significant traffic when many users query the same topic. Many publishers and content creators block GPTBot to protect their content from being used in AI training data without consent or licensing.',
        recommendation: {
            action: 'monitor',
            text: 'Block GPTBot if you do not want your content used for AI training data (legitimate and ethical choice). Allow ChatGPT-User if you want ChatGPT to cite and link to your content in real-time responses. Both bots respect robots.txt. Many news organizations and publishers now block GPTBot by default.'
        },
        targets: ['News sites', 'Blogs', 'Academic content', 'Creative writing platforms', 'Code repositories', 'Any public text content'],
        techniques: ['Content harvesting for LLM training', 'Real-time content fetching', 'HTTP crawling with politeness'],
        userAgents: [
            'GPTBot/1.0 (+https://openai.com/gptbot)',
            'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot',
            'ChatGPT-User/1.0 (+https://openai.com/bot)'
        ],
        iocs: [
            { type: 'ua', value: 'GPTBot/1.0', confidence: 'high', note: 'AI training data crawler' },
            { type: 'ua', value: 'ChatGPT-User/1.0', confidence: 'high', note: 'Real-time browsing bot' },
            { type: 'asn', value: 'AS14618 (Amazon/OpenAI infrastructure)', confidence: 'medium', note: 'Primary hosting' },
            { type: 'domain', value: '20.15.133.0/24', confidence: 'medium', note: 'Known OpenAI IP range' },
            { type: 'behavior', value: 'Focuses on text-rich pages — articles, blog posts, documentation', confidence: 'high', note: '' }
        ],
        timeline: [
            { date: '2023-08', event: 'OpenAI announces GPTBot, their web crawling bot for AI training, with opt-out via robots.txt.' },
            { date: '2023-09', event: 'Major publishers (NYT, CNN, Reuters) begin blocking GPTBot following announcements.' },
            { date: '2023-10', event: 'ChatGPT-User bot appears — distinct from GPTBot, used for real-time browsing.' },
            { date: '2024-02', event: 'OpenAI\'s lawsuit with NYT reveals scale of content harvesting for GPT training data.' },
            { date: '2024-06', event: 'Reddit, Wikipedia begin restricting AI crawlers amid licensing disputes.' }
        ],
        behaviors: [
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'GPTBot: Respects robots.txt — add "User-agent: GPTBot / Disallow: /" to opt out.' },
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'Content is used to train commercial AI products without compensation to content creators.' },
            { type: 'normal', icon: 'fas fa-check-circle', text: 'Does not perform DDoS, data exfiltration of user PII, or exploit vulnerabilities.' },
            { type: 'suspicious', icon: 'fas fa-exclamation-triangle', text: 'Legal and ethical gray area: using published content without explicit consent for commercial AI training is contested by creators and publishers.' },
            { type: 'neutral', icon: 'fas fa-exclamation-circle', text: 'ChatGPT-User can drive real traffic to your site when ChatGPT cites your content — this may be desirable.' }
        ],
        mitigation: [
            { title: 'Block GPTBot via robots.txt (Opt-out)', desc: 'Add to your robots.txt:\nUser-agent: GPTBot\nDisallow: /\n\nThis is the officially supported opt-out method. Takes effect within days.', priority: 'high' },
            { title: 'Differentiate GPTBot vs ChatGPT-User', desc: 'Consider blocking GPTBot (training) but allowing ChatGPT-User (browsing/citations). Use separate robots.txt rules or server-level UA filtering.', priority: 'high' },
            { title: 'Server-Level Block for Immediate Effect', desc: 'Block at Nginx/Apache/Cloudflare for immediate effect, as robots.txt changes may take time. Target "GPTBot" UA string.', priority: 'medium' },
            { title: 'Consider Licensing Agreement', desc: 'OpenAI offers licensing agreements to publishers. If you produce significant content volume, contact OpenAI about terms before outright blocking.', priority: 'low' },
            { title: 'Monitor AI Crawler Traffic', desc: 'Periodically review access logs for GPTBot, Common Crawl (CCBot), Anthropic (ClaudeBot), and other AI crawlers. Decide policy per crawler.', priority: 'medium' }
        ],
        relatedBots: ['claudebot', 'ccbot', 'meta-externalagent'],
        detection: {
            signature: 'User-Agent contains "GPTBot" OR "ChatGPT-User" from OpenAI IP ranges',
            yara: `rule OpenAI_Crawlers {
    meta:
        description = "Detects OpenAI web crawlers (GPTBot, ChatGPT-User)"
        author = "OSINTrix Bot Wiki"
        date = "2025-01"
        classification = "gray"
        risk = "medium"
        reference = "https://openai.com/gptbot"
    strings:
        $ua1 = "GPTBot" ascii nocase
        $ua2 = "ChatGPT-User" ascii nocase
        $ua3 = "openai.com/gptbot" ascii nocase
        $ua4 = "openai.com/bot" ascii nocase
    condition:
        any of ($ua*)
}`,
            sigma: `title: OpenAI AI Crawler Detection
id: e7f6a5b4-c8d9-0e1f-2a3b-4c5d6e7f8a9b
status: stable
description: Detects OpenAI GPTBot and ChatGPT-User crawlers for content harvesting awareness
author: OSINTrix Bot Wiki
date: 2025-01-01
logsource:
  category: webserver
detection:
  selection:
    cs-user-agent|contains:
      - 'GPTBot'
      - 'ChatGPT-User'
  condition: selection
falsepositives:
  - Intentionally allowed OpenAI crawling
level: low
tags:
  - bot.ai_crawler
  - bot.gray`,
            nginx: `# Nginx - Block GPTBot, allow ChatGPT-User
map $http_user_agent $block_gptbot {
    default 0;
    ~*GPTBot 1;
}

# Separate map for ChatGPT-User (real-time browsing)
map $http_user_agent $is_chatgpt_user {
    default 0;
    ~*ChatGPT-User 1;
}

server {
    # Block GPTBot training crawler
    if ($block_gptbot) {
        return 403;
    }
    # ChatGPT-User allowed (drives traffic to your site)
    # If you also want to block it, add:
    # if ($is_chatgpt_user) { return 403; }
}`,
            apache: `# .htaccess - Block GPTBot (AI training crawler)
# Keep or remove ChatGPT-User based on preference

<IfModule mod_rewrite.c>
RewriteEngine On

# Block GPTBot (AI training data harvesting)
RewriteCond %{HTTP_USER_AGENT} GPTBot [NC]
RewriteRule .* - [F,L]

# Optionally block ChatGPT-User (real-time browsing)
# RewriteCond %{HTTP_USER_AGENT} ChatGPT-User [NC]
# RewriteRule .* - [F,L]
</IfModule>`,
            cloudflare: `# Cloudflare WAF - Block OpenAI Crawlers
# Expression for GPTBot only:
(http.user_agent contains "GPTBot")

# Expression for all OpenAI bots:
(http.user_agent contains "GPTBot" or http.user_agent contains "ChatGPT-User")

# Action: Block

# Note: Cloudflare also has "Bot Fight Mode" > 
# "AI Scrapers and Crawlers" toggle in newer plans`,
            modsecurity: `# ModSecurity - Block OpenAI AI Training Crawlers
SecRule REQUEST_HEADERS:User-Agent "@rx (GPTBot|ChatGPT-User)" \\
    "id:9005001,\\
    phase:1,\\
    deny,\\
    status:403,\\
    msg:'OpenAI AI Training Crawler Blocked',\\
    tag:'BOT_AI_CRAWLER',\\
    tag:'BOT_GRAY',\\
    severity:'NOTICE'"

# Log-only variant (just monitor, don't block):
SecRule REQUEST_HEADERS:User-Agent "@rx (GPTBot|ChatGPT-User)" \\
    "id:9005002,\\
    phase:1,\\
    pass,\\
    log,\\
    msg:'OpenAI Crawler Activity Logged',\\
    tag:'BOT_AI_CRAWLER'"`
        }
    }
];

/* ============================================
   BOT WIKI UI — STATE
   ============================================ */
let selectedBotId = null;
let activeFilter = 'all';
let searchQuery = '';
let activeTabId = 'overview';
let openRuleBlocks = new Set();

/* ============================================
   INIT
   ============================================ */
function initBotWiki() {
    renderBotList();
    setupBotWikiSearch();
    setupBotWikiFilters();
}

/* ============================================
   RENDER BOT LIST
   ============================================ */
function renderBotList() {
    const list = document.getElementById('bw-bot-list');
    if (!list) return;

    const filtered = BOT_DATABASE.filter(bot => {
        const matchFilter = activeFilter === 'all' || bot.classification === activeFilter;
        const matchSearch = !searchQuery || 
            bot.name.toLowerCase().includes(searchQuery) ||
            bot.family.toLowerCase().includes(searchQuery) ||
            bot.author.toLowerCase().includes(searchQuery);
        return matchFilter && matchSearch;
    });

    list.innerHTML = filtered.length === 0
        ? `<div style="padding:20px;text-align:center;color:#475569;font-size:0.82rem;">No bots match current filters.</div>`
        : filtered.map(bot => `
            <div class="bw-bot-item ${selectedBotId === bot.id ? 'active' : ''}" 
                 onclick="selectBot('${bot.id}')">
                <div class="bw-bot-dot dot-${bot.classification}"></div>
                <div class="bw-bot-info">
                    <div class="bw-bot-name">${bot.name}</div>
                    <div class="bw-bot-family">${bot.family}</div>
                </div>
                <span class="bw-risk-badge risk-${bot.riskScore}">${bot.riskScore}</span>
            </div>
        `).join('');

    // Update stats
    const statsEl = document.getElementById('bw-stats');
    if (statsEl) {
        const legit = BOT_DATABASE.filter(b => b.classification === 'legitimate').length;
        const gray = BOT_DATABASE.filter(b => b.classification === 'gray').length;
        const mal = BOT_DATABASE.filter(b => b.classification === 'malicious').length;
        statsEl.innerHTML = `
            <span style="color:#4ade80"><i class="fas fa-circle"></i> ${legit} Safe</span>
            <span style="color:#fbbf24"><i class="fas fa-circle"></i> ${gray} Gray</span>
            <span style="color:#f87171"><i class="fas fa-circle"></i> ${mal} Threat</span>
        `;
    }
}

/* ============================================
   SELECT & RENDER BOT DETAIL
   ============================================ */
function selectBot(id) {
    selectedBotId = id;
    activeTabId = 'overview';
    openRuleBlocks.clear();
    renderBotList();
    renderBotDetail(id);
}

function renderBotDetail(id) {
    const bot = BOT_DATABASE.find(b => b.id === id);
    const container = document.getElementById('bw-detail-container');
    if (!bot || !container) return;

    const classIcon = { legitimate: 'fas fa-check-circle', gray: 'fas fa-exclamation-triangle', malicious: 'fas fa-skull' };
    const recIcon = { allow: 'fas fa-check-circle', monitor: 'fas fa-eye', block: 'fas fa-ban' };

    container.innerHTML = `
        <!-- Header -->
        <div class="bw-detail-header">
            <div class="bw-detail-title-row">
                <div>
                    <div class="bw-detail-name">
                        ${bot.name}
                        <span class="bw-classification-badge badge-${bot.classification}">
                            <i class="${classIcon[bot.classification]}"></i> ${bot.classification}
                        </span>
                        <span class="bw-risk-badge risk-${bot.riskScore}" style="font-size:0.72rem">
                            ${bot.riskScore.toUpperCase()} RISK
                        </span>
                    </div>
                    <div class="bw-detail-meta">
                        <span class="bw-meta-item"><i class="fas fa-users"></i><strong>Author:</strong> ${bot.author}</span>
                        <span class="bw-meta-item"><i class="fas fa-layer-group"></i><strong>Family:</strong> ${bot.family}</span>
                        <span class="bw-meta-item"><i class="fas fa-calendar-alt"></i><strong>First Seen:</strong> ${bot.firstSeen}</span>
                        <span class="bw-meta-item"><i class="fas fa-satellite-dish"></i><strong>Last Active:</strong> ${bot.lastSeen}</span>
                    </div>
                </div>
                <div class="bw-detail-actions">
                    <button class="bw-action-btn secondary" onclick="exportBotProfile('${bot.id}')">
                        <i class="fas fa-download"></i> Export
                    </button>
                    <button class="bw-action-btn primary" onclick="copyAllRules('${bot.id}')">
                        <i class="fas fa-copy"></i> Copy All Rules
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="bw-tabs">
            <div class="bw-tab active" data-tab="overview" onclick="switchBotTab('overview')">
                <i class="fas fa-info-circle"></i> Overview
            </div>
            <div class="bw-tab" data-tab="detection" onclick="switchBotTab('detection')">
                <i class="fas fa-crosshairs"></i> Detection Rules
            </div>
            <div class="bw-tab" data-tab="behavior" onclick="switchBotTab('behavior')">
                <i class="fas fa-chart-bar"></i> Behavior
            </div>
            <div class="bw-tab" data-tab="mitigation" onclick="switchBotTab('mitigation')">
                <i class="fas fa-shield-alt"></i> Mitigation
            </div>
            <div class="bw-tab" data-tab="iocs" onclick="switchBotTab('iocs')">
                <i class="fas fa-fingerprint"></i> IOCs
            </div>
        </div>

        <!-- Tab Panels -->
        <div class="bw-tab-content">
            ${renderOverviewTab(bot)}
            ${renderDetectionTab(bot)}
            ${renderBehaviorTab(bot)}
            ${renderMitigationTab(bot)}
            ${renderIOCsTab(bot)}
        </div>

        <!-- Footer -->
        <div class="bw-dataset-footer">
            <span>OSINTrix Bot Wiki <span class="bw-version-badge">v${BOT_WIKI_VERSION}</span></span>
            <span><i class="fas fa-calendar"></i> Dataset updated: ${BOT_WIKI_UPDATED}</span>
            <span>⚠ For informational purposes. Always verify data for your environment.</span>
            <span>Methodology: <a href="#" onclick="showBotWikiMethodology()">View Statement</a></span>
        </div>
    `;

    // Activate current tab
    switchBotTab(activeTabId);
}

function renderOverviewTab(bot) {
    const recIcons = { allow: 'fas fa-check-circle', monitor: 'fas fa-eye', block: 'fas fa-ban' };

    return `<div class="bw-tab-panel active" id="bw-panel-overview">
        <div class="bw-summary-box">
            <strong style="color:#22d3ee;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;">Summary</strong><br>
            <span style="color:#cbd5e1">${bot.summary}</span>
        </div>

        <div class="bw-recommendation ${bot.recommendation.action}">
            <i class="${recIcons[bot.recommendation.action]}"></i>
            <div>
                <strong style="text-transform:uppercase;font-size:0.72rem;letter-spacing:0.5px;">
                    Recommendation: ${bot.recommendation.action.toUpperCase()}
                </strong><br>
                <span>${bot.recommendation.text}</span>
            </div>
        </div>

        <div class="bw-grid-2" style="margin-top:16px">
            <div class="bw-info-card">
                <h4><i class="fas fa-bullseye"></i> Targets</h4>
                <div class="bw-tag-cloud">
                    ${bot.targets.map(t => `<span class="bw-tag target">${t}</span>`).join('')}
                </div>
            </div>
            <div class="bw-info-card">
                <h4><i class="fas fa-tools"></i> Techniques</h4>
                <div class="bw-tag-cloud">
                    ${bot.techniques.map(t => `<span class="bw-tag technique">${t}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="bw-section-label"><i class="fas fa-history"></i> Timeline</div>
        <div class="bw-timeline">
            ${bot.timeline.map(t => `
                <div class="bw-timeline-item">
                    <div class="bw-timeline-dot"></div>
                    <div class="bw-timeline-content">
                        <div class="bw-timeline-date">${t.date}</div>
                        <div class="bw-timeline-text">${t.event}</div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="bw-section-label" style="margin-top:16px"><i class="fas fa-link"></i> Related Bots</div>
        <div class="bw-related-grid">
            ${bot.relatedBots.map(relId => {
                const rel = BOT_DATABASE.find(b => b.id === relId);
                const name = rel ? rel.name : relId;
                const cls = rel ? rel.classification : 'gray';
                return `<div class="bw-related-card" onclick="${rel ? `selectBot('${relId}')` : ''}">
                    <div class="bw-bot-dot dot-${cls}" style="margin-bottom:6px"></div>
                    <div class="bw-related-card-name">${name}</div>
                    <div class="bw-related-card-rel">${rel ? rel.family : 'Unknown family'}</div>
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

function renderDetectionTab(bot) {
    const d = bot.detection;
    const rules = [
        { key: 'signature', label: 'Signature', type: 'signature', icon: 'fas fa-fingerprint' },
        { key: 'yara', label: 'YARA Rule', type: 'yara', icon: 'fas fa-code' },
        { key: 'sigma', label: 'Sigma Rule (YAML)', type: 'sigma', icon: 'fas fa-file-code' },
        { key: 'nginx', label: 'Nginx Config', type: 'nginx', icon: 'fas fa-server' },
        { key: 'apache', label: 'Apache / .htaccess', type: 'apache', icon: 'fas fa-server' },
        { key: 'cloudflare', label: 'Cloudflare Firewall Rule', type: 'cloudflare', icon: 'fas fa-cloud' },
        { key: 'modsecurity', label: 'ModSecurity Rules', type: 'modsec', icon: 'fas fa-shield-alt' }
    ];

    return `<div class="bw-tab-panel" id="bw-panel-detection">
        <div style="margin-bottom:14px;font-size:0.82rem;color:#64748b;">
            <i class="fas fa-info-circle" style="color:#06b6d4;margin-right:5px"></i>
            Click any rule to expand. Use the Copy button for one-click clipboard access.
            All rules are ready to deploy — review and adapt to your environment.
        </div>
        ${rules.map(r => d[r.key] ? `
            <div class="bw-rule-block">
                <div class="bw-rule-header" onclick="toggleRuleBlock('${bot.id}-${r.key}')">
                    <div class="bw-rule-title">
                        <i class="${r.icon}"></i>
                        ${r.label}
                        <span class="bw-rule-type-label rule-label-${r.type}">${r.type.toUpperCase()}</span>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center">
                        <button class="bw-copy-btn" id="copy-${bot.id}-${r.key}" 
                                onclick="event.stopPropagation();copyRule('${bot.id}','${r.key}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                        <i class="fas fa-chevron-down" id="chevron-${bot.id}-${r.key}" 
                           style="color:#64748b;font-size:0.8rem;transition:transform 0.2s"></i>
                    </div>
                </div>
                <div class="bw-rule-body" id="rule-${bot.id}-${r.key}">
                    <pre>${escapeHtml(d[r.key])}</pre>
                </div>
            </div>
        ` : '').join('')}
    </div>`;
}

function renderBehaviorTab(bot) {
    return `<div class="bw-tab-panel" id="bw-panel-behavior">
        <div class="bw-section-label" style="margin-top:0"><i class="fas fa-robot"></i> User-Agent Strings</div>
        <div class="bw-info-card" style="margin-bottom:16px">
            <div class="bw-tag-cloud">
                ${bot.userAgents.map(ua => `<span class="bw-tag ioc" style="font-family:monospace;font-size:0.7rem">${ua}</span>`).join('')}
            </div>
        </div>

        <div class="bw-section-label"><i class="fas fa-eye"></i> Observed Behaviors</div>
        <div class="bw-behavior-list">
            ${bot.behaviors.map(b => `
                <div class="bw-behavior-item behavior-${b.type}">
                    <i class="${b.icon}"></i>
                    <span>${b.text}</span>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function renderMitigationTab(bot) {
    return `<div class="bw-tab-panel" id="bw-panel-mitigation">
        <div class="bw-mitigation-steps">
            ${bot.mitigation.map((step, i) => `
                <div class="bw-step">
                    <div class="bw-step-num">${i + 1}</div>
                    <div class="bw-step-content">
                        <div class="bw-step-title">
                            ${step.title}
                            <span class="bw-priority-badge priority-${step.priority}">${step.priority}</span>
                        </div>
                        <div class="bw-step-desc">${step.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function renderIOCsTab(bot) {
    const typeClass = { ua: 'ioc-ua', ip: 'ioc-ip', domain: 'ioc-domain', header: 'ioc-header', behavior: 'ioc-behavior', asn: 'ioc-asn' };
    const confColor = { high: '#4ade80', medium: '#fbbf24', low: '#f87171' };

    return `<div class="bw-tab-panel" id="bw-panel-iocs">
        <div class="bw-ioc-table-wrap">
            <table class="bw-ioc-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Indicator</th>
                        <th>Confidence</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    ${bot.iocs.map(ioc => `
                        <tr>
                            <td><span class="bw-ioc-type ${typeClass[ioc.type] || ''}">${ioc.type.toUpperCase()}</span></td>
                            <td class="mono">${ioc.value}</td>
                            <td style="color:${confColor[ioc.confidence] || '#94a3b8'};font-weight:600;font-size:0.78rem">
                                ${ioc.confidence.charAt(0).toUpperCase() + ioc.confidence.slice(1)}
                            </td>
                            <td style="font-size:0.78rem;color:#64748b">${ioc.note || '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

/* ============================================
   TAB SWITCHING
   ============================================ */
function switchBotTab(tabId) {
    activeTabId = tabId;
    document.querySelectorAll('#bw-detail-container .bw-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    document.querySelectorAll('#bw-detail-container .bw-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `bw-panel-${tabId}`);
    });
}

/* ============================================
   RULE BLOCKS
   ============================================ */
function toggleRuleBlock(blockId) {
    const body = document.getElementById(`rule-${blockId}`);
    const chevron = document.getElementById(`chevron-${blockId}`);
    if (!body) return;

    const isOpen = body.classList.toggle('open');
    if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
    
    if (isOpen) openRuleBlocks.add(blockId);
    else openRuleBlocks.delete(blockId);
}

/* ============================================
   COPY FUNCTIONS
   ============================================ */
function copyRule(botId, ruleKey) {
    const bot = BOT_DATABASE.find(b => b.id === botId);
    if (!bot || !bot.detection[ruleKey]) return;

    navigator.clipboard.writeText(bot.detection[ruleKey]).then(() => {
        const btn = document.getElementById(`copy-${botId}-${ruleKey}`);
        if (btn) {
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        }
    }).catch(() => fallbackCopy(bot.detection[ruleKey]));
}

function copyAllRules(botId) {
    const bot = BOT_DATABASE.find(b => b.id === botId);
    if (!bot) return;

    const allRules = Object.entries(bot.detection)
        .map(([k, v]) => `\n${'='.repeat(50)}\n${k.toUpperCase()} RULE\n${'='.repeat(50)}\n${v}`)
        .join('\n\n');

    const full = `# OSINTrix Bot Wiki - ${bot.name} Detection Rules\n# Classification: ${bot.classification} | Risk: ${bot.riskScore}\n# Generated: ${new Date().toISOString()}\n${allRules}`;

    navigator.clipboard.writeText(full).then(() => {
        showBotWikiNotification(`All rules for ${bot.name} copied to clipboard!`, 'success');
    }).catch(() => fallbackCopy(full));
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
}

function exportBotProfile(botId) {
    const bot = BOT_DATABASE.find(b => b.id === botId);
    if (!bot) return;

    const data = JSON.stringify(bot, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osintrix-bot-profile-${bot.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showBotWikiNotification(`Exported ${bot.name} profile as JSON`, 'success');
}

/* ============================================
   SEARCH & FILTER
   ============================================ */
function setupBotWikiSearch() {
    const input = document.getElementById('bw-search');
    if (!input) return;
    input.addEventListener('input', function() {
        searchQuery = this.value.toLowerCase().trim();
        renderBotList();
    });
}

function setupBotWikiFilters() {
    document.querySelectorAll('.bw-filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.bw-filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.dataset.filter;
            renderBotList();
        });
    });
}

/* ============================================
   HELPERS
   ============================================ */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showBotWikiNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(notification);

    setTimeout(() => notification.style.opacity = '0', 3000);
    setTimeout(() => notification.remove(), 3500);
}

function showBotWikiMethodology() {
    alert(`OSINTrix Bot Wiki — Methodology & Transparency

DATA SOURCES:
• Official bot documentation (vendor sites)
• Public security research and CVEs
• Community-contributed detection rules
• Analysis of production access logs
• Academic papers on web crawling

CLASSIFICATION CRITERIA:
• Legitimate: Respects robots.txt, verified operator, provides value to crawled sites
• Gray: May be legal but ethically contested, aggressive, or provides no direct value
• Malicious: Ignores robots.txt, harvests data without consent, or actively harmful

DETECTION RULES:
• All rules are reviewed for accuracy before inclusion
• YARA/Sigma rules follow community standards
• Server configs tested on common deployments
• Rules are starting points — always test in your environment

DATASET VERSION: ${BOT_WIKI_VERSION}
LAST UPDATED: ${BOT_WIKI_UPDATED}

This database is provided "as-is" for informational purposes.
It does not constitute legal or security advice.`);
}

/* ============================================
   AUTO-INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('bot-wiki')) {
        initBotWiki();
    }
});

console.log('✓ OSINTrix Bot Wiki Initialized — v' + BOT_WIKI_VERSION);