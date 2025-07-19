# MITRE ATT&CK Data Import Guide

## Overview
This guide shows you how to import threat actor data from MITRE ATT&CK framework into your ThreatNet application.

## Data Sources

### 1. MITRE ATT&CK STIX Data
- **URL**: https://github.com/mitre/cti
- **Format**: STIX 2.0 JSON
- **Groups File**: `enterprise-attack/intrusion-sets/intrusion-set--[id].json`

### 2. MITRE ATT&CK Navigator
- **URL**: https://mitre-attack.github.io/attack-navigator/
- **API**: https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json

## Import Methods

### Method 1: Manual JSON Import
1. Download the enterprise-attack.json file
2. Use the converter script below to transform MITRE data
3. Replace the threatActors array in script.js

### Method 2: API Integration (Recommended)
Use the fetch functions provided below to automatically import data

## Data Structure Mapping

### MITRE → ThreatNet Mapping
```
MITRE Field                → ThreatNet Field
name                      → name
aliases                   → aliases
description               → description
x_mitre_version          → version
created                  → firstSeen
modified                 → lastActivity
external_references      → mitreId, campaigns
kill_chain_phases        → techniques
```