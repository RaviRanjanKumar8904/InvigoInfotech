const fs = require('fs');
const path = require('path');

const branchMappings = {
  "staad_pro": ["Civil", "Architecture"],
  "ansys": ["Mechanical", "Automobile", "Robotics", "Mechatronics", "Industrial"],
  "embedded_system": ["ECE", "Electrical", "Robotics", "Mechatronics"],
  "internet_of_things": ["CSE", "IT", "ECE", "Electrical", "Robotics"],
  "renewable_energy": ["Electrical", "Mechanical", "Civil"],
  "plc_programming": ["Electrical", "ECE", "Mechanical", "Industrial"],
  "matlab": ["Electrical", "ECE", "Mechanical", "Robotics"],
  "accounting_tally_gst": ["Finance", "Accounting", "Taxation", "Banking", "General"],
  "ai_ethics": ["CSE", "IT", "English", "Sociology", "Political Science", "General"],
  "arabic_ai": ["CSE", "IT", "General"],
  "archaeology": ["General"],
  "biomedical_research": ["General"],
  "buddhist_studies_heritage": ["English", "Sociology", "General"],
  "climate_carbon": ["Civil", "Electrical", "Mechanical", "Chemistry", "Physics", "General"],
  "clinical_counseling": ["Psychology", "General"],
  "corporate_legal": ["Finance", "General"],
  "cyber_security": ["CSE", "IT", "ECE"],
  "digital_archives": ["CSE", "IT", "English", "General"],
  "digital_marketing_dm": ["Marketing", "IT", "General"],
  "esg_research": ["Operations", "IT Management", "Finance", "General"],
  "ethnographic_field_research": ["Sociology", "Psychology", "General"],
  "financial_mathematics_stock_market_finmath": ["Finance", "Mathematics", "Accounting", "General"],
  "food_technology_fmcg": ["Chemistry", "General"],
  "genetics_biotech_zoology": ["Chemistry", "General"],
  "gis_analysis": ["Civil", "Geography", "Computer Science", "General"],
  "herbal_ayurvedic_product_development": ["Chemistry", "General"],
  "heritage_conservation": ["Civil", "Architecture", "General"],
  "hindi_journalism": ["English", "General"],
  "hindi_content_writing_ai": ["English", "General", "CSE"],
  "historical_content_seo_blogging": ["Marketing", "English", "General"],
  "hr_operations_hr_ops": ["HR", "Management", "General"],
  "human_rights": ["Political Science", "Sociology", "General"],
  "maithili_ai": ["CSE", "IT", "General"],
  "mental_health": ["Psychology", "General"],
  "microfinance": ["Finance", "Economics", "Banking", "General"],
  "music_production": ["General"],
  "organic_farming": ["General"],
  "personal_finance": ["Finance", "Economics", "General"],
  "pharma_drug_chemistry": ["Chemistry", "General"],
  "political_journalism": ["Political Science", "English", "General"],
  "public_health": ["Sociology", "General"],
  "renewable_energy_system": ["Electrical", "Mechanical", "Civil"],
  "sales": ["Marketing", "General"],
  "sanskrit": ["General"],
  "scriptwriting": ["English", "General"],
  "solar_energy_pv": ["Electrical", "Mechanical", "Civil"],
  "spoken_english": ["General"],
  "urdu": ["General"]
};

const dataTsPath = path.join(__dirname, 'src', 'data.ts');
let dataTs = fs.readFileSync(dataTsPath, 'utf8');

for (const [id, branches] of Object.entries(branchMappings)) {
  const targetId = `id: '${id}'`;
  const idx = dataTs.indexOf(targetId);
  if (idx !== -1) {
    const startOfObject = dataTs.lastIndexOf('{', idx);
    const endOfObject = dataTs.indexOf('}', idx);
    let objText = dataTs.substring(startOfObject, endOfObject + 1);
    
    // Replace targetBranches: ['General'] with targetBranches: ['Branch1', 'Branch2']
    const branchesStr = branches.map(b => `'${b}'`).join(', ');
    const newObjText = objText.replace(/targetBranches:\s*\[[^\]]+\]/, `targetBranches: [${branchesStr}]`);
    
    dataTs = dataTs.substring(0, startOfObject) + newObjText + dataTs.substring(endOfObject + 1);
  }
}

fs.writeFileSync(dataTsPath, dataTs);
console.log("Updated branches for new domains successfully!");
