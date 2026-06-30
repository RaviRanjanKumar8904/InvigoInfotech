const fs = require('fs');

const filePath = './src/colleges.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The file should start with "export const EXTENDED_COLLEGES = ["
const prefix = "export const EXTENDED_COLLEGES = ";
if (!content.startsWith(prefix)) {
  console.error("File format not recognized.");
  process.exit(1);
}

// Extract the array string
let arrayString = content.slice(prefix.length);
// Remove trailing semicolon if any
if (arrayString.endsWith(";")) {
  arrayString = arrayString.slice(0, -1);
}
if (arrayString.endsWith(";\n")) {
  arrayString = arrayString.slice(0, -2);
}

try {
  const colleges = JSON.parse(arrayString);
  const initialLength = colleges.length;
  
  const keywords = ['medical', 'medicine', 'dental', 'pharmacy', 'nursing', 'ayurveda', 'ayurvedic', 'homeopathy', 'hospital', 'aiims', 'health sciences', 'paramedical'];
  
  const filteredColleges = colleges.filter(college => {
    const lower = college.toLowerCase();
    return !keywords.some(keyword => lower.includes(keyword));
  });
  
  const finalLength = filteredColleges.length;
  console.log(`Removed ${initialLength - finalLength} medical colleges.`);
  
  const newContent = prefix + JSON.stringify(filteredColleges, null, 2) + ';\n';
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Successfully updated src/colleges.ts');
  
} catch (e) {
  console.error("Failed to parse array: ", e);
}
