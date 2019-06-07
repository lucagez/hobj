/**
 * Testing before/after hook functionality.
 */

import test from 'ava';

const esm = require('esm')({});

const { wrapper } = esm(`${__dirname}/../src/utils.mjs`);


// Creating a fake context to be used as `this` from wrapper function.
// Emulating megaobj behavior.

// Storing the timestamps to ensure correct timing
const time = new Map([
  ['before', []],
  ['after', []],
]);

const setTime = (store, when) => store.set(when, [...store.get(when), Date.now()]);

const beforeQ = new Map([
  ['get', [
    () => setTime(time, 'before'),
    () => setTime(time, 'before'),
    () => setTime(time, 'before'),
    () => setTime(time, 'before'),
  ]],
]);

const afterQ = new Map([
  ['get', [
    () => setTime(time, 'after'),
    () => setTime(time, 'after'),
    () => setTime(time, 'after'),
    () => setTime(time, 'after'),
  ]],
]);


const context = {
  beforeQ,
  afterQ,
  _get: () => time.set('middle', Date.now()),
};

const method = wrapper('get').bind(context);

test.serial('Ensure correct timing execution before/middle/after', (t) => {
  method();
  return new Promise((resolve) => {
    setTimeout(() => {
      const before = time.get('before')[0];
      const middle = time.get('middle');
      const after = time.get('after')[0];
      t.assert(before <= middle);
      t.assert(after >= middle);
      resolve();
    }, 10);
  });
});
