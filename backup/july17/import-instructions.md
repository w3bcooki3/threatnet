# How to Import MITRE Data

## Step 1: Run the Converter

### Option A: Browser Console
1. Open your ThreatNet application
2. Open browser developer tools (F12)
3. Copy and paste the `mitre-converter.js` code into the console
4. Run: `importMitreData()`
5. Copy the generated JSON output

### Option B: Node.js Script
1. Save `mitre-converter.js` to your computer
2. Run: `node mitre-converter.js`
3. The script will generate `mitre-threat-actors.json`

## Step 2: Update Your Application

Replace the `threatActors` array in `script.js` with the generated data:

```javascript
// Replace this line in script.js:
const threatActors = [
    // ... existing data
];

// With:
const threatActors = [
    // ... paste your generated MITRE data here
];
```

## Step 3: Verify Import

1. Refresh your application
2. Navigate to the Threat Actors section
3. Verify that new actors appear with MITRE data

## Data Quality Notes

- **Confidence Scores**: Automatically calculated based on available data
- **IOCs**: Sample IOCs are generated (replace with real ones)
- **Campaigns**: Limited campaign data (enhance manually)
- **Tools**: Extracted from descriptions (may need manual review)

## Customization

You can modify the converter to:
- Add custom threat levels
- Include additional data sources
- Enhance attribution logic
- Add custom IOCs and campaigns

## Real-time Updates

To keep data current:
1. Set up a scheduled task to run the converter
2. Implement API endpoints for data updates
3. Add version control for threat actor profiles

## Data Sources

The converter uses:
- MITRE ATT&CK Enterprise dataset
- STIX 2.0 format data
- GitHub repository: https://github.com/mitre/cti

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Use a CORS proxy service
2. Download the JSON file manually
3. Run the converter in Node.js environment

### Missing Data
Some fields may be empty because:
- MITRE data doesn't include all details
- Manual enhancement is needed
- Data is classified or unavailable

### Performance
For large datasets:
- Process data in batches
- Implement pagination
- Use web workers for conversion