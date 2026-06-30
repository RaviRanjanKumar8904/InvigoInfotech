const fs = require('fs');

const rawText = `
1–10: IIT Madras (Chennai), IISc Bangalore (Bengaluru), IIT Bombay (Mumbai), IIT Delhi (New Delhi), IIT Kanpur, IIT Kharagpur, IIT Roorkee, AIIMS Delhi, JNU (New Delhi), Banaras Hindu University (Varanasi)
11–20: IIT Guwahati, IIT Hyderabad, Jamia Millia Islamia (New Delhi), Manipal Academy of Higher Education, University of Delhi, BITS Pilani, Amrita Vishwa Vidyapeetham (Coimbatore), Jadavpur University (Kolkata), Aligarh Muslim University, Homi Bhabha National Institute (Mumbai)
21–30: VIT Vellore, SRM Institute of Science & Technology (Chennai), Saveetha Institute (Chennai), Indian Agricultural Research Institute (New Delhi), Siksha 'O' Anusandhan (Bhubaneswar), University of Hyderabad, IIT Indore, KIIT (Bhubaneswar), Anna University (Chennai), NIT Tiruchirappalli
31–40: IIT-BHU Varanasi, Chandigarh University, PGIMER Chandigarh, NIT Rourkela, IIT (ISM) Dhanbad, IIT Patna, Amity University, JSS Academy Mysuru, IIT Gandhinagar, Symbiosis International (Pune)
41–50: Andhra University Visakhapatnam, University of Kerala, JIPMER Puducherry, Thapar Institute Patiala, NIT Calicut, KL University, Calcutta University, Kalasalingam Academy, Lovely Professional University, Cochin University
51–60: Shanmugha Arts/SASTRA (Thanjavur), Gauhati University, Osmania University Hyderabad, NIT Karnataka Surathkal, IISER Pune, IIT Ropar, Panjab University, IIT Mandi, University of Kashmir, NIMHANS Bengaluru
61–70: Bharathidasan University, Delhi Technological University, NIT Warangal, UPES Dehradun, Institute of Chemical Technology Mumbai, IIT Jodhpur, IISER Kolkata, University of Madras, BBA University Lucknow, IISER Mohali
71–80: Dr. D.Y. Patil Vidyapeeth Pune, Graphic Era University Dehradun, Alagappa University, Jamia Hamdard, IISER Bhopal, Bharathiar University, MNIT Jaipur, AIIMS Rishikesh, Mahatma Gandhi University Kottayam, IIT Bhubaneswar
81–90: Punjab Agricultural University, SSN College of Engineering Chennai, King George's Medical University Lucknow, Datta Meghe Institute Wardha, Shiv Nadar University, VNIT Nagpur, University of Jammu, Tamil Nadu Agricultural University, IIIT Hyderabad, Bharath Institute Chennai
91–100: Savitribai Phule Pune University, Mumbai University, Sathyabama Institute Chennai, SKUAST Kashmir, NMIMS Mumbai, Christ University Bengaluru, NIT Silchar, Manipal University Jaipur, MMM University of Technology Gorakhpur, AIIMS Bhubaneswar
`;

// Clean up
const lines = rawText.trim().split('\n');
const top100 = [];

lines.forEach(line => {
  const parts = line.split(':');
  if (parts.length > 1) {
    const colleges = parts[1].split(',').map(c => c.trim()).filter(Boolean);
    top100.push(...colleges);
  }
});

// Read existing src/colleges.ts
let existingCode = fs.readFileSync('src/colleges.ts', 'utf8');

// We need to parse out the array, append the top100, and write it back.
// Since we generated it with JSON.stringify previously, we can extract the JSON array string, parse it, push, and rewrite.

const match = existingCode.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);
if (match) {
  const existingArray = JSON.parse(match[1]);
  
  // push unique ones
  const uniqueColleges = new Set(existingArray.map(c => c.toLowerCase()));
  for (const c of top100) {
    if (!uniqueColleges.has(c.toLowerCase())) {
      existingArray.push(c);
      uniqueColleges.add(c.toLowerCase());
    }
  }

  const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(existingArray, null, 2) + ";\n";
  fs.writeFileSync('src/colleges.ts', newCode);
  console.log("Added " + top100.length + " top national colleges to the list. Total is now " + existingArray.length + ".");
} else {
  console.log("Could not find array in src/colleges.ts");
}
