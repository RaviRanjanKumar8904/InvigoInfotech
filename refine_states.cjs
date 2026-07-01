const fs = require('fs');

let existingCode = fs.readFileSync('src/colleges.ts', 'utf8');
const match = existingCode.match(/export const EXTENDED_COLLEGES = (\[.*\]);/s);
if (match) {
  let colleges = JSON.parse(match[1]);
  
  const rules = [
    { state: "Tamil Nadu", keywords: ["chennai", "coimbatore", "anna university", "madurai", "tiruchirappalli", "tamil nadu", "salem", "vellore", "erode"] },
    { state: "Maharashtra", keywords: ["pune", "mumbai", "maharashtra", "nagpur", "nashik", "aurangabad", "amravati", "shivaji university", "savitribai", "babasaheb", "marathwada"] },
    { state: "Uttar Pradesh", keywords: ["uttar pradesh", "lucknow", "kanpur", "meerut", "agra", "varanasi", "allahabad", "gautam buddha", "noida", "ghaziabad", "bareilly", "aligarh"] },
    { state: "Karnataka", keywords: ["bangalore", "bengaluru", "karnataka", "mysore", "mangalore", "belgaum", "visvesvaraya", "vtu", "hubli", "dharwad", "gulbarga", "tumkur"] },
    { state: "Andhra Pradesh", keywords: ["andhra", "jntu", "visakhapatnam", "vijayawada", "guntur", "tirupati", "nellore", "kurnool", "rajahmundry", "kakinada", "anantapur"] },
    { state: "Telangana", keywords: ["telangana", "hyderabad", "osmania", "warangal", "kakatiya", "nizamabad", "karimnagar"] },
    { state: "Kerala", keywords: ["kerala", "kochi", "trivandrum", "thiruvananthapuram", "calicut", "mahatma gandhi", "kottayam", "kannur", "thrissur"] },
    { state: "West Bengal", keywords: ["kolkata", "bengal", "howrah", "jadavpur", "hooghly", "burdwan", "darjeeling", "siliguri"] },
    { state: "Gujarat", keywords: ["gujarat", "ahmedabad", "surat", "vadodara", "rajkot", "gandhinagar", "bhavnagar", "jamnagar"] },
    { state: "Rajasthan", keywords: ["rajasthan", "jaipur", "jodhpur", "udaipur", "kota", "bikaner", "ajmer", "alwar"] },
    { state: "Madhya Pradesh", keywords: ["madhya pradesh", "bhopal", "indore", "gwalior", "jabalpur", "rajiv gandhi", "ujjain", "sagar", "rewa"] },
    { state: "Odisha", keywords: ["odisha", "bhubaneswar", "cuttack", "biju patnaik", "rourkela", "berhampur", "sambalpur"] },
    { state: "Bihar", keywords: ["bihar", "patna", "gaya", "bhagalpur", "muzaffarpur", "darbhanga", "purnia", "aryabhatta", "magadh"] },
    { state: "Punjab", keywords: ["punjab", "chandigarh", "ludhiana", "amritsar", "jalandhar", "patiala", "ptu"] },
    { state: "Haryana", keywords: ["haryana", "gurgaon", "gurugram", "faridabad", "panipat", "ambala", "rohtak", "kurukshetra", "hisar"] },
    { state: "Assam", keywords: ["assam", "guwahati", "dibrugarh", "silchar", "jorhat", "tezpur"] },
    { state: "Delhi", keywords: ["delhi", "new delhi", "ndmc", "ipu"] },
    { state: "Chhattisgarh", keywords: ["chhattisgarh", "raipur", "bhilai", "bilaspur", "durg"] },
    { state: "Jharkhand", keywords: ["jharkhand", "ranchi", "jamshedpur", "dhanbad", "bokaro"] },
    { state: "Uttarakhand", keywords: ["uttarakhand", "dehradun", "roorkee", "haridwar", "nainital"] },
    { state: "Himachal Pradesh", keywords: ["himachal", "shimla", "mandi", "solan", "hamirpur"] }
  ];

  let updated = 0;

  colleges = colleges.map(c => {
    if (!c.state) {
      let nameLower = c.name.toLowerCase();
      for (let rule of rules) {
        for (let kw of rule.keywords) {
          if (nameLower.includes(kw)) {
            c.state = rule.state;
            updated++;
            break;
          }
        }
        if (c.state) break;
      }
    }
    return c;
  });

  const newCode = "export const EXTENDED_COLLEGES = " + JSON.stringify(colleges, null, 2) + ";\n";
  fs.writeFileSync('src/colleges.ts', newCode);
  
  const withoutState = colleges.filter(a => !a.state).length;
  console.log("Heuristic matching assigned state to " + updated + " colleges.");
  console.log("Colleges without state: " + withoutState + " out of " + colleges.length);
}
