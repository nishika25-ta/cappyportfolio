import test from 'node:test';
import assert from 'node:assert/strict';
import {getCreativeOrbitLayout} from '../src/scripts/creative-orbit.mjs';

test('desktop service planets follow bounded elliptical paths through the scroll turn',()=>{
  for(const [width,height] of [[1024,850],[1280,740],[1440,784],[1920,900]]){
    const rx=Math.min(width*.34,480),ry=Math.min(height*.31,250);
    for(let turn=0;turn<=118;turn+=2){
      const points=getCreativeOrbitLayout(width,height,turn);
      assert.equal(points.length,3);
      for(const point of points){
        assert.ok(Number.isFinite(point.rotation));
        assert.ok(Math.abs((point.x/rx)**2+(point.y/ry)**2-1)<1e-10);
        assert.ok(width/2-Math.abs(point.x)>84,'Cards remain inside the horizontal viewport.');
        assert.ok(height*.44+point.y>80,'Card centres leave room for their top edges.');
        assert.ok(height*.44+point.y<height-90,'Cards leave room above the bottom ribbon.');
      }
    }
  }
});

test('phone planets retain their reading order in a separate band below the headline',()=>{
  for(const width of [320,375,390,600,800]){
    const start=getCreativeOrbitLayout(width,820,0);
    for(const turn of [0,30,75,118]){
      const points=getCreativeOrbitLayout(width,820,turn);
      points.forEach((point,i)=>{
        assert.equal(point.x,start[i].x,'Mobile cards never sweep across the headline.');
        assert.equal(point.x,0,'CSS grid owns the mobile columns, with no competing horizontal transforms.');
        assert.ok(Math.abs(point.y)<=3);
        assert.ok(Math.abs(point.rotation)<=1.5);
      });
    }
  }
});
