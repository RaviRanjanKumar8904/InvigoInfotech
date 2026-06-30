const fs = require('fs');

const fileContent = fs.readFileSync('src/colleges.ts', 'utf8');

const match = fileContent.match(/export const EXTENDED_COLLEGES = \[([\s\S]*?)\];/);
if (!match) {
  process.exit(1);
}

let collegesStr = match[1];
let colleges = [];
const regex = /"([^"]+)"/g;
let m;
while ((m = regex.exec(collegesStr)) !== null) {
  colleges.push(m[1]);
}

// 1. Expand known acronyms
const expansions = {
  "IIT": "Indian Institute of Technology",
  "NIT": "National Institute of Technology",
  "IIIT": "Indian Institute of Information Technology",
  "IIM": "Indian Institute of Management",
  "BITS": "Birla Institute of Technology and Science",
  "VIT": "Vellore Institute of Technology",
  "SRM": "Sri Ramaswamy Memorial",
  "AICTE": "All India Council for Technical Education",
  "UGC": "University Grants Commission",
  "NIFT": "National Institute of Fashion Technology", // wait fashion is removed
  "NID": "National Institute of Design"
};

let expandedCount = 0;
let removedCount = 0;

let finalColleges = colleges.map(name => {
  // Direct match expansion (e.g. if the string is just "IIT DELHI", we can't easily expand it automatically without breaking "Delhi", but we can replace the word)
  // Let's replace standalone acronyms
  let newName = name;
  for (const [acronym, full] of Object.entries(expansions)) {
    const regex = new RegExp(`\\b${acronym}\\b`, 'g');
    if (regex.test(newName)) {
      newName = newName.replace(regex, full);
      expandedCount++;
    }
  }
  return newName;
});

// 2. Identify un-expandable shortforms and remove them
finalColleges = finalColleges.filter(name => {
  const lower = name.toLowerCase();
  
  // A standard college should usually have one of these words:
  const hasCollegeWord = /college|university|institute|academy|school|faculty|polytechnic|engineering|technology|science|commerce|arts|degree|mahavidyalaya|vidyapeeth|vishwavidyalaya|bhavan|mandir/i.test(lower);
  
  // If the name is VERY short (e.g., "ABCD") and has no college-identifying word, it's a raw shortform
  if (name.length <= 8 && !hasCollegeWord) {
    removedCount++;
    return false;
  }
  
  // If the name is entirely uppercase and has NO college words, it's highly likely just a string of acronyms
  if (name === name.toUpperCase() && name.length < 15 && !hasCollegeWord) {
    removedCount++;
    return false;
  }

  return true;
});

console.log(`Expanded ${expandedCount} acronyms.`);
console.log(`Removed ${removedCount} unresolvable shortforms.`);

const uniqueColleges = Array.from(new Set(finalColleges)).filter(Boolean);
uniqueColleges.sort((a, b) => a.localeCompare(b));

console.log(`Final count: ${uniqueColleges.length}`);

const newContent = `export const EXTENDED_COLLEGES = [\n  "${uniqueColleges.join('",\n  "')}"\n];\n`;
fs.writeFileSync('src/colleges.ts', newContent);
console.log('Saved to src/colleges.ts');
