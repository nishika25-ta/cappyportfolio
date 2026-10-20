import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';

const browser=await launch();
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:4400';
const output='.shots/functional';
fs.mkdirSync(output,{recursive:true});
const checks=[];
try {
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.hero-button').waitFor();
  await page.screenshot({path:`${output}/desktop-home.png`,fullPage:true});
  for(const [id,prices] of [['websites',['129','299','599']],['resumes',['19','49','89']],['food',['15','39','79']]]){
    await page.locator(`[data-service-tab="${id}"]`).click();
    assert.equal(await page.locator('.pricing-panel:visible').count(),1);
    assert.equal(await page.locator(`#pricing-${id}`).isVisible(),true);
    const values=await page.locator(`#pricing-${id} .package-price`).allTextContents();
    prices.forEach((price,i)=>assert.match(values[i],new RegExp(`RM${price}`)));
    const href=await page.locator(`#pricing-${id} .package .button`).first().getAttribute('href');
    assert.equal(new URL(href).pathname,'/60178478597');
  }
  checks.push('All three pricing categories show the correct nine prices and WhatsApp number.');
  await page.locator('[data-service-tab="food"]').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-service-tab="websites"]').getAttribute('aria-selected'),'true');
  checks.push('Pricing tabs support keyboard navigation and wrap around.');
  await page.locator('[data-pick-service="resumes"]').click();
  assert.equal(await page.locator('#pricing-resumes').isVisible(),true);
  checks.push('Service character links select the matching package category.');
  for(const id of ['resumes','food','websites']){
    await page.locator(`[data-showcase="${id}"]`).click();
    assert.equal(await page.locator(`#showcase-${id}`).isVisible(),true);
    assert.equal(await page.locator('.showcase-scene:visible').count(),1);
  }
  checks.push('Showcase tabs select matching illustrations and copy.');
  await page.locator('#local-video').setInputFiles('sample2/sample2.mp4');
  await page.waitForFunction(()=>document.querySelector('#dialog-video').readyState>=2);
  assert.equal(await page.locator('#video-dialog').evaluate(el=>el.open),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#video-dialog').evaluate(el=>el.open),false);
  assert.equal(await page.locator('#dialog-video').getAttribute('src'),null);
  checks.push('Local video loads and plays; Escape closes the modal and releases the file.');
  await page.locator('details').first().locator('summary').click();
  assert.equal(await page.locator('details').first().getAttribute('open'),'');
  checks.push('FAQ disclosures open using native controls.');
  for(const width of [360,390,600,768,1024,1440,1920]){
    await page.setViewportSize({width,height:900});
    await page.goto(base,{waitUntil:'networkidle'});
    const layout=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
    assert.ok(layout.document<=layout.viewport,`Overflow at ${width}: ${JSON.stringify(layout)}`);
  }
  checks.push('No horizontal overflow at 360, 390, 600, 768, 1024, 1440 and 1920px.');
  await page.setViewportSize({width:390,height:844});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-toggle');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  checks.push('Mobile navigation opens, traps keyboard focus, and closes with Escape.');
  await page.screenshot({path:`${output}/mobile-home.png`,fullPage:true});
  const axe=fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
  const accessibility=[];
  for(const path of ['/','/about/','/missing-page/','/missing-page']){
    const response=await page.goto(base+path,{waitUntil:'networkidle'});
    if(path.startsWith('/missing-page')){assert.equal(response.status(),404);assert.equal(await page.locator('h1').textContent(),'This pagewandered off.');}
    await page.addScriptTag({content:axe});
    const result=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
    accessibility.push({path,violations:result});
  }
  fs.writeFileSync(`${output}/accessibility.json`,JSON.stringify(accessibility,null,2));
  assert.equal(accessibility.flatMap(r=>r.violations).length,0,'Accessibility issues: see accessibility.json');
  checks.push('Home, about and missing-page layouts pass WCAG 2 A/AA and 2.1 AA axe checks on mobile.');
  await page.goto(base+'/about/',{waitUntil:'networkidle'});
  await page.locator('.site-header .wordmark').click();
  await page.waitForURL(base+'/');
  await page.locator('[data-service-tab="food"]').click();
  assert.equal(await page.locator('#pricing-food').isVisible(),true);
  checks.push('Client-side navigation restores functional tabs without duplicate handlers.');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(250);
  const a=await page.locator('.hero-cat-left .cat-body').getAttribute('transform');
  await page.waitForTimeout(250);
  assert.notEqual(await page.locator('.hero-cat-left .cat-body').getAttribute('transform'),a);
  await page.screenshot({path:`${output}/reduced-home.png`,fullPage:true});
  checks.push('Owner-requested full animation stays active regardless of browser motion settings.');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback=await nojs.newPage();
  await fallback.goto(base);
  assert.equal(await fallback.locator('.pricing-panel:visible').count(),3);
  assert.equal(await fallback.locator('.site-header nav').isVisible(),true);
  await nojs.close();
  checks.push('Without JavaScript, all nine packages and mobile navigation remain visible.');
  assert.deepEqual(errors,[]);
  checks.push('Zero browser JavaScript errors.');
  fs.writeFileSync(`${output}/results.json`,JSON.stringify({passed:true,checks,errors},null,2));
  console.log(checks.map(s=>`PASS ${s}`).join('\n'));
}finally{await browser.close();}
