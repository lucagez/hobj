/**
 * Testing before/after hook functionality.
 */

import test from 'ava';

const esm = require('esm')({});

const { wrapper } = esm(`${__dirname}/../src/utils.mjs`);


// Creating a fake context to be used as `this` from wrapper function.
// Emulating megaobj behavior.

// Storing the timestamps to ensure correct timing
let testStr = '';

const beforeQ = new Map([
  ['get', [
    () => testStr += 'before/',
  ]],
]);

const afterQ = new Map([
  ['get', [
    () => testStr += 'after',
  ]],
]);


const context = {
  beforeQ,
  afterQ,
  _get: () => testStr += 'middle/',
};

const method = wrapper('get').bind(context);

test.serial('End result is coherent with timing', (t) => {
  method();
  return new Promise((resolve) => {
    setTimeout(() => {
      t.is(testStr, 'before/middle/after');
      resolve();
    }, 10);
  });
});
