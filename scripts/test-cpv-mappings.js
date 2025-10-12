// Quick test script to verify CPV mappings
const { getObligationsByCpv } = require('../dist/assets/index-DcprAiHX.js');

// Test cases from CSV
const testCases = [
  { cpv: '03000000-1', expected: 'gpp-food-catering', description: 'Food catering' },
  { cpv: '39130000-2', expected: 'gpp-furniture', description: 'Office furniture (also in manual)' },
  { cpv: '45000000-7', expected: 'buildings', description: 'Buildings (manual mapping)' },
  { cpv: '34350000-5', expected: 'tyres', description: 'Tyres (manual mapping)' },
  { cpv: '30213000-5', expected: 'ecodesign_products', description: 'Ecodesign (manual mapping)' },
];

console.log('Testing CPV mappings...\n');

testCases.forEach(({ cpv, expected, description }) => {
  try {
    const obligations = getObligationsByCpv(cpv);
    const hasExpected = obligations.some(o => o.obligation_id === expected);
    const status = hasExpected ? '✓' : '✗';
    console.log(`${status} ${cpv}: ${description}`);
    if (obligations.length > 0) {
      console.log(`  → Found: ${obligations.map(o => o.obligation_id).join(', ')}`);
    } else {
      console.log(`  → No obligations found`);
    }
  } catch (e) {
    console.log(`✗ ${cpv}: Error - ${e.message}`);
  }
  console.log();
});
