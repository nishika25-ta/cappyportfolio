import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {createChoreography} from './choreography';
import {syncMotionPreference} from './motion-preference';
import {createFrameCoalescer} from './frame-coalescer.mjs';
import {getEnergyState} from './energy-state.mjs';
import {parseServiceRoute,serviceForShowcase} from './service-navigation.mjs';
import {createPointerQueue} from './motion-performance.mjs';
import {
  isAllowedServiceId,
  isAllowedShowcaseId,
  isAllowedVideoSource,
  isSafeAnchorHash,
  sanitizePlainText,
  validateVideoFile
} from './security.mjs';
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({limitCallbacks:true,ignoreMobileResize:true});

let dispose: (()=>void) | undefined;
let mountedRoot:HTMLElement|null=null;

function mountPage() {
  dispose?.();
  mountedRoot=document.getElementById('main');
  const enabled=syncMotionPreference();
  const cleanups: (()=>void)[]=[];
  const controller=new AbortController();
  const pointerQueue=createPointerQueue();
  cleanups.push(()=>pointerQueue.destroy());
  let refreshFrame=0;
  let pendingScroll:{target:HTMLElement;focus?:HTMLElement}|undefined;
  const listen=(el:EventTarget,type:string,handler:EventListener)=>{
    if(type==='pointermove'){
      const dispatch=(event:Event)=>handler(event);
      el.addEventListener(type,event=>pointerQueue.push(dispatch,event),{passive:true,signal:controller.signal});
      el.addEventListener('pointerleave',()=>pointerQueue.remove(dispatch),{signal:controller.signal});
    }else el.addEventListener(type,handler,{signal:controller.signal});
  };
  function scheduleScrollRefresh(request?:{target:HTMLElement;focus?:HTMLElement}){
    if(request)pendingScroll=request;
    if(refreshFrame)return;
    refreshFrame=requestAnimationFrame(()=>{
      refreshFrame=0;
      ScrollTrigger.refresh();
      const next=pendingScroll;pendingScroll=undefined;
      if(next)scrollTo(next.target,next.focus);
    });
  }
  cleanups.push(()=>{if(refreshFrame)cancelAnimationFrame(refreshFrame);});
  let lenis:Lenis|undefined;
  let choreography:ReturnType<typeof createChoreography>|undefined;
  let videoObjectUrl='';
  const visiblePreviews=new Set<HTMLVideoElement>();
  function updatePreviewPlayback(preview:HTMLVideoElement){
    if(visiblePreviews.has(preview)&&!preview.closest('[hidden]')&&!document.hidden&&!document.querySelector('#video-dialog[open]'))preview.play().catch(()=>{});
    else preview.pause();
  }

  function navigationOffset(){
    const header=document.querySelector<HTMLElement>('.site-header');
    if(!header)return 24;
    const position=getComputedStyle(header).position;
    return position==='sticky'||position==='fixed'?header.getBoundingClientRect().height+12:24;
  }
  function scrollTo(target:HTMLElement,focus?:HTMLElement) {
    if(lenis) lenis.scrollTo(target,{offset:-navigationOffset(),onComplete:()=>focus?.focus({preventScroll:true})});
    else {target.scrollIntoView({behavior:'instant',block:'start'});focus?.focus({preventScroll:true});}
  }

  function setupTabs(selector:string,activate:(id:string)=>void) {
    const tabs=[...document.querySelectorAll<HTMLButtonElement>(selector)];
    tabs.forEach(tab=>{
      listen(tab,'click',()=>activate(tab.dataset.serviceTab??tab.dataset.showcase??''));
      listen(tab,'keydown',(raw)=>{
        const e=raw as KeyboardEvent;
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
        e.preventDefault();
        const current=tabs.indexOf(tab);
        const index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(current+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        const next=tabs[index];
        activate(next.dataset.serviceTab??next.dataset.showcase??'');
        next.focus();
      });
    });
    return tabs;
  }
  const pricingTabs=setupTabs('[data-service-tab]',activateService);
  let selectedService=pricingTabs.find(tab=>tab.getAttribute('aria-selected')==='true')?.dataset.serviceTab;
  let lastWebsiteShowcase='websites';
  function activateService(id:string,syncShowcase=true) {
    if(!isAllowedServiceId(id)||!pricingTabs.some(tab=>tab.dataset.serviceTab===id))return false;
    if(selectedService===id)return true;
    selectedService=id;
    pricingTabs.forEach(tab=>{
      const selected=tab.dataset.serviceTab===id;
      tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
      const panel=document.getElementById(`pricing-${tab.dataset.serviceTab}`);
      if(panel)panel.hidden=!selected;
    });
    document.querySelectorAll<HTMLElement>('[data-character]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.character===id)));
    document.querySelectorAll<HTMLElement>('[data-playground-character]').forEach(actor=>actor.hidden=actor.dataset.playgroundCharacter!==id);
    const labels:Record<string,string>={websites:'website',portfolios:'portfolio',resumes:'resume',food:'food visual'};
    const explore=document.querySelector<HTMLElement>('[data-explore-packages]');
    if(explore&&labels[id]){
      explore.childNodes[0].textContent=`Explore ${labels[id]} packages `;
      explore.setAttribute('href',`#pricing-${id}`);
      explore.dataset.pickService=id;
    }
    const status=document.getElementById('playground-status');
    if(status&&labels[id])status.textContent=`Your ${labels[id]} buddy is ready to make something good.`;
    choreography?.selectCharacter(id);
    choreography?.swap(`#pricing-${id} .package`);
    if(syncShowcase&&id==='websites')activateShowcase(lastWebsiteShowcase,false);
    scheduleScrollRefresh();
    return true;
  }
  const showcaseTabs=setupTabs('[data-showcase]',activateShowcase);
  let selectedShowcase=showcaseTabs.find(tab=>tab.getAttribute('aria-selected')==='true')?.dataset.showcase;
  function activateShowcase(id:string,syncService=true) {
    if(!isAllowedShowcaseId(id)||!showcaseTabs.some(tab=>tab.dataset.showcase===id))return false;
    if(selectedShowcase===id)return true;
    selectedShowcase=id;
    const service=serviceForShowcase(id);
    if(service==='websites')lastWebsiteShowcase=id;
    showcaseTabs.forEach(tab=>{
      const selected=tab.dataset.showcase===id;
      tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
      const scene=document.getElementById(`showcase-${tab.dataset.showcase}`);
      const copy=document.getElementById(`showcase-copy-${tab.dataset.showcase}`);
      if(scene){
        scene.hidden=!selected;
        const vid=scene.querySelector<HTMLVideoElement>('video');
        if(vid){
          if(selected){
            vid.currentTime=0;
            updatePreviewPlayback(vid);
          }else{
            vid.pause();
          }
        }
      }
      if(copy)copy.hidden=!selected;
    });
    choreography?.swap(`#showcase-copy-${id},#showcase-${id} .video-poster,#showcase-${id} .preview-stage`);
    if(syncService&&service)activateService(service,false);
    scheduleScrollRefresh();
    return true;
  }
  function navigateService(id:string,section:'playground'|'pricing',keyboard=false){
    if(!activateService(id))return;
    const target=document.getElementById(section);
    const heading=document.getElementById(`${section}-title`);
    if(keyboard&&heading)heading.tabIndex=-1;
    if(target)scheduleScrollRefresh({target,focus:keyboard&&heading?heading:undefined});
    const hash=`#${section}-${id}`;
    if(location.hash!==hash)history.pushState(null,'',hash);
  }
  document.querySelectorAll<HTMLElement>('[data-pick-service]').forEach(link=>{
    listen(link,'click',(e)=>{
      const click=e as MouseEvent;
      if(click.button!==0||click.metaKey||click.ctrlKey||click.shiftKey||click.altKey)return;
      e.preventDefault();
      navigateService(link.dataset.pickService!,link.hasAttribute('data-character')?'playground':'pricing',click.detail===0);
    });
  });
  function activateHash() {
    const route=parseServiceRoute(location.hash);
    if(route&&activateService(route.service)){
      const target=document.getElementById(route.section);
      if(target)scheduleScrollRefresh({target});
    }
  }
  listen(window,'hashchange',activateHash);
  listen(window,'popstate',activateHash);

  const energy=document.querySelector<HTMLInputElement>('#creative-energy');
  const energyLabel=document.getElementById('energy-state');
  const energyMotion=createFrameCoalescer(()=>{
    if(!energy)return;
    const state=getEnergyState(Number(energy.value));
    if(energyLabel&&energyLabel.textContent!==state.label)energyLabel.textContent=state.label;
    energy.style.setProperty('--energy',`${state.energy}%`);
    choreography?.setEnergy(state.energy);
  });
  cleanups.push(()=>energyMotion.cancel());
  if(energy)listen(energy,'input',()=>energyMotion.schedule());
  document.querySelectorAll('[data-pet-cat]').forEach(button=>listen(button,'click',()=>choreography?.pet()));

  const menu=document.querySelector<HTMLButtonElement>('.menu-toggle');
  const nav=document.getElementById('main-nav');
  function closeMenu(restoreFocus=false){
    menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu');nav?.classList.remove('is-open');
    if(restoreFocus)menu?.focus();
  }
  if(menu&&nav){
    listen(menu,'click',()=>{
      const open=menu.getAttribute('aria-expanded')!=='true';
      menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');nav.classList.toggle('is-open',open);
      if(open)nav.querySelector<HTMLAnchorElement>('a')?.focus();
    });
    listen(document,'keydown',(raw)=>{
      if(menu.getAttribute('aria-expanded')!=='true')return;
      const e=raw as KeyboardEvent;
      if(e.key==='Escape'){closeMenu(true);return;}
      if(e.key!=='Tab')return;
      const targets=[...nav.querySelectorAll<HTMLElement>('a'),menu];
      const index=targets.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();targets[(index+(e.shiftKey?-1:1)+targets.length)%targets.length].focus();
    });
    nav.querySelectorAll('a').forEach(link=>listen(link,'click',()=>closeMenu()));
    listen(document,'click',(e)=>{if(!nav.contains(e.target as Node)&&!menu.contains(e.target as Node))closeMenu();});
    const desktop=matchMedia('(min-width:1001px)');
    listen(desktop,'change',()=>closeMenu());
  }

  const dialog=document.querySelector<HTMLDialogElement>('#video-dialog');
  const video=document.querySelector<HTMLVideoElement>('#dialog-video');
  const fileInput=document.querySelector<HTMLInputElement>('#local-video');
  let videoOpener:HTMLElement|undefined;
  function openVideo(src:string,title:string,opener:HTMLElement,local=false){
    if(!dialog||!video||!isAllowedVideoSource(src,local))return;
    videoOpener=opener;
    document.querySelectorAll<HTMLVideoElement>('.showcase-scene video').forEach(v=>v.pause());
    document.getElementById('video-dialog-title')!.textContent=sanitizePlainText(title,120);
    const note=dialog.querySelector<HTMLElement>('.dialog-note');
    if(note){note.hidden=!local;note.textContent='Your local preview is only visible on this device. To publish a showcase, add your video to the site’s video folder.';}
    video.src=src;dialog.showModal();lenis?.stop();
    video.play().catch(()=>{});
  }
  document.querySelectorAll<HTMLElement>('[data-video-src]').forEach(button=>listen(button,'click',()=>openVideo(button.dataset.videoSrc!,button.dataset.videoTitle!,button)));
  const previewButton=document.querySelector<HTMLElement>('[data-preview-video]');
  if(previewButton&&fileInput){
    listen(previewButton,'click',()=>fileInput.click());
    listen(fileInput,'change',()=>{
      const file=fileInput.files?.[0];if(!file)return;
      const error=document.getElementById('video-error')!;
      const validation=validateVideoFile(file);
      if(!validation.valid){error.textContent=validation.reason??'Please choose an MP4, WebM or MOV video.';fileInput.value='';return;}
      error.textContent='';
      if(videoObjectUrl)URL.revokeObjectURL(videoObjectUrl);
      videoObjectUrl=URL.createObjectURL(file);
      openVideo(videoObjectUrl,`Local preview: ${validation.safeName}`,previewButton,true);
      fileInput.value='';
    });
  }
  if(dialog&&video){
    dialog.setAttribute('data-lenis-prevent','');
    listen(dialog.querySelector('.dialog-close')!,'click',()=>dialog.close());
    listen(dialog,'click',(e)=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();const m=e as MouseEvent;if(m.clientX<rect.left||m.clientX>rect.right||m.clientY<rect.top||m.clientY>rect.bottom)dialog.close();}});
    listen(dialog,'close',()=>{
      video.pause();video.removeAttribute('src');video.load();
      if(videoObjectUrl){URL.revokeObjectURL(videoObjectUrl);videoObjectUrl='';}
      lenis?.start();videoOpener?.focus();
      const activeVid=document.querySelector<HTMLVideoElement>('.showcase-scene:not([hidden]) video');
      if(activeVid)updatePreviewPlayback(activeVid);
    });
    listen(video,'error',()=>{const note=dialog.querySelector<HTMLElement>('.dialog-note');if(note){note.hidden=false;note.textContent='This video could not be played. Try an MP4 using H.264 video, or a WebM file.';}});
  }

  const context=gsap.context(()=>{
    if(!enabled)return;
    // Full motion, including Lenis, is always enabled for this site.
    lenis=new Lenis({lerp:0,duration:1.2,easing:t=>1-Math.pow(1-t,4),smoothWheel:true,wheelMultiplier:.9,syncTouch:false,respectReducedMotion:false,anchors:false});
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link=>listen(link,'click',raw=>{
      const event=raw as MouseEvent;
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const hash=link.getAttribute('href')!;
      if(!isSafeAnchorHash(hash))return;
      const target=hash==='#top'?0:document.getElementById(hash.slice(1));
      if(target===null)return;
      event.preventDefault();
      lenis?.scrollTo(target,{offset:target===0?0:-navigationOffset(),duration:1.5});
      history.pushState(null,'',hash);
    }));
    lenis.on('scroll',ScrollTrigger.update);
    const tick=(time:number)=>lenis?.raf(time*1000);
    gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
    cleanups.push(()=>{gsap.ticker.remove(tick);lenis?.destroy();});
  });
  choreography=createChoreography(listen);
  cleanups.push(()=>choreography?.destroy());
  cleanups.push(()=>context.revert());
  const previewObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      const preview=entry.target as HTMLVideoElement;
      if(entry.isIntersecting&&entry.intersectionRatio>=.15)visiblePreviews.add(preview);
      else visiblePreviews.delete(preview);
      updatePreviewPlayback(preview);
    }
  },{threshold:[0,.15]});
  document.querySelectorAll<HTMLVideoElement>('.showcase-scene video').forEach(preview=>{
    preview.muted=true;preview.pause();previewObserver.observe(preview);
  });
  listen(document,'visibilitychange',()=>visiblePreviews.forEach(updatePreviewPlayback));
  cleanups.push(()=>{previewObserver.disconnect();visiblePreviews.clear();});
  activateHash();
  dispose=()=>{controller.abort();document.querySelectorAll<HTMLVideoElement>('.showcase-scene video').forEach(v=>v.pause());if(video){video.pause();video.removeAttribute('src');}if(dialog?.open)dialog.close();if(videoObjectUrl)URL.revokeObjectURL(videoObjectUrl);cleanups.reverse().forEach(fn=>fn());};
}

function ensureMounted(){
  const requestedRoot=document.getElementById('main');
  if(mountedRoot!==requestedRoot||!dispose)mountPage();
}
document.addEventListener('astro:page-load',ensureMounted);
document.addEventListener('astro:before-swap',()=>{dispose?.();dispose=undefined;mountedRoot=null;});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureMounted,{once:true});else ensureMounted();
