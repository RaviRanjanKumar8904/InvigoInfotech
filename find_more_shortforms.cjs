const fs = require('fs');

const fileContent = fs.readFileSync('src/colleges.ts', 'utf8');

const match = fileContent.match(/export const EXTENDED_COLLEGES = \[([\s\S]*?)\];/);
if (!match) process.exit(1);

let collegesStr = match[1];
let colleges = [];
const regex = /"([^"]+)"/g;
let m;
while ((m = regex.exec(collegesStr)) !== null) {
  colleges.push(m[1]);
}

const hasCollegeWord = (name) => {
  return /college|university|institute|academy|school|faculty|polytechnic|engineering|technology|science|commerce|arts|degree|mahavidyalaya|vidyapeeth|vishwavidyalaya|bhavan|mandir|trust|society|foundation|campus|center|centre/i.test(name);
};

const shortforms = colleges.filter(name => {
  // 1. Name is less than 15 characters and ALL CAPS
  if (name.length <= 15 && name === name.toUpperCase()) return true;
  
  // 2. Name consists almost entirely of periods and letters (e.g. "G.B.P.E.C.")
  if (/^([A-Z]\.?\s*)+$/i.test(name)) return true;
  
  // 3. Name doesn't have any college word AND is less than 20 characters
  if (!hasCollegeWord(name) && name.length <= 20) return true;

  // 4. Name is just a bunch of capital letters and maybe an ampersand (e.g. "SIES", "VJTI", "KJSCE", "TSEC")
  if (/^[A-Z\s&]+$/.test(name) && name.length <= 15 && !hasCollegeWord(name)) return true;

  return false;
});

console.log(`Found ${shortforms.length} suspicious shortform-like colleges:`);
console.log(shortforms.join('\n'));

// Now actually remove them to see the diff
const cleanColleges = colleges.filter(name => !shortforms.includes(name));

const newContent = `export const EXTENDED_COLLEGES = [\n  "${cleanColleges.join('",\n  "')}"\n];\n`;
fs.writeFileSync('src/colleges.ts', newContent);
console.log(`\nRemoved ${shortforms.length} colleges. Remaining: ${cleanColleges.length}`);
