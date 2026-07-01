const fs = require('fs');

const data = fs.readFileSync('src/colleges.ts', 'utf8');
const match = data.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);

if (match) {
  let colleges = JSON.parse(match[1]);
  
  colleges = colleges.map(c => {
    let name = c.name;
    
    // Remove "Mob. No" and anything after it
    name = name.replace(/Mob\.?\s*No.*/i, '');
    
    // Remove "Ph. No" and anything after it
    name = name.replace(/Ph\.?\s*No.*/i, '');
    
    // Remove parentheses and their contents
    name = name.replace(/\([^)]*\)/g, '');
    
    // Remove unclosed parentheses and anything after them
    name = name.replace(/\(.*/g, '');

    // Remove numbers
    name = name.replace(/[0-9]/g, '');
    
    // Remove commas
    name = name.replace(/,/g, '');

    // Remove other weird characters but keep letters, dots, hyphens, ampersands, spaces
    name = name.replace(/[^a-zA-Z\s.&'-]/g, '');

    // Clean up multiple spaces
    name = name.replace(/\s+/g, ' ').trim();

    // Clean up trailing hyphens, dots or ampersands
    name = name.replace(/^[-&.\s]+|[-&.\s]+$/g, '');

    c.name = name;
    return c;
  });

  // Filter out any that became empty
  colleges = colleges.filter(c => c.name.length > 0);

  // Remove duplicates after cleaning
  const uniqueColleges = [];
  const seen = new Set();
  for (let c of colleges) {
    const lower = c.name.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueColleges.push(c);
    }
  }

  const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(uniqueColleges, null, 2) + ";\n";
  fs.writeFileSync('src/colleges.ts', newCode);
  
  console.log(`Cleaned colleges! Reduced from ${colleges.length} to ${uniqueColleges.length} unique colleges.`);
  
  // Print some samples to verify
  console.log("\nSample clean names:");
  for(let i=0; i<15; i++) {
     console.log(uniqueColleges[i].name);
  }
}
