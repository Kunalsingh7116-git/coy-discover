// The packaging script injects the public files and the server-only profile module.
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path==='/swipe'&&request.method==='POST'){
   let body;try{body=await request.json()}catch{return json({error:'Invalid JSON'},400)}
   if(!validSwipe(body))return json({error:'Invalid swipe'},400);
   const result=await env.DB.prepare('INSERT OR IGNORE INTO swipes(id,direction) VALUES(?,?)').bind(body.profileId,body.direction).run();
   return result.meta.changes?json({matched:mutual(body.profileId,body.direction)},201):json({error:'Already swiped'},409);
 }
 if(request.method!=='GET')return new Response(null,{status:405});
 if(path==='/feed'||path==='/matches'){
   const {results}=await env.DB.prepare('SELECT id, direction FROM swipes ORDER BY id').all();
   const seen=new Set(results.map(s=>s.id));
   return json(path==='/feed'?profiles.filter(p=>!seen.has(p.id)):results.filter(s=>mutual(s.id,s.direction)).map(s=>profiles[s.id-1]));
 }
 const asset=assets[path==='/'?'/index.html':path];
 return asset?new Response(asset[1],{headers:{'Content-Type':asset[0]}}):new Response(null,{status:404});
}};
