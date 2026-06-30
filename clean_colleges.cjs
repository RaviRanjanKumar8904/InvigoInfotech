const fs = require('fs');

const fileContent = fs.readFileSync('src/colleges.ts', 'utf8');

// Match the array content
const match = fileContent.match(/export const EXTENDED_COLLEGES = \[([\s\S]*?)\];/);
if (!match) {
  console.log("Could not find the array.");
  process.exit(1);
}

let collegesStr = match[1];
// Extract individual strings
let colleges = [];
const regex = /"([^"]+)"/g;
let m;
while ((m = regex.exec(collegesStr)) !== null) {
  colleges.push(m[1]);
}

console.log(`Original count: ${colleges.length}`);

// Step 1: Clean names
colleges = colleges.map(name => {
  let cleanName = name;
  
  // Remove leading numbers like "1- ", "60 ", "91 "
  cleanName = cleanName.replace(/^\d+[\-\.]?\s*/, '');
  
  // Remove mobile numbers "Mob.No. 1234567890", "Ph.No.", etc.
  cleanName = cleanName.replace(/Mob\.?No\.?\s*[\d\-\+]+/gi, '');
  cleanName = cleanName.replace(/Ph\.?No\.?\s*[\d\-\+]+/gi, '');
  cleanName = cleanName.replace(/Contact\.?No\.?\s*[\d\-\+]+/gi, '');
  
  // Remove standalone phone numbers (10+ digits, maybe with dashes)
  cleanName = cleanName.replace(/\b\d{4,5}-\d{5,8}\b/g, '');
  cleanName = cleanName.replace(/\b\d{10,12}\b/g, '');
  
  // Remove trailing commas, spaces, dashes, and backslashes
  cleanName = cleanName.replace(/[,-\s\\]+$/, '');
  
  // Escape any remaining double quotes inside the string
  cleanName = cleanName.replace(/"/g, '\\"');
  
  // Trim spaces
  return cleanName.trim();
});

// Step 2: Filter domains
const exclusionKeywords = [
  'law', 'medical', 'dental', 'nursing', 'ayurvedic', 'homeopathic', 
  'pharmacy', 'agriculture', 'animal', 'sanskrit', 'sports', 'veterinary', 
  'hospital', 'clinic', 'fashion', 'music', 'yoga', 'theology'
];

colleges = colleges.filter(name => {
  const lower = name.toLowerCase();
  for (const keyword of exclusionKeywords) {
    if (lower.includes(keyword)) {
      return false; // exclude
    }
  }
  return true;
});

// Step 3: Remove duplicates
const uniqueColleges = Array.from(new Set(colleges)).filter(Boolean);
uniqueColleges.sort((a, b) => a.localeCompare(b));

console.log(`Final count: ${uniqueColleges.length}`);

// Generate new file
const newContent = `export const EXTENDED_COLLEGES = [\n  "${uniqueColleges.join('",\n  "')}"\n];\n`;
fs.writeFileSync('src/colleges.ts', newContent);
console.log('Saved to src/colleges.ts');
