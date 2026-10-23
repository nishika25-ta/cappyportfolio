import gsap from 'gsap';

type Listen=(element:EventTarget,type:string,handler:EventListener)=>void;
type SceneLoop=(selector:string,animation:gsap.core.Animation)=>void;

/** A single reusable reaction, on separate layers from entrance and cursor motion. */
export function createHeroStage(listen:Listen,sceneLoop:SceneLoop){
  const button=document.querySelector<HTMLButtonElement>('[data-hero-magic]');
  if(!button)return;
  sceneLoop('.hero',gsap.to('.hero-magic-ring',{rotation:360,duration:24,repeat:-1,ease:'none',svgOrigin:'65 65'}));
  sceneLoop('.hero',gsap.to('.hero-magic-star',{scale:.88,rotation:12,duration:1.8,repeat:-1,yoyo:true,ease:'sine.inOut',svgOrigin:'65 65'}));
  const left=document.querySelector('.hero-cat-left .hero-wiggle');
  const right=document.querySelector('.hero-cat-right .hero-wiggle');
  const reaction=gsap.timeline({paused:true})
    .to(left,{y:-35,rotation:-8,scaleX:1.04,scaleY:.96,duration:.23,ease:'power2.out'},0)
    .to(right,{y:-28,rotation:9,scaleX:1.04,scaleY:.96,duration:.23,ease:'power2.out'},.08)
    .to([left,right],{y:0,rotation:0,scaleX:1,scaleY:1,duration:.85,ease:'elastic.out(1,.5)'},.32);
  const lines=['Purr-sonality: maximum.','Good vibes, freshly made.','The creative department approves.','A little joy goes a long way.'];
  let presses=0;
  listen(button,'click',()=>{
    const status=document.querySelector('#hero-magic-status');
    if(status)status.textContent=lines[presses++%lines.length];
    reaction.restart();
  });
}
