import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {createChoreography} from './choreography';
import {syncMotionPreference} from './motion-preference';
gsap.registerPlugin(ScrollTrigger);

let dispose: (()=>void) | undefined;
let mountedRoot:HTMLElement|null=null;

function mountPage() {
  dispose?.();
  mountedRoot=document.getElementById('main');
  const enabled=syncMotionPreference();
  const cleanups: (()=>void)[]=[];
  const controller=new AbortController();
  const listen=(el:EventTarget,type:string,handler:EventListener)=>el.addEventListener(type,handler,{signal:controller.signal});
  let lenis:Lenis|undefined;
  let choreography:ReturnType<typeof createChoreography>|undefined;
  let videoObjectUrl='';

  function scrollTo(target:HTMLElement) {
    if(lenis) lenis.scrollTo(target,{offset:-24});
    else target.scrollIntoView({behavior:'instant',block:'start'});
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
  function activateService(id:string) {
    if(!document.querySelector(`[data-service-tab="${CSS.escape(id)}"]`))return;
    pricingTabs.forEach(tab=>{
      const selected=tab.dataset.serviceTab===id;
      tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
      const panel=document.getElementById(`pricing-${tab.dataset.serviceTab}`);
      if(panel)panel.hidden=!selected;
    });
    document.querySelectorAll<HTMLElement>('[data-character]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.character===id)));
    document.querySelectorAll<HTMLElement>('[data-playground-character]').forEach(actor=>actor.hidden=actor.dataset.playgroundCharacter!==id);
    const labels:Record<string,string>={websites:'website',resumes:'resume',food:'food visual'};
    const explore=document.querySelector<HTMLElement>('[data-explore-packages]');
    if(explore&&labels[id])explore.childNodes[0].textContent=`Explore ${labels[id]} packages `;
    const status=document.getElementById('playground-status');
    if(status&&labels[id])status.textContent=`Your ${labels[id]} buddy is ready to make something good.`;
    choreography?.selectCharacter(id);
    choreography?.swap(`#pricing-${id} .package`);
    ScrollTrigger.refresh();
  }
  const showcaseTabs=setupTabs('[data-showcase]',activateShowcase);
  function activateShowcase(id:string) {
    showcaseTabs.forEach(tab=>{
      const selected=tab.dataset.showcase===id;
      tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
      const scene=document.getElementById(`showcase-${tab.dataset.showcase}`);
      const copy=document.getElementById(`showcase-copy-${tab.dataset.showcase}`);
      if(scene)scene.hidden=!selected;if(copy)copy.hidden=!selected;
    });
    choreography?.swap(`#showcase-copy-${id},#showcase-${id} .preview-stage`);
  }
  document.querySelectorAll<HTMLElement>('[data-pick-service]').forEach(link=>{
    listen(link,'click',(e)=>{
      e.preventDefault();
      activateService(link.dataset.pickService!);
      if(link.hasAttribute('data-character')){activateShowcase(link.dataset.pickService!);return;}
      const pricing=document.getElementById('pricing');
      if(pricing)scrollTo(pricing);
      history.replaceState(null,'',`#pricing-${link.dataset.pickService}`);
    });
  });
  function activateHash() {
    const id=location.hash.replace('#pricing-','');
    if(location.hash.startsWith('#pricing-')){
      activateService(id);
      const target=document.getElementById('pricing');
      if(target)scrollTo(target);
    }
  }
  listen(window,'hashchange',activateHash);

  const energy=document.querySelector<HTMLInputElement>('#creative-energy');
  if(energy)listen(energy,'input',()=>{
    const value=Number(energy.value);
    const state=document.getElementById('energy-state');
    if(state)state.textContent=value<28?'Quietly clever':value<80?'Feeling playful':'Full purr-sonality';
    energy.style.setProperty('--energy',`${value}%`);
    choreography?.setEnergy(value);
  });
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
    if(!dialog||!video)return;
    videoOpener=opener;
    document.getElementById('video-dialog-title')!.textContent=title;
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
      if(!file.type.startsWith('video/')){error.textContent='Please choose an MP4, WebM or MOV video.';fileInput.value='';return;}
      error.textContent='';
      if(videoObjectUrl)URL.revokeObjectURL(videoObjectUrl);
      videoObjectUrl=URL.createObjectURL(file);
      openVideo(videoObjectUrl,`Local preview: ${file.name}`,previewButton,true);
      fileInput.value='';
    });
  }
  if(dialog&&video){
    dialog.setAttribute('data-lenis-prevent','');
    listen(dialog.querySelector('.dialog-close')!,'click',()=>dialog.close());
    listen(dialog,'click',(e)=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();const m=e as MouseEvent;if(m.clientX<rect.left||m.clientX>rect.right||m.clientY<rect.top||m.clientY>rect.bottom)dialog.close();}});
    listen(dialog,'close',()=>{video.pause();video.removeAttribute('src');video.load();if(videoObjectUrl){URL.revokeObjectURL(videoObjectUrl);videoObjectUrl='';}lenis?.start();videoOpener?.focus();});
    listen(video,'error',()=>{const note=dialog.querySelector<HTMLElement>('.dialog-note');if(note){note.hidden=false;note.textContent='This video could not be played. Try an MP4 using H.264 video, or a WebM file.';}});
  }

  const context=gsap.context(()=>{
    if(!enabled)return;
    // Full motion, including Lenis, is always enabled for this site.
    lenis=new Lenis({lerp:0,duration:1.45,easing:t=>1-Math.pow(1-t,4),smoothWheel:true,wheelMultiplier:.9,syncTouch:true,syncTouchLerp:.085,touchInertiaExponent:1.5,respectReducedMotion:false,anchors:false});
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link=>listen(link,'click',raw=>{
      const event=raw as MouseEvent;
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const hash=link.getAttribute('href')!;
      const target=hash==='#top'?0:document.getElementById(hash.slice(1));
      if(target===null)return;
      event.preventDefault();
      lenis?.scrollTo(target,{offset:target===0?0:-24,duration:1.5});
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
  activateHash();
  dispose=()=>{controller.abort();if(video){video.pause();video.removeAttribute('src');}if(dialog?.open)dialog.close();if(videoObjectUrl)URL.revokeObjectURL(videoObjectUrl);cleanups.reverse().forEach(fn=>fn());};
}

function ensureMounted(){if(mountedRoot!==document.getElementById('main')||!dispose)mountPage();}
document.addEventListener('astro:page-load',ensureMounted);
document.addEventListener('astro:before-swap',()=>{dispose?.();dispose=undefined;mountedRoot=null;});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureMounted,{once:true});else ensureMounted();
