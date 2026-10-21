export function createPointerQueue(): {
  push(handler:(event:Event)=>void,event:Event):void;
  remove(handler:(event:Event)=>void):void;
  destroy():void;
};
export function createGeometryCache(): {
  read(element:Element):DOMRect;
  invalidate():void;
};
