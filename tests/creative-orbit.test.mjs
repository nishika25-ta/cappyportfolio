import test from 'node:test';
import assert from 'node:assert/strict';
import {getCreativeOrbitLayout} from '../src/scripts/creative-orbit.mjs';

test('desktop stickers stay in reading positions clear of the heading and viewport edges',()=>{
  for(const [width,height] of [[1024,850],[1280,740],[1440,784],[1920,900]]){
    const initial=getCreativeOrbitLayout(width,height,0);
    for(let turn=0;turn<=118;turn+=2){
      const points=getCreativeOrbitLayout(width,height,turn);
      assert.equal(points.length,3);
      points.forEach((point,i)=>{
        assert.ok(Number.isFinite(point.rotation));
        assert.equal(point.x,initial[i].x,'Stickers never travel across the central mascot.');
        assert.equal(point.y,initial[i].y,'Stickers keep their reading position during scrolling.');
        assert.ok(Math.abs(point.rotation-initial[i].rotation)<=2);
        assert.ok(width/2+point.x-110>40);
        assert.ok(width/2+point.x+110<width-40);
        assert.ok(height*.45+point.y-65>height*.3,'Stickers clear the headline.');
        assert.ok(height*.45+point.y+65<height-40,'Stickers clear the footer.');
      });
    }
  }
});

test('phone stickers keep their reading positions while gently rocking',()=>{
  for(const width of [320,375,390,600,800]){
    const start=getCreativeOrbitLayout(width,820,0);
    for(const turn of [0,30,75,118]){
      const points=getCreativeOrbitLayout(width,820,turn);
      points.forEach((point,i)=>{
        assert.equal(point.x,start[i].x,'Mobile cards never sweep across the headline.');
        assert.equal(point.x,0,'CSS owns the mobile sticker placement without competing horizontal transforms.');
        assert.ok(Math.abs(point.y)<=3);
        assert.ok(Math.abs(point.rotation)<=1.5);
      });
    }
  }
});
