import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { profiles, mutual, validSwipe } from './src/profiles.mjs';
export function createApp(dbFile) {
  const db = new DatabaseSync(dbFile);
  db.exec('CREATE TABLE IF NOT EXISTS swipes (id INTEGER PRIMARY KEY, direction TEXT NOT NULL)');
  const all = db.prepare('SELECT id, direction FROM swipes ORDER BY rowid');
  const app = express();
  app.use(express.json({limit:'2kb'}));
  app.use(['/feed','/swipe','/matches'], (_req,res,next)=>{res.set('Cache-Control','no-store');next()});
  app.get('/feed', (_req,res)=>{
    const seen = new Set(all.all().map(s=>s.id));
    res.json(profiles.filter(p=>!seen.has(p.id)));
  });
  app.get('/matches', (_req,res)=>res.json(all.all().filter(s=>mutual(s.id,s.direction)).map(s=>profiles[s.id-1])));
  app.post('/swipe', (req,res)=>{
    if(!validSwipe(req.body)) return res.status(400).json({error:'Invalid swipe'});
    const {profileId,direction} = req.body;
    const result=db.prepare('INSERT OR IGNORE INTO swipes VALUES (?,?)').run(profileId,direction);
    if(!result.changes) return res.status(409).json({error:'Already swiped'});
    res.status(201).json({matched:mutual(profileId,direction)});
  });
  app.use(express.static(fileURLToPath(new URL('./public/',import.meta.url))));
  return {app,close:()=>db.close()};
}
if (process.argv[1] && fileURLToPath(import.meta.url) === (await import('node:path')).resolve(process.argv[1])) {
  mkdirSync('data',{recursive:true});
  createApp('data/coy.sqlite').app.listen(process.env.PORT || 3000,()=>console.log('Coy Discover listening on port '+(process.env.PORT || 3000)));
}
