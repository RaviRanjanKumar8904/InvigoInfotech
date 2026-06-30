const indColleges = require('indian-colleges');
const fs = require('fs');

async function extract() {
  try {
    const allColleges = indColleges.getAllColleges() || [];
    
    // Read existing
    let existingCode = fs.readFileSync('src/colleges.ts', 'utf8');
    const match = existingCode.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);
    let existingArray = [];
    if (match) {
      existingArray = JSON.parse(match[1]);
    }

    const uniqueColleges = new Set(existingArray.map(c => c.toLowerCase()));
    
    let added = 0;
    for (let c of allColleges) {
      if (added >= 10000) break;
      if (typeof c !== 'string') continue;
      
      let name = c.replace(/\s*\(Id:\s*C-\d+\)\s*/i, '').trim();
      name = name.replace(/\s*\(Id:\s*U-\d+\)\s*/i, '').trim();
      if (!name) continue;

      if (!uniqueColleges.has(name.toLowerCase())) {
        existingArray.push(name);
        uniqueColleges.add(name.toLowerCase());
        added++;
      }
    }

    const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(existingArray, null, 2) + ";\n";
    fs.writeFileSync('src/colleges.ts', newCode);
    console.log("Added " + added + " colleges to the list. Total is now " + existingArray.length + ".");

  } catch (err) {
    console.error(err);
  }
}

extract();
