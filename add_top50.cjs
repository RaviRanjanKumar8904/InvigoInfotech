const fs = require('fs');

const rawText = `
Acharya Nagarjuna University (Guntur), AIIMS Bhopal, AIIMS Jodhpur, AIIMS Patna, AIIMS Raipur, Assam University Silchar, Banasthali Vidyapith, Bangalore University, Bharati Vidyapeeth (Pune), Birla Institute of Technology (Ranchi), Central University of Punjab (Bathinda), Central University of Rajasthan, Central University of Tamil Nadu, CCS Haryana Agricultural University (Hisar), Chettinad Academy (Chengalpattu), Chitkara University (Rajpura), Dr. B R Ambedkar NIT Jalandhar, G.B. Pant University (Pantnagar), GITAM Visakhapatnam, Gujarat University, IIIT Delhi, IIEST Shibpur (Howrah), IIT Palakkad, Indian Statistical Institute Kolkata, Jain University Bengaluru, JNTU Hyderabad, M.S. Ramaiah Institute of Technology (Bengaluru), Madras Medical College, Madurai Kamaraj University, Maharishi Markandeshwar (Ambala), Manonmaniam Sundaranar University (Tirunelveli), Mizoram University, Mysore University, NIT Delhi, NIT Durgapur, NIT Patna, NIT Srinagar, Netaji Subhas University of Technology (Delhi), NITTE (Mangaluru), Padmashree D.Y. Patil Vidyapeeth (Mumbai), PSG College of Technology (Coimbatore), Sant Longowal Institute (Punjab), Sharda University (Greater Noida), Shoolini University (Solan), Sri Balaji Vidyapeeth (Puducherry), Sri Ramachandra Institute (Chennai), Tata Institute of Social Sciences (Mumbai), Tezpur University, University of Agricultural Sciences Bangalore, Vignan's Foundation (Guntur)
`;

// Clean up
const newColleges = rawText.trim().split(',').map(c => c.trim()).filter(Boolean);

// Read existing src/colleges.ts
let existingCode = fs.readFileSync('src/colleges.ts', 'utf8');

const match = existingCode.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);
if (match) {
  const existingArray = JSON.parse(match[1]);
  
  // push unique ones
  const uniqueColleges = new Set(existingArray.map(c => c.toLowerCase()));
  let addedCount = 0;
  for (const c of newColleges) {
    if (!uniqueColleges.has(c.toLowerCase())) {
      existingArray.push(c);
      uniqueColleges.add(c.toLowerCase());
      addedCount++;
    }
  }

  const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(existingArray, null, 2) + ";\n";
  fs.writeFileSync('src/colleges.ts', newCode);
  console.log("Added " + addedCount + " more national colleges to the list. Total is now " + existingArray.length + ".");
} else {
  console.log("Could not find array in src/colleges.ts");
}
