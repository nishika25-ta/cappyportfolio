import { test } from 'node:test';
import assert from 'node:assert/strict';
import { services, enquiryUrl } from '../src/data/site.mjs';

test('all advertised packages retain the supplied Malaysian ringgit prices', () => {
  assert.deepEqual(services.flatMap(s => s.packages.map(p => [p.name, p.price])), [
    ['Kitty Starter',129],['Mochi Business',299],['Tora Pro',599],
    ['Purr-folio Starter',149],['Whisker Creator',249],['Neko Signature',449],
    ['Kitten Fix',19],['Paw Career',49],['Meow Pro',89],
    ['Kitten Touch-Up',15],['Meow Makeover',39],['Big Cat Bundle',79]
  ]);
});
test('package enquiries open the supplied number with a readable, correctly encoded message', () => {
  const url = new URL(enquiryUrl('Mochi Business',299));
  assert.equal(url.hostname,'wa.me');
  assert.equal(url.pathname,'/60178478597');
  assert.match(url.searchParams.get('text'),/Mochi Business.*RM299/);
});
