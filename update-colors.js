const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const clientFiles = walk('C:/Users/sifan/.gemini/antigravity/scratch/partspal/client/src');
clientFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Change color scheme: slate -> zinc (darker, sleeker gray), blue -> emerald (circuit board vibe), cyan -> teal
  content = content.replace(/slate-/g, 'zinc-');
  content = content.replace(/blue-/g, 'emerald-');
  content = content.replace(/cyan-/g, 'teal-');
  
  // Update hardcoded hex colors in index.css and main.jsx
  content = content.replace(/#0f172a/g, '#09090b'); // bg-zinc-950
  content = content.replace(/#1e293b/g, '#18181b'); // bg-zinc-900
  content = content.replace(/#334155/g, '#27272a'); // bg-zinc-800
  
  fs.writeFileSync(file, content);
});
console.log('Color scheme updated successfully.');
