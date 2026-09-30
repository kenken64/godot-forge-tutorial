import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
 const page = await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let state='idle',stage='instance';
 await page.route('**/api/godot/**', async route=> {
  const req=route.request(); assert.equal(req.headers().authorization,undefined);
  let data,status=200;const endpoint=new URL(req.url()).pathname;
  if(endpoint.endsWith('/config')) data={provisioningEnabled:true,configured:state==='succeeded',provisioning:{state,stage,startedAt:new Date(Date.now()-10*60_000).toISOString()}};
  else if(endpoint.endsWith('/session')) {
   if(state!=='succeeded'){state='running';status=202;data={provisioning:{state,stage}};}
   else data={url:'https://godot-test.kere.ceo/s/test/',downloadUrl:'https://godot-test.kere.ceo/download/test/'};
  } else {assert.equal(req.postDataJSON().confirmed,true);state='removing';status=202;data={provisioning:{state}};}
  await route.fulfill({status,json:data});
 });
 await page.context().route('https://godot-test.kere.ceo/**',r=>r.fulfill({contentType:'text/html',body:'<h1>Godot test</h1>'}));
 await page.goto('http://localhost:3000/setup-godot-with-ai/');
 await page.waitForFunction(()=>!document.querySelector('#start-cloud').disabled);
 assert.equal(await page.locator('#provision-controls').count(),0);
 assert.equal(await page.locator('#download-starter').getAttribute('href'),null);
 await page.locator('#start-cloud').click();await page.locator('#cloud-preparing').waitFor({state:'visible'});
 assert.equal(await page.locator('#waiting-game button').count(),9);
 await page.locator('#waiting-game button').nth(0).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('#waiting-game button')].some(b=>b.textContent==='O'));
 await page.locator('#game-new').click();assert.equal(await page.locator('#waiting-game button').nth(0).textContent(),'');
 stage='installing';await page.waitForFunction(()=>document.querySelector('#readiness-progress').value===2);
 assert.match(await page.locator('#readiness-summary').textContent(),/2 of 5 readiness checks complete · 10 min since start/);
 assert.match(await page.locator('#readiness-checked').textContent(),/Live status checked just now/);
 assert.equal(await page.locator('#readiness-steps li[data-stage="installing"]').getAttribute('data-status'),'active');
 assert.equal(await page.locator('#readiness-steps li[data-status="active"] .task-fill').count(),1);
 await page.reload();
 await page.waitForFunction(()=>document.querySelector('#readiness-progress').value===2);
 assert.match(await page.locator('#readiness-summary').textContent(),/2 of 5 readiness checks complete/);
 const board=await page.locator('#waiting-game').boundingBox(),bar=await page.locator('#readiness-progress').boundingBox();assert.ok(bar.y>board.y+board.height);
 await page.screenshot({path:'/tmp/godot-preparation-test.png',fullPage:true});assert.equal(page.context().pages().length,1);
 state='succeeded';stage='ready';await page.waitForFunction(()=>document.querySelector('#start-cloud').textContent.includes('Launch')&&!document.querySelector('#start-cloud').disabled);
 assert.equal(await page.locator('#readiness-progress').getAttribute('value'),'5');
 assert.equal(await page.locator('#download-starter').getAttribute('href'),'/api/final-game/starter-kit');
 const next=page.waitForEvent('popup');await page.locator('#start-cloud').click();const popup=await next;await popup.waitForURL('https://godot-test.kere.ceo/s/test/');assert.equal(await popup.locator('h1').textContent(),'Godot test');
 await page.locator('#stop-cloud').click();
 await page.locator('#remove-dialog').waitFor({state:'visible'});
 assert.match(await page.locator('#remove-dialog').innerText(),/All project files saved on the instance/);
 assert.equal(state,'succeeded');
 await page.screenshot({path:'/tmp/godot-removal-dialog-test.png'});
 await page.locator('#remove-dialog button[value="cancel"]').click();
 assert.equal(await page.locator('#remove-dialog').isVisible(),false);
 assert.equal(state,'succeeded');
 await page.locator('#stop-cloud').click();
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#remove-dialog').isVisible(),false);
 assert.equal(state,'succeeded');
 await page.locator('#stop-cloud').click();
 await page.locator('#confirm-remove').click();
 await page.waitForFunction(()=>document.querySelector('#stop-cloud').textContent==='Removing…' && document.querySelector('#start-cloud').disabled);
 assert.equal(state,'removing');assert.equal(await page.locator('#stop-cloud').textContent(),'Removing…');assert.equal(await page.locator('#start-cloud').isDisabled(),true);assert.equal(await page.locator('#stop-cloud').isDisabled(),true);
 state='removed';await page.waitForFunction(()=>document.querySelector('#start-cloud').textContent.includes('Start')&&!document.querySelector('#start-cloud').disabled);
 assert.equal(await page.locator('#download-starter').getAttribute('href'),null);
 assert.deepEqual(errors,[]);console.log('Passed game, progress, readiness, new-tab launch, removal and no administrator token.');
} finally {await browser.close();}
