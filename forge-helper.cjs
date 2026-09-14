const fs = require('node:fs');
const name = process.argv[2];
const unscoped = name.slice('@deepseek-ai/'.length);
const version = '0.1.5-rc.2';
const vendor = `vendor/dsh-runtime/${version}/deepseek-ai-${unscoped}-${version}.tgz`;
const fileValue = `file:${vendor}`;
const patchValue = `patch:${name}@file%3A${vendor}#./patches/${unscoped}@${version}.patch`;
let text = fs.readFileSync('package.json', 'utf8');
let hits = 0;
for (const sel of [`"${name}@npm:${version}"`, `"${name}@npm:^${version}"`]) {
  const from = `${sel}: "${fileValue}"`;
  const to = `${sel}: "${patchValue}"`;
  if (!text.includes(from)) throw new Error(`missing resolution: ${from}`);
  text = text.replace(from, to);
  hits += 1;
}
fs.writeFileSync('package.json', text);
console.log(`resolutions rewired for ${name} (${hits} keys)`);
