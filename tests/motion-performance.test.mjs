import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPointerQueue,createGeometryCache} from '../src/scripts/motion-performance.mjs';

test('pointer motion handles only the latest sample per listener before each paint',()=>{
  const callbacks=new Map();let id=0;
  globalThis.requestAnimationFrame=callback=>{callbacks.set(++id,callback);return id;};
  globalThis.cancelAnimationFrame=key=>callbacks.delete(key);
  try{
    const queue=createPointerQueue();const received=[];
    const cursor=event=>received.push(['cursor',event.x]);
    const eyes=event=>received.push(['eyes',event.x]);
    for(let x=0;x<100;x++){queue.push(cursor,{x});queue.push(eyes,{x});}
    assert.equal(callbacks.size,1);
    const [key,flush]=callbacks.entries().next().value;callbacks.delete(key);flush();
    assert.deepEqual(received,[['cursor',99],['eyes',99]]);
    queue.push(cursor,{x:100});queue.remove(cursor);
    const [nextKey,nextFlush]=callbacks.entries().next().value;callbacks.delete(nextKey);nextFlush();
    assert.equal(received.length,2);
    queue.push(cursor,{x:101});queue.destroy();assert.equal(callbacks.size,0);
  }finally{delete globalThis.requestAnimationFrame;delete globalThis.cancelAnimationFrame;}
});
test('geometry is measured once until scroll, resize or layout changes invalidate it',()=>{
  let reads=0;
  const element={getBoundingClientRect(){return {top:++reads};}};
  const cache=createGeometryCache();
  assert.equal(cache.read(element).top,1);
  assert.equal(cache.read(element).top,1);
  assert.equal(reads,1);
  cache.invalidate();
  assert.equal(cache.read(element).top,2);
  assert.equal(reads,2);
});
