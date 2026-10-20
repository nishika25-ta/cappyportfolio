import {launch} from '../skills/awwwards/scripts/browser.mjs';
const browser=await launch();
try{
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4400/',{waitUntil:'networkidle'});
  await page.addStyleTag({content:'.site-header{height:70px}.hero{min-height:560px;padding-top:16px}.hero-type{margin-top:24px}.hero h1{font-size:86px}.hero-copy{font-size:13px;max-width:420px;margin-top:34px}.hero-button{min-height:47px;font-size:12px}.hero-cat{width:255px;bottom:22px}.hero-cat-left{left:1%}.hero-cat-right{right:1%}.hero-bottom{display:none}.cat-note{font-size:12px}.miri-stamp{width:82px;height:82px;right:3%;top:20px}.miri-stamp>span{font-size:9px}.miri-stamp small{font-size:5px}.hero-spark{width:30px;top:60px;left:5%}'});
  await page.screenshot({path:'public/og.png'});
  console.log('Generated public/og.png at 1200 × 630.');
}finally{await browser.close();}
