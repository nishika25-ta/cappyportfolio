import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();const results=[];
fs.mkdirSync('.shots/orbit',{recursive:true});
try{
  for(const [width,height] of [[1440,900],[390,844],[320,740]]){
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://localhost:4400/',{waitUntil:'networkidle'});await page.waitForTimeout(1500);
    let lastRotation='';
    for(const progress of [.35,.65,.92]){
      await page.evaluate(({progress,height,width})=>window.scrollTo(0,document.querySelector('.hero').parentElement.offsetTop+height*(width<=600?1.4:1.65)*progress),{progress,height,width});
      await page.waitForTimeout(1000);
      const state=await page.evaluate(()=>({
        scale:Math.hypot(new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.hero-cat-left')).transform).a,new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.hero-cat-left')).transform).b),
        visible:getComputedStyle(document.querySelector('.hero-orbit')).visibility,
        rotation:document.querySelector('.orbit-carousel').getAttribute('style'),
        label:getComputedStyle(document.querySelector('.orbit-center')).opacity,
        overflow:document.documentElement.scrollWidth>innerWidth,
        stickers:[...document.querySelectorAll('.orbit-item')].map(el=>getComputedStyle(el).opacity)
      }));
      assert.ok(state.scale<=1.05,'The old giant-cat enlargement is gone.');
      assert.equal(state.visible,'visible');
      assert.ok(Number(state.label)>.95,'Central message is visible in the orbit scene.');
      assert.equal(state.overflow,false,'The moving scene does not create horizontal page overflow.');
      if(progress>.6){assert.ok(state.stickers.every(n=>Number(n)>.95));assert.notEqual(state.rotation,lastRotation,'Stickers orbit as the user scrolls.');}
      lastRotation=state.rotation;
      await page.screenshot({path:`.shots/orbit/${width}-${progress}.png`});
    }
    await page.locator('#services').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
    await page.locator('[data-pick-service="food"]').click();
    assert.equal(await page.locator('[data-playground-character="food"]').isVisible(),true);
    assert.deepEqual(errors,[]);results.push({width,height,passed:true});await page.close();
  }
  fs.writeFileSync('.shots/orbit/results.json',JSON.stringify(results,null,2));
  console.log('PASS orbit choreography at three scroll phases and three widths, restrained cat scale, visible text, no overflow, working service picker.');
}finally{await browser.close();}
