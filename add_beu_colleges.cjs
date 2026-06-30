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

const gecList = [
  "Muzaffarpur Institute of Technology",
  "Bhagalpur College of Engineering",
  "Gaya College of Engineering",
  "Darbhanga College of Engineering",
  "Nalanda College of Engineering",
  "Lok Nayak Jai Prakash Institute of Technology",
  "Bakhtiyarpur College of Engineering",
  "Motihari College of Engineering",
  "B.P. Mandal College of Engineering",
  "Sitamarhi Institute of Technology",
  "Rashtrakavi Ramdhari Singh Dinkar College of Engineering",
  "Shershah Engineering College",
  "Katihar Engineering College",
  "Purnea College of Engineering",
  "Saharsa College of Engineering",
  "Supaul College of Engineering",
  "Government Engineering College Arwal",
  "Government Engineering College Aurangabad",
  "Government Engineering College Banka",
  "Government Engineering College Bhojpur",
  "Government Engineering College Buxar",
  "Government Engineering College Gopalganj",
  "Government Engineering College Jamui",
  "Government Engineering College Jehanabad",
  "Government Engineering College Kaimur",
  "Government Engineering College Khagaria",
  "Government Engineering College Kishanganj",
  "Government Engineering College Lakhisarai",
  "Government Engineering College Madhubani",
  "Government Engineering College Munger",
  "Government Engineering College Nawada",
  "Government Engineering College Samastipur",
  "Government Engineering College Sheikhpura",
  "Government Engineering College Sheohar",
  "Government Engineering College Siwan",
  "Government Engineering College Vaishali",
  "Government Engineering College West Champaran",
  "Shri Phanishwar Nath Renu Engineering College"
];

let added = 0;
for (const gec of gecList) {
  // Check if it exists exactly or loosely
  const exists = colleges.some(c => c.toLowerCase() === gec.toLowerCase() || c.toLowerCase().includes(gec.toLowerCase()));
  if (!exists) {
    colleges.push(gec);
    console.log(`Added: ${gec}`);
    added++;
  }
}

if (added > 0) {
  // Deduplicate and sort
  const uniqueColleges = Array.from(new Set(colleges)).filter(Boolean);
  uniqueColleges.sort((a, b) => a.localeCompare(b));

  const newContent = `export const EXTENDED_COLLEGES = [\n  "${uniqueColleges.join('",\n  "')}"\n];\n`;
  fs.writeFileSync('src/colleges.ts', newContent);
  console.log(`\nAdded ${added} Bihar Engineering University colleges. Total: ${uniqueColleges.length}`);
} else {
  console.log("All 38 Bihar Engineering University colleges are already in the database!");
}
