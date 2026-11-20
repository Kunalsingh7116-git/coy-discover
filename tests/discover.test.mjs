import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:http';
import {Duplex} from 'node:stream';
import {createApp} from '../server.mjs';
test('private feed, swipe outcomes, concurrency, persistence and exhaustion', async()=>{
 const dir=mkdtempSync(join(tmpdir(),'coy-test-')), file=join(dir,'test.sqlite');
 async function start(){const {app,close}=createApp(file);const server=createServer(app);
 function request(path,body){return new Promise((resolve,reject)=>{
   const chunks=[];
   const socket=new Duplex({read(){},write(chunk,encoding,done){chunks.push(Buffer.from(chunk));done()}});
   socket.on('error',reject);
   socket.on('finish',()=>{
     const [header,payload]=Buffer.concat(chunks).toString().split('\r\n\r\n');
     resolve({status:Number(header.split(' ')[1]),json:()=>JSON.parse(payload)});
   });
   server.emit('connection',socket);
   const data=body?JSON.stringify(body):'';
   socket.push((body?'POST':'GET')+' '+path+' HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\nContent-Type: application/json\r\nContent-Length: '+Buffer.byteLength(data)+'\r\n\r\n'+data);
 })}
 return {
 get:async path=>(await request(path)).json(),
 swipe:(profileId,direction)=>request('/swipe',{profileId,direction}),
 close
 }}
 let s=await start();
 try{
 const feed=await s.get('/feed');assert.equal(feed.length,30);assert.deepEqual(Object.keys(feed[0]).sort(),['age','bio','city','id','interests','name','photo']);
 assert.deepEqual(await s.get('/matches'),[]);
 assert.equal((await s.swipe(99,'like')).status,400);assert.equal((await s.swipe(1,'invalid')).status,400);
 const race=await Promise.all([s.swipe(1,'like'),s.swipe(1,'like')]);assert.deepEqual(race.map(r=>r.status).sort(),[201,409]);
 assert.deepEqual(await race.find(r=>r.status===201).json(),{matched:true});
 assert.deepEqual(await (await s.swipe(2,'like')).json(),{matched:false});
 assert.deepEqual(await (await s.swipe(5,'pass')).json(),{matched:false});
 await s.close();s=await start();assert.deepEqual((await s.get('/matches')).map(p=>p.id),[1]);
 const rest=await s.get('/feed');assert.equal(rest.length,27);for(const p of rest)await s.swipe(p.id,'pass');
 assert.deepEqual(await s.get('/feed'),[]);assert.equal((await s.get('/matches')).length,1);
 }finally{await s.close();rmSync(dir,{recursive:true,force:true})}
});
