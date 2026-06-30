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

const shortforms = colleges.filter(name => {
  // Never remove if it contains these safe words (case insensitive)
  if (/college|university|institute|academy|school|faculty|polytechnic|engineering|technology|science|commerce|arts|degree|mahavidyalaya|vidyapeeth|vishwavidyalaya|bhavan|mandir/i.test(name)) {
    return false;
  }

  // If the name is VERY short (e.g. "SIES", "VJTI", "TSEC") and entirely uppercase
  if (name.length <= 10 && name.toUpperCase() === name) {
    return true;
  }
  
  // If the name is just initials with dots (e.g. "S.R.N.M.", "A.P.S.")
  if (/^([A-Z]\.)+[A-Z]?$/.test(name.replace(/\s/g, ''))) {
    return true;
  }
  
  // If the name is basically just random capital letters separated by spaces or dots, like "M K M", "S B S T"
  // Let's check if the average word length is 1 or 2
  const words = name.split(/\s+/);
  if (words.length > 2 && words.every(w => w.length <= 2 && w.toUpperCase() === w)) {
    return true;
  }

  return false;
});

console.log(`Found ${shortforms.length} strict shortforms:`);
console.log(shortforms.join('\n'));

const cleanColleges = colleges.filter(name => !shortforms.includes(name));

const newContent = `export const EXTENDED_COLLEGES = [\n  "${cleanColleges.join('",\n  "')}"\n];\n`;
fs.writeFileSync('src/colleges.ts', newContent);
console.log(`\nRemoved ${shortforms.length} colleges. Remaining: ${cleanColleges.length}`);
