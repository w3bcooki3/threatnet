# OSINTrix (ThreatNet) 🕵️‍♂️
**A Private, Browser-Based OSINT & Threat Intel Workspace**

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://w3bcooki3.github.io/threatnet/)
[Project Repo](https://github.com/w3bcooki3/threatnet)

**OSINTrix** is a modular investigation platform built for OSINT analysts and threat hunters. It acts as a centralized "mission control" to organize your tools, notes, and intelligence data without ever sending your sensitive investigation details to a server.

## 🚀 Key Modules

### 🛠️ Intelligence Vault
Centralize your scattered bookmarks. Store and organize investigative tools (Maltego, Shodan, VirusTotal, etc.) by category. Features pinning and starring for rapid access to your most-used resources.

### 📝 Investigation Notes
A professional journaling system designed for security investigators. Document findings in real-time with a clean, searchable interface that ensures your thought process is preserved.

### 📡 Threat Intel & News
Your one-stop shop for staying updated. Monitor real-time news and intelligence feeds directly within the dashboard to keep a pulse on the evolving threat landscape.

### 📚 Case Studies & Knowledge Base
Store and organize your favorite industry articles, post-mortems, and security blogs. Use this section to build a library of reference material for future investigations.

### 🔍 Dork Assistant
Stop memorizing complex syntax. Build advanced search queries for Google, Bing, and Shodan. Includes a built-in **Entity Extractor** to identify URLs, IPs, and Emails from raw data.

### 📖 OSINT Playbook
Build your own standard operating procedures (SOPs). Create chapters and entries to document your personal methodologies or write custom guides for specific investigation types.

### 🛡️ Threat Wiki
A dedicated repository for detection logic. Store, organize, and manage **Sigma and YARA rules**. It provides a structured way to keep your hunting rules accessible and ready for deployment.

### 🔗 TraceLink (Multi-Vault)
A manual link-analysis prototype. Perfect for small-scale cases where you need to manually map relationships between threat actors, infrastructure, and indicators of compromise (IOCs).

---

## 🔒 Privacy-First Architecture

OSINTrix is designed with a "Local-Only" philosophy:
- **No Backend**: There is no database or cloud server. Your data is your own.
- **Local Persistence**: Uses `localForage` (IndexedDB) to store all your information directly in your browser.
- **Secure**: Sensitive investigation data never leaves your machine.

---

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Storage**: IndexedDB (via localForage.js).
- **Visualization**: Cytoscape.js for link analysis. (Buggy kind of)
- **Feeds**: rss2json integration for Intel monitoring.

---

## 📂 Quick Start

**Open the App**: Simply go to [https://w3bcooki3.github.io/threatnet/](https://w3bcooki3.github.io/threatnet/) in any modern web browser. No installation or `npm install` required.

Created by **video coding**.

> “This app was built as a free, private, and open-source alternative to paid OSINT tools. Expect bugs — improvements and new features are planned.”

---

## 🤝 Contributing

Contributions are welcome! This is a side project built to share with the community. If you have ideas for new features, improvements, or bug fixes, please feel free to reach out on [LinkedIn](https://www.linkedin.com/in/fnu-rahul).

---

## 📧 Contact
[LinkedIn - Rahul](https://www.linkedin.com/in/fnu-rahul)

---

<p align="center">
  <br>
  <i>"Knowledge is Power. OSINTrix helps you organize it."</i>
</p>