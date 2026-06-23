const fs = require('fs');

const allDomains = [
  "building_construction","autocad","web_development","python_programming","data_science","revit",
  "full_stack","core_java","electric_vehicle","solidworks","ic_engine","ai_ml","cybersecurity",
  "cloud_devops","mobile_app_dev","iot_embedded","blockchain","ui_ux_design","robotics_automation",
  "digital_marketing","business_analytics","financial_accounting","hr_management","graphic_design",
  "content_writing","video_editing","stock_market","vlsi_design","three_d_printing","ecommerce","supply_chain"
];

const existing = ["web_development","python_programming","full_stack","data_science","core_java"];

const missing = allDomains.filter(d => !existing.includes(d));

const generateDomainQuestions = (domain) => {
  const title = domain.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `  ${domain}: [
    { question: 'What is a primary focus of ${title}?', options: ['Design & Structure', 'Marketing', 'Medical Research', 'Cooking'], correctIndex: 0 },
    { question: 'Which tool is commonly used in ${title}?', options: ['Microscope', 'Industry Standard Software', 'Stethoscope', 'Oven'], correctIndex: 1 },
    { question: 'What is a key benefit of mastering ${title}?', options: ['Singing skills', 'Enhanced Career Prospects', 'Physical Strength', 'Dancing ability'], correctIndex: 1 },
    { question: 'What is the first step in a typical ${title} project?', options: ['Final Deployment', 'Planning and Analysis', 'Maintenance', 'Celebrating'], correctIndex: 1 },
    { question: 'Which methodology is often applied in ${title}?', options: ['Agile / Iterative', 'Random Guessing', 'Trial and Error', 'Ignoring Requirements'], correctIndex: 0 },
    { question: 'What does quality assurance mean in ${title}?', options: ['Skipping tests', 'Ensuring the final product meets standards', 'Making things look pretty', 'Hiding errors'], correctIndex: 1 },
    { question: 'How do professionals stay updated in ${title}?', options: ['Continuous Learning', 'Ignoring new trends', 'Watching movies', 'Sleeping'], correctIndex: 0 },
    { question: 'Which of these is a common challenge in ${title}?', options: ['Too much free time', 'Managing complex requirements', 'Boredom', 'Lack of coffee'], correctIndex: 1 },
    { question: 'What role does collaboration play in ${title}?', options: ['None', 'Minimal', 'Crucial for success', 'Negative impact'], correctIndex: 2 },
    { question: 'What is the ultimate goal of ${title}?', options: ['To waste time', 'To deliver value and solve problems', 'To confuse people', 'To break things'], correctIndex: 1 },
  ],`;
};

let additionalCode = '\n';
for (const dom of missing) {
  additionalCode += generateDomainQuestions(dom) + '\n';
}

const dataPath = './src/data.ts';
let content = fs.readFileSync(dataPath, 'utf8');

// Find the end of DEFAULT_MCQ_QUESTIONS
// It ends with "  },\n};\n"
const insertIndex = content.lastIndexOf('};\n');

if (insertIndex !== -1) {
  content = content.slice(0, insertIndex) + additionalCode + content.slice(insertIndex);
  fs.writeFileSync(dataPath, content);
  console.log('Successfully added missing domains to DEFAULT_MCQ_QUESTIONS!');
} else {
  console.log('Could not find the end of DEFAULT_MCQ_QUESTIONS');
}
