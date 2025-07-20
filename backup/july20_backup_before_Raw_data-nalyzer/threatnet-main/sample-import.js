// Sample script to test MITRE data import
// Run this in browser console or Node.js

async function testMitreImport() {
    console.log('Testing MITRE data import...');
    
    // Create converter instance
    const converter = new MitreConverter();
    
    try {
        // Fetch and convert data
        const threatActors = await converter.convertMitreData();
        
        console.log(`✅ Successfully imported ${threatActors.length} threat actors`);
        
        // Show sample data
        console.log('\n📊 Sample Threat Actor:');
        console.log(JSON.stringify(threatActors[0], null, 2));
        
        // Show statistics
        const stats = {
            total: threatActors.length,
            critical: threatActors.filter(a => a.threatLevel === 'critical').length,
            high: threatActors.filter(a => a.threatLevel === 'high').length,
            nationState: threatActors.filter(a => a.category === 'nation-state').length,
            apt: threatActors.filter(a => a.category === 'apt').length
        };
        
        console.log('\n📈 Import Statistics:');
        console.table(stats);
        
        // Generate regions breakdown
        const regions = {};
        threatActors.forEach(actor => {
            regions[actor.region] = (regions[actor.region] || 0) + 1;
        });
        
        console.log('\n🌍 Regional Distribution:');
        console.table(regions);
        
        return threatActors;
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        return null;
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('🚀 MITRE Import Tool Ready');
    console.log('Run: testMitreImport() to start import');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testMitreImport };
}