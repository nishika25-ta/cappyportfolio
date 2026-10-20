import gsap from 'gsap';
type Listen=(el:EventTarget,type:string,handler:EventListener)=>void;

export function createCursorScene(listen:Listen){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  document.querySelectorAll<HTMLElement>('.button,.pet-button,.motion-toggle').forEach(button=>{
    const x=gsap.quickTo(button,'x',{duration:.55,ease:'power3.out'});
    const y=gsap.quickTo(button,'y',{duration:.55,ease:'power3.out'});
    listen(button,'pointermove',(raw)=>{const e=raw as PointerEvent;const r=button.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.12);y((e.clientY-r.top-r.height/2)*.18);});
    listen(button,'pointerleave',()=>{x(0);y(0);});
  });
  const hero=document.querySelector<HTMLElement>('.hero');
  if(hero){
    const rigs=[...hero.querySelectorAll<HTMLElement>('.cursor-rig')].map(el=>{
      gsap.set(el,{transformPerspective:900,transformOrigin:'50% 70%'});
      return {el,depth:Number(el.dataset.cursorDepth),x:gsap.quickTo(el,'x',{duration:.8,ease:'power3.out'}),y:gsap.quickTo(el,'y',{duration:.8,ease:'power3.out'}),rotate:gsap.quickTo(el,'rotation',{duration:.8,ease:'power3.out'}),tilt:gsap.quickTo(el,'rotationY',{duration:.8,ease:'power3.out'})};
    });
    const title=hero.querySelector('h1');
    gsap.set(title,{transformPerspective:1100,transformOrigin:'50% 50%'});
    const titleX=gsap.quickTo(title,'rotationX',{duration:.9,ease:'power3.out'});
    const titleY=gsap.quickTo(title,'rotationY',{duration:.9,ease:'power3.out'});
    listen(hero,'pointermove',(raw)=>{
      const e=raw as PointerEvent;const r=hero.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;
      rigs.forEach(rig=>{rig.x(x*85*rig.depth);rig.y(y*40);rig.rotate(x*15*rig.depth);rig.tilt(x*24);});
      titleX(-y*9);titleY(x*13);
    });
    listen(hero,'pointerleave',()=>{rigs.forEach(r=>{r.x(0);r.y(0);r.rotate(0);r.tilt(0);});titleX(0);titleY(0);});
  }
  document.querySelectorAll<HTMLElement>('.service-cat,.artwork-card').forEach(card=>{
    const art=card.querySelector<HTMLElement>('.service-cursor-rig,.artwork-image');if(!art)return;
    gsap.set(art,{transformPerspective:800,transformOrigin:'50% 60%'});
    const x=gsap.quickTo(art,'rotationY',{duration:.55,ease:'power3.out'});
    const y=gsap.quickTo(art,'rotationX',{duration:.55,ease:'power3.out'});
    const z=gsap.quickTo(art,'rotation',{duration:.55,ease:'power3.out'});
    listen(card,'pointermove',(raw)=>{const e=raw as PointerEvent;const r=card.getBoundingClientRect();x(((e.clientX-r.left)/r.width-.5)*24);y(-((e.clientY-r.top)/r.height-.5)*20);z(((e.clientX-r.left)/r.width-.5)*8);});
    listen(card,'pointerleave',()=>{x(0);y(0);z(0);});
  });
  const cursor=document.querySelector<HTMLElement>('#cursor-buddy');
  if(cursor){
    gsap.set(cursor,{autoAlpha:0,x:-100,y:-100,xPercent:-50,yPercent:-50});
    const x=gsap.quickSetter(cursor,'x','px');
    const y=gsap.quickSetter(cursor,'y','px');
    const spin=gsap.quickTo(cursor,'rotation',{duration:.5,ease:'power3.out'});
    let lastX=0;
    listen(document,'pointermove',(raw)=>{const e=raw as PointerEvent;x(e.clientX);y(e.clientY);spin(gsap.utils.clamp(-25,25,(e.clientX-lastX)*.3));lastX=e.clientX;gsap.set(cursor,{autoAlpha:1});});
    listen(document,'pointerout',(raw)=>{if(!(raw as PointerEvent).relatedTarget)gsap.set(cursor,{autoAlpha:0});});
    listen(document,'pointerover',(raw)=>{const target=(raw.target as Element).closest('button,a,input');cursor.classList.toggle('is-interactive',!!target);});
  }
}
