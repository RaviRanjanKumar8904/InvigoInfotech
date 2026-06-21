const fs = require('fs');
let data = fs.readFileSync('src/data.ts', 'utf8');

const mapping = {
  ai_ml: '/domain_ai_ml.png',
  cybersecurity: '/domain_cybersecurity.png',
  cloud_devops: '/domain_cloud_devops.png',
  mobile_app_dev: '/domain_mobile_app_dev.png',
  iot_embedded: '/domain_iot_embedded.png',
  blockchain: '/domain_blockchain.png',
  ui_ux_design: '/domain_ui_ux_design.png',
  robotics_automation: '/domain_robotics_automation.png',
  digital_marketing: '/domain_digital_marketing.png',
  business_analytics: '/domain_business_analytics.png',
  financial_accounting: '/domain_financial_accounting.png',
  hr_management: '/domain_hr_management.png',
  graphic_design: '/domain_graphic_design.png',
  content_writing: '/domain_content_writing.png',
  video_editing: '/domain_video_editing.png',
  stock_market: '/domain_stock_market.png',
  vlsi_design: '/domain_vlsi_design.png',
  three_d_printing: '/domain_three_d_printing.png',
  ecommerce: '/domain_ecommerce.png',
  supply_chain: '/domain_supply_chain.png'
};

const domainBlocks = data.split('  {\n    id:');
let out = domainBlocks[0];

for (let i = 1; i < domainBlocks.length; i++) {
  let block = '  {\n    id:' + domainBlocks[i];
  const idMatch = block.match(/id:\s*'([^']+)'/);
  if (idMatch) {
    const id = idMatch[1];
    if (mapping[id]) {
       if (block.includes('https://images.unsplash.com')) {
          block = block.replace(/imageUrl:\s*'https:\/\/images\.unsplash\.com[^']+',/, `imageUrl: '${mapping[id]}',`);
       }
       else if (!block.includes('imageUrl:')) {
          block = block.replace(/(id:\s*'[^']+',)/, `$1\n    imageUrl: '${mapping[id]}',`);
       }
    }
  }
  out += block;
}

fs.writeFileSync('src/data.ts', out);
console.log('Done mapping local images');
