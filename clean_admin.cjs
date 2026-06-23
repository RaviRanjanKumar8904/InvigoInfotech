const fs = require('fs');
const path = 'p:/Invigo/InvigoInfotech/src/components/AdminPanel.tsx';
let code = fs.readFileSync(path, 'utf8');

// Fix Regex bug
code = code.replace(/data\.registrationNo\.replace\(\/\\\\s\+\/g, ''\)/, "data.registrationNo.replace(/\\s+/g, '')");

// Remove nav item
code = code.replace(/\s*\{\s*id:\s*'settings',\s*label:\s*'Settings',\s*icon:\s*Settings2\s*\},/, '');

// Remove Settings render block
const renderBlockRegex = /\{\/\*\s*═══════════════════════ SETTINGS SECTION ═══════════════════════\s*\*\/\}[\s\S]*?(?=\{\/\*\s*═══════════════════════ ACTIVITY LOGS SECTION)/;
code = code.replace(renderBlockRegex, '');

// Remove from type definition
code = code.replace(/ \| 'settings'/, '');

fs.writeFileSync(path, code);
console.log('AdminPanel cleaned.');
