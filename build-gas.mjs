/** Build deployable Apps Script HTML resources from GitHub demo source. */
import fs from 'node:fs/promises';
const html = await fs.readFile(new URL('./index.html', import.meta.url),'utf8');
const css = await fs.readFile(new URL('./styles.css', import.meta.url),'utf8');
const js = await fs.readFile(new URL('./app.js', import.meta.url),'utf8');
const index = html
  .replace(/<link rel="stylesheet" href="styles\.css"\s*\/>/, '<style><?!= include(\'Styles\'); ?></style>')
  .replace(/<script src="app\.js" defer><\/script>/, '<script><?!= include(\'App\'); ?></script>')
  .replace('<head>', '<head>\n  <base target="_top" />');
if (!index.includes('include(\'Styles\')') || !index.includes('include(\'App\')')) throw new Error('The HTML template structure changed');
await Promise.all([
  fs.writeFile(new URL('./gas/Index.html',import.meta.url),index),
  fs.writeFile(new URL('./gas/Styles.html',import.meta.url),css),
  fs.writeFile(new URL('./gas/App.html',import.meta.url),js),
]);
console.log('Apps Script HTML resources synchronized.');
