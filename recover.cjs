const fs = require('fs');
const readline = require('readline');

async function recover() {
  const logPath = 'C:\\Users\\kille\\.gemini\\antigravity-ide\\brain\\aa012f77-6be0-4fe9-89e0-95de07250024\\.system_generated\\logs\\transcript_full.jsonl';
  
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastAdminPanelState = '';

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      // Look for the last successful view_file of AdminPanel.tsx where it showed the PartnerColleges block,
      // Or look for write_to_file or multi_replace responses.
      // Actually, transcript_full contains the tool inputs and outputs.
      if (obj.tool_calls) {
         for (const tc of obj.tool_calls) {
           if (tc.name === 'write_to_file' && tc.args.TargetFile.includes('AdminPanel.tsx')) {
             lastAdminPanelState = tc.args.CodeContent;
           }
         }
      }
      if (obj.type === 'TOOL_RESPONSE' && obj.content && obj.content.includes('AdminPanel.tsx')) {
         // Unfortunately, multi_replace_file_content tool responses don't include the full file in the output, only diffs.
         // But maybe there is a 'view_file' output with the full file? view_file chunks.
      }
    } catch (e) {}
  }
  
  if (lastAdminPanelState) {
    fs.writeFileSync('recovered_admin_panel.tsx', lastAdminPanelState);
    console.log('Recovered from write_to_file!');
  } else {
    console.log('Could not find write_to_file for AdminPanel.tsx');
  }
}

recover();
