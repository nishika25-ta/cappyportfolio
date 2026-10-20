import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const out='.shots/motion';fs.mkdirSync(out,{recursive:true});
const browser=await launch();
try{
  for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    await page.goto('http://127.0.0.1:4400/',{waitUntil:'networkidle'});await page.waitForTimeout(1800);
    await page.screenshot({path:`${out}/${name}-hero-1.png`});await page.waitForTimeout(650);await page.screenshot({path:`${out}/${name}-hero-2.png`});
    for(const [selector,file] of [['#services','services'],['#playground','playground'],['#work','work'],['.site-footer','footer']]){
      await page.locator(selector).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-12,behavior:'instant'}));
      await page.waitForTimeout(1500);
      await page.screenshot({path:`${out}/${name}-${file}.png`});
    }
    await page.close();
  }
  console.log('Captured paired animation frames and desktop/mobile scenes in .shots/motion.');
}finally{await browser.close();}
