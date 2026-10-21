import {createFrameCoalescer} from './frame-coalescer.mjs';

export function createPointerQueue(){
  const pending=new Map();
  const frame=createFrameCoalescer(()=>{
    const work=[...pending];pending.clear();
    for(const [handler,event] of work)handler(event);
  });
  return {
    push(handler,event){pending.set(handler,event);frame.schedule();},
    remove(handler){pending.delete(handler);},
    destroy(){frame.cancel();pending.clear();}
  };
}

export function createGeometryCache(){
  const cache=new WeakMap();let generation=0;
  return {
    read(element){
      let entry=cache.get(element);
      if(!entry||entry.generation!==generation){
        entry={generation,rect:element.getBoundingClientRect()};cache.set(element,entry);
      }
      return entry.rect;
    },
    invalidate(){generation++;}
  };
}
