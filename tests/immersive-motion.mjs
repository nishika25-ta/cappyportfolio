import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4400/',{waitUntil:'networkidle'});
  await page.waitForTimeout(1200);
  assert.ok(await page.locator('.motion-word').count()>20,'Section headings have animated words.');
  const button=page.locator('.hero-button');const box=await button.boundingBox();
  await page.mouse.move(box.x+box.width-15,box.y+box.height/2);await page.waitForTimeout(300);
  const magnet=await button.evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  assert.ok(magnet>3,'Buttons react magnetically to the pointer.');
  await page.mouse.move(700,650);
  await page.mouse.wheel(0,500);await page.waitForTimeout(80);
  const early=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(350);const middle=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(1300);const settled=await page.evaluate(()=>scrollY);
  assert.ok(early>0&&middle>early&&settled>=middle,'Lenis continues gliding after the wheel event.');
  assert.ok(settled>400&&settled<500,'Lenis wheel multiplier produces the expected final distance.');
  const progress=await page.locator('.scroll-progress').evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m11);
  assert.ok(progress>0&&progress<1,'Reading progress responds to scrolling.');
  await page.locator('#pricing').scrollIntoViewIfNeeded();await page.waitForTimeout(1400);
  for(const id of ['resumes','food','websites']){
    await page.locator(`[data-service-tab="${id}"]`).click();await page.waitForTimeout(700);
    const opacities=await page.locator(`#pricing-${id} .package`).evaluateAll(cards=>cards.map(el=>Number(getComputedStyle(el).opacity)));
    assert.ok(opacities.every(n=>n===1),'Every pricing category stays visible after switching.');
  }
  fs.mkdirSync('.shots/immersive',{recursive:true});
  await page.screenshot({path:'.shots/immersive/pricing.png'});
  await page.locator('.back-top').click();await page.waitForTimeout(1700);
  assert.ok(await page.evaluate(()=>scrollY)<2,'Back to top uses the same smooth-scroll engine.');
  assert.equal(await page.locator('[data-motion-toggle]').count(),0,'The motion switch has been removed.');
  assert.equal(await page.locator('html').getAttribute('data-motion'),'full');
  assert.deepEqual(errors,[]);
  fs.writeFileSync('.shots/immersive/results.json',JSON.stringify({passed:true,lenis:{early,middle,settled},magnet,progress,errors},null,2));
  console.log('PASS Lenis inertia, animated words, magnetic buttons, reading progress, pricing tabs and motion cleanup.');
}finally{await browser.close();}
