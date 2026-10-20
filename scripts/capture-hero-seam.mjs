import fs from 'node:fs';
import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();
try{
  const page=await browser.newPage({viewport:{width:1440,height:851}});
  await page.goto('http://localhost:4400/',{waitUntil:'networkidle'});
  await page.evaluate(()=>window.scrollTo(0,200));
  await page.waitForTimeout(1000);
  console.log(await page.evaluate(()=>{
    const hero=document.querySelector('.hero');const box=hero.getBoundingClientRect();
    const below=document.elementFromPoint(100,box.bottom+20);
    return {heroBottom:box.bottom,below:below?.className,background:below&&getComputedStyle(below).backgroundColor};
  }));
  fs.mkdirSync('.shots/hero-seam',{recursive:true});
  await page.screenshot({path:'.shots/hero-seam/preview.png'});
}finally{await browser.close();}

