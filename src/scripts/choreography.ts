import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {motionEnabled} from './motion-preference';
import {createCursorScene} from './cursor-scene';
import {createExpressiveMotion} from './expressive-motion';
import {getEnergyState} from './energy-state.mjs';
import {createGeometryCache} from './motion-performance.mjs';

type Listen=(el:EventTarget,type:string,handler:EventListener)=>void;
gsap.registerPlugin(SplitText);

/** All illustration, scroll and interaction motion shares GSAP's ticker. */
export function createChoreography(listen:Listen) {
  const reduced=!motionEnabled();
  const actors=new Map<Element,{timeline:gsap.core.Timeline;visible:boolean}>();
  const loops:gsap.core.Animation[]=[];
  const textSplits:SplitText[]=[];
  const loopScenes=new Map<Element,gsap.core.Animation[]>();
  let energy=55;
  let character='websites';
  let petting:gsap.core.Timeline|undefined;
  let energyTarget:Element|null=null;
  let energyPose:{y:(value:number)=>void;scaleX:(value:number)=>void;scaleY:(value:number)=>void;rotation:(value:number)=>void}|undefined;
  const energyCast=document.querySelector<HTMLElement>('.playground-cast');
  const geometry=createGeometryCache();
  listen(window,'scroll',geometry.invalidate);
  listen(window,'resize',geometry.invalidate);
  ScrollTrigger.addEventListener('refresh',geometry.invalidate);
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      const actor=actors.get(entry.target);
      if(actor){actor.visible=entry.isIntersecting;actor.timeline.paused(!entry.isIntersecting||document.hidden);entry.target.classList.toggle('is-in-view',entry.isIntersecting&&!document.hidden);}
      loopScenes.get(entry.target)?.forEach(loop=>loop.paused(!entry.isIntersecting||document.hidden));
    }
  },{rootMargin:'80px'});
  function sceneLoop(selector:string,loop:gsap.core.Animation){
    const scene=document.querySelector(selector);if(!scene)return;
    loops.push(loop);loop.pause();
    loopScenes.set(scene,[...(loopScenes.get(scene)??[]),loop]);observer.observe(scene);
  }

  const ctx=gsap.context(()=>{
    if(reduced)return;
    const entrance=(selector:string,vars:gsap.TweenVars)=>{if(document.querySelector(selector))gsap.from(selector,vars);};
    createCursorScene(listen,geometry.read);
    createExpressiveMotion(listen);
    gsap.fromTo('.scroll-progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});
    document.querySelectorAll<HTMLElement>('main h2').forEach(heading=>{
      const accessibleName=heading.innerText.replace(/\s+/g,' ').trim();
      const split=new SplitText(heading,{type:'words',wordsClass:'motion-word',aria:'auto'});
      heading.setAttribute('aria-label',accessibleName);
      textSplits.push(split);
      gsap.from(split.words,{yPercent:65,rotation:5,autoAlpha:0,duration:.85,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 94%',toggleActions:'play none none reverse'}});
    });
    document.querySelectorAll<HTMLElement>('.artwork-image img,.about-postcard img').forEach((image,i)=>{
      gsap.fromTo(image,{yPercent:-5,scale:1.12},{yPercent:5,scale:1.12,ease:'none',scrollTrigger:{trigger:image.parentElement,start:'top bottom',end:'bottom top',scrub:.8+i*.1}});
    });
    document.querySelectorAll<HTMLElement>('.pricing-panel').forEach(panel=>{
      const reveal=gsap.timeline({paused:true}).from(panel.querySelectorAll('.package'),{y:70,rotation:3,scale:.94,autoAlpha:0,duration:.85,stagger:.13,ease:'power3.out',immediateRender:false,clearProps:'transform,opacity,visibility'});
      ScrollTrigger.create({trigger:'.pricing-tabs',start:'top 85%',once:true,onEnter:()=>{if(!panel.hidden)reveal.play();}});
    });
    document.querySelectorAll<HTMLElement>('.preview-stage>.cat').forEach((cat,i)=>{
      sceneLoop('.work-section',gsap.to(cat,{y:-12,rotation:i%2?-4:4,duration:2.2+i*.2,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    });
    // Articulated characters: breathing, head turns, tails, blinks and typing paws.
    document.querySelectorAll<SVGSVGElement>('.cat').forEach((cat,i)=>{
      const body=cat.querySelector('.cat-body');
      const head=cat.querySelector('.cat-head');
      const tail=cat.querySelector('.cat-tail');
      const eyes=cat.querySelector('.cat-eyes');
      const left=cat.querySelector('.cat-paw-left');
      const right=cat.querySelector('.cat-paw-right');
      const rig=gsap.timeline({repeat:-1,paused:true,defaults:{ease:'sine.inOut'}});
      const phase=i%3;
      rig.to(body,{y:-10-phase*2,scaleY:1.025,transformOrigin:'50% 100%',duration:.85,yoyo:true,repeat:3},0);
      if(tail)rig.fromTo(tail,{rotation:-9,svgOrigin:'245 296'},{rotation:16,svgOrigin:'245 296',duration:.65,yoyo:true,repeat:5},0);
      if(head)rig.fromTo(head,{rotation:-3,svgOrigin:'183 214'},{rotation:5,svgOrigin:'183 214',duration:1.3,yoyo:true,repeat:2},0);
      if(eyes)rig.to(eyes,{scaleY:.06,transformOrigin:'50% 50%',duration:.09,repeat:1,yoyo:true},1.1+phase*.3)
        .to(eyes,{scaleY:.06,transformOrigin:'50% 50%',duration:.1,repeat:1,yoyo:true},3.15);
      if(left&&right){rig.to(left,{y:-5,duration:.14,yoyo:true,repeat:15},.15).to(right,{y:-4,duration:.14,yoyo:true,repeat:15},.29);}
      rig.timeScale(.9+(i%3)*.1);
      actors.set(cat,{timeline:rig,visible:false});observer.observe(cat);
    });

    if(document.querySelector('.hero')){
    const intro=gsap.timeline({defaults:{ease:'power3.out'}});
    intro.from('.hero h1 > span',{yPercent:65,rotation:3,duration:1.05,stagger:.1},0)
      .from('.hero-copy,.hero-button',{y:35,duration:.75,stagger:.1},.35)
      .from('.hero-cat-left .cat-entry',{xPercent:-115,y:120,rotation:-30,duration:1.5,ease:'elastic.out(1,.7)'},.08)
      .from('.hero-cat-right .cat-entry',{xPercent:115,y:110,rotation:32,duration:1.5,ease:'elastic.out(1,.7)'},.22)
      .from('.satellite-entry',{yPercent:-130,rotation:0,scale:.7,duration:1.3,stagger:.15,ease:'back.out(1.6)'},.15)
      .from('.hero-float,.hero-spark,.miri-stamp',{scale:0,rotation:-50,duration:1,stagger:.08,ease:'elastic.out(1,.65)'},.55);

    document.querySelectorAll<HTMLElement>('.hero-float,.hero-spark').forEach((el,i)=>{
      const t=gsap.to(el,{y:i%2?20:-20,rotation:`+=${i%2?9:-9}`,duration:2.2+i*.3,repeat:-1,yoyo:true,ease:'sine.inOut'});
      loops.push(t);
      ScrollTrigger.create({trigger:'.hero',start:'top bottom',end:'bottom top',onToggle:s=>t.paused(!s.isActive)});
    });

    const heroHand=document.querySelector('.hero-hand');
    if(heroHand){
      const lift=()=>innerWidth<=600?-85:-110;
      gsap.set('.purr-heart',{autoAlpha:0,scale:.4});
      const hand=gsap.timeline({repeat:-1,repeatDelay:3.8,delay:1.8,paused:true});
      hand.fromTo(heroHand,{xPercent:135,y:()=>lift()+25,rotation:-35},{xPercent:0,y:lift,rotation:-49,duration:.95,ease:'power3.out'})
        .to(heroHand,{x:-22,y:()=>lift()+14,rotation:-54,duration:.5,repeat:3,yoyo:true,ease:'sine.inOut'})
        .to('.hero-cat-right .cat',{scaleX:1.045,scaleY:.96,duration:.4,repeat:3,yoyo:true,ease:'sine.inOut'},.95)
        .fromTo('.purr-heart',{autoAlpha:0,y:0,scale:.4},{autoAlpha:1,y:-70,scale:1.15,duration:1.2,ease:'power3.out'},1.2)
        .to('.purr-heart',{autoAlpha:0,y:-95,duration:.4},2.3)
        .to(heroHand,{xPercent:135,y:()=>lift()-25,rotation:-25,duration:.85,ease:'power3.in'},3.05);
      loops.push(hand);
      ScrollTrigger.create({trigger:'.hero',start:'top bottom',end:'bottom top',onToggle:s=>hand.paused(!s.isActive)});
    }

    const ground=document.querySelector('.hero-ground path');
    if(ground)sceneLoop('.hero',gsap.to(ground,{attr:{d:'M0 70C280 170 480 10 760 90S1200 145 1440 60V180H0Z'},duration:4.5,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    // A three-beat sticker carousel replaces the oversized character zoom.
    gsap.set('.hero-orbit',{autoAlpha:0});
    gsap.set('.orbit-center',{autoAlpha:0,y:45,scale:.85});
    gsap.set('.orbit-item',{autoAlpha:0,scale:.1,rotation:-70});
    gsap.set('.orbit-spark,.orbit-paws>span',{scale:0,autoAlpha:0});
    gsap.set('.hero-ticker',{autoAlpha:0,y:80,rotation:-3});
    const orbitX=()=>innerWidth<=600?innerWidth*.36:innerWidth<=800?innerWidth*.3:Math.min(innerWidth*.22,225);
    const orbitY=()=>innerWidth<=600?85:110;
    const compactHero=innerWidth<=800;
    gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:()=>`+=${innerHeight*(compactHero?.82:1.65)}`,pin:!compactHero&&innerHeight>650,scrub:.65,invalidateOnRefresh:true}})
      .to('.hero-type',{y:-95,rotation:-5,scale:.9,autoAlpha:0,duration:.3,ease:'power2.in'},0)
      .to('.hero-copy,.hero-button,.motion-hint,.hero-meta,.hero-bottom,.cat-note,.miri-stamp',{y:-35,autoAlpha:0,duration:.2,ease:'power2.in'},0)
      .to('.hero-cat-left',{y:-75,rotation:-15,scale:.8,duration:.2,ease:'power2.out'},0)
      .to('.hero-cat-right',{y:-95,rotation:18,scale:.8,duration:.2,ease:'power2.out'},0)
      .to('.hero-cat-left',{xPercent:-65,y:55,rotation:15,scale:.55,duration:.4,ease:'power2.inOut'},.2)
      .to('.hero-cat-right',{xPercent:65,y:55,rotation:-15,scale:.55,duration:.4,ease:'power2.inOut'},.2)
      .to('.hero-satellite',{y:-220,scale:.5,autoAlpha:0,duration:.3,ease:'power2.in'},0)
      .to('.hero-float,.hero-spark,.hero-hand',{autoAlpha:0,duration:.2},.05)
      .to('.hero-ground',{scaleY:7,transformOrigin:'50% 100%',duration:.9,ease:'none'},.15)
      .to('.hero-orbit',{autoAlpha:1,duration:.15},.2)
      .to('.orbit-center',{autoAlpha:1,y:0,scale:1,duration:.4,ease:'back.out(1.5)'},.25)
      .to('.orbit-web',{x:()=>-orbitX(),y:()=>-orbitY(),scale:1,rotation:-12,autoAlpha:1,duration:.5,ease:'back.out(1.6)'},.25)
      .to('.orbit-resume',{x:orbitX,y:()=>-orbitY(),scale:1,rotation:10,autoAlpha:1,duration:.5,ease:'back.out(1.6)'},.32)
      .to('.orbit-food',{x:0,y:()=>innerWidth<=600?125:250,scale:1,rotation:-5,autoAlpha:1,duration:.5,ease:'back.out(1.6)'},.39)
      .to('.orbit-spark',{scale:1,autoAlpha:1,rotation:90,duration:.45,stagger:.08,ease:'back.out(2)'},.5)
      .to('.orbit-carousel',{rotation:160,duration:.75,ease:'power1.inOut'},.85)
      .to('.orbit-sticker',{rotation:-160,duration:.75,ease:'power1.inOut'},.85)
      .to('.orbit-track',{rotation:-80,duration:1.15,ease:'none'},.45)
      .to('.orbit-paws>span',{scale:1,autoAlpha:.45,y:-15,duration:.2,stagger:.1,ease:'back.out(2)'},.85)
      .to('.hero-ticker',{autoAlpha:1,y:0,rotation:-3,duration:.25,ease:'power2.out'},1.1);
    sceneLoop('.hero',gsap.to('.hero-ticker-track',{xPercent:-50,duration:18,repeat:-1,ease:'none'}));
    sceneLoop('.hero',gsap.to('.orbit-sticker>.icon',{y:-4,rotation:8,duration:1.2,stagger:.15,yoyo:true,repeat:-1,ease:'sine.inOut'}));
    sceneLoop('.hero',gsap.to('.orbit-center em',{rotation:5,scale:1.035,duration:1.6,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    }

    if(document.querySelector('.service-cats'))gsap.from('.service-illustration',{y:140,scale:.45,rotation:-15,duration:1.3,stagger:.16,ease:'elastic.out(1,.65)',scrollTrigger:{trigger:'.service-cats',start:'top 88%',once:true}});
    document.querySelectorAll('.service-cat .cat').forEach((cat,i)=>sceneLoop('.service-cats',gsap.to(cat,{y:-12,rotation:i%2?-3:3,duration:1.2+i*.17,delay:i*.2,repeat:-1,yoyo:true,ease:'sine.inOut'})));
    const sky=document.querySelector('.playground-sky path');
    if(sky)sceneLoop('.playground-section',gsap.to(sky,{attr:{d:'M0 0H1440V155C1120 250 1060 40 740 145S280 80 0 160Z'},duration:5,repeat:-1,yoyo:true,ease:'sine.inOut'}));

    const playground=document.querySelector('.playground-section');
    if(playground){
      gsap.timeline({scrollTrigger:{trigger:playground,start:'top top',end:'+=65%',pin:matchMedia('(min-width:900px)').matches&&playground.getBoundingClientRect().height<=innerHeight,scrub:.6,invalidateOnRefresh:true}})
        .to('.playground-sky',{yPercent:-38,ease:'none'},0)
        .to('.playground-cast',{scale:1.04,y:-8,ease:'none'},0)
        .fromTo('.playground-doodles',{rotation:-5,scale:1.12},{rotation:5,scale:1.02,ease:'none'},0);
      document.querySelectorAll('.playground-doodles path').forEach((path,i)=>{
        const length=(path as SVGPathElement).getTotalLength();
        sceneLoop('.playground-section',gsap.fromTo(path,{strokeDasharray:`${length*.55} ${length*.45}`,strokeDashoffset:0},{strokeDashoffset:-length,duration:7+i,repeat:-1,ease:'none'}));
      });
      const handLift=()=>innerWidth>600&&innerHeight<=680?-65:-105;
      gsap.set('.playground-hand',{xPercent:130,rotation:-45,y:handLift});
      const hint=gsap.timeline({delay:1,repeat:-1,repeatDelay:5,paused:true})
        .to('.playground-hand',{xPercent:0,y:handLift,rotation:-53,duration:.85,ease:'power3.out'})
        .to('.playground-hand',{y:()=>handLift()+12,x:-16,rotation:-57,duration:.5,repeat:3,yoyo:true,ease:'sine.inOut'})
        .to('.playground-hand',{xPercent:130,y:handLift,duration:.75,ease:'power3.in'});
      loops.push(hint);
      ScrollTrigger.create({trigger:playground,start:'top 70%',end:'bottom top',onToggle:s=>hint.paused(!s.isActive)});
    }

    if(matchMedia('(hover:hover) and (pointer:fine)').matches){
      document.querySelectorAll<HTMLElement>('.hero,.services-section,.playground-section,.site-footer,.faq-section,.about-page-hero').forEach(scene=>{
        const pupils=scene.querySelectorAll('.pupil');
        const x=gsap.quickTo(pupils,'x',{duration:.35,ease:'power3.out'});
        const y=gsap.quickTo(pupils,'y',{duration:.35,ease:'power3.out'});
        listen(scene,'pointermove',(raw)=>{const e=raw as PointerEvent;const r=geometry.read(scene);x(((e.clientX-r.left)/r.width-.5)*13);y(((e.clientY-r.top)/r.height-.5)*9);});
        listen(scene,'pointerleave',()=>{x(0);y(0);});
      });
    }

    // The rest of the portfolio moves as connected, illustrated scenes.
    entrance('.showcase-player',{rotation:-5,scale:.88,y:70,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.showcase-player',start:'top 90%',once:true}});
    entrance('.artwork-card',{y:90,rotation:7,scale:.9,duration:1.1,stagger:.13,ease:'power3.out',scrollTrigger:{trigger:'.artwork-gallery',start:'top 90%',once:true}});
    entrance('.pricing-tabs',{scaleX:.8,y:30,duration:1,ease:'elastic.out(1,.8)',scrollTrigger:{trigger:'.pricing-tabs',start:'top 90%',once:true}});
    entrance('.about-art',{rotation:5,y:80,ease:'none',scrollTrigger:{trigger:'.about-section',start:'top bottom',end:'center center',scrub:.5}});
    entrance('.faq-cat',{x:80,rotation:20,duration:1.3,ease:'elastic.out(1,.7)',scrollTrigger:{trigger:'.faq-section',start:'top 80%',once:true}});
    entrance('.contact-cat',{y:145,rotation:-18,scale:.65,duration:1.5,ease:'elastic.out(1,.75)',scrollTrigger:{trigger:'.contact-main',start:'top 85%',once:true}});
    entrance('.contact-main h2',{y:80,rotation:4,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.contact-main',start:'top 85%',once:true}});
    entrance('.about-page-cat',{y:100,rotation:12,duration:1.4,ease:'elastic.out(1,.7)'});
  });

  function energySpeed(){return .3+energy/55;}
  function bindEnergyPose(){
    const target=document.querySelector(`[data-playground-character="${character}"] > .cat`);
    if(target===energyTarget)return;
    if(energyTarget)gsap.killTweensOf(energyTarget);
    energyTarget=target;
    energyPose=target?{
      y:gsap.quickTo(target,'y',{duration:.32,ease:'power3.out',overwrite:'auto'}),
      scaleX:gsap.quickTo(target,'scaleX',{duration:.32,ease:'power3.out',overwrite:'auto'}),
      scaleY:gsap.quickTo(target,'scaleY',{duration:.32,ease:'power3.out',overwrite:'auto'}),
      rotation:gsap.quickTo(target,'rotation',{duration:.32,ease:'power3.out',overwrite:'auto'})
    }:undefined;
  }
  function setEnergy(value:number){
    const state=getEnergyState(value);
    energy=state.energy;
    const cast=energyCast;
    if(cast){
      if(cast.dataset.energyMood!==state.mood)cast.dataset.energyMood=state.mood;
      cast.style.setProperty('--cat-jitter',`${1+state.level*3}deg`);
      cast.style.setProperty('--cat-bounce',`${2+state.level*5}px`);
      cast.style.setProperty('--cat-tempo',`${.5-state.level*.28}s`);
    }
    if(reduced)return;
    actors.forEach((actor,cat)=>{if(cat.closest('.playground-section'))actor.timeline.timeScale(energySpeed());});
    if(!energyPose)ctx.add(bindEnergyPose);
    const level=energy/100;
    energyPose?.y(8-level*25);
    energyPose?.scaleY(.96+level*.06);
    energyPose?.scaleX(1.025-level*.04);
    energyPose?.rotation((1-level)*-3);
  }
  function selectCharacter(id:string){
    character=id;
    if(reduced)return;
    ctx.add(()=>{
      const selected=document.querySelector(`[data-character="${id}"] .cat-body`);
      if(selected)gsap.fromTo(selected,{scaleX:1.16,scaleY:.8},{scaleX:1,scaleY:1,duration:.85,ease:'elastic.out(1,.5)',overwrite:'auto'});
      const stage=document.querySelector(`[data-playground-character="${id}"]`);
      if(stage)gsap.fromTo(stage,{y:65,scale:.7,rotation:-12},{y:0,scale:1,rotation:0,duration:.9,ease:'elastic.out(1,.6)',overwrite:true});
      bindEnergyPose();
    });
    setEnergy(energy);
  }
  function pet(){
    const status=document.getElementById('playground-status');
    if(status)status.textContent='Prrrr. Creative chemistry: confirmed.';
    if(reduced)return;
    ctx.add(()=>{
      petting?.kill();
      const target=document.querySelector(`[data-playground-character="${character}"] > .cat`);
      petting=gsap.timeline().to(target,{scaleX:1.13,scaleY:.88,rotation:-5,duration:.22,ease:'power3.out'})
        .to(target,{scaleX:1,scaleY:1,rotation:0,duration:.95,ease:'elastic.out(1,.45)'})
        .fromTo('.pet-hearts span',{y:0,autoAlpha:0,scale:.3},{y:(i)=>-100-i*30,x:(i)=>(i-1)*65,autoAlpha:1,scale:1.3,duration:.8,stagger:.1,ease:'power3.out'},0)
        .to('.pet-hearts span',{autoAlpha:0,duration:.4},.8);
    });
  }
  function swap(selector:string){if(reduced)return;ctx.add(()=>{gsap.fromTo(selector,{y:24},{y:0,duration:.5,stagger:.07,ease:'power3.out',clearProps:'transform',overwrite:true});});}
  listen(document,'visibilitychange',()=>{actors.forEach((actor,cat)=>{actor.timeline.paused(document.hidden||!actor.visible);cat.classList.toggle('is-in-view',!document.hidden&&actor.visible);});loopScenes.forEach((list,scene)=>{const r=scene.getBoundingClientRect();list.forEach(loop=>loop.paused(document.hidden||r.bottom<0||r.top>innerHeight));});});
  setEnergy(energy);
  return {setEnergy,selectCharacter,pet,swap,destroy(){observer.disconnect();ScrollTrigger.removeEventListener('refresh',geometry.invalidate);petting?.kill();if(energyTarget)gsap.killTweensOf(energyTarget);ctx.revert();textSplits.forEach(split=>split.revert());}};
}
