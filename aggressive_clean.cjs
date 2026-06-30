const fs = require('fs');

const fileContent = fs.readFileSync('src/colleges.ts', 'utf8');

const match = fileContent.match(/export const EXTENDED_COLLEGES = \[([\s\S]*?)\];/);
if (!match) {
  console.log("Could not find the array.");
  process.exit(1);
}

let collegesStr = match[1];
let colleges = [];
const regex = /"([^"]+)"/g;
let m;
while ((m = regex.exec(collegesStr)) !== null) {
  colleges.push(m[1]);
}

console.log(`Original count: ${colleges.length}`);

colleges = colleges.map(name => {
  let cleanName = name;
  
  // 1. Remove anything after a comma
  cleanName = cleanName.split(',')[0];
  
  // 2. Remove anything after " - " (space hyphen space)
  cleanName = cleanName.split(' - ')[0];

  // 3. Remove text in parentheses completely
  cleanName = cleanName.replace(/\([^)]*\)/g, '');
  
  // 4. Remove common address keywords and everything after them
  const addressKeywords = [
    / Near /i, / Opp\. /i, / Opposite /i, / At /i, / Post /i, / Vill /i, 
    / Village /i, / Dist /i, / District /i, / Tehsil /i, / Taluk /i, 
    / Taluka /i, / Pin /i, / P\.O\.? /i, / PO /i, / Beside /i, / Road /i, / Marg /i,
    / Highway /i, / KM /i, / Nagar /i
  ];
  
  for (const keyword of addressKeywords) {
    const match = cleanName.match(keyword);
    if (match) {
      cleanName = cleanName.substring(0, match.index);
    }
  }

  // 5. Clean up any lingering punctuation or extra spaces at the end
  cleanName = cleanName.replace(/[-_.:;#&]+$/, '');
  
  // Clean up double spaces
  cleanName = cleanName.replace(/\s{2,}/g, ' ');
  
  // Escape quotes
  cleanName = cleanName.replace(/"/g, '\\"');

  return cleanName.trim();
});

// Remove any entries that got reduced to nothing or are way too short
colleges = colleges.filter(name => name.length > 5);

// Remove duplicates again
const uniqueColleges = Array.from(new Set(colleges));
uniqueColleges.sort((a, b) => a.localeCompare(b));

console.log(`Final count: ${uniqueColleges.length}`);

const newContent = `export const EXTENDED_COLLEGES = [\n  "${uniqueColleges.join('",\n  "')}"\n];\n`;
fs.writeFileSync('src/colleges.ts', newContent);
console.log('Saved to src/colleges.ts');
