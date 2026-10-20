import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
type Listen=(el:EventTarget,type:string,handler:EventListener)=>void;

/** Decorative reactions live on separate layers from layout and cursor position. */
export function createExpressiveMotion(listen:Listen){
  const layer=document.createElement('div');
  layer.className='celebration-layer';layer.setAttribute('aria-hidden','true');
  document.body.append(layer);
  const ctx=gsap.context(()=>{
    const wind=gsap.quickTo(document.documentElement,'--scroll-wind',{duration:.5,ease:'power3.out'});
    const settle=gsap.delayedCall(.13,()=>wind(0)).pause();
    ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{
      wind(gsap.utils.clamp(-5,5,self.getVelocity()/450));settle.restart(true);
    }});
    document.querySelectorAll<HTMLElement>('.package').forEach(card=>{
      const price=card.querySelector('.package-price');
      listen(card,'pointerenter',()=>ctx.add(()=>{
        gsap.fromTo(price,{y:0},{y:-8,duration:.3,repeat:1,yoyo:true,ease:'power2.out',overwrite:true});
      }));
    });
    return ()=>layer.remove();
  });
  listen(document,'pointerdown',raw=>{
    const e=raw as PointerEvent;
    if(e.button!==0||!(e.target instanceof Element)||!e.target.closest('button,.button,.nav-link,.hero-orbit,.hero-cat'))return;
    ctx.add(()=>{
      const particles=Array.from({length:9},(_,i)=>{
        const particle=document.createElement('span');
        particle.className='celebration-particle';particle.textContent=['✦','♡','✧'][i%3];
        particle.style.color=['#252820','#f2b6cb','#f8e5a7'][i%3];
        layer.append(particle);return particle;
      });
      gsap.set(particles,{x:e.clientX,y:e.clientY,xPercent:-50,yPercent:-50,scale:.2,opacity:1});
      gsap.to(particles,{x:i=>e.clientX+Math.cos(i*Math.PI*2/9)*(48+i%3*15),y:i=>e.clientY+Math.sin(i*Math.PI*2/9)*(48+i%3*15)-20,scale:i=>.7+i%3*.2,rotation:i=>(i%2?-1:1)*100,duration:.75,stagger:.018,ease:'power3.out'});
      gsap.to(particles,{opacity:0,scale:0,delay:.4,duration:.4,onComplete:()=>particles.forEach(p=>p.remove())});
    });
  });
  return {destroy(){ctx.revert();layer.remove();}};
}
