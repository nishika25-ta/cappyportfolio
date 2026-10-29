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
        const orbit=entry.target.closest<HTMLElement>('.hero-orbit');
        const isHidden=Boolean(entry.target.closest('[hidden]'))||(orbit!==null&&getComputedStyle(orbit).visibility==='hidden');
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
    const heroOnlyLoops:gsap.core.Animation[]=[];
    const registerHeroLoop=(loop:gsap.core.Animation)=>{sceneLoop('.hero',loop);heroOnlyLoops.push(loop);};
    registerHeroLoop(gsap.to('.studio-orbit-stars',{opacity:.4,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    document.querySelectorAll<HTMLElement>('.cat-speech').forEach((pitch,speaker)=>{
      const messages=Array.from(pitch.querySelectorAll<HTMLElement>('[data-cat-pitch]'));
      if(messages.length<2)return;
      let active=0;
      const showPitch=(index:number)=>{
        active=index;
        messages.forEach((message,i)=>{message.dataset.active=String(i===index);message.setAttribute('aria-hidden',String(i!==index));});
      };
      const chatter=gsap.to({},{duration:speaker?7.5:6.5,repeat:-1,onRepeat:()=>showPitch((active+1)%messages.length)});
      registerHeroLoop(chatter);
      registerHeroLoop(gsap.to(pitch.querySelector('.cat-speech-body'),{y:speaker?5:-5,rotation:speaker?-1:1,duration:2.5+speaker*.4,repeat:-1,yoyo:true,ease:'sine.inOut'}));
      const holdPitch=()=>chatter.timeScale(pitch.matches(':hover')?0:1);
      listen(pitch,'mouseenter',holdPitch);
      listen(pitch,'mouseleave',holdPitch);
    });
    const intro=gsap.timeline({defaults:{ease:'power3.out'}});
    intro.from('.hero h1 > span',{yPercent:42,rotation:2,duration:.75,stagger:.08,ease:'expo.out'},0)
      .from('.hero-paper',{scale:.97,duration:.8,ease:'power3.out'},0)
      .from('.hero-windowbar',{autoAlpha:0,duration:.45,immediateRender:false},.1)
      .from('.hero-ticket',{y:-24,rotation:-10,autoAlpha:0,duration:.65,ease:'back.out(1.5)',immediateRender:false},.2)
      .from('.hero-copy,.hero-button',{y:18,duration:.4,stagger:.05},0)
      .from('.hero-cat-left .cat-entry',{xPercent:-85,y:85,rotation:-18,duration:.75,ease:'back.out(1.35)'},.04)
      .from('.hero-cat-right .cat-entry',{xPercent:85,y:80,rotation:18,duration:.75,ease:'back.out(1.35)'},.1)
      .from('.satellite-entry',{yPercent:-110,rotation:0,scale:.75,duration:.7,stagger:.08,ease:'back.out(1.4)'},.08)
      .from('.hero-float,.hero-spark,.miri-stamp',{scale:0,rotation:-35,duration:.55,stagger:.04,ease:'back.out(1.5)'},.22);

    document.querySelectorAll<HTMLElement>('.hero-float,.hero-spark').forEach((el,i)=>{
      const t=gsap.to(el,{y:i%2?16:-16,rotation:`+=${i%2?7:-7}`,duration:2.4+i*.3,repeat:-1,yoyo:true,ease:'sine.inOut'});
      registerHeroLoop(t);
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
      registerHeroLoop(hand);
    }
    document.querySelectorAll<SVGSVGElement>('.hero-cat .cat').forEach(cat=>{
      const actor=actors.get(cat);
      if(actor)heroOnlyLoops.push(actor.timeline);
    });

    // A three-beat sticker carousel replaces the oversized character zoom.
    gsap.set('.hero-orbit',{autoAlpha:0});
    gsap.set('.orbit-center',{autoAlpha:0,y:32,scale:.9});
    gsap.set('.universe-mascot,.universe-note',{scale:.88,autoAlpha:0});
    const orbitScene=document.querySelector<HTMLElement>('.hero')!;
    let orbitWidth=orbitScene.clientWidth,orbitHeight=orbitScene.clientHeight;
    const orbitTurn={value:0};
    let baseOrbit=getCreativeOrbitLayout(orbitWidth,orbitHeight,0);
    const orbitPosition=(i:number)=>baseOrbit[i];
    document.querySelectorAll<HTMLElement>('.orbit-item').forEach((el,i)=>{
      const pos=orbitPosition(i);
      gsap.set(el,{x:0,y:20,rotation:pos.rotation,scale:.78,autoAlpha:0});
    });
    const orbitSetters=Array.from(document.querySelectorAll<HTMLElement>('.orbit-item')).map(el=>({
      x:gsap.quickSetter(el,'x','px'),
      y:gsap.quickSetter(el,'y','px'),
      rotation:gsap.quickSetter(el,'rotation','deg'),
    }));
    let lastOrbitTurn=NaN;
    const renderOrbit=(force=false)=>{
      if(!force&&orbitTurn.value===lastOrbitTurn)return;
      lastOrbitTurn=orbitTurn.value;
      const current=getCreativeOrbitLayout(orbitWidth,orbitHeight,orbitTurn.value);
      current.forEach((position,i)=>{
        const base=baseOrbit[i]??position;
        orbitSetters[i]?.x(position.x-base.x);
        orbitSetters[i]?.y(position.y-base.y);
        orbitSetters[i]?.rotation(position.rotation);
      });
    };
    const refreshOrbit=()=>{
      const nextWidth=orbitScene.clientWidth;
      const nextHeight=orbitScene.clientHeight;
      if(nextWidth===orbitWidth&&nextHeight===orbitHeight&&!Number.isNaN(lastOrbitTurn))return;
      orbitWidth=nextWidth;
      orbitHeight=nextHeight;
      baseOrbit=getCreativeOrbitLayout(orbitWidth,orbitHeight,0);
      renderOrbit(true);
    };
    listen(window,'resize',refreshOrbit);
    const heroOrbitLoops:gsap.core.Animation[]=[];
    const universeMascotCat=document.querySelector<SVGSVGElement>('.universe-mascot .cat');
    if(universeMascotCat){
      const mascotActor=actors.get(universeMascotCat);
      if(mascotActor){
        mascotActor.timeline.pause();
        heroOrbitLoops.push(mascotActor.timeline);
      }
    }
    let heroCovered=false;
    let heroOrbitActive=false;
    const syncHeroPhase=(progress:number)=>{
      const covered=progress>.34;
      if(covered!==heroCovered){
        heroCovered=covered;
        heroOnlyLoops.forEach(loop=>loop.paused(covered||document.hidden));
      }
      const orbitActive=progress>=.18;
      if(orbitActive!==heroOrbitActive){
        heroOrbitActive=orbitActive;
        heroOrbitLoops.forEach(loop=>loop.paused(!orbitActive||document.hidden));
      }
    };
    // Read the phone scene before a smooth, reversible handoff.
    const heroTransition=gsap.timeline({scrollTrigger:{
      trigger:'.hero',
      start:()=>orbitScene.clientHeight>innerHeight+2?'bottom bottom':'top top',
      end:()=>`+=${Math.round(innerHeight*(innerWidth<=800?.52:.64))}`,
      pin:true,
      scrub:true,
      invalidateOnRefresh:true,
      onRefresh:refreshOrbit,
      onUpdate:self=>syncHeroPhase(self.progress),
    }})
      .to('.hero-type',{y:-36,rotation:-1.5,scale:.95,autoAlpha:0,duration:.38,ease:'power2.inOut'},0)
      .to('.hero-copy,.hero-mobile-intro,.hero-actions,.cat-speech',{y:-18,autoAlpha:0,duration:.34,ease:'power2.inOut'},.02)
      .to('.hero-windowbar,.hero-ticket,.hero-magic-position,.hero-edition,.studio-atmosphere,.motion-hint,.hero-meta,.hero-bottom,.cat-note,.miri-stamp,.hero-float,.hero-spark,.hero-hand',{autoAlpha:0,duration:.32,ease:'power1.inOut'},.04)
      .to('.hero-satellite',{y:-85,scale:.8,autoAlpha:0,duration:.36,ease:'power2.inOut'},.04)
      .to('.hero-cat-left',{xPercent:-24,y:18,rotation:-10,scale:.88,autoAlpha:0,duration:.42,ease:'power2.inOut'},.04)
      .to('.hero-cat-right',{xPercent:24,y:18,rotation:10,scale:.88,autoAlpha:0,duration:.42,ease:'power2.inOut'},.06)
      .to('.hero-paper',{scale:.985,duration:.42,ease:'power2.inOut'},.04)
      .to('.hero-ground',{scaleY:2.2,yPercent:-15,transformOrigin:'50% 100%',duration:.42,ease:'power2.inOut'},.06)
      .to('.hero-orbit',{autoAlpha:1,duration:.26,ease:'power2.inOut'},.22)
      .to('.orbit-center',{autoAlpha:1,y:0,scale:1,duration:.42,ease:'power2.out'},.38)
      .to('.universe-mascot',{scale:1,autoAlpha:1,duration:.44,ease:'power2.out'},.4)
      .to('.orbit-web',{x:0,y:0,scale:1,rotation:()=>orbitPosition(0).rotation,autoAlpha:1,duration:.42,ease:'power2.out'},.46)
      .to('.orbit-resume',{x:0,y:0,scale:1,rotation:()=>orbitPosition(1).rotation,autoAlpha:1,duration:.42,ease:'power2.out'},.54)
      .to('.orbit-food',{x:0,y:0,scale:1,rotation:()=>orbitPosition(2).rotation,autoAlpha:1,duration:.42,ease:'power2.out'},.62)
      .to('.universe-note',{scale:1,autoAlpha:1,duration:.38,ease:'power2.out'},.64)
      .to(orbitTurn,{value:118,duration:.68,ease:'sine.inOut',onUpdate:renderOrbit},.56)
      .to('.orbit-track',{rotation:-22,duration:.82,ease:'none'},.46)
      // Brief hold so the finished universe is readable before releasing into services.
      .to('.hero-orbit',{autoAlpha:1,duration:.16},1.24);
    if(innerWidth<=800)heroTransition.to('.hero-cast',{autoAlpha:0,duration:.36,ease:'power2.inOut'},.08);
    const orbitEmLoop=gsap.to('.orbit-center em',{rotation:2,scale:1.015,duration:2.4,repeat:-1,yoyo:true,ease:'sine.inOut',paused:true});
    loops.push(orbitEmLoop);
    heroOrbitLoops.push(orbitEmLoop);
    }

    if(document.querySelector('.service-cats'))gsap.from('.service-illustration',{y:55,scale:.9,autoAlpha:0,duration:.75,stagger:.1,ease:'back.out(1.4)',scrollTrigger:{trigger:'.service-cats',start:'top 88%',once:true}});
    document.querySelectorAll('.service-cat .cat').forEach((cat,i)=>sceneLoop('.service-cats',gsap.to(cat,{y:-12,rotation:i%2?-3:3,duration:1.2+i*.17,delay:i*.2,repeat:-1,yoyo:true,ease:'sine.inOut'})));

    const playground=document.querySelector('.playground-section');
    if(playground){
      gsap.timeline({scrollTrigger:{trigger:playground,start:'top bottom',end:'bottom top',scrub:true,invalidateOnRefresh:true}})
        .to('.playground-sky',{yPercent:-28,ease:'none'},0)
        .to('.playground-cast',{scale:1.03,y:-6,ease:'none'},0)
        .fromTo('.playground-doodles',{rotation:-4,scale:1.08},{rotation:4,scale:1.01,ease:'none'},0);
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
        const pupils=scene.classList.contains('hero')?scene.querySelectorAll('.hero-cat .pupil'):scene.querySelectorAll('.pupil');
        if(!pupils.length)return;
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
    if(status)status.textContent='Prrrr.';
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
