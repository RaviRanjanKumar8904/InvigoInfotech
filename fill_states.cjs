const indColleges = require('indian-colleges');
const fs = require('fs');

const states = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const stateMap = {};

states.forEach(state => {
  try {
    const colleges = indColleges.getCollegesByState(state) || [];
    colleges.forEach(c => {
      if (c && c.college) {
        let name = c.college.replace(/\s*\(Id:\s*C-\d+\)\s*/i, '').trim();
        name = name.replace(/\s*\(Id:\s*U-\d+\)\s*/i, '').trim();
        stateMap[name.toLowerCase()] = state;
      }
    });
  } catch (e) {
  }
});

// Read existing colleges
let existingCode = fs.readFileSync('src/colleges.ts', 'utf8');
const match = existingCode.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);
if (match) {
  const existingArray = JSON.parse(match[1]);
  
  // existingArray could be strings or already objects.
  // If strings, convert them.
  const newArray = existingArray.map(item => {
    let name = typeof item === 'string' ? item : item.name;
    let state = typeof item === 'string' ? "" : (item.state || "");
    
    if (!state) {
      let lookup = name.replace(/\s*\(Id:\s*C-\d+\)\s*/i, '').trim();
      lookup = lookup.replace(/\s*\(Id:\s*U-\d+\)\s*/i, '').trim();
      state = stateMap[lookup.toLowerCase()] || "";
    }
    
    return { name, state };
  });

  const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(newArray, null, 2) + ";\n";
  fs.writeFileSync('src/colleges.ts', newCode);
  console.log("Updated colleges.ts with states.");
  
  const withoutState = newArray.filter(a => !a.state).length;
  console.log("Colleges without state: " + withoutState + " out of " + newArray.length);
}
