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
      if (typeof c === 'string') {
        let name = c.replace(/\s*\(Id:\s*C-\d+\)\s*/i, '').trim();
        name = name.replace(/\s*\(Id:\s*U-\d+\)\s*/i, '').trim();
        stateMap[name.toLowerCase()] = state;
      } else if (c && c.name) {
        let name = c.name.replace(/\s*\(Id:\s*C-\d+\)\s*/i, '').trim();
        name = name.replace(/\s*\(Id:\s*U-\d+\)\s*/i, '').trim();
        stateMap[name.toLowerCase()] = state;
      }
    });
  } catch (e) {
    // some states might not exist in the package
  }
});

fs.writeFileSync('stateMap.json', JSON.stringify(stateMap, null, 2));
console.log("State map created with " + Object.keys(stateMap).length + " entries.");
