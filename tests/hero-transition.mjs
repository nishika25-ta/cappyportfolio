import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {launch} from '../skills/awwwards/scripts/browser.mjs';

// Exercise the production choreography with native scrolling, independently of Lenis.
const browser=await launch();
fs.mkdirSync('.shots',{recursive:true});
try{
  for(const [width,height] of [[844,390],[320,740],[390,844],[768,900],[1440,900]]){
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',async route=>{
      const relative=decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\/+/, '');
      if(relative.endsWith('.mp4'))return route.abort();
      let file=path.resolve(relative.startsWith('src/')?relative:path.join('dist',relative||'index.html'));
      if(!path.extname(file)&&fs.existsSync(file+'.ts'))file+='.ts';
      if(!fs.existsSync(file)||fs.statSync(file).isDirectory())return route.abort();
      const ext=path.extname(file);
      if(ext==='.html')return route.fulfill({body:fs.readFileSync(file,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''),contentType:'text/html'});
      if(ext==='.ts')return route.fulfill({body:ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,contentType:'application/javascript'});
      if(relative.endsWith('.js')&&!relative.startsWith('src/'))return route.abort();
      const types={'.css':'text/css','.mjs':'application/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
      return route.fulfill({path:file,contentType:types[ext]||'application/octet-stream'});
    });
    await page.goto('http://preview.local/',{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>document.fonts.ready);
    for(const library of ['gsap','ScrollTrigger','SplitText'])await page.addScriptTag({path:`node_modules/gsap/dist/${library}.js`});
    const wrapper=name=>'data:text/javascript,'+encodeURIComponent(`export default window.${name};export const ${name}=window.${name};`);
    await page.addScriptTag({type:'importmap',content:JSON.stringify({imports:{gsap:wrapper('gsap'),'gsap/ScrollTrigger':wrapper('ScrollTrigger'),'gsap/SplitText':wrapper('SplitText')}})});
    await page.evaluate(async()=>{
      window.gsap.registerPlugin(window.ScrollTrigger);
      const {createChoreography}=await import('/src/scripts/choreography.ts');
      createChoreography((element,type,handler)=>element.addEventListener(type,handler));
      window.ScrollTrigger.refresh();
    });
    await page.waitForTimeout(1400);
    const settings=await page.evaluate(()=>{
      const trigger=window.ScrollTrigger.getAll().find(t=>t.trigger?.classList.contains('hero')&&typeof t.vars.scrub==='number');
      return {start:trigger.start,end:trigger.end,pinned:!!trigger.pin,heroHeight:trigger.trigger.clientHeight,scrub:trigger.vars.scrub};
    });
    if(width<=800)assert.ok(settings.start>=settings.heroHeight-height-2,'The phone cast remains visible until the bottom of the hero reaches the viewport.');
    assert.ok(settings.end-settings.start>=height,'The handoff retains enough distance for a smooth entrance.');
    assert.ok(settings.end-settings.start<=height*1.5,'The pinned scene releases within one and a half screenfuls.');
    if(height<=650){
      assert.equal(settings.pinned,false,'Short landscape screens scroll naturally without trapping content below the viewport.');
      assert.deepEqual(errors,[]);
      console.log(`PASS ${width}×${height}: natural scrolling on short landscape screens.`);
      await page.close();
      continue;
    }
    assert.ok(settings.pinned,'The scene remains on screen throughout the handoff.');
    for(const progress of [0,.25,.55,1,.25,0]){
      await page.evaluate(y=>window.scrollTo(0,y),settings.start+(settings.end-settings.start)*progress);
      await page.waitForTimeout(1500);
      const state=await page.evaluate(()=>({
        opacity:Number(getComputedStyle(document.querySelector('.hero-orbit')).opacity),
        cast:Number(getComputedStyle(document.querySelector('.hero-cast')).opacity),
        overflow:document.documentElement.scrollWidth>innerWidth,
      }));
      assert.equal(state.overflow,false);
      if(progress===0){assert.ok(state.opacity<.05);assert.ok(state.cast>.95);}
      if(progress===.25)assert.ok(state.opacity>.05&&state.opacity<.95,'The universe crossfades gradually through the handoff.');
      if(progress===1){
        assert.ok(state.opacity>.95);
        const tickets=await page.locator('.orbit-item').evaluateAll(items=>items.map(item=>{
          const bounds=item.getBoundingClientRect();
          return {left:bounds.left,right:bounds.right,top:bounds.top,bottom:bounds.bottom};
        }));
        for(const ticket of tickets){
          assert.ok(ticket.left>8&&ticket.right<width-8,'Service stickers stay inside the screen.');
          assert.ok(ticket.top>90&&ticket.bottom<height-25,'Service stickers clear the navigation and footer.');
        }
        await page.screenshot({path:`.shots/cat-playground-${width}.png`});
      }
      if(progress===.55)await page.screenshot({path:`.shots/hero-handoff-${width}.png`});
    }
    assert.deepEqual(errors,[]);
    console.log(`PASS ${width}×${height}: delayed start, shorter pinned handoff, forward/reverse scrolling, no overflow or browser errors.`);
    await page.close();
  }
}finally{await browser.close();}
