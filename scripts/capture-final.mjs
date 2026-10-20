import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();
const out='.shots/final';fs.mkdirSync(out,{recursive:true});
const evidence=[];
try{
  for(const [prefix,width,height] of [['desktop',1440,900],['mobile',390,844]]){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const [name,path,sections] of [['home','/',['.hero','#services','#work','#pricing','.about-section','.process-section','.faq-section','.site-footer']],['about','/about/',['.about-page-hero','.about-story','.site-footer']],['404','/does-not-exist',['.not-found']]]){
      const response=await page.goto('http://127.0.0.1:4400'+path,{waitUntil:'networkidle'});
      await page.waitForTimeout(350);
      for(const [i,selector] of sections.entries()){
        await page.locator(selector).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-18,behavior:'instant'}));
        await page.waitForTimeout(250);
        await page.screenshot({path:`${out}/${prefix}-${name}-${i+1}.png`});
      }
      const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelector('h1')?.textContent,title:document.title}));
      evidence.push({viewport:prefix,page:name,status:response.status(),...layout,errors});
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:4400/',{waitUntil:'networkidle'});
    await page.screenshot({path:`${out}/${prefix}-reduced.png`});
    await page.close();
  }
  fs.writeFileSync(`${out}/summary.json`,JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence,null,2));
}finally{await browser.close();}
