import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getEnergyState} from '../src/scripts/energy-state.mjs';

test('the slider label and cat personality share the same state boundaries',()=>{
  for(const value of [0,27])assert.equal(getEnergyState(value).mood,'calm');
  for(const value of [28,55,79])assert.equal(getEnergyState(value).mood,'playful');
  for(const value of [80,100])assert.equal(getEnergyState(value).mood,'wild');
  assert.equal(getEnergyState(0).label,'Quietly clever');
  assert.equal(getEnergyState(55).label,'Feeling playful');
  assert.equal(getEnergyState(100).label,'Full purr-sonality');
});
