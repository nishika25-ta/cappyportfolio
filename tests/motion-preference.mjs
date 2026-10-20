import assert from 'node:assert/strict';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();
try{
  const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:584,height:811}});
  await page.addInitScript(()=>localStorage.setItem('cappy-motion','reduced'));
  await page.goto('http://localhost:4400/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-motion-toggle]').count(),0);
  assert.equal(await page.locator('html').getAttribute('data-motion'),'full');
  const tail=await page.locator('.hero-cat-left .cat-tail').getAttribute('transform');
  await page.waitForTimeout(400);
  assert.notEqual(await page.locator('.hero-cat-left .cat-tail').getAttribute('transform'),tail);
  await page.mouse.wheel(0,500);await page.waitForTimeout(80);
  const early=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(1400);
  assert.ok(await page.evaluate(()=>scrollY)>early+80);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-motion'),'full');
  console.log('PASS switch removed; animations and Lenis always active despite browser settings, old saved preferences and reload.');
}finally{await browser.close();}
