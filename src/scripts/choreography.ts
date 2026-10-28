import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {motionEnabled} from './motion-preference';
import {createCursorScene} from './cursor-scene';
import {createExpressiveMotion} from './expressive-motion';
import {getEnergyState} from './energy-state.mjs';
import {createGeometryCache} from './motion-performance.mjs';
import {getCreativeOrbitLayout} from './creative-orbit.mjs';
import {isAllowedServiceId} from './security.mjs';

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
      if(actor){
        const isHidden=Boolean(entry.target.closest('[hidden]'));
        actor.visible=entry.isIntersecting&&!isHidden;
        actor.timeline.paused(!actor.visible||document.hidden);
        entry.target.classList.toggle('is-in-view',actor.visible&&!document.hidden);
      }
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
    const cinemaCat=document.querySelector<HTMLElement>('[data-studio-pet]');
    if(cinemaCat){
      listen(cinemaCat,'click',()=>{
        const greeting=cinemaCat.querySelector('[data-cinema-greeting]');
        if(greeting)greeting.textContent='Prrr. Enjoy the show!';
        ctx.add(()=>{gsap.fromTo(cinemaCat.querySelector('.cinema-cat-crop'),{y:0},{y:-9,duration:.25,repeat:1,yoyo:true,ease:'power2.out',overwrite:true});});
      });
    }
    gsap.fromTo('.scroll-progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
    document.querySelectorAll<HTMLElement>('main h2').forEach(heading=>{
      const accessibleName=heading.innerText.replace(/\s+/g,' ').trim();
      const split=new SplitText(heading,{type:'words',wordsClass:'motion-word',aria:'auto'});
      heading.setAttribute('aria-label',accessibleName);
      textSplits.push(split);
      gsap.from(split.words,{yPercent:65,rotation:5,autoAlpha:0,duration:.85,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 94%',toggleActions:'play none none reverse'}});
    });
    document.querySelectorAll<HTMLElement>('.artwork-image img,.about-postcard img').forEach(image=>{
      gsap.fromTo(image,{yPercent:-5,scale:1.12},{yPercent:5,scale:1.12,ease:'none',scrollTrigger:{trigger:image.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
    });
    document.querySelectorAll<HTMLElement>('.pricing-panel').forEach(panel=>{
      const reveal=gsap.timeline({paused:true}).from(panel.querySelectorAll('.package'),{y:70,rotation:3,scale:.94,autoAlpha:0,duration:.85,stagger:.13,ease:'power3.out',immediateRender:false,clearProps:'transform,opacity,visibility'});
      ScrollTrigger.create({trigger:'.pricing-tabs',start:'top 85%',once:true,onEnter:()=>{if(!panel.hidden)reveal.play();}});
    });
    document.querySelectorAll<HTMLElement>('.preview-stage>.cat').forEach((cat,i)=>{
      sceneLoop('.work-section',gsap.to(cat,{y:-12,rotation:i%2?-4:4,duration:2.2+i*.2,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    });
    // Articulated characters: breathing, head turns, tails, blinks and typing paws.
    document.querySelectorAll<SVGSVGElement>('main .cat:not(.planet-cat .cat):not(.hero-satellite .cat),.site-footer .cat').forEach((cat,i)=>{
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
    sceneLoop('.hero',gsap.to('.studio-orbits',{rotation:12,duration:24,repeat:-1,yoyo:true,ease:'sine.inOut',transformOrigin:'50% 50%'}));
    sceneLoop('.hero',gsap.to('.studio-orbit-stars',{opacity:.4,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    document.querySelectorAll<HTMLElement>('.cat-speech').forEach((pitch,speaker)=>{
      const messages=Array.from(pitch.querySelectorAll<HTMLElement>('[data-cat-pitch]'));
      if(messages.length<2)return;
      let active=0;
      const showPitch=(index:number)=>{
        active=index;
        messages.forEach((message,i)=>{message.dataset.active=String(i===index);message.setAttribute('aria-hidden',String(i!==index));});
      };
      const chatter=gsap.to({},{duration:speaker?7.5:6.5,repeat:-1,onRepeat:()=>showPitch((active+1)%messages.length)});
      sceneLoop('.hero',chatter);
      sceneLoop('.hero',gsap.to(pitch.querySelector('.cat-speech-body'),{y:speaker?5:-5,rotation:speaker?-1:1,duration:2.5+speaker*.4,repeat:-1,yoyo:true,ease:'sine.inOut'}));
      const holdPitch=()=>chatter.timeScale(pitch.matches(':hover')?0:1);
      listen(pitch,'mouseenter',holdPitch);
      listen(pitch,'mouseleave',holdPitch);
    });
    const intro=gsap.timeline({defaults:{ease:'power3.out'}});
    intro.from('.hero h1 > span',{yPercent:50,rotation:3,duration:.8,stagger:.09,ease:'expo.out'},0)
      .from('.hero-paper',{scale:.96,duration:.9,ease:'power3.out'},0)
      .from('.hero-windowbar',{autoAlpha:0,duration:.5,immediateRender:false},.12)
      .from('.hero-ticket',{y:-30,rotation:-12,autoAlpha:0,duration:.8,ease:'back.out(1.7)',immediateRender:false},.25)
      .from('.hero-copy,.hero-button',{y:20,duration:.4,stagger:.05},0)
      .from('.hero-cat-left .cat-entry',{xPercent:-115,y:120,rotation:-30,duration:.9,ease:'elastic.out(1,.7)'},.04)
      .from('.hero-cat-right .cat-entry',{xPercent:115,y:110,rotation:32,duration:.9,ease:'elastic.out(1,.7)'},.12)
      .from('.satellite-entry',{yPercent:-130,rotation:0,scale:.7,duration:.8,stagger:.08,ease:'back.out(1.6)'},.08)
      .from('.hero-float,.hero-spark,.miri-stamp',{scale:0,rotation:-50,duration:.65,stagger:.04,ease:'elastic.out(1,.65)'},.25);

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

    // A three-beat sticker carousel replaces the oversized character zoom.
    gsap.set('.hero-orbit',{autoAlpha:0});
    gsap.set('.orbit-center',{autoAlpha:0,y:45,scale:.85});
    gsap.set('.universe-mascot,.universe-seal,.universe-note,.universe-footer',{scale:.85,autoAlpha:0});
    const orbitScene=document.querySelector<HTMLElement>('.hero')!;
    let orbitWidth=orbitScene.clientWidth,orbitHeight=orbitScene.clientHeight;
    const orbitTurn={value:0};
    let baseOrbit=getCreativeOrbitLayout(orbitWidth,orbitHeight,0);
    const orbitPosition=(i:number)=>baseOrbit[i];
    document.querySelectorAll<HTMLElement>('.orbit-item').forEach((el,i)=>{
      const pos=orbitPosition(i);
      gsap.set(el,{x:pos.x,y:pos.y,rotation:pos.rotation,scale:.72,autoAlpha:0});
    });
    const orbitSetters=Array.from(document.querySelectorAll<HTMLElement>('.orbit-item')).map(el=>({x:gsap.quickSetter(el,'x','px'),y:gsap.quickSetter(el,'y','px'),rotation:gsap.quickSetter(el,'rotation','deg')}));
    const renderOrbit=()=>getCreativeOrbitLayout(orbitWidth,orbitHeight,orbitTurn.value).forEach((position,i)=>{orbitSetters[i]?.x(position.x);orbitSetters[i]?.y(position.y);orbitSetters[i]?.rotation(position.rotation);});
    const refreshOrbit=()=>{orbitWidth=orbitScene.clientWidth;orbitHeight=orbitScene.clientHeight;baseOrbit=getCreativeOrbitLayout(orbitWidth,orbitHeight,0);renderOrbit();};
    listen(window,'resize',refreshOrbit);
    const compactHero=innerWidth<=800;
    // Read the phone scene before a brief, reversible handoff.
    const heroTransition=gsap.timeline({scrollTrigger:{
      trigger:'.hero',
      start:()=>compactHero&&orbitScene.clientHeight>innerHeight?'bottom bottom':'top top',
      end:()=>`+=${innerHeight*(compactHero?.35:1.4)}`,
      pin:innerHeight>650,
      scrub:true,
      invalidateOnRefresh:true,
      onRefresh:refreshOrbit,
    }})
      .to('.hero-type',{y:-65,rotation:-3,scale:.95,autoAlpha:0,duration:.65,ease:'power1.inOut'},.15)
      .to('.hero-copy,.hero-button,.cat-speech,.hero-windowbar,.hero-ticket,.hero-magic-position,.hero-edition,.studio-atmosphere,.motion-hint,.hero-meta,.hero-bottom,.cat-note,.miri-stamp',{y:-25,autoAlpha:0,duration:.65,ease:'power1.inOut'},.2)
      .to('.hero-cat-left',{y:-35,rotation:-9,scale:.9,duration:.6,ease:'power1.inOut'},.3)
      .to('.hero-cat-right',{y:-45,rotation:10,scale:.9,duration:.6,ease:'power1.inOut'},.35)
      .to('.hero-cat-left',{xPercent:-45,y:35,rotation:12,scale:.7,duration:.85,ease:'power1.inOut'},.8)
      .to('.hero-cat-right',{xPercent:45,y:35,rotation:-12,scale:.7,duration:.85,ease:'power1.inOut'},.85)
      .to('.hero-satellite',{y:-150,scale:.7,autoAlpha:0,duration:.75,ease:'power1.inOut'},.25)
      .to('.hero-float,.hero-spark,.hero-hand',{autoAlpha:0,duration:.6},.25)
      .to('.hero-ground',{scaleY:7,transformOrigin:'50% 100%',duration:1.25,ease:'power1.inOut'},.4)
      .to('.hero-orbit',{autoAlpha:1,duration:.75,ease:'power1.inOut'},.65)
      .to('.orbit-center',{autoAlpha:1,y:0,scale:1,duration:.85,ease:'power2.out'},.95)
      .to('.orbit-web',{x:()=>orbitPosition(0).x,y:()=>orbitPosition(0).y,scale:1,rotation:()=>orbitPosition(0).rotation,autoAlpha:1,duration:.85,ease:'power2.out'},1.1)
      .to('.orbit-resume',{x:()=>orbitPosition(1).x,y:()=>orbitPosition(1).y,scale:1,rotation:()=>orbitPosition(1).rotation,autoAlpha:1,duration:.85,ease:'power2.out'},1.25)
      .to('.orbit-food',{x:()=>orbitPosition(2).x,y:()=>orbitPosition(2).y,scale:1,rotation:()=>orbitPosition(2).rotation,autoAlpha:1,duration:.85,ease:'power2.out'},1.4)
      .to(orbitTurn,{value:118,duration:1.25,ease:'power1.inOut',onUpdate:renderOrbit},1.95)
      .to('.orbit-track',{rotation:-25,duration:1.8,ease:'none'},1.1)
      .to('.universe-mascot',{scale:1,autoAlpha:1,duration:.9,ease:'power2.out'},.95)
      .to('.universe-seal,.universe-note,.universe-footer',{scale:1,autoAlpha:1,duration:.7,stagger:.1,ease:'power2.out'},1.3)
      // Keep the finished universe readable before the page releases into services.
      .to('.hero-orbit',{autoAlpha:1,duration:.45},3.2);
    if(compactHero)heroTransition.to('.hero-cast',{autoAlpha:0,duration:.8,ease:'power1.inOut'},.6);
    sceneLoop('.hero',gsap.to('.orbit-center em',{rotation:2,scale:1.015,duration:2.4,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    }

    if(document.querySelector('.service-cats'))gsap.from('.service-illustration',{y:140,scale:.45,rotation:-15,duration:1.3,stagger:.16,ease:'elastic.out(1,.65)',scrollTrigger:{trigger:'.service-cats',start:'top 88%',once:true}});
    document.querySelectorAll('.service-cat .cat').forEach((cat,i)=>sceneLoop('.service-cats',gsap.to(cat,{y:-12,rotation:i%2?-3:3,duration:1.2+i*.17,delay:i*.2,repeat:-1,yoyo:true,ease:'sine.inOut'})));

    const playground=document.querySelector('.playground-section');
    if(playground){
      gsap.timeline({scrollTrigger:{trigger:playground,start:'top top',end:'+=65%',pin:matchMedia('(min-width:900px)').matches&&playground.getBoundingClientRect().height<=innerHeight,scrub:true,invalidateOnRefresh:true}})
        .to('.playground-sky',{yPercent:-38,ease:'none'},0)
        .to('.playground-cast',{scale:1.04,y:-8,ease:'none'},0)
        .fromTo('.playground-doodles',{rotation:-5,scale:1.12},{rotation:5,scale:1.02,ease:'none'},0);
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
    entrance('.about-art',{rotation:5,y:80,ease:'none',scrollTrigger:{trigger:'.about-section',start:'top bottom',end:'center center',scrub:true}});
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
    if(!isAllowedServiceId(id))return;
    character=id;
    if(reduced)return;
    actors.forEach((actor,cat)=>{
      if(cat.closest('.playground-section')){
        const active=cat.closest(`[data-playground-character="${id}"]`)!==null;
        actor.visible=active;
        actor.timeline.paused(!active||document.hidden);
      }
    });
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
