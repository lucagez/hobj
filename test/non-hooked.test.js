/**
 * Testing non-hooked methods behavior
 */

import test from 'ava';
import MegaObj from '../dist/megaobj';

const m = new MegaObj();

let executedBefore = false;
let executedAfter = false;

const nonHooked = [
  '_get',
  '_set',
  '_has',
  '_delete',
];

// Hooking before/after every possible method
nonHooked
  .forEach((method) => {
    m.before(method, () => executedBefore = true);
    m.after(method, () => executedAfter = true);
  });

test('Should run no before hooks when invoking non-hooked', (t) => {
  nonHooked
    .forEach(method => m[method]('test', 'test'));
  t.assert(executedBefore === false);
});

test('Should run no after hooks when invoking non-hooked', (t) => {
  nonHooked
    .forEach(method => m[method]('test', 'test'));
  return new Promise((resolve) => {
    setTimeout(() => {
      t.assert(executedAfter === false);
      resolve();
    }, 10);
  });
});
