const fs = require('fs');

const data = fs.readFileSync('src/colleges.ts', 'utf8');
const match = data.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);
if (match) {
  const colleges = JSON.parse(match[1]);
  const filled = colleges.filter(c => c.state).length;
  const missing = colleges.filter(c => !c.state).length;
  
  console.log(`Total Colleges in EXTENDED_COLLEGES: ${colleges.length}`);
  console.log(`State Filled: ${filled}`);
  console.log(`State Missing: ${missing}`);
  
  console.log("\nSample Filled:");
  colleges.filter(c => c.state).slice(0, 5).forEach(c => console.log(`${c.name} -> ${c.state}`));
  
  console.log("\nSample Missing:");
  colleges.filter(c => !c.state).slice(0, 5).forEach(c => console.log(`${c.name} -> (Missing)`));
}
