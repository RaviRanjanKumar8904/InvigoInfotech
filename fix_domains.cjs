const fs = require('fs');
const path = require('path');

const allDegrees = ['B.Tech', 'Diploma', 'BCA', 'B.Sc', 'MBA', 'BA', 'B.Com'];

const mappings = {
  "staad_pro": { degrees: ['B.Tech', 'Diploma'], branches: ["Civil", "Architecture"] },
  "ansys": { degrees: ['B.Tech', 'Diploma'], branches: ["Mechanical", "Automobile", "Robotics", "Mechatronics", "Industrial"] },
  "embedded_system": { degrees: ['B.Tech', 'Diploma'], branches: ["ECE", "Electrical", "Robotics", "Mechatronics"] },
  "internet_of_things": { degrees: ['B.Tech', 'Diploma', 'B.Sc', 'BCA'], branches: ["CSE", "IT", "ECE", "Electrical", "Robotics", "Computer Science"] },
  "renewable_energy": { degrees: ['B.Tech', 'Diploma', 'B.Sc'], branches: ["Electrical", "Mechanical", "Civil", "Physics"] },
  "plc_programming": { degrees: ['B.Tech', 'Diploma'], branches: ["Electrical", "ECE", "Mechanical", "Industrial"] },
  "matlab": { degrees: ['B.Tech', 'Diploma', 'B.Sc'], branches: ["Electrical", "ECE", "Mechanical", "Robotics", "Mathematics", "Physics"] },
  "accounting_tally_gst": { degrees: ['B.Com', 'MBA', 'BA'], branches: ["Accounting", "Finance", "Taxation", "Banking", "General", "Economics"] },
  "ai_ethics": { degrees: allDegrees, branches: [] }, // universal
  "arabic_ai": { degrees: ['B.Tech', 'BCA', 'B.Sc', 'BA'], branches: ["CSE", "IT", "Computer Science", "General", "English"] },
  "archaeology": { degrees: ['BA'], branches: ["History", "General"] },
  "biomedical_research": { degrees: ['B.Sc', 'B.Tech'], branches: ["Chemistry", "General"] },
  "buddhist_studies_heritage": { degrees: ['BA'], branches: ["Sociology", "General"] },
  "climate_carbon": { degrees: ['B.Tech', 'B.Sc', 'BA'], branches: ["Civil", "Chemistry", "Physics", "General", "Geography"] },
  "clinical_counseling": { degrees: ['BA', 'B.Sc'], branches: ["Psychology", "General"] },
  "corporate_legal": { degrees: ['MBA', 'B.Com', 'BA'], branches: ["Finance", "General", "Political Science"] },
  "cyber_security": { degrees: ['B.Tech', 'Diploma', 'BCA', 'B.Sc'], branches: ["CSE", "IT", "ECE", "Computer Science"] },
  "digital_archives": { degrees: ['BA', 'B.Sc', 'BCA'], branches: ["English", "General", "Computer Science"] },
  "digital_marketing_dm": { degrees: ['MBA', 'B.Com', 'BA', 'BCA'], branches: ["Marketing", "General"] },
  "esg_research": { degrees: ['MBA', 'B.Com', 'BA'], branches: ["Operations", "IT Management", "Finance", "General"] },
  "ethnographic_field_research": { degrees: ['BA'], branches: ["Sociology", "Psychology", "General"] },
  "financial_mathematics_stock_market_finmath": { degrees: ['B.Com', 'MBA', 'B.Sc', 'BA'], branches: ["Finance", "Mathematics", "Accounting", "General", "Economics"] },
  "food_technology_fmcg": { degrees: ['B.Sc', 'B.Tech', 'Diploma'], branches: ["Chemistry", "General"] },
  "genetics_biotech_zoology": { degrees: ['B.Sc'], branches: ["Chemistry", "General"] },
  "gis_analysis": { degrees: ['B.Tech', 'B.Sc', 'BA'], branches: ["Civil", "Geography", "Computer Science", "General"] },
  "herbal_ayurvedic_product_development": { degrees: ['B.Sc', 'Diploma'], branches: ["Chemistry", "General"] },
  "heritage_conservation": { degrees: ['B.Tech', 'BA'], branches: ["Civil", "Architecture", "General"] },
  "hindi_journalism": { degrees: ['BA'], branches: ["English", "General", "Political Science"] },
  "hindi_content_writing_ai": { degrees: ['BA', 'BCA'], branches: ["English", "General"] },
  "historical_content_seo_blogging": { degrees: ['BA', 'MBA', 'B.Com'], branches: ["Marketing", "English", "General"] },
  "hr_operations_hr_ops": { degrees: ['MBA', 'B.Com', 'BA'], branches: ["HR", "Management", "General"] },
  "human_rights": { degrees: ['BA'], branches: ["Political Science", "Sociology", "General"] },
  "maithili_ai": { degrees: ['B.Tech', 'BCA', 'BA'], branches: ["CSE", "IT", "General"] },
  "mental_health": { degrees: ['BA', 'B.Sc'], branches: ["Psychology", "General"] },
  "microfinance": { degrees: ['MBA', 'B.Com', 'BA'], branches: ["Finance", "Economics", "Banking", "General"] },
  "music_production": { degrees: allDegrees, branches: [] },
  "organic_farming": { degrees: ['B.Sc', 'Diploma', 'BA'], branches: ["Chemistry", "General"] },
  "personal_finance": { degrees: allDegrees, branches: [] },
  "pharma_drug_chemistry": { degrees: ['B.Sc', 'Diploma'], branches: ["Chemistry", "General"] },
  "political_journalism": { degrees: ['BA'], branches: ["Political Science", "English", "General"] },
  "public_health": { degrees: ['BA', 'B.Sc'], branches: ["Sociology", "General"] },
  "renewable_energy_system": { degrees: ['B.Tech', 'Diploma', 'B.Sc'], branches: ["Electrical", "Mechanical", "Civil"] },
  "sales": { degrees: ['MBA', 'B.Com', 'BA'], branches: ["Marketing", "General"] },
  "sanskrit": { degrees: ['BA'], branches: ["General"] },
  "scriptwriting": { degrees: ['BA', 'BCA'], branches: ["English", "General"] },
  "solar_energy_pv": { degrees: ['B.Tech', 'Diploma', 'B.Sc'], branches: ["Electrical", "Mechanical", "Civil"] },
  "spoken_english": { degrees: allDegrees, branches: [] },
  "urdu": { degrees: ['BA'], branches: ["General"] }
};

const dataTsPath = path.join(__dirname, 'src', 'data.ts');
let dataTs = fs.readFileSync(dataTsPath, 'utf8');

for (const [id, config] of Object.entries(mappings)) {
  const targetId = `id: '${id}'`;
  const idx = dataTs.indexOf(targetId);
  if (idx !== -1) {
    const startOfObject = dataTs.lastIndexOf('{', idx);
    const endOfObject = dataTs.indexOf('}', idx);
    let objText = dataTs.substring(startOfObject, endOfObject + 1);
    
    const branchesStr = config.branches.map(b => `'${b}'`).join(', ');
    const degreesStr = config.degrees.map(d => `'${d}'`).join(', ');
    
    let newObjText = objText.replace(/targetBranches:\s*\[[^\]]*\]/, `targetBranches: [${branchesStr}]`);
    newObjText = newObjText.replace(/targetDegrees:\s*\[[^\]]*\]/, `targetDegrees: [${degreesStr}]`);
    
    dataTs = dataTs.substring(0, startOfObject) + newObjText + dataTs.substring(endOfObject + 1);
  }
}

fs.writeFileSync(dataTsPath, dataTs);
console.log("Updated both degrees and branches for new domains successfully!");
