import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseServiceRoute,serviceForShowcase} from '../src/scripts/service-navigation.mjs';

test('service links restore the selected category and the intended destination',()=>{
  assert.deepEqual(parseServiceRoute('#playground-food'),{service:'food',section:'playground'});
  assert.deepEqual(parseServiceRoute('#pricing-resumes'),{service:'resumes',section:'pricing'});
  assert.deepEqual(parseServiceRoute('#pricing-websites'),{service:'websites',section:'pricing'});
  for(const hash of ['#pricing-pro','#playground-unknown','#pricing','#services',''])assert.equal(parseServiceRoute(hash),null);
});
test('all three website showcase tiers select website services',()=>{
  for(const id of ['websites','business','pro'])assert.equal(serviceForShowcase(id),'websites');
  assert.equal(serviceForShowcase('resumes'),'resumes');
  assert.equal(serviceForShowcase('food'),'food');
  assert.equal(serviceForShowcase('unknown'),null);
});
