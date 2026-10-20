import fs from 'node:fs';
import assert from 'node:assert/strict';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();fs.mkdirSync('.shots/header',{recursive:true});
try{
  for(const width of [1440,1024,900,390,320]){
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.goto('http://localhost:4400/',{waitUntil:'networkidle'});
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('.site-header').screenshot({path:`.shots/header/${width}.png`});
    if(width<=1000){await page.locator('.menu-toggle').click();await page.waitForTimeout(500);assert.equal(await page.locator('#main-nav').isVisible(),true);await page.screenshot({path:`.shots/header/${width}-menu.png`});await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
    await page.close();
  }
  const fallback=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await fallback.goto('http://localhost:4400/',{waitUntil:'networkidle'});
  assert.equal(await fallback.locator('#main-nav').isVisible(),true);
  assert.equal(await fallback.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log('PASS five header widths, matching mobile menus, Escape dismissal and no-JS fallback without overflow.');
}finally{await browser.close();}
