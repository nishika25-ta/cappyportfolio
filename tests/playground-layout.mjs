import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';

const browser=await launch();
const out='.shots/playground-fix';
fs.mkdirSync(out,{recursive:true});
const results=[];
try {
  for(const [width,height] of [[320,640],[1440,900],[843,537],[674,430],[584,811],[390,844]]){
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://localhost:4400/',{waitUntil:'networkidle'});
    await page.evaluate(()=>window.scrollTo(0,document.querySelector('#playground').getBoundingClientRect().top+scrollY));
    await page.waitForTimeout(1000);
    const slider=page.locator('#creative-energy');
    for(const key of ['Home','End']){
      await slider.press(key);
      // Sample the moving scene, including the high-energy bounce.
      for(let i=0;i<6;i++){
        await page.waitForTimeout(150);
        const boxes=await page.evaluate(()=>{
          const rect=s=>document.querySelector(s).getBoundingClientRect().toJSON();
          const cat=document.querySelector('.playground-character:not([hidden]) > .cat');
          const matrix=new DOMMatrixReadOnly(getComputedStyle(cat).transform);
          return {pet:rect('[data-pet-cat]'),energy:rect('.energy-control'),head:rect('.playground-character:not([hidden]) .cat-head'),prop:rect('.playground-character:not([hidden]) .cat-prop'),section:rect('#playground'),ratio:Math.hypot(matrix.a,matrix.b)/Math.hypot(matrix.c,matrix.d),overflow:document.documentElement.scrollWidth>innerWidth};
        });
        assert.ok(boxes.head.top>boxes.section.top,'Cat head stays inside the scene.');
        const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
        assert.equal(overlaps(boxes.prop,boxes.pet),false,`Animated artwork stays clear of the pet button at ${width}px.`);
        assert.ok(boxes.pet.bottom+10<boxes.energy.top,'Pet button stays clear of the energy control.');
        assert.ok(boxes.pet.left>=0&&boxes.pet.right<=width,'Pet button stays in the viewport.');
        if(key==='Home')assert.ok(boxes.ratio<1.1,'Low energy must preserve the character proportions.');
        if(boxes.overflow)console.log('Overflow diagnostics',width,await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,elements:[...document.body.querySelectorAll('*')].filter(el=>{const b=el.getBoundingClientRect();if(b.right<=innerWidth)return false;for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){if(['clip','hidden','scroll','auto'].includes(getComputedStyle(p).overflowX))return false;}return true;}).slice(0,20).map(el=>({tag:el.tagName,class:el.getAttribute('class'),right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width}))})));
        assert.equal(boxes.overflow,false,`No horizontal page overflow at ${width}px.`);
      }
    }
    await slider.press('Home');await page.waitForTimeout(750);
    assert.equal(await page.locator('.energy-labels label').textContent(),'Creative energy');
    assert.equal(await page.locator('#energy-state').textContent(),'Quietly clever');
    await page.locator('[data-pet-cat]').click();
    assert.match(await page.locator('#playground-status').textContent(),/prrrr/i);
    await page.mouse.move(0,0);
    await page.evaluate(()=>window.scrollTo(0,document.querySelector('#playground').getBoundingClientRect().top+scrollY));
    await page.waitForTimeout(600);
    await page.screenshot({path:`${out}/${width}x${height}.png`});
    const sectionHeight=await page.locator('#playground').evaluate(el=>el.getBoundingClientRect().height);
    assert.deepEqual(errors,[]);
    results.push({width,height,sectionHeight,passed:true});
    await page.close();
  }
  fs.writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
  console.log('PASS playground artwork/control separation, character proportions, keyboard slider, petting and overflow at six viewport sizes.');
}finally{await browser.close();}
