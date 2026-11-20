import fs from 'node:fs';
import path from 'node:path';
const assets=Object.create(null);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue}
 const type=mime[path.extname(file)];if(type)assets['/'+path.relative('public',file).split(path.sep).join('/')]=[type,fs.readFileSync(file,'utf8')];
}}
walk('public');fs.mkdirSync('dist/server',{recursive:true});
fs.writeFileSync('dist/server/index.js','const assets='+JSON.stringify(assets)+';\n'+fs.readFileSync('src/profiles.mjs','utf8').replace(/^export /gm,'')+'\n'+fs.readFileSync('src/hosted-worker.mjs','utf8'));
