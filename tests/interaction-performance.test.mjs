import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFrameCoalescer } from '../src/scripts/frame-coalescer.mjs';

test('slider work is coalesced to one update per animation frame', () => {
  const frames = new Map();
  let nextId = 0;
  globalThis.requestAnimationFrame = callback => {
    const id = ++nextId;
    frames.set(id, callback);
    return id;
  };
  globalThis.cancelAnimationFrame = id => frames.delete(id);

  let updates = 0;
  const update = createFrameCoalescer(() => updates++);
  update.schedule();
  update.schedule();
  update.schedule();
  assert.equal(frames.size, 1);
  assert.equal(updates, 0);

  const [id, callback] = frames.entries().next().value;
  frames.delete(id);
  callback(16);
  assert.equal(updates, 1);

  update.schedule();
  update.cancel();
  assert.equal(frames.size, 0);
  assert.equal(updates, 1);
  delete globalThis.requestAnimationFrame;
  delete globalThis.cancelAnimationFrame;
});
