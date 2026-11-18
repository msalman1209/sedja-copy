const fs = require('fs');

const navHtml = fs.readFileSync('nav_snippet.html', 'utf8');

// Parse megaMenu
const listBlocks = [...navHtml.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)];
const categories = [];

for (const block of listBlocks) {
  const content = block[1];
  const headerMatch = content.match(/<li[^>]*class="header"[^>]*>([\s\S]*?)<\/li>/i);
  if (!headerMatch) continue;
  const header = headerMatch[1].replace(/<[^>]+>/g, '').trim();

  const toolMatches = [...content.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  const tools = toolMatches.map(tm => {
    const href = tm[1];
    const inner = tm[2];
    const nameMatch = inner.match(/<div[^>]*class="[^"]*task-name[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      || inner.match(/<span[^>]*class="[^"]*task-name[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    const descMatch = inner.match(/<div[^>]*class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      || inner.match(/<span[^>]*class="[^"]*desc[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    
    let name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    let desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    return { href, name, desc };
  }).filter(t => t.name.length > 0 && !t.name.startsWith('Recent'));

  if (tools.length > 0) {
    categories.push({
      category: header,
      tools
    });
  }
}

console.log('Found categories count:', categories.length);
categories.forEach(c => {
  console.log(`\n### ${c.category} (${c.tools.length} tools)`);
  c.tools.forEach(t => console.log(`  - [${t.name}](${t.href}): ${t.desc}`));
});

fs.writeFileSync('sejda_megamenu_tools.json', JSON.stringify(categories, null, 2));

