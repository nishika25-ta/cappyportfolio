import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
type Listen=(el:EventTarget,type:string,handler:EventListener)=>void;

/** Decorative reactions live on separate layers from layout and cursor position. */
export function createExpressiveMotion(listen:Listen){
  const layer=document.createElement('div');
  layer.className='celebration-layer';layer.setAttribute('aria-hidden','true');
  document.body.append(layer);
  let burstX=0,burstY=0;
  let particles:HTMLElement[]=[];
  let burst:gsap.core.Timeline|undefined;
  const ctx=gsap.context(()=>{
    const wind=gsap.quickTo(document.documentElement,'--scroll-wind',{duration:.5,ease:'power3.out'});
    const settle=gsap.delayedCall(.13,()=>wind(0)).pause();
    ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{
      wind(gsap.utils.clamp(-5,5,self.getVelocity()/450));settle.restart(true);
    }});
    particles=Array.from({length:6},(_,i)=>{
      const particle=document.createElement('span');
      particle.className='celebration-particle';particle.textContent=['✦','♡','✧'][i%3];
      particle.style.color=['#252820','#f2b6cb','#f8e5a7'][i%3];
      layer.append(particle);return particle;
    });
    gsap.set(particles,{autoAlpha:0,scale:.2});
    burst=gsap.timeline({paused:true})
      .to(particles,{x:i=>burstX+Math.cos(i*Math.PI*2/particles.length)*(48+i%3*15),y:i=>burstY+Math.sin(i*Math.PI*2/particles.length)*(48+i%3*15)-20,scale:i=>.7+i%3*.2,autoAlpha:1,duration:.42,stagger:.018,ease:'power3.out'},0)
      .to(particles,{autoAlpha:0,scale:0,duration:.4,stagger:.018,ease:'power2.in'},.35);
    document.querySelectorAll<HTMLElement>('.package').forEach(card=>{
      const price=card.querySelector('.package-price');
      if(!price)return;
      const lift=gsap.quickTo(price,'y',{duration:.26,ease:'power2.out',overwrite:true});
      listen(card,'pointerenter',()=>lift(-8));
      listen(card,'pointerleave',()=>lift(0));
    });
    return ()=>layer.remove();
  });
  listen(document,'pointerdown',raw=>{
    const e=raw as PointerEvent;
    if(e.button!==0||!(e.target instanceof Element)||!e.target.closest('button,.button,.nav-link,.hero-orbit,.hero-cat'))return;
    if(!burst||!particles.length)return;
    burstX=e.clientX;burstY=e.clientY;
    gsap.set(particles,{x:burstX,y:burstY,xPercent:-50,yPercent:-50,rotation:0,scale:.2,autoAlpha:0});
    burst.invalidate().restart();
  });
  return {destroy(){ctx.revert();layer.remove();}};
}
