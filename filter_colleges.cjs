const fs = require('fs');

const data = fs.readFileSync('src/colleges.ts', 'utf8');
const match = data.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);

if (match) {
  let colleges = JSON.parse(match[1]);
  const initialCount = colleges.length;
  
  // Criteria 1: Delete if state is missing
  colleges = colleges.filter(c => c.state && c.state.trim() !== "");

  const missingStateRemoved = initialCount - colleges.length;
  
  // Criteria 2: Delete if name is in short form (acronyms like S.G.M. College, A. B. C. College, S.Sinha)
  // We can use a regex that matches:
  // - Two or more consecutive initials (e.g. S.K.M.)
  // - A single initial at the start of the name, unless it's a common title like St. or Dr.
  // Actually, any college starting with a single letter followed by a dot (e.g. S. Sinha)
  
  const shortFormRemovedList = [];
  
  colleges = colleges.filter(c => {
    const name = c.name;
    
    // Check for multiple initials like "S.K.M." or "A. B. C."
    const hasMultipleInitials = /(?:[A-Za-z]\.\s*){2,}/.test(name);
    
    // Check for single initial at start like "S.Sinha" or "A. College"
    // (Excluding St. or Dr. or Pt. since those are 2 letters)
    const startsWithSingleInitial = /^[A-Za-z]\.\s*[A-Za-z]/.test(name);
    
    // Check if name is extremely short
    const isVeryShort = name.length <= 12;
    
    if (hasMultipleInitials || startsWithSingleInitial || isVeryShort) {
      shortFormRemovedList.push(name);
      return false;
    }
    
    return true;
  });

  const shortFormRemoved = (initialCount - missingStateRemoved) - colleges.length;

  const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(colleges, null, 2) + ";\n";
  fs.writeFileSync('src/colleges.ts', newCode);
  
  console.log(`Initial colleges: ${initialCount}`);
  console.log(`Removed (missing state): ${missingStateRemoved}`);
  console.log(`Removed (short form/acronyms): ${shortFormRemoved}`);
  console.log(`Final colleges remaining: ${colleges.length}`);
  
  console.log("\nSample short forms removed:");
  console.log(shortFormRemovedList.slice(0, 15).join('\n'));
}
